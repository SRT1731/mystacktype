import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import { Navbar } from './components/Navbar';
import { ScrambleIn } from './components/ScrambleText';
import { ConnectAILabLogo } from './components/ConnectAILabLogo';
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
          currency: 'USD',
          status: 'completed',
          paypalOrderId: orderId,
          paypalPayerId: details.payer?.payer_id || '',
        });
        console.log('[Firestore] Order saved:', orderId);
        alert(`✅ 결제 완료! Order: ${orderId}`);
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

  /* ── Section 2 scroll-driven 3D text ── */
  const section2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section2Ref,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 15,
    damping: 32,
    mass: 1.8,
  });
  const yScaleValue = useTransform(smoothProgress, [0, 1], [60, -120]);
  const textOpacity = useTransform(smoothProgress, [0.3, 0.5], [0, 1]);
  const transform3D = useMotionTemplate`rotateX(24deg) translateY(${yScaleValue}px) translateZ(15px)`;

  /* ── Destructure config for readability ── */
  const { hero, cinematic, metrics, technology, architecture, footer } = SITE_CONFIG;
  const metricColors = ['#3166ff', '#57c84d', '#c98a16'];
  const featureColors = ['#3166ff', '#57c84d', '#c98a16', '#2f8f83'];
  const openQuiz = useCallback(() => setQuizOpen(true), []);

  return (
    <div style={{ fontFamily: '"Space Mono", monospace' }}>
      <Navbar entranceComplete={entranceComplete} />

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

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Left column */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <motion.p
                className="text-white/65 text-[11px] sm:text-[12px] font-bold uppercase"
                style={{ letterSpacing: 0 }}
                initial={{ opacity: 0, y: 14 }}
                animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                Free 60-second quiz
              </motion.p>
              <h1
                className="text-white uppercase leading-[0.9] text-[58px] sm:text-[82px] md:text-[112px] lg:text-[128px]"
                style={{ fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
              >
                <ScrambleIn text={hero.titleLeft[0]} delay={200} triggered={entranceComplete} />
                <br />
                <ScrambleIn text={hero.titleLeft[1]} delay={500} triggered={entranceComplete} />
              </h1>

              <motion.p
                className="max-w-md text-[15px] sm:text-[17px] text-white/75 leading-[1.6]"
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
                className="text-white/45 text-[12px] sm:text-[13px] uppercase"
                style={{ letterSpacing: 0 }}
                initial={{ opacity: 0, y: 18 }}
                animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.35 }}
              >
                Result example: The Bottle Collector / Messiness 82
              </motion.p>
              <motion.button
                type="button"
                onClick={openQuiz}
                className="mt-1 h-[52px] w-full max-w-[300px] bg-white px-6 text-[14px] font-bold uppercase text-[#111614] transition hover:bg-[#90ffbe]"
                initial={{ opacity: 0, y: 18 }}
                animate={entranceComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                Start Free Quiz
              </motion.button>
            </div>

            {/* Right heading */}
            <h1
              className="text-white uppercase leading-[0.9] text-[58px] sm:text-[82px] md:text-[112px] lg:text-[128px] text-left md:text-right"
              style={{ fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
            >
              <ScrambleIn text={hero.titleRight[0]} delay={700} triggered={entranceComplete} />
              <br />
              <ScrambleIn text={hero.titleRight[1]} delay={1000} triggered={entranceComplete} />
            </h1>
          </div>
        </motion.div>
      </section>

      {quizOpen ? <QuizExperience onClose={() => setQuizOpen(false)} /> : null}

      {/* ════════════════ SECTION 2: CINEMATIC TEXT ════════════════ */}
      <section
        ref={section2Ref}
        className="relative h-screen h-[100dvh] flex items-center justify-center overflow-hidden bg-[#f4f7f2]"
      >
        {/* Video background */}
        {VIDEO_URLS.section2 && (
          <video
            src={VIDEO_URLS.section2}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        {/* Top gradient overlay */}
        <div
          className="absolute top-0 left-0 right-0 z-10"
          style={{
            height: 180,
            background: 'linear-gradient(to bottom, rgba(1,1,3,0.16), transparent)',
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #ffffff, transparent)',
          }}
        />

        {/* 3D text content */}
        <div className="relative z-20 max-w-5xl mx-auto" style={{ perspective: 400 }}>
          <div className="mx-auto mb-8 h-2 w-28 rounded-full bg-[#57c84d]" />
          <motion.p
            className="text-[38px] sm:text-[54px] md:text-[76px] lg:text-[88px] text-[#141815] leading-[0.95] uppercase select-none px-6 sm:px-12 text-center"
            style={{
              fontFamily: '"Anton SC", sans-serif',
              letterSpacing: 0,
              transform: transform3D,
              opacity: textOpacity,
            }}
          >
            {cinematic.text}
          </motion.p>
        </div>
      </section>

      {/* ════════════════ SECTION 3: METRICS ════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
        {/* Video background */}
        {VIDEO_URLS.metrics && (
          <video
            src={VIDEO_URLS.metrics}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        <div className="relative z-20 pt-32 pb-32 px-6 max-w-6xl mx-auto w-full">
          <motion.p
            className="text-[#66706a] text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-20 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {metrics.subtitle}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center">
            {metrics.items.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div
                  className="leading-none text-[56px] sm:text-[72px] md:text-[88px] lg:text-[96px]"
                  style={{
                    color: metricColors[i % metricColors.length],
                    fontFamily: '"Anton SC", sans-serif',
                    letterSpacing: 0,
                  }}
                >
                  {m.value}
                </div>
                <div className="text-[#3f4742] text-[13px] sm:text-[15px] mt-4 tracking-wide">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ SECTION 4: TECHNOLOGY ════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#eef4f0]">
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

        <div className="relative z-20 flex flex-col flex-1 px-8 sm:px-12 md:px-16 py-20 sm:py-24">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <motion.h2
              className="text-[#111614] uppercase leading-[0.9] text-[48px] sm:text-[64px] md:text-[82px]"
              style={{ fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {technology.title[0]}
              <br />
              {technology.title[1]}
            </motion.h2>

            <motion.p
              className="text-[#4d5852] text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {technology.description}
            </motion.p>
          </div>

          <div className="flex-1 min-h-[160px]" />

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {technology.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="mb-4 h-1.5 w-10 rounded-full" style={{ backgroundColor: featureColors[i % featureColors.length] }} />
                <h3 className="text-[#111614] text-[14px] sm:text-[16px] font-bold mb-2">
                  {f.title}
                </h3>
                <p className="text-[#59645e] text-[12px] sm:text-[14px] leading-relaxed">
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <p className="text-[#66706a] text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8">
              {architecture.subtitle}
            </p>
            <h2
              className="text-[#111614] uppercase leading-[0.95] mb-10 text-[42px] sm:text-[58px] md:text-[72px]"
              style={{ fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
            >
              {architecture.heading}
            </h2>
            <p className="text-[#4d5852] text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
              {architecture.description}
            </p>
          </motion.div>

          <motion.div
            className="mt-20 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            {architecture.layers.map((l) => (
              <div
                key={l.num}
                className="w-full max-w-md h-[72px] border border-[#dbe4dc] bg-white/80 backdrop-blur-md rounded-lg flex items-center justify-between px-6 shadow-sm"
              >
                <span className="text-[#77827b] text-[12px] tracking-[0.15em] uppercase">
                  Layer {l.num}
                </span>
                <span className="text-[#111614] text-[16px] sm:text-[18px] font-bold">
                  {l.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SECTION 6: PRICING ════════════════ */}
      <section id="pricing" className="min-h-screen bg-white py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="text-[#66706a] text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8">
              Start Here
            </p>
            <h2
              className="text-[#111614] uppercase leading-[0.95] mb-6 text-[42px] sm:text-[58px] md:text-[72px]"
              style={{ fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
            >
              Take the free quiz. Pay only if you want the reset.
            </h2>
            <p className="text-[#4d5852] text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
              The hook is the result. The product is the clarity after the result.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* ── Basic ── */}
            <motion.div
              className="border border-[#dbe4dc] bg-[#f6f8f4] rounded-2xl p-8 flex flex-col shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="text-[#66706a] text-[12px] tracking-[0.15em] uppercase mb-3">Free Stack Type Quiz</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-[52px] leading-none uppercase"
                  style={{ color: '#3166ff', fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
                >
                  Free
                </span>
              </div>
              <p className="text-[#4d5852] text-[13px] leading-relaxed mb-8">
                Get a result that feels personal enough to send to a friend.
              </p>
              <ul className="flex flex-col gap-3 mb-10 flex-1">
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#3166ff]">✓</span> Stack Type result
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#3166ff]">✓</span> Messiness Score
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#3166ff]">✓</span> Shareable result idea
                </li>
              </ul>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={openQuiz}
                  className="w-full max-w-md mx-auto h-[50px] rounded-lg font-bold text-[15px] flex items-center justify-center bg-[#3166ff] text-white hover:bg-[#2455dc] transition-colors"
                >
                  Reveal My Stack Type
                </button>
              </div>
            </motion.div>

            {/* ── Pro (Featured) ── */}
            <motion.div
              className="border border-[#3166ff]/35 rounded-2xl p-8 flex flex-col relative bg-white shadow-[0_18px_60px_rgba(49,102,255,0.14)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-[#57c84d] text-[#111614] text-[11px] font-bold tracking-[0.1em] uppercase px-4 py-1.5 rounded-full">
                  Best First Buy
                </span>
              </div>
              <p className="text-[#66706a] text-[12px] tracking-[0.15em] uppercase mb-3">One-Page Stack Reset Report</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-[52px] leading-none"
                  style={{ color: '#57c84d', fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
                >
                  $7
                </span>
                <span className="text-[#66706a] text-[14px]">/one-time</span>
              </div>
              <p className="text-[#4d5852] text-[13px] leading-relaxed mb-8">
                For people who want the quick cleanup after seeing their type.
              </p>
              <ul className="flex flex-col gap-3 mb-10 flex-1">
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#57c84d]">✓</span> One-page stack summary
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#57c84d]">✓</span> Keep / Check / Track / Ask plan
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#57c84d]">✓</span> 7-day tracker
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#57c84d]">✓</span> Questions for a qualified professional
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="text-[#66706a] text-[12px] tracking-[0.15em] uppercase mb-3">Full Stack Reset Report</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-[52px] leading-none"
                  style={{ color: '#c98a16', fontFamily: '"Anton SC", sans-serif', letterSpacing: 0 }}
                >
                  $19
                </span>
                <span className="text-[#66706a] text-[14px]">/one-time</span>
              </div>
              <p className="text-[#4d5852] text-[13px] leading-relaxed mb-8">
                For messy stacks with too many bottles and too many maybes.
              </p>
              <ul className="flex flex-col gap-3 mb-10 flex-1">
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#c98a16]">✓</span> Detailed routine map
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#c98a16]">✓</span> Morning/evening organization
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#c98a16]">✓</span> Potential overlap checkpoints
                </li>
                <li className="flex items-center gap-3 text-[#3f4742] text-[13px]">
                  <span className="text-[#c98a16]">✓</span> Professional questions
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
                  Contact Sales
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="bg-[#f6f8f4] overflow-hidden border-t border-[#dbe4dc]">
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Left: Video */}
          <div className="md:w-1/2 h-[300px] md:h-auto relative">
            {VIDEO_URLS.footer ? (
              <video
                src={VIDEO_URLS.footer}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={IMAGE_URLS.report}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-55"
              />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(246,248,244,0.08) 0%, rgba(246,248,244,0.72) 100%)',
              }}
            />
          </div>

          {/* Right: Content */}
          <div className="md:w-1/2 flex flex-col justify-between p-10 sm:p-16">
            <div>
              <div className="flex items-center gap-2.5 mb-8">
                <ConnectAILabLogo size={18} className="text-[#3166ff]" />
                <span className="text-[15px] font-bold text-[#111614] tracking-tight">
                  {SITE_CONFIG.brandName}
                </span>
              </div>
              <p className="text-[#4d5852] text-[14px] sm:text-[15px] leading-relaxed max-w-sm">
                {footer.tagline}
              </p>
            </div>

            <p className="text-[#77827b] text-[12px] mt-12">
              {SITE_CONFIG.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
