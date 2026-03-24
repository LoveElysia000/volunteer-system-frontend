// HTTP方法
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 通用API响应结构
export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}

export const isApiSuccess = (code: number) => code === 0 || code === 200

export const getApiMessage = (response: Pick<ApiResponse<unknown>, 'msg'> & { message?: string }) => {
  return response.msg || response.message || '请求失败'
}

// 请求配置
export interface RequestConfig {
  url: string
  method?: HttpMethod
  data?: any
  params?: any
  headers?: Record<string, string>
  skipAuth?: boolean  // 跳过token认证
  skipRefresh?: boolean // 跳过token刷新
}

// 请求配置扩展（用于axios）
export interface InternalRequestConfig extends RequestConfig {
  _retry?: boolean
}

// API错误
export interface ApiError {
  code: number
  message: string
  details?: any
}
