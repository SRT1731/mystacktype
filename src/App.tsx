import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import PayPalCheckoutButton from './components/payment/PayPalCheckoutButton';
import TossCheckoutButton from './components/payment/TossCheckoutButton';
import { QuizExperience } from './components/QuizExperience';
import { useAuth } from './contexts/AuthContext';
import { createOrder } from './lib/firestore';
import { PRODUCTS } from './lib/paypal';
import { TOSS_PRODUCTS } from './lib/toss';

const heroVisual = '/assets/lumiere-hero-visual.jpg';
const lifestyleVisual = '/assets/lumiere-lifestyle.jpg';

const softCards = [
  {
    title: '체중만 줄이고 근육은 손실',
    text: '기초대사량이 떨어져 요요가 쉽게 찾아와요.',
  },
  {
    title: '에너지와 컨디션 저하',
    text: '피로, 식은땀, 집중력 저하가 생길 수 있어요.',
  },
  {
    title: '지속이 어렵고 완주가 막막함',
    text: '내 몸에 맞지 않는 방식은 금방 지치고 포기하게 만들어요.',
  },
];

const statusItems = [
  ['체지방률', '28.5%', '주의'],
  ['근육량', '19.2kg', '보통'],
  ['기초대사량', '1,248kcal', '보통'],
  ['수면의 질', '62점', '낮음'],
];

const careItems = [
  {
    title: '건강한 체형 변화',
    text: '체중만 보지 않고 근육과 컨디션을 함께 확인합니다.',
  },
  {
    title: '지속 가능한 식습관',
    text: '내 라이프스타일에 맞는 식단, 운동 습관을 찾습니다.',
  },
  {
    title: '에너지와 컨디션 회복',
    text: '피로와 무기력감을 줄이는 체크포인트를 정리해요.',
  },
  {
    title: '전문가 1:1 코칭',
    text: '혼자 버티지 않도록 진료 때 물어볼 질문을 준비합니다.',
  },
];

const processSteps = [
  ['001', '현재 상태 확인 & 목표 설정', '10개 문항으로 지금 상태를 먼저 확인합니다.'],
  ['002', '맞춤 플랜 & 실행', '식단, 운동, 생활 루틴의 빈틈을 정리해요.'],
  ['003', '성과 분석 & 유지 관리', '감량 이후에도 흔들리지 않도록 체크합니다.'],
];

const plans = [
  {
    label: '무료 자가 점검',
    price: '무료',
    note: '먼저 내 상태 확인',
    benefits: ['60초 상태 점검', '위험 점수', '약점 그래프', '진료 질문'],
    action: '무료로 시작하기',
    free: true,
  },
  {
    label: '창립 멤버',
    price: '8,900원',
    note: '출시 전 가장 낮은 가격',
    benefits: ['창립 멤버 우선 오픈', '유지 체크포인트', '진료 질문 정리', '안 나오면 전액 환불'],
    action: '스탠더드로 시작하기',
    featured: true,
  },
  {
    label: '파운더',
    price: '14,900원',
    note: '피드백까지 반영',
    benefits: ['위 혜택 전부', '초기 1:1 피드백', '근육 사수 가이드 우선', '안 나오면 전액 환불'],
    action: '프리미엄으로 시작하기',
  },
];

