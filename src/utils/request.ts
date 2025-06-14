/**
 * HTTP请求工具模块
 * @description 基于axios封装的HTTP请求工具，包含请求/响应拦截器
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import axios, { type AxiosResponse, AxiosError, type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types'
import { API_CONFIG, STORAGE_KEYS, HTTP_STATUS } from '@/constants'
import { getTokenManager } from '@/utils/tokenManager'

/**
 * 创建axios实例
 * @description 配置基础URL、超时时间、默认请求头等
 */
const request = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
})

/**
 * 请求拦截器
 * @description 在请求发送前添加认证token、请求日志等
 */
request.interceptors.request.use(
  async config => {
    // 添加认证token
    try {
      const tokenManager = getTokenManager()
      const token = await tokenManager.getValidToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (_error) {
      // Token获取失败，可能需要重新登录
      console.warn('获取Token失败:', _error)
    }

    // 开发环境下打印请求信息
    if (import.meta.env.DEV) {
      console.log('🚀 请求发送:', {
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data
      })
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ 请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * @description 统一处理响应数据和错误状态
 */
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    // 开发环境下打印响应信息
    if (import.meta.env.DEV) {
      console.log('✅ 响应接收:', {
        url: response.config.url,
        status: response.status,
        data: data
      })
    }

    // 检查业务状态码
    if (data.success) {
      return response
    }

    // 业务错误处理
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error: AxiosError<ApiResponse>) => {
    console.error('❌ 响应错误:', error)

    // 处理HTTP错误状态码
    let message = '请求失败'

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          message = '登录已过期，请重新登录'
          // 清除认证信息
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER_INFO)
          // 跳转到登录页
          window.location.href = '/login'
          break

        case HTTP_STATUS.FORBIDDEN:
          message = '没有权限访问该资源'
          break

        case HTTP_STATUS.NOT_FOUND:
          message = '请求的资源不存在'
          break

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          message = '服务器内部错误，请稍后重试'
          break

        default:
          message = data?.message || `请求失败 (${status})`
      }
    } else if (error.request) {
      // 网络错误
      message = '网络连接失败，请检查网络设置'
    } else {
      // 其他错误
      message = error.message || '未知错误'
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

/**
 * GET请求方法
 * @param url 请求地址
 * @param config 请求配置
 * @returns Promise<ApiResponse>
 */
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return request.get(url, config)
}

/**
 * POST请求方法
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise<ApiResponse>
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request.post(url, data, config)
}

/**
 * PUT请求方法
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise<ApiResponse>
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return request.put(url, data, config)
}

/**
 * DELETE请求方法
 * @param url 请求地址
 * @param config 请求配置
 * @returns Promise<ApiResponse>
 */
export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return request.delete(url, config)
}

/**
 * 文件上传方法
 * @param url 上传地址
 * @param file 文件对象
 * @param onProgress 上传进度回调
 * @returns Promise<ApiResponse>
 */
export const upload = <T = any>(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<T>> => {
  const formData = new FormData()
  formData.append('file', file)

  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: progressEvent => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })
}

export default request
