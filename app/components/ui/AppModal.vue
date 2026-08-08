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
  background: rgba(26, 46, 31, 0.34);
  backdrop-filter: blur(8px) saturate(90%);
  -webkit-backdrop-filter: blur(8px) saturate(90%);
}

.dialog {
  width: min(520px, 100%);
  padding: 36px;
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-3xl);
  background: rgba(245, 240, 232, 0.84);
  box-shadow: var(--glass-shadow-strong);
  backdrop-filter: blur(22px) saturate(135%);
  -webkit-backdrop-filter: blur(22px) saturate(135%);
}

@media (max-width: 760px) {
  .modal {
    align-items: end;
    place-items: end center;
    padding: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }

  .dialog {
    width: 100%;
    max-height: min(92dvh, 100%);
    overflow: auto;
    padding: 22px 18px;
    border-radius: 24px 24px 20px 20px;
    -webkit-overflow-scrolling: touch;
  }

  .dialog :deep(h2) {
    font-size: clamp(28px, 7vw, 34px);
  }
}
</style>
