<script setup lang="ts">
withDefaults(defineProps<{
  ctaLabel?: string
  ctaTo?: string
}>(), {
  ctaLabel: 'Открыть студию',
  ctaTo: '/studio'
})
</script>

<template>
  <nav class="nav" aria-label="Главная навигация">
    <NuxtLink class="brand" to="/">
      Viral Script Studio
    </NuxtLink>
    <div class="actions">
      <a class="link" href="#how-it-works">Как это работает</a>
      <a class="link" href="#projects">Проекты</a>
      <a class="link" href="#studio">Студия</a>
      <a class="link" href="#pricing">Тарифы</a>
      <slot name="extra" />
      <UiAppButton variant="primary" :to="ctaTo">
        {{ ctaLabel }}
      </UiAppButton>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 58px;
  padding: 8px 12px 8px 18px;
  border: var(--border-strong);
  border-radius: var(--radius-pill);
  background: var(--color-cream);
  position: sticky;
  top: 12px;
  z-index: 20;
}

.brand {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.link {
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 900px) {
  .link { display: none; }
}

@media (max-width: 760px) {
  .nav {
    border-radius: 24px;
    padding-left: 16px;
  }
}
</style>
