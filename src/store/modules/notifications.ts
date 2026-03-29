import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  NotificationReadStatus,
  type NotificationInboxIdList,
  type NotificationItem,
  type NotificationListRequest
} from '../../types/notification.ts'

const notificationEventLabels: Record<string, string> = {
  member_join: '组织加入结果',
  signup_approved: '报名已通过',
  signup_rejected: '报名未通过',
  activity_updated: '活动信息更新',
  activity_canceled: '活动已取消',
  work_hour_granted: '工时已发放',
  work_hour_voided: '工时已作废',
  work_hour_regranted: '工时已重算'
}

export const getNotificationEventLabel = (eventType?: string) => {
  return notificationEventLabels[eventType || ''] || '未分类通知'
}

export const applyNotificationReadState = (
  items: NotificationItem[],
  inboxIds: NotificationInboxIdList,
  readAt: string
) => {
  if (!inboxIds.length) {
    return items
  }

  const readInboxIds = new Set(inboxIds)
  return items.map((item) => (
    readInboxIds.has(item.inboxId)
      ? { ...item, readStatus: NotificationReadStatus.READ, readAt }
      : item
  ))
}

const getNotificationApi = async () => {
  const { notificationApi } = await import('@/api/notifications')
  return notificationApi
}

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<NotificationItem[]>([])
  const total = ref(0)
  const loading = ref(false)

  const fetchNotifications = async (params: NotificationListRequest = {}) => {
    loading.value = true
    try {
      const notificationApi = await getNotificationApi()
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

  const markNotificationsAsRead = async (inboxIds: NotificationInboxIdList) => {
    if (!inboxIds.length) {
      return 0
    }
    const notificationApi = await getNotificationApi()
    const response = await notificationApi.markAsRead({ ids: inboxIds })
    if (response.code !== 200) {
      throw new Error(response.msg || '标记通知已读失败')
    }
    const readAt = new Date().toISOString()
    items.value = applyNotificationReadState(items.value, inboxIds, readAt)
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
