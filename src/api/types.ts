// HTTP方法
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

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