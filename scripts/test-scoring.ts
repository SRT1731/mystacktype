import assert from 'node:assert/strict';
import { calculateQuizOutcome, chooseResultType } from '../src/lib/scoring.ts';
import type { ResultTypeId } from '../src/config/quiz.ts';

const reboundOutcome = calculateQuizOutcome([
  'stage_maintenance',
  'duration_6m_plus',
  'loss_slow',
  'protein_sometimes',
  'training_1_2',
  'meal_less',
  'support_water',
  'recovery_okay',
  'muscle_unsure',
  'stop_soon',
]);

assert.equal(reboundOutcome.resultType, 'rebound');
assert.equal(reboundOutcome.tone, 'strong');
assert.equal(reboundOutcome.doctorQuestions.length, 3);

const defenderOutcome = calculateQuizOutcome([
  'stage_mid_loss',
  'duration_3_6m',
  'loss_slow',
  'protein_target',
  'training_3_4',
  'meal_similar',
  'support_full',
  'recovery_good',
  'muscle_same',
  'stop_none',
]);

assert.equal(defenderOutcome.resultType, 'defender');
assert.ok(defenderOutcome.stackScore < 35);

const tiedScores = new Map<ResultTypeId, number>([
  ['runaway', 4],
  ['undereater', 4],
  ['plateau', 4],
  ['rebound', 4],
  ['defender', 4],
  ['balanced', 4],
]);

assert.equal(chooseResultType(tiedScores), 'rebound');

console.log('Scoring tests passed.');
