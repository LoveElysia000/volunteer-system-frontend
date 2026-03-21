export interface NotificationItem {
  inboxId: number
  notificationId?: number
  eventType?: string
  bizType?: string
  bizId?: number
  title: string
  content: string
  readStatus: number
  readAt?: string
  createdAt?: string
}

export interface NotificationListRequest {
  page?: number
  pageSize?: number
  unreadOnly?: boolean
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
