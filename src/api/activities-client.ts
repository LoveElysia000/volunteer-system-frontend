type ActivitiesHttpClient = {
  post: <T = unknown>(url: string, data?: unknown) => Promise<T>
  get: <T = unknown>(url: string, params?: unknown) => Promise<T>
  put: <T = unknown>(url: string, data?: unknown) => Promise<T>
  delete: <T = unknown>(url: string, params?: unknown) => Promise<T>
}

type ActivitiesListRequest = {
  page: number
  pageSize: number
  status?: number
  keyword?: string
  startFrom?: string
  startTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

const withRegisteredOnly = <T extends ActivitiesListRequest>(data: T) => ({
  ...data,
  registeredOnly: true
})

export const createActivitiesApi = (http: ActivitiesHttpClient) => ({
  list: <T>(data: ActivitiesListRequest & { registeredOnly?: boolean }) => {
    return http.post<T>('/api/activities', data)
  },

  detail: <T>(id: number) => {
    return http.get<T>(`/api/activities/${id}`)
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
    return http.post<T>('/api/activities', withRegisteredOnly(data))
  },

  create: <T>(data: unknown) => {
    return http.post<T>('/api/activities/create', data)
  },

  update: <T>(id: number, data: unknown) => {
    return http.put<T>(`/api/activities/${id}`, data)
  },

  remove: <T>(id: number) => {
    return http.delete<T>(`/api/activities/${id}`)
  },

  cancelByOrganization: <T>(id: number, data: unknown) => {
    return http.post<T>(`/api/activities/cancel/${id}`, data)
  },

  finishByOrganization: <T>(id: number) => {
    return http.post<T>(`/api/activities/finish/${id}`)
  },

  generateAttendanceCodes: <T>(id: number, data: unknown) => {
    return http.post<T>(`/api/activities/attendance-codes/generate/${id}`, data)
  },

  resetAttendanceCode: <T>(id: number, data: unknown) => {
    return http.post<T>(`/api/activities/attendance-codes/reset/${id}`, data)
  },

  getAttendanceCodes: <T>(id: number) => {
    return http.get<T>(`/api/activities/attendance-codes/${id}`)
  },

  supplementAttendance: <T>(data: unknown) => {
    return http.post<T>('/api/activities/supplement-attendance', data)
  }
})
