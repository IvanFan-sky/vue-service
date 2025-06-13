/**
 * Token管理器
 * @description 处理Token的自动刷新、过期检查等功能
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'

interface TokenPayload {
  exp: number
  iat: number
  userId: number
  username: string
}

interface QueueItem {
  resolve: (token: string) => void
  reject: (error: any) => void
}

export class TokenManager {
  private refreshTimer: NodeJS.Timeout | null = null
  private isRefreshing = false
  private failedQueue: QueueItem[] = []
  private readonly REFRESH_THRESHOLD = 5 * 60 * 1000 // 5分钟

  constructor(private authStore: ReturnType<typeof useAuthStore>) {
    this.setupTokenRefresh()
  }

  /**
   * 解析JWT Token
   * @param token JWT Token
   * @returns Token载荷
   */
  private parseJWT(token: string): TokenPayload {
    try {
      const base64Url = token.split('.')[1]
      if (!base64Url) {
        throw new Error('Invalid token format')
      }
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      
      return JSON.parse(jsonPayload)
    } catch (error) {
      throw new Error('Invalid token format')
    }
  }

  /**
   * 检查Token是否即将过期
   * @param token JWT Token
   * @returns 是否即将过期
   */
  private isTokenExpiringSoon(token: string): boolean {
    try {
      const payload = this.parseJWT(token)
      const expiresAt = payload.exp * 1000
      const now = Date.now()
      
      return (expiresAt - now) <= this.REFRESH_THRESHOLD
    } catch (error) {
      return true // 解析失败认为已过期
    }
  }

  /**
   * 检查Token是否已过期
   * @param token JWT Token
   * @returns 是否已过期
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.parseJWT(token)
      const expiresAt = payload.exp * 1000
      const now = Date.now()
      
      return now >= expiresAt
    } catch (error) {
      return true // 解析失败认为已过期
    }
  }

  /**
   * 设置Token自动刷新
   */
  private setupTokenRefresh(): void {
    const token = this.authStore.token
    if (!token) return

    try {
      const payload = this.parseJWT(token)
      const expiresAt = payload.exp * 1000
      const now = Date.now()
      const refreshAt = expiresAt - this.REFRESH_THRESHOLD

      if (refreshAt > now) {
        this.refreshTimer = setTimeout(() => {
          this.refreshToken()
        }, refreshAt - now)
      } else {
        // Token即将过期或已过期，立即刷新
        this.refreshToken()
      }
    } catch (error) {
      console.error('设置Token刷新失败:', error)
    }
  }

  /**
   * 刷新Token
   * @returns 新的Token
   */
  async refreshToken(): Promise<string> {
    if (this.isRefreshing) {
      // 如果正在刷新，将请求加入队列
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject })
      })
    }

    this.isRefreshing = true

    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authApi.refreshToken(refreshToken)
      
      if (response.code === 200 && response.data) {
        const { token: newToken, refreshToken: newRefreshToken } = response.data

        // 更新Token
        this.authStore.token = newToken
        localStorage.setItem('token', newToken)
        
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken)
        }

        // 处理等待队列
        this.failedQueue.forEach(({ resolve }) => resolve(newToken))
        this.failedQueue = []

        // 设置下次刷新
        this.setupTokenRefresh()

        console.log('Token刷新成功')
        return newToken
      } else {
        throw new Error(response.message || 'Token刷新失败')
      }
    } catch (error) {
      console.error('Token刷新失败:', error)
      
      // 处理等待队列
      this.failedQueue.forEach(({ reject }) => reject(error))
      this.failedQueue = []

      // 刷新失败，清除认证信息
      this.authStore.logout()
      
      throw error
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * 获取有效的Token
   * @returns 有效的Token
   */
  async getValidToken(): Promise<string> {
    const token = this.authStore.token
    
    if (!token) {
      throw new Error('No token available')
    }

    if (this.isTokenExpired(token)) {
      // Token已过期，尝试刷新
      return await this.refreshToken()
    }

    if (this.isTokenExpiringSoon(token)) {
      // Token即将过期，后台刷新
      this.refreshToken().catch(error => {
        console.error('后台Token刷新失败:', error)
      })
    }

    return token
  }

  /**
   * 清除刷新定时器
   */
  clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  /**
   * 销毁Token管理器
   */
  destroy(): void {
    this.clearRefreshTimer()
    this.failedQueue = []
    this.isRefreshing = false
  }

  /**
   * 获取Token信息
   * @param token JWT Token
   * @returns Token信息
   */
  getTokenInfo(token?: string): {
    payload: TokenPayload | null
    isExpired: boolean
    isExpiringSoon: boolean
    expiresAt: Date | null
    timeToExpire: number | null
  } {
    const currentToken = token || this.authStore.token
    
    if (!currentToken) {
      return {
        payload: null,
        isExpired: true,
        isExpiringSoon: true,
        expiresAt: null,
        timeToExpire: null
      }
    }

    try {
      const payload = this.parseJWT(currentToken)
      const expiresAt = new Date(payload.exp * 1000)
      const now = Date.now()
      const timeToExpire = payload.exp * 1000 - now

      return {
        payload,
        isExpired: this.isTokenExpired(currentToken),
        isExpiringSoon: this.isTokenExpiringSoon(currentToken),
        expiresAt,
        timeToExpire
      }
    } catch (error) {
      return {
        payload: null,
        isExpired: true,
        isExpiringSoon: true,
        expiresAt: null,
        timeToExpire: null
      }
    }
  }
}

// 创建全局Token管理器实例
let tokenManagerInstance: TokenManager | null = null

/**
 * 获取Token管理器实例
 * @returns Token管理器实例
 */
export function getTokenManager(): TokenManager {
  if (!tokenManagerInstance) {
    const authStore = useAuthStore()
    tokenManagerInstance = new TokenManager(authStore)
  }
  return tokenManagerInstance
}

/**
 * 销毁Token管理器实例
 */
export function destroyTokenManager(): void {
  if (tokenManagerInstance) {
    tokenManagerInstance.destroy()
    tokenManagerInstance = null
  }
}
