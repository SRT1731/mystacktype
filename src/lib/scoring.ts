import {
  DIMENSION_LABELS,
  DIMENSION_LIMITS,
  QUIZ_QUESTIONS,
  QUIZ_RESULTS,
  RESULT_TIE_BREAK_ORDER,
  type DimensionVector,
  type QuizDimension,
  type QuizOutcome,
  type RawDimensionVector,
  type ResultTone,
  type ResultTypeId,
} from '../config/quiz';

const DIMENSION_KEYS: QuizDimension[] = [
  'lossSpeed',
  'protein',
  'strengthTraining',
  'intakeCapacity',
  'recovery',
  'maintenanceReadiness',
];

const INSIGHT_COPY: Record<QuizDimension, string> = {
  lossSpeed: '감량 속도가 빨라요. 숫자 변화만 보지 말고 근력과 컨디션도 같이 확인할 때예요.',
  protein: '단백질이 약한 편이에요. 담당 의사에게 현재 식사량에서 무엇을 점검하면 좋을지 물어보세요.',
  strengthTraining: '근력운동이 약한 편이에요. 운동 루틴이 비면 감량 후 버티는 힘도 흔들릴 수 있어요.',
  intakeCapacity: '먹는 양이 부족한 편이에요. 거의 못 먹는 날이 이어지면 회복감과 근력 체감도 같이 흔들릴 수 있어요.',
  recovery: '회복감이 약한 편이에요. 기운 없음, 회복감 저하, 근력 체감 변화를 상담 때 구체적으로 말해보세요.',
  maintenanceReadiness: '끊어도 버틸 힘이 아직 약한 편이에요. 종료 전후 루틴 공백이 생기지 않게 질문을 미리 정리하세요.',
};

const DOCTOR_QUESTION_COPY: Record<QuizDimension, string> = {
  lossSpeed: '최근 감량 속도와 근력 체감 변화를 같이 보면 어떤 점을 확인해야 하나요?',
  protein: '현재 식사량에서 단백질과 영양 상태를 어떻게 점검하면 좋을까요?',
  strengthTraining: '제 상태에서 근력운동 루틴을 어느 정도로 잡는 게 안전할까요?',
  intakeCapacity: '식사량이 줄어든 기간이 길어질 때 어떤 신호를 봐야 하나요?',
  recovery: '기운 없음, 회복감 저하, 근력 체감 변화가 있을 때 어떤 검사가 도움이 될까요?',
  maintenanceReadiness: '약을 줄이거나 끊기 전에 어떤 준비를 해두면 좋을까요?',
};

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

  const dimensions = normalizeDimensions(rawDimensions);
  const stackScore = calculateRiskScore(dimensions);
  const resultType = chooseResultType(resultScores, selectedOptionIds, stackScore);
  const result = QUIZ_RESULTS.find((item) => item.id === resultType) ?? QUIZ_RESULTS[0];

  return {
    resultType,
    result,
    tone,
    stackScore,
    messinessScore: stackScore,
    dimensions,
    rawDimensions,
    selectedOptionIds,
    insights: buildInsights(dimensions),
    doctorQuestions: buildDoctorQuestions(dimensions),
  };
}

export function calculateRiskScore(dimensions: DimensionVector): number {
  const average =
    DIMENSION_KEYS.reduce((sum, dimension) => sum + dimensions[dimension], 0) /
    DIMENSION_KEYS.length;

  return clamp(Math.round(average * 100), 0, 100);
}

export const calculateStackScore = calculateRiskScore;

export function normalizeDimensions(rawDimensions: RawDimensionVector): DimensionVector {
  return {
    lossSpeed: normalizeDimension('lossSpeed', rawDimensions.lossSpeed),
    protein: normalizeDimension('protein', rawDimensions.protein),
    strengthTraining: normalizeDimension(
      'strengthTraining',
      rawDimensions.strengthTraining
    ),
    intakeCapacity: normalizeDimension('intakeCapacity', rawDimensions.intakeCapacity),
    recovery: normalizeDimension('recovery', rawDimensions.recovery),
    maintenanceReadiness: normalizeDimension(
      'maintenanceReadiness',
      rawDimensions.maintenanceReadiness
    ),
  };
}

export function chooseResultType(
  scores: Map<ResultTypeId, number>,
  selectedOptionIds: string[] = [],
  riskScore = 0
): ResultTypeId {
  if (selectedOptionIds.includes('stage_plateau')) return 'plateau';

  if (
    selectedOptionIds.some((id) =>
      ['stop_now', 'stop_soon', 'stop_rebound', 'stage_maintenance', 'stage_stopped'].includes(id)
    )
  ) {
    return 'rebound';
  }

  if (selectedOptionIds.some((id) => ['meal_barely', 'meal_half'].includes(id))) {
    return 'undereater';
  }

  if (riskScore >= 70) return 'runaway';

  if (
    selectedOptionIds.includes('protein_target') &&
    selectedOptionIds.some((id) => ['training_3_4', 'training_5_plus'].includes(id))
  ) {
    return 'defender';
  }

  const maxScore = Math.max(...scores.values());
  const tied = [...scores.entries()]
    .filter(([, score]) => score === maxScore)
    .map(([id]) => id);

  return (
    RESULT_TIE_BREAK_ORDER.find((id) => tied.includes(id)) ??
    tied[0] ??
    'balanced'
  );
}

function initializeResultScores(): Map<ResultTypeId, number> {
  return new Map(QUIZ_RESULTS.map((result) => [result.id, 0]));
}

function emptyRawDimensions(): RawDimensionVector {
  return {
    lossSpeed: 0,
    protein: 0,
    strengthTraining: 0,
    intakeCapacity: 0,
    recovery: 0,
    maintenanceReadiness: 0,
  };
}

function buildInsights(dimensions: DimensionVector): string[] {
  return topRiskDimensions(dimensions)
    .slice(0, 3)
    .map((dimension) => INSIGHT_COPY[dimension]);
}

function buildDoctorQuestions(dimensions: DimensionVector): string[] {
  return topRiskDimensions(dimensions)
    .slice(0, 3)
    .map((dimension) => DOCTOR_QUESTION_COPY[dimension]);
}

function topRiskDimensions(dimensions: DimensionVector): QuizDimension[] {
  return [...DIMENSION_KEYS].sort((a, b) => {
    const valueDiff = dimensions[b] - dimensions[a];
    if (valueDiff !== 0) return valueDiff;
    return DIMENSION_LABELS[a].localeCompare(DIMENSION_LABELS[b], 'ko');
  });
}

function normalizeDimension(dimension: QuizDimension, value: number): number {
  const { min, max } = DIMENSION_LIMITS[dimension];
  return clamp((value - min) / (max - min), 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
