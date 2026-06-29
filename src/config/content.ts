// ============================================================
// Site Content Configuration — 텍스트/데이터 관리
// ============================================================
// 사이트에 표시되는 모든 텍스트를 여기서 수정할 수 있습니다.
// ============================================================

export const SITE_CONFIG = {
  // 브랜드
  brandName: 'Stack Clarity',
  copyright: '© 2026 Stack Clarity. All rights reserved.',

  // 히어로 섹션
  hero: {
    titleLeft: ['What is your', 'supplement'],
    titleRight: ['stack', 'type?'],
    watermark: 'STACK?',
    description:
      'Take the 60-second quiz, get your Stack Type, and see whether your routine is clean, chaotic, or quietly doing too much.',
  },

  // 시네마틱 텍스트 섹션
  cinematic: {
    text: 'Your supplement stack is not random. It has a type.',
  },

  // 성능 지표 섹션
  metrics: {
    subtitle: 'Why people share it',
    items: [
      { value: '60 sec', label: 'Free Stack Type Quiz' },
      { value: 'Share', label: 'Result worth sending to friends' },
      { value: '$7', label: 'Optional one-page reset' },
    ],
  },

  // 기술 섹션
  technology: {
    title: ['Your stack', 'has a type'],
    description:
      'No diagnosis. No miracle claims. Just a faster way to understand the routine you already built.',
    features: [
      {
        title: 'Stack Type',
        desc: 'A personality-style result that feels personal enough to share.',
      },
      {
        title: 'Messiness Score',
        desc: 'A quick number that makes your routine feel visible.',
      },
      {
        title: 'Gentle or Roast',
        desc: 'Pick the tone before your result becomes a share card.',
      },
      {
        title: 'Reset Hint',
        desc: 'One clear next step before buying another bottle.',
      },
    ],
  },

  // 아키텍처 섹션
  architecture: {
    subtitle: 'Paid Report',
    heading: 'From "I take a lot" to a clean 7-day reset.',
    description:
      'The report turns your current routine into a practical Keep / Check / Track / Ask framework.',
    layers: [
      { num: 1, name: 'Keep / Check' },
      { num: 2, name: 'Track / Ask' },
      { num: 3, name: '7-Day Reset' },
    ],
  },

  // 푸터
  footer: {
    tagline:
      'Find your Stack Type, clean up the routine, and ask better questions. Educational only, not medical advice.',
  },

  // 네비게이션
  nav: {
    links: [
      { label: 'How it works', scrollMultiplier: 1 },
      { label: 'Pricing', scrollMultiplier: 2 },
    ],
    downloadLabel: 'Take Quiz',
  },
};
