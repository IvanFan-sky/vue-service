/**
 * 认证相关API接口
 * @description 包含用户登录、登出、获取用户信息等认证功能，支持真实接口和模拟接口切换
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import request from '@/utils/request'
import { mockAuthApi } from './mock/auth'
import type { LoginForm, User, ApiResponse } from '@/types'

/**
 * 是否使用模拟数据
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 真实API接口
 */
const realAuthApi = {
  /**
   * 用户登录
   * @param loginForm 登录表单数据
   * @returns Promise<ApiResponse<LoginResult>>
   * @example
   * ```typescript
   * const result = await realAuthApi.login({
   *   username: 'admin',
   *   password: '123456'
   * })
   * ```
   */
  login: (loginForm: LoginForm): Promise<ApiResponse<{ token: string; user: User; refreshToken?: string }>> => {
    return request.post('/auth/login', loginForm)
  },

  /**
   * 获取当前用户信息
   * @returns Promise<ApiResponse<User>>
   * @example
   * ```typescript
   * const userInfo = await realAuthApi.getUserInfo()
   * ```
   */
  getUserInfo: (): Promise<ApiResponse<User>> => {
    return request.get('/auth/user')
  },

  /**
   * 用户登出
   * @returns Promise<ApiResponse>
   * @example
   * ```typescript
   * await realAuthApi.logout()
   * ```
   */
  logout: (): Promise<ApiResponse> => {
    return request.post('/auth/logout')
  },

  /**
   * 刷新访问令牌
   * @param refreshToken 刷新令牌
   * @returns Promise<ApiResponse<TokenResult>>
   * @example
   * ```typescript
   * const result = await realAuthApi.refreshToken('refresh_token_here')
   * ```
   */
  refreshToken: (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken?: string }>> => {
    return request.post('/auth/refresh', { refreshToken })
  },

  /**
   * 修改密码
   * @param data 修改密码数据
   * @returns Promise<ApiResponse>
   */
  changePassword: (data: { oldPassword: string; newPassword: string }): Promise<ApiResponse> => {
    return request.post('/auth/change-password', data)
  },

  /**
   * 重置密码
   * @param data 重置密码数据
   * @returns Promise<ApiResponse>
   */
  resetPassword: (data: { email: string }): Promise<ApiResponse> => {
    return request.post('/auth/reset-password', data)
  }
}

/**
 * 认证API接口集合
 * 根据环境变量自动选择使用真实API或模拟API
 */
export const authApi = USE_MOCK ? mockAuthApi : realAuthApi

// 兼容旧版本的导出方式
export const loginApi = authApi.login
export const getUserInfoApi = authApi.getUserInfo
export const logoutApi = authApi.logout
export const refreshTokenApi = authApi.refreshToken

/**
 * 获取当前API模式
 * @returns 'mock' | 'real'
 */
export const getApiMode = (): 'mock' | 'real' => {
  return USE_MOCK ? 'mock' : 'real'
}

/**
 * 打印当前API配置信息（仅开发环境）
 */
if (import.meta.env.DEV) {
  console.log(`🔧 认证API模式: ${getApiMode()}`)
  console.log(`🌐 API基础URL: ${import.meta.env.VITE_API_BASE_URL}`)
  console.log(`🎭 使用模拟数据: ${USE_MOCK}`)
} 