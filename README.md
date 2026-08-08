# Viral Script Studio (Nuxt 4)

Продукт для превращения идеи в сценарий, раскадровку и image-промты.

Стек: **Nuxt 4 + Vue 3 + Nitro**. UI — editorial cream-система (Figtree + EB Garamond).

---

## Что изменилось (миграция)

### Было (static HTML)

- Отдельные страницы: `index.html`, `projects.html`, `plans.html`, `studio.html`
- Стили и логика внутри каждого HTML
- `server.js` (Node http) + `projects-store.js` / engines как global scripts
- Деплой-копия в `dist/`

### Стало (Nuxt 4)

| Было | Стало |
|------|--------|
| `index.html` | `app/pages/index.vue` |
| `projects.html` | `app/pages/projects.vue` |
| `plans.html` | `app/pages/plans.vue` |
| `studio.html` | `app/pages/studio.vue` |
| CSS в `<style>` HTML | `app/assets/css/tokens.css` + `main.css` + scoped styles |
| `projects-store.js` | `app/composables/useProjects.ts` |
| `script-engine.js` | `app/utils/scriptEngine.ts` |
| `storyboard-engine.js` | `app/utils/storyboardEngine.ts` |
| `server.js` API | `server/api/**` (Nitro) |
| Inline UI | Vue-компоненты в `app/components/**` |

Старые static-файлы перенесены в **`legacy/`** (архив, не используются приложением).

---

## Дизайн-токены (единый файл цветов)

**Источник правды:**

1. **`app/assets/tokens.ts`** — TypeScript-объект (`colors`, `fonts`, `radii`, `plans`)
2. **`app/assets/css/tokens.css`** — CSS-переменные (`--color-*`, `--font-*`, `--radius-*`)

Значения **зеркальны 1:1**. Подключение:

- CSS: через `nuxt.config.ts` → `css: ['~/assets/css/main.css']` (main импортирует tokens)
- JS/TS: `import { colors, plans } from '~/assets/tokens'`

### Палитра

| Token | Hex | CSS var |
|-------|-----|---------|
| cream | `#ffffeb` | `--color-cream` |
| stone | `#e4e4d0` | `--color-stone` |
| ink | `#1a1a1a` | `--color-ink` |
| forest | `#034f46` | `--color-forest` |
| lavender | `#f0d7ff` | `--color-lavender` |
| lavenderHover | `#e5c2fb` | `--color-lavender-hover` |
| ember | `#ffa946` | `--color-ember` |
| fog | `#78786f` | `--color-fog` |

Шрифты: **Figtree** (UI), **EB Garamond** (заголовки).

---

## Компоненты

### UI (`app/components/ui/`)

| Компонент | Назначение |
|-----------|------------|
| `AppButton` | Кнопки primary / secondary / ghost / danger |
| `AppBadge` | Статус-пилюли |
| `AppEyebrow` | Верхние подписи секций |
| `AppModal` | Модальные окна |
| `AppNav` | Общая навигация (лендинг / проекты / тарифы) |

### Landing (`app/components/landing/`)

- `LandingHero`, `LandingFlow`, `LandingChamber`, `LandingClosing`

### Projects (`app/components/projects/`)

- `ProjectCard` — карточка проекта (open / rename / duplicate / delete)

### Plans (`app/components/plans/`)

- `PlanCard` — тариф Plus / Pro

### Studio (`app/components/studio/`)

- `StudioHeader` — «← Проекты», switcher, новый проект, тариф
- `WorkflowSidebar` — этапы 01–04
- `IdeaPanel` — идея, длительность, стиль
- `ScriptsPanel` — сценарии + approve
- `StoryboardPanel` — кадры
- `PromptPanel` — image-промты
- `StyleModal` — галерея стилей

Nuxt auto-import: `UiAppButton`, `LandingLandingHero`, `ProjectsProjectCard`, `StudioIdeaPanel`, …

---

## Страницы и маршруты

