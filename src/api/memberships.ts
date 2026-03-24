import { http } from './request'
import type { ApiResponse } from './types'
import type {
  MembershipStatsData,
  MembershipStatsParams,
  OrganizationMembersData,
  OrganizationMembersParams,
  UpdateMembershipStatusData,
  UpdateMembershipStatusRequest
} from '@/types/membership'

export const membershipsApi = {
  getOrganizationMembers: ({ organizationId, ...params }: OrganizationMembersParams): Promise<ApiResponse<OrganizationMembersData>> => {
    return http.get<ApiResponse<OrganizationMembersData>>(`/api/organizations/${organizationId}/members`, params)
  },

  getMembershipStats: (params: MembershipStatsParams): Promise<ApiResponse<MembershipStatsData>> => {
    return http.get<ApiResponse<MembershipStatsData>>('/api/memberships/stats', params)
  },

  updateMembershipStatus: (data: UpdateMembershipStatusRequest): Promise<ApiResponse<UpdateMembershipStatusData>> => {
    return http.post<ApiResponse<UpdateMembershipStatusData>>('/api/memberships/status/update', data)
  }
}
