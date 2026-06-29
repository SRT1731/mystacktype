// ============================================================
// PayPal Configuration — @paypal/react-paypal-js 기반
// ============================================================
// 
// 설정 방법:
// 1. https://developer.paypal.com/dashboard 에서 앱 생성
// 2. Client ID를 .env 파일에 넣기:
//    VITE_PAYPAL_CLIENT_ID=실제_클라이언트_ID
// 3. 프로덕션: VITE_PAYPAL_CLIENT_ID에 Live Client ID 사용
//
// ============================================================

export const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
  currency: 'USD',
  intent: 'capture' as const,
};

// ── 상품 타입 정의 ──

export interface PayPalProduct {
  id: string;
  name: string;
  description: string;
  price: string; // '29.99' 형식
  currency: string;
}

// ── 구독 플랜 타입 정의 ──

export interface PayPalSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  planId: string; // PayPal에서 생성한 구독 Plan ID
  price: string;
  currency: string;
  interval: 'MONTH' | 'YEAR';
}

// ── 예시 상품 목록 — 여기를 수정하세요 ──

export const PRODUCTS: PayPalProduct[] = [
  {
    id: 'stack-clarity-one-page-reset',
    name: 'One-Page Stack Reset Report',
    description: 'A simple AI-assisted reset report for your current supplement routine',
    price: '7.00',
    currency: 'USD',
  },
  {
    id: 'stack-clarity-full-reset',
    name: 'Full Stack Reset Report',
    description: 'A deeper reset report with routine organization and follow-up prompts',
    price: '19.00',
    currency: 'USD',
  },
];

// ── 예시 구독 플랜 — 여기를 수정하세요 ──

export const SUBSCRIPTION_PLANS: PayPalSubscriptionPlan[] = [
  {
    id: 'stack-clarity-monthly',
    name: 'Stack Clarity Monthly',
    description: 'Monthly access to Stack Clarity report tools',
    planId: 'YOUR_PAYPAL_PLAN_ID', // PayPal에서 생성한 구독 플랜 ID
    price: '19.00',
    currency: 'USD',
    interval: 'MONTH',
  },
  {
    id: 'stack-clarity-yearly',
    name: 'Stack Clarity Yearly',
    description: 'Annual access — save 20%',
    planId: 'YOUR_PAYPAL_YEARLY_PLAN_ID',
    price: '190.00',
    currency: 'USD',
    interval: 'YEAR',
  },
];
