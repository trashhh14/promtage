<script setup lang="ts">
const prompts = defineModel<string[]>('prompts', { default: () => [] })

const emit = defineEmits<{
  exportPrompts: []
  exportProject: []
}>()
</script>

<template>
  <section v-if="prompts.length" class="studio-panel" id="prompt-stage">
    <header class="studio-panel__head">
      <div class="studio-panel__intro">
        <UiAppEyebrow>Шаг 04</UiAppEyebrow>
        <h2>Промты</h2>
        <p class="studio-panel__lead">
          Готовые image-промты. Отредактируйте и экспортируйте.
        </p>
      </div>
      <div class="studio-panel__actions">
        <UiAppButton variant="ghost" @click="emit('exportPrompts')">
          Скачать промты
        </UiAppButton>
        <UiAppButton variant="primary" @click="emit('exportProject')">
          Экспорт проекта
        </UiAppButton>
      </div>
    </header>

    <div class="studio-panel__body">
      <div class="studio-grid">
        <article
          v-for="(prompt, index) in prompts"
          :key="index"
          class="studio-card"
        >
          <div class="studio-card__top">
            <span class="studio-card__label">
              Prompt {{ String(index + 1).padStart(2, '0') }}
            </span>
            <UiAppBadge tone="stone">
              Image
            </UiAppBadge>
          </div>
          <textarea
            v-model="prompts[index]"
            class="studio-field"
            rows="5"
            :aria-label="`Промт ${index + 1}`"
          />
        </article>
      </div>
    </div>
  </section>
</template>
