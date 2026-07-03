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

export function trackQuizEvent(event: QuizEvent): void {
  try {
    const gtag = (window as typeof window & {
      gtag?: (command: 'event', eventName: string, params?: Record<string, unknown>) => void;
    }).gtag;
    if (gtag) {
      const { type, ...params } = event;
      gtag('event', type, params);
    }
    if (import.meta.env.DEV) {
      console.debug('[quiz-event]', event);
    }
  } catch {
    // Analytics should never block the quiz funnel.
  }
}
