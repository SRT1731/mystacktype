import assert from 'node:assert/strict';
import { calculateQuizOutcome, chooseResultType } from '../src/lib/scoring.ts';
import type { ResultTypeId } from '../src/config/quiz.ts';

const minimalistOutcome = calculateQuizOutcome([
  'count_0_2',
  'decision_fixed',
  'memory_clear',
  'shelf_clean',
  'buy_clinical',
  'track_memory',
  'skip_flexible',
  'real_simple',
  'safety_often',
  'tone_strong',
]);

assert.equal(minimalistOutcome.resultType, 'minimalist');
assert.equal(minimalistOutcome.tone, 'strong');
assert.equal(minimalistOutcome.stackScore, 74);

const collectorOutcome = calculateQuizOutcome([
  'count_10_plus',
  'decision_random',
  'memory_none',
  'shelf_chaos',
  'buy_later',
  'track_none',
  'skip_stack',
  'real_shelf',
  'safety_unsure',
  'tone_roast',
]);

assert.equal(collectorOutcome.resultType, 'collector');
assert.equal(collectorOutcome.tone, 'roast');
assert.equal(collectorOutcome.stackScore, 7);

const tiedScores = new Map<ResultTypeId, number>([
  ['minimalist', 4],
  ['precision_tracker', 4],
  ['optimizer', 4],
  ['trend_chaser', 4],
  ['collector', 4],
  ['reset_seeker', 4],
]);

assert.equal(chooseResultType(tiedScores), 'reset_seeker');

console.log('Scoring tests passed.');
