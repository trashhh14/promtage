<script setup lang="ts">
import { SCRIPT_ENGINE } from '~/utils/scriptEngine'
import { STORYBOARD_ENGINE } from '~/utils/storyboardEngine'
import {
  getDefaultModelId,
  isAllowedModel,
  modelSelectOptions,
  resolveModelId
} from '~~/shared/llmModels'
import {
  contentTypeSelectOptions,
  getDefaultContentTypeId,
  resolveContentTypeId
} from '~~/shared/contentTypes'

type Frame = {
  duration: number
  visual: string
  voiceover: string
}

type WorkflowStep = {
  id: string
  label: string
  focused: boolean
  done: boolean
  unlocked: boolean
}

const STEP_DEFS = [
  { id: 'idea', label: 'Идея' },
  { id: 'scripts-panel', label: 'Сценарий' },
  { id: 'storyboard', label: 'Раскадровка' },
  { id: 'prompt-stage', label: 'Промты' }
] as const

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
const { planId, hydrate: hydratePlan } = usePlan()

const DEFAULT_STYLE = 'Photorealistic cinematic editorial'

const idea = ref('')
const duration = ref(30)
const contentType = ref(getDefaultContentTypeId())
const selectedModel = ref(getDefaultModelId())
const scenarios = ref<string[]>([])
const frames = ref<Frame[]>([])
const prompts = ref<string[]>([])
const scriptApproved = ref(false)
const framesApproved = ref(false)
const generating = ref(false)
const errorMessage = ref('')
const createOpen = ref(false)
const createName = ref('')
const saveReady = ref(false)

/** Content format options for the studio picker. */
const contentTypeOptions = contentTypeSelectOptions()

/** Text LLM options for the studio picker (from shared catalog). */
const modelOptions = modelSelectOptions()

const sortedProjects = computed(() => sortByUpdated())

/** Furthest unlocked stage by workflow progress (0–3). */
const progressIndex = computed(() => {
  if (!scenarios.value.length) return 0
  if (!scriptApproved.value) return 1
  if (!frames.value.length || !framesApproved.value) return 2
  return 3
})

/** Green highlight follows where the user is looking / clicked. */
const focusedStepId = ref<string>('idea')

const steps = computed<WorkflowStep[]>(() => {
  const max = progressIndex.value
  const focus = focusedStepId.value
  return STEP_DEFS.map((def, index) => ({
    id: def.id,
    label: def.label,
    unlocked: index <= max,
    done: index < max,
    focused: def.id === focus
  }))
})

function syncFocusToProgress () {
  focusedStepId.value = STEP_DEFS[progressIndex.value]?.id || 'idea'
}

