import { useState } from 'react';
import type { FormEvent } from 'react';
import { trackQuizEvent } from '../lib/analytics';
import { createNewsletterLead, createWaitlistLead } from '../lib/firestore';

type CaptureMode = 'newsletter' | 'waitlist';
type WaitlistTier = 'member' | 'founder';

interface EmailCaptureFormProps {
  mode: CaptureMode;
  source: string;
  tier?: WaitlistTier;
  buttonLabel: string;
  placeholder?: string;
  caption?: string;
  successMessage: string;
  compact?: boolean;
}

export function EmailCaptureForm({
  mode,
  source,
  tier = 'member',
  buttonLabel,
  placeholder = '이메일 주소',
  caption,
  successMessage,
  compact = false,
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus('error');
      setMessage('이메일 주소를 다시 확인해 주세요.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      if (mode === 'newsletter') {
        await createNewsletterLead(normalizedEmail, source);
        trackQuizEvent({ type: 'newsletter_subscribe', source });
      } else {
        await createWaitlistLead(normalizedEmail, tier, source);
        trackQuizEvent({ type: 'waitlist_join', tier, source });
      }
      setStatus('success');
      setMessage(successMessage);
      setEmail('');
    } catch (error) {
      console.error('[EmailCaptureForm] failed to save lead:', error);
      setStatus('error');
      setMessage('저장 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={compact ? 'flex flex-col gap-3 sm:flex-row' : 'flex flex-col gap-3'}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={placeholder}
          className="min-h-[52px] flex-1 rounded-full border border-[#b76e79]/20 bg-white/80 px-5 text-[14px] text-[#40382f] outline-none transition placeholder:text-[#b89d95] focus:border-[#b76e79] focus:bg-white"
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="min-h-[52px] rounded-full bg-gradient-to-br from-[#dba99d] to-[#b76e79] px-6 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(183,110,121,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? '등록 중...' : buttonLabel}
        </button>
      </div>
      {caption ? <p className="mt-3 text-[12px] leading-relaxed text-[#9c8b82]">{caption}</p> : null}
      {message ? (
        <p
          className={`mt-3 text-[13px] leading-relaxed ${
            status === 'success' ? 'text-[#9f6258]' : 'text-[#b24a4a]'
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
