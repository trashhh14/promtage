// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Viral Script Studio',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content: 'Viral Script Studio превращает идею в сценарий, раскадровку и промты для визуала.'
        },
        { property: 'og:title', content: 'Viral Script Studio' },
        { property: 'og:description', content: 'Идея → сценарий → раскадровка → промты.' },
        { property: 'og:image', content: '/og.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  /**
   * Pack prompt markdown into the Nitro bundle.
   * - server/assets/prompts → assets:server (default Nitro)
   * - docs/prompts → assets:prompts (editor-facing copies, also packed)
   * Keep both trees in sync when editing instructions.
   */
  nitro: {
    serverAssets: [
      {
        baseName: 'prompts',
        dir: './docs/prompts'
      }
    ]
  },
  runtimeConfig: {
    // Empty defaults — set on host as OPENROUTER_API_KEY or NUXT_OPENROUTER_API_KEY
    // (server also reads process.env at runtime for Vercel)
    openrouterApiKey: '',
    plusModel: 'google/gemini-2.5-flash',
    proModel: 'anthropic/claude-sonnet-5',
    public: {
      appName: 'Viral Script Studio',
      // Set NUXT_PUBLIC_SITE_URL=https://promtage.vercel.app on Vercel
      siteUrl: ''
    }
  }
})