| URL | Файл | Описание |
|-----|------|----------|
| `/login` | `pages/login.vue` | Вход по паролю (`4andrey`) |
| `/` | `pages/index.vue` | **Один большой лендинг** (все секции) |
| `/projects` | `pages/projects.vue` | Библиотека проектов (после входа) |
| `/studio` | `pages/studio.vue` | Воркспейс (`?project=id`) |
| `/plans` | `pages/plans.vue` | **Редирект на `/#pricing`**, оплата отключена |

### Доступ

- Глобальный middleware `auth.global.ts`
- Пароль: `4andrey` (см. `useAuth.ts`)
- Cookie `vss-gate` + sessionStorage

### Лендинг-секции

1. Hero  
2. Как это работает (`#how-it-works`)  
3. Chamber  
4. Проекты (`#projects`)  
5. Студия (`#studio`)  
6. Тарифы (`#pricing`) — **кнопки оплаты закомментированы**  
7. Closing  

### Платёжка

Временно выключена: UI «Оплата скоро», checkout-код в `LandingPricing.vue` в комментарии. Отдельная страница `/plans` только редиректит на якорь.

### Продуктовый поток

```
Landing → Projects (дом приложения) → Studio (один проект)
                ↕ localStorage
```

- Создание / переименование / дублирование / удаление проектов
- Прогресс: Пустой → Идея → Сценарий → Раскадровка → Промты
- Студия: URL ` /studio?project=… `, switcher, autosave

---

## Composables & API

### `useProjects()`

Клиентский store (совместим с прежними ключами localStorage):

- `viral-script-studio-projects-v1`
- `viral-script-studio-active-project-v1`
- `viral-script-studio-draft-v2-{id}`
- `viral-script-studio-plan-v1`

### `usePlan()`

Выбор Plus / Pro.

### Server API (Nitro)

| Endpoint | Метод | Назначение |
|----------|-------|------------|
| `/api/health` | GET | Статус ключа |
| `/api/workflow/scenario` | POST | Генерация сценария (OpenRouter) |
| `/api/workflow/storyboard` | POST | Генерация раскадровки |

**Live-инструкции модели** (system prompt) — markdown, правишь файл → следующий запрос уже по новым правилам:

| Этап | Файл |
|------|------|
| Идея → сценарий | `docs/prompts/scenario.md` (+ pack `server/assets/prompts/`) |
| Сценарий → раскадровка | `docs/prompts/storyboard.md` (+ pack `server/assets/prompts/`) |

Клиент шлёт только входы (`idea` / `script`, style, duration, model). System prompt с клиента **игнорируется** — сервер всегда читает MD.

Без `OPENROUTER_API_KEY` студия падает в **demo-режим** (локальные заглушки), UI не ломается.

---

## Структура репозитория

```
app/
  assets/
    tokens.ts              # TS design tokens
    css/tokens.css         # CSS variables
    css/main.css
  components/
    ui/ landing/ projects/ plans/ studio/
  composables/
    useProjects.ts
    usePlan.ts
  layouts/
  pages/
  utils/
    scriptEngine.ts
    storyboardEngine.ts
server/
  api/
    health.get.ts
    workflow/scenario.post.ts
    workflow/storyboard.post.ts
  utils/
    openrouter.ts
    promptLoader.ts          # читает docs/prompts/*.md
docs/
  prompts/
    scenario.md              # live system prompt сценария
    storyboard.md            # live system prompt раскадровки
  AI_Content_Workflow_PRD.md
public/
  og.png
  style-gallery.png
legacy/                    # старый static HTML/JS (архив)
nuxt.config.ts
package.json
README.md
```

---

## Запуск

### Требования

- Node.js **20+** (рекомендуется 22 LTS)
- npm 10+

### Установка

```bash
npm install
```

### Env

Скопируйте `.env.example` → `.env`:

