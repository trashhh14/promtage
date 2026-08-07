<script setup lang="ts">
withDefaults(defineProps<{
  active?: 'home' | 'projects' | 'plans' | 'studio'
  ctaLabel?: string
  ctaTo?: string
}>(), {
  active: 'home',
  ctaLabel: 'Проекты',
  ctaTo: '/projects'
})
</script>

<template>
  <nav class="nav" aria-label="Главная навигация">
    <NuxtLink class="brand" to="/">
      Viral Script Studio
    </NuxtLink>
    <div class="actions">
      <NuxtLink class="link" :class="{ active: active === 'projects' }" to="/projects">
        Проекты
      </NuxtLink>
      <NuxtLink class="link" :class="{ active: active === 'plans' }" to="/plans">
        Тарифы
      </NuxtLink>
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

.link.active {
  color: var(--color-forest);
}

@media (max-width: 760px) {
  .nav {
    border-radius: 24px;
    padding-left: 16px;
  }

  .link {
    display: none;
  }
}
</style>
