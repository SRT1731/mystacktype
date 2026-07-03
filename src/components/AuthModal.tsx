// ============================================================
// AuthModal — 로그인/회원가입 모달
// ============================================================
// 사이트 어디서든 열 수 있는 풀스크린 로그인 모달
// Google, 이메일 로그인/회원가입 지원
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, error, clearError } =
    useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice('');
    try {
      if (mode === 'reset') {
        await resetPassword(email);
        setNotice('비밀번호 재설정 메일을 보냈어요. 메일함을 확인해 주세요.');
      } else if (mode === 'login') {
        await signInWithEmail(email, password);
        onClose();
      } else {
        await signUpWithEmail(email, password);
        onClose();
      }
    } catch {
      // error is set by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch {
      // error handled in context
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-[90%] max-w-[420px] bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 sm:p-10"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors cursor-pointer bg-transparent border-none text-[18px]"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-white text-[24px] font-light mb-2" style={{ letterSpacing: 0 }}>
              {mode === 'login'
                ? '로그인'
                : mode === 'signup'
                  ? '이메일로 회원가입'
                  : '비밀번호 찾기'}
            </h2>
            <p className="text-white/40 text-[14px] mb-8">
              {mode === 'login'
                ? '자가 점검 결과와 대기명단 정보를 저장하세요.'
                : mode === 'signup'
                  ? '이메일과 비밀번호로 계정을 만들고 점검 결과를 보관하세요.'
                  : '가입한 이메일을 입력하면 비밀번호 재설정 메일을 보내드려요.'}
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6 text-red-400 text-[13px]">
                {error}
                <button
                  onClick={clearError}
                  className="ml-2 text-red-300 hover:text-red-100 cursor-pointer bg-transparent border-none"
                >
                  ✕
                </button>
              </div>
            )}

            {notice && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 mb-6 text-emerald-200 text-[13px] leading-relaxed">
                {notice}
              </div>
            )}

            {/* Social login buttons */}
            {mode !== 'reset' && (
              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={handleGoogle}
                  className="w-full h-[48px] rounded-lg bg-white/[0.07] border border-white/10 text-white text-[14px] font-medium flex items-center justify-center gap-3 hover:bg-white/[0.12] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google로 계속하기
                </button>
              </div>
            )}

            {/* Divider */}
            {mode !== 'reset' && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-[12px] uppercase tracking-[0.1em]">또는</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}

            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-white/40 text-[12px] uppercase tracking-[0.1em] mb-2 block">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-[44px] bg-white/[0.05] border border-white/10 rounded-lg px-4 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                />
              </div>
              {mode !== 'reset' && (
                <div>
                <label className="text-white/40 text-[12px] uppercase tracking-[0.1em] mb-2 block">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full h-[44px] bg-white/[0.05] border border-white/10 rounded-lg px-4 text-white text-[14px] placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-white text-black rounded-lg text-[14px] font-bold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading
                  ? '처리 중...'
                  : mode === 'login'
                    ? '이메일로 로그인'
                    : mode === 'signup'
                      ? '회원가입하기'
                      : '재설정 메일 보내기'}
              </button>
            </form>

            {mode === 'login' && (
              <div className="mt-4 flex flex-col items-center gap-2 text-[12px] text-white/35">
                <button
                  onClick={() => {
                    setMode('reset');
                    setNotice('');
                    clearError();
                  }}
                  className="text-white/60 hover:text-white underline cursor-pointer bg-transparent border-none text-[12px]"
                >
                  비밀번호를 잊으셨나요?
                </button>
                <span>
                  가입 이메일을 잊었다면{' '}
                  <a className="text-white/60 underline" href="mailto:keepline1717@gmail.com">
                    keepline1717@gmail.com
                  </a>
                  으로 문의해 주세요.
                </span>
              </div>
            )}

            {/* Switch mode */}
            <p className="text-center text-white/40 text-[13px] mt-6">
              {mode === 'login'
                ? '아직 계정이 없나요?'
                : mode === 'signup'
                  ? '이미 계정이 있나요?'
                  : '비밀번호가 기억났나요?'}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setNotice('');
                  clearError();
                }}
                className="text-white/70 hover:text-white underline cursor-pointer bg-transparent border-none text-[13px]"
              >
                {mode === 'login' ? '이메일로 회원가입' : '로그인하기'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
