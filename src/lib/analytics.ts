import type { ResultTypeId } from '../config/quiz';

export type QuizEvent =
  | { type: 'quiz_start' }
  | { type: 'quiz_finish'; resultType: ResultTypeId; stackScore: number }
  | { type: 'result_view'; resultType: ResultTypeId }
  | {
      type: 'share_click';
      resultType: ResultTypeId;
      channel: 'image' | 'link' | 'native';
    }
  | { type: 'paywall_view'; resultType: ResultTypeId }
  | { type: 'purchase_click'; resultType: ResultTypeId };

export function trackQuizEvent(event: QuizEvent): void {
  try {
    if (import.meta.env.DEV) {
      console.debug('[quiz-event]', event);
    }
  } catch {
    // Analytics should never block the quiz funnel.
  }
}
