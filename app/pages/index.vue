<script setup lang="ts">
useHead({ title: 'Viral Script Studio — из идеи в ролик' })

const stages = [
  {
    n: '01',
    title: 'Идея',
    text: 'Сюжет, герой, конфликт — или просто мысль. Стиль и длина ролика задаются сразу.'
  },
  {
    n: '02',
    title: 'Сценарий',
    text: 'Один сильный текст с хуком. Правите, утверждаете — и только потом идёте дальше.'
  },
  {
    n: '03',
    title: 'Раскадровка',
    text: 'Кадры, тайминги и реплики диктора. Всё ещё можно править руками.'
  },
  {
    n: '04',
    title: 'Промты',
    text: 'Готовые image-промты в выбранном визуальном языке — под экспорт в генератор.'
  }
]

const projectPoints = [
  'Каждый ролик — отдельный проект со своими черновиками.',
  'Видно, на каком этапе вы остановились.',
  'Можно вернуться и продолжить с того же места.'
]
</script>

<template>
  <main class="shell home">
    <UiAppNav />

    <section class="hero">
      <img class="hero-art" src="/og.png" alt="Viral Script Studio">
      <div class="hero-content">
        <div class="hero-panel">
          <div class="hero-top">
            <p class="eyebrow light">Сценарии для коротких роликов</p>
            <h1>Идея получает форму.</h1>
          </div>
          <div class="hero-bottom">
            <p class="hero-copy">
              Опиши мысль — студия соберёт сценарий, разложит его на кадры и подготовит промты для визуала.
              Без прыжков между чатами и заметками.
            </p>
            <UiAppButton class="hero-cta" variant="primary" size="lg" to="/studio">
              Открыть студию →
            </UiAppButton>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="section">
      <div class="section-head">
        <p class="eyebrow">Процесс</p>
        <h2>Четыре этапа. Один проект.</h2>
        <p class="lead">
          От наброска до image-промта — линейный workflow с контролем на каждом шаге.
        </p>
      </div>
      <ol class="stages">
        <li
          v-for="stage in stages"
          :key="stage.n"
          class="stage"
        >
          <span class="stage-n">{{ stage.n }}</span>
          <div>
            <h3>{{ stage.title }}</h3>
            <p>{{ stage.text }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section id="projects" class="section chamber">
      <div class="chamber-copy">
        <p class="eyebrow light">Проекты</p>
        <h2>Не теряйте черновики между роликами.</h2>
        <p class="lead light">
          Библиотека проектов — место, где лежат все ваши ролики. Студия открывает один;
          список помогает переключаться.
        </p>
        <ul class="points">
          <li
            v-for="point in projectPoints"
            :key="point"
          >
            {{ point }}
          </li>
        </ul>
        <NuxtLink class="text-link" to="/projects">
          Перейти к проектам →
        </NuxtLink>
      </div>
    </section>

  </main>
</template>

<style scoped>
.eyebrow {
  margin: 0 0 12px;
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.eyebrow.light {
  color: var(--color-accent);
}

.hero {
  /* Match og.png (1672×941) so the dark frame stays aligned */
  position: relative;
  aspect-ratio: 1672 / 941;
  margin-top: 28px;
  overflow: hidden;
  border: 1px solid var(--glass-border-strong);
  border-radius: 64px;
  background: var(--glass-strong);
  box-shadow: var(--glass-shadow-strong);
}

.hero-art {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  user-select: none;
  opacity: 0.24;
  filter: saturate(0.72) contrast(0.86);
}

.hero-content {
  position: absolute;
  /* Inset into the dark rounded panel of og.png */
  inset: 10.5% 8% 12% 8%;
  z-index: 1;
  display: flex;
  color: var(--color-ink);
}

.hero-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  min-height: 0;
  padding: clamp(20px, 3.2vw, 40px) clamp(22px, 3.5vw, 44px);
  border-radius: clamp(20px, 3vw, 36px);
  border: 1px solid var(--glass-border-strong);
  background: rgba(255, 255, 255, 0.46);
  box-shadow: var(--glass-shadow-mid);
  backdrop-filter: blur(18px) saturate(130%);
  -webkit-backdrop-filter: blur(18px) saturate(130%);
}

.hero-top {
  max-width: 34ch;
}

.hero h1 {
  margin: 0;
  color: var(--color-ink);
  font-size: clamp(36px, 5.2vw, 72px);
  line-height: 0.92;
  letter-spacing: -0.045em;
}

.hero-bottom {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  max-width: 42ch;
}

.hero-copy {
  margin: 0;
  font-size: clamp(15px, 1.35vw, 18px);
  line-height: 1.45;
  color: var(--color-forest);
}

.hero-cta {
  border-color: var(--color-accent) !important;
}

.section {
  margin-top: 88px;
}

.section-head {
  max-width: 640px;
  margin-bottom: 32px;
}

.section h2 {
  margin: 0;
  color: var(--color-ink, #1a1a1a);
  font-size: clamp(40px, 5vw, 56px);
  line-height: 0.92;
  letter-spacing: -0.04em;
}

.lead {
  margin: 14px 0 0;
  max-width: 520px;
  color: var(--color-fog, #78786f);
  font-size: 18px;
  line-height: 1.4;
}

.lead.light {
  color: var(--color-fog);
}

.stages {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stage {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 14px;
  min-height: 140px;
  padding: 24px;
  border: 1px solid var(--glass-border-mid);
  border-radius: 32px;
  background: var(--glass-mid);
  box-shadow: var(--glass-shadow-mid);
  backdrop-filter: blur(16px) saturate(125%);
  -webkit-backdrop-filter: blur(16px) saturate(125%);
  transition: transform 190ms ease, background 190ms ease, box-shadow 190ms ease;
}

.stage:nth-child(2),
.stage:nth-child(3) {
  background: rgba(240, 215, 255, 0.34);
}

.stage:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
  box-shadow: var(--glass-shadow-strong);
}

.stage-n {
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.stage h3 {
  margin: 0 0 8px;
  color: var(--color-ink, #1a1a1a);
  font-size: 32px;
  line-height: 0.95;
}

.stage p {
  margin: 0;
  color: #3f3f3b;
  font-size: 15px;
  line-height: 1.4;
}

.chamber {
  padding: 56px clamp(28px, 5vw, 64px);
  border: 1px solid var(--glass-border-strong);
  border-radius: 64px;
  background: var(--glass-strong);
  color: var(--color-ink);
  box-shadow: var(--glass-shadow-strong);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
}

.chamber h2 {
  color: var(--color-ink);
  max-width: 560px;
}

.points {
  display: grid;
  gap: 10px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
  max-width: 480px;
}

.points li {
  position: relative;
  padding-left: 18px;
  font-size: 16px;
  line-height: 1.4;
  color: var(--color-forest);
}

.points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
}

.text-link {
  display: inline-block;
  margin-top: 28px;
  color: var(--color-accent);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.closing {
  padding-top: 24px;
  max-width: 680px;
}

.closing h2 {
  font-size: clamp(44px, 6vw, 72px);
  color: var(--color-ink, #1a1a1a);
}

.closing-lead {
  max-width: 420px;
}

@media (max-width: 900px) {
  .stages {
    grid-template-columns: 1fr;
  }

  .stage {
    min-height: 0;
  }
}

@media (max-width: 760px) {
  .hero {
    aspect-ratio: auto;
    min-height: min(72vh, 560px);
    margin-top: 16px;
    border-radius: 28px;
  }

  .hero-art {
    object-fit: cover;
    object-position: center;
  }

  .hero-content {
    inset: 12px;
  }

  .hero-panel {
    gap: 16px;
    padding: 20px 16px;
    border-radius: 22px;
  }

  .hero h1 {
    font-size: clamp(32px, 9vw, 42px);
    line-height: 0.95;
  }

  .hero-copy {
    font-size: 15px;
  }

  .hero-cta {
    width: 100%;
  }

  .section {
    margin-top: 48px;
  }

  .section-head {
    margin-bottom: 20px;
  }

  .section h2 {
    font-size: clamp(32px, 8vw, 44px);
  }

  .lead {
    font-size: 16px;
  }

  .stage {
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 10px;
    padding: 18px 16px;
    border-radius: 24px;
  }

  .stage h3 {
    font-size: 26px;
  }

  .stage p {
    font-size: 14px;
  }

  .chamber {
    padding: 28px 18px;
    border-radius: 28px;
  }

  .points li {
    font-size: 15px;
  }

  .text-link {
    margin-top: 22px;
  }
}

@media (max-width: 420px) {
  .hero {
    min-height: min(78vh, 520px);
    border-radius: 22px;
  }

  .hero-panel {
    padding: 16px 14px;
  }

  .hero h1 {
    font-size: 30px;
  }
}
</style>