function selectStep (id: string) {
  const step = steps.value.find(item => item.id === id)
  if (!step?.unlocked) return
  focusedStepId.value = id
  // Prefer visible section; storyboard/prompts may be hidden until unlocked content exists
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  // Fallback scroll targets
  const fallback = id === 'storyboard'
    ? document.getElementById('scripts-panel')
    : id === 'prompt-stage'
      ? document.getElementById('storyboard')
      : document.getElementById('idea')
  fallback?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// When workflow advances (generate / approve), move green to the new current stage
watch(progressIndex, (next, prev) => {
  if (prev === undefined) return
  if (next !== prev) {
    focusedStepId.value = STEP_DEFS[next]?.id || 'idea'
  }
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
  contentType.value = resolveContentTypeId(draft?.contentType, getDefaultContentTypeId())
  selectedModel.value = resolveModelId(draft?.selectedModel, getDefaultModelId())
  scenarios.value = Array.isArray(draft?.scenarios) ? [...draft!.scenarios!] : []
  frames.value = Array.isArray(draft?.frames) ? draft!.frames!.map(frame => ({ ...frame })) : []
  prompts.value = Array.isArray(draft?.prompts) ? [...draft!.prompts!] : []
  scriptApproved.value = Boolean(draft?.scriptApproved)
  framesApproved.value = Boolean(draft?.framesApproved)
  nextTick(() => syncFocusToProgress())
}

function persistState () {
  if (!activeId.value || !saveReady.value) return
  saveDraft(activeId.value, {
    idea: idea.value,
    duration: duration.value,
    visualStyle: DEFAULT_STYLE,
    contentType: contentType.value,
    selectedModel: selectedModel.value,
    scenarios: scenarios.value,
    storyboardVisible: frames.value.length > 0,
    frames: frames.value,
    promptsVisible: prompts.value.length > 0,
    prompts: prompts.value,
    scriptApproved: scriptApproved.value,
    framesApproved: framesApproved.value
  })
}

watch([idea, duration, contentType, selectedModel, scenarios, frames, prompts, scriptApproved, framesApproved], () => {
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
  selectStep(id)
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

function activeModelId () {
  return resolveModelId(selectedModel.value, getDefaultModelId())
}

async function generateScenario () {
  const text = idea.value.trim()
  if (!text) {
    errorMessage.value = 'Сначала опишите идею.'
    return
  }

  const model = activeModelId()
  if (!isAllowedModel(model)) {
    errorMessage.value = 'Выберите доступную модель.'
    return
  }

  generating.value = true
  errorMessage.value = ''
  try {
    const request = SCRIPT_ENGINE.createRequest({
      idea: text,
      style: DEFAULT_STYLE,
      duration: duration.value,
      contentType: contentType.value,
      model,
      references: []
    })

    try {
      const data = await $fetch<{ output: string, model?: string }>('/api/workflow/scenario', {
        method: 'POST',
        body: { ...request, plan: planId.value }
      })
      scenarios.value = [parseScenarioOutput(data.output)]
    } catch (err: any) {
      const status = err?.statusCode || err?.status || 0
      // Demo only when AI is not configured; otherwise surface the error
      if (status === 503) {
        scenarios.value = [demoScenario(text)]
        errorMessage.value = 'AI не настроен — показан демо-сценарий. Добавьте OPENROUTER_API_KEY.'
      } else {
        errorMessage.value = err?.statusMessage || err?.data?.statusMessage || err?.message || 'Не удалось сгенерировать сценарий.'
        return
      }
    }

    scriptApproved.value = false
    frames.value = []
    prompts.value = []
    framesApproved.value = false
    focusedStepId.value = 'scripts-panel'
    nextTick(() => document.getElementById('scripts-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  } finally {
    generating.value = false
  }
}

async function approveScripts () {
  if (!scenarios.value.length) return
  scriptApproved.value = true
  errorMessage.value = ''

  const model = activeModelId()

  try {
    const request = STORYBOARD_ENGINE.createRequest({
      script: scenarios.value[0],
      style: DEFAULT_STYLE,
      duration: duration.value,
      contentType: contentType.value,
      model,
      references: []
    })
    try {
      const data = await $fetch<{ output: string, model?: string }>('/api/workflow/storyboard', {
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
    } catch (err: any) {
      const status = err?.statusCode || err?.status || 0
      if (status === 503) {
        frames.value = buildDemoFrames(scenarios.value[0], duration.value)
        errorMessage.value = 'AI не настроен — показана демо-раскадровка.'
      } else {
        frames.value = buildDemoFrames(scenarios.value[0], duration.value)
        errorMessage.value = err?.statusMessage || err?.data?.statusMessage || err?.message || 'Раскадровка: ошибка API, показан локальный черновик.'
      }
    }
  } catch {
    frames.value = buildDemoFrames(scenarios.value[0], duration.value)
  }

  focusedStepId.value = 'storyboard'
  nextTick(() => document.getElementById('storyboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function approveFrames () {
  if (!frames.value.length) return
  framesApproved.value = true
  prompts.value = buildPromptsFromFrames(frames.value, DEFAULT_STYLE)
  focusedStepId.value = 'prompt-stage'
  nextTick(() => document.getElementById('prompt-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
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
    style: DEFAULT_STYLE,
    duration: duration.value,
    contentType: contentType.value,
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
      @switch="switchProject"
      @create="openCreate"
    />

    <div class="layout">
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
            v-model:content-type="contentType"
            v-model:selected-model="selectedModel"
            :generating="generating"
            :content-type-options="contentTypeOptions"
            :model-options="modelOptions"
            @generate="generateScenario"
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

      <StudioWorkflowSidebar :steps="steps" @select="selectStep" />
    </div>

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
/* padding inherited from global .shell — no page-specific rail width */

.layout {
  display: grid;
  /* Main column first, stages rail on the right */
  grid-template-columns: minmax(0, 1fr) 200px;
  gap: 28px;
  align-items: start;
  padding-top: 40px;
}

.workspace {
  min-width: 0;
  /* Keep primary panels visually centered in the main column */
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
}

.hero {
  margin: 0 0 40px;
  padding: 20px 0 28px;
  border-bottom: 1px solid rgba(26, 46, 31, 0.14);
  text-align: center;
}

h1 {
  max-width: 720px;
  margin: 0 auto;
  font-size: clamp(48px, 6vw, 80px);
  line-height: 0.88;
}

.hero p {
  max-width: 420px;
  margin: 16px auto 0;
  font-size: 16px;
  line-height: 1.35;
  color: var(--color-fog, #78786f);
}

.stack {
  display: grid;
  gap: 20px;
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
  border: 1px solid rgba(107, 78, 255, 0.24);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.48);
  outline: none;
}

.form-actions {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  margin-top: 8px;
}

@media (max-width: 980px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) 176px;
    gap: 20px;
  }

  .workspace {
    max-width: none;
  }
}

@media (max-width: 760px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 16px;
  }

  /* Stages strip first on mobile (above content) via order */
  .layout > :last-child {
    order: -1;
  }

  .workspace {
    max-width: none;
  }

  .hero {
    margin-bottom: 20px;
    padding: 8px 0 18px;
    text-align: left;
  }

  h1 {
    margin: 0;
    font-size: clamp(34px, 9vw, 48px);
    line-height: 0.92;
  }

  .hero p {
    margin: 12px 0 0;
    font-size: 15px;
  }

  .stack {
    gap: 14px;
  }

  .form-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  h1 {
    font-size: 32px;
  }
}
</style>
