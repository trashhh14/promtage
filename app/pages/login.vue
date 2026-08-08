<script setup lang="ts">
definePageMeta({ layout: false })

useHead({ title: 'Вход — Viral Script Studio' })

const route = useRoute()
const router = useRouter()
const { login, isAuthenticated, hydrateFromSession } = useAuth()

const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

onMounted(() => {
  hydrateFromSession()
  if (isAuthenticated.value) {
    router.replace(typeof route.query.next === 'string' ? route.query.next : '/')
  }
})

function submit () {
  error.value = ''
  loading.value = true
  const ok = login(password.value.trim())
  loading.value = false
  if (!ok) {
    error.value = 'Неверный пароль'
    return
  }
  const next = typeof route.query.next === 'string' ? route.query.next : '/'
  router.replace(next)
}
</script>

<template>
  <div class="gate">
    <form class="card" @submit.prevent="submit">
      <p class="eyebrow">Private access</p>
      <h1>Вход на сайт</h1>
      <p class="copy">
        Сайт закрыт паролем. Введите доступ, чтобы открыть лендинг и инструменты.
      </p>
      <label for="password">Пароль</label>
      <input
        id="password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
        required
        autofocus
        placeholder="••••••••"
      >
      <label class="show-password" for="show-password">
        <input
          id="show-password"
          v-model="showPassword"
          type="checkbox"
        >
        <span>Показывать пароль</span>
      </label>
      <p v-if="error" class="error" role="alert">
        {{ error }}
      </p>
      <button class="submit" type="submit" :disabled="loading">
        {{ loading ? 'Проверка…' : 'Войти →' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.gate {
  box-sizing: border-box;
  min-height: 100vh;
  width: 100%;
  max-width: var(--layout-max);
  margin: 0 auto;
  display: grid;
  place-items: center;
  padding: 24px 16px;
  background: transparent;
}

.card {
  width: min(420px, 100%);
  padding: 36px 28px;
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-3xl);
  background: var(--glass-strong);
  box-shadow: var(--glass-shadow-strong);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
  display: grid;
  gap: 12px;
}

.eyebrow {
  margin: 0;
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.copy {
  margin: 0 0 8px;
  color: var(--color-fog);
  font-size: 15px;
  line-height: 1.4;
}

label {
  font-size: 13px;
  font-weight: 600;
}

input {
  min-height: 52px;
  padding: 0 14px;
  border: 1px solid rgba(107, 78, 255, 0.24);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.48);
  outline: none;
  font-size: 16px;
}

input:focus,
input:focus-visible {
  outline: none;
  border-color: rgba(107, 78, 255, 0.64);
  box-shadow: 0 0 0 4px rgba(107, 78, 255, 0.1);
}

.show-password {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.show-password input {
  width: 18px;
  height: 18px;
  min-height: 0;
  margin: 0;
  padding: 0;
  border: var(--border-strong);
  border-radius: 4px;
  accent-color: var(--color-accent);
  cursor: pointer;
}

.error {
  margin: 0;
  color: var(--color-danger);
  font-size: 14px;
  font-weight: 600;
}

.submit {
  margin-top: 8px;
  min-height: 52px;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: #f8f6ff;
  box-shadow: 0 7px 22px rgba(107, 78, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.22);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.submit:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}

.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 760px) {
  .gate {
    padding: 16px 12px;
    padding-bottom: max(16px, env(safe-area-inset-bottom));
    align-items: stretch;
    place-items: center;
  }

  .card {
    padding: 28px 18px;
    border-radius: 24px;
  }

  h1 {
    font-size: clamp(32px, 9vw, 40px);
  }
}
</style>
