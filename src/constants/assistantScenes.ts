export const ASSISTANT_SCENES = {
  GENERAL: 'general',
  ACTIVITY_DRAFT: 'activity_draft',
  OPS_ADVISOR: 'ops_advisor'
} as const

export type AssistantScene = typeof ASSISTANT_SCENES[keyof typeof ASSISTANT_SCENES]

export const DEFAULT_ASSISTANT_SCENE = ASSISTANT_SCENES.GENERAL
const ASSISTANT_SCENE_SET = new Set<AssistantScene>(Object.values(ASSISTANT_SCENES))

export const resolveAssistantScene = (scene?: string | null): AssistantScene => {
  const normalizedValue = scene?.trim()

  if (!normalizedValue) {
    return DEFAULT_ASSISTANT_SCENE
  }

  if (ASSISTANT_SCENE_SET.has(normalizedValue as AssistantScene)) {
    return normalizedValue as AssistantScene
  }

  throw new Error(`不支持的 AI 会话场景: ${normalizedValue}`)
}
