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

  getDetail: (id: number): Promise<ApiResponse<VolunteerDetailData>> => {
    return http.get<ApiResponse<VolunteerDetailData>>(`/api/volunteers/detail/${id}`)
  },

  getHomeSummary: (): Promise<ApiResponse<VolunteerHomeSummaryData>> => {
    return http.get<ApiResponse<VolunteerHomeSummaryData>>('/api/volunteers/home/summary')
  },

  getMyProfile: (id: number): Promise<ApiResponse<VolunteerProfileData>> => {
    return http.get<ApiResponse<VolunteerProfileData>>(`/api/volunteers/my/profile/${id}`)
  },

  updateAccount: (data: UpdateVolunteerAccountRequest): Promise<ApiResponse<EmptyObjectData>> => {
    return http.put<ApiResponse<EmptyObjectData>>('/api/volunteers/account', data)
  },

  updateProfile: (id: number, data: UpdateVolunteerProfileRequest): Promise<ApiResponse<EmptyObjectData>> => {
    return http.put<ApiResponse<EmptyObjectData>>(`/api/volunteers/${id}`, data)
  },

  submitRealName: (data: VolunteerRealNameSubmitRequest): Promise<ApiResponse<VolunteerRealNameSubmitData>> => {
    return http.post<ApiResponse<VolunteerRealNameSubmitData>>('/api/volunteers/real-name/submit', data)
  }
}
