<script setup lang="ts">
export type Frame = {
  duration: number
  visual: string
  voiceover: string
}

const frames = defineModel<Frame[]>('frames', { default: () => [] })

defineProps<{
  approved?: boolean
  summary?: string
}>()

const emit = defineEmits<{
  approve: []
  export: []
}>()
</script>

<template>
  <section v-if="frames.length" class="panel" id="storyboard">
    <div class="head">
      <div>
        <UiAppEyebrow tone="lavender">
          Шаг 02
        </UiAppEyebrow>
        <h2>Раскадровка</h2>
        <p>Разложите сценарий на короткие визуальные идеи. Каждый кадр можно отредактировать.</p>
        <p v-if="summary" class="summary">
          {{ summary }}
        </p>
      </div>
      <div class="tools">
        <UiAppButton variant="ghost" class="on-dark" @click="emit('export')">
          Скачать
        </UiAppButton>
        <UiAppButton variant="ghost" class="on-dark" :disabled="approved" @click="emit('approve')">
          {{ approved ? 'Одобрено' : 'Approve all' }}
        </UiAppButton>
      </div>
    </div>
    <div class="frames">
      <article
        v-for="(frame, index) in frames"
        :key="index"
        class="frame"
      >
        <div class="top">
          <span class="number">Кадр {{ String(index + 1).padStart(2, '0') }}</span>
          <span class="duration">{{ frame.duration }} сек</span>
        </div>
        <textarea v-model="frames[index].visual" rows="5" placeholder="Визуал кадра" />
        <textarea v-model="frames[index].voiceover" rows="2" placeholder="Диктор (опционально)" />
      </article>
    </div>
  </section>
</template>

<style scoped>
.panel {
  padding: 48px;
  border: var(--border-strong);
  border-radius: var(--radius-5xl);
  background: var(--color-ink);
  color: var(--color-cream);
}

.head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: end;
  margin-bottom: 28px;
}

h2 {
  color: var(--color-cream);
  font-size: 42px;
  line-height: 0.92;
}

p {
  margin: 8px 0 0;
  color: var(--color-cream-dim);
  font-size: 16px;
}

.summary {
  color: var(--color-fog);
  font-size: 14px;
}

.tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.on-dark {
  border-color: var(--color-cream) !important;
  background: transparent !important;
  color: var(--color-cream) !important;
}

.frames {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.frame {
  display: flex;
  flex-direction: column;
  min-height: 180px;
  padding: 14px;
  border: 2px solid var(--color-cream);
  border-radius: var(--radius-3xl);
  background: var(--color-forest);
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.number {
  color: var(--color-ember);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.duration {
  padding: 4px 7px;
  border: 1px solid rgba(255, 169, 70, 0.4);
  border-radius: var(--radius-pill);
  background: rgba(255, 169, 70, 0.14);
  color: var(--color-ember);
  font-size: 11px;
  font-weight: 700;
}

textarea {
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  border: 2px solid var(--color-cream);
  border-radius: 12px;
  background: var(--color-forest);
  color: var(--color-cream);
  resize: vertical;
  outline: none;
}

@media (max-width: 980px) {
  .frames { grid-template-columns: 1fr; }
}

@media (max-width: 760px) {
  .panel {
    padding: 24px;
    border-radius: 32px;
  }

  .head {
    flex-direction: column;
    align-items: start;
  }

  h2 { font-size: 36px; }
}
</style>
