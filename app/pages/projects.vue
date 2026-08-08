<script setup lang="ts">
useHead({ title: 'Проекты — Viral Script Studio' })

const router = useRouter()
const {
  projects,
  init,
  sortByUpdated,
  getProjectProgress,
  formatRelative,
  createProject,
  renameProject,
  duplicateProject,
  deleteProject,
  setActiveId,
  studioPath
} = useProjects()

const search = ref('')
const openMenuId = ref('')
const createOpen = ref(false)
const renameOpen = ref(false)
const deleteOpen = ref(false)
const createName = ref('')
const renameName = ref('')
const renameId = ref('')
const deleteId = ref('')
const deleteCopy = ref('')
const toast = ref('')
let toastTimer = 0

const dragId = ref('')
const trashHot = ref(false)
let dragGhostEl: HTMLElement | null = null

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  cleanupDragGhost()
})

function cleanupDragGhost () {
  if (dragGhostEl) {
    dragGhostEl.remove()
    dragGhostEl = null
  }
}

function buildDragGhost (name: string, stageLabel: string) {
  cleanupDragGhost()
  const ghost = document.createElement('div')
  ghost.setAttribute('aria-hidden', 'true')
  Object.assign(ghost.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    // Keep on-page for reliable browser snapshots, but off-screen
    transform: 'translate(-100vw, -100vh)',
    width: '240px',
    boxSizing: 'border-box',
    padding: '16px 18px',
    border: '1px solid rgba(255, 255, 255, 0.72)',
    borderRadius: '22px',
    background: 'rgba(245, 240, 232, 0.9)',
    color: '#1a2e1f',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 18px 44px rgba(26,46,31,0.18)',
    fontFamily: 'DM Sans, ui-sans-serif, system-ui, sans-serif',
    opacity: '1',
    zIndex: '99999',
    pointerEvents: 'none',
    WebkitFontSmoothing: 'antialiased'
  })

  const badge = document.createElement('div')
  Object.assign(badge.style, {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 10px',
    marginBottom: '10px',
    borderRadius: '999px',
    background: '#6b4eff',
    color: '#f8f6ff',
    fontSize: '11px',
    fontWeight: '700'
  })
  badge.textContent = stageLabel

  const title = document.createElement('div')
  Object.assign(title.style, {
    fontFamily: 'DM Serif Display, Georgia, serif',
    fontSize: '28px',
    fontWeight: '400',
    lineHeight: '0.95',
    letterSpacing: '-0.03em',
    color: '#1a2e1f'
  })
  title.textContent = name

  const hint = document.createElement('div')
  Object.assign(hint.style, {
    marginTop: '10px',
    color: '#7a8c7c',
    fontSize: '12px',
    fontWeight: '600'
  })
  hint.textContent = 'Перетащите в корзину'

  ghost.append(badge, title, hint)
  document.body.appendChild(ghost)
  dragGhostEl = ghost
  return ghost
}

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()
  const list = sortByUpdated()
  if (!query) return list
  return list.filter((project) => {
    const progress = getProjectProgress(project.id)
    return `${project.name} ${progress.ideaPreview} ${progress.label}`.toLowerCase().includes(query)
  })
})

function showToast (message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { toast.value = '' }, 2400)
}

function openStudio (id: string) {
  setActiveId(id)
  router.push(studioPath(id))
}

function startCreate () {
  createName.value = ''
  createOpen.value = true
}

function submitCreate () {
  const project = createProject(createName.value)
  createOpen.value = false
  openStudio(project.id)
}

function startRename (id: string) {
  const project = projects.value.find(item => item.id === id)
  if (!project) return
  renameId.value = id
  renameName.value = project.name
  openMenuId.value = ''
  renameOpen.value = true
}

function submitRename () {
  renameProject(renameId.value, renameName.value)
  renameOpen.value = false
  showToast('Проект переименован')
}

function startDelete (id: string) {
  const project = projects.value.find(item => item.id === id)
  if (!project) return
  if (projects.value.length <= 1) {
    showToast('Нельзя удалить последний проект')
    return
  }
  deleteId.value = id
  deleteCopy.value = `«${project.name}» будет удалён с этого устройства.`
  openMenuId.value = ''
  deleteOpen.value = true
}

