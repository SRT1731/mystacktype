// ============================================================
// Site Content Configuration — 텍스트/데이터 관리
// ============================================================

export const SITE_CONFIG = {
  brandName: 'KeepLine',
  copyright: '© 2026 KeepLine',
  tagline: '애써 만든 라인, 그대로.',

  hero: {
    titleLeft: ['애써 뺀 몸,', '끊어도 그대로일까요?'],
    titleRight: ['60초', '무료 점검'],
    watermark: 'KEEP',
    description:
      '마운자로·위고비로 만든 라인과 탄력, 끊은 뒤에도 지키는 법. 60초면 내 요요 위험부터 확인해요.',
  },

  cinematic: {
    text: '끊고 나서야 보여요. 빠진 게 지방만이 아니었다는 걸.',
  },

  metrics: {
    subtitle: '무료 점검 결과',
    items: [
      { value: '60초', label: '무료 점검' },
      { value: '점수', label: '요요 위험' },
      { value: '질문', label: '진료 때 물어볼 것' },
    ],
  },

  technology: {
    title: ['점검하면,', '이게 나와요'],
    description:
      '위험 타입, 요요 위험 점수, 약한 부분, 진료 때 물어볼 질문을 한 번에 정리해요.',
    features: [
      {
        title: '내 타입',
        desc: '지금 내가 어떤 흐름에 있는지 보여줘요.',
      },
      {
        title: '요요 위험 점수',
        desc: '0~100으로 한눈에 확인해요.',
      },
      {
        title: '약한 부분',
        desc: '어디부터 흔들리는지 먼저 봐요.',
      },
      {
        title: '물어볼 질문',
        desc: '진료 때 그대로 쓸 질문을 정리해요.',
      },
    ],
  },

  architecture: {
    subtitle: 'Early Access',
    heading: '출시 대기명단',
    description:
      '결제는 아직 안 받아요. 자리만 잡아두세요. 지금 대기명단에 올리면 출시 때 창립 멤버 가격이 그대로 고정됩니다.',
    layers: [
      { num: 1, name: '위험 축' },
      { num: 2, name: '유지 체크포인트' },
      { num: 3, name: '물어볼 질문' },
    ],
  },

  footer: {
    tagline: 'KeepLine · 킵라인',
    disclaimer:
      '본 점검은 교육용 참고 정보이며 의학적 진단·치료·처방을 대신하지 않습니다. GLP-1(마운자로·위고비 등)은 전문의약품이며, 복용·용량·중단은 반드시 담당 의사와 상의하세요. 킵라인은 의료기관이 아니며, 점검 결과는 생활관리 참고용입니다.',
  },

  nav: {
    links: [
      { label: '점검 결과', scrollMultiplier: 1 },
      { label: '사전예약', scrollMultiplier: 2 },
    ],
    downloadLabel: '무료 점검',
  },
};
