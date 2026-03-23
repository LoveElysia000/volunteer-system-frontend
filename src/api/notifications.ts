import { http } from './request'
import type { ApiResponse } from './types'
import type {
  NotificationListData,
  NotificationListRequest,
  NotificationReadData,
  NotificationReadRequest
} from '@/types/notification'

export const notificationApi = {
  getNotifications: (params: NotificationListRequest = {}): Promise<ApiResponse<NotificationListData>> => {
    return http.get<ApiResponse<NotificationListData>>('/api/notifications', { params })
  },

  markAsRead: (data: NotificationReadRequest): Promise<ApiResponse<NotificationReadData>> => {
    return http.post<ApiResponse<NotificationReadData>>('/api/notifications/read', data)
  }
}