function confirmDelete () {
  const result = deleteProject(deleteId.value)
  deleteOpen.value = false
  if (!result.ok) {
    showToast(result.reason === 'last' ? 'Нельзя удалить последний проект' : 'Проект не найден')
    return
  }
  showToast('Проект удалён')
}

function onCardDragStart (id: string, event: DragEvent) {
  openMenuId.value = ''
  dragId.value = id
  trashHot.value = false

  const project = projects.value.find(item => item.id === id)
  const progress = getProjectProgress(id)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', id)
    const ghost = buildDragGhost(project?.name || 'Проект', progress.label)
    // Offset so cursor sits inside the card, not on the edge
    event.dataTransfer.setDragImage(ghost, 36, 28)
  }
}

function onCardDragEnd () {
  dragId.value = ''
  trashHot.value = false
  // Keep ghost in DOM briefly so the drag image stays sharp until drop ends
  window.setTimeout(() => cleanupDragGhost(), 80)
}

function onTrashDragOver (event: DragEvent) {
  if (!dragId.value) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  trashHot.value = true
}

function onTrashDragLeave (event: DragEvent) {
  const target = event.currentTarget as HTMLElement
  const related = event.relatedTarget as Node | null
  if (related && target.contains(related)) return
  trashHot.value = false
}

function onTrashDrop (event: DragEvent) {
  event.preventDefault()
  const id = dragId.value || event.dataTransfer?.getData('text/plain') || ''
  trashHot.value = false
  dragId.value = ''
  if (!id) return

  if (projects.value.length <= 1) {
    showToast('Нельзя удалить последний проект')
    return
  }

  const result = deleteProject(id)
  if (!result.ok) {
    showToast(result.reason === 'last' ? 'Нельзя удалить последний проект' : 'Проект не найден')
    return
  }
  showToast('Проект удалён')
}

function onDuplicate (id: string) {
  openMenuId.value = ''
  const copy = duplicateProject(id)
  showToast(copy ? 'Копия создана' : 'Не удалось скопировать')
}

function plural (n: number) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'проект'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'проекта'
  return 'проектов'
}
</script>

