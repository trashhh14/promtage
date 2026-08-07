export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') return

  const { isAuthenticated, hydrateFromSession } = useAuth()

  if (import.meta.client) {
    hydrateFromSession()
  }

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: to.fullPath !== '/' ? { next: to.fullPath } : undefined
    })
  }
})
