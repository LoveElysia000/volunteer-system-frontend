import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationApi } from '@/api/notifications'
import type { NotificationItem, NotificationListRequest } from '@/types/notification'

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<NotificationItem[]>([])
  const total = ref(0)
  const loading = ref(false)

  const fetchNotifications = async (params: NotificationListRequest = {}) => {
    loading.value = true
    try {
      const response = await notificationApi.getNotifications(params)
      if (response.code !== 200) {
        throw new Error(response.msg || '获取通知失败')
      }
      items.value = response.data.list || []
      total.value = response.data.total || 0
      return response.data
    } finally {
      loading.value = false
    }
  }

  const markNotificationsAsRead = async (ids: number[]) => {
    if (!ids.length) {
      return 0
    }
    const response = await notificationApi.markAsRead({ ids })
    if (response.code !== 200) {
      throw new Error(response.msg || '标记通知已读失败')
    }
    const readAt = new Date().toISOString()
    items.value = items.value.map((item) => (
      ids.includes(item.inboxId)
        ? { ...item, readStatus: 1, readAt }
        : item
    ))
    return response.data.updated
  }

  return {
    items,
    total,
    loading,
    fetchNotifications,
    markNotificationsAsRead
  }
})
