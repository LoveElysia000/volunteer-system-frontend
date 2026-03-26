export interface AssistantSessionCreateRequest {
  scene: string
  title?: string
}

export interface AssistantSessionCreateData {
  session_id: number
}

export interface AssistantToolCall {
  tool_name: string
  success: boolean
  error_code: string
  error_msg: string
  latency_ms: number
  input: string
  output: string
}

export interface AssistantUsage {
  model: string
  token_in: number
  token_out: number
  latency_ms: number
}

export interface AssistantChatRequest {
  session_id: number
  message: string
  stream?: boolean
}

export interface AssistantStreamEvent {
  event: string
  data: string
}

export interface AssistantChatData {
  reply: string
  tool_calls: AssistantToolCall[]
  usage: AssistantUsage
}

export interface AssistantMessageItem {
  id: number
  session_id: number
  seq_no: number
  role: number
  content: string
  model: string
  finish_reason: number
  token_in: number
  token_out: number
  latency_ms: number
  request_id: string
  created_at: string
}

export interface AssistantMessagesData {
  list: AssistantMessageItem[]
}

export interface AssistantActivityDraftRequest {
  session_id: number
  topic: string
  target_people: string
  location: string
}

export interface AssistantActivityDraftData {
  session_id: number
  result: AssistantChatData
}

export interface LocalAssistantSession {
  id: number
  title: string
  scene: string
  createdAt: string
  updatedAt: string
}
