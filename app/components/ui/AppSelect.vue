<script setup lang="ts">
export type AppSelectOption = {
  value: string
  label: string
  hint?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue: string
  options: AppSelectOption[]
  placeholder?: string
  ariaLabel?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  tone?: 'light' | 'dark'
  maxHeight?: string
}>(), {
  placeholder: 'Выберите…',
  ariaLabel: 'Выбор',
  disabled: false,
  size: 'md',
  tone: 'light',
  maxHeight: '280px'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const listId = useId()

const selected = computed(() =>
  props.options.find(option => option.value === props.modelValue) || null
)

const displayLabel = computed(() => selected.value?.label || props.placeholder)

function toggle () {
  if (props.disabled) return
  open.value = !open.value
}

function choose (option: AppSelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  open.value = false
}

function onDocPointer (event: PointerEvent) {
  if (!open.value || !root.value) return
  if (!root.value.contains(event.target as Node)) open.value = false
}

function onKey (event: KeyboardEvent) {
  if (!open.value) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open.value = true
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    open.value = false
    return
  }

  const enabled = props.options.filter(option => !option.disabled)
  if (!enabled.length) return
  const currentIndex = Math.max(0, enabled.findIndex(option => option.value === props.modelValue))

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const next = enabled[(currentIndex + 1) % enabled.length]
    emit('update:modelValue', next.value)
    emit('change', next.value)
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    const next = enabled[(currentIndex - 1 + enabled.length) % enabled.length]
    emit('update:modelValue', next.value)
    emit('change', next.value)
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointer)
})
</script>

<template>
  <div
    ref="root"
    class="select"
    :class="[`is-${size}`, `tone-${tone}`, { 'is-open': open, 'is-disabled': disabled }]"
  >
    <button
      class="trigger"
      type="button"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :aria-expanded="open"
      :aria-controls="listId"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown="onKey"
    >
      <span class="label" :class="{ placeholder: !selected }">{{ displayLabel }}</span>
      <span class="chevron" aria-hidden="true">▾</span>
    </button>

    <Transition name="menu">
      <ul
        v-if="open"
        :id="listId"
        class="menu"
        role="listbox"
        :aria-label="ariaLabel"
        :style="{ maxHeight }"
      >
        <li
          v-for="option in options"
          :key="option.value"
          role="option"
          class="option"
          :class="{
            selected: option.value === modelValue,
            disabled: option.disabled
          }"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled || undefined"
          @click="choose(option)"
        >
          <span class="option-label">{{ option.label }}</span>
          <span v-if="option.hint" class="option-hint">{{ option.hint }}</span>
          <span v-if="option.value === modelValue" class="check" aria-hidden="true">✓</span>
        </li>
        <li v-if="!options.length" class="empty">
          Нет вариантов
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.select {
  position: relative;
  min-width: 0;
  max-width: 100%;
  width: 100%;
}

.select.is-open {
  z-index: 60;
}

.trigger {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 42px;
  padding: 0 12px 0 14px;
  border: 1px solid rgba(107, 78, 255, 0.2);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.42);
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  box-shadow: var(--glass-shadow-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.select.is-sm .trigger {
  min-height: 38px;
  font-size: 13px;
}

.trigger:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.6);
}

.select.is-open .trigger {
  border-color: rgba(107, 78, 255, 0.5);
  background: rgba(240, 215, 255, 0.68);
  outline: none;
  box-shadow: none;
}

.trigger:focus,
.trigger:focus-visible {
  outline: none;
  box-shadow: none;
}

.trigger:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.label.placeholder {
  color: var(--color-fog);
  font-weight: 500;
}

.chevron {
  color: var(--color-accent);
  font-size: 12px;
  line-height: 1;
  transition: transform 0.15s ease;
}

.select.is-open .chevron {
  transform: rotate(180deg);
}

.menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 70;
  margin: 0;
  padding: 6px;
  list-style: none;
  overflow: auto;
  scrollbar-width: none;
  border: 1px solid var(--glass-border-strong);
  border-radius: 16px;
  background: rgba(245, 240, 232, 0.86);
  box-shadow: var(--glass-shadow-strong);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
}

/* Native Chromium arrows cannot be styled reliably inside a short popover.
   Keep wheel/touch scrolling, but hide the menu's own rail entirely. */
.menu::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 4px 10px;
  min-height: 42px;
  padding: 8px 12px;
  border-radius: 12px;
  color: var(--color-ink);
  cursor: pointer;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.25;
}

.option-hint {
  grid-column: 1;
  color: var(--color-fog);
  font-size: 12px;
  font-weight: 500;
}

.check {
  grid-row: 1 / span 2;
  color: var(--color-accent);
  font-weight: 700;
}

.option:hover:not(.disabled),
.option.selected {
  background: var(--color-accent-tint);
}

.option.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty {
  padding: 14px 12px;
  color: var(--color-fog);
  font-size: 13px;
  text-align: center;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Dark chamber variant (ink panels) */
.tone-dark .trigger {
  border-color: var(--color-cream);
  background: transparent;
  color: var(--color-cream);
}

.tone-dark .trigger:hover:not(:disabled) {
  background: var(--color-forest);
}

.tone-dark.is-open .trigger {
  background: var(--color-forest);
  outline: none;
  box-shadow: none;
}

.tone-dark .label.placeholder,
.tone-dark .chevron {
  color: var(--color-lavender);
}

.tone-dark .menu {
  border-color: var(--color-cream);
  background: var(--color-ink);
  color: var(--color-cream);
}

.tone-dark .option {
  color: var(--color-cream);
}

.tone-dark .option:hover:not(.disabled),
.tone-dark .option.selected {
  background: var(--color-forest);
}

.tone-dark .option-hint {
  color: var(--color-cream-dim);
}

.tone-dark .check {
  color: var(--color-ember);
}

@media (max-width: 760px) {
  .trigger {
    min-height: 44px;
  }

  .option {
    min-height: 48px;
  }
}
</style>
