import type {
  OrganizationAnalyticsQuery,
  OrganizationDashboardAnalyticsData,
  OrganizationFunnelData
} from '../../types/analytics.ts'

interface AnalyticsSuccessResponse<T> {
  code: number
  msg?: string
  data: T
}

interface AnalyticsRequestApi {
  getOrganizationFunnel: (params: OrganizationAnalyticsQuery) => Promise<AnalyticsSuccessResponse<OrganizationFunnelData>>
  getOrganizationDashboard: (params: OrganizationAnalyticsQuery) => Promise<AnalyticsSuccessResponse<OrganizationDashboardAnalyticsData>>
}

const assertSuccess = <T>(response: AnalyticsSuccessResponse<T>, fallbackMessage: string) => {
  if (response.code !== 200) {
    throw new Error(response.msg || fallbackMessage)
  }

  return response.data
}

export const fetchFunnelData = async (api: AnalyticsRequestApi, params: OrganizationAnalyticsQuery) => {
  const response = await api.getOrganizationFunnel(params)
  return assertSuccess(response, '获取转化漏斗失败')
}

export const fetchDashboardData = async (api: AnalyticsRequestApi, params: OrganizationAnalyticsQuery) => {
  const response = await api.getOrganizationDashboard(params)
  return assertSuccess(response, '获取看板统计失败')
}

export const fetchCombinedAnalyticsData = async (api: AnalyticsRequestApi, params: OrganizationAnalyticsQuery) => {
  const [funnel, dashboard] = await Promise.all([
    fetchFunnelData(api, params),
    fetchDashboardData(api, params)
  ])

  return {
    funnel,
    dashboard
  }
}

export type { AnalyticsRequestApi, AnalyticsSuccessResponse }
