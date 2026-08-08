<script setup lang="ts">
import type { Project, ProjectProgress } from '~/composables/useProjects'

const props = defineProps<{
  project: Project
  progress: ProjectProgress
  menuOpen?: boolean
  relativeTime: string
  dragging?: boolean
  shrinking?: boolean
}>()

const emit = defineEmits<{
  open: []
  rename: []
  duplicate: []
  delete: []
  toggleMenu: []
  dragStart: [id: string, event: DragEvent]
  dragEnd: []
}>()

/** Drag-to-trash is a desktop affordance; touch uses the card menu */
const canDrag = ref(false)

onMounted(() => {
  canDrag.value = window.matchMedia('(pointer: fine)').matches
})

function onDragStart (event: DragEvent) {
  if (!canDrag.value) {
    event.preventDefault()
    return
  }
  emit('dragStart', props.project.id, event)
}

function onDragEnd () {
  emit('dragEnd')
}
</script>

<template>
  <article
    class="card"
    :class="{ dragging, shrinking, 'no-drag': !canDrag }"
    :draggable="canDrag"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="top">
      <UiAppBadge :tone="progress.stage >= 4 ? 'lavender' : progress.stage === 0 ? 'stone' : progress.stage === 3 ? 'ink' : 'forest'">
        {{ progress.label }}
      </UiAppBadge>
      <div class="menu-wrap">
        <button class="menu-btn" type="button" aria-label="Действия" @click.stop="emit('toggleMenu')">
          ⋯
        </button>
        <div v-if="menuOpen" class="menu" @click.stop>
          <button type="button" @click="emit('open')">
            Открыть
          </button>
          <button type="button" @click="emit('rename')">
            Переименовать
          </button>
          <button type="button" @click="emit('duplicate')">
            Дублировать
          </button>
          <button class="danger" type="button" @click="emit('delete')">
            Удалить
          </button>
        </div>
      </div>
    </div>
    <h2>{{ project.name }}</h2>
    <p class="preview">
      {{ progress.ideaPreview }}
    </p>
    <div class="progress" aria-hidden="true">
      <span :style="{ width: `${progress.percent}%` }" />
    </div>
    <div class="meta">
      <span>{{ progress.detail }}</span>
      <span>{{ relativeTime }}</span>
    </div>
    <div class="actions">
      <UiAppButton variant="primary" block @click="emit('open')">
        Открыть в студии →
      </UiAppButton>
      <button class="icon" type="button" title="Переименовать" aria-label="Переименовать" @click="emit('rename')">
        ✎
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  min-height: 280px;
  padding: 24px;
  border: 1px solid var(--glass-border-mid);
  border-radius: var(--radius-2xl);
  background: var(--glass-mid);
  box-shadow: var(--glass-shadow-mid);
  backdrop-filter: blur(16px) saturate(125%);
  -webkit-backdrop-filter: blur(16px) saturate(125%);
  transition: transform 190ms ease, background 190ms ease, box-shadow 190ms ease;
  cursor: grab;
  user-select: none;
  transform-origin: center center;
  transition:
    background 0.15s ease,
    transform 0.18s ease,
    opacity 0.18s ease,
    box-shadow 0.18s ease;
}

.card:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
  box-shadow: var(--glass-shadow-strong);
}

.card:active {
  transform: translateY(-1px);
  cursor: grabbing;
}

/* In-place placeholder; the cursor follows a solid custom ghost with sharp borders */
.card.dragging {
  background: var(--color-stone);
  border: 2px dashed var(--color-ink);
  box-shadow: none;
  opacity: 0.5;
}

.card.shrinking {
  opacity: 0.85;
  transform: scale(0.76);
  border: 3px solid var(--color-danger);
  background: var(--color-danger-soft);
  box-shadow: none;
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.menu-wrap {
  position: relative;
}

.menu-btn,
.icon {
  width: 36px;
  height: 36px;
  border: 1px solid var(--glass-border-strong);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.42);
  color: var(--color-ink);
  cursor: pointer;
}

.menu-btn:hover,
.icon:hover {
  background: rgba(255, 255, 255, 0.62);
}

.menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 5;
  min-width: 180px;
  padding: 6px;
  border: 1px solid var(--glass-border-strong);
  border-radius: 14px;
  background: rgba(245, 240, 232, 0.88);
  box-shadow: var(--glass-shadow-strong);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
}

.menu button {
  display: block;
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.menu button:hover {
  background: var(--color-accent-tint);
}

.menu button.danger {
  color: var(--color-danger);
}

h2 {
  margin: 0 0 10px;
  font-size: 32px;
  line-height: 0.95;
}

.preview {
  margin: 0;
  color: var(--color-fog);
  font-size: 15px;
  line-height: 1.4;
  flex: 1;
}

.progress {
  height: 6px;
  margin: 20px 0 12px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.44);
  overflow: hidden;
}

.progress > span {
  display: block;
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
  color: var(--color-fog);
  font-size: 13px;
  font-weight: 500;
}

.actions {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.icon {
  width: 44px;
  height: 44px;
  min-height: 44px;
}

.card.no-drag {
  cursor: default;
  user-select: auto;
}

@media (max-width: 760px) {
  .card {
    min-height: 0;
    padding: 18px 16px;
    border-radius: 22px;
  }

  h2 {
    font-size: 28px;
  }

  .preview {
    font-size: 14px;
  }

  .menu-btn {
    width: 40px;
    height: 40px;
  }

  .actions {
    gap: 8px;
  }
}
</style>
