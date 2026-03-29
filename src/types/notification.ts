export const NotificationReadStatus = {
  UNREAD: 0,
  READ: 1
} as const

export type NotificationReadStatus =
  (typeof NotificationReadStatus)[keyof typeof NotificationReadStatus]

export type NotificationAudience = 'volunteer' | 'organization'

export interface NotificationTarget {
  to: string
  disabled: boolean
  label: string
}

export type NotificationInboxId = number
export type NotificationInboxIdList = NotificationInboxId[]

export interface NotificationItem {
  inboxId: NotificationInboxId
  notificationId: number
  eventType: string
  bizType?: string
  bizId?: number
  title: string
  content: string
  readStatus: NotificationReadStatus
  readAt: string
  createdAt: string
}

export interface NotificationListRequest {
  page?: number
  pageSize?: number
  unreadOnly?: boolean
  keyword?: string
}

export interface NotificationListData {
  total: number
  list: NotificationItem[]
}

export interface NotificationReadRequest {
  ids: number[]
}

export interface NotificationReadData {
  updated: number
}
