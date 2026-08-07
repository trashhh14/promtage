<script setup lang="ts">
defineProps<{
  open: boolean
  labelledBy?: string
}>()

const emit = defineEmits<{
  close: []
}>()

function onBackdrop (event: MouseEvent) {
  if (event.target === event.currentTarget) emit('close')
}

function onKey (event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="labelledBy"
      @click="onBackdrop"
      @keydown="onKey"
    >
      <div class="dialog">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(26, 26, 26, 0.66);
}

.dialog {
  width: min(520px, 100%);
  padding: 36px;
  border: var(--border-strong);
  border-radius: var(--radius-3xl);
  background: var(--color-cream);
}

@media (max-width: 760px) {
  .dialog {
    padding: 26px 22px;
    border-radius: var(--radius-2xl);
  }
}
</style>
