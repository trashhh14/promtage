/**
 * Client helpers for the Storyboard stage.
 * Live system instruction lives in docs/prompts/storyboard.md and is applied on the server.
 */
export const STORYBOARD_ENGINE = Object.freeze({
  version: 'nuxt-3-md',

  /**
   * Payload for POST /api/workflow/storyboard.
   * System prompt is loaded server-side from docs/prompts/storyboard.md.
   */
  createRequest ({ script, style, duration, contentType, model, references }: {
    script: string
    style: string
    duration: number
    contentType?: string
    model: string
    references: { name: string }[]
  }) {
    return {
      script,
      style,
      duration,
      contentType,
      model,
      references
    }
  }
})
