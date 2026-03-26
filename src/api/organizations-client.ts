type OrganizationsHttpClient = {
  post: <T = unknown>(url: string, data?: unknown) => Promise<T>
  get: <T = unknown>(url: string, params?: unknown) => Promise<T>
  put: <T = unknown>(url: string, data?: unknown) => Promise<T>
  delete: <T = unknown>(url: string, params?: unknown) => Promise<T>
}

type OrganizationListRequest = {
  keyword?: string
  status?: number[]
  organizationType?: string
  region?: string
  page: number
  pageSize: number
}

type OrganizationSearchRequest = OrganizationListRequest & {
  startDate?: string
  endDate?: string
}

export const createOrganizationsApi = (http: OrganizationsHttpClient) => ({
  list: <T>(data: OrganizationListRequest) => {
    return http.post<T>('/api/organizations/list', data)
  },

  publicList: <T>(data: OrganizationListRequest) => {
    return http.post<T>('/api/organizations/public-list', data)
  },

  search: <T>(data: OrganizationSearchRequest) => {
    return http.post<T>('/api/organizations/search', data)
  },

  detail: <T>(id: number) => {
    return http.get<T>(`/api/organizations/${id}`)
  },

  create: <T>(data: unknown) => {
    return http.post<T>('/api/organizations/create', data)
  },

  updateAccount: <T>(data: unknown) => {
    return http.put<T>('/api/organizations/account', data)
  },

  update: <T>(id: number, data: unknown) => {
    return http.put<T>(`/api/organizations/${id}`, data)
  },

  remove: <T>(id: number) => {
    return http.delete<T>(`/api/organizations/${id}`)
  },

  disable: <T>(id: number, data: unknown) => {
    return http.post<T>(`/api/organizations/${id}/disable`, data)
  },

  enable: <T>(id: number, data: unknown) => {
    return http.post<T>(`/api/organizations/${id}/enable`, data)
  },

  bulkDelete: <T>(data: unknown) => {
    return http.post<T>('/api/organizations/bulk-delete', data)
  },

  batchDisable: <T>(data: unknown) => {
    return http.post<T>('/api/organizations/batch-disable', data)
  },

  batchEnable: <T>(data: unknown) => {
    return http.post<T>('/api/organizations/batch-enable', data)
  }
})
