/**
 * API相关类型定义
 * @description 定义API响应、请求、错误等通用类型
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

/**
 * API响应基础结构
 */
export interface ApiResponse<T = any> {
  /** 响应状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
  /** 时间戳 */
  timestamp: number
  /** 请求ID */
  requestId?: string
}

/**
 * 分页响应数据
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  list: T[]
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
 * API错误信息
 */
export interface ApiError {
  /** 错误码 */
  code: number
  /** 错误消息 */
  message: string
  /** 错误详情 */
  details?: Record<string, any>
  /** 错误堆栈（开发环境） */
  stack?: string
}

/**
 * 分页查询基础参数
 */
export interface PaginationQuery {
  /** 页码，从1开始 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 排序参数
 */
export interface SortQuery {
  /** 排序字段 */
  sortField?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/**
 * 时间范围查询参数
 */
export interface DateRangeQuery {
  /** 开始时间 */
  startDate?: string
  /** 结束时间 */
  endDate?: string
}

/**
 * 基础查询参数
 */
export interface BaseQuery extends PaginationQuery, SortQuery, DateRangeQuery {
  /** 搜索关键词 */
  keyword?: string
}

/**
 * 文件上传响应
 */
export interface UploadResponse {
  /** 文件URL */
  url: string
  /** 文件名 */
  filename: string
  /** 文件大小 */
  size: number
  /** 文件类型 */
  type: string
}

/**
 * 批量操作响应
 */
export interface BatchOperationResponse {
  /** 成功数量 */
  successCount: number
  /** 失败数量 */
  failureCount: number
  /** 操作消息 */
  message: string
  /** 失败详情 */
  failures?: Array<{
    id: number | string
    error: string
  }>
}
