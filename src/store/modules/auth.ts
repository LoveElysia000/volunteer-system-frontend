import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import { tokenManager } from '@/utils/token'
import type {
  UserInfo,
  User,
  LoginRequest,
  VolunteerRegisterRequest,
  OrganizationRegisterRequest
} from '@/types/auth'

// 存储键名常量
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
}

const normalizeStoredUser = (storedUser: string): User => {
  const parsed = JSON.parse(storedUser) as Partial<User>
  return {
    accountId: parsed.accountId ?? '',
    username: parsed.username ?? '',
    email: parsed.email ?? '',
    realName: parsed.realName ?? '',
    role: parsed.role!,
    avatarUrl: parsed.avatarUrl,
    phone: parsed.phone,
    points: parsed.points,
    totalHours: parsed.totalHours
  }
}

// 将后端UserInfo转换为前端User
const transformUserInfo = (userInfo: UserInfo): User => ({
  accountId: userInfo.accountId,
  username: userInfo.userName,
  email: userInfo.email,
  realName: userInfo.displayName || userInfo.userName,
  role: userInfo.identity,
  avatarUrl: userInfo.avatarUrl,
  phone: userInfo.phone
})

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isRefreshing = ref(false) // 是否正在刷新token

  // 从存储恢复状态
  const restoreAuthState = () => {
    const storedToken = tokenManager.getAccessToken()
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER)

    if (storedToken && storedUser) {
      try {
        // 检查token是否过期
        if (tokenManager.isTokenExpired()) {
          clearStoredAuth()
          return
        }

        token.value = storedToken
        user.value = normalizeStoredUser(storedUser)

        // 如果token即将过期，自动刷新
        if (tokenManager.isTokenExpiringSoon()) {
          refreshToken()
        }
      } catch (error) {
        console.error('恢复认证状态失败:', error)
        clearStoredAuth()
      }
    }
  }

  // 清除存储的认证信息
  const clearStoredAuth = () => {
    tokenManager.clearTokens()
    localStorage.removeItem(STORAGE_KEYS.USER)
  }

  // 登录
  const login = async (loginRequest: LoginRequest) => {
    const response = await authApi.login(loginRequest)

    // 检查响应是否成功
    if (response.code !== 200) {
      throw new Error(response.msg || '登录失败')
    }

    // 从 data 中提取登录数据
    const loginData = response.data

    // 保存token
    tokenManager.setTokens(
      loginData.accessToken,
      loginData.refreshToken,
      loginData.expiresAt
    )

    // 转换并保存用户信息
    const transformedUser = transformUserInfo(loginData.userInfo)
    user.value = transformedUser
    token.value = loginData.accessToken

    // 保存到localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(transformedUser))

    return response
  }

  // 登出
  const logout = async () => {
    try {
      const accessTokenValue = tokenManager.getAccessToken()
      if (accessTokenValue) {
        await authApi.logout({ token: accessTokenValue })
      }
    } catch (error) {
      console.error('登出请求失败:', error)
    } finally {
      // 无论请求成功与否，都清除本地状态
      user.value = null
      token.value = null
      clearStoredAuth()
    }
  }

  // 刷新token
  const refreshToken = async () => {
    if (isRefreshing.value) {
      return
    }

    isRefreshing.value = true

    try {
      const refreshTokenValue = tokenManager.getRefreshToken()
      if (!refreshTokenValue) {
        throw new Error('No refresh token available')
      }

      const response = await authApi.refreshToken({ refreshToken: refreshTokenValue })

      // 检查响应是否成功
      if (response.code !== 200) {
        throw new Error(response.msg || '刷新token失败')
      }

      // 更新token
      tokenManager.setTokens(
        response.data.token,
        response.data.refreshToken,
        response.data.expiresAt
      )

      // 更新用户信息
      const transformedUser = transformUserInfo(response.data.userInfo)
      user.value = transformedUser
      token.value = response.data.token

      // 保存到localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(transformedUser))

      return response
    } catch (error) {
      console.error('刷新token失败:', error)
      // 刷新失败，清除认证状态
      clearStoredAuth()
      user.value = null
      token.value = null
      throw error
    } finally {
      isRefreshing.value = false
    }
  }

  // 更新用户信息
  const updateProfile = async (profileData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...profileData }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
    }
  }

  const registerVolunteer = async (data: VolunteerRegisterRequest) => {
    const response = await authApi.registerVolunteer(data)
    return response
  }

  const registerOrganization = async (data: OrganizationRegisterRequest) => {
    const response = await authApi.registerOrganization(data)
    return response
  }

  return {
    // 状态
    user,
    token,
    isAuthenticated,
    isRefreshing,

    // Actions
    login,
    logout,
    refreshToken,
    updateProfile,
    registerVolunteer,
    registerOrganization,
    restoreAuthState
  }
})
