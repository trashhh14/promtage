<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

defineProps<{
  projects: Project[]
  activeId: string
  planLabel: string
}>()

const emit = defineEmits<{
  switch: [id: string]
  create: []
}>()
</script>

<template>
  <header class="header">
    <div class="brand-side">
      <NuxtLink class="logo" to="/">
        Viral Script Studio
      </NuxtLink>
      <NuxtLink class="back" to="/projects">
        ← Проекты
      </NuxtLink>
    </div>
    <div class="project-side">
      <span class="label">Сейчас</span>
      <select
        class="select"
        :value="activeId"
        aria-label="Переключить проект"
        @change="emit('switch', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="project in projects"
          :key="project.id"
          :value="project.id"
        >
          {{ project.name }}
        </option>
      </select>
      <button class="new" type="button" @click="emit('create')">
        + Новый
      </button>
    </div>
    <div class="actions">
      <!-- Платёжка временно отключена: ссылка только на блок тарифов лендинга -->
      <NuxtLink class="plans" to="/#pricing">
        <span>Тарифы</span>
        <span class="price">{{ planLabel }}</span>
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  min-height: 58px;
  padding: 8px 12px;
  border: var(--border-strong);
  border-radius: var(--radius-pill);
  background: var(--color-cream);
}

.brand-side,
.project-side,
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.project-side {
  justify-content: center;
}

.actions {
  justify-content: flex-end;
}

.logo {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-decoration: none;
  white-space: nowrap;
}

.back,
.new {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 12px;
  border: var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--color-cream);
  color: var(--color-ink);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
}

.back:hover,
.new:hover {
  background: var(--color-lavender);
}

.label {
  color: var(--color-fog);
  font-size: 13px;
  font-weight: 600;
}

.select {
  min-width: 180px;
  max-width: min(280px, 36vw);
  min-height: 38px;
  padding: 0 28px 0 12px;
  border: var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--color-cream);
  color: var(--color-ink);
  font-weight: 600;
}

.plans {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.plans:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.price {
  color: var(--color-fog);
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 900px) {
  .label { display: none; }
}

@media (max-width: 760px) {
  .logo { display: none; }
  .select { min-width: 0; max-width: 42vw; }
  .new {
    width: 38px;
    padding: 0;
    overflow: hidden;
    font-size: 0;
  }
  .new::after {
    content: '+';
    font-size: 21px;
  }
}
</style>
