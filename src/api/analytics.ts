import { http } from './request'
import type { ApiResponse } from './types'
import type {
  OrganizationAnalyticsQuery,
  OrganizationDashboardAnalyticsData,
  OrganizationFunnelData
} from '@/types/analytics'

export const analyticsApi = {
  getOrganizationFunnel: (params: OrganizationAnalyticsQuery): Promise<ApiResponse<OrganizationFunnelData>> => {
    return http.get<ApiResponse<OrganizationFunnelData>>('/api/analytics/org/funnel', params)
  },

  getOrganizationDashboard: (params: OrganizationAnalyticsQuery): Promise<ApiResponse<OrganizationDashboardAnalyticsData>> => {
    return http.get<ApiResponse<OrganizationDashboardAnalyticsData>>('/api/analytics/org/dashboard', params)
  }
}
