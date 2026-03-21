import { http } from './request'
import type {
  VolunteerRealNameSubmitData,
  VolunteerRealNameSubmitRequest,
  UpdateVolunteerProfileRequest,
  VolunteerHomeSummaryData,
  VolunteerProfileData
} from '@/types/volunteer'

interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

export const volunteerApi = {
  getHomeSummary: (): Promise<ApiResponse<VolunteerHomeSummaryData>> => {
    return http.get<ApiResponse<VolunteerHomeSummaryData>>('/api/volunteers/home/summary')
  },

  getMyProfile: (id: number | string): Promise<ApiResponse<VolunteerProfileData>> => {
    return http.get<ApiResponse<VolunteerProfileData>>(`/api/volunteers/my/profile/${id}`)
  },

  updateProfile: (id: number | string, data: UpdateVolunteerProfileRequest): Promise<ApiResponse<Record<string, never>>> => {
    return http.put<ApiResponse<Record<string, never>>>(`/api/volunteers/${id}`, data)
  },

  submitRealName: (data: VolunteerRealNameSubmitRequest): Promise<ApiResponse<VolunteerRealNameSubmitData>> => {
    return http.post<ApiResponse<VolunteerRealNameSubmitData>>('/api/volunteers/real-name/submit', data)
  }
}
