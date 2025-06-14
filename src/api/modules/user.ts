/**
 * 用户管理API接口
 * @description 提供用户CRUD、分页查询、批量操作、导入导出等功能
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import request from '@/utils/request'
import type { User, UserImportResult, UserListQuery, UserListResult, UserStatistics, CreateUserRequest, UpdateUserRequest, BatchOperationRequest } from '@/types/user'

/**
 * 用户管理API
 */
export const userApi = {
  /**
   * 获取用户列表
   * @param params 查询参数
   * @returns 用户列表数据
   */
  getList: (params: UserListQuery): Promise<UserListResult> =>
    request.get('/api/users', { params }),

  /**
   * 获取用户详情
   * @param id 用户ID
   * @returns 用户详情
   */
  getById: (id: number): Promise<User> => request.get(`/api/users/${id}`),

  /**
   * 创建用户
   * @param data 用户数据
   * @returns 创建的用户信息
   */
  create: (data: CreateUserRequest): Promise<User> => request.post('/api/users', data),

  /**
   * 更新用户
   * @param id 用户ID
   * @param data 更新数据
   * @returns 更新后的用户信息
   */
  update: (id: number, data: UpdateUserRequest): Promise<User> =>
    request.put(`/api/users/${id}`, data),

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除结果
   */
  delete: (id: number): Promise<void> => request.delete(`/api/users/${id}`),

  /**
   * 批量操作用户
   * @param data 批量操作数据
   * @returns 操作结果
   */
  batchOperation: (
    data: BatchOperationRequest
  ): Promise<{
    successCount: number
    failureCount: number
    message: string
  }> => request.post('/api/users/batch', data),

  /**
   * 导入用户
   * @param file 导入文件
   * @returns 导入结果
   */
  import: (file: File): Promise<UserImportResult> => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/api/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 导出用户
   * @param params 导出参数
   * @returns 导出文件流
   */
  export: (params?: Partial<UserListQuery>): Promise<Blob> =>
    request.get('/api/users/export', {
      params,
      responseType: 'blob'
    }),

  /**
   * 下载用户导入模板
   * @returns 模板文件流
   */
  downloadTemplate: (): Promise<Blob> =>
    request.get('/api/users/template', {
      responseType: 'blob'
    }),

  /**
   * 获取用户统计数据
   * @returns 统计数据
   */
  getStatistics: (): Promise<UserStatistics> => request.get('/api/users/statistics'),

  /**
   * 重置用户密码
   * @param id 用户ID
   * @param newPassword 新密码
   * @returns 重置结果
   */
  resetPassword: (id: number, newPassword: string): Promise<void> =>
    request.post(`/api/users/${id}/reset-password`, { password: newPassword }),

  /**
   * 启用/禁用用户
   * @param id 用户ID
   * @param status 状态
   * @returns 操作结果
   */
  updateStatus: (id: number, status: number): Promise<User> =>
    request.patch(`/api/users/${id}/status`, { status }),

  /**
   * 检查用户名是否可用
   * @param username 用户名
   * @returns 是否可用
   */
  checkUsername: (username: string): Promise<{ available: boolean }> =>
    request.get('/api/users/check-username', { params: { username } }),

  /**
   * 检查邮箱是否可用
   * @param email 邮箱
   * @returns 是否可用
   */
  checkEmail: (email: string): Promise<{ available: boolean }> =>
    request.get('/api/users/check-email', { params: { email } }),

  /**
   * 获取部门列表
   * @returns 部门列表
   */
  getDepartments: (): Promise<string[]> => request.get('/api/users/departments'),

  /**
   * 获取职位列表
   * @returns 职位列表
   */
  getPositions: (): Promise<string[]> => request.get('/api/users/positions')
}