<template>
  <main class="shell" @click="openMenuId = ''">
    <UiAppNav />

    <header class="page-head">
      <div>
        <UiAppEyebrow>Рабочее пространство</UiAppEyebrow>
        <h1>Проекты</h1>
        <p>Все ролики в одном месте. Откройте любой — продолжите со студии с того этапа, где остановились.</p>
      </div>
      <div class="tools">
        <input
          v-model="search"
          class="search"
          type="search"
          placeholder="Найти проект…"
          aria-label="Поиск проектов"
        >
      </div>
    </header>

    <p class="meta">
      {{ projects.length ? `${projects.length} ${plural(projects.length)} · сортировка: недавние` : 'Нет проектов' }}
    </p>

    <div v-if="!projects.length" class="empty">
      <UiAppEyebrow>С нуля</UiAppEyebrow>
      <h2>Пока пусто.</h2>
      <p>Создайте первый проект — студия сохранит идею, сценарий, кадры и промты в одном месте.</p>
      <UiAppButton variant="primary" @click="startCreate">
        Создать первый проект →
      </UiAppButton>
    </div>

    <section v-else class="grid" aria-label="Список проектов">
      <ProjectsProjectCard
        v-for="project in filtered"
        :key="project.id"
        :project="project"
        :progress="getProjectProgress(project.id)"
        :menu-open="openMenuId === project.id"
        :relative-time="formatRelative(project.updatedAt)"
        :dragging="dragId === project.id"
        :shrinking="dragId === project.id && trashHot"
        @open="openStudio(project.id)"
        @rename="startRename(project.id)"
        @duplicate="onDuplicate(project.id)"
        @delete="startDelete(project.id)"
        @toggle-menu="openMenuId = openMenuId === project.id ? '' : project.id"
        @drag-start="onCardDragStart"
        @drag-end="onCardDragEnd"
      />
      <button class="create-card" type="button" @click="startCreate">
        <span class="create-icon" aria-hidden="true">+</span>
        <span class="create-title">Новый проект</span>
        <span class="create-hint">С чистого листа</span>
      </button>
    </section>

    <div
      v-if="projects.length"
      class="trash"
      :class="{ active: Boolean(dragId), hot: trashHot }"
      role="region"
      aria-label="Корзина: перетащите проект, чтобы удалить"
      @dragover="onTrashDragOver"
      @dragenter.prevent="trashHot = Boolean(dragId)"
      @dragleave="onTrashDragLeave"
      @drop="onTrashDrop"
    >
      <span class="trash-icon" aria-hidden="true">🗑</span>
      <span class="trash-label">{{ trashHot ? 'Отпустите' : 'Корзина' }}</span>
    </div>

    <UiAppModal :open="createOpen" labelled-by="create-title" @close="createOpen = false">
      <UiAppEyebrow>Новый проект</UiAppEyebrow>
      <h2 id="create-title">
        Как назовём ролик?
      </h2>
      <p class="modal-copy">
        Имя видно только вам. Потом можно переименовать.
      </p>
      <form class="form" @submit.prevent="submitCreate">
        <label for="create-name">Название</label>
        <input id="create-name" v-model="createName" maxlength="70" required placeholder="Например: Коллекционер взглядов">
        <div class="form-actions">
          <UiAppButton variant="ghost" type="button" @click="createOpen = false">
            Отмена
          </UiAppButton>
          <UiAppButton variant="primary" type="submit" block>
            Создать и открыть →
          </UiAppButton>
        </div>
      </form>
    </UiAppModal>

    <UiAppModal :open="renameOpen" labelled-by="rename-title" @close="renameOpen = false">
      <UiAppEyebrow>Переименовать</UiAppEyebrow>
      <h2 id="rename-title">
        Новое имя проекта
      </h2>
      <form class="form" @submit.prevent="submitRename">
        <label for="rename-name">Название</label>
        <input id="rename-name" v-model="renameName" maxlength="70" required>
        <div class="form-actions">
          <UiAppButton variant="ghost" type="button" @click="renameOpen = false">
            Отмена
          </UiAppButton>
          <UiAppButton variant="primary" type="submit" block>
            Сохранить
          </UiAppButton>
        </div>
      </form>
    </UiAppModal>

    <UiAppModal :open="deleteOpen" labelled-by="delete-title" @close="deleteOpen = false">
      <UiAppEyebrow>Удаление</UiAppEyebrow>
      <h2 id="delete-title">
        Удалить проект?
      </h2>
      <p class="modal-copy">
        {{ deleteCopy }}
      </p>
      <div class="form-actions" style="margin-top: 24px">
        <UiAppButton variant="ghost" @click="deleteOpen = false">
          Отмена
        </UiAppButton>
        <UiAppButton variant="danger" @click="confirmDelete">
          Удалить
        </UiAppButton>
      </div>
    </UiAppModal>

    <div v-if="toast" class="toast" role="status">
      {{ toast }}
    </div>
  </main>
</template>

<style scoped>
.page-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 56px;
  margin-bottom: 32px;
}

h1 {
  font-size: clamp(48px, 7vw, 72px);
  line-height: 0.9;
}

.page-head p {
  margin: 12px 0 0;
  max-width: 420px;
  color: var(--color-fog);
  font-size: 16px;
}

.tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.search {
  min-width: min(280px, 100%);
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid rgba(107, 78, 255, 0.22);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.44);
  box-shadow: var(--glass-shadow-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  outline: none;
}

.search:focus,
.search:focus-visible {
  outline: none;
  border-color: rgba(107, 78, 255, 0.62);
  box-shadow: 0 0 0 4px rgba(107, 78, 255, 0.1);
}

.meta {
  margin: 0 0 18px;
  color: var(--color-fog);
  font-size: 14px;
  font-weight: 500;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.create-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-sizing: border-box;
  min-height: 280px;
  padding: 28px 24px;
  border: 1px dashed rgba(107, 78, 255, 0.36);
  border-radius: var(--radius-2xl);
  background: var(--glass-mid);
  box-shadow: var(--glass-shadow-mid);
  backdrop-filter: blur(16px) saturate(125%);
  -webkit-backdrop-filter: blur(16px) saturate(125%);
  color: var(--color-ink);
  cursor: pointer;
  text-align: center;
  transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
}

