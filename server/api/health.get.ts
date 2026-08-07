export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  return {
    ok: true,
    serverKeyConfigured: Boolean(config.openrouterApiKey),
    acceptsBrowserKey: false
  }
})
