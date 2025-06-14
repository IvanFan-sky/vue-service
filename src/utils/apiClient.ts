/**
 * 优化的 API 客户端
 * @description 提供请求去重、错误处理、重试机制等功能
 * @author 开发团队
 * @date 2024-12-14
 * @version 1.0.0
 */

import axios, { 
  type AxiosInstance, 
  type AxiosRequestConfig, 
  type AxiosResponse,
  type AxiosError 
} from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types'
import { API_CONFIG, STORAGE_KEYS, HTTP_STATUS } from '@/constants'
import { getTokenManager } from './tokenManager'

/**
 * 请求配置接口
 */
interface RequestConfig extends AxiosRequestConfig {
  /** 是否启用请求去重 */
  enableDedupe?: boolean
  /** 重试次数 */
  retryCount?: number
  /** 重试延迟（毫秒） */
  retryDelay?: number
  /** 是否显示错误消息 */
  showErrorMessage?: boolean
  /** 是否显示加载状态 */
  showLoading?: boolean
  /** 请求标识符 */
  requestId?: string
  /** 内部重试计数器 */
  _retryCount?: number
}

/**
 * 错误处理器
 */
class ErrorHandler {
  /**
   * 处理 HTTP 错误
   */
  handle(error: AxiosError<ApiResponse>): Promise<never> {
    let message = '请求失败'
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          message = '登录已过期，请重新登录'
          this.handleUnauthorized()
          break
          
        case HTTP_STATUS.FORBIDDEN:
          message = '没有权限访问该资源'
          break
          
        case HTTP_STATUS.NOT_FOUND:
          message = '请求的资源不存在'
          break
          
        case HTTP_STATUS.TOO_MANY_REQUESTS:
          message = '请求过于频繁，请稍后重试'
          break
          
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          message = '服务器内部错误，请稍后重试'
          break
          
        default:
          message = data?.message || `请求失败 (${status})`
      }
    } else if (error.request) {
      message = '网络连接失败，请检查网络设置'
    } else {
      message = error.message || '未知错误'
    }
    
    return Promise.reject(new Error(message))
  }
  
  /**
   * 处理未授权错误
   */
  private handleUnauthorized() {
    // 清除认证信息
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
    
    // 跳转到登录页
    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)
  }
}

/**
 * API 客户端类
 */
export class ApiClient {
  private readonly instance: AxiosInstance
  private readonly requestQueue = new Map<string, AbortController>()
  private readonly loadingRequests = new Set<string>()
  private readonly errorHandler = new ErrorHandler()

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS
    })
    
    this.setupInterceptors()
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      async (config) => {
        // 添加认证 token
        await this.addAuthToken(config)
        
        // 处理请求去重
        if ((config as RequestConfig).enableDedupe !== false) {
          this.handleRequestDedupe(config)
        }
        
        // 处理加载状态
        if ((config as RequestConfig).showLoading) {
          this.startLoading(config)
        }
        
        // 开发环境日志
        if (import.meta.env.DEV) {
          console.log('🚀 API请求:', {
            url: config.url,
            method: config.method,
            params: config.params,
            data: config.data
          })
        }
        
        return config
      },
      (error) => {
        console.error('❌ 请求拦截器错误:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const config = response.config as RequestConfig
        
        // 清理请求队列
        this.cleanupRequest(config)
        
        // 开发环境日志
        if (import.meta.env.DEV) {
          console.log('✅ API响应:', {
            url: response.config.url,
            status: response.status,
            data: response.data
          })
        }
        
        return response
      },
      async (error: AxiosError<ApiResponse>) => {
        const config = error.config as RequestConfig
        
        // 清理请求队列
        if (config) {
          this.cleanupRequest(config)
        }
        
        // 重试逻辑
        if (this.shouldRetry(error, config)) {
          return this.retryRequest(config)
        }
        
        // 错误处理
        const handledError = await this.errorHandler.handle(error)
        
        // 显示错误消息
        if (config?.showErrorMessage !== false) {
          ElMessage.error(handledError.message)
        }
        
        return Promise.reject(handledError)
      }
    )
  }

  /**
   * 添加认证 token
   */
  private async addAuthToken(config: AxiosRequestConfig) {
    try {
      const tokenManager = getTokenManager()
      const token = await tokenManager.getValidToken()
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.warn('获取Token失败:', error)
    }
  }

  /**
   * 处理请求去重
   */
  private handleRequestDedupe(config: AxiosRequestConfig) {
    const requestKey = this.generateRequestKey(config)
    
    // 取消重复请求
    if (this.requestQueue.has(requestKey)) {
      this.requestQueue.get(requestKey)?.abort()
    }
    
    // 创建新的控制器
    const controller = new AbortController()
    config.signal = controller.signal
    this.requestQueue.set(requestKey, controller)
  }

  /**
   * 生成请求键
   */
  private generateRequestKey(config: AxiosRequestConfig): string {
    const { method = 'GET', url = '', params, data } = config
    const paramStr = params ? JSON.stringify(params) : ''
    const dataStr = data ? JSON.stringify(data) : ''
    return btoa(`${method}_${url}_${paramStr}_${dataStr}`).replace(/[+/=]/g, '')
  }

  /**
   * 开始加载状态
   */
  private startLoading(config: AxiosRequestConfig) {
    const requestKey = this.generateRequestKey(config)
    this.loadingRequests.add(requestKey)
    
    // 这里可以集成全局加载状态管理
    // const uiStore = useUIStore()
    // uiStore.startLoading(requestKey)
  }

  /**
   * 清理请求
   */
  private cleanupRequest(config: AxiosRequestConfig) {
    const requestKey = this.generateRequestKey(config)
    
    // 清理请求队列
    this.requestQueue.delete(requestKey)
    
    // 清理加载状态
    if (this.loadingRequests.has(requestKey)) {
      this.loadingRequests.delete(requestKey)
      
      // 这里可以集成全局加载状态管理
      // const uiStore = useUIStore()
      // uiStore.stopLoading(requestKey)
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: AxiosError, config?: RequestConfig): boolean {
    if (!config || config.retryCount === 0) {
      return false
    }
    
    // 网络错误或服务器错误才重试
    const shouldRetryStatus = !error.response || 
      error.response.status >= 500 || 
      error.response.status === 408
    
    return shouldRetryStatus && (config._retryCount || 0) < (config.retryCount || 0)
  }

  /**
   * 重试请求
   */
  private async retryRequest(config: RequestConfig): Promise<AxiosResponse> {
    config._retryCount = (config._retryCount || 0) + 1
    
    // 重试延迟
    const delay = config.retryDelay || 1000 * config._retryCount
    await new Promise(resolve => setTimeout(resolve, delay))
    
    console.log(`正在重试请求 (${config._retryCount}/${config.retryCount}):`, config.url)
    
    return this.instance.request(config)
  }

  /**
   * 发送请求
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  /**
   * 取消所有请求
   */
  cancelAllRequests() {
    this.requestQueue.forEach(controller => controller.abort())
    this.requestQueue.clear()
    this.loadingRequests.clear()
  }

  /**
   * 取消特定请求
   */
  cancelRequest(requestKey: string) {
    const controller = this.requestQueue.get(requestKey)
    if (controller) {
      controller.abort()
      this.requestQueue.delete(requestKey)
    }
  }
}

// 创建默认实例
export const apiClient = new ApiClient()

// 导出默认方法（向后兼容）
export const { get, post, put, delete: del } = apiClient
