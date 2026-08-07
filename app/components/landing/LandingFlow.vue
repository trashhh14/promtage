<script setup lang="ts">
const cards = [
  { step: '01 — Начало', title: 'Идея', text: 'Сюжет, герой, конфликт или просто случайная мысль.' },
  { step: '02 — Текст', title: 'Сценарий', text: 'Вирусная структура, хук и текст для диктора под нужную длину.' },
  { step: '03 — Визуал', title: 'Раскадровка', text: 'Кадры, визуальные идеи и готовые image-промты.' }
]
</script>

<template>
  <section class="section" id="how-it-works">
    <div class="heading">
      <UiAppEyebrow>Один спокойный процесс</UiAppEyebrow>
      <div>
        <h2>От наброска до кадра.</h2>
        <p>Без перескакивания между чатами, заметками и генераторами. Всё остаётся в одном проекте.</p>
      </div>
    </div>
    <div class="flow">
      <article
        v-for="(card, index) in cards"
        :key="card.title"
        class="card"
        :class="{ accent: index === 1 }"
      >
        <UiAppEyebrow>{{ card.step }}</UiAppEyebrow>
        <h3>{{ card.title }}</h3>
        <p>{{ card.text }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.section {
  margin-top: 80px;
}

.heading {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  margin-bottom: 28px;
}

h2 {
  font-size: 52px;
  line-height: 0.92;
}

.heading p {
  margin: 6px 0 0;
  max-width: 560px;
  font-size: 20px;
}

.flow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.card {
  min-height: 240px;
  padding: 28px;
  border: var(--border-strong);
  border-radius: var(--radius-3xl);
  background: var(--color-cream);
}

.card.accent {
  background: var(--color-lavender);
}

h3 {
  margin: 44px 0 10px;
  font-size: 38px;
  line-height: 0.95;
}

.card p {
  margin: 0;
  color: #3f3f3b;
}

@media (max-width: 760px) {
  .section { margin-top: 56px; }
  .heading { grid-template-columns: 1fr; gap: 12px; }
  h2 { font-size: 46px; }
  .heading p { font-size: 18px; }
  .flow { grid-template-columns: 1fr; }
  .card { min-height: 190px; }
}
</style>
