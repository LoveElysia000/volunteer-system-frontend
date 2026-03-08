const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'
const EXPIRES_AT_KEY = 'auth_expires_at'

export const tokenManager = {
  // 获取访问令牌
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  // 设置访问令牌
  setAccessToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  // 获取刷新令牌
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  // 设置刷新令牌
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  // 获取过期时间
  getExpiresAt(): number | null {
    const expires = localStorage.getItem(EXPIRES_AT_KEY)
    return expires ? parseInt(expires, 10) : null
  },

  // 设置过期时间
  setExpiresAt(expiresAt: number): void {
    localStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString())
  },

  // 检查token是否即将过期（5分钟内）
  isTokenExpiringSoon(): boolean {
    const expiresAt = this.getExpiresAt()
    if (!expiresAt) return true
    const now = Math.floor(Date.now() / 1000)
    const fiveMinutes = 5 * 60
    return (expiresAt - now) < fiveMinutes
  },

  // 检查token是否已过期
  isTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt()
    if (!expiresAt) return true
    const now = Math.floor(Date.now() / 1000)
    return expiresAt <= now
  },

  // 清除所有token
  clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
  },

  // 设置所有token
  setTokens(accessToken: string, refreshToken: string, expiresAt: number): void {
    this.setAccessToken(accessToken)
    this.setRefreshToken(refreshToken)
    this.setExpiresAt(expiresAt)
  }
}