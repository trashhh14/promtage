<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  block?: boolean
  size?: 'md' | 'lg'
  to?: string
}>(), {
  variant: 'secondary',
  type: 'button',
  disabled: false,
  block: false,
  size: 'md'
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="btn"
    :class="[`is-${variant}`, `is-${size}`, { 'is-block': block, 'is-disabled': disabled }]"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    class="btn"
    :class="[`is-${variant}`, `is-${size}`, { 'is-block': block }]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 18px;
  border: var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--color-cream);
  color: var(--color-ink);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn:hover:not(:disabled):not(.is-disabled) {
  background: var(--color-stone);
}

.btn.is-primary {
  background: var(--color-lavender);
}

.btn.is-primary:hover:not(:disabled):not(.is-disabled) {
  background: var(--color-lavender-hover);
}

.btn.is-ghost {
  background: transparent;
}

.btn.is-danger {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.btn.is-danger:hover:not(:disabled):not(.is-disabled) {
  background: var(--color-danger-soft);
}

.btn.is-dark {
  background: var(--color-ink);
  color: var(--color-cream);
  border-color: var(--color-ink);
}

.btn.is-dark:hover:not(:disabled):not(.is-disabled) {
  background: #2a2a2a;
}

.btn.is-lg {
  min-height: 52px;
  padding: 0 22px;
  font-size: 16px;
}

.btn.is-block {
  width: 100%;
}

.btn:disabled,
.btn.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
