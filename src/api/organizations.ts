import { http } from './request'
import type { ApiResponse } from './types'
import type {
  CreateOrganizationData,
  CreateOrganizationRequest,
  OrganizationActionData,
  OrganizationActionRequest,
  OrganizationBatchActionData,
  OrganizationBatchActionRequest,
  OrganizationBulkDeleteData,
  OrganizationBulkDeleteRequest,
  OrganizationDetailData,
  OrganizationListData,
  OrganizationListRequest,
  OrganizationSearchRequest,
  UpdateOrganizationAccountRequest,
  UpdateOrganizationData,
  UpdateOrganizationRequest
} from '@/types/organization'

export const organizationsApi = {
  list: (data: OrganizationListRequest): Promise<ApiResponse<OrganizationListData>> => {
    return http.post<ApiResponse<OrganizationListData>>('/api/organizations/list', data)
  },

  search: (data: OrganizationSearchRequest): Promise<ApiResponse<OrganizationListData>> => {
    return http.post<ApiResponse<OrganizationListData>>('/api/organizations/search', data)
  },

  detail: (id: number): Promise<ApiResponse<OrganizationDetailData>> => {
    return http.get<ApiResponse<OrganizationDetailData>>(`/api/organizations/${id}`)
  },

  create: (data: CreateOrganizationRequest): Promise<ApiResponse<CreateOrganizationData>> => {
    return http.post<ApiResponse<CreateOrganizationData>>('/api/organizations/create', data)
  },

  updateAccount: (data: UpdateOrganizationAccountRequest): Promise<ApiResponse<Record<string, never>>> => {
    return http.put<ApiResponse<Record<string, never>>>('/api/organizations/account', data)
  },

  update: (id: number, data: UpdateOrganizationRequest): Promise<ApiResponse<UpdateOrganizationData>> => {
    return http.put<ApiResponse<UpdateOrganizationData>>(`/api/organizations/${id}`, data)
  },

  remove: (id: number): Promise<ApiResponse<OrganizationActionData>> => {
    return http.delete<ApiResponse<OrganizationActionData>>(`/api/organizations/${id}`)
  },

  disable: (id: number, data: OrganizationActionRequest): Promise<ApiResponse<OrganizationActionData>> => {
    return http.post<ApiResponse<OrganizationActionData>>(`/api/organizations/${id}/disable`, data)
  },

  enable: (id: number, data: OrganizationActionRequest): Promise<ApiResponse<OrganizationActionData>> => {
    return http.post<ApiResponse<OrganizationActionData>>(`/api/organizations/${id}/enable`, data)
  },

  bulkDelete: (data: OrganizationBulkDeleteRequest): Promise<ApiResponse<OrganizationBulkDeleteData>> => {
    return http.post<ApiResponse<OrganizationBulkDeleteData>>('/api/organizations/bulk-delete', data)
  },

  batchDisable: (data: OrganizationBatchActionRequest): Promise<ApiResponse<OrganizationBatchActionData>> => {
    return http.post<ApiResponse<OrganizationBatchActionData>>('/api/organizations/batch-disable', data)
  },

  batchEnable: (data: OrganizationBatchActionRequest): Promise<ApiResponse<OrganizationBatchActionData>> => {
    return http.post<ApiResponse<OrganizationBatchActionData>>('/api/organizations/batch-enable', data)
  }
}
