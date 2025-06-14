/**
 * 系统管理API接口
 * @description 提供系统配置、信息查询等功能
 * @author 开发团队
 * @date 2024-12-14
 * @version 1.0.0
 */

import { apiClient } from '@/utils/apiClient'
import {
  systemMockApi,
  configMockApi,
  logMockApi,
  testMockApi
} from '@/api/mock/systemMock'
import type {
  SystemInfo,
  SystemConfig,
  ConfigGroup,
  UpdateSystemConfigRequest,
  SystemLog,
  SystemLogQuery,
  SystemMonitor,
  EmailConfig,
  SmsConfig,
  StorageConfig,
  SecurityConfig
} from '@/types/system'

/**
 * 是否使用模拟数据
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取API模式
 */
const getApiMode = () => USE_MOCK ? 'mock' : 'real'

/**
 * 真实系统信息API
 */
const realSystemApi = {
  /**
   * 获取系统信息
   * @returns 系统信息
   */
  getInfo: async (): Promise<SystemInfo> => {
    const response = await apiClient.get('/api/system/info', {
      enableDedupe: true
    })
    return response.data
  },

  /**
   * 获取系统监控数据
   * @returns 监控数据
   */
  getMonitor: async (): Promise<SystemMonitor> => {
    const response = await apiClient.get('/api/system/monitor')
    return response.data
  },

  /**
   * 重启系统
   * @returns 重启结果
   */
  restart: async (): Promise<void> => {
    await apiClient.post(
      '/api/system/restart',
      {},
      {
        showLoading: true,
        timeout: 30000
      }
    )
  },

  /**
   * 清理缓存
   * @returns 清理结果
   */
  clearCache: async (): Promise<void> => {
    await apiClient.post(
      '/api/system/clear-cache',
      {},
      {
        showLoading: true
      }
    )
  },

  /**
   * 备份数据库
   * @returns 备份结果
   */
  backupDatabase: async (): Promise<{ filename: string; size: number }> => {
    const response = await apiClient.post(
      '/api/system/backup',
      {},
      {
        showLoading: true,
        timeout: 60000
      }
    )
    return response.data
  },

  /**
   * 恢复数据库
   * @param filename 备份文件名
   * @returns 恢复结果
   */
  restoreDatabase: async (filename: string): Promise<void> => {
    await apiClient.post(
      '/api/system/restore',
      { filename },
      {
        showLoading: true,
        timeout: 120000
      }
    )
  }
}

/**
 * 真实系统配置API
 */
const realConfigApi = {
  /**
   * 获取所有配置
   * @returns 配置列表
   */
  getAll: (): Promise<SystemConfig[]> =>
    apiClient.get('/api/system/configs', {
      enableDedupe: true
    }).then(res => res.data),

  /**
   * 按分组获取配置
   * @returns 配置分组
   */
  getGroups: (): Promise<ConfigGroup[]> =>
    apiClient.get('/api/system/config-groups', {
      enableDedupe: true
    }).then(res => res.data),

  /**
   * 获取指定分组的配置
   * @param group 分组名称
   * @returns 配置列表
   */
  getByGroup: (group: string): Promise<SystemConfig[]> =>
    apiClient.get(`/api/system/configs/${group}`, {
      enableDedupe: true
    }).then(res => res.data),

  /**
   * 获取单个配置
   * @param key 配置键
   * @returns 配置值
   */
  get: (key: string): Promise<string> => apiClient.get(`/api/system/config/${key}`).then(res => res.data),

  /**
   * 更新配置
   * @param data 配置数据
   * @returns 更新结果
   */
  update: (data: UpdateSystemConfigRequest): Promise<void> =>
    apiClient.post('/api/system/configs', data, {
      showLoading: true,
      retryCount: 2
    }).then(res => res.data),

  /**
   * 重置配置到默认值
   * @param keys 配置键列表
   * @returns 重置结果
   */
  reset: (keys: string[]): Promise<void> =>
    apiClient.post(
      '/api/system/configs/reset',
      { keys },
      {
        showLoading: true
      }
    ).then(res => res.data),

  /**
   * 导出配置
   * @returns 配置文件
   */
  export: (): Promise<Blob> =>
    apiClient.get('/api/system/configs/export', {
      responseType: 'blob'
    }).then(res => res.data),

  /**
   * 导入配置
   * @param file 配置文件
   * @returns 导入结果
   */
  import: (file: File): Promise<{ successCount: number; failureCount: number }> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/system/configs/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      showLoading: true
    }).then(res => res.data)
  }
}

