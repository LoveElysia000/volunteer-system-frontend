import { http } from './request'
import type { ApiResponse } from './types'
import type {
  OrganizationDetailData,
  OrganizationListData,
  OrganizationListRequest,
  UpdateOrganizationAccountRequest,
  UpdateOrganizationData,
  UpdateOrganizationRequest
} from '@/types/organization'

export const organizationsApi = {
  list: (data: OrganizationListRequest): Promise<ApiResponse<OrganizationListData>> => {
    return http.post<ApiResponse<OrganizationListData>>('/api/organizations/list', data)
  },

  detail: (id: number): Promise<ApiResponse<OrganizationDetailData>> => {
    return http.get<ApiResponse<OrganizationDetailData>>(`/api/organizations/${id}`)
  },

  updateAccount: (data: UpdateOrganizationAccountRequest): Promise<ApiResponse<Record<string, never>>> => {
    return http.put<ApiResponse<Record<string, never>>>('/api/organizations/account', data)
  },

  update: (id: number, data: UpdateOrganizationRequest): Promise<ApiResponse<UpdateOrganizationData>> => {
    return http.put<ApiResponse<UpdateOrganizationData>>(`/api/organizations/${id}`, data)
  }
}
