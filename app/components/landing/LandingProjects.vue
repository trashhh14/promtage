<script setup lang="ts">
const items = [
  { title: 'Один ролик — один проект', text: 'Идея, сценарий, кадры и промты лежат вместе, без хаоса вкладок.' },
  { title: 'Прогресс виден сразу', text: 'Понятно, на каком этапе вы остановились: идея, текст, раскадровка или промты.' },
  { title: 'Переключение без потерь', text: 'Сохраняется черновик на устройстве — можно вернуться и продолжить.' }
]
</script>

<template>
  <section id="projects" class="section">
    <div class="heading">
      <UiAppEyebrow>Проекты</UiAppEyebrow>
      <div>
        <h2>Рабочее пространство для каждого ролика.</h2>
        <p>Библиотека проектов — дом приложения. Создаёте ролик, открываете студию, возвращаетесь к списку.</p>
      </div>
    </div>
    <div class="grid">
      <article v-for="item in items" :key="item.title" class="card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>
    <div class="cta">
      <UiAppButton variant="primary" size="lg" to="/projects">
        Открыть проекты →
      </UiAppButton>
    </div>
  </section>
</template>

<style scoped>
.section { margin-top: 96px; }
.heading {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 32px;
  margin-bottom: 28px;
}
h2 { font-size: 52px; line-height: 0.92; }
.heading p { margin: 8px 0 0; max-width: 560px; font-size: 20px; }
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.card {
  min-height: 200px;
  padding: 28px;
  border: var(--border-strong);
  border-radius: var(--radius-3xl);
  background: var(--color-cream);
}
.card:nth-child(2) { background: var(--color-lavender); }
h3 {
  margin: 0 0 12px;
  font-size: 32px;
  line-height: 0.95;
}
.card p { margin: 0; color: #3f3f3b; }
.cta { margin-top: 28px; }
@media (max-width: 760px) {
  .section { margin-top: 64px; }
  .heading { grid-template-columns: 1fr; }
  h2 { font-size: 42px; }
  .grid { grid-template-columns: 1fr; }
}
</style>
