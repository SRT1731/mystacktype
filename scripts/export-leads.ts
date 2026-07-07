// ============================================================
// Firestore 구독자 → 스티비(Stibee) 업로드용 CSV 내보내기
// ============================================================
// 운영자가 주 1회 로컬에서 실행해 구독자 리드를 CSV로 뽑는 스크립트.
//   npm run export:leads
//
// 출력: exports/newsletter-leads-YYYY-MM-DD.csv
//       exports/waitlist-leads-YYYY-MM-DD.csv (대기명단 리드가 있을 때)
//
// - .env 의 VITE_FIREBASE_* 값을 사용해 Firebase에 연결 (vite loadEnv).
// - 앱과 동일하게 별도 인증 없이 읽기를 시도하며, 권한 오류 시 한국어 안내 출력.
// - 중복 이메일은 최초 구독 시점 기준 1건만 남김.
// - CSV는 UTF-8 BOM 포함(엑셀·스티비 한글 호환), 쉼표/따옴표 이스케이프 처리.
// ============================================================

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  terminate,
  Timestamp,
  type Firestore,
} from 'firebase/firestore';

// ── 컬렉션 이름 (src/lib/firestore.ts 의 COLLECTIONS 와 동일) ──
const NEWSLETTER_COLLECTION = 'newsletter';
const WAITLIST_COLLECTION = 'waitlist';

// ── 내보낼 컬렉션별 CSV 컬럼 정의 ──
// key: Firestore 문서 필드명, header: CSV 헤더명
interface ColumnSpec {
  key: string;
  header: string;
}

const NEWSLETTER_COLUMNS: ColumnSpec[] = [
  { key: 'email', header: 'email' },
  { key: 'subscribed_at', header: 'subscribed_at' },
  { key: 'source', header: 'source' },
  { key: 'tag', header: 'tag' },
];

const WAITLIST_COLUMNS: ColumnSpec[] = [
  { key: 'email', header: 'email' },
  { key: 'subscribed_at', header: 'subscribed_at' },
  { key: 'source', header: 'source' },
  { key: 'tier', header: 'tier' },
  { key: 'tag', header: 'tag' },
];

// ── Firebase 초기화 (.env 의 VITE_FIREBASE_* 사용) ──
function initFirestore(): Firestore {
  const env = loadEnv('production', process.cwd(), 'VITE_');

  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };

  if (!firebaseConfig.projectId || firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
    console.error('❌ Firebase 설정을 찾을 수 없습니다.');
    console.error('   .env 파일에 VITE_FIREBASE_* 값이 실제 프로젝트 값으로 채워져 있는지 확인하세요.');
    console.error('   (.env.example 을 참고해 cp .env.example .env 후 값 입력)');
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}