/**
 * 真实系统日志API
 */
const realLogApi = {
  /**
   * 获取系统日志
   * @param params 查询参数
   * @returns 日志列表
   */
  getList: (
    params: SystemLogQuery
  ): Promise<{
    list: SystemLog[]
    total: number
    page: number
    pageSize: number
  }> => apiClient.get('/api/system/logs', { params }).then(res => res.data),

  /**
   * 清理日志
   * @param days 保留天数
   * @returns 清理结果
   */
  clear: (days: number): Promise<{ deletedCount: number }> =>
    apiClient.post(
      '/api/system/logs/clear',
      { days },
      {
        showLoading: true
      }
    ).then(res => res.data),

  /**
   * 导出日志
   * @param params 查询参数
   * @returns 日志文件
   */
  export: (params?: Partial<SystemLogQuery>): Promise<Blob> =>
    apiClient.get('/api/system/logs/export', {
      params,
      responseType: 'blob'
    }).then(res => res.data)
}

/**
 * 真实测试API
 */
const realTestApi = {
  /**
   * 测试邮件发送
   * @param config 邮件配置
   * @returns 测试结果
   */
  testEmail: (config: EmailConfig): Promise<{ success: boolean; message: string }> =>
    apiClient.post('/api/system/test-email', config, {
      showLoading: true,
      timeout: 30000
    }),

  /**
   * 测试短信发送
   * @param config 短信配置
   * @returns 测试结果
   */
  testSms: (config: SmsConfig): Promise<{ success: boolean; message: string }> =>
    apiClient.post('/api/system/test-sms', config, {
      showLoading: true,
      timeout: 30000
    }),

  /**
   * 测试存储连接
   * @param config 存储配置
   * @returns 测试结果
   */
  testStorage: (config: StorageConfig): Promise<{ success: boolean; message: string }> =>
    apiClient.post('/api/system/test-storage', config, {
      showLoading: true,
      timeout: 30000
    }),

  /**
   * 测试数据库连接
   * @returns 测试结果
   */
  testDatabase: (): Promise<{ success: boolean; message: string; version: string }> =>
    apiClient.get('/api/system/test-database', {
      showLoading: true
    }).then(res => res.data)
}

/**
 * 真实安全配置API
 */
const realSecurityApi = {
  /**
   * 获取安全配置
   * @returns 安全配置
   */
  getConfig: (): Promise<SecurityConfig> =>
    apiClient.get('/api/system/security', {
      enableDedupe: true
    }).then(res => res.data),

  /**
   * 更新安全配置
   * @param config 安全配置
   * @returns 更新结果
   */
  updateConfig: (config: SecurityConfig): Promise<void> =>
    apiClient.put('/api/system/security', config, {
      showLoading: true
    }).then(res => res.data),

  /**
   * 获取登录日志
   * @param params 查询参数
   * @returns 登录日志
   */
  getLoginLogs: (params: {
    page: number
    pageSize: number
    userId?: number
    startTime?: string
    endTime?: string
  }): Promise<{
    list: Array<{
      id: number
      userId: number
      username: string
      ip: string
      userAgent: string
      location: string
      status: 'success' | 'failure'
      loginTime: string
    }>
    total: number
  }> => apiClient.get('/api/system/login-logs', { params }).then(res => res.data)
}

/**
 * 导出系统管理API（根据环境选择真实或模拟）
 */
export const systemApi = USE_MOCK ? systemMockApi : realSystemApi

/**
 * 导出配置管理API（根据环境选择真实或模拟）
 */
export const configApi = USE_MOCK ? configMockApi : realConfigApi

/**
 * 导出日志管理API（根据环境选择真实或模拟）
 */
export const logApi = USE_MOCK ? logMockApi : realLogApi

/**
 * 导出测试API（根据环境选择真实或模拟）
 */
export const testApi = USE_MOCK ? testMockApi : realTestApi

/**
 * 导出安全配置API（暂时只有真实API）
 */
export const securityApi = realSecurityApi

/**
 * 打印当前API配置信息（仅开发环境）
 */
if (import.meta.env.DEV) {
  console.log(`🔧 系统API模式: ${getApiMode()}`)
  console.log(`🔧 配置API模式: ${getApiMode()}`)
  console.log(`🔧 日志API模式: ${getApiMode()}`)
  console.log(`🔧 测试API模式: ${getApiMode()}`)
}
