import { http } from './request'
import type { ApiResponse } from './types'
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

  getSessionMessages: (id: number): Promise<ApiResponse<AssistantMessagesData>> => {
    return http.get<ApiResponse<AssistantMessagesData>>(`/api/assistant/sessions/${id}/messages`)
  },

  generateActivityDraft: (data: AssistantActivityDraftRequest): Promise<ApiResponse<AssistantActivityDraftData>> => {
    return http.post<ApiResponse<AssistantActivityDraftData>>('/api/assistant/actions/activity-draft', data)
  }
}
