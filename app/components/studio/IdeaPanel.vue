<script setup lang="ts">
const idea = defineModel<string>('idea', { default: '' })
const duration = defineModel<number>('duration', { default: 30 })
const visualStyle = defineModel<string>('visualStyle', { default: 'Photorealistic cinematic editorial' })

defineProps<{
  generating?: boolean
  styleOptions: { label: string, value: string, position: string }[]
}>()

const emit = defineEmits<{
  generate: []
  openStyle: []
}>()

const showTiming = ref(false)
</script>

<template>
  <section class="panel idea" id="idea">
    <div class="head">
      <div>
        <UiAppEyebrow tone="lavender">
          Шаг 01
        </UiAppEyebrow>
        <h2>Ваша идея</h2>
        <p>Опишите мысль, тему или ситуацию для короткого ролика.</p>
      </div>
      <UiAppBadge>1 идея = 1 сценарий</UiAppBadge>
    </div>

    <textarea
      v-model="idea"
      class="editor"
      aria-label="Сюжетная идея"
      placeholder="Опишите идею для видео: сюжет, героя, конфликт или ситуацию…"
      rows="8"
    />

    <div class="actions">
      <div class="tools">
        <button class="tile" type="button" @click="emit('openStyle')">
          <span class="icon">✦</span>
          <span class="label">Стиль</span>
        </button>
        <div class="timing">
          <button class="pill" type="button" @click="showTiming = !showTiming">
            Длина · {{ duration }} сек
          </button>
          <div v-if="showTiming" class="popover">
            <div class="popover-head">
              <strong>Длительность</strong>
              <span>{{ duration }} сек</span>
            </div>
            <input v-model.number="duration" type="range" min="0" max="60">
          </div>
        </div>
      </div>
      <UiAppButton variant="primary" class="generate" :disabled="generating" @click="emit('generate')">
        {{ generating ? 'Генерация…' : 'Создать сценарий →' }}
      </UiAppButton>
    </div>
    <p class="style-line">
      Стиль: {{ visualStyle }}
    </p>
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
  align-items: start;
  justify-content: space-between;
  gap: 20px;
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

.editor {
  width: 100%;
  min-height: 220px;
  padding: 22px;
  border: 2px solid var(--color-cream);
  border-radius: var(--radius-lg);
  background: var(--color-ink);
  color: var(--color-cream);
  font-size: 18px;
  line-height: 1.4;
  outline: none;
  resize: vertical;
}

.editor::placeholder {
  color: var(--color-cream-dim);
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid var(--color-cream);
}

.tools {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tile,
.pill {
  min-height: 58px;
  border: 2px solid var(--color-cream);
  border-radius: var(--radius-lg);
  background: transparent;
  color: var(--color-cream);
  cursor: pointer;
}

.tile {
  display: grid;
  place-items: center;
  width: 76px;
  padding: 7px;
}

.tile:hover,
.pill:hover {
  background: var(--color-forest);
}

.icon {
  color: var(--color-lavender);
  font-size: 22px;
}

.label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.pill {
  min-width: 180px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 700;
}

.timing {
  position: relative;
}

.popover {
  position: absolute;
  left: 0;
  bottom: calc(100% + 10px);
  z-index: 10;
  width: 248px;
  padding: 14px;
  border: 2px solid var(--color-cream);
  border-radius: var(--radius-xl);
  background: var(--color-ink);
}

.popover-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.popover-head span {
  color: var(--color-lavender);
  font-weight: 700;
}

.popover input {
  width: 100%;
  accent-color: var(--color-lavender);
}

.generate {
  min-width: 220px;
  border-color: var(--color-cream) !important;
}

.style-line {
  margin-top: 14px;
  color: var(--color-cream-dim);
  font-size: 13px;
}

@media (max-width: 760px) {
  .panel {
    padding: 24px;
    border-radius: 32px;
  }

  h2 { font-size: 36px; }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .generate { width: 100%; min-width: 0; }
}
</style>
