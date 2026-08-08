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
  runtimeConfig: {
    openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
    plusModel: process.env.PLUS_MODEL || 'google/gemini-2.5-flash',
    proModel: process.env.PRO_MODEL || 'anthropic/claude-sonnet-5',
    public: {
      appName: 'Viral Script Studio'
    }
  }
})
