import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { ScrambleIn } from './components/ScrambleText';
import PayPalCheckoutButton from './components/payment/PayPalCheckoutButton';
import TossCheckoutButton from './components/payment/TossCheckoutButton';
import { QuizExperience } from './components/QuizExperience';
import { useAuth } from './contexts/AuthContext';
import { createOrder } from './lib/firestore';
import { PRODUCTS } from './lib/paypal';
import { TOSS_PRODUCTS } from './lib/toss';
import { VIDEO_URLS } from './config/videos';
import { IMAGE_URLS } from './config/images';
import { SITE_CONFIG } from './config/content';

export default function App() {
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const { user } = useAuth();

  /* ── PayPal 결제 완료 → Firestore 저장 ── */
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
        console.log('[Firestore] Order saved:', orderId);
        alert(`창립 멤버 확정! 출시되면 가장 먼저 알려드릴게요. Order: ${orderId}`);
      } catch (err) {
        console.error('[Firestore] Failed to save order:', err);
        alert(`결제는 완료되었지만 기록 저장에 실패했습니다. Order: ${orderId}`);
      }
    },
    [user]
  );

  /* ── Hero video mouse-scrub ── */
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);

  const handleSeeked = useCallback(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    isSeekingRef.current = false;
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const video = heroVideoRef.current;
      if (!video || !video.duration) return;
      const deltaX = e.movementX;
      const sensitivity = 0.8;
      const change = (deltaX / window.innerWidth) * video.duration * sensitivity;
      targetTimeRef.current = Math.max(
        0,
        Math.min(video.duration, targetTimeRef.current + change)
      );
      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  /* ── Entrance delay ── */
  useEffect(() => {
    const timer = setTimeout(() => setEntranceComplete(true), 800);
    return () => clearTimeout(timer);
  }, []);

  /* ── Destructure config for readability ── */
  const { hero, cinematic, metrics, technology, architecture, footer } = SITE_CONFIG;
  const metricColors = ['#3166ff', '#57c84d', '#c98a16'];
  const featureColors = ['#3166ff', '#57c84d', '#c98a16', '#2f8f83'];
  const openQuiz = useCallback(() => setQuizOpen(true), []);

  return (
    <div
      style={{
        fontFamily: '"Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif',
        wordBreak: 'keep-all',
        overflowWrap: 'break-word',
      }}
    >
      <Navbar entranceComplete={entranceComplete} onQuizOpen={openQuiz} />

      {/* ════════════════ SECTION 1: HERO ════════════════ */}
      <section className="relative h-screen h-[100dvh] flex flex-col overflow-hidden">
        {/* Video background (mouse-scrubbed) */}
        {VIDEO_URLS.hero && (
          <video
            ref={heroVideoRef}
            src={VIDEO_URLS.hero}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            preload="auto"
            onSeeked={handleSeeked}
          />
        )}

        {IMAGE_URLS.hero && (
          <img
            src={IMAGE_URLS.hero}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {IMAGE_URLS.hero && (
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              background:
                'linear-gradient(90deg, rgba(1,1,3,0.58) 0%, rgba(1,1,3,0.18) 45%, rgba(1,1,3,0.42) 100%)',
            }}
          />
        )}

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.05,
          }}
        />

        {/* Watermark text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ paddingTop: 50 }}
        >
          <span
            className="uppercase select-none text-[120px] sm:text-[220px] md:text-[360px] lg:text-[521px]"
            style={{
              fontFamily: '"Anton SC", sans-serif',
              letterSpacing: 0,
              opacity: 0.06,
              background:
                'radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              lineHeight: 1,
            }}
          >
            {hero.watermark}
          </span>
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-20 flex flex-col flex-1 px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: entranceComplete ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex-1" />

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-start">
            {/* Left column */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <motion.p
                className="text-white/65 text-[11px] sm:text-[12px] font-bold uppercase"
                style={{ letterSpacing: 0 }}
                initial={{ opacity: 0, y: 14 }}
                animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {SITE_CONFIG.tagline}
              </motion.p>
              <h1
                className="max-w-2xl text-white leading-[0.98] text-[44px] font-black sm:text-[64px] md:text-[82px] lg:text-[96px]"
                style={{ letterSpacing: 0 }}
              >
                <ScrambleIn text={hero.titleLeft[0]} delay={200} triggered={entranceComplete} />
                <br />
                <ScrambleIn text={hero.titleLeft[1]} delay={500} triggered={entranceComplete} />
              </h1>

              <motion.p
                className="max-w-lg text-[15px] sm:text-[18px] text-white/78 leading-[1.65]"
                initial={{ opacity: 0, y: 25 }}
                animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.9,
                  ease: [0.215, 0.61, 0.355, 1.0],
                  delay: 0.2,
                }}
              >
                {hero.description}
              </motion.p>
              <motion.p
                className="text-white/52 text-[12px] sm:text-[13px]"
                style={{ letterSpacing: 0 }}
                initial={{ opacity: 0, y: 18 }}
                animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.35 }}
              >
                무료 결과: 내 상태 · 약점 그래프 · 상담 질문
              </motion.p>
              <motion.button
                type="button"
                onClick={openQuiz}
                className="mt-1 h-[52px] w-full max-w-[300px] rounded-full bg-white px-6 text-[15px] font-extrabold text-[#111614] transition hover:bg-[#90ffbe]"
                initial={{ opacity: 0, y: 18 }}
                animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                무료로 진단받기
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {quizOpen ? <QuizExperience onClose={() => setQuizOpen(false)} /> : null}

      {/* ════════════════ SECTION 2: CINEMATIC TEXT ════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#101412] text-white">
        {VIDEO_URLS.section2 ? (
          <video
            src={VIDEO_URLS.section2}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={IMAGE_URLS.report}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(8,12,10,0.94) 0%, rgba(8,12,10,0.68) 46%, rgba(8,12,10,0.36) 100%)',
          }}
        />

        <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-28 md:grid-cols-[0.9fr_1.1fr]">
          <motion.div>
            <p className="mb-5 text-[12px] font-extrabold text-[#90ffbe]">
              60초 무료 진단
            </p>
            <h2 className="text-[38px] font-black leading-[1.05] sm:text-[54px] md:text-[64px]">
              {cinematic.text}
            </h2>
          </motion.div>

          <motion.div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
            {[
              ['1', '잘 빠지는데 힘이 없다'],
              ['2', '한 끼도 겨우 먹는다'],
              ['3', '끊은 뒤가 더 걱정된다'],
            ].map(([num, label]) => (
              <div
                key={num}
                className="flex min-h-[82px] items-center gap-5 border border-white/14 bg-white/8 px-5 backdrop-blur-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#90ffbe] text-[15px] font-black text-[#101412]">
                  {num}
                </span>
                <span className="text-[18px] font-bold text-white/88">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SECTION 3: METRICS ════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#f7faf6]">
        {VIDEO_URLS.metrics && (
          <video
            src={VIDEO_URLS.metrics}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        <div className="relative z-20 mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-28 md:grid-cols-[0.95fr_1.05fr]">
          <motion.div>
            <p className="mb-5 text-[12px] font-extrabold text-[#3166ff]">
              {metrics.subtitle}
            </p>
            <h2 className="max-w-xl text-[42px] font-black leading-[1.02] text-[#111614] sm:text-[58px]">
              결제 전에, 내 상태부터 보세요.
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[#4d5852]">
              무료 진단만으로도 바로 쓸 게 나와요.
            </p>
            <button
              type="button"
              onClick={openQuiz}
              className="mt-8 h-[52px] rounded-full bg-[#111614] px-7 text-[15px] font-extrabold text-white transition hover:bg-[#3166ff]"
            >
              내 결과 보기
            </button>
          </motion.div>

          <motion.div className="relative min-h-[520px] overflow-hidden border border-[#dbe4dc] bg-white shadow-[0_24px_80px_rgba(17,22,20,0.08)]">
            <img
              src={IMAGE_URLS.report}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/72 to-white/16" />
            <div className="absolute inset-x-0 bottom-0 grid gap-3 p-5 sm:grid-cols-3">
              {metrics.items.map((m, i) => (
                <div key={m.label} className="bg-white/88 p-4 backdrop-blur-md">
                  <div
                    className="text-[34px] font-black leading-none"
                    style={{ color: metricColors[i % metricColors.length] }}
                  >
                    {m.value}
                  </div>
                  <p className="mt-3 text-[13px] font-bold leading-snug text-[#3f4742]">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SECTION 4: TECHNOLOGY ════════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-[#eef4f0]">
        {/* Video background */}
        {VIDEO_URLS.technology && (
          <video
            src={VIDEO_URLS.technology}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        <div className="relative z-20 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.h2
              className="text-[42px] font-black leading-[1.03] text-[#111614] sm:text-[58px] md:text-[72px]"
              style={{ letterSpacing: 0 }}
            >
              {technology.title[0]}
              <br />
              {technology.title[1]}
            </motion.h2>

            <motion.p
              className="max-w-sm text-[15px] leading-relaxed text-[#4d5852] md:text-right"
            >
              {technology.description}
            </motion.p>
          </div>

          <motion.div
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {technology.features.map((f, i) => (
              <motion.div
                key={f.title}
                className="min-h-[220px] border border-[#d6e1d8] bg-white/78 p-5 shadow-sm backdrop-blur-sm"
              >
                <div className="mb-8 h-1.5 w-12 rounded-full" style={{ backgroundColor: featureColors[i % featureColors.length] }} />
                <h3 className="mb-4 text-[22px] font-black text-[#111614]">
                  {f.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[#59645e]">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SECTION 5: ARCHITECTURE ════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#f6f8f4] overflow-hidden">
        {IMAGE_URLS.report && (
          <img
            src={IMAGE_URLS.report}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        )}

        {IMAGE_URLS.report && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(246,248,244,0.94) 0%, rgba(246,248,244,0.72) 45%, rgba(246,248,244,0.96) 100%)',
            }}
          />
        )}

        <div className="relative z-20 max-w-3xl mx-auto px-6 py-32 text-center">
          <motion.div>
            <p className="text-[#66706a] text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8">
              {architecture.subtitle}
            </p>
            <h2
              className="mb-8 text-[42px] font-black leading-[1.03] text-[#111614] sm:text-[58px] md:text-[70px]"
              style={{ letterSpacing: 0 }}
            >
              {architecture.heading}
            </h2>
            <p className="mx-auto max-w-xl text-[16px] leading-relaxed text-[#4d5852] sm:text-[18px]">
              {architecture.description}
            </p>
          </motion.div>

          <motion.div
            className="mt-20 flex flex-col items-center gap-4"
          >
            {architecture.layers.map((l) => (
              <div
                key={l.num}
                className="w-full max-w-md h-[72px] border border-[#dbe4dc] bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-between px-6 shadow-sm"
              >
                <span className="text-[#77827b] text-[12px] tracking-[0.15em] uppercase">
                  Step {l.num}
                </span>
                <span className="text-[#111614] text-[16px] sm:text-[18px] font-bold">
                  {l.name}
                </span>
              </div>
            ))}
            <a
              href="#pricing"
              className="mt-4 flex h-[52px] w-full max-w-md items-center justify-center rounded-full bg-[#111614] px-6 text-[15px] font-extrabold text-white transition hover:bg-[#3166ff]"
            >
              사전예약 옵션 보기
            </a>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SECTION 6: PRICING ════════════════ */}
      <section id="pricing" className="min-h-screen bg-white py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
          >
            <p className="text-[#66706a] text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8">
              사전예약
            </p>
            <h2
              className="mb-6 text-[42px] font-black leading-[1.03] text-[#111614] sm:text-[58px] md:text-[70px]"
              style={{ letterSpacing: 0 }}
            >
              출시 전, 가장 낮은 가격으로.
            </h2>
            <p className="text-[#4d5852] text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
              무료 진단만 보고 가도 돼요. 마음에 들면 예약하세요. 안 나오면 전액 환불.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* ── Basic ── */}
            <motion.div
              className="border border-[#dbe4dc] bg-[#f6f8f4] rounded-2xl p-8 flex flex-col shadow-sm"
            >
              <p className="text-[#66706a] text-[12px] tracking-[0.15em] uppercase mb-3">무료 진단</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-[52px] leading-none uppercase"
                  style={{ color: '#3166ff', letterSpacing: 0 }}
                >
                  무료
                </span>
              </div>
              <p className="text-[#4d5852] text-[13px] leading-relaxed mb-8">
                먼저 내 상태 확인.
              </p>
              <ul className="flex flex-col gap-3 mb-10 flex-1">
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#3166ff]">✓</span> 무료 진단
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#3166ff]">✓</span> 위험 점수
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#3166ff]">✓</span> 약점 그래프
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#3166ff]">✓</span> 상담 질문
                </li>
              </ul>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={openQuiz}
                  className="w-full max-w-md mx-auto h-[50px] rounded-lg font-bold text-[15px] flex items-center justify-center bg-[#3166ff] text-white hover:bg-[#2455dc] transition-colors"
                >
                  무료로 먼저 보기
                </button>
              </div>
            </motion.div>

            {/* ── Pro (Featured) ── */}
            <motion.div
              className="border border-[#3166ff]/35 rounded-2xl p-8 flex flex-col relative bg-white shadow-[0_18px_60px_rgba(49,102,255,0.14)]"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-[#57c84d] text-[#111614] text-[11px] font-bold tracking-[0.1em] uppercase px-4 py-1.5 rounded-full">
                  초기 멤버
                </span>
              </div>
              <p className="text-[#66706a] text-[12px] tracking-[0.15em] uppercase mb-3">창립 멤버 사전예약</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-[52px] leading-none"
                  style={{ color: '#57c84d', letterSpacing: 0 }}
                >
                  8,900원
                </span>
              </div>
              <p className="text-[#4d5852] text-[13px] leading-relaxed mb-8">
                출시 때 가장 싸게 초대.
              </p>
              <ul className="flex flex-col gap-3 mb-10 flex-1">
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#57c84d]">✓</span> 창립 멤버 우선 오픈
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#57c84d]">✓</span> 유지 체크포인트
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#57c84d]">✓</span> 진료 질문 정리
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#57c84d]">✓</span> 안 나오면 전액 환불
                </li>
              </ul>
              <div className="flex flex-col gap-3">
                <PayPalCheckoutButton
                  product={PRODUCTS[0]}
                  onSuccess={(details) => handlePayPalSuccess(details, PRODUCTS[0].id, PRODUCTS[0].name, PRODUCTS[0].price)}
                  onError={(err) => console.error('PayPal error:', err)}
                />
                <TossCheckoutButton
                  product={TOSS_PRODUCTS[0]}
                  onError={(err) => console.error('Toss error:', err)}
                />
              </div>
            </motion.div>

            {/* ── Enterprise ── */}
            <motion.div
              className="border border-[#dbe4dc] bg-[#f6f8f4] rounded-2xl p-8 flex flex-col shadow-sm"
            >
              <p className="text-[#66706a] text-[12px] tracking-[0.15em] uppercase mb-3">파운더 사전예약</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-[52px] leading-none"
                  style={{ color: '#c98a16', letterSpacing: 0 }}
                >
                  14,900원
                </span>
              </div>
              <p className="text-[#4d5852] text-[13px] leading-relaxed mb-8">
                내 피드백까지 반영.
              </p>
              <ul className="flex flex-col gap-3 mb-10 flex-1">
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#c98a16]">✓</span> 위 혜택 전부
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#c98a16]">✓</span> 초기 1:1 피드백 반영
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#c98a16]">✓</span> 근육 사수 가이드 우선
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#c98a16]">✓</span> 안 나오면 전액 환불
                </li>
              </ul>
              <div className="flex flex-col gap-3">
                <PayPalCheckoutButton
                  product={PRODUCTS[1]}
                  onSuccess={(details) => handlePayPalSuccess(details, PRODUCTS[1].id, PRODUCTS[1].name, PRODUCTS[1].price)}
                  onError={(err) => console.error('PayPal error:', err)}
                />
                <TossCheckoutButton
                  product={TOSS_PRODUCTS[1]}
                  onError={(err) => console.error('Toss error:', err)}
                />
                <a
                  href="mailto:contact@connectailab.com"
                  className="w-full max-w-md mx-auto h-[50px] rounded-lg font-medium text-[15px] flex items-center justify-center gap-2 border border-[#cbd7cf] text-[#3f4742] hover:bg-white transition-colors"
                >
                  문의하기
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="border-t border-[#dbe4dc] bg-[#f6f8f4] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-[12px] text-[#66706a] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold text-[#111614]">{footer.tagline}</p>
          <p className="max-w-2xl leading-relaxed sm:text-right">{footer.disclaimer}</p>
        </div>
      </footer>
    </div>
  );
}
