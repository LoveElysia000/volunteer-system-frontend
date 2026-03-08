import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, MessageOptions, MessageType } from '@/types/messages'

// 存储键名常量
const STORAGE_KEYS = {
  MESSAGES: 'app_messages'
}

export const useMessageStore = defineStore('messages', () => {
  // 状态
  const messages = ref<Message[]>([])
  const maxMessages = ref(5)

  // 计算属性
  const visibleMessages = computed(() =>
    messages.value.slice(0, maxMessages.value)
  )

  // 从存储恢复状态
  const restoreMessages = () => {
    // 开发环境下不自动恢复消息状态
    if (import.meta.env.DEV) {
      clearStoredMessages()
      return
    }

    const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES)
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages)
        // 过滤掉过期的消息（超过1小时）
        const oneHourAgo = Date.now() - 60 * 60 * 1000
        messages.value = parsedMessages.filter((msg: Message) =>
          msg.createdAt > oneHourAgo
        )
      } catch (error) {
        console.error('恢复消息状态失败:', error)
        clearStoredMessages()
      }
    }
  }

  // 清除存储的消息
  const clearStoredMessages = () => {
    localStorage.removeItem(STORAGE_KEYS.MESSAGES)
  }

  // 保存消息到存储
  const saveMessages = () => {
    if (!import.meta.env.DEV) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages.value))
    }
  }

  // Actions
  const addMessage = (message: string, options: MessageOptions = {}) => {
    const id = generateId()
    const messageObj: Message = {
      id,
      type: options.type || 'info',
      title: options.title,
      message,
      duration: options.duration || 5000, // 默认5秒
      icon: options.icon,
      dismissible: options.dismissible !== false, // 默认可关闭
      createdAt: Date.now()
    }

    // 添加到消息列表开头
    messages.value.unshift(messageObj)

    // 保存到存储
    saveMessages()

    // 设置自动关闭定时器
    if (messageObj.duration > 0) {
      setTimeout(() => {
        removeMessage(id)
      }, messageObj.duration)
    }

    return id
  }

  const removeMessage = (id: string) => {
    const index = messages.value.findIndex(msg => msg.id === id)
    if (index !== -1) {
      messages.value.splice(index, 1)
      saveMessages()
    }
  }

  const clearMessages = () => {
    messages.value = []
    clearStoredMessages()
  }

  // 快捷方法
  const success = (message: string, options?: Omit<MessageOptions, 'type'>) => {
    return addMessage(message, { ...options, type: 'success' })
  }

  const error = (message: string, options?: Omit<MessageOptions, 'type'>) => {
    return addMessage(message, { ...options, type: 'error' })
  }

  const warning = (message: string, options?: Omit<MessageOptions, 'type'>) => {
    return addMessage(message, { ...options, type: 'warning' })
  }

  const info = (message: string, options?: Omit<MessageOptions, 'type'>) => {
    return addMessage(message, { ...options, type: 'info' })
  }

  // 生成唯一ID
  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  return {
    // 状态
    messages,
    maxMessages,

    // 计算属性
    visibleMessages,

    // Actions
    addMessage,
    removeMessage,
    clearMessages,
    restoreMessages,

    // 快捷方法
    success,
    error,
    warning,
    info
  }
})