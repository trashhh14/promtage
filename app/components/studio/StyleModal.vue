<script setup lang="ts">
defineProps<{
  open: boolean
  options: { label: string, value: string, position: string }[]
  modelValue: string
}>()

const emit = defineEmits<{
  close: []
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <UiAppModal :open="open" labelled-by="style-title" @close="emit('close')">
    <div class="head">
      <div>
        <UiAppEyebrow>Визуальный язык</UiAppEyebrow>
        <h2 id="style-title">
          Выберите стиль
        </h2>
        <p>Он сохранится в проекте и попадёт в генерацию сценария и промтов.</p>
      </div>
      <button class="close" type="button" aria-label="Закрыть" @click="emit('close')">
        ×
      </button>
    </div>
    <div class="grid">
      <button
        v-for="option in options"
        :key="option.value"
        class="option"
        :class="{ selected: modelValue === option.value }"
        type="button"
        :style="{ backgroundPosition: option.position }"
        @click="emit('update:modelValue', option.value); emit('close')"
      >
        <span>{{ option.label }}</span>
      </button>
    </div>
  </UiAppModal>
</template>

<style scoped>
.head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

h2 {
  font-size: 36px;
  line-height: 0.95;
}

p {
  margin: 8px 0 0;
  color: var(--color-fog);
  font-size: 14px;
}

.close {
  width: 34px;
  height: 34px;
  border: var(--border-strong);
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  font-size: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.option {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border: var(--border-strong);
  border-radius: var(--radius-xl);
  background-color: var(--color-stone);
  background-image: url('/style-gallery.png');
  background-repeat: no-repeat;
  background-size: 300% auto;
  cursor: pointer;
}

.option::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 30%, rgba(3, 6, 11, 0.88));
}

.option span {
  position: absolute;
  left: 11px;
  bottom: 10px;
  z-index: 1;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.option.selected {
  outline: 3px solid var(--color-lavender);
}

@media (max-width: 720px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
