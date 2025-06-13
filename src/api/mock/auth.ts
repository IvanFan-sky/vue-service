/**
 * 认证相关模拟API
 * @description 提供登录、登出、用户信息等模拟接口
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import type { LoginForm, User, UserRole } from '@/types'
import { UserStatus } from '@/types'

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 模拟用户数据
 */
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@example.com',
    phone: '13800138000',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: 'admin' as const,
    status: UserStatus.ACTIVE,
    roles: ['admin', 'user'] as UserRole[],
    permissions: ['user:read', 'user:write', 'user:delete', 'system:config'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-12-12T10:30:00.000Z'
  },
  {
    id: 2,
    username: 'user',
    password: '123456',
    email: 'user@example.com',
    phone: '13800138001',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: 'user' as const,
    status: UserStatus.ACTIVE,
    roles: ['user'] as UserRole[],
    permissions: ['user:read'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-12-12T10:30:00.000Z'
  },
  {
    id: 3,
    username: 'guest',
    password: '123456',
    email: 'guest@example.com',
    phone: '13800138002',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: 'guest' as const,
    status: UserStatus.ACTIVE,
    roles: ['guest'] as UserRole[],
    permissions: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-12-12T10:30:00.000Z'
  }
]

/**
 * 当前登录的用户信息
 */
let currentUser: User | null = null

/**
 * 生成模拟Token
 */
const generateToken = (user: User): string => {
  const timestamp = Date.now()
  const userInfo = btoa(JSON.stringify({ id: user.id, username: user.username }))
  return `mock_token_${userInfo}_${timestamp}`
}

/**
 * 模拟认证API
 */
export const mockAuthApi = {
  /**
   * 用户登录
   */
  async login(loginForm: LoginForm) {
    await delay(800)
    
    const { username, password } = loginForm
    const user = mockUsers.find(u => u.username === username)
    
    if (!user) {
      return {
        code: 400,
        message: '用户名不存在',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    if (user.password !== password) {
      return {
        code: 400,
        message: '密码错误',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    if (user.status !== UserStatus.ACTIVE) {
      return {
        code: 403,
        message: '账户已被禁用',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    // 生成Token
    const token = generateToken(user)
    const refreshToken = `refresh_${token}`
    
    // 设置当前用户（移除密码字段）
    const { password: _, ...userWithoutPassword } = user
    currentUser = userWithoutPassword
    
    // 存储Token
    localStorage.setItem('mock_current_token', token)
    
    return {
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: currentUser,
        refreshToken
      },
      success: true,
      timestamp: Date.now()
    }
  },

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    await delay(300)
    
    const token = localStorage.getItem('mock_current_token')
    
    if (!token || !token.startsWith('mock_token_')) {
      return {
        code: 401,
        message: 'Token无效或已过期',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    if (!currentUser) {
      return {
        code: 404,
        message: '用户信息不存在',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    return {
      code: 200,
      message: '获取用户信息成功',
      data: currentUser,
      success: true,
      timestamp: Date.now()
    }
  },

  /**
   * 用户登出
   */
  async logout() {
    await delay(300)
    
    currentUser = null
    localStorage.removeItem('mock_current_token')
    
    return {
      code: 200,
      message: '登出成功',
      data: null,
      success: true,
      timestamp: Date.now()
    }
  },

  /**
   * 刷新Token
   */
  async refreshToken(refreshToken: string) {
    await delay(500)
    
    if (!refreshToken || !refreshToken.startsWith('refresh_mock_token_')) {
      return {
        code: 401,
        message: 'Refresh Token无效',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    if (!currentUser) {
      return {
        code: 404,
        message: '用户信息不存在',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    const newToken = generateToken(currentUser)
    const newRefreshToken = `refresh_${newToken}`
    
    localStorage.setItem('mock_current_token', newToken)
    
    return {
      code: 200,
      message: 'Token刷新成功',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      },
      success: true,
      timestamp: Date.now()
    }
  },

  /**
   * 修改密码
   */
  async changePassword(data: { oldPassword: string; newPassword: string }) {
    await delay(600)
    
    const token = localStorage.getItem('mock_current_token')
    
    if (!token || !currentUser) {
      return {
        code: 401,
        message: 'Token无效或已过期',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    const user = mockUsers.find(u => u.id === currentUser!.id)
    if (!user || user.password !== data.oldPassword) {
      return {
        code: 400,
        message: '原密码错误',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    user.password = data.newPassword
    user.updatedAt = new Date().toISOString()
    
    return {
      code: 200,
      message: '密码修改成功',
      data: null,
      success: true,
      timestamp: Date.now()
    }
  },

  /**
   * 重置密码
   */
  async resetPassword(data: { email: string }) {
    await delay(1000)
    
    const user = mockUsers.find(u => u.email === data.email)
    
    if (!user) {
      return {
        code: 404,
        message: '邮箱地址不存在',
        data: null,
        success: false,
        timestamp: Date.now()
      }
    }
    
    console.log(`模拟发送密码重置邮件到: ${data.email}`)
    
    return {
      code: 200,
      message: '密码重置邮件已发送，请查收',
      data: null,
      success: true,
      timestamp: Date.now()
    }
  }
}

/**
 * 获取模拟用户列表（用于测试）
 */
export const getMockUsers = () => {
  return mockUsers.map(user => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  })
} 