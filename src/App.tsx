import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import PayPalCheckoutButton from './components/payment/PayPalCheckoutButton';
import TossCheckoutButton from './components/payment/TossCheckoutButton';
import { AuthModal } from './components/AuthModal';
import { QuizExperience } from './components/QuizExperience';
import { useAuth } from './contexts/AuthContext';
import { createOrder } from './lib/firestore';
import { PRODUCTS } from './lib/paypal';
import { TOSS_PRODUCTS } from './lib/toss';

const heroVisual = '/assets/keepline-hero.png';
const agitationVisual = '/assets/keepline-agitation.png';
const resultVisual = '/assets/keepline-result-dashboard.png';
const coachVisual = '/assets/keepline-coach.png';
const pricingVisual = '/assets/keepline-pricing.png';

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
    label: '얼리버드 사전예약',
    amount: '8,900원',
    desc: '출시 때 창립 멤버가로 먼저 열어드려요.',
    items: ['창립 멤버가 고정', '유지 체크포인트', '진료 질문 정리', '안 나오면 전액 환불'],
    action: '사전예약',
    featured: true,
  },
  {
    tier: '파운더 사전예약',
    amount: '14,900원',
    desc: '내 피드백까지 반영돼요.',
    items: ['얼리버드 혜택 전부', '초기 1:1 피드백 반영', '근육 사수 가이드 우선', '안 나오면 전액 환불'],
    action: '사전예약',
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

  const openQuiz = useCallback(() => setQuizOpen(true), []);

  const handlePayPalSuccess = useCallback(
    async (details: any, productId: string, productName: string, amount: string) => {
      const orderId = details.id || `pp_${Date.now()}`;
      try {
        await createOrder({
          id: orderId,
          userId: user?.uid || 'anonymous',
          productId,
          productName,
          amount: parseFloat(amount),
          currency: PRODUCTS.find((product) => product.id === productId)?.currency || 'KRW',
          status: 'completed',
          paypalOrderId: orderId,
          paypalPayerId: details.payer?.payer_id || '',
        });
        alert('사전예약이 완료됐어요. 출시되면 가장 먼저 알려드릴게요.');
      } catch (err) {
        console.error('[Firestore] Failed to save order:', err);
        alert(`결제는 완료됐지만 기록 저장에 실패했습니다. Order: ${orderId}`);
      }
    },
    [user]
  );

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
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
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
              <img src={heroVisual} alt="" className="aspect-[16/9] h-full w-full object-cover" />
            </motion.div>
          </div>
        </header>

        <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-[#f5e6e0] text-center">
          <img src={agitationVisual} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
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
              <img src={resultVisual} alt="" className="w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white to-[#fbf7f3] px-6 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[22px] bg-[#f5e6e0] shadow-[0_20px_50px_rgba(159,110,100,0.18)]">
              <img src={coachVisual} alt="" className="aspect-[4/3] h-full w-full object-cover" />
            </div>
            <div>
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#be7c70]">
                Early Access
              </span>
              <h2
                className="mt-4 text-[31px] font-bold leading-[1.35] text-[#40382f] sm:text-[36px]"
                style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
              >
                약을 끊어도, 그대로.
                <small className="mt-2 block text-[18px] font-medium text-[#be7c70]">
                  킵라인 코치, 준비 중
                </small>
              </h2>
              <p className="mt-5 max-w-[420px] text-[15px] leading-[1.9] text-[#6b5f56]">
                위험 축, 물어볼 질문, 유지 체크포인트를 한 곳에. 지금은 예약만 받아요 — 안 나오면 전액 환불.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-20 text-center sm:py-24">
          <div className="mx-auto max-w-6xl">
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#be7c70]">
              사전예약
            </span>
            <h2
              className="mt-3 text-[32px] font-bold leading-tight text-[#40382f] sm:text-[38px]"
              style={{ fontFamily: '"Noto Serif KR", Georgia, serif' }}
            >
              출시 전, 가장 낮은 가격으로.
            </h2>
            <p className="mt-3 text-[15px] text-[#6b5f56]">
              무료 점검만 보고 가도 돼요. 마음에 들면 예약하세요.
            </p>
            <p className="mt-2 text-[13px] text-[#be7c70]">
              킵라인 코치는 창립 멤버 선착순 · 출시 전 예약자만 혜택 고정
            </p>

            <div className="mt-10 overflow-hidden rounded-[26px] border border-[#b76e79]/20 shadow-[0_20px_50px_rgba(159,110,100,0.12)]">
              <img src={pricingVisual} alt="" className="max-h-[320px] w-full object-cover" />
            </div>

            <div className="mt-12 grid items-stretch gap-6 text-left md:grid-cols-3">
              {plans.map((plan, index) => (
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
                      {plan.label}
                    </span>
                  ) : null}
                  <p className="text-[14px] text-[#9c8b82]">{plan.tier}</p>
                  <p
                    className="mt-3 text-[32px] font-bold text-[#40382f]"
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
                    ) : index === 1 ? (
                      <div className="space-y-3">
                        <PayPalCheckoutButton
                          product={PRODUCTS[0]}
                          onSuccess={(details) =>
                            handlePayPalSuccess(details, PRODUCTS[0].id, PRODUCTS[0].name, PRODUCTS[0].price)
                          }
                          onError={(err) => console.error('PayPal error:', err)}
                        />
                        <TossCheckoutButton
                          product={TOSS_PRODUCTS[0]}
                          onError={(err) => console.error('Toss error:', err)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <PayPalCheckoutButton
                          product={PRODUCTS[1]}
                          onSuccess={(details) =>
                            handlePayPalSuccess(details, PRODUCTS[1].id, PRODUCTS[1].name, PRODUCTS[1].price)
                          }
                          onError={(err) => console.error('PayPal error:', err)}
                        />
                        <TossCheckoutButton
                          product={TOSS_PRODUCTS[1]}
                          onError={(err) => console.error('Toss error:', err)}
                        />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="overflow-hidden">
        <div className="h-[260px]">
          <img src={heroVisual} alt="" className="h-full w-full object-cover" />
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
            <p className="max-w-[640px] text-[12.5px] leading-[1.8] text-[#9c8b82]">
              본 점검은 교육용 정보이며 의학적 진단·처방을 대신하지 않습니다. GLP-1은 전문의약품이며,
              복용·용량·중단은 반드시 담당 의사와 상의하세요.
            </p>
            <p className="mt-1 text-[12px] text-[#9c8b82]">© 2026 KeepLine</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
