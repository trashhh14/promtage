/**
 * Content format / creative mode for studio generation.
 */
export type ContentType = {
  id: string
  label: string
  hint?: string
  /** Short instruction fragment for the LLM user message */
  promptHint: string
  enabled?: boolean
}

export const CONTENT_TYPES: ContentType[] = [
  {
    id: 'expert',
    label: 'Экспертный',
    hint: 'Авторитет · польза',
    promptHint:
      'Expert-led educational format: clear authority voice, concrete tips, high trust, practical value without fluff.',
    enabled: true
  },
  {
    id: 'reach',
    label: 'Охватыный',
    hint: 'Хук · виральность',
    promptHint:
      'High-reach short-form format: strong hook in the first second, pattern interrupt, shareable twist, retention-first pacing.',
    enabled: true
  },
  {
    id: 'cartoon',
    label: 'Мультфильм',
    hint: 'Анимация · характер',
    promptHint:
      'Animated cartoon format: expressive characters, stylized motion, playful visual gags, clear silhouette storytelling.',
    enabled: true
  },
  {
    id: 'series',
    label: 'Сериал',
    hint: 'Эпизод · сериальность',
    promptHint:
      'Serialized episode format: ongoing character arc, cliffhanger-friendly structure, recap-friendly beats, binge impulse.',
    enabled: true
  }
]

export function listEnabledContentTypes (): ContentType[] {
  return CONTENT_TYPES.filter(item => item.enabled !== false)
}

export function getDefaultContentTypeId (): string {
  return listEnabledContentTypes()[0]?.id || CONTENT_TYPES[0]?.id || 'expert'
}

export function isAllowedContentType (id: string | undefined | null): id is string {
  if (!id || typeof id !== 'string') return false
  return listEnabledContentTypes().some(item => item.id === id)
}

export function resolveContentTypeId (requested?: string | null, fallback?: string | null): string {
  if (isAllowedContentType(requested)) return requested
  if (isAllowedContentType(fallback)) return fallback
  return getDefaultContentTypeId()
}

export function getContentType (id?: string | null): ContentType | undefined {
  return listEnabledContentTypes().find(item => item.id === id)
}

export function contentTypeSelectOptions () {
  return listEnabledContentTypes().map(item => ({
    value: item.id,
    label: item.label,
    hint: item.hint
  }))
}
