import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export type PromptStage = 'scenario' | 'storyboard'

/**
 * Live prompt files.
 * Source of truth for editors: docs/prompts/*.md
 * Runtime pack: server/assets/prompts/*.md (Nitro assets:server) — keep in sync.
 */
const PROMPT_FILES: Record<PromptStage, string> = {
  scenario: 'scenario.md',
  storyboard: 'storyboard.md'
}

/** Drop the human-facing header (title + "live" blurb + ---) so the model gets pure instruction. */
function stripDocHeader (raw: string): string {
  const text = raw.replace(/^\uFEFF/, '').trim()
  const fence = text.indexOf('\n---\n')
  if (fence !== -1) {
    return text.slice(fence + 5).trim()
  }
  const lines = text.split(/\r?\n/)
  if (lines[0]?.startsWith('#')) {
    let i = 1
    while (i < lines.length && lines[i].trim() !== '') i += 1
    while (i < lines.length && lines[i].trim() === '') i += 1
    return lines.slice(i).join('\n').trim() || text
  }
  return text
}

function asText (value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (value instanceof Uint8Array) return Buffer.from(value).toString('utf8')
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) return value.toString('utf8')
  return String(value)
}

/**
 * Load order:
 * 1) Nitro server assets (production / serverless)
 * 2) docs/prompts on disk (dev / node with repo cwd)
 * 3) server/assets/prompts on disk
 */
async function readPromptFile (fileName: string): Promise<string> {
  const assetKeys = [
    `prompts/${fileName}`,
    fileName
  ]

  for (const key of assetKeys) {
    try {
      const storage = useStorage('assets:server')
      const fromServer = asText(await storage.getItem(key)).trim()
      if (fromServer) return fromServer
    } catch {
      /* continue */
    }
    try {
      const storage = useStorage('assets:prompts')
      const fromPrompts = asText(await storage.getItem(key)).trim()
      if (fromPrompts) return fromPrompts
    } catch {
      /* continue */
    }
  }

  const candidates = [
    join(process.cwd(), 'docs', 'prompts', fileName),
    join(process.cwd(), 'server', 'assets', 'prompts', fileName)
  ]

  for (const fullPath of candidates) {
    try {
      const raw = await readFile(fullPath, 'utf8')
      if (raw.trim()) return raw
    } catch {
      /* try next */
    }
  }

  throw new Error(`Prompt file not found: ${fileName}`)
}

export async function loadStagePrompt (stage: PromptStage): Promise<string> {
  const fileName = PROMPT_FILES[stage]
  try {
    const raw = await readPromptFile(fileName)
    const prompt = stripDocHeader(raw)
    if (!prompt) {
      throw new Error(`Prompt file is empty: ${fileName}`)
    }
    return prompt
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Не удалось загрузить инструкцию ${fileName}: ${err?.message || err}`
    })
  }
}

export function buildScenarioUserMessage (input: {
  idea: string
  style?: string
  duration?: number
  contentType?: string
  contentTypeHint?: string
  references?: { name: string }[]
}): string {
  const idea = input.idea.trim()
  const style = (input.style || 'Photorealistic cinematic editorial').trim()
  const duration = Number(input.duration) > 0 ? Number(input.duration) : 30
  const contentType = (input.contentType || 'expert').trim()
  const contentTypeHint = (input.contentTypeHint || '').trim()
  const refs = Array.isArray(input.references) ? input.references : []
  const characterContext = refs.length
    ? refs.map((reference, index) => `image ${index + 1}: ${reference.name}`).join('; ')
    : 'No character references were uploaded.'

  return [
    `Create one ${duration}-second short-form video scenario.`,
    '',
    'User idea:',
    idea,
    '',
    'Content type:',
    contentType,
    ...(contentTypeHint ? ['Format guidance:', contentTypeHint] : []),
    '',
    'Visual style:',
    style,
    '',
    'Character references to preserve consistently:',
    characterContext,
    '',
    'Use the selected content type, style, and all relevant character references as creative constraints. Do not mention this instruction in the result.'
  ].join('\n')
}

export function buildStoryboardUserMessage (input: {
  script: string
  style?: string
  duration?: number
  contentType?: string
  contentTypeHint?: string
  references?: { name: string }[]
}): string {
  const script = input.script.trim()
  const style = (input.style || 'Photorealistic cinematic editorial').trim()
  const duration = Number(input.duration) > 0 ? Number(input.duration) : 30
  const contentType = (input.contentType || 'expert').trim()
  const contentTypeHint = (input.contentTypeHint || '').trim()
  const refs = Array.isArray(input.references) ? input.references : []
  const characterContext = refs.length
    ? refs.map((reference, index) => `image ${index + 1}: ${reference.name}`).join('; ')
    : 'No character references were uploaded.'

  return [
    'Approved scenario:',
    script,
    '',
    `Target video duration: exactly ${duration} seconds.`,
    '',
    'Content type:',
    contentType,
    ...(contentTypeHint ? ['Format guidance:', contentTypeHint] : []),
    '',
    'Visual style:',
    style,
    '',
    'Character references to preserve consistently:',
    characterContext,
    '',
    'Return the JSON storyboard now.'
  ].join('\n')
}
