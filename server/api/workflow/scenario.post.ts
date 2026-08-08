import { generateWithOpenRouter } from '../../utils/openrouter'
import { buildScenarioUserMessage, loadStagePrompt } from '../../utils/promptLoader'
import { getContentType, resolveContentTypeId } from '../../../shared/contentTypes'

/**
 * Idea → Scenario.
 * System instruction always comes from docs/prompts/scenario.md (not from the client).
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    idea?: string
    style?: string
    duration?: number
    contentType?: string
    model?: string
    plan?: string
    references?: { name: string }[]
    /** @deprecated client-supplied system is ignored */
    system?: string
    /** @deprecated prefer idea + fields; still accepted as full user message */
    user?: string
  }>(event)

  const idea = body?.idea?.trim()
  if (!idea && !body?.user?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Нужна идея: передайте поле idea.'
    })
  }

  const contentTypeId = resolveContentTypeId(body.contentType)
  const contentTypeMeta = getContentType(contentTypeId)

  const system = await loadStagePrompt('scenario')
  const user = idea
    ? buildScenarioUserMessage({
        idea,
        style: body.style,
        duration: body.duration,
        contentType: contentTypeMeta?.label || contentTypeId,
        contentTypeHint: contentTypeMeta?.promptHint,
        references: body.references
      })
    : String(body.user)

  return generateWithOpenRouter(event, {
    system,
    user,
    model: body.model,
    plan: body.plan
  })
})
