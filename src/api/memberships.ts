import { http } from './request'
import type { ApiResponse } from './types'
import type {
  MembershipStatsData,
  MembershipStatsParams,
  OrganizationMembersData,
  OrganizationMembersParams,
  VolunteerJoinData,
  VolunteerJoinRequest,
  VolunteerLeaveData,
  VolunteerLeaveRequest,
  VolunteerOrganizationsData,
  VolunteerOrganizationsParams,
  UpdateMembershipStatusData,
  UpdateMembershipStatusRequest
} from '@/types/membership'

export const membershipsApi = {
  join: (data: VolunteerJoinRequest): Promise<ApiResponse<VolunteerJoinData>> => {
    return http.post<ApiResponse<VolunteerJoinData>>('/api/memberships/join', data)
  },

  leave: (data: VolunteerLeaveRequest): Promise<ApiResponse<VolunteerLeaveData>> => {
    return http.post<ApiResponse<VolunteerLeaveData>>('/api/memberships/leave', data)
  },

  getOrganizationMembers: ({ organizationId, ...params }: OrganizationMembersParams): Promise<ApiResponse<OrganizationMembersData>> => {
    return http.get<ApiResponse<OrganizationMembersData>>(`/api/organizations/${organizationId}/members`, params)
  },

  getVolunteerOrganizations: ({ volunteerId, ...params }: VolunteerOrganizationsParams): Promise<ApiResponse<VolunteerOrganizationsData>> => {
    return http.get<ApiResponse<VolunteerOrganizationsData>>(`/api/volunteers/${volunteerId}/organizations`, params)
  },

  getMembershipStats: (params: MembershipStatsParams): Promise<ApiResponse<MembershipStatsData>> => {
    return http.get<ApiResponse<MembershipStatsData>>('/api/memberships/stats', params)
  },

  updateMembershipStatus: (data: UpdateMembershipStatusRequest): Promise<ApiResponse<UpdateMembershipStatusData>> => {
    return http.post<ApiResponse<UpdateMembershipStatusData>>('/api/memberships/status/update', data)
  }
}
