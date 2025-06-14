/**
 * 角色管理API接口
 * @description 提供角色CRUD、权限分配等功能
 * @author 开发团队
 * @date 2024-12-14
 * @version 1.0.0
 */

import { apiClient } from '@/utils/apiClient'
import type { 
  Role, 
  RoleListQuery,
  RoleListResult,
  CreateRoleRequest, 
  UpdateRoleRequest,
  RoleStatistics,
  Permission,
  PermissionTreeNode,
  AssignPermissionsRequest
} from '@/types/role'

/**
 * 角色管理API
 */
export const roleApi = {
  /**
   * 获取角色列表
   * @param params 查询参数
   * @returns 角色列表数据
   */
  getList: (params: RoleListQuery): Promise<RoleListResult> =>
    apiClient.get('/api/roles', { params }),

  /**
   * 获取角色详情
   * @param id 角色ID
   * @returns 角色详情
   */
  getById: (id: number): Promise<Role> =>
    apiClient.get(`/api/roles/${id}`),

  /**
   * 创建角色
   * @param data 角色数据
   * @returns 创建的角色信息
   */
  create: (data: CreateRoleRequest): Promise<Role> =>
    apiClient.post('/api/roles', data, {
      showLoading: true,
      retryCount: 2
    }),

  /**
   * 更新角色
   * @param id 角色ID
   * @param data 更新数据
   * @returns 更新后的角色信息
   */
  update: (id: number, data: UpdateRoleRequest): Promise<Role> =>
    apiClient.put(`/api/roles/${id}`, data, {
      showLoading: true,
      retryCount: 2
    }),

  /**
   * 删除角色
   * @param id 角色ID
   * @returns 删除结果
   */
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/roles/${id}`, {
      showLoading: true
    }),

  /**
   * 更新角色状态
   * @param id 角色ID
   * @param enabled 是否启用
   * @returns 更新后的角色信息
   */
  updateStatus: (id: number, enabled: boolean): Promise<Role> =>
    apiClient.patch(`/api/roles/${id}/status`, { enabled }),

  /**
   * 获取角色统计数据
   * @returns 统计数据
   */
  getStatistics: (): Promise<RoleStatistics> =>
    apiClient.get('/api/roles/statistics', {
      enableDedupe: true
    }),

  /**
   * 分配权限给角色
   * @param data 权限分配数据
   * @returns 分配结果
   */
  assignPermissions: (data: AssignPermissionsRequest): Promise<void> =>
    apiClient.post('/api/roles/assign-permissions', data, {
      showLoading: true
    }),

  /**
   * 获取角色权限列表
   * @param roleId 角色ID
   * @returns 权限列表
   */
  getPermissions: (roleId: number): Promise<Permission[]> =>
    apiClient.get(`/api/roles/${roleId}/permissions`),

  /**
   * 复制角色
   * @param id 源角色ID
   * @param name 新角色名称
   * @returns 新角色信息
   */
  copy: (id: number, name: string): Promise<Role> =>
    apiClient.post(`/api/roles/${id}/copy`, { name }, {
      showLoading: true
    })
}

/**
 * 权限管理API
 */
export const permissionApi = {
  /**
   * 获取权限树
   * @returns 权限树数据
   */
  getTree: (): Promise<PermissionTreeNode[]> =>
    apiClient.get('/api/permissions/tree', {
      enableDedupe: true
    }),

  /**
   * 获取权限列表
   * @returns 权限列表
   */
  getList: (): Promise<Permission[]> =>
    apiClient.get('/api/permissions', {
      enableDedupe: true
    }),

  /**
   * 获取权限详情
   * @param id 权限ID
   * @returns 权限详情
   */
  getById: (id: number): Promise<Permission> =>
    apiClient.get(`/api/permissions/${id}`),

  /**
   * 创建权限
   * @param data 权限数据
   * @returns 创建的权限信息
   */
  create: (data: Partial<Permission>): Promise<Permission> =>
    apiClient.post('/api/permissions', data, {
      showLoading: true
    }),

  /**
   * 更新权限
   * @param id 权限ID
   * @param data 更新数据
   * @returns 更新后的权限信息
   */
  update: (id: number, data: Partial<Permission>): Promise<Permission> =>
    apiClient.put(`/api/permissions/${id}`, data, {
      showLoading: true
    }),

  /**
   * 删除权限
   * @param id 权限ID
   * @returns 删除结果
   */
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/permissions/${id}`, {
      showLoading: true
    }),

  /**
   * 更新权限状态
   * @param id 权限ID
   * @param enabled 是否启用
   * @returns 更新后的权限信息
   */
  updateStatus: (id: number, enabled: boolean): Promise<Permission> =>
    apiClient.patch(`/api/permissions/${id}/status`, { enabled })
}