.create-card:hover {
  border-style: solid;
  background: rgba(255, 255, 255, 0.52);
  transform: translateY(-3px);
  box-shadow: var(--glass-shadow-strong);
}

.create-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border: 1px solid rgba(107, 78, 255, 0.28);
  border-radius: 50%;
  background: var(--color-accent-tint);
  color: var(--color-accent);
  font-family: var(--font-sans);
  font-size: 32px;
  font-weight: 500;
  line-height: 1;
}

.create-card:hover .create-icon {
  background: var(--color-accent);
  color: #f8f6ff;
}

.create-title {
  display: block;
  margin: 0;
  font-family: var(--font-serif);
  font-size: 32px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.03em;
}

.create-hint {
  display: block;
  margin: 0;
  color: var(--color-fog);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
}

.empty {
  display: grid;
  place-items: center;
  min-height: 340px;
  padding: 48px 24px;
  border: 1px dashed rgba(26, 46, 31, 0.24);
  border-radius: var(--radius-3xl);
  text-align: center;
  background: var(--glass-mid);
  box-shadow: var(--glass-shadow-mid);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.empty h2 {
  margin: 0 0 10px;
  font-size: 42px;
  line-height: 0.95;
}

.empty p {
  margin: 0 0 22px;
  max-width: 380px;
  color: var(--color-fog);
}

.modal-copy {
  margin: 12px 0 0;
  color: var(--color-fog);
  font-size: 15px;
}

.form {
  display: grid;
  gap: 10px;
  margin-top: 24px;
}

.form label {
  font-size: 13px;
  font-weight: 600;
}

.form input {
  min-height: 52px;
  padding: 0 14px;
  border: 1px solid rgba(107, 78, 255, 0.24);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.48);
  outline: none;
}

.form input:focus,
.form input:focus-visible {
  outline: none;
  border-color: rgba(107, 78, 255, 0.62);
  box-shadow: 0 0 0 4px rgba(107, 78, 255, 0.1);
}

.form-actions {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  margin-top: 8px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 60;
  transform: translateX(-50%);
  padding: 12px 18px;
  border: var(--border-strong);
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: var(--color-cream);
  font-size: 14px;
  font-weight: 600;
}

.trash {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 55;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 72px;
  height: 72px;
  border: 1px solid var(--glass-border-strong);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.56);
  box-shadow: var(--glass-shadow-mid);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--color-ink);
  transition:
    width 0.16s ease,
    height 0.16s ease,
    background 0.16s ease,
    border-color 0.16s ease,
    transform 0.16s ease;
}

.trash.active {
  width: 88px;
  height: 88px;
  background: var(--color-stone);
}

.trash.hot {
  width: 104px;
  height: 104px;
  border-color: var(--color-danger);
  background: var(--color-danger-soft);
  transform: scale(1.04);
}

.trash-icon {
  font-size: 22px;
  line-height: 1;
  pointer-events: none;
}

.trash.active .trash-icon {
  font-size: 26px;
}

.trash.hot .trash-icon {
  font-size: 30px;
}

.trash-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  pointer-events: none;
}

.trash.hot .trash-label {
  color: var(--color-danger);
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .page-head {
    display: grid;
    gap: 16px;
    margin-top: 28px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: clamp(36px, 10vw, 48px);
  }

  .page-head p {
    font-size: 15px;
  }

  .tools {
    justify-content: stretch;
  }

  .search {
    width: 100%;
    min-width: 0;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .create-card {
    min-height: 180px;
    padding: 22px 18px;
    border-radius: 22px;
  }

  .create-title {
    font-size: 28px;
  }

  .empty {
    min-height: 280px;
    padding: 32px 18px;
    border-radius: 24px;
  }

  .empty h2 {
    font-size: 32px;
  }

  .form-actions {
    grid-template-columns: 1fr;
  }

  /* Drag-to-trash is desktop-only; mobile uses card menu */
  .trash {
    display: none;
  }

  .toast {
    left: 12px;
    right: 12px;
    bottom: max(16px, env(safe-area-inset-bottom));
    transform: none;
    text-align: center;
  }
}

@media (max-width: 420px) {
  h1 {
    font-size: 34px;
  }
}
</style>
