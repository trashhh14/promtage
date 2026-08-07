<script setup lang="ts">
import { SCRIPT_ENGINE } from '~/utils/scriptEngine'
import { STORYBOARD_ENGINE } from '~/utils/storyboardEngine'

type Frame = {
  duration: number
  visual: string
  voiceover: string
}

type WorkflowStep = {
  id: string
  label: string
  status: 'active' | 'complete' | 'locked' | 'idle'
}

definePageMeta({ layout: 'studio' })

const route = useRoute()
const router = useRouter()
const {
  projects,
  activeId,
  init,
  ensureAtLeastOne,
  setActiveId,
  findProject,
  createProject,
  sortByUpdated,
  getDraft,
  saveDraft,
  getPlan,
  studioPath
} = useProjects()
const { planId, hydrate: hydratePlan, current: currentPlan } = usePlan()

const idea = ref('')
const duration = ref(30)
const visualStyle = ref('Photorealistic cinematic editorial')
const scenarios = ref<string[]>([])
const frames = ref<Frame[]>([])
const prompts = ref<string[]>([])
const scriptApproved = ref(false)
const framesApproved = ref(false)
const generating = ref(false)
const errorMessage = ref('')
const createOpen = ref(false)
const createName = ref('')
const styleOpen = ref(false)
const saveReady = ref(false)

const styleOptions = [
  { label: 'Photoreal', value: 'Photorealistic cinematic editorial', position: '0 0' },
  { label: 'Editorial', value: 'High-end fashion editorial photography', position: '50% 0' },
  { label: 'Noir', value: 'Moody cinematic noir lighting', position: '100% 0' },
  { label: 'Anime', value: 'Stylized anime key visual', position: '0 100%' },
  { label: '35mm film', value: 'Dreamy 35mm film still, soft grain', position: '50% 100%' },
  { label: 'Surreal', value: 'Surreal vibrant editorial art direction', position: '100% 100%' }
]

const sortedProjects = computed(() => sortByUpdated())

const steps = computed<WorkflowStep[]>(() => {
  const scenarioReady = scenarios.value.length > 0
  const storyboardReady = frames.value.length > 0
  const promptsReady = prompts.value.length > 0

  return [
    { id: 'idea', label: 'Идея', status: !scenarioReady ? 'active' : 'complete' },
    {
      id: 'scripts-panel',
      label: 'Сценарий',
      status: !scenarioReady ? 'locked' : (!storyboardReady ? 'active' : 'complete')
    },
    {
      id: 'storyboard',
      label: 'Раскадровка',
      status: !storyboardReady ? (scenarioReady ? 'active' : 'locked') : (promptsReady ? 'complete' : 'active')
    },
    {
      id: 'prompt-stage',
      label: 'Промты',
      status: !promptsReady ? (storyboardReady && framesApproved.value ? 'active' : 'locked') : 'active'
    }
  ]
})

const timelineSummary = computed(() => {
  if (!frames.value.length) return ''
  const total = frames.value.reduce((sum, frame) => sum + Number(frame.duration || 0), 0)
  return `${frames.value.length} кадров · ${total} сек`
})

function loadProjectState (id: string) {
  const draft = getDraft(id)
  idea.value = draft?.idea || ''
  duration.value = draft?.duration ?? 30
  visualStyle.value = draft?.visualStyle || visualStyle.value
  scenarios.value = Array.isArray(draft?.scenarios) ? [...draft!.scenarios!] : []
  frames.value = Array.isArray(draft?.frames) ? draft!.frames!.map(frame => ({ ...frame })) : []
  prompts.value = Array.isArray(draft?.prompts) ? [...draft!.prompts!] : []
  scriptApproved.value = Boolean(draft?.scriptApproved)
  framesApproved.value = Boolean(draft?.framesApproved)
}

function persistState () {
  if (!activeId.value || !saveReady.value) return
  saveDraft(activeId.value, {
    idea: idea.value,
    duration: duration.value,
    visualStyle: visualStyle.value,
    scenarios: scenarios.value,
    storyboardVisible: frames.value.length > 0,
    frames: frames.value,
    promptsVisible: prompts.value.length > 0,
    prompts: prompts.value,
    scriptApproved: scriptApproved.value,
    framesApproved: framesApproved.value
  })
}

watch([idea, duration, visualStyle, scenarios, frames, prompts, scriptApproved, framesApproved], () => {
  persistState()
}, { deep: true })

function syncUrl (id: string, replace = false) {
  const path = studioPath(id)
  if (replace) router.replace(path)
  else router.push(path)
}

function switchProject (id: string) {
  if (!id || id === activeId.value) return
  if (!findProject(id)) return
  persistState()
  setActiveId(id)
  loadProjectState(id)
  syncUrl(id)
  useHead({ title: `${findProject(id)?.name || 'Студия'} — Viral Script Studio` })
}

