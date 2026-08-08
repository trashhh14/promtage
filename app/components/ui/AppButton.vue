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
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.42);
  color: var(--color-ink);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  box-shadow: var(--glass-shadow-light);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.btn:hover:not(:disabled):not(.is-disabled) {
  background: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: var(--glass-shadow-mid);
}

.btn.is-primary {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: #f8f6ff;
  box-shadow: 0 7px 22px rgba(107, 78, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.22);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.btn.is-primary:hover:not(:disabled):not(.is-disabled) {
  background: var(--color-accent-hover);
  box-shadow: 0 12px 32px rgba(107, 78, 255, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn.is-ghost {
  border-color: rgba(107, 78, 255, 0.24);
  background: var(--color-accent-tint);
  color: var(--color-accent);
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
  color: #f5f0e8;
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

@media (max-width: 760px) {
  .btn {
    min-height: 48px;
  }

  .btn.is-lg {
    min-height: 52px;
    width: 100%;
  }
}
</style>
