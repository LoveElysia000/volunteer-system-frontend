import axios from 'axios'
import type { RefreshTokenRequest, RefreshTokenResponse } from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/'
const API_TIMEOUT = 30000

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

export function requestTokenRefresh(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  return refreshClient
    .post<RefreshTokenResponse>('/api/refresh', data)
    .then((response) => response.data)
}