```bash
OPENROUTER_API_KEY=sk-or-...
NUXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
PLUS_MODEL=google/gemini-2.5-flash
PRO_MODEL=anthropic/claude-sonnet-5
```

На хостинге достаточно секретов (см. **Деплой** ниже). Ключ также можно задать как `NUXT_OPENROUTER_API_KEY`.

### Dev

```bash
npm run dev
```

Откройте: **http://127.0.0.1:3000**

### Build / production

```bash
npm run build
npm run start          # node .output/server/index.mjs
# или локально:
npm run preview
```

Проверка живости: `GET /api/health` → `{ ok: true, serverKeyConfigured: true/false }`.

> `npm run generate` — static export **без** server API. Для студии с AI нужен **Node server** (`build` + `start`).

---

## Деплой (шаг 1)

Нужен **Node runtime** (Nuxt/Nitro), не pure static hosting.

### Env на хостинге (минимум)

| Переменная | Обязательно | Назначение |
|------------|-------------|------------|
| `OPENROUTER_API_KEY` или `NUXT_OPENROUTER_API_KEY` | да* | Ключ OpenRouter |
| `NUXT_PUBLIC_SITE_URL` | да в prod | Публичный URL сайта (Referer для OpenRouter) |
| `PLUS_MODEL` / `PRO_MODEL` | нет | Fallback-модели |
| `PORT` / `HOST` | нет | Обычно `3000` / `0.0.0.0` (VPS) |

\*Без ключа UI жив, AI уходит в demo-режим (503 → локальные заглушки).

### Vercel

1. Import repo → Framework **Nuxt** (auto).
2. Env: `OPENROUTER_API_KEY`, `NUXT_PUBLIC_SITE_URL=https://your-app.vercel.app`
3. Deploy. Build: `nuxt build` (default).

### Railway / Render / Fly / VPS

```bash
npm ci
npm run build
npm run start
```

- Start command: `npm run start` или `node .output/server/index.mjs`
- Health check: `/api/health`
- Открой `HOST=0.0.0.0` если платформа не проставляет сама

### Docker (опционально)

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### После деплоя

1. Открой сайт → логин (если включён) → студия  
2. `GET /api/health` — `serverKeyConfigured: true`  
3. Сгенерируй сценарий на короткой идее  

### Важно

- Промпты **упакованы в Nitro** (`server/assets/prompts` + `docs/prompts` как serverAssets) — на serverless файлы с диска не нужны. При правке инструкций обнови оба пути (или скопируй docs → server/assets).  
- Rate limit (20/мин/IP) — in-memory: на multi-instance serverless счётчики не общие (для MVP ок).  
- Проекты пока в **localStorage** браузера — на другом устройстве их нет.  
- PowerShell-fallback OpenRouter только на **Windows**; Linux-хостинг ходит через `fetch`.

---

## Поведение AI

1. Студия шлёт `idea`/`script` + style/duration/model на `/api/workflow/*`
2. Сервер подмешивает system prompt из `docs/prompts/*.md`
3. Nitro проксирует в OpenRouter (ключ только на сервере)
4. Модель из пикера / fallback по `plan`
5. Rate limit: 20 req / мин / IP
6. При ошибке/отсутствии ключа — demo-контент

---

## Совместимость данных

Проекты из pre-Nuxt версии **подхватятся автоматически**: ключи localStorage не менялись.  
Черновики в Nuxt-студии хранятся в структурированном JSON (`scenarios`, `frames`, `prompts`) — старые HTML-черновики с `cardsHtml` могут открыться как «пустые»; создайте новый проект или перегенерируйте сценарий.

---

## Дальше (не в этом PR)

- Auth + облачная БД (Postgres)
- Полноценный billing
- IndexedDB-референсы персонажей в Nuxt-компонентах
- E2E-тесты

---

## Лицензия / продукт

Viral Script Studio — MVP workflow-продукт. Вопросы по дизайну: токены в `app/assets/tokens.ts` и `tokens.css`.
