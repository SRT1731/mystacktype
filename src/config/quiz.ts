export type ResultTypeId =
  | 'minimalist'
  | 'precision_tracker'
  | 'optimizer'
  | 'trend_chaser'
  | 'collector'
  | 'reset_seeker';

export type StackTypeId = ResultTypeId;
export type ResultTone = 'normal' | 'strong' | 'roast';

export type QuizDimension =
  | 'volume'
  | 'consistency'
  | 'tracking'
  | 'trendPull'
  | 'overload'
  | 'safetyAwareness';

export type RadarAxis =
  | 'volume'
  | 'consistency'
  | 'tracking'
  | 'trendPull'
  | 'overload'
  | 'safetyAwareness';

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
}

export const RESULT_SCREEN_FOOTER =
  'For fun and reflection only — not medical advice. Ask a qualified professional for health questions.';

export const STACK_SCORE_WEIGHTS = {
  consistency: 0.28,
  tracking: 0.26,
  safetyAwareness: 0.24,
  overload: 0.22,
} as const;

// When scores tie, choose the result with the highest potential urgency first.
// This nudges unclear, noisy stacks toward a reset path instead of a flattering label.
export const RESULT_TIE_BREAK_ORDER: ResultTypeId[] = [
  'reset_seeker',
  'collector',
  'trend_chaser',
  'optimizer',
  'precision_tracker',
  'minimalist',
];

export const DIMENSION_LIMITS: Record<QuizDimension, { min: number; max: number }> = {
  volume: { min: 0, max: 22 },
  consistency: { min: -13, max: 18 },
  tracking: { min: -5, max: 24 },
  trendPull: { min: 0, max: 21 },
  overload: { min: 0, max: 29 },
  safetyAwareness: { min: -7, max: 14 },
};

