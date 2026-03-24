import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { assistantApi } from '@/api/assistant'
import { useAuthStore } from '@/store/modules/auth'
import type {
  AssistantActivityDraftRequest,
  AssistantMessageItem,
  LocalAssistantSession
} from '@/types/assistant'

const nowIso = () => new Date().toISOString()

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

  const getStorageKey = () => `assistant_sessions_${authStore.user?.id ?? 'anonymous'}`

  const restoreSessions = () => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(getStorageKey())
    sessions.value = []
    currentSessionId.value = null
    messages.value = []
    if (!raw) return
    try {
      sessions.value = JSON.parse(raw)
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

  const createSession = async (title = '新会话', scene = 'organization-assistant') => {
    const response = await assistantApi.createSession({ scene, title })
    if (response.code !== 200) {
      throw new Error(response.msg || '创建会话失败')
    }

    const session: LocalAssistantSession = {
      id: response.data.session_id,
      title,
      scene,
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

  const ensureSession = async () => {
    if (currentSession.value) return currentSession.value
    return createSession()
  }

  const sendMessage = async (message: string) => {
    const session = await ensureSession()
    sending.value = true
    try {
      const response = await assistantApi.chat({
        session_id: session.id,
        message,
        stream: false
      })
      if (response.code !== 200) {
        throw new Error(response.msg || '发送消息失败')
      }
      await loadMessages(session.id)
      touchSession(session.id, session.title || message.slice(0, 20))
      return response.data
    } finally {
      sending.value = false
    }
  }

  const generateActivityDraft = async (data: Omit<AssistantActivityDraftRequest, 'session_id'>) => {
    const session = await ensureSession()
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
    generateActivityDraft
  }
})
