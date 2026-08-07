<script setup lang="ts">
useHead({ title: 'Проекты — Viral Script Studio' })

const router = useRouter()
const {
  projects,
  activeId,
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

onMounted(() => {
  init()
})

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
    <UiAppNav active="projects" cta-label="Открыть последний" cta-to="/studio" />

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
        <UiAppButton variant="primary" @click="startCreate">
          + Новый проект
        </UiAppButton>
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
        :active="project.id === activeId"
        :menu-open="openMenuId === project.id"
        :relative-time="formatRelative(project.updatedAt)"
        @open="openStudio(project.id)"
        @rename="startRename(project.id)"
        @duplicate="onDuplicate(project.id)"
        @delete="startDelete(project.id)"
        @toggle-menu="openMenuId = openMenuId === project.id ? '' : project.id"
      />
      <button class="create-card" type="button" @click="startCreate">
        <strong>+ Новый проект</strong>
        <span>С чистого листа</span>
      </button>
    </section>

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
  border: var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--color-cream);
  outline: none;
}

.search:focus {
  outline: 3px solid var(--color-lavender);
  outline-offset: 2px;
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
  display: grid;
  place-items: center;
  min-height: 280px;
  border: 2px dashed var(--color-ink);
  border-radius: var(--radius-2xl);
  background: transparent;
  color: var(--color-ink);
  cursor: pointer;
  text-align: center;
}

.create-card:hover {
  background: var(--color-lavender);
}

.create-card strong {
  display: block;
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 400;
}

.create-card span {
  display: block;
  margin-top: 8px;
  color: var(--color-fog);
  font-size: 14px;
}

.empty {
  display: grid;
  place-items: center;
  min-height: 340px;
  padding: 48px 24px;
  border: 2px dashed var(--color-ink);
  border-radius: var(--radius-3xl);
  text-align: center;
  background: var(--color-stone);
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
  border: var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--color-cream);
  outline: none;
}

.form input:focus {
  outline: 3px solid var(--color-lavender);
  outline-offset: 2px;
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

@media (max-width: 960px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 720px) {
  .page-head {
    display: grid;
    gap: 18px;
    margin-top: 36px;
  }

  .tools { justify-content: stretch; }
  .search, .tools :deep(.btn) { width: 100%; }
  .grid { grid-template-columns: 1fr; }
  h1 { font-size: 48px; }
}
</style>
