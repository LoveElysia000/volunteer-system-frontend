import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { requestTokenRefresh } from './refresh'
import { tokenManager } from '@/utils/token'
import type { InternalRequestConfig, ApiError } from './types'
import type { DateOnlyString } from '@/types/datetime'
import type { ActivityStatus } from '@/types/activity'
import type { VolunteerAuditStatus, VolunteerStatus } from '@/types/volunteer'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/'
const API_TIMEOUT = 30000

type ExportVolunteersRequest = {
  keyword?: string
  auditStatus?: VolunteerAuditStatus[]
  status?: VolunteerStatus[]
}

type ExportActivitiesRequest = {
  keyword: string
  status?: ActivityStatus
  startFrom?: DateOnlyString
  startTo?: DateOnlyString
}

type OpsReportPeriodType = 'last_7_days' | 'last_30_days' | 'custom'

type ExportOpsReportRequest = {
  periodType: OpsReportPeriodType
  orgId: number
  start: DateOnlyString
  end: DateOnlyString
}

const adminClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT
})

adminClient.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & InternalRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.skipRefresh) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenManager.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await requestTokenRefresh({ refreshToken })
        if (response.code !== 200) {
          throw new Error(response.msg || '刷新 token 失败')
        }

        tokenManager.setTokens(
          response.data.token,
          response.data.refreshToken,
          response.data.expiresAt
        )

        originalRequest.headers.Authorization = `Bearer ${response.data.token}`
        return adminClient(originalRequest)
      } catch (refreshError) {
        tokenManager.clearTokens()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    const apiError: ApiError = {
      code: error.response?.status || 0,
      message: (error.response?.data as any)?.msg || (error.response?.data as any)?.message || (error.message ? String(error.message) : '请求失败'),
      details: error.response?.data
    }

    return Promise.reject(apiError)
  }
)

export const adminApi = {
  importVolunteers: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return adminClient.post('/api/admin/import/volunteers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => response.data)
  },

  importActivities: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return adminClient.post('/api/admin/import/activities', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => response.data)
  },

  exportVolunteers: (data: ExportVolunteersRequest) => {
    return adminClient.post('/api/admin/export/volunteers', data, {
      responseType: 'blob'
    })
  },

  exportActivities: (data: ExportActivitiesRequest) => {
    return adminClient.post('/api/admin/export/activities', data, {
      responseType: 'blob'
    })
  },

  exportOpsReport: (data: ExportOpsReportRequest) => {
    return adminClient.post('/api/admin/export/ops-report', data, {
      responseType: 'blob'
    })
  }
}
