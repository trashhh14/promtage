<template>
  <section class="closing">
    <div>
      <UiAppEyebrow>Можно начать сейчас</UiAppEyebrow>
      <h2>Пусть следующая идея не останется в заметках.</h2>
    </div>
    <div>
      <p>Открой свои проекты бесплатно или посмотри, какой тариф подходит под твой темп работы.</p>
      <div class="actions">
        <UiAppButton variant="primary" size="lg" to="/projects">
          К проектам →
        </UiAppButton>
        <UiAppButton size="lg" to="/plans">
          Тарифы
        </UiAppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.closing {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
  padding: 88px 0 8px;
}

h2 {
  max-width: 650px;
  font-size: clamp(56px, 7vw, 86px);
  line-height: 0.86;
}

p {
  margin: 0 0 20px;
  max-width: 310px;
  color: var(--color-fog);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 760px) {
  .closing {
    display: block;
    padding-top: 64px;
  }

  h2 { font-size: 60px; }
}
</style>
