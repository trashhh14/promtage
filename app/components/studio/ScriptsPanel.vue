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
  <section class="studio-panel" id="scripts-panel">
    <header class="studio-panel__head">
      <div class="studio-panel__intro">
        <UiAppEyebrow>Шаг 02</UiAppEyebrow>
        <h2>Сценарий</h2>
        <p class="studio-panel__lead">
          Один сильный текст с хуком. Правите, утверждайте — и только потом идёте дальше.
        </p>
      </div>
      <div class="studio-panel__actions">
        <UiAppButton
          variant="primary"
          :disabled="!scenarios.length || approved"
          @click="emit('approve')"
        >
          {{ approved ? 'Одобрено' : 'Одобрить →' }}
        </UiAppButton>
      </div>
    </header>

    <div class="studio-panel__body">
      <div v-if="!scenarios.length" class="studio-empty">
        <div class="studio-empty__icon" aria-hidden="true">
          ✦
        </div>
        <p>Сценарий появится здесь после шага «Идея».</p>
      </div>

      <div v-else class="studio-grid">
        <article
          v-for="(script, index) in scenarios"
          :key="index"
          class="studio-card"
        >
          <div class="studio-card__top">
            <h3 class="studio-card__title">
              Сценарий {{ index + 1 }}
            </h3>
            <UiAppBadge :tone="approved ? 'lavender' : 'stone'">
              {{ approved ? 'Одобрено' : 'Черновик' }}
            </UiAppBadge>
          </div>
          <textarea
            v-model="scenarios[index]"
            class="studio-field studio-field--lg"
            rows="12"
            aria-label="Текст сценария"
          />
        </article>
      </div>
    </div>
  </section>
</template>
