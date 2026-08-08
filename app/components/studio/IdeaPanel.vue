<script setup lang="ts">
const idea = defineModel<string>('idea', { default: '' })
const duration = defineModel<number>('duration', { default: 30 })
const contentType = defineModel<string>('contentType', { default: '' })
const selectedModel = defineModel<string>('selectedModel', { default: '' })

const props = defineProps<{
  generating?: boolean
  contentTypeOptions: { value: string, label: string, hint?: string }[]
  modelOptions: { value: string, label: string, hint?: string }[]
}>()

const emit = defineEmits<{
  generate: []
}>()

const DURATION_MIN = 0
const DURATION_MAX = 60
const DURATION_PRESETS = [15, 30, 45, 60] as const

const durationOpen = ref(false)
const durationRoot = ref<HTMLElement | null>(null)

const durationSafe = computed({
  get: () => {
    const n = Number(duration.value)
    if (!Number.isFinite(n)) return 30
    return Math.min(DURATION_MAX, Math.max(DURATION_MIN, Math.round(n)))
  },
  set: (value: number) => {
    const n = Number(value)
    duration.value = Number.isFinite(n)
      ? Math.min(DURATION_MAX, Math.max(DURATION_MIN, Math.round(n)))
      : 30
  }
})

const durationLabel = computed(() => `${durationSafe.value} сек`)

const sliderPct = computed(() =>
  `${(durationSafe.value / DURATION_MAX) * 100}%`
)

function toggleDuration () {
  durationOpen.value = !durationOpen.value
}

function setDuration (value: number) {
  durationSafe.value = value
}

function onDurationInput (event: Event) {
  const target = event.target as HTMLInputElement
  setDuration(Number(target.value))
}

function onDocPointer (event: PointerEvent) {
  if (!durationOpen.value || !durationRoot.value) return
  if (!durationRoot.value.contains(event.target as Node)) {
    durationOpen.value = false
  }
}

function onDurationKey (event: KeyboardEvent) {
  if (event.key === 'Escape' && durationOpen.value) {
    event.preventDefault()
    durationOpen.value = false
    return
  }

  if (!durationOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      durationOpen.value = true
    }
    return
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault()
    setDuration(durationSafe.value - 1)
  }
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault()
    setDuration(durationSafe.value + 1)
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointer)
})
</script>

<template>
  <section class="studio-panel" id="idea">
    <header class="studio-panel__head">
      <div class="studio-panel__intro">
        <UiAppEyebrow>Шаг 01</UiAppEyebrow>
        <h2>Идея</h2>
        <p class="studio-panel__lead">
          Опишите мысль, тему или ситуацию для короткого ролика.
        </p>
      </div>
      <div class="studio-panel__actions">
        <UiAppBadge tone="stone">
          1 идея = 1 сценарий
        </UiAppBadge>
      </div>
    </header>

    <div class="studio-panel__body">
      <textarea
        v-model="idea"
        class="studio-field studio-field--lg"
        aria-label="Сюжетная идея"
        placeholder="Сюжет, герой, конфликт или ситуация…"
        rows="8"
      />
    </div>

    <footer class="studio-panel__foot">
      <div class="studio-panel__tools">
        <div
          ref="durationRoot"
          class="duration-picker"
          :class="{ 'is-open': durationOpen }"
        >
          <button
            class="duration-trigger"
            type="button"
            aria-label="Длительность ролика"
            :aria-expanded="durationOpen"
            aria-haspopup="dialog"
            aria-controls="duration-popover"
            @click="toggleDuration"
            @keydown="onDurationKey"
          >
            <span class="duration-trigger__value">{{ durationLabel }}</span>
            <span class="duration-trigger__chevron" aria-hidden="true">▾</span>
          </button>

          <Transition name="duration-pop">
            <div
              v-if="durationOpen"
              id="duration-popover"
              class="duration-popover"
              role="dialog"
              aria-label="Выбор длительности"
            >
              <div class="duration-popover__head">
                <span class="duration-popover__eyebrow">Длительность</span>
                <div class="duration-popover__display">
                  <span class="duration-popover__number">{{ durationSafe }}</span>
                  <span class="duration-popover__unit">сек</span>
                </div>
              </div>

              <div class="duration-slider-wrap">
                <input
                  class="duration-slider"
                  type="range"
                  :min="DURATION_MIN"
                  :max="DURATION_MAX"
                  step="1"
                  :value="durationSafe"
                  :style="{ '--pct': sliderPct }"
                  aria-label="Ползунок длительности от 0 до 60 секунд"
                  @input="onDurationInput"
                >
                <div class="duration-scale" aria-hidden="true">
                  <span>0</span>
                  <span>30</span>
                  <span>60</span>
                </div>
              </div>

              <div class="duration-presets" role="group" aria-label="Быстрый выбор">
                <button
                  v-for="preset in DURATION_PRESETS"
                  :key="preset"
                  type="button"
                  class="duration-chip"
                  :class="{ 'is-active': durationSafe === preset }"
                  @click="setDuration(preset)"
                >
                  {{ preset }}с
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <UiAppSelect
          v-model="contentType"
          class="type-select"
          size="sm"
          :options="contentTypeOptions"
          aria-label="Тип контента"
          placeholder="Выбрать тип"
        />

        <UiAppSelect
          v-model="selectedModel"
          class="model-select"
          size="sm"
          :options="modelOptions"
          aria-label="Текстовая модель"
          placeholder="Модель"
        />
      </div>
      <UiAppButton
        variant="primary"
        class="primary-action"
        :disabled="generating"
        @click="emit('generate')"
      >
        {{ generating ? 'Генерация…' : 'Создать сценарий →' }}
      </UiAppButton>
    </footer>
  </section>
</template>

