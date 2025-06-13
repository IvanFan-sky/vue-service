/**
 * 用户管理相关类型定义
 * @description 定义用户数据结构、查询参数、表单数据等类型
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

/**
 * 用户状态枚举
 */
export enum UserStatus {
  /** 激活状态 */
  ACTIVE = 1,
  /** 禁用状态 */
  DISABLED = 0,
  /** 待审核状态 */
  PENDING = 2
}

/**
 * 用户角色类型
 */
export type UserRole = 'admin' | 'user' | 'guest'

/**
 * 用户性别类型
 */
export type UserGender = 'male' | 'female' | 'other'

/**
 * 用户信息接口
 */
export interface User {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 真实姓名 */
  realName: string
  /** 邮箱地址 */
  email: string
  /** 手机号码 */
  phone: string
  /** 头像URL */
  avatar?: string
  /** 用户角色 */
  role: UserRole
  /** 用户状态 */
  status: UserStatus
  /** 性别 */
  gender: UserGender
  /** 年龄 */
  age: number
  /** 部门 */
  department: string
  /** 职位 */
  position: string
  /** 地址 */
  address: string
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 最后登录时间 */
  lastLoginTime?: string
  /** 登录次数 */
  loginCount: number
}

/**
 * 用户列表查询参数
 */
export interface UserListQuery {
  /** 页码，从1开始 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 搜索关键词 */
  keyword?: string
  /** 用户角色筛选 */
  role?: UserRole
  /** 用户状态筛选 */
  status?: UserStatus
  /** 性别筛选 */
  gender?: UserGender
  /** 部门筛选 */
  department?: string
  /** 创建时间范围 - 开始时间 */
  startDate?: string
  /** 创建时间范围 - 结束时间 */
  endDate?: string
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 用户列表响应数据
 */
export interface UserListResult {
  /** 用户列表 */
  list: User[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/**
 * 创建用户请求数据
 */
export interface CreateUserRequest {
  /** 用户名 */
  username: string
  /** 真实姓名 */
  realName: string
  /** 邮箱地址 */
  email: string
  /** 手机号码 */
  phone: string
  /** 密码 */
  password: string
  /** 确认密码 */
  confirmPassword: string
  /** 用户角色 */
  role: UserRole
  /** 用户状态 */
  status: UserStatus
  /** 性别 */
  gender: UserGender
  /** 年龄 */
  age: number
  /** 部门 */
  department: string
  /** 职位 */
  position: string
  /** 地址 */
  address: string
  /** 头像URL */
  avatar?: string
  /** 备注 */
  remark?: string
}

/**
 * 更新用户请求数据
 */
export interface UpdateUserRequest {
  /** 真实姓名 */
  realName?: string
  /** 邮箱地址 */
  email?: string
  /** 手机号码 */
  phone?: string
  /** 用户角色 */
  role?: UserRole
  /** 用户状态 */
  status?: UserStatus
  /** 性别 */
  gender?: UserGender
  /** 年龄 */
  age?: number
  /** 部门 */
  department?: string
  /** 职位 */
  position?: string
  /** 地址 */
  address?: string
  /** 头像URL */
  avatar?: string
  /** 备注 */
  remark?: string
}

/**
 * 批量操作请求数据
 */
export interface BatchOperationRequest {
  /** 用户ID列表 */
  ids: number[]
  /** 操作类型 */
  action: 'delete' | 'enable' | 'disable' | 'export'
}

/**
 * 用户导入数据
 */
export interface UserImportData {
  /** 用户名 */
  username: string
  /** 真实姓名 */
  realName: string
  /** 邮箱地址 */
  email: string
  /** 手机号码 */
  phone: string
  /** 用户角色 */
  role: string
  /** 性别 */
  gender: string
  /** 年龄 */
  age: number | string
  /** 部门 */
  department: string
  /** 职位 */
  position: string
  /** 地址 */
  address: string
  /** 备注 */
  remark?: string
}

/**
 * 用户导入结果
 */
export interface UserImportResult {
  /** 导入成功数量 */
  successCount: number
  /** 导入失败数量 */
  failureCount: number
  /** 失败详情 */
  failures: Array<{
    row: number
    data: UserImportData
    error: string
  }>
  /** 导入的用户列表 */
  users: User[]
}

/**
 * 用户统计数据
 */
export interface UserStatistics {
  /** 总用户数 */
  totalUsers: number
  /** 活跃用户数 */
  activeUsers: number
  /** 今日新增用户数 */
  todayNewUsers: number
  /** 本月新增用户数 */
  monthNewUsers: number
  /** 角色分布 */
  roleDistribution: Record<UserRole, number>
  /** 状态分布 */
  statusDistribution: Record<UserStatus, number>
  /** 部门分布 */
  departmentDistribution: Record<string, number>
}

/**
 * 用户表单验证规则
 */
export interface UserFormRules {
  username: Array<{
    required?: boolean
    message: string
    trigger?: string
    min?: number
    max?: number
    pattern?: RegExp
  }>
  realName: Array<{
    required?: boolean
    message: string
    trigger?: string
    min?: number
    max?: number
  }>
  email: Array<{
    required?: boolean
    message: string
    trigger?: string
    type?: string
  }>
  phone: Array<{
    required?: boolean
    message: string
    trigger?: string
    pattern?: RegExp
  }>
  password: Array<{
    required?: boolean
    message: string
    trigger?: string
    min?: number
    max?: number
  }>
  confirmPassword: Array<{
    required?: boolean
    message: string
    trigger?: string
    validator?: (rule: any, value: any, callback: any) => void
  }>
} 