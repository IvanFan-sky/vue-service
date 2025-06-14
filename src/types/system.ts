/**
 * 系统设置相关类型定义
 * @description 定义系统配置、设置项等类型
 * @author 开发团队
 * @date 2024-12-14
 * @version 1.0.0
 */

/**
 * 系统配置项类型
 */
export type ConfigType = 'string' | 'number' | 'boolean' | 'json' | 'file'

/**
 * 系统配置项
 */
export interface SystemConfig {
  /** 配置ID */
  id: number
  /** 配置键 */
  key: string
  /** 配置值 */
  value: string
  /** 配置名称 */
  name: string
  /** 配置描述 */
  description?: string
  /** 配置类型 */
  type: ConfigType
  /** 配置分组 */
  group: string
  /** 是否为系统配置 */
  isSystem: boolean
  /** 是否启用 */
  enabled: boolean
  /** 排序 */
  sort: number
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 系统配置分组
 */
export interface ConfigGroup {
  /** 分组键 */
  key: string
  /** 分组名称 */
  name: string
  /** 分组描述 */
  description?: string
  /** 分组图标 */
  icon?: string
  /** 配置项列表 */
  configs: SystemConfig[]
}

/**
 * 系统信息
 */
export interface SystemInfo {
  /** 系统名称 */
  name: string
  /** 系统版本 */
  version: string
  /** 系统描述 */
  description: string
  /** 系统作者 */
  author: string
  /** 系统官网 */
  website?: string
  /** 系统Logo */
  logo?: string
  /** 构建时间 */
  buildTime: string
  /** 运行环境 */
  environment: string
  /** 服务器信息 */
  server: {
    /** 操作系统 */
    os: string
    /** CPU信息 */
    cpu: string
    /** 内存信息 */
    memory: string
    /** 磁盘信息 */
    disk: string
    /** 运行时间 */
    uptime: string
  }
  /** 数据库信息 */
  database: {
    /** 数据库类型 */
    type: string
    /** 数据库版本 */
    version: string
    /** 数据库大小 */
    size: string
  }
}

/**
 * 邮件配置
 */
export interface EmailConfig {
  /** SMTP服务器 */
  host: string
  /** SMTP端口 */
  port: number
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 是否启用SSL */
  ssl: boolean
  /** 发件人邮箱 */
  fromEmail: string
  /** 发件人名称 */
  fromName: string
}

/**
 * 短信配置
 */
export interface SmsConfig {
  /** 服务商 */
  provider: 'aliyun' | 'tencent' | 'huawei'
  /** AccessKey */
  accessKey: string
  /** SecretKey */
  secretKey: string
  /** 签名 */
  signature: string
  /** 模板ID */
  templateId: string
}

/**
 * 存储配置
 */
export interface StorageConfig {
  /** 存储类型 */
  type: 'local' | 'oss' | 'cos' | 'qiniu'
  /** 存储路径 */
  path: string
  /** 访问域名 */
  domain: string
  /** 配置参数 */
  config: Record<string, any>
}

/**
 * 安全配置
 */
export interface SecurityConfig {
  /** 密码最小长度 */
  passwordMinLength: number
  /** 密码复杂度要求 */
  passwordComplexity: boolean
  /** 登录失败锁定次数 */
  loginFailLockCount: number
  /** 登录失败锁定时间（分钟） */
  loginFailLockTime: number
  /** 会话超时时间（分钟） */
  sessionTimeout: number
  /** 是否启用验证码 */
  enableCaptcha: boolean
  /** 是否启用双因子认证 */
  enableTwoFactor: boolean
}

/**
 * 系统设置更新请求
 */
export interface UpdateSystemConfigRequest {
  /** 配置项列表 */
  configs: Array<{
    key: string
    value: string
  }>
}

/**
 * 系统日志
 */
export interface SystemLog {
  /** 日志ID */
  id: number
  /** 日志类型 */
  type: 'info' | 'warn' | 'error' | 'debug'
  /** 日志标题 */
  title: string
  /** 日志内容 */
  content: string
  /** 操作用户 */
  userId?: number
  /** 用户名 */
  username?: string
  /** IP地址 */
  ip: string
  /** 用户代理 */
  userAgent: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 系统日志查询参数
 */
export interface SystemLogQuery {
  /** 页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 日志类型 */
  type?: string
  /** 搜索关键词 */
  keyword?: string
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 用户ID */
  userId?: number
}

/**
 * 系统监控数据
 */
export interface SystemMonitor {
  /** CPU使用率 */
  cpuUsage: number
  /** 内存使用率 */
  memoryUsage: number
  /** 磁盘使用率 */
  diskUsage: number
  /** 网络IO */
  networkIO: {
    /** 入站流量 */
    inbound: number
    /** 出站流量 */
    outbound: number
  }
  /** 在线用户数 */
  onlineUsers: number
  /** 今日访问量 */
  todayVisits: number
  /** 系统负载 */
  systemLoad: number[]
}
