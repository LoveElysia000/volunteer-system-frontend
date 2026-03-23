import { http } from './request'
import { requestTokenRefresh } from './refresh'
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  VolunteerRegisterRequest,
  OrganizationRegisterRequest,
  RegisterResponse
} from '@/types/auth'

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
    return requestTokenRefresh(data)
  },

  // 志愿者注册
  registerVolunteer: (data: VolunteerRegisterRequest): Promise<RegisterResponse> => {
    return http.post<RegisterResponse>('/api/volunteer/register', data, { skipAuth: true })
  },

  // 组织管理员注册
  registerOrganization: (data: OrganizationRegisterRequest): Promise<RegisterResponse> => {
    return http.post<RegisterResponse>('/api/organization/register', data, { skipAuth: true })
  }
}
