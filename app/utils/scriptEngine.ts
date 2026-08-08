/**
 * Client helpers for the Scenario stage.
 * Live system instruction lives in docs/prompts/scenario.md and is applied on the server.
 */
export const SCRIPT_ENGINE = Object.freeze({
  version: 'nuxt-3-md',

  /**
   * Payload for POST /api/workflow/scenario.
   * System prompt is loaded server-side from docs/prompts/scenario.md.
   */
  createRequest ({ idea, style, duration, contentType, model, references }: {
    idea: string
    style: string
    duration: number
    contentType?: string
    model: string
    references: { name: string }[]
  }) {
    return {
      idea,
      style,
      duration,
      contentType,
      model,
      references
    }
  }
})
