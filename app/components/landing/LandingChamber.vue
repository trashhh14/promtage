<script setup lang="ts">
const steps = [
  'Идея и референсы',
  'Сценарий с хуком',
  'Раскадровка',
  'Промты для визуала'
]
</script>

<template>
  <section class="chamber">
    <div>
      <UiAppEyebrow tone="lavender">
        Не просто генератор текста
      </UiAppEyebrow>
      <h2>Контролируй историю до последнего кадра.</h2>
      <p>
        Редактируй каждый этап, добавляй референсы персонажей, выбирай визуальный язык и утверждай результат только тогда, когда он тебе подходит.
      </p>
    </div>
    <div class="stack" aria-label="Этапы работы">
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="item"
      >
        <span>{{ String(index + 1).padStart(2, '0') }}</span>
        {{ step }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.chamber {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 48px;
  align-items: center;
  margin-top: 96px;
  padding: 64px;
  border: var(--border-strong);
  border-radius: var(--radius-5xl);
  background: var(--color-ink);
  color: var(--color-cream);
}

h2 {
  max-width: 600px;
  color: var(--color-cream);
  font-size: clamp(50px, 6vw, 74px);
  line-height: 0.86;
}

p {
  max-width: 500px;
  margin: 20px 0 0;
  color: var(--color-cream);
  font-size: 20px;
}

.stack {
  display: grid;
  gap: 10px;
  padding: 20px;
  border: 2px solid var(--color-cream);
  border-radius: var(--radius-3xl);
}

.item {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 56px;
  padding: 0 14px;
  border-radius: 18px;
  background: var(--color-forest);
  font-size: 15px;
  font-weight: 600;
}

.item span {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-ember);
  color: var(--color-ink);
  font-size: 12px;
}

@media (max-width: 760px) {
  .chamber {
    grid-template-columns: 1fr;
    gap: 28px;
    margin-top: 64px;
    padding: 32px 24px;
    border-radius: 40px;
  }

  h2 { font-size: 54px; }
  p { font-size: 18px; }
}
</style>
