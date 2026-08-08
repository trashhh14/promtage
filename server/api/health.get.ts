import { resolveOpenRouterApiKey, resolveSiteUrl } from '../utils/openrouter'

export default defineEventHandler(() => {
  return {
    ok: true,
    service: 'promtage',
    serverKeyConfigured: Boolean(resolveOpenRouterApiKey()),
    acceptsBrowserKey: false,
    siteUrl: resolveSiteUrl() || null,
    nodeEnv: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  }
})
