<template>
  <section class="hero">
    <img class="art" src="/og.png" alt="Редакционная композиция Viral Script Studio">
    <div class="content">
      <div>
        <UiAppEyebrow tone="lavender">
          Сценарии для коротких роликов
        </UiAppEyebrow>
        <h1>Идея получает форму.</h1>
      </div>
      <div class="bottom">
        <p class="copy">
          Опиши мысль — студия соберёт сильный сценарий, разложит его на кадры и подготовит промты для визуала.
        </p>
        <div class="actions">
          <UiAppButton variant="primary" size="lg" to="/studio">
            Открыть студию →
          </UiAppButton>
          <UiAppButton class="ghost-on-dark" size="lg" to="/#pricing">
            Смотреть тарифы
          </UiAppButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: block;
  min-height: 660px;
  margin-top: 30px;
  overflow: hidden;
  border: var(--border-strong);
  border-radius: var(--radius-5xl);
  background: var(--color-ink);
}

.art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 660px;
  padding: 52px 180px 52px clamp(104px, 11vw, 152px);
  color: var(--color-cream);
}

h1 {
  max-width: 620px;
  color: var(--color-cream);
  font-size: clamp(64px, 7.6vw, 108px);
  line-height: 0.86;
}

.bottom {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
}

.copy {
  margin: 0;
  max-width: 470px;
  color: var(--color-cream);
  font-size: 20px;
  line-height: 1.35;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ghost-on-dark {
  border-color: var(--color-cream) !important;
  background: transparent !important;
  color: var(--color-cream) !important;
}

.ghost-on-dark:hover {
  background: var(--color-cream) !important;
  color: var(--color-ink) !important;
}

@media (max-width: 760px) {
  .hero {
    min-height: 620px;
    border-radius: 40px;
  }

  .content {
    min-height: 620px;
    padding: 30px 24px;
  }

  h1 {
    max-width: 490px;
    font-size: 70px;
  }

  .copy {
    font-size: 18px;
  }
}
</style>
