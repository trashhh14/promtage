/**
 * Text LLM catalog for studio generation (OpenRouter model ids).
 * One strong, cost-efficient text model per major provider.
 */
export type LlmModel = {
  /** OpenRouter model id */
  id: string
  /** Label shown in the UI */
  label: string
  /** Provider name for secondary UI text */
  provider: string
  /** Optional short hint under the label */
  hint?: string
  /** Set false to hide without deleting */
  enabled?: boolean
}

/**
 * Practical top tier for text — good quality without flagship prices.
 */
export const LLM_MODELS: LlmModel[] = [
  {
    id: 'openai/gpt-5.4-mini',
    label: 'GPT-5.4 Mini',
    provider: 'OpenAI',
    hint: 'Сильно · недорого',
    enabled: true
  },
  {
    id: 'anthropic/claude-sonnet-5',
    label: 'Claude Sonnet 5',
    provider: 'Anthropic',
    hint: 'Лучший текст',
    enabled: true
  },
  {
    id: 'google/gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    provider: 'Google',
    hint: 'Быстро · дёшево',
    enabled: true
  }
]

export function listEnabledModels (): LlmModel[] {
  return LLM_MODELS.filter(model => model.enabled !== false)
}

export function getDefaultModelId (): string {
  return listEnabledModels()[0]?.id || LLM_MODELS[0]?.id || ''
}

export function isAllowedModel (id: string | undefined | null): id is string {
  if (!id || typeof id !== 'string') return false
  return listEnabledModels().some(model => model.id === id)
}

export function resolveModelId (requested?: string | null, fallback?: string | null): string {
  if (isAllowedModel(requested)) return requested
  if (isAllowedModel(fallback)) return fallback
  return getDefaultModelId()
}

export function modelSelectOptions () {
  return listEnabledModels().map(model => ({
    value: model.id,
    label: model.label,
    hint: model.hint || model.provider
  }))
}
