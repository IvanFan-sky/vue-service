/**
 * 系统管理模拟数据生成器
 * @description 使用faker.js生成真实的系统配置和监控数据
 * @author 开发团队
 * @date 2024-12-14
 * @version 1.0.0
 */

import { faker } from '@faker-js/faker'
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
  StorageConfig
  // SecurityConfig
} from '@/types/system'

/**
 * 模拟延迟函数
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 系统信息
 */
const mockSystemInfo: SystemInfo = {
  name: 'Vue Service',
  version: '1.0.0',
  description: 'Vue3 + TypeScript 前端管理系统',
  author: '开发团队',
  website: 'https://github.com/vue-service',
  logo: '/logo.png',
  buildTime: '2024-12-14 10:00:00',
  environment: 'development',
  server: {
    os: 'Windows 11 Pro',
    cpu: 'Intel Core i7-12700K @ 3.60GHz',
    memory: '32GB DDR4',
    disk: '1TB NVMe SSD',
    uptime: '7天 12小时 30分钟'
  },
  database: {
    type: 'MySQL',
    version: '8.0.35',
    size: '256MB'
  }
}

/**
 * 系统配置数据
 */
const mockConfigs: SystemConfig[] = [
  // 基本设置
  {
    id: 1,
    key: 'siteTitle',
    value: 'Vue Service',
    name: '网站标题',
    description: '网站的标题',
    type: 'string',
    group: 'basic',
    isSystem: false,
    enabled: true,
    sort: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    key: 'siteDescription',
    value: 'Vue3 + TypeScript 前端管理系统',
    name: '网站描述',
    description: '网站的描述信息',
    type: 'string',
    group: 'basic',
    isSystem: false,
    enabled: true,
    sort: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    key: 'siteKeywords',
    value: 'Vue3,TypeScript,前端,管理系统',
    name: '网站关键词',
    description: '网站的关键词',
    type: 'string',
    group: 'basic',
    isSystem: false,
    enabled: true,
    sort: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    key: 'siteLogo',
    value: '/logo.png',
    name: '网站Logo',
    description: '网站的Logo图片',
    type: 'file',
    group: 'basic',
    isSystem: false,
    enabled: true,
    sort: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    key: 'icp',
    value: '',
    name: '备案号',
    description: 'ICP备案号',
    type: 'string',
    group: 'basic',
    isSystem: false,
    enabled: true,
    sort: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    key: 'copyright',
    value: '© 2024 Vue Service. All rights reserved.',
    name: '版权信息',
    description: '网站版权信息',
    type: 'string',
    group: 'basic',
    isSystem: false,
    enabled: true,
    sort: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 邮件设置
  {
    id: 10,
    key: 'emailHost',
    value: 'smtp.qq.com',
    name: 'SMTP服务器',
    description: '邮件服务器地址',
    type: 'string',
    group: 'email',
    isSystem: false,
    enabled: true,
    sort: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 11,
    key: 'emailPort',
    value: '587',
    name: 'SMTP端口',
    description: '邮件服务器端口',
    type: 'number',
    group: 'email',
    isSystem: false,
    enabled: true,
    sort: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 12,
    key: 'emailUsername',
    value: '',
    name: '邮箱用户名',
    description: '发送邮件的用户名',
    type: 'string',
    group: 'email',
    isSystem: false,
    enabled: true,
    sort: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 13,
    key: 'emailPassword',
    value: '',
    name: '邮箱密码',
    description: '发送邮件的密码',
    type: 'string',
    group: 'email',
    isSystem: false,
    enabled: true,
    sort: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 14,
    key: 'emailSsl',
    value: 'true',
    name: '启用SSL',
    description: '是否启用SSL加密',
    type: 'boolean',
    group: 'email',
    isSystem: false,
    enabled: true,
    sort: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 15,
    key: 'emailFromEmail',
    value: '',
    name: '发件人邮箱',
    description: '发件人邮箱地址',
    type: 'string',
    group: 'email',
    isSystem: false,
    enabled: true,
    sort: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 16,
    key: 'emailFromName',
    value: 'Vue Service',
    name: '发件人名称',
    description: '发件人显示名称',
    type: 'string',
    group: 'email',
    isSystem: false,
    enabled: true,
    sort: 7,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 安全设置
  {
    id: 20,
    key: 'passwordMinLength',
    value: '8',
    name: '密码最小长度',
    description: '用户密码最小长度',
    type: 'number',
    group: 'security',
    isSystem: false,
    enabled: true,
    sort: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 21,
    key: 'passwordComplexity',
    value: 'true',
    name: '密码复杂度要求',
    description: '是否要求密码包含大小写字母、数字和特殊字符',
    type: 'boolean',
    group: 'security',
    isSystem: false,
    enabled: true,
    sort: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 22,
    key: 'loginFailLockCount',
    value: '5',
    name: '登录失败锁定次数',
    description: '连续登录失败多少次后锁定账户',
    type: 'number',
    group: 'security',
    isSystem: false,
    enabled: true,
    sort: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 23,
    key: 'loginFailLockTime',
    value: '30',
    name: '锁定时间（分钟）',
    description: '账户锁定时间',
    type: 'number',
    group: 'security',
    isSystem: false,
    enabled: true,
    sort: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 24,
    key: 'sessionTimeout',
    value: '120',
    name: '会话超时（分钟）',
    description: '用户会话超时时间',
    type: 'number',
    group: 'security',
    isSystem: false,
    enabled: true,
    sort: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 25,
    key: 'enableCaptcha',
    value: 'true',
    name: '启用验证码',
    description: '登录时是否需要验证码',
    type: 'boolean',
    group: 'security',
    isSystem: false,
    enabled: true,
    sort: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 26,
    key: 'enableTwoFactor',
    value: 'false',
    name: '启用双因子认证',
    description: '是否启用双因子认证',
    type: 'boolean',
    group: 'security',
    isSystem: false,
    enabled: true,
    sort: 7,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 存储设置
  {
    id: 30,
    key: 'storageType',
    value: 'local',
    name: '存储类型',
    description: '文件存储类型',
    type: 'string',
    group: 'storage',
    isSystem: false,
    enabled: true,
    sort: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 31,
    key: 'storagePath',
    value: '/uploads',
    name: '存储路径',
    description: '本地存储路径',
    type: 'string',
    group: 'storage',
    isSystem: false,
    enabled: true,
    sort: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 32,
    key: 'storageDomain',
    value: '',
    name: '访问域名',
    description: '文件访问域名',
    type: 'string',
    group: 'storage',
    isSystem: false,
    enabled: true,
    sort: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 33,
    key: 'storageConfig',
    value: '{}',
    name: '存储配置',
    description: '存储服务配置参数',
    type: 'json',
    group: 'storage',
    isSystem: false,
    enabled: true,
    sort: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

/**
 * 生成系统日志
 */
function generateSystemLogs(count: number): SystemLog[] {
  const logTypes = ['info', 'warn', 'error', 'debug'] as const
  const logTitles = [
    '用户登录',
    '用户登出',
    '创建用户',
    '删除用户',
    '修改配置',
    '系统启动',
    '系统关闭',
    '数据备份',
    '数据恢复',
    '清理缓存'
  ]

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    type: faker.helpers.arrayElement(logTypes),
    title: faker.helpers.arrayElement(logTitles),
    content: faker.lorem.sentence(),
    userId: Math.random() > 0.3 ? faker.number.int({ min: 1, max: 100 }) : undefined,
    username: Math.random() > 0.3 ? faker.internet.displayName() : undefined,
    ip: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    createdAt: faker.date.recent({ days: 30 }).toISOString()
  }))
}

// 生成模拟日志数据
const mockLogs = generateSystemLogs(1000)

/**
 * 系统管理模拟API
 */
export const systemMockApi = {
  /**
   * 获取系统信息
   */
  getInfo: async (): Promise<SystemInfo> => {
    await delay(300)
    return mockSystemInfo
  },

  /**
   * 获取系统监控数据
   */
  getMonitor: async (): Promise<SystemMonitor> => {
    await delay(500)

    return {
      cpuUsage: faker.number.float({ min: 10, max: 80, fractionDigits: 1 }),
      memoryUsage: faker.number.float({ min: 30, max: 90, fractionDigits: 1 }),
      diskUsage: faker.number.float({ min: 20, max: 70, fractionDigits: 1 }),
      networkIO: {
        inbound: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
        outbound: faker.number.float({ min: 1, max: 50, fractionDigits: 2 })
      },
      onlineUsers: faker.number.int({ min: 10, max: 100 }),
      todayVisits: faker.number.int({ min: 100, max: 1000 }),
      systemLoad: [
        faker.number.float({ min: 0.1, max: 2.0, fractionDigits: 2 }),
        faker.number.float({ min: 0.1, max: 2.0, fractionDigits: 2 }),
        faker.number.float({ min: 0.1, max: 2.0, fractionDigits: 2 })
      ]
    }
  },

  /**
   * 重启系统
   */
  restart: async (): Promise<void> => {
    await delay(2000)
    console.log('模拟系统重启...')
  },

  /**
   * 清理缓存
   */
  clearCache: async (): Promise<void> => {
    await delay(1000)
    console.log('模拟清理缓存...')
  },

  /**
   * 备份数据库
   */
  backupDatabase: async (): Promise<{ filename: string; size: number }> => {
    await delay(3000)

    const filename = `backup_${new Date().toISOString().slice(0, 10)}_${Date.now()}.sql`
    const size = faker.number.int({ min: 1024 * 1024, max: 100 * 1024 * 1024 }) // 1MB - 100MB

    return { filename, size }
  },

  /**
   * 恢复数据库
   */
  restoreDatabase: async (filename: string): Promise<void> => {
    await delay(5000)
    console.log(`模拟恢复数据库: ${filename}`)
  }
}

/**
 * 配置管理模拟API
 */
export const configMockApi = {
  /**
   * 获取所有配置
   */
  getAll: async (): Promise<SystemConfig[]> => {
    await delay(300)
    return mockConfigs
  },

  /**
   * 按分组获取配置
   */
  getGroups: async (): Promise<ConfigGroup[]> => {
    await delay(300)

    const groups = ['basic', 'email', 'security', 'storage']
    const groupNames = {
      basic: '基本设置',
      email: '邮件设置',
      security: '安全设置',
      storage: '存储设置'
    }

    return groups.map(group => ({
      key: group,
      name: groupNames[group as keyof typeof groupNames],
      description: `${groupNames[group as keyof typeof groupNames]}相关配置`,
      icon: group,
      configs: mockConfigs.filter(config => config.group === group)
    }))
  },

  /**
   * 获取指定分组的配置
   */
  getByGroup: async (group: string): Promise<SystemConfig[]> => {
    await delay(200)
    return mockConfigs.filter(config => config.group === group)
  },

  /**
   * 获取单个配置
   */
  get: async (key: string): Promise<string> => {
    await delay(100)

    const config = mockConfigs.find(c => c.key === key)
    if (!config) {
      throw new Error('配置不存在')
    }

    return config.value
  },

  /**
   * 更新配置
   */
  update: async (data: UpdateSystemConfigRequest): Promise<void> => {
    await delay(500)

    data.configs.forEach(({ key, value }) => {
      const configIndex = mockConfigs.findIndex(c => c.key === key)
      if (configIndex !== -1) {
        mockConfigs[configIndex] = {
          ...mockConfigs[configIndex],
          value,
          updatedAt: new Date().toISOString()
        }
      }
    })
  },

  /**
   * 重置配置到默认值
   */
  reset: async (keys: string[]): Promise<void> => {
    await delay(300)
    console.log(`模拟重置配置: ${keys.join(', ')}`)
  },

  /**
   * 导出配置
   */
  export: async (): Promise<Blob> => {
    await delay(1000)

    const configData = JSON.stringify(mockConfigs, null, 2)
    return new Blob([configData], { type: 'application/json' })
  },

  /**
   * 导入配置
   */
  import: async (_file: File): Promise<{ successCount: number; failureCount: number }> => {
    await delay(2000)

    // 模拟导入结果
    const successCount = faker.number.int({ min: 10, max: 30 })
    const failureCount = faker.number.int({ min: 0, max: 5 })

    return { successCount, failureCount }
  }
}

/**
 * 日志管理模拟API
 */
export const logMockApi = {
  /**
   * 获取系统日志
   */
  getList: async (
    params: SystemLogQuery
  ): Promise<{
    list: SystemLog[]
    total: number
    page: number
    pageSize: number
  }> => {
    await delay(300)

    let filteredLogs = [...mockLogs]

    // 类型筛选
    if (params.type) {
      filteredLogs = filteredLogs.filter(log => log.type === params.type)
    }

    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredLogs = filteredLogs.filter(
        log =>
          log.title.toLowerCase().includes(keyword) ||
          log.content.toLowerCase().includes(keyword) ||
          log.username?.toLowerCase().includes(keyword)
      )
    }

    // 时间范围筛选
    if (params.startTime) {
      filteredLogs = filteredLogs.filter(log => log.createdAt >= params.startTime!)
    }
    if (params.endTime) {
      filteredLogs = filteredLogs.filter(log => log.createdAt <= params.endTime!)
    }

    // 用户筛选
    if (params.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === params.userId)
    }

    // 排序（按时间倒序）
    filteredLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // 分页
    const total = filteredLogs.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredLogs.slice(start, end)

    return {
      list,
      total,
      page: params.page,
      pageSize: params.pageSize
    }
  },

  /**
   * 清理日志
   */
  clear: async (days: number): Promise<{ deletedCount: number }> => {
    await delay(1000)

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const deletedCount = mockLogs.filter(log => new Date(log.createdAt) < cutoffDate).length

    return { deletedCount }
  },

  /**
   * 导出日志
   */
  export: async (_params?: Partial<SystemLogQuery>): Promise<Blob> => {
    await delay(2000)

    const logData = JSON.stringify(mockLogs, null, 2)
    return new Blob([logData], { type: 'application/json' })
  }
}

