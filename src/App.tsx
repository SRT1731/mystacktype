import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthModal } from './components/AuthModal';
import { EmailCaptureForm } from './components/EmailCaptureForm';
import { QuizExperience } from './components/QuizExperience';
import { useAuth } from './contexts/AuthContext';
import { trackQuizEvent } from './lib/analytics';

const heroVisual = '/assets/keepline-hero-v2.webp';
const ribbonVisual = '/assets/keepline-ribbon-v2.webp';
const resultVisual = '/assets/keepline-dashboard-v2.webp';
const newsletterVisual = '/assets/keepline-newsletter-v2.webp';

const resultFeatures = [
  ['1', '내 타입', '지금 내가 어떤 상태인지'],
  ['2', '요요 위험 점수', '0~100으로 한눈에'],
  ['3', '약한 부분', '어디부터 무너지는지 그래프로'],
  ['4', '물어볼 질문', '진료 때 그대로 쓰는 질문 3개'],
];

const plans = [
  {
    tier: '무료 점검',
    amount: '0원',
    desc: '먼저 내 상태부터 확인해요.',
    items: ['위험 타입', '요요 위험 점수', '약점 그래프', '물어볼 질문 3개'],
    action: '무료로 점검하기',
    free: true,
  },
  {
    tier: '창립 멤버',
    amount: '8,900원',
    priceLabel: '출시 예정가',
    desc: '출시 때 창립 멤버가로 먼저 열어드려요.',
    items: ['창립 멤버가 고정', '유지 체크포인트', '진료 질문 정리', '안 나오면 전액 환불'],
    action: '창립 멤버 대기명단 올리기',
    tierId: 'member' as const,
    featured: true,
  },
  {
    tier: '파운더',
    amount: '14,900원',
    priceLabel: '출시 예정가',
    desc: '내 피드백까지 반영돼요.',
    items: ['얼리버드 혜택 전부', '초기 1:1 피드백 반영', '근육 사수 가이드 우선', '안 나오면 전액 환불'],
    action: '파운더 대기명단 올리기',
    tierId: 'founder' as const,
  },
];

function KeepLineLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg className={compact ? 'h-7 w-7' : 'h-8 w-8'} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M12 8 C4 14, 8 30, 20 30 C32 30, 36 14, 28 8 C22 4, 16 20, 22 24"
          stroke="url(#keepline-logo-gradient)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="keepline-logo-gradient" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#DBA99D" />
            <stop offset="1" stopColor="#B76E79" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`${compact ? 'text-[19px]' : 'text-[21px]'} font-semibold text-[#7f5048]`}
        style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
      >
        KeepLine
      </span>
    </div>
  );
}