function openCreate () {
  createName.value = ''
  createOpen.value = true
}

function submitCreate () {
  persistState()
  const project = createProject(createName.value)
  createOpen.value = false
  loadProjectState(project.id)
  syncUrl(project.id)
  useHead({ title: `${project.name} — Viral Script Studio` })
}

function scrollTo (id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function demoScenario (rawIdea: string) {
  return `### Title
${rawIdea.slice(0, 48) || 'Новый ролик'}

### Core Idea
Сильный визуальный конфликт вокруг исходной идеи, раскрытый через действие и финальный поворот.

### Script
${rawIdea || 'Герой оказывается в ситуации, где обычный жест внезапно меняет правила мира.'} Камера держится близко. Детали накапливаются, напряжение растёт, и финал переворачивает ожидание.

### Visual Direction
Кинематографичный свет, точный реквизит, выразительные текстуры, единый цветовой код.

### Final Image
Один запоминающийся кадр, который замыкает историю.`
}

function parseScenarioOutput (output: string) {
  return output.trim()
}

function buildDemoFrames (script: string, total: number): Frame[] {
  const count = Math.max(4, Math.min(8, Math.round(total / 5) || 4))
  const base = Math.floor(total / count)
  let rest = total - base * count
  const snippet = script.slice(0, 120)
  return Array.from({ length: count }, (_, index) => {
    const extra = rest > 0 ? 1 : 0
    if (rest > 0) rest -= 1
    return {
      duration: base + extra,
      visual: `Кадр ${index + 1}: ${snippet || 'выразительная сцена в выбранном стиле'}`,
      voiceover: index === 0 ? 'Начало истории.' : ''
    }
  })
}

function buildPromptsFromFrames (list: Frame[], style: string) {
  return list.map((frame, index) => {
    return `${style}. Frame ${index + 1}. ${frame.visual}. Cinematic composition, coherent character continuity, high detail.`
  })
}

async function generateScenario () {
  const text = idea.value.trim()
  if (!text) {
    errorMessage.value = 'Сначала опишите идею.'
    return
  }

  generating.value = true
  errorMessage.value = ''
  try {
    const request = SCRIPT_ENGINE.createRequest({
      idea: text,
      style: visualStyle.value,
      duration: duration.value,
      model: 'Claude Sonnet 4.6',
      references: []
    })

    try {
      const data = await $fetch<{ output: string }>('/api/workflow/scenario', {
        method: 'POST',
        body: { ...request, plan: planId.value }
      })
      scenarios.value = [parseScenarioOutput(data.output)]
    } catch {
      scenarios.value = [demoScenario(text)]
    }

    scriptApproved.value = false
    frames.value = []
    prompts.value = []
    framesApproved.value = false
    scrollTo('scripts-panel')
  } finally {
    generating.value = false
  }
}

async function approveScripts () {
  if (!scenarios.value.length) return
  scriptApproved.value = true

  try {
    const request = STORYBOARD_ENGINE.createRequest({
      script: scenarios.value[0],
      style: visualStyle.value,
      duration: duration.value,
      references: []
    })
    try {
      const data = await $fetch<{ output: string }>('/api/workflow/storyboard', {
        method: 'POST',
        body: { ...request, plan: planId.value }
      })
      const parsed = JSON.parse(data.output)
      if (Array.isArray(parsed?.frames)) {
        frames.value = parsed.frames.map((frame: any) => ({
          duration: Number(frame.duration || 3),
          visual: String(frame.visual || ''),
          voiceover: String(frame.voiceover || '')
        }))
      } else {
        frames.value = buildDemoFrames(scenarios.value[0], duration.value)
      }
    } catch {
      frames.value = buildDemoFrames(scenarios.value[0], duration.value)
    }
  } catch {
    frames.value = buildDemoFrames(scenarios.value[0], duration.value)
  }

  nextTick(() => scrollTo('storyboard'))
}

function approveFrames () {
  if (!frames.value.length) return
  framesApproved.value = true
  prompts.value = buildPromptsFromFrames(frames.value, visualStyle.value)
  nextTick(() => scrollTo('prompt-stage'))
}

function download (filename: string, contents: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function exportStoryboard () {
  const body = frames.value.map((frame, index) => {
    return `КАДР ${String(index + 1).padStart(2, '0')} · ${frame.duration} сек\nВизуал: ${frame.visual}\nДиктор: ${frame.voiceover || '—'}`
  }).join('\n\n')
  download('storyboard.txt', body)
}

function exportPrompts () {
  download(
    'image-prompts.txt',
    prompts.value.map((prompt, index) => `PROMPT ${String(index + 1).padStart(2, '0')}\n${prompt}`).join('\n\n')
  )
}

function exportProject () {
  const payload = {
    version: 2,
    project: findProject(activeId.value),
    exportedAt: new Date().toISOString(),
    idea: idea.value,
    style: visualStyle.value,
    duration: duration.value,
    scenarios: scenarios.value,
    frames: frames.value,
    prompts: prompts.value
  }
  download('viral-script-project.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8')
}

onMounted(() => {
  init()
  hydratePlan()
  ensureAtLeastOne()

  const urlId = typeof route.query.project === 'string' ? route.query.project : ''
  const preferred = [urlId, activeId.value, projects.value[0]?.id]
    .find(id => id && projects.value.some(project => project.id === id)) || projects.value[0]?.id

  if (preferred) {
    setActiveId(preferred)
    loadProjectState(preferred)
    syncUrl(preferred, true)
    useHead({ title: `${findProject(preferred)?.name || 'Студия'} — Viral Script Studio` })
  }

  saveReady.value = true
})

watch(() => route.query.project, (value) => {
  if (typeof value === 'string' && value && value !== activeId.value) {
    switchProject(value)
  }
})
</script>

<template>
  <div class="shell studio-shell">
    <StudioHeader
      :projects="sortedProjects"
      :active-id="activeId"
      :plan-label="currentPlan.priceLabel + ' / мес'"
      @switch="switchProject"
      @create="openCreate"
    />

    <div class="layout">
      <StudioWorkflowSidebar :steps="steps" @select="scrollTo" />

      <main class="workspace">
        <section class="hero">
          <h1>Идея → вирусный сценарий.</h1>
          <p>Одна идея превращается в один готовый сценарий с сильным хуком. Редактируй текст, подтверждай результат — и переходи дальше.</p>
        </section>

        <p v-if="errorMessage" class="error" role="alert">
          {{ errorMessage }}
        </p>

        <div class="stack">
          <StudioIdeaPanel
            v-model:idea="idea"
            v-model:duration="duration"
            v-model:visual-style="visualStyle"
            :generating="generating"
            :style-options="styleOptions"
            @generate="generateScenario"
            @open-style="styleOpen = true"
          />

          <StudioScriptsPanel
            v-model:scenarios="scenarios"
            :approved="scriptApproved"
            @approve="approveScripts"
          />

          <StudioStoryboardPanel
            v-model:frames="frames"
            :approved="framesApproved"
            :summary="timelineSummary"
            @approve="approveFrames"
            @export="exportStoryboard"
          />

          <StudioPromptPanel
            v-model:prompts="prompts"
            @export-prompts="exportPrompts"
            @export-project="exportProject"
          />
        </div>
      </main>
    </div>

    <StudioStyleModal
      v-model="visualStyle"
      :open="styleOpen"
      :options="styleOptions"
      @close="styleOpen = false"
    />

    <UiAppModal :open="createOpen" labelled-by="studio-create-title" @close="createOpen = false">
      <UiAppEyebrow>Новый проект</UiAppEyebrow>
      <h2 id="studio-create-title">
        Дайте ролику рабочее имя
      </h2>
      <p class="modal-copy">
        Оно нужно только для порядка в ваших проектах.
      </p>
      <form class="form" @submit.prevent="submitCreate">
        <label for="studio-create-name">Название проекта</label>
        <input id="studio-create-name" v-model="createName" maxlength="70" required placeholder="Например: Коллекционер взглядов">
        <div class="form-actions">
          <UiAppButton variant="ghost" type="button" @click="createOpen = false">
            Отмена
          </UiAppButton>
          <UiAppButton variant="primary" type="submit" block>
            Создать проект →
          </UiAppButton>
        </div>
      </form>
    </UiAppModal>
  </div>
</template>

<style scoped>
.studio-shell {
  padding-bottom: 88px;
}

.layout {
  display: grid;
  grid-template-columns: 184px minmax(0, 1fr);
  gap: 32px;
  padding-top: 40px;
}

.workspace {
  min-width: 0;
}

.hero {
  margin: 0 0 48px;
  padding: 24px 0 32px;
  border-bottom: var(--border-strong);
}

h1 {
  max-width: 760px;
  font-size: clamp(54px, 7vw, 92px);
  line-height: 0.86;
}

.hero p {
  max-width: 335px;
  margin: 16px 0 0;
  font-size: 16px;
  line-height: 1.35;
}

.stack {
  display: grid;
  gap: 56px;
}

.error {
  margin: 0 0 18px;
  padding: 12px 14px;
  border: 2px solid var(--color-danger);
  border-radius: var(--radius-md);
  background: var(--color-danger-soft);
  color: var(--color-danger);
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

.form-actions {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  margin-top: 8px;
}

@media (max-width: 760px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-top: 24px;
  }

  .hero { margin-bottom: 28px; }
  h1 { font-size: 52px; }
  .stack { gap: 28px; }
}
</style>
