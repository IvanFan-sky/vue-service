/**
 * 侧边栏菜单配置
 * @description 定义系统的菜单结构和权限
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import type { MenuItem } from '@/types/menu'

/**
 * 主菜单配置
 */
export const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: '仪表板',
    icon: 'dashboard',
    path: '/dashboard'
  },
  {
    id: 'users',
    title: '用户管理',
    icon: 'users',
    path: '/users',
    roles: ['admin'], // 仅管理员可见
    children: [
      {
        id: 'user-list',
        title: '用户列表',
        icon: 'list',
        path: '/users/list'
      },
      {
        id: 'user-roles',
        title: '角色管理',
        icon: 'role',
        path: '/users/roles',
        roles: ['admin']
      }
    ]
  },
  {
    id: 'system',
    title: '系统管理',
    icon: 'settings',
    path: '/system',
    roles: ['admin'],
    children: [
      {
        id: 'system-config',
        title: '系统配置',
        icon: 'config',
        path: '/system/config'
      },
      {
        id: 'system-logs',
        title: '系统日志',
        icon: 'logs',
        path: '/system/logs'
      }
    ]
  },
  {
    id: 'tools',
    title: '工具箱',
    icon: 'tools',
    path: '/tools',
    children: [
      {
        id: 'api-test',
        title: 'API测试',
        icon: 'api',
        path: '/tools/api-test'
      },
      {
        id: 'code-generator',
        title: '代码生成',
        icon: 'code',
        path: '/tools/generator'
      }
    ]
  },
  {
    id: 'help',
    title: '帮助中心',
    icon: 'help',
    path: '/help',
    children: [
      {
        id: 'help-docs',
        title: '使用文档',
        icon: 'docs',
        path: '/help/docs'
      },
      {
        id: 'help-about',
        title: '关于系统',
        icon: 'info',
        path: '/help/about'
      }
    ]
  }
]

/**
 * 根据用户角色过滤菜单
 * @param menus 菜单列表
 * @param userRole 用户角色
 * @returns 过滤后的菜单列表
 */
export function filterMenusByRole(menus: MenuItem[], userRole?: string): MenuItem[] {
  return menus
    .filter(menu => {
      // 如果菜单没有角色限制，则显示
      if (!menu.roles || menu.roles.length === 0) {
        return true
      }

      // 检查用户角色是否匹配
      if (userRole && menu.roles.includes(userRole as any)) {
        return true
      }

      return false
    })
    .map(menu => {
      // 递归过滤子菜单
      if (menu.children && menu.children.length > 0) {
        return {
          ...menu,
          children: filterMenusByRole(menu.children, userRole)
        }
      }
      return menu
    })
}

/**
 * 根据路径查找菜单项
 * @param menus 菜单列表
 * @param path 路径
 * @returns 匹配的菜单项
 */
export function findMenuByPath(menus: MenuItem[], path: string): MenuItem | null {
  for (const menu of menus) {
    if (menu.path === path) {
      return menu
    }

    if (menu.children && menu.children.length > 0) {
      const found = findMenuByPath(menu.children, path)
      if (found) {
        return found
      }
    }
  }

  return null
}
