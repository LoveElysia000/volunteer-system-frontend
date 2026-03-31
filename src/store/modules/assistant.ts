import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { assistantApi } from '@/api/assistant'
import {
  ASSISTANT_SCENES,
  DEFAULT_ASSISTANT_SCENE,
  resolveAssistantScene,
  type AssistantScene
} from '@/constants/assistantScenes'
import { useAuthStore } from '@/store/modules/auth'
import { findAssistantSessionByScene, sanitizeAssistantSessions } from '@/utils/assistantSessionState'
import type {
  AssistantActivityDraftRequest,
  AssistantMessageItem,
  LocalAssistantSession
} from '@/types/assistant'

const nowIso = () => new Date().toISOString()

const createLocalMessage = (partial: Partial<AssistantMessageItem> & Pick<AssistantMessageItem, 'role' | 'content'>): AssistantMessageItem => ({
  id: partial.id ?? Date.now() + Math.floor(Math.random() * 1000),
  session_id: partial.session_id ?? 0,
  seq_no: partial.seq_no ?? 0,
  role: partial.role,
  content: partial.content,
  model: partial.model ?? '',
  finish_reason: partial.finish_reason ?? 0,
  token_in: partial.token_in ?? 0,
  token_out: partial.token_out ?? 0,
  latency_ms: partial.latency_ms ?? 0,
  request_id: partial.request_id ?? '',
  created_at: partial.created_at ?? nowIso(),
  tool_calls: partial.tool_calls ?? []
})

const extractStreamText = (payload: string) => {
  const trimmed = payload.trim()
  if (!trimmed) return ''

  try {
    const parsed = JSON.parse(trimmed)
    if (typeof parsed === 'string') return parsed
    return parsed.reply || parsed.content || parsed.delta || parsed.text || parsed.message || ''
  } catch {
    return trimmed
  }
}

const appendStreamChunk = (chunk: string, assistantMessage: AssistantMessageItem) => {
  const lines = chunk.split('\n')
  const eventName = lines.find((line) => line.startsWith('event:'))?.slice(6).trim()
  const data = lines
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .join('\n')

  if (!data || eventName === 'done' || eventName === 'start') {
    return
  }

  const text = extractStreamText(data)
  if (text) {
    assistantMessage.content += text
  }
}

