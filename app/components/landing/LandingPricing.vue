<script setup lang="ts">
import { plans } from '~/assets/tokens'

const cards = [
  {
    id: 'plus',
    name: plans.plus.name,
    badge: 'Для старта',
    price: plans.plus.priceLabel,
    features: ['40 сценариев в месяц', 'Раскадровки и image-промты', 'Стандартная скорость']
  },
  {
    id: 'pro',
    name: plans.pro.name,
    badge: 'Для регулярной работы',
    price: plans.pro.priceLabel,
    features: ['200 сценариев в месяц', 'Полный набор раскадровки', 'Приоритетная генерация'],
    pro: true
  }
]
</script>

<template>
  <section id="pricing" class="section">
    <div class="heading">
      <UiAppEyebrow>Тарифы</UiAppEyebrow>
      <div>
        <h2>Выберите темп работы.</h2>
        <p>
          AI уже включён в подписку. Оплата и checkout пока отключены — подключатся на следующем этапе.
        </p>
      </div>
    </div>

    <div class="grid">
      <article
        v-for="card in cards"
        :key="card.id"
        class="card"
        :class="{ pro: card.pro }"
      >
        <UiAppBadge :tone="card.pro ? 'outline' : 'forest'">
          {{ card.badge }}
        </UiAppBadge>
        <h3>{{ card.name }}</h3>
        <p class="price">
          {{ card.price }} <span>/ месяц</span>
        </p>
        <ul>
          <li v-for="feature in card.features" :key="feature">
            {{ feature }}
          </li>
        </ul>

        <!--
          ПЛАТЁЖКА ВРЕМЕННО ОТКЛЮЧЕНА
          <UiAppButton variant="primary" block @click="selectPlan(card.id)">
            Выбрать {{ card.name }}
          </UiAppButton>
        -->
        <div class="soon">
          Оплата скоро
        </div>
      </article>
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.card {
  display: flex;
  flex-direction: column;
  min-height: 380px;
  padding: 32px;
  border: var(--border-strong);
  border-radius: var(--radius-3xl);
  background: var(--color-cream);
}
.card.pro {
  background: var(--color-ink);
  color: var(--color-cream);
}
h3 {
  margin: 20px 0 8px;
  font-size: 48px;
  line-height: 0.9;
}
.price {
  margin: 24px 0 20px;
  font-family: var(--font-serif);
  font-size: 48px;
  line-height: 1;
}
.price span {
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--color-fog);
}
.pro .price span { color: #a8a89c; }
ul {
  display: grid;
  gap: 10px;
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
  flex: 1;
}
li::before {
  content: "✓ ";
  color: var(--color-forest);
  font-weight: 700;
}
.pro li::before { color: var(--color-ember); }
.soon {
  margin-top: auto;
  display: grid;
  place-items: center;
  min-height: 52px;
  border: 2px dashed currentColor;
  border-radius: var(--radius-md);
  opacity: 0.7;
  font-weight: 600;
}
@media (max-width: 760px) {
  .section { margin-top: 64px; }
  .heading { grid-template-columns: 1fr; }
  h2 { font-size: 42px; }
  .grid { grid-template-columns: 1fr; }
}
</style>
