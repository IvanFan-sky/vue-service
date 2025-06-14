import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import type { User, LoginForm, UserRole } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<User | null>(null)
  const loading = ref<boolean>(false)

  // 初始化时从localStorage恢复用户信息
  const initUserFromStorage = () => {
    // 尝试从主要存储键恢复token
    let storedToken = localStorage.getItem('token')
    if (!storedToken) {
      // 兼容旧的存储键
      storedToken = localStorage.getItem('access_token')
    }

    if (storedToken) {
      token.value = storedToken
    }

    // 尝试从主要存储键恢复用户信息
    let savedUser = localStorage.getItem('user')
    if (!savedUser) {
      // 兼容旧的存储键
      savedUser = localStorage.getItem('user_info')
    }

    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        // 清除无效的用户信息
        localStorage.removeItem('user')
        localStorage.removeItem('user_info')
      }
    }
  }

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRoles = computed(() => user.value?.roles || [])

  // 登录
  const login = async (username: string, password: string) => {
    loading.value = true
    try {
      const loginForm: LoginForm = { username, password }
      const response = await authApi.login(loginForm)

      if (response.code === 200 && response.data) {
        token.value = response.data.token
        user.value = response.data.user
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(new Error(response.message))
      }
    } catch (error) {
      return Promise.reject(error)
    } finally {
      loading.value = false
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) {return}

    try {
      const response = await authApi.getUserInfo()
      if (response.code === 200 && response.data) {
        user.value = response.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    }
  }

  // 登出
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      // 清除所有认证相关状态
      token.value = ''
      user.value = null

      // 清除localStorage中的认证信息
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // 清除可能存在的其他认证键（兼容性处理）
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('mock_current_token')
    }
  }

  // 检查权限
  const hasRole = (role: UserRole) => {
    return userRoles.value.includes(role)
  }

  // 检查多个权限（需要全部满足）
  const hasAllRoles = (roles: UserRole[]) => {
    return roles.every(role => userRoles.value.includes(role))
  }

  // 检查多个权限（满足其中一个即可）
  const hasAnyRole = (roles: UserRole[]) => {
    return roles.some(role => userRoles.value.includes(role))
  }

  // 初始化
  initUserFromStorage()

  return {
    // 状态
    token,
    user,
    loading,
    // 计算属性
    isAuthenticated,
    userRoles,
    // 方法
    login,
    logout,
    fetchUserInfo,
    hasRole,
    hasAllRoles,
    hasAnyRole
  }
})