<style scoped>
.duration-picker {
  position: relative;
  flex: 0 0 auto;
  width: 120px;
  min-width: 100px;
  max-width: 140px;
}

.duration-picker.is-open {
  z-index: 60;
}

.duration-trigger {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 38px;
  padding: 0 12px 0 14px;
  border: 1px solid rgba(107, 78, 255, 0.2);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.42);
  color: var(--color-ink);
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  box-shadow: var(--glass-shadow-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.duration-trigger:hover {
  background: rgba(255, 255, 255, 0.6);
}

.duration-picker.is-open .duration-trigger {
  border-color: rgba(107, 78, 255, 0.5);
  background: rgba(240, 215, 255, 0.68);
}

.duration-trigger:focus,
.duration-trigger:focus-visible {
  outline: none;
}

.duration-trigger__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.duration-trigger__chevron {
  color: var(--color-accent);
  font-size: 12px;
  line-height: 1;
  transition: transform 0.15s ease;
}

.duration-picker.is-open .duration-trigger__chevron {
  transform: rotate(180deg);
}

.duration-popover {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 70;
  width: min(280px, calc(100vw - 48px));
  padding: 16px;
  border: 1px solid var(--glass-border-strong);
  border-radius: 18px;
  background: rgba(245, 240, 232, 0.92);
  box-shadow: var(--glass-shadow-strong);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
}

.duration-popover__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.duration-popover__eyebrow {
  color: var(--color-fog);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.duration-popover__display {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  color: var(--color-ink);
}

.duration-popover__number {
  font-family: var(--font-serif);
  font-size: 32px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.duration-popover__unit {
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 600;
}

.duration-slider-wrap {
  display: grid;
  gap: 8px;
}

.duration-slider {
  --pct: 50%;
  width: 100%;
  height: 28px;
  margin: 0;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
}

.duration-slider:focus {
  outline: none;
}

.duration-slider::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 999px;
  background:
    linear-gradient(
      to right,
      var(--color-accent) 0%,
      var(--color-accent) var(--pct),
      rgba(26, 46, 31, 0.12) var(--pct),
      rgba(26, 46, 31, 0.12) 100%
    );
  box-shadow: inset 0 1px 2px rgba(26, 46, 31, 0.08);
}

.duration-slider::-moz-range-track {
  height: 8px;
  border: none;
  border-radius: 999px;
  background: rgba(26, 46, 31, 0.12);
  box-shadow: inset 0 1px 2px rgba(26, 46, 31, 0.08);
}

.duration-slider::-moz-range-progress {
  height: 8px;
  border-radius: 999px;
  background: var(--color-accent);
}

.duration-slider::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  margin-top: -7px;
  border: 2.5px solid var(--color-accent);
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, #fff 0%, #faf7f0 55%, #f0d7ff 100%);
  box-shadow:
    0 0 0 4px rgba(107, 78, 255, 0.12),
    0 4px 12px rgba(26, 46, 31, 0.14);
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.duration-slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border: 2.5px solid var(--color-accent);
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, #fff 0%, #faf7f0 55%, #f0d7ff 100%);
  box-shadow:
    0 0 0 4px rgba(107, 78, 255, 0.12),
    0 4px 12px rgba(26, 46, 31, 0.14);
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.duration-slider:hover::-webkit-slider-thumb,
.duration-slider:active::-webkit-slider-thumb {
  transform: scale(1.08);
  box-shadow:
    0 0 0 6px rgba(107, 78, 255, 0.16),
    0 6px 16px rgba(26, 46, 31, 0.16);
}

.duration-slider:hover::-moz-range-thumb,
.duration-slider:active::-moz-range-thumb {
  transform: scale(1.08);
  box-shadow:
    0 0 0 6px rgba(107, 78, 255, 0.16),
    0 6px 16px rgba(26, 46, 31, 0.16);
}

.duration-slider:focus-visible::-webkit-slider-thumb {
  box-shadow:
    0 0 0 6px rgba(107, 78, 255, 0.2),
    0 4px 12px rgba(26, 46, 31, 0.14);
}

.duration-slider:focus-visible::-moz-range-thumb {
  box-shadow:
    0 0 0 6px rgba(107, 78, 255, 0.2),
    0 4px 12px rgba(26, 46, 31, 0.14);
}

.duration-scale {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
  color: var(--color-fog);
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.duration-presets {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  margin-top: 14px;
}

.duration-chip {
  min-height: 34px;
  padding: 0 8px;
  border: 1px solid rgba(107, 78, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
  color: var(--color-ink);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease, transform 140ms ease;
}

.duration-chip:hover {
  background: rgba(255, 255, 255, 0.72);
  border-color: rgba(107, 78, 255, 0.35);
  transform: translateY(-1px);
}

.duration-chip.is-active {
  border-color: rgba(107, 78, 255, 0.55);
  background: rgba(107, 78, 255, 0.14);
  color: var(--color-accent);
  box-shadow: inset 0 0 0 1px rgba(107, 78, 255, 0.12);
}

.duration-pop-enter-active,
.duration-pop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.duration-pop-enter-from,
.duration-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.type-select {
  width: 160px;
  min-width: 130px;
  max-width: 200px;
  flex: 0 1 160px;
}

.model-select {
  width: 180px;
  min-width: 140px;
  max-width: 220px;
  flex: 0 1 180px;
}

.primary-action {
  min-width: 200px;
}

@media (max-width: 760px) {
  .duration-picker,
  .type-select,
  .model-select {
    flex: 1 1 calc(50% - 6px);
    width: auto;
    min-width: 0;
    max-width: none;
  }

  .primary-action {
    width: 100%;
    min-width: 0;
  }

  .duration-popover {
    left: 0;
    right: auto;
  }
}
</style>
