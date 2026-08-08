<script setup lang="ts">
withDefaults(defineProps<{
  tone?: 'forest' | 'lavender' | 'ink' | 'stone' | 'outline'
}>(), {
  tone: 'forest'
})
</script>

<template>
  <span class="badge" :class="`is-${tone}`">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  width: max-content;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.is-forest {
  background: var(--color-accent-tint);
  color: var(--color-accent);
}

.is-lavender {
  background: var(--color-accent);
  color: #f8f6ff;
}

.is-ink {
  background: var(--color-ink);
  color: var(--color-cream);
}

.is-stone {
  background: rgba(255, 255, 255, 0.42);
  color: var(--color-ink);
  border: 1px solid var(--glass-border-light);
}

.is-outline {
  background: transparent;
  border: var(--border-strong);
  color: inherit;
}
</style>
