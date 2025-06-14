/**
 * 角色管理模拟数据生成器
 * @description 使用faker.js生成真实的角色和权限模拟数据
 * @author 开发团队
 * @date 2024-12-14
 * @version 1.0.0
 */

import { faker } from '@faker-js/faker'
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
 * 模拟延迟函数
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 权限数据
 */
const mockPermissions: Permission[] = [
  // 用户管理权限
  { id: 1, code: 'user:read', name: '查看用户', description: '查看用户列表和详情', type: 'menu', parentId: undefined, sort: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, code: 'user:create', name: '创建用户', description: '创建新用户', type: 'button', parentId: 1, sort: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 3, code: 'user:update', name: '编辑用户', description: '编辑用户信息', type: 'button', parentId: 1, sort: 2, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 4, code: 'user:delete', name: '删除用户', description: '删除用户', type: 'button', parentId: 1, sort: 3, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 5, code: 'user:export', name: '导出用户', description: '导出用户数据', type: 'api', parentId: 1, sort: 4, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // 角色管理权限
  { id: 10, code: 'role:read', name: '查看角色', description: '查看角色列表和详情', type: 'menu', parentId: undefined, sort: 2, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 11, code: 'role:create', name: '创建角色', description: '创建新角色', type: 'button', parentId: 10, sort: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 12, code: 'role:update', name: '编辑角色', description: '编辑角色信息', type: 'button', parentId: 10, sort: 2, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 13, code: 'role:delete', name: '删除角色', description: '删除角色', type: 'button', parentId: 10, sort: 3, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 14, code: 'role:assign', name: '分配权限', description: '为角色分配权限', type: 'button', parentId: 10, sort: 4, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // 系统管理权限
  { id: 20, code: 'system:read', name: '查看系统', description: '查看系统信息和配置', type: 'menu', parentId: undefined, sort: 3, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 21, code: 'system:config', name: '系统配置', description: '修改系统配置', type: 'button', parentId: 20, sort: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 22, code: 'system:log', name: '系统日志', description: '查看系统日志', type: 'menu', parentId: 20, sort: 2, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 23, code: 'system:backup', name: '数据备份', description: '备份和恢复数据', type: 'button', parentId: 20, sort: 3, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // 仪表盘权限
  { id: 30, code: 'dashboard:read', name: '查看仪表盘', description: '查看仪表盘数据', type: 'menu', parentId: undefined, sort: 0, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 31, code: 'dashboard:stats', name: '统计数据', description: '查看统计数据', type: 'api', parentId: 30, sort: 1, enabled: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
]

/**
 * 角色数据
 */
let mockRoles: Role[] = [
  {
    id: 1,
    code: 'admin',
    name: '超级管理员',
    description: '拥有系统所有权限的超级管理员',
    isSystem: true,
    enabled: true,
    permissions: mockPermissions,
    userCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 2,
    code: 'manager',
    name: '管理员',
    description: '拥有用户管理和角色管理权限',
    isSystem: false,
    enabled: true,
    permissions: mockPermissions.filter(p => p.code.startsWith('user:') || p.code.startsWith('role:') || p.code === 'dashboard:read'),
    userCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin'
  },
  {
    id: 3,
    code: 'user',
    name: '普通用户',
    description: '只能查看基本信息的普通用户',
    isSystem: true,
    enabled: true,
    permissions: mockPermissions.filter(p => p.code === 'dashboard:read' || p.code === 'user:read'),
    userCount: 50,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 4,
    code: 'guest',
    name: '访客',
    description: '只读权限的访客用户',
    isSystem: false,
    enabled: true,
    permissions: mockPermissions.filter(p => p.code === 'dashboard:read'),
    userCount: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin'
  },
  {
    id: 5,
    code: 'operator',
    name: '操作员',
    description: '拥有用户管理权限的操作员',
    isSystem: false,
    enabled: false,
    permissions: mockPermissions.filter(p => p.code.startsWith('user:') && p.code !== 'user:delete'),
    userCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin'
  }
]

/**
 * 生成权限树
 */
function generatePermissionTree(): PermissionTreeNode[] {
  const tree: PermissionTreeNode[] = []
  const permissionMap = new Map<number, PermissionTreeNode>()
  
  // 创建权限节点映射
  mockPermissions.forEach(permission => {
    permissionMap.set(permission.id, {
      ...permission,
      children: []
    })
  })
  
  // 构建树形结构
  mockPermissions.forEach(permission => {
    const node = permissionMap.get(permission.id)!
    
    if (permission.parentId) {
      const parent = permissionMap.get(permission.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
      }
    } else {
      tree.push(node)
    }
  })
  
  return tree.sort((a, b) => a.sort - b.sort)
}

/**
 * 角色模拟API
 */
export const roleMockApi = {
  /**
   * 获取角色列表
   */
  getList: async (params: RoleListQuery): Promise<RoleListResult> => {
    await delay(300)
    
    let filteredRoles = [...mockRoles]
    
    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredRoles = filteredRoles.filter(role => 
        role.name.toLowerCase().includes(keyword) ||
        role.code.toLowerCase().includes(keyword) ||
        (role.description && role.description.toLowerCase().includes(keyword))
      )
    }
    
    // 状态筛选
    if (params.enabled !== undefined) {
      filteredRoles = filteredRoles.filter(role => role.enabled === params.enabled)
    }
    
    // 类型筛选
    if (params.isSystem !== undefined) {
      filteredRoles = filteredRoles.filter(role => role.isSystem === params.isSystem)
    }
    
    // 分页
    const total = filteredRoles.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredRoles.slice(start, end)
    
    return {
      list,
      total,
      page: params.page,
      pageSize: params.pageSize
    }
  },

  /**
   * 获取角色详情
   */
  getById: async (id: number): Promise<Role> => {
    await delay(200)
    
    const role = mockRoles.find(r => r.id === id)
    if (!role) {
      throw new Error('角色不存在')
    }
    
    return role
  },

  /**
   * 创建角色
   */
  create: async (data: CreateRoleRequest): Promise<Role> => {
    await delay(500)
    
    // 检查角色代码是否已存在
    if (mockRoles.some(r => r.code === data.code)) {
      throw new Error('角色代码已存在')
    }
    
    const newRole: Role = {
      id: Math.max(...mockRoles.map(r => r.id)) + 1,
      code: data.code,
      name: data.name,
      description: data.description,
      isSystem: false,
      enabled: data.enabled ?? true,
      permissions: mockPermissions.filter(p => data.permissionIds?.includes(p.id)) || [],
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin'
    }
    
    mockRoles.push(newRole)
    return newRole
  },

  /**
   * 更新角色
   */
  update: async (id: number, data: UpdateRoleRequest): Promise<Role> => {
    await delay(500)
    
    const roleIndex = mockRoles.findIndex(r => r.id === id)
    if (roleIndex === -1) {
      throw new Error('角色不存在')
    }
    
    const role = mockRoles[roleIndex]
    
    // 系统角色不允许修改
    if (role.isSystem) {
      throw new Error('系统角色不允许修改')
    }
    
    const updatedRole: Role = {
      ...role,
      name: data.name ?? role.name,
      description: data.description ?? role.description,
      enabled: data.enabled ?? role.enabled,
      permissions: data.permissionIds 
        ? mockPermissions.filter(p => data.permissionIds!.includes(p.id))
        : role.permissions,
      updatedAt: new Date().toISOString()
    }
    
    mockRoles[roleIndex] = updatedRole
    return updatedRole
  },

  /**
   * 删除角色
   */
  delete: async (id: number): Promise<void> => {
    await delay(300)
    
    const roleIndex = mockRoles.findIndex(r => r.id === id)
    if (roleIndex === -1) {
      throw new Error('角色不存在')
    }
    
    const role = mockRoles[roleIndex]
    
    // 系统角色不允许删除
    if (role.isSystem) {
      throw new Error('系统角色不允许删除')
    }
    
    // 有用户的角色不允许删除
    if (role.userCount > 0) {
      throw new Error('该角色下还有用户，不允许删除')
    }
    
    mockRoles.splice(roleIndex, 1)
  },

  /**
   * 更新角色状态
   */
  updateStatus: async (id: number, enabled: boolean): Promise<Role> => {
    await delay(200)
    
    const roleIndex = mockRoles.findIndex(r => r.id === id)
    if (roleIndex === -1) {
      throw new Error('角色不存在')
    }
    
    const role = mockRoles[roleIndex]
    
    // 系统角色不允许禁用
    if (role.isSystem && !enabled) {
      throw new Error('系统角色不允许禁用')
    }
    
    const updatedRole: Role = {
      ...role,
      enabled,
      updatedAt: new Date().toISOString()
    }
    
    mockRoles[roleIndex] = updatedRole
    return updatedRole
  },

  /**
   * 获取角色统计数据
   */
  getStatistics: async (): Promise<RoleStatistics> => {
    await delay(200)
    
    return {
      totalRoles: mockRoles.length,
      enabledRoles: mockRoles.filter(r => r.enabled).length,
      systemRoles: mockRoles.filter(r => r.isSystem).length,
      customRoles: mockRoles.filter(r => !r.isSystem).length
    }
  },

  /**
   * 分配权限给角色
   */
  assignPermissions: async (data: AssignPermissionsRequest): Promise<void> => {
    await delay(500)
    
    const roleIndex = mockRoles.findIndex(r => r.id === data.roleId)
    if (roleIndex === -1) {
      throw new Error('角色不存在')
    }
    
    const role = mockRoles[roleIndex]
    const permissions = mockPermissions.filter(p => data.permissionIds.includes(p.id))
    
    mockRoles[roleIndex] = {
      ...role,
      permissions,
      updatedAt: new Date().toISOString()
    }
  },

  /**
   * 获取角色权限列表
   */
  getPermissions: async (roleId: number): Promise<Permission[]> => {
    await delay(200)
    
    const role = mockRoles.find(r => r.id === roleId)
    if (!role) {
      throw new Error('角色不存在')
    }
    
    return role.permissions
  }
}

/**
 * 权限模拟API
 */
export const permissionMockApi = {
  /**
   * 获取权限树
   */
  getTree: async (): Promise<PermissionTreeNode[]> => {
    await delay(300)
    return generatePermissionTree()
  },

  /**
   * 获取权限列表
   */
  getList: async (): Promise<Permission[]> => {
    await delay(200)
    return mockPermissions
  },

  /**
   * 获取权限详情
   */
  getById: async (id: number): Promise<Permission> => {
    await delay(200)
    
    const permission = mockPermissions.find(p => p.id === id)
    if (!permission) {
      throw new Error('权限不存在')
    }
    
    return permission
  }
}
