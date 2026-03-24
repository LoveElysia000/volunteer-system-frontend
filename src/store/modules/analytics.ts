import { defineStore } from 'pinia'
import { ref } from 'vue'
import { analyticsApi } from '@/api/analytics'
import type {
  OrganizationAnalyticsQuery,
  OrganizationDashboardAnalyticsData,
  OrganizationFunnelData
} from '@/types/analytics'

export const useAnalyticsStore = defineStore('analytics', () => {
  const funnel = ref<OrganizationFunnelData | null>(null)
  const dashboard = ref<OrganizationDashboardAnalyticsData | null>(null)
  const loading = ref(false)

  const fetchOrganizationAnalytics = async (params: OrganizationAnalyticsQuery) => {
    loading.value = true
    try {
      const [funnelResponse, dashboardResponse] = await Promise.all([
        analyticsApi.getOrganizationFunnel(params),
        analyticsApi.getOrganizationDashboard(params)
      ])

      if (funnelResponse.code !== 200) {
        throw new Error(funnelResponse.msg || '获取转化漏斗失败')
      }
      if (dashboardResponse.code !== 200) {
        throw new Error(dashboardResponse.msg || '获取看板统计失败')
      }

      funnel.value = funnelResponse.data
      dashboard.value = dashboardResponse.data

      return {
        funnel: funnelResponse.data,
        dashboard: dashboardResponse.data
      }
    } finally {
      loading.value = false
    }
  }

  return {
    funnel,
    dashboard,
    loading,
    fetchOrganizationAnalytics
  }
})
