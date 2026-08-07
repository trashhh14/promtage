<script setup lang="ts">
const scenarios = defineModel<string[]>('scenarios', { default: () => [] })

defineProps<{
  approved?: boolean
}>()

const emit = defineEmits<{
  approve: []
}>()
</script>

<template>
  <section class="panel" id="scripts-panel">
    <div class="head">
      <div>
        <UiAppEyebrow>Результат</UiAppEyebrow>
        <h2>Сценарии <span class="counter">{{ scenarios.length }}</span></h2>
      </div>
      <UiAppButton
        variant="ghost"
        :disabled="!scenarios.length || approved"
        @click="emit('approve')"
      >
        {{ approved ? 'Одобрено' : 'Approve all' }}
      </UiAppButton>
    </div>

    <div v-if="!scenarios.length" class="empty">
      <div class="icon">✦</div>
      <p>Первый сценарий появится здесь после того, как вы добавите идею.</p>
    </div>

    <div v-else class="cards">
      <article
        v-for="(script, index) in scenarios"
        :key="index"
        class="card"
      >
        <div class="card-top">
          <h3>Сценарий {{ index + 1 }}</h3>
          <UiAppBadge :tone="approved ? 'lavender' : 'forest'">
            {{ approved ? 'Одобрено' : 'Черновик' }}
          </UiAppBadge>
        </div>
        <textarea
          v-model="scenarios[index]"
          class="script"
          rows="12"
        />
      </article>
    </div>
  </section>
</template>

<style scoped>
.panel {
  padding: 40px;
  border: var(--border-strong);
  border-radius: var(--radius-4xl);
  background: var(--color-cream);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 28px;
}

h2 {
  font-size: 42px;
  line-height: 0.92;
}

.counter {
  display: inline-grid;
  place-items: center;
  width: 27px;
  height: 27px;
  margin-left: 7px;
  border-radius: 9px;
  background: var(--color-stone);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 13px;
  vertical-align: 4px;
}

.empty {
  display: grid;
  place-items: center;
  min-height: 210px;
  text-align: center;
  color: var(--color-fog);
  background: var(--color-stone);
  border: 2px dashed var(--color-ink);
  border-radius: var(--radius-3xl);
}

.icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin: 0 auto 9px;
  border: 2px solid var(--color-ink);
  border-radius: 12px;
  color: var(--color-forest);
}

.empty p {
  margin: 0;
  max-width: 300px;
}

.cards {
  display: grid;
  gap: 20px;
}

.card {
  padding: 16px;
  border: var(--border-strong);
  border-radius: var(--radius-3xl);
  background: var(--color-cream);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 13px;
}

h3 {
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.script {
  width: 100%;
  min-height: 235px;
  padding: 13px;
  border: var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--color-cream);
  color: var(--color-ink);
  resize: vertical;
  outline: none;
  line-height: 1.5;
}

@media (max-width: 760px) {
  .panel {
    padding: 24px;
    border-radius: 32px;
  }

  h2 { font-size: 36px; }
}
</style>
