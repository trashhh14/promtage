<script setup lang="ts">
definePageMeta({ layout: false })

useHead({ title: 'Вход — Viral Script Studio' })

const route = useRoute()
const router = useRouter()
const { login, isAuthenticated, hydrateFromSession } = useAuth()

const password = ref('')
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
        type="password"
        autocomplete="current-password"
        required
        autofocus
        placeholder="••••••••"
      >
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
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--color-cream);
}

.card {
  width: min(420px, 100%);
  padding: 36px 28px;
  border: var(--border-strong);
  border-radius: var(--radius-3xl);
  background: var(--color-cream);
  display: grid;
  gap: 12px;
}

.eyebrow {
  margin: 0;
  color: var(--color-forest);
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
  border: var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--color-cream);
  outline: none;
  font-size: 16px;
}

input:focus {
  outline: 3px solid var(--color-lavender);
  outline-offset: 2px;
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
  border: var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--color-lavender);
  color: var(--color-ink);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.submit:hover:not(:disabled) {
  background: var(--color-lavender-hover);
}

.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
