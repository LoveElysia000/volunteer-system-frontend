type AssistantSessionRecord = {
  id: number
  title: string
  scene: string
  createdAt: string
  updatedAt: string
}

export const sanitizeAssistantSessions = <T extends AssistantSessionRecord, TScene extends string>(
  sessions: T[],
  resolveScene: (scene?: string | null) => TScene
) => {
  const validSessions: T[] = []

  for (const session of sessions) {
    try {
      validSessions.push({
        ...session,
        scene: resolveScene(session.scene)
      })
    } catch {
      continue
    }
  }

  return validSessions
}

export const findAssistantSessionByScene = (
  sessions: AssistantSessionRecord[],
  currentSessionId: number | null,
  scene: string
) => {
  const currentSession = sessions.find((session) => session.id === currentSessionId) || null
  if (currentSession?.scene === scene) {
    return currentSession
  }

  const matchingSessions = sessions
    .filter((session) => session.scene === scene)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

  return matchingSessions[0] || null
}
