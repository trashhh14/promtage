<script setup lang="ts">
import type { Project, ProjectProgress } from '~/composables/useProjects'

const props = defineProps<{
  project: Project
  progress: ProjectProgress
  active?: boolean
  menuOpen?: boolean
  relativeTime: string
}>()

const emit = defineEmits<{
  open: []
  rename: []
  duplicate: []
  delete: []
  toggleMenu: []
}>()
</script>

<template>
  <article class="card" :class="{ active }">
    <div class="top">
      <UiAppBadge :tone="progress.stage >= 4 ? 'lavender' : progress.stage === 0 ? 'stone' : progress.stage === 3 ? 'ink' : 'forest'">
        {{ progress.label }}
      </UiAppBadge>
      <div class="menu-wrap">
        <button class="menu-btn" type="button" aria-label="Действия" @click.stop="emit('toggleMenu')">
          ⋯
        </button>
        <div v-if="menuOpen" class="menu" @click.stop>
          <button type="button" @click="emit('open')">
            Открыть
          </button>
          <button type="button" @click="emit('rename')">
            Переименовать
          </button>
          <button type="button" @click="emit('duplicate')">
            Дублировать
          </button>
          <button class="danger" type="button" @click="emit('delete')">
            Удалить
          </button>
        </div>
      </div>
    </div>
    <h2>{{ project.name }}</h2>
    <p class="preview">
      {{ progress.ideaPreview }}
    </p>
    <div class="progress" aria-hidden="true">
      <span :style="{ width: `${progress.percent}%` }" />
    </div>
    <div class="meta">
      <span>{{ progress.detail }}</span>
      <span>{{ relativeTime }}</span>
    </div>
    <div class="actions">
      <UiAppButton variant="primary" block @click="emit('open')">
        Открыть в студии →
      </UiAppButton>
      <button class="icon" type="button" title="Переименовать" aria-label="Переименовать" @click="emit('rename')">
        ✎
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  min-height: 280px;
  padding: 24px;
  border: var(--border-strong);
  border-radius: var(--radius-2xl);
  background: var(--color-cream);
  transition: background 0.15s ease;
}

.card:hover {
  background: var(--color-cream-soft);
}

.card.active {
  outline: 3px solid var(--color-lavender);
  outline-offset: 2px;
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.menu-wrap {
  position: relative;
}

.menu-btn,
.icon {
  width: 36px;
  height: 36px;
  border: var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-cream);
  color: var(--color-ink);
  cursor: pointer;
}

.menu-btn:hover,
.icon:hover {
  background: var(--color-stone);
}

.menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 5;
  min-width: 180px;
  padding: 6px;
  border: var(--border-strong);
  border-radius: 14px;
  background: var(--color-cream);
  box-shadow: var(--shadow-soft);
}

.menu button {
  display: block;
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.menu button:hover {
  background: var(--color-stone);
}

.menu button.danger {
  color: var(--color-danger);
}

h2 {
  margin: 0 0 10px;
  font-size: 32px;
  line-height: 0.95;
}

.preview {
  margin: 0;
  color: var(--color-fog);
  font-size: 15px;
  line-height: 1.4;
  flex: 1;
}

.progress {
  height: 6px;
  margin: 20px 0 12px;
  border-radius: var(--radius-pill);
  background: var(--color-stone);
  overflow: hidden;
}

.progress > span {
  display: block;
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--color-forest);
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
  color: var(--color-fog);
  font-size: 13px;
  font-weight: 500;
}

.actions {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.icon {
  width: 44px;
  height: 44px;
  min-height: 44px;
}
</style>
