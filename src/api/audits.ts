import { http } from './request'
import type { ApiResponse } from './types'
import type {
  AuditDecisionRequest,
  AuditRecordDetailData,
  PendingAuditsData,
  PendingAuditsRequest
} from '@/types/audit'

export const auditsApi = {
  getPending: (data: PendingAuditsRequest): Promise<ApiResponse<PendingAuditsData>> => {
    return http.post<ApiResponse<PendingAuditsData>>('/api/audits/pending', data)
  },

  approve: (data: AuditDecisionRequest): Promise<ApiResponse<Record<string, never>>> => {
    return http.post<ApiResponse<Record<string, never>>>('/api/audits/approval', data)
  },

  reject: (data: AuditDecisionRequest): Promise<ApiResponse<Record<string, never>>> => {
    return http.post<ApiResponse<Record<string, never>>>('/api/audits/rejection', data)
  },

  getDetail: (id: number): Promise<ApiResponse<AuditRecordDetailData>> => {
    return http.get<ApiResponse<AuditRecordDetailData>>(`/api/audits/records/${id}`)
  }
}
