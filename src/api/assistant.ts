import { http } from './request'
import type { ApiResponse } from './types'
import { tokenManager } from '@/utils/token'
import { requestTokenRefresh } from './refresh'
import type {
  AssistantActivityDraftData,
  AssistantActivityDraftRequest,
  AssistantChatData,
  AssistantChatRequest,
  AssistantMessagesData,
  AssistantSessionCreateData,
  AssistantSessionCreateRequest
} from '@/types/assistant'

export const assistantApi = {
  createSession: (data: AssistantSessionCreateRequest): Promise<ApiResponse<AssistantSessionCreateData>> => {
    return http.post<ApiResponse<AssistantSessionCreateData>>('/api/assistant/sessions', data)
  },

  chat: (data: AssistantChatRequest): Promise<ApiResponse<AssistantChatData>> => {
    return http.post<ApiResponse<AssistantChatData>>('/api/assistant/chat', data)
  },

  chatStream: async (data: AssistantChatRequest): Promise<Response> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/'
    const baseOrigin = /^https?:\/\//.test(baseUrl)
      ? baseUrl
      : new URL(baseUrl, window.location.origin).toString()
    const streamUrl = new URL('api/assistant/chat/stream', baseOrigin.endsWith('/') ? baseOrigin : `${baseOrigin}/`).toString()

    const sendRequest = async (accessToken?: string | null) => fetch(streamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify({
        ...data,
        stream: true
      })
    })

    let response = await sendRequest(tokenManager.getAccessToken())

    if (response.status === 401) {
      const refreshToken = tokenManager.getRefreshToken()
      if (!refreshToken) {
        throw new Error('登录已失效，请重新登录后再试')
      }

      const refreshResponse = await requestTokenRefresh({ refreshToken })
      if (refreshResponse.code !== 200) {
        throw new Error(refreshResponse.msg || '刷新 token 失败')
      }

      tokenManager.setTokens(
        refreshResponse.data.token,
        refreshResponse.data.refreshToken,
        refreshResponse.data.expiresAt
      )

      response = await sendRequest(refreshResponse.data.token)
    }

    if (!response.ok) {
      throw new Error(`流式对话请求失败: ${response.status}`)
    }

    return response
  },

  getSessionMessages: (id: number): Promise<ApiResponse<AssistantMessagesData>> => {
    return http.get<ApiResponse<AssistantMessagesData>>(`/api/assistant/sessions/${id}/messages`)
  },

  generateActivityDraft: (data: AssistantActivityDraftRequest): Promise<ApiResponse<AssistantActivityDraftData>> => {
    return http.post<ApiResponse<AssistantActivityDraftData>>('/api/assistant/actions/activity-draft', data)
  }
}
