/**
 * 角色管理相关类型定义
 * @description 定义角色数据结构、权限管理等类型
 * @author 开发团队
 * @date 2024-12-14
 * @version 1.0.0
 */

/**
 * 权限类型
 */
export interface Permission {
  /** 权限ID */
  id: number
  /** 权限代码 */
  code: string
  /** 权限名称 */
  name: string
  /** 权限描述 */
  description?: string
  /** 权限类型 */
  type: 'menu' | 'button' | 'api'
  /** 父权限ID */
  parentId?: number
  /** 排序 */
  sort: number
  /** 是否启用 */
  enabled: boolean
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 角色信息接口
 */
export interface Role {
  /** 角色ID */
  id: number
  /** 角色代码 */
  code: string
  /** 角色名称 */
  name: string
  /** 角色描述 */
  description?: string
  /** 是否为系统内置角色 */
  isSystem: boolean
  /** 是否启用 */
  enabled: boolean
  /** 权限列表 */
  permissions: Permission[]
  /** 用户数量 */
  userCount: number
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 创建者 */
  createdBy: string
}

/**
 * 角色查询参数
 */
export interface RoleListQuery {
  /** 页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 搜索关键词 */
  keyword?: string
  /** 是否启用 */
  enabled?: boolean
  /** 是否为系统角色 */
  isSystem?: boolean
}

/**
 * 角色列表结果
 */
export interface RoleListResult {
  /** 角色列表 */
  list: Role[]
  /** 总数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 创建角色请求
 */
export interface CreateRoleRequest {
  /** 角色代码 */
  code: string
  /** 角色名称 */
  name: string
  /** 角色描述 */
  description?: string
  /** 权限ID列表 */
  permissionIds: number[]
  /** 是否启用 */
  enabled?: boolean
}

/**
 * 更新角色请求
 */
export interface UpdateRoleRequest {
  /** 角色名称 */
  name?: string
  /** 角色描述 */
  description?: string
  /** 权限ID列表 */
  permissionIds?: number[]
  /** 是否启用 */
  enabled?: boolean
}

/**
 * 权限树节点
 */
export interface PermissionTreeNode extends Permission {
  /** 子权限 */
  children?: PermissionTreeNode[]
  /** 是否选中 */
  checked?: boolean
  /** 是否半选中 */
  indeterminate?: boolean
}

/**
 * 角色统计数据
 */
export interface RoleStatistics {
  /** 总角色数 */
  totalRoles: number
  /** 启用角色数 */
  enabledRoles: number
  /** 系统角色数 */
  systemRoles: number
  /** 自定义角色数 */
  customRoles: number
}

/**
 * 角色权限分配请求
 */
export interface AssignPermissionsRequest {
  /** 角色ID */
  roleId: number
  /** 权限ID列表 */
  permissionIds: number[]
}

/**
 * 用户角色分配请求
 */
export interface AssignRolesRequest {
  /** 用户ID */
  userId: number
  /** 角色ID列表 */
  roleIds: number[]
}
