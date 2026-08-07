/**
 * Single source of truth for Viral Script Studio design tokens.
 * CSS variables in tokens.css mirror these values 1:1.
 */
export const colors = {
  cream: '#ffffeb',
  stone: '#e4e4d0',
  ink: '#1a1a1a',
  forest: '#034f46',
  lavender: '#f0d7ff',
  lavenderHover: '#e5c2fb',
  ember: '#ffa946',
  fog: '#78786f',
  muted: '#61615a',
  danger: '#8a1f1f',
  dangerSoft: '#ffe8e8',
  creamSoft: '#ffffd8',
  creamDim: '#c9c9be'
} as const

export const fonts = {
  sans: '"Figtree", ui-sans-serif, system-ui, sans-serif',
  serif: '"EB Garamond", Georgia, serif'
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