// ── createdAt(Timestamp) → ISO 문자열 ──
function toIso(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  // 혹시 모를 다른 형태 방어 처리
  if (value && typeof value === 'object' && 'seconds' in (value as any)) {
    const seconds = (value as any).seconds;
    if (typeof seconds === 'number') {
      return new Date(seconds * 1000).toISOString();
    }
  }
  if (typeof value === 'string') {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return '';
}

// ── CSV 필드 이스케이프 (쉼표·따옴표·줄바꿈) ──
function escapeCsv(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

interface LeadRow {
  email: string;
  subscribed_at: string; // ISO
  sortKey: number; // 중복 제거 시 최초 시점 비교용 (ms). 알 수 없으면 0.
  [key: string]: unknown;
}

// 백엔드에 닿지 못하고 로컬 캐시(빈 값)로 폴백됐을 때 던지는 신호
class OfflineFallbackError extends Error {
  constructor(collectionName: string) {
    super(`'${collectionName}' 컬렉션을 서버에서 읽지 못하고 로컬 캐시로 폴백했습니다.`);
    this.name = 'OfflineFallbackError';
  }
}

// ── 한 컬렉션을 읽어 정규화된 행 목록으로 변환 ──
async function fetchCollection(
  db: Firestore,
  collectionName: string
): Promise<LeadRow[]> {
  const snap = await getDocs(collection(db, collectionName));

  // getDocs 는 서버 연결에 실패해도 로컬 캐시(대개 빈 값)로 resolve 될 수 있다.
  // fromCache=true 면 서버 데이터를 못 받은 것이므로 결과를 신뢰할 수 없다.
  if (snap.metadata.fromCache) {
    throw new OfflineFallbackError(collectionName);
  }

  const rows: LeadRow[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
    if (!email) continue; // 이메일 없는 문서는 스킵

    const iso = toIso(data.createdAt);
    const sortKey = iso ? new Date(iso).getTime() : 0;

    rows.push({
      ...data,
      email,
      subscribed_at: iso,
      sortKey,
    });
  }

  return rows;
}

// ── 이메일 기준 중복 제거 (최초 구독 시점 유지) ──
function dedupe(rows: LeadRow[]): { unique: LeadRow[]; removed: number } {
  const byEmail = new Map<string, LeadRow>();

  for (const row of rows) {
    const existing = byEmail.get(row.email);
    if (!existing) {
      byEmail.set(row.email, row);
      continue;
    }
    // 더 이른 구독 시점을 유지. sortKey 0(시점 미상)은 기존 값을 우선.
    const existingKey = existing.sortKey || Number.POSITIVE_INFINITY;
    const rowKey = row.sortKey || Number.POSITIVE_INFINITY;
    if (rowKey < existingKey) {
      byEmail.set(row.email, row);
    }
  }

  const unique = Array.from(byEmail.values()).sort(
    (a, b) => (a.sortKey || 0) - (b.sortKey || 0)
  );
  return { unique, removed: rows.length - unique.length };
}

// ── 행 목록 → CSV 문자열 (UTF-8 BOM 포함) ──
function toCsv(rows: LeadRow[], columns: ColumnSpec[]): string {
  const BOM = '﻿';
  const header = columns.map((c) => escapeCsv(c.header)).join(',');
  const body = rows
    .map((row) => columns.map((c) => escapeCsv(row[c.key])).join(','))
    .join('\r\n');
  return BOM + header + (body ? '\r\n' + body : '') + '\r\n';
}

// ── Firestore 권한 오류 안내 ──
function printPermissionDeniedHelp(collectionName: string): void {
  console.error('');
  console.error(`⚠️  '${collectionName}' 컬렉션 읽기가 권한 규칙에 의해 거부되었습니다 (permission-denied).`);
  console.error('   현재 스크립트는 앱과 동일하게 별도 로그인 없이 읽기를 시도합니다.');
  console.error('   Firestore 보안 규칙이 읽기를 막고 있으면 아래 대체 방법으로 내보내세요:');
  console.error('');
  console.error('   [대체 방법 1] Firebase Console 에서 직접 내보내기');
  console.error('     1) Firebase Console > Firestore Database 접속');
  console.error(`     2) '${collectionName}' 컬렉션 선택`);
  console.error('     3) 문서를 확인하거나, 프로젝트 설정 > Firestore 내보내기(Export) 기능 사용');
  console.error('');
  console.error('   [대체 방법 2] 임시로 읽기 규칙 허용 (운영자 본인만, 내보낸 뒤 원복)');
  console.error(`     match /${collectionName}/{docId} { allow read: if true; }`);
  console.error('');
  console.error('   [대체 방법 3] 서비스 계정 키로 firebase-admin 사용 (규칙 우회, 별도 설정 필요)');
  console.error('');
}

// ── 서버 연결 실패(캐시 폴백) 안내 ──
function printOfflineHelp(collectionName: string): void {
  console.error('');
  console.error(`⚠️  '${collectionName}' 컬렉션을 서버에서 읽지 못했습니다 (백엔드 연결 실패 → 빈 로컬 캐시로 폴백).`);
  console.error('   0건으로 보이더라도 실제 데이터가 없는 것이 아닐 수 있어 CSV를 저장하지 않았습니다.');
  console.error('   아래를 확인하세요:');
  console.error('     1) 인터넷 연결 상태');
  console.error('     2) Firebase Console 에서 Cloud Firestore API 활성화 여부');
  console.error('        (프로젝트에서 Firestore Database 를 한 번도 만든 적 없으면 비활성 상태)');
  console.error('        https://console.cloud.google.com/apis/library/firestore.googleapis.com');
  console.error('     3) .env 의 VITE_FIREBASE_PROJECT_ID 가 올바른 프로젝트인지');
  console.error('   해결이 어렵다면 Firebase Console > Firestore 에서 컬렉션을 직접 내보내세요.');
  console.error('');
}

// ── 한 컬렉션 처리: 읽기 → 중복제거 → CSV 저장 ──
async function exportOne(
  db: Firestore,
  collectionName: string,
  columns: ColumnSpec[],
  filePrefix: string,
  dateStr: string,
  outDir: string
): Promise<{ ok: boolean; total: number; removed: number; path: string | null }> {
  let rows: LeadRow[];
  try {
    rows = await fetchCollection(db, collectionName);
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      printPermissionDeniedHelp(collectionName);
      return { ok: false, total: 0, removed: 0, path: null };
    }
    if (err instanceof OfflineFallbackError) {
      printOfflineHelp(collectionName);
      return { ok: false, total: 0, removed: 0, path: null };
    }
    throw err;
  }

  const { unique, removed } = dedupe(rows);
  const csv = toCsv(unique, columns);
  const outPath = resolve(outDir, `${filePrefix}-${dateStr}.csv`);
  writeFileSync(outPath, csv, 'utf8');

  return { ok: true, total: rows.length, removed, path: outPath };
}

// ── 메인 ──
async function main(): Promise<void> {
  const db = initFirestore();

  const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const outDir = resolve(process.cwd(), 'exports');
  mkdirSync(outDir, { recursive: true });

  console.log('📤 Firestore 구독자 → 스티비 CSV 내보내기 시작...\n');

  const newsletter = await exportOne(
    db,
    NEWSLETTER_COLLECTION,
    NEWSLETTER_COLUMNS,
    'newsletter-leads',
    dateStr,
    outDir
  );

  const waitlist = await exportOne(
    db,
    WAITLIST_COLLECTION,
    WAITLIST_COLUMNS,
    'waitlist-leads',
    dateStr,
    outDir
  );

  // ── 요약 출력 ──
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 내보내기 결과 요약');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (newsletter.ok) {
    const kept = newsletter.total - newsletter.removed;
    console.log(`뉴스레터(newsletter): 원본 ${newsletter.total}건 → 중복 ${newsletter.removed}건 제거 → ${kept}건 저장`);
    console.log(`  저장 경로: ${newsletter.path}`);
  } else {
    console.log('뉴스레터(newsletter): 읽기 실패 (위 안내 참고)');
  }

  if (waitlist.ok) {
    const kept = waitlist.total - waitlist.removed;
    if (waitlist.total === 0) {
      console.log('대기명단(waitlist): 리드 없음 → 빈 CSV 저장');
    } else {
      console.log(`대기명단(waitlist): 원본 ${waitlist.total}건 → 중복 ${waitlist.removed}건 제거 → ${kept}건 저장`);
    }
    console.log(`  저장 경로: ${waitlist.path}`);
  } else {
    console.log('대기명단(waitlist): 읽기 실패 (위 안내 참고)');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 완료. 위 CSV 파일을 스티비 주소록에 업로드하세요.');

  // 열린 Firestore 연결을 닫아 Node 프로세스가 매달리지 않게 한다.
  await terminate(db).catch(() => {});

  // permission-denied·연결 실패 등으로 하나라도 실패하면 비정상 종료 코드
  process.exit(newsletter.ok && waitlist.ok ? 0 : 1);
}

main().catch((err) => {
  console.error('❌ 내보내기 중 오류가 발생했습니다:', err?.message || err);
  process.exit(1);
});
