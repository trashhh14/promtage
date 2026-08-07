<script setup lang="ts">
import { plans } from '~/assets/tokens'

useHead({ title: 'Тарифы — Viral Script Studio' })

const { planId, hydrate, select } = usePlan()
const toast = ref('')

onMounted(() => {
  hydrate()
})

const cards = [
  {
    planId: 'plus' as const,
    name: plans.plus.name,
    badge: 'Для старта',
    description: 'Для первых идей, сценариев и раскадровок.',
    priceLabel: plans.plus.priceLabel,
    features: [
      '40 сценариев в месяц',
      'Раскадровки и image-промты',
      'Стандартная скорость генерации'
    ]
  },
  {
    planId: 'pro' as const,
    name: plans.pro.name,
    badge: 'Для регулярной работы',
    description: 'Больше объёма и приоритет для ежедневной работы.',
    priceLabel: plans.pro.priceLabel,
    features: [
      '200 сценариев в месяц',
      'Полный набор раскадровки',
      'Приоритетная генерация'
    ],
    pro: true
  }
]

function onSelect (id: 'plus' | 'pro') {
  select(id)
  toast.value = `Сейчас выбран тариф ${plans[id].name}`
}
</script>

<template>
  <main class="shell">
    <UiAppNav active="plans" cta-label="К проектам" cta-to="/projects" />

    <section class="intro">
      <UiAppEyebrow>Подписка</UiAppEyebrow>
      <h1>Выберите темп, в котором хотите создавать.</h1>
      <p>AI-инфраструктура уже включена в тариф: никакие ключи OpenRouter пользователю не нужны.</p>
    </section>

    <section class="plans" aria-label="Тарифы">
      <PlansPlanCard
        v-for="card in cards"
        :key="card.planId"
        v-bind="card"
        :selected="planId === card.planId"
        :current="planId === card.planId"
        @select="onSelect"
      />
    </section>

    <p class="current">
      {{ toast || `Сейчас выбран тариф ${plans[planId].name}` }}
    </p>
    <p class="notice">
      Оплата будет подключаться на следующем этапе. Сейчас выбор тарифа сохраняется для вашего профиля на этом устройстве.
    </p>
  </main>
</template>

<style scoped>
.intro {
  max-width: 850px;
  padding: 96px 0 48px;
}

h1 {
  max-width: 840px;
  font-size: clamp(56px, 8.5vw, 108px);
  line-height: 0.86;
}

.intro p {
  margin: 22px 0 0;
  max-width: 560px;
  font-size: 20px;
  line-height: 1.35;
}

.plans {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.current {
  margin: 28px 0 0;
  color: var(--color-forest);
  font-size: 15px;
  font-weight: 600;
  text-align: center;
}

.notice {
  margin: 10px 0 0;
  color: var(--color-fog);
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
}

@media (max-width: 720px) {
  .intro { padding: 64px 0 32px; }
  h1 { font-size: 56px; }
  .plans { grid-template-columns: 1fr; gap: 16px; }
}
</style>
