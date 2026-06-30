import {
  DIMENSION_LIMITS,
  QUIZ_QUESTIONS,
  QUIZ_RESULTS,
  RESULT_TIE_BREAK_ORDER,
  STACK_SCORE_WEIGHTS,
  type DimensionVector,
  type QuizDimension,
  type QuizOutcome,
  type RawDimensionVector,
  type ResultTone,
  type ResultTypeId,
} from '../config/quiz';

export function calculateQuizOutcome(selectedOptionIds: string[]): QuizOutcome {
  const resultScores = initializeResultScores();
  const rawDimensions = emptyRawDimensions();
  let tone: ResultTone = 'strong';

  for (const question of QUIZ_QUESTIONS) {
    const selected = question.options.find((option) =>
      selectedOptionIds.includes(option.id)
    );

    if (!selected) continue;

    if (selected.tone) {
      tone = selected.tone;
    }

    for (const [resultId, weight] of Object.entries(selected.weights ?? {})) {
      const id = resultId as ResultTypeId;
      resultScores.set(id, (resultScores.get(id) ?? 0) + weight);
    }

    for (const [dimension, value] of Object.entries(selected.dimensions ?? {})) {
      const id = dimension as QuizDimension;
      rawDimensions[id] += value;
    }
  }

  const resultType = chooseResultType(resultScores);
  const result = QUIZ_RESULTS.find((item) => item.id === resultType) ?? QUIZ_RESULTS[0];
  const dimensions = normalizeDimensions(rawDimensions);
  const stackScore = calculateStackScore(dimensions);

  return {
    resultType,
    result,
    tone,
    stackScore,
    messinessScore: 100 - stackScore,
    dimensions,
    rawDimensions,
    selectedOptionIds,
  };
}

export function calculateStackScore(dimensions: DimensionVector): number {
  const score =
    STACK_SCORE_WEIGHTS.consistency * dimensions.consistency +
    STACK_SCORE_WEIGHTS.tracking * dimensions.tracking +
    STACK_SCORE_WEIGHTS.safetyAwareness * dimensions.safetyAwareness +
    STACK_SCORE_WEIGHTS.overload * (1 - dimensions.overload);

  return clamp(Math.round(100 * score), 0, 100);
}

export function normalizeDimensions(rawDimensions: RawDimensionVector): DimensionVector {
  return {
    volume: normalizeDimension('volume', rawDimensions.volume),
    consistency: normalizeDimension('consistency', rawDimensions.consistency),
    tracking: normalizeDimension('tracking', rawDimensions.tracking),
    trendPull: normalizeDimension('trendPull', rawDimensions.trendPull),
    overload: normalizeDimension('overload', rawDimensions.overload),
    safetyAwareness: normalizeDimension('safetyAwareness', rawDimensions.safetyAwareness),
  };
}

export function chooseResultType(scores: Map<ResultTypeId, number>): ResultTypeId {
  const maxScore = Math.max(...scores.values());
  const tied = [...scores.entries()]
    .filter(([, score]) => score === maxScore)
    .map(([id]) => id);

  return (
    RESULT_TIE_BREAK_ORDER.find((id) => tied.includes(id)) ??
    tied[0] ??
    QUIZ_RESULTS[0].id
  );
}

function initializeResultScores(): Map<ResultTypeId, number> {
  return new Map(QUIZ_RESULTS.map((result) => [result.id, 0]));
}

function emptyRawDimensions(): RawDimensionVector {
  return {
    volume: 0,
    consistency: 0,
    tracking: 0,
    trendPull: 0,
    overload: 0,
    safetyAwareness: 0,
  };
}

function normalizeDimension(dimension: QuizDimension, value: number): number {
  const { min, max } = DIMENSION_LIMITS[dimension];
  return clamp((value - min) / (max - min), 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