/**
 * 测试API模拟
 */
export const testMockApi = {
  /**
   * 测试邮件发送
   */
  testEmail: async (_config: EmailConfig): Promise<{ success: boolean; message: string }> => {
    await delay(2000)

    // 模拟测试结果
    const success = Math.random() > 0.2 // 80% 成功率

    return {
      success,
      message: success ? '邮件发送测试成功' : '邮件发送测试失败：SMTP服务器连接超时'
    }
  },

  /**
   * 测试短信发送
   */
  testSms: async (_config: SmsConfig): Promise<{ success: boolean; message: string }> => {
    await delay(1500)

    const success = Math.random() > 0.3 // 70% 成功率

    return {
      success,
      message: success ? '短信发送测试成功' : '短信发送测试失败：AccessKey无效'
    }
  },

  /**
   * 测试存储连接
   */
  testStorage: async (_config: StorageConfig): Promise<{ success: boolean; message: string }> => {
    await delay(1000)

    const success = Math.random() > 0.1 // 90% 成功率

    return {
      success,
      message: success ? '存储连接测试成功' : '存储连接测试失败：无法连接到存储服务'
    }
  },

  /**
   * 测试数据库连接
   */
  testDatabase: async (): Promise<{ success: boolean; message: string; version: string }> => {
    await delay(800)

    return {
      success: true,
      message: '数据库连接正常',
      version: '8.0.35'
    }
  }
}
