/**
 * 项目常量定义文件
 * @description 包含项目中所有的常量定义
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

/**
 * API配置常量
 */
export const API_CONFIG = {
  /** API基础URL */
  BASE_URL: import.meta.env['VITE_API_BASE_URL'] || 'http://localhost:3000',
  /** 请求超时时间（毫秒） */
  TIMEOUT: 10000,
  /** 重试次数 */
  RETRY_COUNT: 3,
  /** 请求头配置 */
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
} as const

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  /** 访问令牌 */
  ACCESS_TOKEN: 'access_token',
  /** 刷新令牌 */
  REFRESH_TOKEN: 'refresh_token',
  /** 用户信息 */
  USER_INFO: 'user_info',
  /** 语言设置 */
  LANGUAGE: 'language',
  /** 主题设置 */
  THEME: 'theme',
  /** 侧边栏折叠状态 */
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
} as const

/**
 * 路由路径常量
 */
export const ROUTE_PATHS = {
  /** 首页 */
  HOME: '/',
  /** 登录页 */
  LOGIN: '/login',
  /** 注册页 */
  REGISTER: '/register',
  /** 仪表盘 */
  DASHBOARD: '/dashboard',
  /** 用户管理 */
  USER_MANAGEMENT: '/user',
  /** 404页面 */
  NOT_FOUND: '/404'
} as const

/**
 * HTTP状态码常量
 */
export const HTTP_STATUS = {
  /** 请求成功 */
  OK: 200,
  /** 创建成功 */
  CREATED: 201,
  /** 无内容 */
  NO_CONTENT: 204,
  /** 请求错误 */
  BAD_REQUEST: 400,
  /** 未授权 */
  UNAUTHORIZED: 401,
  /** 禁止访问 */
  FORBIDDEN: 403,
  /** 资源未找到 */
  NOT_FOUND: 404,
  /** 服务器错误 */
  INTERNAL_SERVER_ERROR: 500
} as const

/**
 * 消息类型常量
 */
export const MESSAGE_TYPES = {
  /** 成功消息 */
  SUCCESS: 'success',
  /** 警告消息 */
  WARNING: 'warning',
  /** 错误消息 */
  ERROR: 'error',
  /** 信息消息 */
  INFO: 'info'
} as const

/**
 * 分页配置常量
 */
export const PAGINATION = {
  /** 默认页码 */
  DEFAULT_PAGE: 1,
  /** 默认每页数量 */
  DEFAULT_PAGE_SIZE: 10,
  /** 每页数量选项 */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  /** 最大每页数量 */
  MAX_PAGE_SIZE: 1000
} as const

/**
 * 表单验证规则常量
 */
export const VALIDATION_RULES = {
  /** 用户名规则 */
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  /** 密码规则 */
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 20,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/
  },
  /** 邮箱规则 */
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  /** 手机号规则 */
  PHONE: {
    PATTERN: /^1[3-9]\d{9}$/
  }
} as const

/**
 * 文件上传配置常量
 */
export const UPLOAD_CONFIG = {
  /** 最大文件大小（MB） */
  MAX_FILE_SIZE: 10,
  /** 允许的图片格式 */
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  /** 允许的文档格式 */
  DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
} as const

/**
 * 主题配置常量
 */
export const THEME_CONFIG = {
  /** 浅色主题 */
  LIGHT: 'light',
  /** 深色主题 */
  DARK: 'dark',
  /** 自动主题 */
  AUTO: 'auto'
} as const

/**
 * 语言配置常量
 */
export const LANGUAGE_CONFIG = {
  /** 中文 */
  ZH_CN: 'zh-cn',
  /** 英文 */
  EN_US: 'en-us'
} as const
