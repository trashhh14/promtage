import { listEnabledModels, getDefaultModelId } from '../../shared/llmModels'

/**
 * Public catalog of text LLMs available in the studio picker.
 * Does not expose API keys — only labels and provider model ids.
 */
export default defineEventHandler(() => {
  const models = listEnabledModels().map(model => ({
    id: model.id,
    label: model.label,
    provider: model.provider,
    hint: model.hint || null
  }))

  return {
    defaultId: getDefaultModelId(),
    models
  }
})
