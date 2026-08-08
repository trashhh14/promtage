import { generateWithOpenRouter } from '../../utils/openrouter'
import { buildStoryboardUserMessage, loadStagePrompt } from '../../utils/promptLoader'
import { getContentType, resolveContentTypeId } from '../../../shared/contentTypes'

/**
 * Scenario → Storyboard.
 * System instruction always comes from docs/prompts/storyboard.md (not from the client).
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    script?: string
    style?: string
    duration?: number
    contentType?: string
    model?: string
    plan?: string
    references?: { name: string }[]
    /** @deprecated client-supplied system is ignored */
    system?: string
    /** @deprecated prefer script + fields */
    user?: string
  }>(event)

  const script = body?.script?.trim()
  if (!script && !body?.user?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Нужен сценарий: передайте поле script.'
    })
  }

  const contentTypeId = resolveContentTypeId(body.contentType)
  const contentTypeMeta = getContentType(contentTypeId)

  const system = await loadStagePrompt('storyboard')
  const user = script
    ? buildStoryboardUserMessage({
        script,
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
