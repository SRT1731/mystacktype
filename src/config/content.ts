// ============================================================
// Site Content Configuration — 텍스트/데이터 관리
// ============================================================

export const SITE_CONFIG = {
  brandName: 'Stack Clarity',
  copyright: '© 2026 Stack Clarity',

  hero: {
    titleLeft: ['GLP-1', '근손실'],
    titleRight: ['위험', '몇 점?'],
    watermark: 'MUSCLE?',
    description:
      '마운자로·위고비 맞는 중이라면 60초 진단. 잘 빠지는 게 다가 아닙니다 — 뭐가 같이 빠지는지가 중요해요.',
  },

  cinematic: {
    text: '끊고 나서야 알게 돼요. 빠진 게 지방만이 아니었다는 걸.',
  },

  metrics: {
    subtitle: '무료 진단이 보여주는 것',
    items: [
      { value: '60초', label: '무료 근손실 위험 진단' },
      { value: '6축', label: '근손실 위험 분석' },
      { value: '공유', label: '결과 카드' },
    ],
  },

  technology: {
    title: ['진단이', '알려주는 것'],
    description:
      '의학적 판단을 대신하지 않습니다. 내 상태를 정리하고 담당 의사에게 더 나은 질문을 하기 위한 교육용 진단입니다.',
    features: [
      {
        title: '위험 타입',
        desc: '현재 구간을 폭주 감량형, 저섭취 취약형, 리바운드 경계형 등으로 보여줍니다.',
      },
      {
        title: '위험 점수',
        desc: '감량 속도, 단백질, 근력운동, 섭취 여력, 회복, 유지 준비도를 0~100으로 정리합니다.',
      },
      {
        title: '6축 레이더',
        desc: '어느 축이 약한지 한눈에 보고 상담 전 질문을 준비할 수 있습니다.',
      },
      {
        title: '물어볼 질문',
        desc: '진료 때 바로 가져갈 수 있는 질문 3개를 무료 결과에 포함합니다.',
      },
    ],
  },

  architecture: {
    subtitle: 'Early Access',
    heading: "약 끊었을 때 요요를 막는 '유지 코치'를 만들고 있어요.",
    description:
      '감량 이후의 공백을 줄이기 위해 위험 축, 상담 질문, 유지 체크포인트를 한곳에 모으는 코치를 준비 중입니다. 미출시 시 전액 환불됩니다.',
    layers: [
      { num: 1, name: '위험 축 확인' },
      { num: 2, name: '상담 질문 정리' },
      { num: 3, name: '유지 체크포인트' },
    ],
  },

  footer: {
    tagline:
      '내 근손실 위험을 알고, 근육 지키며 감량하고, 더 나은 질문을 하세요. 본 서비스는 교육용 정보이며 의학적 조언을 대신하지 않습니다.',
  },

  nav: {
    links: [
      { label: '진단 방식', scrollMultiplier: 1 },
      { label: '사전예약', scrollMultiplier: 2 },
    ],
    downloadLabel: '무료 진단',
  },
};
