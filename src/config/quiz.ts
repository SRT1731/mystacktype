export type ResultTypeId =
  | 'runaway'
  | 'undereater'
  | 'plateau'
  | 'rebound'
  | 'defender'
  | 'balanced';

export type StackTypeId = ResultTypeId;
export type ResultTone = 'normal' | 'strong' | 'roast';

export type QuizDimension =
  | 'lossSpeed'
  | 'protein'
  | 'strengthTraining'
  | 'intakeCapacity'
  | 'recovery'
  | 'maintenanceReadiness';

export type RadarAxis = QuizDimension;
export type DimensionVector = Record<RadarAxis, number>;
export type RawDimensionVector = Record<QuizDimension, number>;

export interface QuizOption {
  id: string;
  label: string;
  helper?: string;
  weights?: Partial<Record<ResultTypeId, number>>;
  dimensions?: Partial<Record<QuizDimension, number>>;
  tone?: ResultTone;
}

export interface QuizQuestion {
  id: string;
  eyebrow: string;
  title: string;
  helper?: string;
  options: QuizOption[];
}

export interface StackTypeResult {
  id: ResultTypeId;
  emoji: string;
  name: string;
  shortName: string;
  tagline: string;
  rarity: number;
  description: string;
  signals: string[];
  resetHint: string;
  paidReportAngle: string;
  paywallHeadline: string;
  shareCopy: Record<ResultTone, string>;
}

export interface QuizOutcome {
  resultType: ResultTypeId;
  result: StackTypeResult;
  tone: ResultTone;
  stackScore: number;
  messinessScore: number;
  dimensions: DimensionVector;
  rawDimensions: RawDimensionVector;
  selectedOptionIds: string[];
  insights: string[];
  doctorQuestions: string[];
}

export const RESULT_SCREEN_FOOTER =
  '본 진단은 교육용 정보이며 의학적 진단·조언·처방을 대신하지 않습니다. GLP-1은 전문의약품이며 복용·용량·중단은 반드시 담당 의사와 상의하세요.';

export const RESERVATION_HEADLINE =
  '약을 줄이거나 중단할 때, 유지 루틴을 같이 준비해요.';

export const RESERVATION_SUBHEAD =
  '초기 멤버에게 먼저 여는 사전예약. 출시되지 않으면 전액 환불.';

export const DIMENSION_LABELS: Record<QuizDimension, string> = {
  lossSpeed: '감량 속도',
  protein: '단백질',
  strengthTraining: '근력운동',
  intakeCapacity: '섭취 여력',
  recovery: '회복·컨디션',
  maintenanceReadiness: '유지 준비도',
};

export const DIMENSION_LIMITS: Record<QuizDimension, { min: number; max: number }> = {
  lossSpeed: { min: 0, max: 9 },
  protein: { min: 0, max: 9 },
  strengthTraining: { min: 0, max: 9 },
  intakeCapacity: { min: 0, max: 9 },
  recovery: { min: 0, max: 9 },
  maintenanceReadiness: { min: 0, max: 9 },
};

export const RESULT_TIE_BREAK_ORDER: ResultTypeId[] = [
  'rebound',
  'undereater',
  'plateau',
  'runaway',
  'defender',
  'balanced',
];

