import type { DateOnlyString } from '@/types/datetime'

type ActivitiesHttpClient = {
  post: <T = unknown>(url: string, data?: unknown) => Promise<T>
  get: <T = unknown>(url: string, params?: unknown) => Promise<T>
  put: <T = unknown>(url: string, data?: unknown) => Promise<T>
  delete: <T = unknown>(url: string, params?: unknown) => Promise<T>
}

type ActivitiesListRequest = {
  page: number
  pageSize: number
  status?: number[]
  keyword?: string
  startFrom?: DateOnlyString
  startTo?: DateOnlyString
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const createActivitiesApi = (http: ActivitiesHttpClient) => ({
  list: <T>(data: ActivitiesListRequest) => {
    return http.post<T>('/api/activities', data)
  },

  detail: <T>(activityId: number) => {
    return http.get<T>(`/api/activities/${activityId}`)
  },

  signup: <T>(activityId: number) => {
    return http.post<T>('/api/activities/signup', { activityId })
  },

  cancel: <T>(activityId: number) => {
    return http.post<T>('/api/activities/cancel', { activityId })
  },

  checkIn: <T>(data: { activityId: number; checkInCode: string }) => {
    return http.post<T>('/api/activities/checkin', data)
  },

  checkOut: <T>(data: { activityId: number; checkOutCode: string }) => {
    return http.post<T>('/api/activities/checkout', data)
  },

  listRegisteredActivities: <T>(data: ActivitiesListRequest) => {
    return http.post<T>('/api/activities/my', data)
  },

  create: <T>(data: unknown) => {
    return http.post<T>('/api/activities/create', data)
  },

  update: <T>(activityId: number, data: unknown) => {
    return http.put<T>(`/api/activities/${activityId}`, data)
  },

  remove: <T>(activityId: number) => {
    return http.delete<T>(`/api/activities/${activityId}`)
  },

  cancelByOrganization: <T>(activityId: number, data: unknown) => {
    return http.post<T>(`/api/activities/${activityId}/cancel`, data)
  },

  finishByOrganization: <T>(activityId: number) => {
    return http.post<T>(`/api/activities/${activityId}/finish`)
  },

  generateAttendanceCodes: <T>(activityId: number, data: unknown) => {
    return http.post<T>(`/api/activities/${activityId}/attendance-codes/generate`, data)
  },

  resetAttendanceCode: <T>(activityId: number, data: unknown) => {
    return http.post<T>(`/api/activities/${activityId}/attendance-codes/reset`, data)
  },

  getAttendanceCodes: <T>(activityId: number) => {
    return http.get<T>(`/api/activities/${activityId}/attendance-codes`)
  },

  supplementAttendance: <T>(data: unknown) => {
    return http.post<T>('/api/activities/supplement-attendance', data)
  }
})
