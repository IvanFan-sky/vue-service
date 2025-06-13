/**
 * 项目类型定义文件
 * @description 包含项目中所有的TypeScript类型定义
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

/**
 * 用户信息接口
 */
export interface User {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 邮箱地址，可选 */
  email?: string
  /** 手机号，可选 */
  phone?: string
  /** 头像URL，可选 */
  avatar?: string
  /** 用户角色 */
  role?: UserRole
  /** 用户角色列表 */
  roles?: UserRole[]
  /** 用户权限列表 */
  permissions?: string[]
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
  /** 最后登录时间 */
  lastLoginTime?: string
  /** 用户状态 */
  status: UserStatus
}

/**
 * 用户角色枚举
 * - admin: 管理员，拥有所有权限
 * - user: 普通用户，基础权限
 * - guest: 访客，只读权限
 */
export type UserRole = 'admin' | 'user' | 'guest'

/**
 * 用户状态枚举
 */
export const UserStatus = {
  /** 激活状态 */
  ACTIVE: 1,
  /** 禁用状态 */
  DISABLED: 0,
  /** 待审核状态 */
  PENDING: 2
} as const

export type UserStatus = typeof UserStatus[keyof typeof UserStatus]

/**
 * 登录表单接口
 */
export interface LoginForm {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 是否记住登录状态 */
  rememberMe?: boolean
  /** 验证码，可选 */
  captcha?: string
}

/**
 * API响应基础接口
 * @template T 响应数据类型
 */
export interface ApiResponse<T = any> {
  /** 响应状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
  /** 请求是否成功 */
  success: boolean
  /** 响应时间戳 */
  timestamp: number
}

/**
 * 分页查询参数接口
 */
export interface PageQuery {
  /** 页码，从1开始 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 搜索关键词，可选 */
  keyword?: string
}

/**
 * 分页数据接口
 * @template T 列表项数据类型
 */
export interface PageData<T = any> {
  /** 数据列表 */
  list: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/**
 * 路由元信息接口
 */
export interface RouteMeta extends Record<string | number | symbol, unknown> {
  /** 页面标题 */
  title?: string
  /** 页面图标 */
  icon?: string
  /** 是否需要认证 */
  requireAuth?: boolean
  /** 是否缓存页面 */
  keepAlive?: boolean
  /** 是否在菜单中隐藏 */
  hidden?: boolean
  /** 页面权限 */
  permissions?: string[]
  /** 面包屑导航 */
  breadcrumb?: Array<{
    title: string
    path: string
  }>
} 