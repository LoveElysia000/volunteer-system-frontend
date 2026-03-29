import { http } from './request'
import type { ApiResponse } from './types'
import type { VolunteerWorkHoursData, VolunteerWorkHoursRequest } from '@/types/work-hour'

export const volunteerWorkHoursApi = {
  list: (data: VolunteerWorkHoursRequest): Promise<ApiResponse<VolunteerWorkHoursData>> => {
    return http.post<ApiResponse<VolunteerWorkHoursData>>('/api/volunteers/work-hours', data)
  }
}
