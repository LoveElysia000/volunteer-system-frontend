export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface Message {
  id: string
  type: MessageType
  title?: string
  message: string
  duration?: number
  icon?: string
  dismissible?: boolean
  createdAt: number
}

export interface MessageOptions {
  type?: MessageType
  title?: string
  duration?: number
  dismissible?: boolean
  icon?: string
}

export interface MessageStore {
  messages: Message[]
  maxMessages: number
  addMessage: (message: string, options?: MessageOptions) => string
  removeMessage: (id: string) => void
  clearMessages: () => void
}