export default function App() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();

  const openQuiz = useCallback(() => {
    trackQuizEvent({ type: 'check_start' });
    setQuizOpen(true);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#fbf7f3] text-[#40382f]"
      style={{
        fontFamily: '"Noto Sans KR", "Apple SD Gothic Neo", system-ui, sans-serif',
        wordBreak: 'keep-all',
        overflowWrap: 'break-word',
      }}
    >
      <nav className="sticky top-0 z-50 border-b border-[#b76e79]/20 bg-[#fbf7f3]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between px-6">
          <a href="#" aria-label="KeepLine home">
            <KeepLineLogo />
          </a>
          <div className="flex items-center gap-4">
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="hidden text-[14px] font-medium text-[#9c8b82] transition hover:text-[#a5645a] sm:inline-flex"
              >
                로그아웃
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden text-[14px] font-medium text-[#9c8b82] transition hover:text-[#a5645a] sm:inline-flex"
              >
                로그인
              </button>
            )}
            <button
              type="button"
              onClick={openQuiz}
              className="rounded-full bg-gradient-to-br from-[#dba99d] to-[#b76e79] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(183,110,121,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(183,110,121,0.36)]"
            >
              무료 점검
            </button>
          </div>
        </div>
      </nav>

      {quizOpen ? <QuizExperience onClose={() => setQuizOpen(false)} /> : null}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <main>
        <header className="px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.86fr_1.14fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#be7c70]">
                60초 무료 자가 점검
              </span>
              <h1
                className="mt-5 text-[42px] font-bold leading-[1.28] tracking-[-0.01em] text-[#40382f] sm:text-[52px]"
                style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
              >
                애써 뺀 몸,
                <br />
                끊어도 그대로일까요?
              </h1>
              <p className="mt-6 max-w-[440px] text-[17px] leading-[1.8] text-[#6b5f56]">
                마운자로·위고비로 만든 라인과 탄력, 끊은 뒤에도 지키는 법. 60초면 내 요요 위험부터 확인해요.
              </p>
              <button
                type="button"
                onClick={openQuiz}
                className="mt-8 rounded-full bg-gradient-to-br from-[#dba99d] to-[#b76e79] px-8 py-4 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(183,110,121,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(183,110,121,0.36)]"
              >
                무료로 점검하기
              </button>
              <p className="mt-6 text-[13px] text-[#9c8b82]">
                예: 리바운드 경계형 · <b className="text-[#be7c70]">요요 위험 78</b>
              </p>
            </motion.div>

            <motion.div
              className="overflow-hidden rounded-[26px] bg-[#f5e6e0] shadow-[0_24px_60px_rgba(159,110,100,0.22)]"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.08 }}
            >
              <img
                src={heroVisual}
                alt="크림색 침구 위에 놓인 스마트폰, 물컵, 핑크색 줄자"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </header>

        <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-[#f5e6e0] text-center">
          <img
            src={ribbonVisual}
            alt="크림빛 배경 위로 길게 흐르는 핑크 실크 리본"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-[#faf4f0]/35" />
          <div className="relative z-10 px-6 py-16">
            <h2
              className="text-[27px] font-semibold leading-[1.5] text-[#5a4b45] drop-shadow-[0_2px_20px_rgba(251,247,243,0.9)] sm:text-[34px]"
              style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
            >
              끊고 나서야 보여요.
              <br />
              빠진 게 지방만이 아니었다는 걸.
            </h2>
          </div>
        </section>

        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#be7c70]">
                무료 점검 결과
              </span>
              <h2
                className="mt-4 text-[32px] font-bold leading-[1.35] text-[#40382f] sm:text-[38px]"
                style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
              >
                점검하면,
                <br />
                이게 나와요
              </h2>
              <div className="mt-7 flex flex-col gap-4">
                {resultFeatures.map(([num, title, text]) => (
                  <div key={num} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5e6e0] text-[14px] font-bold text-[#be7c70]">
                      {num}
                    </span>
                    <span>
                      <b className="block text-[16px] font-semibold text-[#40382f]">{title}</b>
                      <span className="text-[14px] text-[#9c8b82]">{text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-[22px] border border-[#b76e79]/20 shadow-[0_20px_50px_rgba(159,110,100,0.18)]">
              <img
                src={resultVisual}
                alt="핑크 톤의 점검 대시보드가 표시된 태블릿 화면"
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white to-[#fbf7f3] px-6 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#be7c70]">
                킵라인 레터
              </span>
              <h2
                className="mt-4 text-[32px] font-bold leading-[1.35] text-[#40382f] sm:text-[38px]"
                style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
              >
                빼는 법 말고,
                <br />
                지키는 법만 보냅니다.
              </h2>
              <p className="mt-5 max-w-[500px] text-[15px] leading-[1.9] text-[#6b5f56]">
                주 1회 — 식욕이 돌아오는 신호, 요요를 부르는 습관, 끊은 뒤에도 라인을 지킨 사람들의 루틴.
              </p>
              <div className="mt-7 max-w-[520px]">
                <EmailCaptureForm
                  mode="newsletter"
                  source="landing_newsletter"
                  buttonLabel="무료로 받아보기"
                  caption="스팸 없음 · 원클릭 구독 해지"
                  successMessage="등록됐어요. 다음 레터부터 보내드릴게요."
                  compact
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-[22px] bg-[#f5e6e0] shadow-[0_20px_50px_rgba(159,110,100,0.18)]">
              <img
                src={newsletterVisual}
                alt="따뜻한 햇살 아래 노트북을 보며 컵을 든 사람"
                loading="lazy"
                className="aspect-[3/2] h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-20 text-center sm:py-24">
          <div className="mx-auto max-w-6xl">
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#be7c70]">
              출시 대기명단
            </span>
            <h2
              className="mt-3 text-[32px] font-bold leading-tight text-[#40382f] sm:text-[38px]"
              style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
            >
              결제는 아직 안 받아요.
              <br />
              자리만 잡아두세요.
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-[1.8] text-[#6b5f56]">
              킵라인 코치는 준비 중입니다. 지금 대기명단에 올리면 출시 때 창립 멤버 가격이 그대로 고정됩니다.
            </p>

            <div className="mt-12 grid items-stretch gap-6 text-left md:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.tier}
                  className={`relative flex flex-col rounded-[22px] bg-white p-7 shadow-sm ${
                    plan.featured
                      ? '-translate-y-0 border-2 border-[#b76e79] shadow-[0_26px_60px_rgba(183,110,121,0.2)] md:-translate-y-3'
                      : 'border border-[#b76e79]/20'
                  }`}
                >
                  {plan.featured ? (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#dba99d] to-[#b76e79] px-5 py-2 text-[12px] font-semibold text-white">
                      먼저 열리는 자리
                    </span>
                  ) : null}
                  <p className="text-[14px] text-[#9c8b82]">{plan.tier}</p>
                  {plan.priceLabel ? (
                    <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#be7c70]">
                      {plan.priceLabel}
                    </p>
                  ) : null}
                  <p
                    className={plan.priceLabel ? 'mt-1 text-[32px] font-bold text-[#40382f]' : 'mt-3 text-[32px] font-bold text-[#40382f]'}
                    style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
                  >
                    {plan.amount}
                  </p>
                  <p className="mt-2 min-h-10 text-[14px] leading-relaxed text-[#6b5f56]">
                    {plan.desc}
                  </p>
                  <ul className="mt-5 flex-1 space-y-3">
                    {plan.items.map((item) => (
                      <li key={item} className="relative pl-7 text-[14px] text-[#5a4f47]">
                        <span className="absolute left-0 font-bold text-[#be7c70]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    {plan.free ? (
                      <button
                        type="button"
                        onClick={openQuiz}
                        className="h-[52px] w-full rounded-full border border-[#b76e79]/30 text-[15px] font-semibold text-[#be7c70] transition hover:bg-[#fbf7f3]"
                      >
                        {plan.action}
                      </button>
                    ) : (
                      <EmailCaptureForm
                        mode="waitlist"
                        source={`pricing_${plan.tierId}`}
                        tier={plan.tierId}
                        buttonLabel={plan.action}
                        caption="출시 전까지 결제 없음 · 출시 알림만 보내드려요"
                        successMessage="등록됐어요. 출시 때 창립 멤버 가격으로 먼저 알려드릴게요."
                      />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5ede7] px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-[640px] text-center">
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#be7c70]">
              왜 만들었냐면요
            </span>
            <div
              className="mt-5 space-y-5 text-[24px] font-semibold leading-[1.65] text-[#40382f] sm:text-[29px]"
              style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
            >
              <p>
                저도 마운자로를 썼고, 끊었고,
                <br />
                지금 체중이 돌아오는 걸 직접 겪고 있습니다.
              </p>
              <p>
                빼는 법은 유튜브에 수천 개가 있는데
                <br />
                “끊은 다음”에 대한 이야기는 이상할 만큼 없더군요.
              </p>
              <p>
                킵라인은 그 “이후”를 위해 만들고 있습니다.
              </p>
            </div>
            <p className="mx-auto mt-7 max-w-[520px] text-[15px] leading-[1.9] text-[#6b5f56]">
              같은 불안을 겪고 있다면, 점검부터 해보세요.
            </p>
            <p className="mt-6 text-[14px] font-semibold text-[#be7c70]">— 킵라인 만드는 사람</p>
          </div>
        </section>
      </main>

      <footer className="overflow-hidden">
        <div className="h-[260px]">
          <img
            src={heroVisual}
            alt="크림색 침구 위에 놓인 스마트폰과 핑크색 줄자"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="bg-[#fbf7f3] px-6 py-11">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-3">
            <KeepLineLogo compact />
            <p
              className="text-[20px] text-[#be7c70]"
              style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
            >
              애써 만든 라인, 그대로.
            </p>
            <p className="max-w-[720px] text-[12.5px] leading-[1.8] text-[#9c8b82]">
              본 점검은 교육용 참고 정보이며 의학적 진단·치료·처방을 대신하지 않습니다.
              GLP-1(마운자로·위고비 등)은 전문의약품이며, 복용·용량·중단은 반드시 담당 의사와 상의하세요.
              킵라인은 의료기관이 아니며, 점검 결과는 생활관리 참고용입니다.
            </p>
            <p className="mt-1 text-[12px] text-[#9c8b82]">
              © 2026 KeepLine · 문의: keepline1717@gmail.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
