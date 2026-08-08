export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  return {
    ok: true,
    service: 'promtage',
    serverKeyConfigured: Boolean(config.openrouterApiKey),
    acceptsBrowserKey: false,
    siteUrl: config.public?.siteUrl || null,
    nodeEnv: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  }
})
