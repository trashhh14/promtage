<script setup lang="ts">
const prompts = defineModel<string[]>('prompts', { default: () => [] })

const emit = defineEmits<{
  exportPrompts: []
  exportProject: []
}>()
</script>

<template>
  <section v-if="prompts.length" class="panel" id="prompt-stage">
    <div class="head">
      <div>
        <UiAppEyebrow>Шаг 03</UiAppEyebrow>
        <h2>Промты для фото</h2>
        <p>Готовые подробные промты. Отредактируйте их под свой визуальный стиль.</p>
      </div>
      <div class="tools">
        <UiAppButton variant="ghost" @click="emit('exportPrompts')">
          Скачать промты
        </UiAppButton>
        <UiAppButton variant="ghost" @click="emit('exportProject')">
          Экспорт проекта
        </UiAppButton>
        <UiAppBadge tone="lavender">
          Image prompts
        </UiAppBadge>
      </div>
    </div>
    <div class="list">
      <article
        v-for="(prompt, index) in prompts"
        :key="index"
        class="card"
      >
        <span class="label">Prompt {{ String(index + 1).padStart(2, '0') }}</span>
        <textarea v-model="prompts[index]" rows="6" />
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
  justify-content: space-between;
  gap: 18px;
  align-items: end;
  margin-bottom: 28px;
}

h2 {
  font-size: 42px;
  line-height: 0.92;
}

p {
  margin: 8px 0 0;
  color: var(--color-fog);
  font-size: 16px;
}

.tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.list {
  display: grid;
  gap: 20px;
}

.card {
  padding: 16px;
  border: var(--border-strong);
  border-radius: var(--radius-3xl);
  background: var(--color-cream);
}

.label {
  display: block;
  margin-bottom: 10px;
  color: var(--color-forest);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

textarea {
  width: 100%;
  padding: 12px;
  border: var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--color-cream);
  color: var(--color-ink);
  resize: vertical;
  outline: none;
  line-height: 1.55;
}

@media (max-width: 760px) {
  .panel {
    padding: 24px;
    border-radius: 32px;
  }

  .head {
    flex-direction: column;
    align-items: start;
  }

  h2 { font-size: 36px; }
}
</style>
