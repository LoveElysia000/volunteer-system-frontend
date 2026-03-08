import { http } from './request'
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse
} from '@/types/auth'

// 通用API响应结构
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

export const authApi = {
  // 用户登录
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return http.post<LoginResponse>('/api/login', data, { skipAuth: true })
  },

  // 用户登出
  logout: (data: LogoutRequest): Promise<LogoutResponse> => {
    return http.post<LogoutResponse>('/api/logout', data)
  },

  // 刷新令牌
  refreshToken: (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return http.post<RefreshTokenResponse>('/api/refresh', data, { skipAuth: true, skipRefresh: true })
  },

  // 用户注册
  register: (data: RegisterRequest): Promise<RegisterResponse> => {
    return http.post<RegisterResponse>('/api/register', data, { skipAuth: true })
  }
}