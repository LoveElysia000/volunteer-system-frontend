import { http } from './request'
import type { ApiResponse } from './types'
import type {
  EmptyObjectData,
  VolunteerRealNameSubmitData,
  VolunteerRealNameSubmitRequest,
  UpdateVolunteerProfileRequest,
  VolunteerHomeSummaryData,
  VolunteerProfileData
} from '@/types/volunteer'

export const volunteerApi = {
  getHomeSummary: (): Promise<ApiResponse<VolunteerHomeSummaryData>> => {
    return http.get<ApiResponse<VolunteerHomeSummaryData>>('/api/volunteers/home/summary')
  },

  getMyProfile: (id: number): Promise<ApiResponse<VolunteerProfileData>> => {
    return http.get<ApiResponse<VolunteerProfileData>>(`/api/volunteers/my/profile/${id}`)
  },

  updateProfile: (id: number, data: UpdateVolunteerProfileRequest): Promise<ApiResponse<EmptyObjectData>> => {
    return http.put<ApiResponse<EmptyObjectData>>(`/api/volunteers/${id}`, data)
  },

  submitRealName: (data: VolunteerRealNameSubmitRequest): Promise<ApiResponse<VolunteerRealNameSubmitData>> => {
    return http.post<ApiResponse<VolunteerRealNameSubmitData>>('/api/volunteers/real-name/submit', data)
  }
}
