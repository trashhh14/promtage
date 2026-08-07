const AUTH_COOKIE = 'vss-gate'
const AUTH_VALUE = 'ok'
/** Site access password (client-checked for this private MVP gate). */
export const SITE_PASSWORD = '4andrey'

export function useAuth () {
  const token = useCookie(AUTH_COOKIE, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    path: '/'
  })

  const isAuthenticated = computed(() => token.value === AUTH_VALUE)

  function login (password: string) {
    if (password !== SITE_PASSWORD) return false
    token.value = AUTH_VALUE
    if (import.meta.client) {
      sessionStorage.setItem(AUTH_COOKIE, AUTH_VALUE)
    }
    return true
  }

  function logout () {
    token.value = null
    if (import.meta.client) {
      sessionStorage.removeItem(AUTH_COOKIE)
    }
  }

  function hydrateFromSession () {
    if (!import.meta.client) return
    if (sessionStorage.getItem(AUTH_COOKIE) === AUTH_VALUE && token.value !== AUTH_VALUE) {
      token.value = AUTH_VALUE
    }
  }

  return {
    token,
    isAuthenticated,
    login,
    logout,
    hydrateFromSession
  }
}
