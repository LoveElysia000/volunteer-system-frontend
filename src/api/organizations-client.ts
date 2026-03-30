import type { DateOnlyString } from '@/types/datetime'
import type {
  CreateOrganizationRequest,
  OrganizationActionRequest,
  OrganizationBatchActionRequest,
  OrganizationBulkDeleteRequest,
  UpdateOrganizationAccountRequest,
  UpdateOrganizationRequest
} from '@/types/organization'

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
  startDate?: DateOnlyString
  endDate?: DateOnlyString
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

  detail: <T>(organizationId: number) => {
    return http.get<T>(`/api/organizations/${organizationId}`)
  },

  publicDetail: <T>(organizationId: number) => {
    return http.get<T>(`/api/organizations/${organizationId}/public`)
  },

  create: <T>(data: CreateOrganizationRequest) => {
    return http.post<T>('/api/organizations/create', data)
  },

  updateAccount: <T>(data: UpdateOrganizationAccountRequest) => {
    return http.put<T>('/api/organizations/account', data)
  },

  update: <T>(organizationId: number, data: UpdateOrganizationRequest) => {
    return http.put<T>(`/api/organizations/${organizationId}`, data)
  },

  remove: <T>(organizationId: number) => {
    return http.delete<T>(`/api/organizations/${organizationId}`)
  },

  disable: <T>(organizationId: number, data: OrganizationActionRequest) => {
    return http.post<T>(`/api/organizations/${organizationId}/disable`, data)
  },

  enable: <T>(organizationId: number, data: OrganizationActionRequest) => {
    return http.post<T>(`/api/organizations/${organizationId}/enable`, data)
  },

  bulkDelete: <T>(data: OrganizationBulkDeleteRequest) => {
    return http.post<T>('/api/organizations/bulk-delete', data)
  },

  batchDisable: <T>(data: OrganizationBatchActionRequest) => {
    return http.post<T>('/api/organizations/batch-disable', data)
  },

  batchEnable: <T>(data: OrganizationBatchActionRequest) => {
    return http.post<T>('/api/organizations/batch-enable', data)
  }
})
