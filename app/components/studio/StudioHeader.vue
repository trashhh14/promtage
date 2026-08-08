<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

const props = defineProps<{
  projects: Project[]
  activeId: string
}>()

const emit = defineEmits<{
  switch: [id: string]
  create: []
}>()

const projectOptions = computed(() =>
  props.projects.map(project => ({
    value: project.id,
    label: project.name
  }))
)

const selectedId = computed({
  get: () => props.activeId,
  set: (value: string) => emit('switch', value)
})
</script>

<template>
  <!-- Same shell as every other page: UiAppNav + studio tools on the right -->
  <!-- sticky=false: bar scrolls away with content (no follow-on-scroll in studio) -->
  <UiAppNav :show-cta="false" :sticky="false">
    <template #end>
      <div class="project-tools">
        <span class="label">Проект</span>
        <UiAppSelect
          v-model="selectedId"
          class="project-select"
          size="sm"
          :options="projectOptions"
          aria-label="Переключить проект"
          placeholder="Выберите проект"
        />
        <button class="new" type="button" @click="emit('create')">
          + Новый
        </button>
      </div>
    </template>
  </UiAppNav>
</template>

<style scoped>
.project-tools {
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 3px;
  border: 1px solid var(--glass-border-strong);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.42);
  box-shadow: var(--glass-shadow-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.label {
  padding: 0 7px 0 9px;
  color: var(--color-fog, #78786f);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.project-select {
  width: 200px;
  min-width: 140px;
  max-width: 220px;
  flex: 0 1 200px;
}

.project-select :deep(.trigger) {
  min-height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.project-select :deep(.trigger:hover) {
  background: var(--color-accent-tint);
}

.new {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  margin-left: 3px;
  padding: 0 11px;
  border: 0;
  border-left: 1px solid rgba(26, 46, 31, 0.12);
  border-radius: 0 10px 10px 0;
  background: transparent;
  color: var(--color-ink, #1a1a1a);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.new:hover {
  background: var(--color-accent-tint);
  color: var(--color-accent);
}

@media (max-width: 900px) {
  .label { display: none; }

  .project-select {
    width: 160px;
    min-width: 120px;
    max-width: 180px;
    flex: 0 1 160px;
  }
}

@media (max-width: 760px) {
  .project-select {
    width: 132px;
    min-width: 108px;
    max-width: 148px;
    flex: 0 1 132px;
  }

  .new {
    width: 40px;
    min-height: 34px;
    padding: 0;
    overflow: hidden;
    font-size: 0;
    flex-shrink: 0;
  }

  .new::after {
    content: '+';
    font-size: 22px;
    line-height: 1;
  }
}
</style>
