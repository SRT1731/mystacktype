// ============================================================
// Site Content Configuration — 텍스트/데이터 관리
// ============================================================

export const SITE_CONFIG = {
  brandName: '근지킴',
  copyright: '© 2026 근지킴',
  tagline: '살 빼는 주사, 근육까지 빼지 마세요.',

  hero: {
    titleLeft: ['내 근육,', '지금 안전할까?'],
    titleRight: ['60초', '자가 점검'],
    watermark: 'CHECK',
    description:
      '마운자로·위고비 사용 중이라면, 지금 내 근손실 위험과 진료 때 물어볼 질문을 정리해 보세요.',
  },

  cinematic: {
    text: '살만 빠지는 게 아니에요.',
  },

  metrics: {
    subtitle: '무료 자가 점검 결과',
    items: [
      { value: '60초', label: '자가 점검' },
      { value: '그래프', label: '내 약점 한눈에' },
      { value: '공유', label: '결과 카드' },
    ],
  },

  technology: {
    title: ['점검하면', '이게 나와요'],
    description:
      '길게 설명 안 해요. 지금 볼 것만 딱.',
    features: [
      {
        title: '내 상태',
        desc: '지금 내가 어떤 흐름에 있는지 보여줘요.',
      },
      {
        title: '위험 점수',
        desc: '0~100으로 한눈에 확인해요.',
      },
      {
        title: '약한 부분',
        desc: '어디부터 흔들리는지 먼저 봐요.',
      },
      {
        title: '상담 질문',
        desc: '진료 때 그대로 쓸 질문을 정리해요.',
      },
    ],
  },

  architecture: {
    subtitle: 'Early Access',
    heading: '결과를 보고 끝나지 않게.',
    description:
      '자가 점검 후에는 유지 코치 사전예약으로 이어집니다. 감량 이후의 공백을 줄이기 위한 체크포인트를 준비 중이며, 출시되지 않으면 전액 환불됩니다.',
    layers: [
      { num: 1, name: '결과 저장' },
      { num: 2, name: '유지 체크포인트' },
      { num: 3, name: '초기 멤버가' },
    ],
  },

  footer: {
    tagline: '근지킴 · © 2026',
    disclaimer:
      '교육용 정보이며 의학적 진단·처방을 대신하지 않습니다. 복용·중단은 담당 의사와 상의하세요.',
  },

  nav: {
    links: [
      { label: '자가 점검 방식', scrollMultiplier: 1 },
      { label: '사전예약', scrollMultiplier: 2 },
    ],
    downloadLabel: '무료 자가 점검',
  },
};
