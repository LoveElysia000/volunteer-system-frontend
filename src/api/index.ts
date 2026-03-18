import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { tokenManager } from '@/utils/token'
import type { ApiError, InternalRequestConfig } from './types'

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/'
const API_TIMEOUT = 30000 // 30秒

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 如果不是跳过认证的请求，添加token
    if (!(config as InternalRequestConfig).skipAuth) {
      const token = tokenManager.getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & InternalRequestConfig & { _retry?: boolean }

    // Token过期，尝试刷新
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipRefresh) {
      originalRequest._retry = true

      try {
        const refreshToken = tokenManager.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // 调用刷新token接口
        const { authApi } = await import('./auth')
        const response = await authApi.refreshToken({ refreshToken })

        // 更新token
        tokenManager.setTokens(
          response.token,
          response.refreshToken,
          response.expiresAt
        )

        // 更新请求头
        originalRequest.headers.Authorization = `Bearer ${response.token}`

        // 重试原请求
        return apiClient(originalRequest)
      } catch (refreshError) {
        // 刷新失败，清除token并跳转登录
        tokenManager.clearTokens()
        const currentPath = window.location.pathname
        if (currentPath !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    // 处理其他错误
    const apiError: ApiError = {
      code: error.response?.status || 0,
      message: (error.response?.data as any)?.msg || (error.response?.data as any)?.message || (error.message ? String(error.message) : '请求失败'),
      details: error.response?.data
    }

    return Promise.reject(apiError)
  }
)

export default apiClient
