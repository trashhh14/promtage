<script setup lang="ts">
export type WorkflowStep = {
  id: string
  label: string
  status: 'active' | 'complete' | 'locked' | 'idle'
}

defineProps<{
  steps: WorkflowStep[]
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <nav class="sidebar" aria-label="Этапы проекта">
    <p class="title">
      Этапы
    </p>
    <button
      v-for="(step, index) in steps"
      :key="step.id"
      class="step"
      :class="`is-${step.status}`"
      type="button"
      @click="emit('select', step.id)"
    >
      <span>{{ String(index + 1).padStart(2, '0') }}</span>
      <strong>{{ step.label }}</strong>
      <i>{{ step.status === 'complete' ? '●' : step.status === 'active' ? '●' : '○' }}</i>
    </button>
  </nav>
</template>

<style scoped>
.sidebar {
  display: grid;
  align-content: start;
  gap: 6px;
  position: sticky;
  top: 20px;
  height: max-content;
  min-height: 238px;
  padding: 16px 12px;
  border: var(--border-strong);
  border-radius: var(--radius-3xl);
  background: var(--color-cream);
}

.title {
  margin: 2px 8px 9px;
  color: var(--color-fog);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.step {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 10px;
  align-items: center;
  width: 100%;
  min-height: 46px;
  gap: 7px;
  padding: 0 12px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: var(--color-ink);
  text-align: left;
  cursor: pointer;
  font-weight: 500;
}

.step:hover {
  background: var(--color-stone);
}

.step span,
.step i {
  color: var(--color-fog);
  font-style: normal;
  font-size: 11px;
}

.step strong {
  font-size: 14px;
  font-weight: 600;
}

.step.is-active {
  background: var(--color-forest);
  color: var(--color-cream);
}

.step.is-active span,
.step.is-active i,
.step.is-complete i {
  color: var(--color-ember);
}

.step.is-locked {
  opacity: 0.42;
}

@media (max-width: 760px) {
  .sidebar {
    position: static;
    grid-template-columns: repeat(4, 1fr);
    min-height: auto;
    padding: 8px;
    border-radius: 24px;
  }

  .title { display: none; }

  .step {
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 6px 2px;
  }

  .step strong { font-size: 10px; }
  .step i { display: none; }
}
</style>
