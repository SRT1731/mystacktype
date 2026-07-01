// ============================================================
// Site Content Configuration — 텍스트/데이터 관리
// ============================================================

export const SITE_CONFIG = {
  brandName: 'Stack Clarity',
  copyright: '© 2026 Stack Clarity',

  hero: {
    titleLeft: ['살은 빠졌는데', '힘도 빠졌나요?'],
    titleRight: ['60초', '위험 점검'],
    watermark: 'CHECK',
    description:
      '마운자로·위고비 감량 중이라면 체중계 밖의 신호도 봐야 해요. 근손실·저섭취·유지 준비도를 60초로 확인하세요.',
  },

  cinematic: {
    text: '체중은 줄었는데, 식사량·근력·회복감이 같이 무너지면 유지가 어려워져요.',
  },

  metrics: {
    subtitle: '무료 진단 결과',
    items: [
      { value: '타입', label: '내 현재 위험 구간' },
      { value: '6축', label: '약한 축 한눈에 보기' },
      { value: '질문', label: '진료 전에 정리할 것' },
    ],
  },

  technology: {
    title: ['결과는', '딱 세 가지'],
    description:
      '긴 설명 대신 지금 확인해야 할 것만 보여줍니다. 판단은 담당 의사와, 준비는 더 똑똑하게.',
    features: [
      {
        title: '내 타입',
        desc: '폭주 감량형, 저섭취 취약형, 리바운드 경계형처럼 현재 구간을 짚어줍니다.',
      },
      {
        title: '위험 점수',
        desc: '감량 속도, 단백질, 운동, 섭취 여력, 회복, 유지 준비도를 한 점수로 봅니다.',
      },
      {
        title: '약한 축',
        desc: '어디가 먼저 무너지는지 레이더로 확인합니다.',
      },
      {
        title: '상담 질문',
        desc: '다음 진료 때 물어볼 질문을 바로 가져갈 수 있게 정리합니다.',
      },
    ],
  },

  architecture: {
    subtitle: 'Early Access',
    heading: '결과를 보고 끝나지 않게.',
    description:
      '진단 후에는 유지 코치 사전예약으로 이어집니다. 감량 이후의 공백을 줄이기 위한 체크포인트를 준비 중이며, 출시되지 않으면 전액 환불됩니다.',
    layers: [
      { num: 1, name: '결과 저장' },
      { num: 2, name: '유지 체크포인트' },
      { num: 3, name: '초기 멤버가' },
    ],
  },

  footer: {
    tagline:
      '체중계 숫자만 보지 마세요. 감량 중 놓치기 쉬운 근손실·유지 신호를 정리합니다. 본 서비스는 교육용 정보이며 의학적 조언을 대신하지 않습니다.',
  },

  nav: {
    links: [
      { label: '진단 방식', scrollMultiplier: 1 },
      { label: '사전예약', scrollMultiplier: 2 },
    ],
    downloadLabel: '무료 진단',
  },
};
