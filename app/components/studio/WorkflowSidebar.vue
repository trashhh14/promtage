<script setup lang="ts">
export type WorkflowStep = {
  id: string
  label: string
  /** Green highlight — stage user is viewing */
  focused: boolean
  /** Passed stages */
  done: boolean
  /** Can open this stage */
  unlocked: boolean
}

defineProps<{
  steps: WorkflowStep[]
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

function onSelect (step: WorkflowStep) {
  if (!step.unlocked) return
  emit('select', step.id)
}
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
      :class="{
        'is-active': step.focused,
        'is-complete': step.done && !step.focused,
        'is-locked': !step.unlocked
      }"
      type="button"
      :disabled="!step.unlocked"
      :aria-current="step.focused ? 'step' : undefined"
      @click="onSelect(step)"
    >
      <span>{{ String(index + 1).padStart(2, '0') }}</span>
      <strong>{{ step.label }}</strong>
      <i>{{ step.done || step.focused ? '●' : '○' }}</i>
    </button>
  </nav>
</template>

<style scoped>
.sidebar {
  display: grid;
  align-content: start;
  gap: 6px;
  /* Studio nav is not sticky — pin stages near the top of the viewport */
  position: sticky;
  top: 20px;
  height: max-content;
  width: 100%;
  min-height: 238px;
  padding: 16px 12px;
  border: 1px solid var(--glass-border-strong);
  border-radius: 32px;
  background: var(--glass-strong);
  box-shadow: var(--glass-shadow-strong);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
  justify-self: end;
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
  transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.step:hover:not(:disabled):not(.is-active) {
  background: rgba(255, 255, 255, 0.42);
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

/* Only the stage the user is on */
.step.is-active {
  background: var(--color-accent);
  color: #f8f6ff;
  box-shadow: 0 7px 18px rgba(107, 78, 255, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.step.is-active span,
.step.is-active i {
  color: #f8f6ff;
}

.step.is-complete {
  background: transparent;
  color: var(--color-ink);
}

.step.is-complete i {
  color: var(--color-accent);
}

.step.is-locked {
  opacity: 0.42;
  cursor: default;
}

.step:disabled {
  cursor: default;
}

@media (max-width: 760px) {
  .sidebar {
    /* Stick the stage switcher; main AppNav scrolls away */
    position: sticky;
    top: max(8px, env(safe-area-inset-top, 0px));
    z-index: 25;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    min-height: auto;
    padding: 6px;
    border-radius: 18px;
    gap: 4px;
    /* Stay readable over content while pinned */
    box-shadow: var(--glass-shadow-mid);
  }

  .title { display: none; }

  .step {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 2px;
    min-height: 52px;
    padding: 8px 4px;
    border-radius: 12px;
  }

  .step span {
    font-size: 10px;
    font-weight: 700;
  }

  .step strong {
    font-size: 11px;
    line-height: 1.15;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .step i { display: none; }
}

@media (max-width: 380px) {
  .step strong {
    font-size: 10px;
  }
}
</style>
