export enum NotificationReadStatus {
  UNREAD = 0,
  READ = 1
}

export interface NotificationItem {
  inboxId: number
  notificationId: number
  eventType: string
  bizType: string
  bizId: number
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
