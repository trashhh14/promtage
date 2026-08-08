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
  <section v-if="frames.length" class="studio-panel" id="storyboard">
    <header class="studio-panel__head">
      <div class="studio-panel__intro">
        <UiAppEyebrow>Шаг 03</UiAppEyebrow>
        <h2>Раскадровка</h2>
        <p class="studio-panel__lead">
          Разложите сценарий на короткие визуальные идеи. Каждый кадр можно отредактировать.
        </p>
        <p v-if="summary" class="studio-panel__meta">
          {{ summary }}
        </p>
      </div>
      <div class="studio-panel__actions">
        <UiAppButton variant="ghost" @click="emit('export')">
          Скачать
        </UiAppButton>
        <UiAppButton variant="primary" :disabled="approved" @click="emit('approve')">
          {{ approved ? 'Одобрено' : 'Одобрить →' }}
        </UiAppButton>
      </div>
    </header>

    <div class="studio-panel__body">
      <div class="studio-grid studio-grid--frames">
        <article
          v-for="(frame, index) in frames"
          :key="index"
          class="studio-card"
        >
          <div class="studio-card__top">
            <span class="studio-card__label">
              Кадр {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span class="studio-chip">{{ frame.duration }} сек</span>
          </div>
          <textarea
            v-model="frames[index].visual"
            class="studio-field"
            rows="4"
            placeholder="Визуал кадра"
            :aria-label="`Визуал кадра ${index + 1}`"
          />
          <textarea
            v-model="frames[index].voiceover"
            class="studio-field studio-field--voice"
            rows="2"
            placeholder="Диктор (опционально)"
            :aria-label="`Диктор кадра ${index + 1}`"
          />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.studio-field--voice {
  min-height: 72px;
}
</style>
