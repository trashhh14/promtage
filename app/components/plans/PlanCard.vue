<script setup lang="ts">
import type { PlanId } from '~/assets/tokens'

const props = defineProps<{
  planId: PlanId
  name: string
  badge: string
  description: string
  priceLabel: string
  features: string[]
  pro?: boolean
  selected?: boolean
  current?: boolean
}>()

const emit = defineEmits<{
  select: [planId: PlanId]
}>()
</script>

<template>
  <article class="card" :class="{ pro, selected }">
    <UiAppBadge :tone="pro ? 'outline' : 'forest'">
      {{ badge }}
    </UiAppBadge>
    <h2>{{ name }}</h2>
    <p class="desc">
      {{ description }}
    </p>
    <p class="price">
      {{ priceLabel }} <span>/ месяц</span>
    </p>
    <ul>
      <li v-for="feature in features" :key="feature">
        {{ feature }}
      </li>
    </ul>
    <UiAppButton
      class="choose"
      :variant="current ? 'secondary' : 'primary'"
      :disabled="current"
      block
      @click="emit('select', planId)"
    >
      {{ current ? 'Текущий тариф' : `Выбрать ${name}` }}
    </UiAppButton>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 440px;
  padding: 32px;
  border: var(--border-strong);
  border-radius: var(--radius-3xl);
  background: var(--color-cream);
}

.card.pro {
  background: var(--color-ink);
  color: var(--color-cream);
}

.card.selected {
  outline: 3px solid var(--color-lavender);
  outline-offset: 3px;
}

.card.pro.selected {
  outline-color: var(--color-ember);
}

h2 {
  margin: 24px 0 8px;
  font-size: clamp(44px, 5vw, 56px);
  line-height: 0.9;
}

.pro h2 {
  color: var(--color-cream);
}

.desc {
  min-height: 42px;
  margin: 0;
  color: var(--color-fog);
  font-size: 16px;
  line-height: 1.4;
}

.pro .desc {
  color: var(--color-cream-dim);
}

.price {
  margin: 36px 0 26px;
  font-family: var(--font-serif);
  font-size: clamp(48px, 5vw, 64px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.055em;
}

.price span {
  margin-left: 4px;
  color: var(--color-fog);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
}

.pro .price span {
  color: #a8a89c;
}

ul {
  display: grid;
  gap: 12px;
  margin: 0 0 28px;
  padding: 0;
  list-style: none;
  font-size: 16px;
}

li::before {
  content: "✓";
  margin-right: 10px;
  color: var(--color-forest);
  font-weight: 700;
}

.pro li::before {
  color: var(--color-ember);
}

.choose {
  margin-top: auto;
}

@media (max-width: 720px) {
  .card {
    min-height: 0;
    padding: 24px;
    border-radius: var(--radius-2xl);
  }
}
</style>