export const QUIZ_RESULTS: StackTypeResult[] = [
  {
    id: 'runaway',
    emoji: '↘',
    name: '폭주 감량형',
    shortName: '폭주형',
    tagline: '숫자는 잘 빠지는데, 안쪽도 같이 흔들리는 구간.',
    rarity: 22,
    description:
      '감량 속도는 빠른데 식사, 운동, 회복 신호가 같이 흔들리는 구간이에요. 지금은 체중보다 루틴을 먼저 점검할 타이밍입니다.',
    signals: ['최근 한 달 감량 속도가 빠름', '섭취량이 줄어듦', '회복감이 떨어짐', '유지 준비가 부족함'],
    resetHint:
      '속도보다 구성이 먼저예요. 담당 의사에게 현재 속도와 근력 변화에 대해 확인할 질문을 정리하세요.',
    paidReportAngle:
      '유지 코치는 감량 속도, 단백질, 근력운동, 회복 신호를 한 화면에서 점검하는 방향으로 설계 중입니다.',
    paywallHeadline: RESERVATION_HEADLINE,
    shareCopy: {
      normal: '내 근손실 위험은 {score}점, 폭주 감량형이래.',
      strong: '{score}점 폭주 감량형. 잘 빠지는 게 다가 아니었네.',
      roast: '근손실 위험 {score}점 폭주 감량형 인정… 오늘부터 단백질 좀 먹자.',
    },
  },
  {
    id: 'undereater',
    emoji: '▽',
    name: '저섭취 취약형',
    shortName: '저섭취형',
    tagline: '거의 못 먹는 구간. 근육이 먼저 흔들릴 수 있어요.',
    rarity: 18,
    description:
      '먹는 양이 크게 줄어 단백질과 회복 여력이 부족해질 수 있는 구간이에요. 잘 빠지는 것처럼 보여도 버틸 기반은 따로 봐야 합니다.',
    signals: ['한 끼 양이 크게 줄어듦', '단백질 관리가 약함', '컨디션 저하가 있음', '물·전해질 관리가 부족함'],
    resetHint:
      '무리해서 줄이는 문제가 아니라, 충분히 버틸 기반이 약한 상태일 수 있어요. 담당 의사에게 섭취 여력과 회복 신호를 같이 물어보세요.',
    paidReportAngle:
      '유지 코치는 부족한 축을 먼저 보여주고, 다음 상담 때 물어볼 질문을 정리하는 방향으로 준비 중입니다.',
    paywallHeadline: RESERVATION_HEADLINE,
    shareCopy: {
      normal: '내 근손실 위험은 {score}점, 저섭취 취약형이래.',
      strong: '{score}점 저섭취 취약형. 잘 빠지는 게 다가 아니었네.',
      roast: '근손실 위험 {score}점 저섭취 취약형 인정… 오늘부터 단백질 좀 먹자.',
    },
  },
  {
    id: 'plateau',
    emoji: '＝',
    name: '정체 고민형',
    shortName: '정체형',
    tagline: '효과가 둔해진 구간. 다음 선택이 중요해요.',
    rarity: 16,
    description:
      '효과가 둔해졌다고 느끼는 구간이에요. 더 밀어붙이기보다 단백질, 운동, 회복 신호를 같이 점검할 때입니다.',
    signals: ['효과 둔화 체감', '감량 속도 변화', '운동·단백질 루틴 점검 필요', '다음 상담 질문 필요'],
    resetHint:
      '정체기는 더 세게 밀기보다 현재 루틴을 점검할 타이밍이에요. 담당 의사와 몸 상태·유지 전략을 같이 확인하세요.',
    paidReportAngle:
      '유지 코치는 정체 구간에서 놓치기 쉬운 단백질, 근력운동, 회복 신호를 정리하는 방향입니다.',
    paywallHeadline: RESERVATION_HEADLINE,
    shareCopy: {
      normal: '내 근손실 위험은 {score}점, 정체 고민형이래.',
      strong: '{score}점 정체 고민형. 잘 빠지는 게 다가 아니었네.',
      roast: '근손실 위험 {score}점 정체 고민형 인정… 오늘부터 단백질 좀 먹자.',
    },
  },
  {
    id: 'rebound',
    emoji: '↺',
    name: '리바운드 경계형',
    shortName: '리바운드형',
    tagline: '유지 구간의 창이 열렸어요. 여기서 흐름이 갈립니다.',
    rarity: 14,
    description:
      '감량 후 유지로 넘어가는 구간이에요. 루틴이 비어 있으면 체중보다 생활 리듬이 먼저 흔들릴 수 있습니다.',
    signals: ['유지 또는 종료 구간', '유지 계획 부족', '감량 이후 루틴 전환 필요', '회복·운동 점검 필요'],
    resetHint:
      '지금은 숫자보다 유지 루틴이 중요한 구간이에요. 담당 의사에게 종료 전후 관리와 근력 변화에 대해 질문하세요.',
    paidReportAngle:
      '유지 코치는 종료 전후의 루틴 공백을 줄이고, 상담 질문을 놓치지 않게 돕는 방향으로 만들고 있습니다.',
    paywallHeadline: RESERVATION_HEADLINE,
    shareCopy: {
      normal: '내 근손실 위험은 {score}점, 리바운드 경계형이래.',
      strong: '{score}점 리바운드 경계형. 잘 빠지는 게 다가 아니었네.',
      roast: '근손실 위험 {score}점 리바운드 경계형 인정… 오늘부터 단백질 좀 먹자.',
    },
  },
  {
    id: 'defender',
    emoji: '◆',
    name: '근육 사수형',
    shortName: '사수형',
    tagline: '방향은 맞아요. 이제 유지력이 승부예요.',
    rarity: 12,
    description:
      '방향은 좋아요. 단백질과 근력운동 축이 살아 있어서, 이제 이 흐름을 유지 구간까지 이어가는 게 핵심입니다.',
    signals: ['단백질 관리 양호', '근력운동 루틴 있음', '컨디션 비교적 안정', '유지 계획 점검 가능'],
    resetHint:
      '이미 좋은 축이 있어요. 이 루틴을 유지 구간에서도 이어갈 수 있는지 담당 의사와 점검하세요.',
    paidReportAngle:
      '유지 코치는 좋은 루틴이 끊기지 않도록 체크포인트와 질문을 정리하는 방향입니다.',
    paywallHeadline: RESERVATION_HEADLINE,
    shareCopy: {
      normal: '내 근손실 위험은 {score}점, 근육 사수형이래.',
      strong: '{score}점 근육 사수형. 잘 빠지는 게 다가 아니었네.',
      roast: '근손실 위험 {score}점 근육 사수형 인정… 오늘부터 단백질 좀 먹자.',
    },
  },
  {
    id: 'balanced',
    emoji: '◌',
    name: '균형 관리형',
    shortName: '균형형',
    tagline: '큰 위험 신호는 낮지만, 방심하면 틈이 생겨요.',
    rarity: 18,
    description:
      '큰 위험 신호는 낮지만 방심하기 쉬운 구간이에요. 약한 축 한두 개만 먼저 챙겨도 유지 준비가 훨씬 선명해집니다.',
    signals: ['전반적 위험 낮음', '일부 축 보완 가능', '공유 가능한 기준점 확보', '상담 질문 정리 필요'],
    resetHint:
      '지금은 위험을 키우지 않는 관리가 중요해요. 약한 축 한두 개를 먼저 확인하세요.',
    paidReportAngle:
      '유지 코치는 현재 균형을 유지하고 약한 축만 빠르게 확인하는 방향으로 준비 중입니다.',
    paywallHeadline: RESERVATION_HEADLINE,
    shareCopy: {
      normal: '내 근손실 위험은 {score}점, 균형 관리형이래.',
      strong: '{score}점 균형 관리형. 잘 빠지는 게 다가 아니었네.',
      roast: '근손실 위험 {score}점 균형 관리형 인정… 오늘부터 단백질 좀 먹자.',
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'journey_stage',
    eyebrow: 'Q1',
    title: '지금 GLP-1 여정 어디쯤이에요?',
    options: [
      { id: 'stage_start', label: '막 시작 (1개월 미만)', dimensions: { maintenanceReadiness: 2 }, weights: { balanced: 1 } },
      { id: 'stage_early_loss', label: '감량 초반', dimensions: { lossSpeed: 1, maintenanceReadiness: 2 }, weights: { balanced: 1 } },
      { id: 'stage_mid_loss', label: '감량 중반', dimensions: { lossSpeed: 2, maintenanceReadiness: 2 }, weights: { runaway: 1 } },
      { id: 'stage_plateau', label: '정체기(효과 둔화)', dimensions: { maintenanceReadiness: 4, recovery: 1 }, weights: { plateau: 8 } },
      { id: 'stage_near_goal', label: '목표 근접', dimensions: { maintenanceReadiness: 4 }, weights: { rebound: 2 } },
      { id: 'stage_maintenance', label: '유지 중', dimensions: { maintenanceReadiness: 5 }, weights: { rebound: 5 } },
      { id: 'stage_stopped', label: '이미 끊음', dimensions: { maintenanceReadiness: 6 }, weights: { rebound: 7 } },
    ],
  },
  {
    id: 'duration',
    eyebrow: 'Q2',
    title: '사용한 지 얼마나 됐어요?',
    options: [
      { id: 'duration_under_1m', label: '1개월 미만', dimensions: { maintenanceReadiness: 2 }, weights: { balanced: 1 } },
      { id: 'duration_1_3m', label: '1~3개월', dimensions: { maintenanceReadiness: 2 }, weights: { balanced: 1 } },
      { id: 'duration_3_6m', label: '3~6개월', dimensions: { maintenanceReadiness: 3 }, weights: { runaway: 1 } },
      { id: 'duration_6m_plus', label: '6개월 이상', dimensions: { maintenanceReadiness: 4 }, weights: { rebound: 1, plateau: 1 } },
    ],
  },
  {
    id: 'monthly_loss_speed',
    eyebrow: 'Q3',
    title: '최근 한 달, 체중이 빠지는 속도는?',
    options: [
      { id: 'loss_none', label: '거의 없음', dimensions: { lossSpeed: 0 }, weights: { plateau: 2, balanced: 1 } },
      { id: 'loss_slow', label: '완만', dimensions: { lossSpeed: 2 }, weights: { balanced: 2, defender: 1 } },
      { id: 'loss_fast', label: '빠름', dimensions: { lossSpeed: 6 }, weights: { runaway: 3 } },
      { id: 'loss_very_fast', label: '매우 빠름', dimensions: { lossSpeed: 9 }, weights: { runaway: 5, undereater: 1 } },
    ],
  },
  {
    id: 'protein',
    eyebrow: 'Q4',
    title: '하루 단백질, 얼마나 챙겨요?',
    options: [
      { id: 'protein_none', label: '거의 신경 안 씀', dimensions: { protein: 9 }, weights: { undereater: 4, runaway: 2 } },
      { id: 'protein_sometimes', label: '가끔', dimensions: { protein: 6 }, weights: { balanced: 1, undereater: 2 } },
      { id: 'protein_meals', label: '매끼 의식함', dimensions: { protein: 2 }, weights: { defender: 2, balanced: 1 } },
      { id: 'protein_target', label: '목표량을 계산해서 챙김', dimensions: { protein: 0 }, weights: { defender: 5 } },
    ],
  },
  {
    id: 'strength_training',
    eyebrow: 'Q5',
    title: '근력운동(웨이트·맨몸)은 주 몇 회?',
    options: [
      { id: 'training_none', label: '안 함', dimensions: { strengthTraining: 9 }, weights: { runaway: 2, undereater: 2 } },
      { id: 'training_1_2', label: '주 1~2회', dimensions: { strengthTraining: 5 }, weights: { balanced: 1 } },
      { id: 'training_3_4', label: '주 3~4회', dimensions: { strengthTraining: 1 }, weights: { defender: 4 } },
      { id: 'training_5_plus', label: '주 5회 이상', dimensions: { strengthTraining: 0 }, weights: { defender: 5 } },
    ],
  },
  {
    id: 'meal_amount',
    eyebrow: 'Q6',
    title: '요즘 한 끼 먹는 양은?',
    options: [
      { id: 'meal_barely', label: '거의 못 먹음', dimensions: { intakeCapacity: 9, recovery: 3 }, weights: { undereater: 8 } },
      { id: 'meal_half', label: '평소의 반 이하', dimensions: { intakeCapacity: 7, recovery: 2 }, weights: { undereater: 6, runaway: 1 } },
      { id: 'meal_less', label: '조금 줄었다', dimensions: { intakeCapacity: 3 }, weights: { balanced: 1 } },
      { id: 'meal_similar', label: '평소와 비슷', dimensions: { intakeCapacity: 0 }, weights: { defender: 1, balanced: 1 } },
    ],
  },
  {
    id: 'support_intake',
    eyebrow: 'Q7',
    title: '단백질 말고 따로 챙기는 게 있어요?',
    helper: '가장 가까운 항목 하나만 골라주세요.',
    options: [
      { id: 'support_none', label: '딱히 없음', dimensions: { intakeCapacity: 3, recovery: 1 }, weights: { undereater: 1 } },
      { id: 'support_water', label: '물·전해질', dimensions: { intakeCapacity: 2, recovery: 1 }, weights: { balanced: 1 } },
      { id: 'support_fiber', label: '식이섬유', dimensions: { intakeCapacity: 1 }, weights: { balanced: 1 } },
      { id: 'support_full', label: '비타민·미네랄까지 챙김', dimensions: { intakeCapacity: 0, recovery: 0 }, weights: { defender: 1 } },
    ],
  },
  {
    id: 'recovery',
    eyebrow: 'Q8',
    title: '요즘 컨디션·회복력은?',
    options: [
      { id: 'recovery_low', label: '기운 없고 자주 처진다', dimensions: { recovery: 8 }, weights: { runaway: 2, undereater: 2 } },
      { id: 'recovery_okay', label: '그냥저냥', dimensions: { recovery: 5 }, weights: { balanced: 1 } },
      { id: 'recovery_fine', label: '괜찮다', dimensions: { recovery: 2 }, weights: { balanced: 1, defender: 1 } },
      { id: 'recovery_good', label: '좋다', dimensions: { recovery: 0 }, weights: { defender: 2 } },
    ],
  },
  {
    id: 'muscle_change',
    eyebrow: 'Q9',
    title: '근육·근력 체감 변화는?',
    options: [
      { id: 'muscle_down', label: '빠진 것 같다', dimensions: { recovery: 7, strengthTraining: 2 }, weights: { runaway: 3, undereater: 2 } },
      { id: 'muscle_unsure', label: '잘 모르겠다', dimensions: { recovery: 4, maintenanceReadiness: 1 }, weights: { balanced: 1 } },
      { id: 'muscle_same', label: '유지되는 듯', dimensions: { recovery: 1 }, weights: { defender: 2, balanced: 1 } },
      { id: 'muscle_up', label: '오히려 늘었다', dimensions: { recovery: 0, strengthTraining: 0 }, weights: { defender: 4 } },
    ],
  },
  {
    id: 'stop_plan',
    eyebrow: 'Q10',
    title: '끊을 계획이 있어요?',
    options: [
      { id: 'stop_now', label: '지금 끊는 중', dimensions: { maintenanceReadiness: 9 }, weights: { rebound: 8 } },
      { id: 'stop_soon', label: '3개월 내 끊을 것', dimensions: { maintenanceReadiness: 7 }, weights: { rebound: 7 } },
      { id: 'stop_none', label: '아직 없음', dimensions: { maintenanceReadiness: 2 }, weights: { balanced: 1 } },
      { id: 'stop_continue', label: '계속 맞을 것', dimensions: { maintenanceReadiness: 3 }, weights: { balanced: 1 } },
      { id: 'stop_rebound', label: '이미 끊고 요요 겪는 중', dimensions: { maintenanceReadiness: 9, recovery: 2 }, weights: { rebound: 9 } },
    ],
  },
];

export const QUIZ_CONFIG = {
  id: 'glp1-muscle-risk-v1',
  title: '당신의 GLP-1 근손실 위험은 몇 점일까?',
  estimatedTime: '60초',
  disclaimer: RESULT_SCREEN_FOOTER,
  questions: QUIZ_QUESTIONS,
  results: QUIZ_RESULTS,
};