export default function App() {
  const [quizOpen, setQuizOpen] = useState(false);
  const { user } = useAuth();

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
      className="min-h-screen bg-[#fffaf5] text-[#3e312c]"
      style={{
        fontFamily:
          '"Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif',
        wordBreak: 'keep-all',
        overflowWrap: 'break-word',
      }}
    >
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#eadbd2]/70 bg-[#fffaf5]/82 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#" className="leading-none">
            <span
              className="block text-[22px] font-semibold uppercase text-[#a46c55]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '0.06em' }}
            >
              근지킴
            </span>
            <span className="mt-1 block text-[10px] font-semibold text-[#a46c55]/75">
              KEEP MUSCLE
            </span>
          </a>
          <nav className="hidden items-center gap-10 text-[14px] font-semibold text-[#5a4a42] md:flex">
            <a href="#problem">프로그램</a>
            <a href="#process">코칭 과정</a>
            <a href="#outcome">성장 사례</a>
            <a href="#pricing">플랜</a>
          </nav>
          <button
            type="button"
            onClick={openQuiz}
            className="rounded-full bg-[#bd766e] px-5 py-3 text-[13px] font-bold text-white shadow-[0_14px_28px_rgba(189,118,110,0.22)] transition hover:bg-[#a9625d]"
          >
            무료 자가 점검
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_10%,#f8ded3_0%,transparent_34%),linear-gradient(115deg,#fff9f1_0%,#fff4ec_46%,#f7e8df_100%)] pt-28">
          <div className="mx-auto grid min-h-[760px] max-w-6xl items-center gap-10 px-5 pb-16 md:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="mb-6 text-[15px] font-semibold text-[#b06d5e]">
                체중은 줄었는데,
              </p>
              <h1
                className="text-[48px] font-medium leading-[1.18] text-[#3a2b27] sm:text-[64px] lg:text-[76px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", "Noto Serif KR", serif' }}
              >
                힘은 빠졌는데,
                <br />
                근육도 함께
                <br />
                무너졌나요?
              </h1>
              <p className="mt-8 max-w-md text-[16px] leading-[1.9] text-[#6f5c52]">
                근지킴은 GLP-1 사용 중 놓치기 쉬운 근손실 위험과 진료 때 물어볼 질문을 60초 안에 정리해 드립니다.
              </p>
              <button
                type="button"
                onClick={openQuiz}
                className="mt-9 rounded-full bg-[#bd766e] px-8 py-4 text-[15px] font-bold text-white shadow-[0_18px_36px_rgba(189,118,110,0.25)] transition hover:bg-[#a9625d]"
              >
                무료 자가 점검
              </button>
              <p className="mt-6 text-[13px] font-medium text-[#90796f]">
                10개 문항이면 충분합니다
              </p>
            </motion.div>

            <motion.div
              className="relative mx-auto w-full max-w-[560px]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="absolute -left-8 top-20 h-28 w-28 rounded-full bg-[#eac6b6]/60 blur-2xl" />
              <img
                src={heroVisual}
                alt=""
                className="relative z-10 w-full rounded-[34px] object-cover shadow-[0_28px_90px_rgba(108,72,56,0.18)]"
              />
            </motion.div>
          </div>
        </section>

        {quizOpen ? <QuizExperience onClose={() => setQuizOpen(false)} /> : null}

        <section id="problem" className="bg-[#fffaf5] px-5 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-[13px] font-bold text-[#b06d5e]">지금 몸이 보내는 신호</p>
              <h2
                className="text-[34px] font-medium leading-tight text-[#3a2b27] sm:text-[46px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", "Noto Serif KR", serif' }}
              >
                체중은 줄었는데,
                <br className="sm:hidden" /> 왜 여전히 어려울까요?
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {softCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-2xl border border-[#eadbd2] bg-white/72 p-8 text-center shadow-[0_18px_45px_rgba(97,61,45,0.06)]"
                >
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#d9aaa0] text-[24px] text-[#bd766e]">
                    +
                  </div>
                  <h3 className="text-[18px] font-bold text-[#4b3c35]">{card.title}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-[#7b6a61]">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#f8ede6] px-5 py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.78fr_1.22fr]">
            <div>
              <h2
                className="text-[34px] font-medium leading-tight text-[#3a2b27] sm:text-[44px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", "Noto Serif KR", serif' }}
              >
                먼저 내 상태를
                <br />
                정확히 확인해야 합니다.
              </h2>
              <p className="mt-6 max-w-sm text-[15px] leading-[1.9] text-[#6f5c52]">
                체중계 숫자보다 중요한 것은 지금 내 몸이 버틸 준비가 되어 있는지 확인하는 일입니다.
              </p>
              <button
                type="button"
                onClick={openQuiz}
                className="mt-8 rounded-full bg-[#bd766e] px-7 py-4 text-[14px] font-bold text-white shadow-[0_16px_32px_rgba(189,118,110,0.22)]"
              >
                자가 점검 시작하기
              </button>
            </div>
            <div className="relative rounded-[22px] bg-white/86 p-7 shadow-[0_28px_80px_rgba(112,76,62,0.14)]">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-[#4b3c35]">내 몸 상태 체크</h3>
                <span className="rounded-full bg-[#f3dfd7] px-3 py-1 text-[12px] font-bold text-[#a4635b]">
                  60초
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                {statusItems.map(([label, value, state]) => (
                  <div key={label} className="rounded-2xl border border-[#f0dfd7] bg-[#fffaf5] p-5">
                    <p className="text-[12px] font-semibold text-[#8a756b]">{label}</p>
                    <p className="mt-3 text-[26px] font-bold text-[#3a2b27]">{value}</p>
                    <p className="mt-2 text-[12px] font-bold text-[#bd766e]">{state}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[12px] text-[#90796f]">
                결과는 교육용 참고 정보이며 의학적 진단·처방을 대신하지 않습니다.
              </p>
            </div>
          </div>
        </section>

        <section id="outcome" className="bg-[#fffaf5] px-5 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-[13px] font-bold text-[#b06d5e]">자가 점검 후 달라지는 것</p>
              <h2
                className="text-[34px] font-medium leading-tight text-[#3a2b27] sm:text-[46px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", "Noto Serif KR", serif' }}
              >
                몸도, 습관도, 삶의 에너지도 달라집니다
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-4">
              {careItems.map((item) => (
                <article key={item.title} className="rounded-2xl border border-[#eadbd2] bg-white/75 p-7">
                  <div className="mb-5 h-10 w-10 rounded-full border border-[#d9aaa0]" />
                  <h3 className="text-[17px] font-bold text-[#4b3c35]">{item.title}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-[#7b6a61]">{item.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 grid overflow-hidden rounded-2xl border border-[#eadbd2] bg-white/70 text-center text-[14px] font-bold text-[#8a756b] md:grid-cols-3">
              <p className="border-b border-[#eadbd2] px-4 py-4 md:border-b-0 md:border-r">
                체계적인 데이터 기반 관리
              </p>
              <p className="border-b border-[#eadbd2] px-4 py-4 md:border-b-0 md:border-r">
                개인 맞춤 플랜 & 피드백
              </p>
              <p className="px-4 py-4">식단, 운동, 마음까지 통합 케어</p>
            </div>
          </div>
        </section>

        <section id="process" className="bg-[#fbf1eb] px-5 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-[13px] font-bold text-[#b06d5e]">근지킴 유지 과정</p>
              <h2
                className="text-[34px] font-medium leading-tight text-[#3a2b27] sm:text-[46px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", "Noto Serif KR", serif' }}
              >
                단계별 맞춤 코칭으로, 끝까지 함께합니다
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {processSteps.map(([num, title, text]) => (
                <article key={num} className="rounded-2xl border border-[#eadbd2] bg-white/72 p-7 shadow-sm">
                  <p className="mb-4 text-[13px] font-bold text-[#bd766e]">{num}</p>
                  <h3 className="text-[18px] font-bold text-[#4b3c35]">{title}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-[#7b6a61]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#fffaf5] px-5 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2
                className="text-[34px] font-medium leading-tight text-[#3a2b27] sm:text-[46px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", "Noto Serif KR", serif' }}
              >
                내게 맞는 프로그램을 선택하세요.
              </h2>
              <p className="mt-4 text-[15px] text-[#7b6a61]">
                모든 프로그램은 1:1 맞춤 코칭과 지속적인 피드백이 포함됩니다.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan, index) => (
                <article
                  key={plan.label}
                  className={`relative rounded-3xl border bg-white/82 p-8 shadow-[0_22px_60px_rgba(97,61,45,0.08)] ${
                    plan.featured
                      ? 'border-[#bd766e] shadow-[0_26px_80px_rgba(189,118,110,0.18)]'
                      : 'border-[#eadbd2]'
                  }`}
                >
                  {plan.featured ? (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bd766e] px-5 py-2 text-[12px] font-bold text-white">
                      추천
                    </span>
                  ) : null}
                  <p className="text-[14px] font-bold text-[#8a756b]">{plan.label}</p>
                  <p
                    className="mt-5 text-[42px] font-medium leading-none text-[#3a2b27]"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    {plan.price}
                  </p>
                  <p className="mt-3 text-[13px] text-[#90796f]">{plan.note}</p>
                  <ul className="mt-8 space-y-3 text-[14px] text-[#6f5c52]">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit}>✓ {benefit}</li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {plan.free ? (
                      <button
                        type="button"
                        onClick={openQuiz}
                        className="h-12 w-full rounded-xl border border-[#d9aaa0] text-[14px] font-bold text-[#8f5a51] transition hover:bg-[#fbf1eb]"
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
            <p className="mt-6 text-center text-[12px] text-[#90796f]">부가세 포함가입니다.</p>
          </div>
        </section>

        <section className="bg-[#f7e8df] px-5 py-24">
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[34px] bg-white/55 shadow-[0_24px_90px_rgba(97,61,45,0.12)] md:grid-cols-[0.95fr_1.05fr]">
            <img src={lifestyleVisual} alt="" className="h-full min-h-[360px] w-full object-cover" />
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="mb-4 text-[13px] font-bold text-[#b06d5e]">근지킴이 약속합니다</p>
              <h2
                className="text-[34px] font-medium leading-tight text-[#3a2b27] sm:text-[46px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", "Noto Serif KR", serif' }}
              >
                지금의 변화를 넘어,
                <br />
                근육을 지키는 감량을 준비하세요.
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-[#6f5c52]">
                근지킴은 단순한 체중 감량이 아니라, 감량 이후에도 버틸 수 있는 습관과 질문을 함께 정리합니다.
              </p>
              <div className="mt-9 grid gap-4 text-center sm:grid-cols-3">
                {['여성 전문 코칭', '프라이빗 관리', '신뢰할 수 있는 데이터'].map((item) => (
                  <div key={item} className="rounded-2xl border border-[#eadbd2] bg-[#fffaf5]/80 p-4">
                    <p className="text-[13px] font-bold text-[#4b3c35]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#eadbd2] bg-[#fffaf5] px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-[12px] text-[#8a756b] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-[#4b3c35]">근지킴 · © 2026</p>
          <p className="max-w-2xl leading-relaxed sm:text-right">
            교육용 정보이며 의학적 진단·처방을 대신하지 않습니다. 복용·중단은 담당 의사와 상의하세요.
          </p>
        </div>
      </footer>
    </div>
  );
}
