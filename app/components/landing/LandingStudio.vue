<script setup lang="ts">
const steps = [
  { n: '01', title: 'Идея', text: 'Описание, стиль, длительность ролика.' },
  { n: '02', title: 'Сценарий', text: 'Один сильный текст с хуком — редактируете и утверждаете.' },
  { n: '03', title: 'Раскадровка', text: 'Кадры, длительности, реплики диктора.' },
  { n: '04', title: 'Промты', text: 'Готовые image-промты под выбранный визуальный язык.' }
]
</script>

<template>
  <section id="studio" class="section">
    <div class="panel">
      <div>
        <UiAppEyebrow tone="lavender">Студия</UiAppEyebrow>
        <h2>Полный workflow в одном экране.</h2>
        <p>Не чат и не набор заметок — контролируемые этапы от мысли до промта для визуала.</p>
        <UiAppButton class="cta" variant="primary" size="lg" to="/studio">
          Открыть студию →
        </UiAppButton>
      </div>
      <div class="steps">
        <div v-for="step in steps" :key="step.n" class="step">
          <span>{{ step.n }}</span>
          <div>
            <strong>{{ step.title }}</strong>
            <p>{{ step.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section { margin-top: 96px; }
.panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.95fr);
  gap: 40px;
  align-items: center;
  padding: 56px;
  border: var(--border-strong);
  border-radius: var(--radius-5xl);
  background: var(--color-ink);
  color: var(--color-cream);
}
h2 {
  max-width: 520px;
  color: var(--color-cream);
  font-size: clamp(44px, 5vw, 64px);
  line-height: 0.9;
}
p {
  max-width: 460px;
  margin: 16px 0 0;
  color: var(--color-cream-dim);
  font-size: 18px;
}
.cta { margin-top: 28px; border-color: var(--color-cream) !important; }
.steps { display: grid; gap: 12px; }
.step {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid var(--color-cream);
  border-radius: 20px;
  background: var(--color-forest);
}
.step span {
  color: var(--color-ember);
  font-size: 12px;
  font-weight: 700;
}
.step strong {
  display: block;
  font-size: 18px;
  font-weight: 700;
}
.step p {
  margin: 4px 0 0;
  max-width: none;
  font-size: 14px;
  color: var(--color-cream);
}
@media (max-width: 760px) {
  .section { margin-top: 64px; }
  .panel {
    grid-template-columns: 1fr;
    padding: 28px 22px;
    border-radius: 40px;
  }
}
</style>
