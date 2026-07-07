import type { ResultTypeId } from '../config/quiz';

export type QuizEvent =
  | { type: 'check_start' }
  | { type: 'check_complete'; resultType: ResultTypeId; stackScore: number }
  | { type: 'newsletter_subscribe'; source: string }
  | { type: 'waitlist_join'; tier: 'member' | 'founder'; source: string }
  | { type: 'quiz_start' }
  | { type: 'quiz_finish'; resultType: ResultTypeId; stackScore: number }
  | { type: 'result_view'; resultType: ResultTypeId }
  | {
      type: 'share_click';
      resultType: ResultTypeId;
      channel: 'image' | 'link' | 'native';
    };

function readRef(): string | null {
  try {
    const raw = new URLSearchParams(window.location.search).get('ref');
    if (!raw) return null;
    return /^[A-Za-z0-9_-]{1,32}$/.test(raw) ? raw : null;
  } catch {
    return null;
  }
}

// Captured once at module load so every event carries the entry ref.
const REF = readRef();

export function trackQuizEvent(event: QuizEvent): void {
  try {
    const gtag = (window as typeof window & {
      gtag?: (command: 'event', eventName: string, params?: Record<string, unknown>) => void;
    }).gtag;
    const { type, ...rest } = event;
    const params = { ...rest, ref: REF };
    if (gtag) {
      gtag('event', type, params);
    }
    if (import.meta.env.DEV) {
      console.debug('[quiz-event]', { type, ...params });
    }
  } catch {
    // Analytics should never block the quiz funnel.
  }
}
