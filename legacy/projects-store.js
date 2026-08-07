/**
 * Shared project storage for Viral Script Studio.
 * Browser-local for now (localStorage + IndexedDB for refs).
 * Swap this module later for an API without rewriting pages.
 */
(function (global) {
  const REGISTRY_KEY = 'viral-script-studio-projects-v1';
  const ACTIVE_KEY = 'viral-script-studio-active-project-v1';
  const PLAN_KEY = 'viral-script-studio-plan-v1';

  function draftKey(id) {
    return `viral-script-studio-draft-v2-${id}`;
  }

  function referencesDbName(id) {
    return `viral-script-studio-references-v2-${id}`;
  }

  function now() {
    return new Date().toISOString();
  }

  function uid() {
    return `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function getProjects() {
    try {
      const list = JSON.parse(localStorage.getItem(REGISTRY_KEY));
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function saveProjects(projects) {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(projects));
    return projects;
  }

  function getActiveId() {
    return localStorage.getItem(ACTIVE_KEY) || '';
  }

  function setActiveId(id) {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    return id;
  }

  function getDraft(id) {
    if (!id) return null;
    try {
      return JSON.parse(localStorage.getItem(draftKey(id)));
    } catch (_) {
      return null;
    }
  }

  function saveDraftRaw(id, state) {
    if (!id || !state) return;
    localStorage.setItem(draftKey(id), JSON.stringify(state));
  }

  function removeDraft(id) {
    localStorage.removeItem(draftKey(id));
  }

  function findProject(id) {
    return getProjects().find((project) => project.id === id) || null;
  }

  function touch(id) {
    const projects = getProjects();
    const project = projects.find((item) => item.id === id);
    if (!project) return null;
    project.updatedAt = now();
    saveProjects(projects);
    return project;
  }

  function createProject(name, seedDraft) {
    const projects = getProjects();
    const id = uid();
    const stamp = now();
    const project = {
      id,
      name: String(name || '').trim() || 'Новый ролик',
      createdAt: stamp,
      updatedAt: stamp
    };
    projects.unshift(project);
    saveProjects(projects);
    if (seedDraft) {
      if (typeof seedDraft === 'string') localStorage.setItem(draftKey(id), seedDraft);
      else saveDraftRaw(id, seedDraft);
    }
    setActiveId(id);
    return project;
  }

  function renameProject(id, name) {
    const projects = getProjects();
    const project = projects.find((item) => item.id === id);
    if (!project) return null;
    const next = String(name || '').trim();
    if (!next) return project;
    project.name = next;
    project.updatedAt = now();
    saveProjects(projects);
    return project;
  }

  function duplicateProject(id) {
    const source = findProject(id);
    if (!source) return null;
    const draft = localStorage.getItem(draftKey(id));
    return createProject(`${source.name} — копия`, draft || undefined);
  }

  function deleteProject(id) {
    let projects = getProjects();
    if (projects.length <= 1) {
      return { ok: false, reason: 'last', projects };
    }
    if (!projects.some((project) => project.id === id)) {
      return { ok: false, reason: 'missing', projects };
    }
    projects = projects.filter((project) => project.id !== id);
    saveProjects(projects);
    removeDraft(id);
    try {
      indexedDB.deleteDatabase(referencesDbName(id));
    } catch (_) { /* ignore */ }
    if (getActiveId() === id) {
      setActiveId(projects[0]?.id || '');
    }
    return { ok: true, projects, activeId: getActiveId() };
  }

  function ensureAtLeastOne() {
    let projects = getProjects();
    if (!projects.length) {
      createProject('Мой первый ролик');
      projects = getProjects();
    }
    const active = getActiveId();
    if (!projects.some((project) => project.id === active)) {
      setActiveId(projects[0].id);
    }
    return projects;
  }

  function sortByUpdated(projects) {
    return [...projects].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
  }

  function ideaPreview(draft) {
    const text = String(draft?.idea || '').replace(/\s+/g, ' ').trim();
    if (!text) return 'Идея ещё не описана';
    return text.length > 110 ? `${text.slice(0, 107)}…` : text;
  }

  function getProjectProgress(id) {
    const draft = getDraft(id);
    if (!draft) {
      return {
        stage: 0,
        stageKey: 'empty',
        label: 'Пустой',
        detail: 'Ещё не начат',
        ideaPreview: 'Идея ещё не описана',
        percent: 0
      };
    }

    const hasIdea = Boolean(String(draft.idea || '').trim());
    const scriptCount = Array.isArray(draft.scriptValues)
      ? draft.scriptValues.filter((value) => String(value || '').trim()).length
      : (draft.cardsHtml ? 1 : 0);
    const hasScripts = scriptCount > 0 || Boolean(draft.scriptApproved);
    const hasStoryboard = Boolean(draft.storyboardVisible && draft.framesHtml);
    const framesApproved = Boolean(draft.framesApproved);
    const hasPrompts = Boolean(draft.promptsVisible && draft.promptsHtml);

    let stage = 0;
    let stageKey = 'empty';
    let label = 'Пустой';
    let detail = 'Ещё не начат';
    let percent = 0;

    if (hasPrompts || framesApproved) {
      stage = 4;
      stageKey = 'prompts';
      label = 'Промты';
      detail = hasPrompts ? 'Готовы к генерации' : 'Кадры одобрены';
      percent = 100;
    } else if (hasStoryboard) {
      stage = 3;
      stageKey = 'storyboard';
      label = 'Раскадровка';
      detail = 'Кадры в работе';
      percent = 75;
    } else if (hasScripts) {
      stage = 2;
      stageKey = 'script';
      label = 'Сценарий';
      detail = draft.scriptApproved ? 'Сценарий одобрен' : 'Сценарий готов';
      percent = 50;
    } else if (hasIdea) {
      stage = 1;
      stageKey = 'idea';
      label = 'Идея';
      detail = 'Описание есть';
      percent = 25;
    }

    return {
      stage,
      stageKey,
      label,
      detail,
      ideaPreview: ideaPreview(draft),
      percent,
      scriptCount
    };
  }

  function studioUrl(id) {
    const projectId = id || getActiveId();
    return projectId ? `./studio.html?project=${encodeURIComponent(projectId)}` : './studio.html';
  }

  function projectsUrl() {
    return './projects.html';
  }

  function formatRelative(iso) {
    if (!iso) return 'только что';
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return 'недавно';
    const diff = Date.now() - then;
    const minute = 60_000;
    const hour = 60 * minute;
    const day = 24 * hour;
    if (diff < minute) return 'только что';
    if (diff < hour) return `${Math.floor(diff / minute)} мин назад`;
    if (diff < day) return `${Math.floor(diff / hour)} ч назад`;
    if (diff < 7 * day) return `${Math.floor(diff / day)} дн назад`;
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }

  function getPlan() {
    return localStorage.getItem(PLAN_KEY) || 'plus';
  }

  global.VSSProjects = {
    REGISTRY_KEY,
    ACTIVE_KEY,
    PLAN_KEY,
    draftKey,
    referencesDbName,
    getProjects,
    saveProjects,
    getActiveId,
    setActiveId,
    getDraft,
    saveDraftRaw,
    removeDraft,
    findProject,
    touch,
    createProject,
    renameProject,
    duplicateProject,
    deleteProject,
    ensureAtLeastOne,
    sortByUpdated,
    getProjectProgress,
    studioUrl,
    projectsUrl,
    formatRelative,
    getPlan,
    uid
  };
})(window);
