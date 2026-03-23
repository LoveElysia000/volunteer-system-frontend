import { http } from './request'
import type { ApiResponse } from './types'
import type {
  OrganizationDetailData,
  OrganizationListData,
  OrganizationListRequest,
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

  update: (id: number, data: UpdateOrganizationRequest): Promise<ApiResponse<UpdateOrganizationData>> => {
    return http.put<ApiResponse<UpdateOrganizationData>>(`/api/organizations/${id}`, data)
  }
}
