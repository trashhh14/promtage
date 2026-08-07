import type { PlanId } from '~/assets/tokens'

export type Project = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type ProjectDraft = {
  idea?: string
  visualStyle?: string
  duration?: number
  selectedModel?: string
  scenarios?: string[]
  storyboardVisible?: boolean
  frames?: { duration: number, visual: string, voiceover: string }[]
  promptsVisible?: boolean
  prompts?: string[]
  scriptApproved?: boolean
  framesApproved?: boolean
}

export type ProjectProgress = {
  stage: number
  stageKey: string
  label: string
  detail: string
  ideaPreview: string
  percent: number
}

const REGISTRY_KEY = 'viral-script-studio-projects-v1'
const ACTIVE_KEY = 'viral-script-studio-active-project-v1'
const PLAN_KEY = 'viral-script-studio-plan-v1'

function draftKey (id: string) {
  return `viral-script-studio-draft-v2-${id}`
}

function now () {
  return new Date().toISOString()
}

function uid () {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function ideaPreview (draft: ProjectDraft | null) {
  const text = String(draft?.idea || '').replace(/\s+/g, ' ').trim()
  if (!text) return 'Идея ещё не описана'
  return text.length > 110 ? `${text.slice(0, 107)}…` : text
}

export function useProjects () {
  const projects = useState<Project[]>('vss-projects', () => [])
  const activeId = useState<string>('vss-active-project', () => '')
  const ready = useState<boolean>('vss-projects-ready', () => false)

  function loadFromStorage () {
    if (!import.meta.client) return
    try {
      const list = JSON.parse(localStorage.getItem(REGISTRY_KEY) || '[]')
      projects.value = Array.isArray(list) ? list : []
    } catch {
      projects.value = []
    }
    activeId.value = localStorage.getItem(ACTIVE_KEY) || ''
    ready.value = true
  }

  function persist () {
    if (!import.meta.client) return
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(projects.value))
    if (activeId.value) localStorage.setItem(ACTIVE_KEY, activeId.value)
  }

  function getDraft (id: string): ProjectDraft | null {
    if (!import.meta.client || !id) return null
    try {
      return JSON.parse(localStorage.getItem(draftKey(id)) || 'null')
    } catch {
      return null
    }
  }

  function saveDraft (id: string, state: ProjectDraft) {
    if (!import.meta.client || !id) return
    localStorage.setItem(draftKey(id), JSON.stringify(state))
    touch(id)
  }

  function removeDraft (id: string) {
    if (!import.meta.client) return
    localStorage.removeItem(draftKey(id))
  }

  function findProject (id: string) {
    return projects.value.find(project => project.id === id) || null
  }

  function setActiveId (id: string) {
    activeId.value = id
    if (import.meta.client && id) localStorage.setItem(ACTIVE_KEY, id)
  }

  function touch (id: string) {
    const project = findProject(id)
    if (!project) return null
    project.updatedAt = now()
    projects.value = [...projects.value]
    persist()
    return project
  }

  function createProject (name: string, seedDraft?: ProjectDraft | string) {
    const stamp = now()
    const project: Project = {
      id: uid(),
      name: String(name || '').trim() || 'Новый ролик',
      createdAt: stamp,
      updatedAt: stamp
    }
    projects.value = [project, ...projects.value]
    if (seedDraft) {
      if (typeof seedDraft === 'string') localStorage.setItem(draftKey(project.id), seedDraft)
      else saveDraft(project.id, seedDraft)
    }
    setActiveId(project.id)
    persist()
    return project
  }

  function renameProject (id: string, name: string) {
    const project = findProject(id)
    if (!project) return null
    const next = String(name || '').trim()
    if (!next) return project
    project.name = next
    project.updatedAt = now()
    projects.value = [...projects.value]
    persist()
    return project
  }

  function duplicateProject (id: string) {
    const source = findProject(id)
    if (!source) return null
    const draft = import.meta.client ? localStorage.getItem(draftKey(id)) : null
    return createProject(`${source.name} — копия`, draft || undefined)
  }

  function deleteProject (id: string) {
    if (projects.value.length <= 1) {
      return { ok: false as const, reason: 'last' as const }
    }
    if (!findProject(id)) {
      return { ok: false as const, reason: 'missing' as const }
    }
    projects.value = projects.value.filter(project => project.id !== id)
    removeDraft(id)
    if (activeId.value === id) {
      setActiveId(projects.value[0]?.id || '')
    }
    persist()
    return { ok: true as const, activeId: activeId.value }
  }

  function ensureAtLeastOne () {
    if (!projects.value.length) {
      createProject('Мой первый ролик')
    }
    if (!projects.value.some(project => project.id === activeId.value)) {
      setActiveId(projects.value[0].id)
    }
    return projects.value
  }

  function sortByUpdated (list = projects.value) {
    return [...list].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
  }

  function getProjectProgress (id: string): ProjectProgress {
    const draft = getDraft(id)
    if (!draft) {
      return {
        stage: 0,
        stageKey: 'empty',
        label: 'Пустой',
        detail: 'Ещё не начат',
        ideaPreview: 'Идея ещё не описана',
        percent: 0
      }
    }

    const hasIdea = Boolean(String(draft.idea || '').trim())
    const scriptCount = Array.isArray(draft.scenarios)
      ? draft.scenarios.filter(value => String(value || '').trim()).length
      : 0
    const hasScripts = scriptCount > 0 || Boolean(draft.scriptApproved)
    const hasStoryboard = Boolean(draft.storyboardVisible && draft.frames?.length)
    const framesApproved = Boolean(draft.framesApproved)
    const hasPrompts = Boolean(draft.promptsVisible && draft.prompts?.length)

    if (hasPrompts || framesApproved) {
      return {
        stage: 4,
        stageKey: 'prompts',
        label: 'Промты',
        detail: hasPrompts ? 'Готовы к генерации' : 'Кадры одобрены',
        ideaPreview: ideaPreview(draft),
        percent: 100
      }
    }
    if (hasStoryboard) {
      return {
        stage: 3,
        stageKey: 'storyboard',
        label: 'Раскадровка',
        detail: 'Кадры в работе',
        ideaPreview: ideaPreview(draft),
        percent: 75
      }
    }
    if (hasScripts) {
      return {
        stage: 2,
        stageKey: 'script',
        label: 'Сценарий',
        detail: draft.scriptApproved ? 'Сценарий одобрен' : 'Сценарий готов',
        ideaPreview: ideaPreview(draft),
        percent: 50
      }
    }
    if (hasIdea) {
      return {
        stage: 1,
        stageKey: 'idea',
        label: 'Идея',
        detail: 'Описание есть',
        ideaPreview: ideaPreview(draft),
        percent: 25
      }
    }

    return {
      stage: 0,
      stageKey: 'empty',
      label: 'Пустой',
      detail: 'Ещё не начат',
      ideaPreview: ideaPreview(draft),
      percent: 0
    }
  }

  function formatRelative (iso?: string) {
    if (!iso) return 'только что'
    const then = new Date(iso).getTime()
    if (Number.isNaN(then)) return 'недавно'
    const diff = Date.now() - then
    const minute = 60_000
    const hour = 60 * minute
    const day = 24 * hour
    if (diff < minute) return 'только что'
    if (diff < hour) return `${Math.floor(diff / minute)} мин назад`
    if (diff < day) return `${Math.floor(diff / hour)} ч назад`
    if (diff < 7 * day) return `${Math.floor(diff / day)} дн назад`
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }

  function getPlan (): PlanId {
    if (!import.meta.client) return 'plus'
    const value = localStorage.getItem(PLAN_KEY)
    return value === 'pro' ? 'pro' : 'plus'
  }

  function setPlan (plan: PlanId) {
    if (!import.meta.client) return
    localStorage.setItem(PLAN_KEY, plan)
  }

  function studioPath (id?: string) {
    const projectId = id || activeId.value
    return projectId ? `/studio?project=${encodeURIComponent(projectId)}` : '/studio'
  }

  function init () {
    if (!import.meta.client || ready.value) return
    loadFromStorage()
  }

  return {
    projects,
    activeId,
    ready,
    init,
    loadFromStorage,
    persist,
    getDraft,
    saveDraft,
    findProject,
    setActiveId,
    touch,
    createProject,
    renameProject,
    duplicateProject,
    deleteProject,
    ensureAtLeastOne,
    sortByUpdated,
    getProjectProgress,
    formatRelative,
    getPlan,
    setPlan,
    studioPath,
    draftKey
  }
}
