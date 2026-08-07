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
  background: var(--color-forest);
  color: var(--color-cream);
}

.is-lavender {
  background: var(--color-lavender);
  color: var(--color-ink);
}

.is-ink {
  background: var(--color-ink);
  color: var(--color-cream);
}

.is-stone {
  background: var(--color-stone);
  color: var(--color-ink);
}

.is-outline {
  background: transparent;
  border: var(--border-strong);
  color: inherit;
}
</style>
