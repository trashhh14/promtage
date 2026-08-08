# AI Content Workflow Platform — PRD

Source: user-provided `AI_Content_Workflow_PRD.md`.

## Live model instructions

Stage system prompts are **not** hardcoded only in TypeScript. Edit these files — the API loads them on every generation:

| Stage | File |
|-------|------|
| Idea → Scenario | [`docs/prompts/scenario.md`](./prompts/scenario.md) |
| Scenario → Storyboard | [`docs/prompts/storyboard.md`](./prompts/storyboard.md) |

The client sends only user inputs (idea / approved script, style, duration, model). The server always injects the matching markdown as the system instruction.

## Product goal

Build a professional structured workflow for turning one content idea into a scenario, storyboard and final image prompts. It is not a chat interface: each stage is edited, processed and approved before the following stage unlocks.

## Required flow

1. Idea
2. Scenario
3. Storyboard
4. Image Prompts

Each stage supports Locked, Draft, Processing, Waiting Approval, Approved and Outdated states. Editing an approved stage marks every following stage as outdated.

## Architecture direction

The PRD targets a future Next.js / React / TypeScript implementation. This current MVP is a lightweight static prototype with a local OpenRouter proxy, deliberately structured so the scenario endpoint is already isolated as `POST /api/workflow/scenario`.

## UI direction

Single-page creative production tool with large rounded cards, generous spacing, editable content, smooth expand/collapse, stage-specific processing and approval controls.