export const useAssistantStore = defineStore('assistant', () => {
  const authStore = useAuthStore()
  const sessions = ref<LocalAssistantSession[]>([])
  const currentSessionId = ref<number | null>(null)
  const messages = ref<AssistantMessageItem[]>([])
  const loading = ref(false)
  const sending = ref(false)

  const currentSession = computed(() => (
    sessions.value.find((session) => session.id === currentSessionId.value) || null
  ))

  const getStorageKey = () => `assistant_sessions_${authStore.user?.accountId ?? 'anonymous'}`

  const restoreSessions = () => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(getStorageKey())
    sessions.value = []
    currentSessionId.value = null
    messages.value = []
    if (!raw) return
    try {
      const parsedSessions = JSON.parse(raw) as LocalAssistantSession[]
      sessions.value = sanitizeAssistantSessions(parsedSessions, resolveAssistantScene)
      if (sessions.value.length !== parsedSessions.length) {
        persistSessions()
      }
      if (!currentSessionId.value && sessions.value.length) {
        currentSessionId.value = sessions.value[0].id
      }
    } catch (error) {
      console.error('恢复 AI 会话失败:', error)
      localStorage.removeItem(getStorageKey())
    }
  }

  const persistSessions = () => {
    if (typeof window === 'undefined') return
    localStorage.setItem(getStorageKey(), JSON.stringify(sessions.value))
  }

  const createSession = async (title = '新会话', scene: AssistantScene = DEFAULT_ASSISTANT_SCENE) => {
    const resolvedScene = resolveAssistantScene(scene)
    const response = await assistantApi.createSession({ scene: resolvedScene, title })
    if (response.code !== 200) {
      throw new Error(response.msg || '创建会话失败')
    }

    const session: LocalAssistantSession = {
      id: response.data.session_id,
      title,
      scene: resolvedScene,
      createdAt: nowIso(),
      updatedAt: nowIso()
    }

    sessions.value = [session, ...sessions.value.filter((item) => item.id !== session.id)]
    currentSessionId.value = session.id
    persistSessions()
    return session
  }

  const loadMessages = async (sessionId: number) => {
    loading.value = true
    try {
      const response = await assistantApi.getSessionMessages(sessionId)
      if (response.code !== 200) {
        throw new Error(response.msg || '获取会话消息失败')
      }
      messages.value = response.data.list || []
      currentSessionId.value = sessionId
      return messages.value
    } finally {
      loading.value = false
    }
  }

  const touchSession = (sessionId: number, title?: string) => {
    sessions.value = sessions.value.map((session) => (
      session.id === sessionId
        ? {
            ...session,
            title: title || session.title,
            updatedAt: nowIso()
          }
        : session
    )).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    persistSessions()
  }

  const ensureSession = async (scene: AssistantScene = DEFAULT_ASSISTANT_SCENE, title = '新会话') => {
    const resolvedScene = resolveAssistantScene(scene)
    const session = findAssistantSessionByScene(sessions.value, currentSessionId.value, resolvedScene)

    if (session) {
      currentSessionId.value = session.id
      return session
    }

    return createSession(title, resolvedScene)
  }

  const sendMessage = async (message: string) => {
    const session = await ensureSession(ASSISTANT_SCENES.GENERAL)
    sending.value = true
    try {
      const userMessage = createLocalMessage({
        role: 2,
        content: message,
        session_id: session.id
      })
      const assistantMessage = createLocalMessage({
        role: 1,
        content: '',
        session_id: session.id
      })
      messages.value = [...messages.value, userMessage, assistantMessage]

      const response = await assistantApi.chatStream({
        session_id: session.id,
        message,
        stream: true
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (reader) {
        let isDone = false
        while (!isDone) {
          const { value, done } = await reader.read()
          isDone = done
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const chunks = buffer.split('\n\n')
          buffer = chunks.pop() || ''

          for (const chunk of chunks) {
            appendStreamChunk(chunk, assistantMessage)
          }
        }
      }

      if (buffer.trim()) {
        appendStreamChunk(buffer, assistantMessage)
      }

      await loadMessages(session.id)
      touchSession(session.id, session.title || message.slice(0, 20))
      return messages.value
    } finally {
      sending.value = false
    }
  }

  const sendMessageNonStream = async (message: string) => {
    const session = await ensureSession(ASSISTANT_SCENES.GENERAL)
    sending.value = true
    try {
      const userMessage = createLocalMessage({
        role: 2,
        content: message,
        session_id: session.id
      })
      messages.value = [...messages.value, userMessage]

      const response = await assistantApi.chat({
        session_id: session.id,
        message,
        stream: false
      })

      if (response.code !== 200) {
        throw new Error(response.msg || '发送 AI 消息失败')
      }

      const assistantMessage = createLocalMessage({
        role: 1,
        content: response.data.reply || '',
        session_id: session.id,
        finish_reason: 1,
        token_in: response.data.usage?.token_in ?? 0,
        token_out: response.data.usage?.token_out ?? 0,
        latency_ms: response.data.usage?.latency_ms ?? 0,
        tool_calls: response.data.tool_calls || []
      })

      messages.value = [...messages.value, assistantMessage]
      touchSession(session.id, session.title || message.slice(0, 20))
      return response.data
    } finally {
      sending.value = false
    }
  }

  const generateActivityDraft = async (data: Omit<AssistantActivityDraftRequest, 'session_id'>) => {
    const session = await ensureSession(ASSISTANT_SCENES.ACTIVITY_DRAFT, data.topic || '活动草案')
    sending.value = true
    try {
      const response = await assistantApi.generateActivityDraft({
        session_id: session.id,
        ...data
      })
      if (response.code !== 200) {
        throw new Error(response.msg || '生成活动草案失败')
      }
      await loadMessages(session.id)
      touchSession(session.id, data.topic || session.title)
      return response.data
    } finally {
      sending.value = false
    }
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    messages,
    loading,
    sending,
    restoreSessions,
    createSession,
    loadMessages,
    sendMessage,
    sendMessageNonStream,
    generateActivityDraft
  }
})
