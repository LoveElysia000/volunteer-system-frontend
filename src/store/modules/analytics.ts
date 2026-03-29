import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { analyticsApi } from '@/api/analytics'
import type {
  OrganizationAnalyticsQuery,
  OrganizationDashboardAnalyticsData,
  OrganizationFunnelData
} from '@/types/analytics'
import {
  fetchCombinedAnalyticsData,
  fetchDashboardData,
  fetchFunnelData
} from './analytics-requests'

export const useAnalyticsStore = defineStore('analytics', () => {
  const funnel = ref<OrganizationFunnelData | null>(null)
  const dashboard = ref<OrganizationDashboardAnalyticsData | null>(null)
  const funnelLoading = ref(false)
  const dashboardLoading = ref(false)
  const loading = computed(() => funnelLoading.value || dashboardLoading.value)

  const fetchOrganizationFunnel = async (params: OrganizationAnalyticsQuery) => {
    funnelLoading.value = true
    try {
      const data = await fetchFunnelData(analyticsApi, params)
      funnel.value = data
      return data
    } finally {
      funnelLoading.value = false
    }
  }

  const fetchOrganizationDashboard = async (params: OrganizationAnalyticsQuery) => {
    dashboardLoading.value = true
    try {
      const data = await fetchDashboardData(analyticsApi, params)
      dashboard.value = data
      return data
    } finally {
      dashboardLoading.value = false
    }
  }

  const fetchOrganizationAnalytics = async (params: OrganizationAnalyticsQuery) => {
    funnelLoading.value = true
    dashboardLoading.value = true
    try {
      const data = await fetchCombinedAnalyticsData(analyticsApi, params)
      funnel.value = data.funnel
      dashboard.value = data.dashboard
      return data
    } finally {
      funnelLoading.value = false
      dashboardLoading.value = false
    }
  }

  return {
    funnel,
    dashboard,
    funnelLoading,
    dashboardLoading,
    loading,
    fetchOrganizationFunnel,
    fetchOrganizationDashboard,
    fetchOrganizationAnalytics
  }
})
