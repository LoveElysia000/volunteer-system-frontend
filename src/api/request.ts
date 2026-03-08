import apiClient from './index'
import type { RequestConfig, ApiError } from './types'

export async function request<T = any>(config: RequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      url: config.url,
      method: config.method || 'GET',
      data: config.data,
      params: config.params,
      headers: config.headers,
      skipAuth: config.skipAuth,
      skipRefresh: config.skipRefresh
    })
    return response
  } catch (error) {
    throw error as ApiError
  }
}

// 快捷方法
export const http = {
  get: <T = any>(url: string, params?: any, config?: Partial<RequestConfig>) =>
    request<T>({ url, method: 'GET', params, ...config }),

  post: <T = any>(url: string, data?: any, config?: Partial<RequestConfig>) =>
    request<T>({ url, method: 'POST', data, ...config }),

  put: <T = any>(url: string, data?: any, config?: Partial<RequestConfig>) =>
    request<T>({ url, method: 'PUT', data, ...config }),

  delete: <T = any>(url: string, params?: any, config?: Partial<RequestConfig>) =>
    request<T>({ url, method: 'DELETE', params, ...config }),

  patch: <T = any>(url: string, data?: any, config?: Partial<RequestConfig>) =>
    request<T>({ url, method: 'PATCH', data, ...config })
}