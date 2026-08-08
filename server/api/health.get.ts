import {
  resolveOpenRouterApiKey,
  resolveOpenRouterKeyDebug,
  resolveSiteUrl
} from '../utils/openrouter'

export default defineEventHandler(() => {
  const keyDebug = resolveOpenRouterKeyDebug()
  return {
    ok: true,
    service: 'promtage',
    serverKeyConfigured: Boolean(resolveOpenRouterApiKey()),
    acceptsBrowserKey: false,
    siteUrl: resolveSiteUrl() || null,
    // Safe diagnostics (no secret values) — remove later if noisy
    keyDebug,
    nodeEnv: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  }
})
