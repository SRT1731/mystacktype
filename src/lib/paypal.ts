// ============================================================
// PayPal Configuration — @paypal/react-paypal-js 기반
// ============================================================
// 
// 설정 방법:
// 1. https://developer.paypal.com/dashboard 에서 앱 생성
// 2. Client ID를 .env 파일에 넣기:
//    VITE_PAYPAL_CLIENT_ID=실제_클라이언트_ID
// 3. 프로덕션: VITE_PAYPAL_CLIENT_ID에 Live Client ID 사용
//
// ============================================================

export const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
  currency: 'KRW',
  intent: 'capture' as const,
};

// ── 상품 타입 정의 ──

export interface PayPalProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
}

// ── 구독 플랜 타입 정의 ──

export interface PayPalSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  planId: string; // PayPal에서 생성한 구독 Plan ID
  price: string;
  currency: string;
  interval: 'MONTH' | 'YEAR';
}

// ── 예시 상품 목록 — 여기를 수정하세요 ──

export const PRODUCTS: PayPalProduct[] = [
  {
    id: 'glp1-maintenance-coach-early-bird',
    name: '창립 멤버 사전예약',
    description: '창립 멤버 우선 오픈. 안 나오면 전액 환불.',
    price: '8900',
    currency: 'KRW',
  },
  {
    id: 'glp1-maintenance-coach-founder',
    name: '파운더 사전예약',
    description: '위 혜택 전부와 초기 피드백 반영. 안 나오면 전액 환불.',
    price: '14900',
    currency: 'KRW',
  },
];

// ── 예시 구독 플랜 — 여기를 수정하세요 ──

export const SUBSCRIPTION_PLANS: PayPalSubscriptionPlan[] = [
  {
    id: 'glp1-maintenance-coach-monthly',
    name: '근지킴 월간 플랜',
    description: '근지킴 유지 관리 도구 월간 이용권',
    planId: 'YOUR_PAYPAL_PLAN_ID', // PayPal에서 생성한 구독 플랜 ID
    price: '14900',
    currency: 'KRW',
    interval: 'MONTH',
  },
  {
    id: 'glp1-maintenance-coach-yearly',
    name: '근지킴 연간 플랜',
    description: '근지킴 유지 관리 도구 연간 이용권',
    planId: 'YOUR_PAYPAL_YEARLY_PLAN_ID',
    price: '89000',
    currency: 'KRW',
    interval: 'YEAR',
  },
];
