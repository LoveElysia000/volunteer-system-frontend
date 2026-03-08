// 登录类型枚举
export enum LoginType {
  EMAIL = 'email',
  PHONE = 'phone'
}

// 用户身份枚举
export enum UserIdentity {
  VOLUNTEER = 'volunteer',
  ORGANIZATION = 'organization'
}

// 后端返回的用户信息
export interface UserInfo {
  userId: string
  username: string
  email: string
  phone: string
  displayName: string
  avatarUrl: string
  identity: UserIdentity
  createdAt: number
  updatedAt: number
}

// 登录请求参数
export interface LoginRequest {
  loginType: LoginType
  identifier: string
  password: string
  identity: UserIdentity
}

// 登录响应
export interface LoginResponse {
  code: number
  msg: string
  data: {
    accessToken: string
    refreshToken: string
    expiresAt: number
    userInfo: UserInfo
  }
}

// 登出请求
export interface LogoutRequest {
  token: string
}

// 登出响应
export interface LogoutResponse {
  success: boolean
  message: string
}

// 刷新令牌请求
export interface RefreshTokenRequest {
  refreshToken: string
}

// 刷新令牌响应
export interface RefreshTokenResponse {
  code: number
  msg: string
  data: {
    token: string
    refreshToken: string
    expiresAt: number
    userInfo: UserInfo
  }
}

// 前端用户信息（兼容现有代码）
export interface User {
  id: string
  username: string
  email: string
  realName: string
  role: UserIdentity
  avatarUrl?: string
  phone?: string
  points?: number
  totalHours?: number
}

// 注册请求参数
export interface RegisterRequest {
  registerType: UserIdentity
  username: string
  name: string
  phone: string
  email: string
  password: string
  age?: number
  gender?: string
  organizationName?: string
}

// 注册响应
export interface RegisterResponse {
  code: number
  msg: string
  data: Record<string, any>
}