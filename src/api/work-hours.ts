import { http } from './request'
import type { ApiResponse } from './types'
import type {
  RecalculateWorkHourData,
  RecalculateWorkHourRequest,
  VoidWorkHourData,
  VoidWorkHourRequest,
  WorkHourListData,
  WorkHourListRequest
} from '@/types/work-hour'

export const workHoursApi = {
  list: (data: WorkHourListRequest): Promise<ApiResponse<WorkHourListData>> => {
    return http.post<ApiResponse<WorkHourListData>>('/api/work-hours/list', data)
  },

  void: (data: VoidWorkHourRequest): Promise<ApiResponse<VoidWorkHourData>> => {
    return http.post<ApiResponse<VoidWorkHourData>>('/api/work-hours/void', data)
  },

  recalculate: (data: RecalculateWorkHourRequest): Promise<ApiResponse<RecalculateWorkHourData>> => {
    return http.post<ApiResponse<RecalculateWorkHourData>>('/api/work-hours/recalculate', data)
  }
}
