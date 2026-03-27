import { http } from './request'
import type { ApiResponse } from './types'
import type {
  EmptyObjectData,
  VolunteerRealNameSubmitData,
  VolunteerRealNameSubmitRequest,
  VolunteerDetailData,
  UpdateVolunteerAccountRequest,
  UpdateVolunteerProfileRequest,
  VolunteerHomeSummaryData,
  VolunteerProfileData,
  VolunteerListData,
  VolunteerListRequest
} from '@/types/volunteer'

export const volunteerApi = {
  list: (data: VolunteerListRequest): Promise<ApiResponse<VolunteerListData>> => {
    return http.post<ApiResponse<VolunteerListData>>('/api/volunteers/list', data)
  },

  getDetail: (volunteerId: number): Promise<ApiResponse<VolunteerDetailData>> => {
    return http.get<ApiResponse<VolunteerDetailData>>(`/api/volunteers/${volunteerId}`)
  },

  getHomeSummary: (): Promise<ApiResponse<VolunteerHomeSummaryData>> => {
    return http.get<ApiResponse<VolunteerHomeSummaryData>>('/api/volunteers/home/summary')
  },

  getMyProfile: (): Promise<ApiResponse<VolunteerProfileData>> => {
    return http.get<ApiResponse<VolunteerProfileData>>('/api/me/profile')
  },

  updateAccount: (data: UpdateVolunteerAccountRequest): Promise<ApiResponse<EmptyObjectData>> => {
    return http.put<ApiResponse<EmptyObjectData>>('/api/me/account', data)
  },

  updateProfile: (data: UpdateVolunteerProfileRequest): Promise<ApiResponse<EmptyObjectData>> => {
    return http.put<ApiResponse<EmptyObjectData>>('/api/me/volunteer-profile', data)
  },

  submitRealName: (data: VolunteerRealNameSubmitRequest): Promise<ApiResponse<VolunteerRealNameSubmitData>> => {
    return http.post<ApiResponse<VolunteerRealNameSubmitData>>('/api/volunteers/real-name/submit', data)
  }
}
