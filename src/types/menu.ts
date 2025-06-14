/**
 * 菜单相关类型定义
 * @description 定义侧边栏菜单的数据结构和类型
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import type { UserRole } from '@/types'

/**
 * 菜单项接口
 */
export interface MenuItem {
  /** 菜单ID */
  id: string
  /** 菜单标题 */
  title: string
  /** 图标名称 */
  icon: string
  /** 路由路径 */
  path: string
  /** 子菜单 */
  children?: MenuItem[]
  /** 需要的角色权限 */
  roles?: UserRole[]
  /** 是否隐藏 */
  hidden?: boolean
  /** 外部链接 */
  external?: boolean
}

/**
 * 侧边栏状态接口
 */
export interface SidebarState {
  /** 是否收起 */
  collapsed: boolean
  /** 当前激活的菜单ID */
  activeMenu: string
  /** 移动端是否显示 */
  mobileVisible: boolean
}
