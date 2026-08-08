/**
 * Single source of truth for Viral Script Studio design tokens.
 * CSS variables in tokens.css mirror these values 1:1.
 */
export const colors = {
  cream: '#f5f0e8',
  stone: '#e8ede3',
  sage: '#dce8dc',
  ink: '#1a2e1f',
  forest: '#3d4f3f',
  lavender: '#f0d7ff',
  lavenderHover: '#e8c8fb',
  accent: '#6b4eff',
  accentHover: '#5038e0',
  ember: '#f59e0b',
  fog: '#7a8c7c',
  muted: '#58695a',
  danger: '#8a1f1f',
  dangerSoft: '#ffe8e8',
  creamSoft: '#faf7f0',
  creamDim: '#d8dfd3'
} as const

export const fonts = {
  sans: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  serif: '"DM Serif Display", Georgia, serif'
} as const

export const radii = {
  sm: '10px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '28px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '64px',
  pill: '999px'
} as const

export const layout = {
  maxWidth: '1200px',
  pageGutter: '32px',
  pageGutterMobile: '20px'
} as const

export const plans = {
  plus: { id: 'plus', name: 'Plus', price: 199, priceLabel: '199 ₽', limit: 40 },
  pro: { id: 'pro', name: 'Pro', price: 369, priceLabel: '369 ₽', limit: 200 }
} as const

export type PlanId = keyof typeof plans
export type ColorToken = keyof typeof colors

export const tokens = {
  colors,
  fonts,
  radii,
  layout,
  plans
} as const

export default tokens
