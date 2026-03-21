import { http } from './request'
import type {
  OrganizationDetailData,
  OrganizationListData,
  OrganizationListRequest,
  UpdateOrganizationRequest
} from '@/types/organization'

interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

export const organizationsApi = {
  list: (data: OrganizationListRequest): Promise<ApiResponse<OrganizationListData>> => {
    return http.post<ApiResponse<OrganizationListData>>('/api/organizations/list', data)
  },

  detail: (id: number | string): Promise<ApiResponse<OrganizationDetailData>> => {
    return http.get<ApiResponse<OrganizationDetailData>>(`/api/organizations/${id}`)
  },

  update: (id: number | string, data: UpdateOrganizationRequest): Promise<ApiResponse<{ message?: string }>> => {
    return http.put<ApiResponse<{ message?: string }>>(`/api/organizations/${id}`, data)
  }
}