export const QUIZ_RESULTS: StackTypeResult[] = [
  {
    id: 'minimalist',
    emoji: '□',
    name: 'The Minimalist',
    shortName: 'Minimalist',
    tagline: 'Few bottles. Fewer mysteries.',
    rarity: 14,
    description:
      'Your stack is small, repeatable, and mostly under control. You are not trying to win the supplement internet. You want a routine that makes sense and stays boring in a good way.',
    signals: [
      'Low supplement count',
      'Stable daily routine',
      'Less influenced by trends',
      'Clear reason for most items',
    ],
    resetHint:
      'Keep the routine simple, but write down the reason for each item so it does not become autopilot.',
    paidReportAngle:
      'A one-page reset can help you protect the simplicity and spot any item that no longer earns its place.',
    paywallHeadline: 'Keep it this clean as life adds bottles.',
    shareCopy: {
      normal: 'I got The Minimalist. My supplement stack is quiet, clean, and surprisingly adult.',
      strong: 'I got The Minimalist. Apparently my stack is the least dramatic part of my life.',
      roast: 'I got The Minimalist. My bottles are organized because my personality needed one easy win.',
    },
  },
  {
    id: 'precision_tracker',
    emoji: '◎',
    name: 'The Precision Tracker',
    shortName: 'Tracker',
    tagline: 'If it is not logged, did it even happen?',
    rarity: 11,
    description:
      'You like structure. You notice timing, effects, and patterns. Your strength is discipline. Your risk is turning a simple routine into a spreadsheet with feelings.',
    signals: [
      'Tracks effects or timing',
      'Likes repeatable routines',
      'Checks labels and details',
      'Makes changes deliberately',
    ],
    resetHint:
      'Choose one tracking metric for the next 7 days. More data is not always more clarity.',
    paidReportAngle:
      'The reset report can turn your tracking habit into a cleaner Keep / Check / Track framework.',
    paywallHeadline: 'Turn your tracking into one clear picture.',
    shareCopy: {
      normal: 'I got The Precision Tracker. My stack has notes, timing, and probably a tiny operations team.',
      strong: 'I got The Precision Tracker. I do not supplement, I run a dashboard.',
      roast: 'I got The Precision Tracker. My pill box has more process discipline than most startups.',
    },
  },
  {
    id: 'optimizer',
    emoji: '◇',
    name: 'The Optimizer',
    shortName: 'Optimizer',
    tagline: 'You do not buy supplements. You workshop them.',
    rarity: 8,
    description:
      'You like testing ideas before committing. You compare options, ask AI, read threads, and try to build a stack that matches how you feel today. Your edge is curiosity. Your risk is endless optimization.',
    signals: [
      'Uses AI or deep research',
      'Adapts based on daily condition',
      'Enjoys experimenting',
      'Wants a personal stack, not a popular one',
    ],
    resetHint:
      'Before adding anything new, define the question you are trying to answer. No question, no experiment.',
    paidReportAngle:
      'The reset report can turn scattered experiments into a clean 7-day decision path.',
    paywallHeadline: 'Give the endless optimizing a finish line.',
    shareCopy: {
      normal: 'I got The Optimizer. My routine is basically a conversation with my future self.',
      strong: 'I got The Optimizer. I asked one question and somehow designed a supplement roadmap.',
      roast: 'I got The Optimizer. My stack has more prompts than my workday.',
    },
  },
  {
    id: 'trend_chaser',
    emoji: '↗',
    name: 'The Trend Chaser',
    shortName: 'Trend Chaser',
    tagline: 'Your shelf has seen every new era.',
    rarity: 22,
    description:
      'You are curious and fast-moving. If a supplement keeps appearing in videos, newsletters, or group chats, it gets your attention. Your strength is discovery. Your risk is letting the internet write your routine.',
    signals: [
      'Influenced by social proof',
      'Tries new products quickly',
      'Has several half-used bottles',
      'Routine changes often',
    ],
    resetHint:
      'Pause new purchases for 7 days and list what each current item is supposed to do.',
    paidReportAngle:
      'The reset report can separate useful discoveries from trend leftovers.',
    paywallHeadline: 'Keep the hits, retire the rest.',
    shareCopy: {
      normal: 'I got The Trend Chaser. My stack is curious, social, and maybe a little too online.',
      strong: 'I got The Trend Chaser. If the internet whispers, my cart listens.',
      roast: 'I got The Trend Chaser. My supplement shelf has a faster content cycle than TikTok.',
    },
  },
  {
    id: 'collector',
    emoji: '▦',
    name: 'The Collector',
    shortName: 'Collector',
    tagline: 'A promising routine became a tiny archive.',
    rarity: 28,
    description:
      'You have accumulated a lot. Some items are useful, some are forgotten, and some are there because past-you was extremely convincing. Your strength is willingness to try. Your risk is clutter without clarity.',
    signals: [
      'High supplement count',
      'Some forgotten reasons',
      'Overlapping goals',
      'Routine feels hard to explain',
    ],
    resetHint:
      'Sort every bottle into three piles: Keep, Check, and Mystery. The Mystery pile is the real story.',
    paidReportAngle:
      'The reset report is built for turning a crowded shelf into a practical 7-day cleanup plan.',
    paywallHeadline: 'Sort the archive into Keep / Check / Mystery.',
    shareCopy: {
      normal: 'I got The Collector. My shelf has history, ambition, and a few open questions.',
      strong: 'I got The Collector. My stack is less routine, more archaeological site.',
      roast: 'I got The Collector. My cabinet looked at the quiz and asked for a lawyer.',
    },
  },
  {
    id: 'reset_seeker',
    emoji: '↺',
    name: 'The Reset Seeker',
    shortName: 'Reset Seeker',
    tagline: 'You do not need more. You need a clean start.',
    rarity: 17,
    description:
      'Your routine may not be huge, but it feels noisy. You want a calmer way to decide what stays, what needs checking, and what can wait. Your strength is self-awareness. Your risk is staying stuck because everything feels equally urgent.',
    signals: [
      'Feels unsure about the routine',
      'Wants simplification',
      'May skip or restart often',
      'Needs a clear next step',
    ],
    resetHint:
      'Pick one week where the goal is not improvement. The goal is observation.',
    paidReportAngle:
      'The reset report gives you a simple Keep / Check / Track / Ask map so the routine feels less foggy.',
    paywallHeadline: 'One calm starting point instead of ten urgent ones.',
    shareCopy: {
      normal: 'I got The Reset Seeker. My stack does not need drama, it needs a calmer plan.',
      strong: 'I got The Reset Seeker. The quiz said I need clarity before another checkout page.',
      roast: 'I got The Reset Seeker. My stack is not broken, it is just emotionally buffering.',
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'daily_count',
    eyebrow: 'Question 1',
    title: 'How many supplements do you use on a normal day?',
    helper: 'Count capsules, powders, gummies, drinks, and oils.',
    options: [
      {
        id: 'count_0_2',
        label: '0 to 2',
        weights: { minimalist: 4, reset_seeker: 1 },
        dimensions: { volume: 0, consistency: 2 },
      },
      {
        id: 'count_3_5',
        label: '3 to 5',
        weights: { precision_tracker: 2, optimizer: 1 },
        dimensions: { volume: 2, consistency: 1 },
      },
      {
        id: 'count_6_9',
        label: '6 to 9',
        weights: { optimizer: 2, collector: 3 },
        dimensions: { volume: 5, overload: 2 },
      },
      {
        id: 'count_10_plus',
        label: '10 or more',
        weights: { collector: 5, reset_seeker: 2 },
        dimensions: { volume: 8, overload: 4 },
      },
    ],
  },
  {
    id: 'decision_style',
    eyebrow: 'Question 2',
    title: 'How do you decide what goes into today?',
    options: [
      {
        id: 'decision_fixed',
        label: 'I follow the same routine most days',
        weights: { minimalist: 3, precision_tracker: 3 },
        dimensions: { consistency: 4, tracking: 1 },
      },
      {
        id: 'decision_body',
        label: 'I adjust based on how I feel',
        weights: { optimizer: 3, reset_seeker: 1 },
        dimensions: { consistency: -1, tracking: 1 },
      },
      {
        id: 'decision_ai',
        label: 'I discuss it with AI or research first',
        weights: { optimizer: 5, precision_tracker: 1 },
        dimensions: { tracking: 3, trendPull: 1 },
      },
      {
        id: 'decision_social',
        label: 'If everyone is talking about it, I check it out',
        weights: { trend_chaser: 5, collector: 1 },
        dimensions: { trendPull: 5, overload: 1 },
      },
      {
        id: 'decision_random',
        label: 'Honestly, whatever I remember',
        weights: { collector: 3, reset_seeker: 4 },
        dimensions: { consistency: -4, overload: 3 },
      },
    ],
  },
  {
    id: 'routine_memory',
    eyebrow: 'Question 3',
    title: 'How clearly do you remember why each item is in your stack?',
    options: [
      {
        id: 'memory_clear',
        label: 'Very clearly',
        weights: { minimalist: 2, precision_tracker: 3 },
        dimensions: { tracking: 3, safetyAwareness: 2 },
      },
      {
        id: 'memory_mostly',
        label: 'Mostly, but a few are fuzzy',
        weights: { optimizer: 1, reset_seeker: 2 },
        dimensions: { overload: 1 },
      },
      {
        id: 'memory_some',
        label: 'Some bottles are basically mysteries',
        weights: { collector: 4, reset_seeker: 3 },
        dimensions: { overload: 4, consistency: -2 },
      },
      {
        id: 'memory_none',
        label: 'I remember the purchase, not the reason',
        weights: { collector: 5, trend_chaser: 2 },
        dimensions: { overload: 5, trendPull: 2 },
      },
    ],
  },
  {
    id: 'shelf_state',
    eyebrow: 'Question 4',
    title: 'What does your supplement shelf look like?',
    options: [
      {
        id: 'shelf_clean',
        label: 'Small and easy to explain',
        weights: { minimalist: 5 },
        dimensions: { volume: 0, consistency: 3 },
      },
      {
        id: 'shelf_labeled',
        label: 'Organized, labeled, or tracked',
        weights: { precision_tracker: 5 },
        dimensions: { tracking: 4, consistency: 2 },
      },
      {
        id: 'shelf_active',
        label: 'A few active bottles, a few experiments',
        weights: { optimizer: 3, trend_chaser: 2 },
        dimensions: { trendPull: 2, overload: 1 },
      },
      {
        id: 'shelf_crowded',
        label: 'Crowded, but I swear it makes sense',
        weights: { collector: 5, optimizer: 1 },
        dimensions: { volume: 5, overload: 3 },
      },
      {
        id: 'shelf_chaos',
        label: 'A drawer, a bag, a backup drawer, and vibes',
        weights: { collector: 5, reset_seeker: 3 },
        dimensions: { volume: 6, overload: 5, consistency: -3 },
      },
    ],
  },
  {
    id: 'before_buying',
    eyebrow: 'Question 5',
    title: 'Before buying something new, what do you usually check?',
    options: [
      {
        id: 'buy_clinical',
        label: 'Interactions, label warnings, or a clinician question',
        weights: { precision_tracker: 3, minimalist: 1 },
        dimensions: { safetyAwareness: 5, tracking: 2 },
      },
      {
        id: 'buy_studies',
        label: 'Studies, reviews, and whether it fits my goal',
        weights: { optimizer: 3, precision_tracker: 2 },
        dimensions: { tracking: 3, safetyAwareness: 2 },
      },
      {
        id: 'buy_people',
        label: 'What people online are saying',
        weights: { trend_chaser: 5 },
        dimensions: { trendPull: 5 },
      },
      {
        id: 'buy_discount',
        label: 'The sale, bundle, or limited-time offer',
        weights: { trend_chaser: 3, collector: 3 },
        dimensions: { trendPull: 3, overload: 2 },
      },
      {
        id: 'buy_later',
        label: 'I usually buy first and organize later',
        weights: { collector: 5, reset_seeker: 2 },
        dimensions: { overload: 4, safetyAwareness: -2 },
      },
    ],
  },
  {
    id: 'tracking_style',
    eyebrow: 'Question 6',
    title: 'How do you track whether your stack is helping?',
    options: [
      {
        id: 'track_data',
        label: 'Notes, metrics, sleep data, mood, or symptoms',
        weights: { precision_tracker: 5, optimizer: 2 },
        dimensions: { tracking: 5, consistency: 1 },
      },
      {
        id: 'track_ai',
        label: 'I summarize changes with AI or a checklist',
        weights: { optimizer: 5, precision_tracker: 1 },
        dimensions: { tracking: 4 },
      },
      {
        id: 'track_memory',
        label: 'I keep it in my head',
        weights: { minimalist: 1, reset_seeker: 2 },
        dimensions: { tracking: -1 },
      },
      {
        id: 'track_feel',
        label: 'I go by vibes and general energy',
        weights: { trend_chaser: 2, reset_seeker: 2 },
        dimensions: { tracking: -2, trendPull: 1 },
      },
      {
        id: 'track_none',
        label: 'I do not really track it',
        weights: { collector: 3, reset_seeker: 4 },
        dimensions: { tracking: -4, overload: 2 },
      },
    ],
  },
  {
    id: 'skip_pattern',
    eyebrow: 'Question 7',
    title: 'What happens when your routine gets busy?',
    options: [
      {
        id: 'skip_rare',
        label: 'I rarely miss it',
        weights: { precision_tracker: 3, minimalist: 2 },
        dimensions: { consistency: 4 },
      },
      {
        id: 'skip_flexible',
        label: 'I skip without stress and restart tomorrow',
        weights: { minimalist: 2, reset_seeker: 1 },
        dimensions: { consistency: 1 },
      },
      {
        id: 'skip_stack',
        label: 'I accidentally combine random items later',
        weights: { collector: 3, reset_seeker: 3 },
        dimensions: { consistency: -3, overload: 3 },
      },
      {
        id: 'skip_research',
        label: 'I redesign the routine instead of doing it',
        weights: { optimizer: 4, reset_seeker: 2 },
        dimensions: { consistency: -2, tracking: 2 },
      },
      {
        id: 'skip_forget',
        label: 'I forget, then wonder if anything works',
        weights: { reset_seeker: 5, collector: 2 },
        dimensions: { consistency: -4, overload: 2 },
      },
    ],
  },
  {
    id: 'too_real',
    eyebrow: 'Question 8',
    title: 'Which sentence feels a little too real?',
    options: [
      {
        id: 'real_simple',
        label: 'I want fewer choices, not more bottles',
        weights: { reset_seeker: 5, minimalist: 2 },
        dimensions: { overload: 2 },
      },
      {
        id: 'real_research',
        label: 'Researching the stack is half the hobby',
        weights: { optimizer: 4, precision_tracker: 1 },
        dimensions: { tracking: 2, trendPull: 1 },
      },
      {
        id: 'real_online',
        label: 'My cart knows what trend I saw last night',
        weights: { trend_chaser: 5 },
        dimensions: { trendPull: 5, overload: 1 },
      },
      {
        id: 'real_shelf',
        label: 'I found a bottle and said, wait, I own this?',
        weights: { collector: 5, reset_seeker: 2 },
        dimensions: { volume: 3, overload: 5 },
      },
      {
        id: 'real_notes',
        label: 'I have notes on what changed and when',
        weights: { precision_tracker: 5 },
        dimensions: { tracking: 5, consistency: 2 },
      },
    ],
  },
  {
    id: 'safety_check',
    eyebrow: 'Question 9',
    title: 'How often do you check labels, timing, or possible conflicts?',
    helper:
      'This quiz is educational only. For medication, pregnancy, health conditions, or side effects, ask a qualified professional.',
    options: [
      {
        id: 'safety_often',
        label: 'Often. I check before changing things',
        weights: { precision_tracker: 4, minimalist: 1 },
        dimensions: { safetyAwareness: 5, tracking: 2 },
      },
      {
        id: 'safety_sometimes',
        label: 'Sometimes, especially if something feels strong',
        weights: { optimizer: 2, reset_seeker: 1 },
        dimensions: { safetyAwareness: 2 },
      },
      {
        id: 'safety_rarely',
        label: 'Rarely. I mostly trust the product page',
        weights: { trend_chaser: 3, collector: 2 },
        dimensions: { safetyAwareness: -3, trendPull: 2 },
      },
      {
        id: 'safety_unsure',
        label: 'I am not sure what I should be checking',
        weights: { reset_seeker: 5, collector: 1 },
        dimensions: { safetyAwareness: -2, overload: 3 },
      },
    ],
  },
  {
    id: 'result_tone',
    eyebrow: 'Final choice',
    title: 'How should your result talk to you?',
    helper: 'This only changes the share copy tone, not your result.',
    options: [
      {
        id: 'tone_normal',
        label: 'Normal',
        helper: 'Clean, supportive, no punches.',
        tone: 'normal',
      },
      {
        id: 'tone_strong',
        label: 'Strong',
        helper: 'Clear and a little sharper.',
        tone: 'strong',
      },
      {
        id: 'tone_roast',
        label: 'Roast me',
        helper: 'Funny, dramatic, still harmless.',
        tone: 'roast',
      },
    ],
  },
];

export const QUIZ_CONFIG = {
  id: 'stack-type-v2',
  title: 'What is your supplement stack type?',
  estimatedTime: '60 seconds',
  disclaimer: RESULT_SCREEN_FOOTER,
  questions: QUIZ_QUESTIONS,
  results: QUIZ_RESULTS,
};
