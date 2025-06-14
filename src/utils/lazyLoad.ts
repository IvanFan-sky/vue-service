/**
 * 组件懒加载工具
 * @description 提供组件懒加载、预加载和错误处理功能
 * @author 开发团队
 * @date 2024-12-14
 * @version 1.0.0
 */

import { defineAsyncComponent, type AsyncComponentLoader, type Component } from 'vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

/**
 * 懒加载配置选项
 */
interface LazyLoadOptions {
  /** 加载延迟时间（毫秒） */
  delay?: number
  /** 超时时间（毫秒） */
  timeout?: number
  /** 是否显示加载组件 */
  showLoading?: boolean
  /** 是否显示错误组件 */
  showError?: boolean
  /** 重试次数 */
  retryCount?: number
  /** 预加载 */
  preload?: boolean
}

/**
 * 默认配置
 */
const defaultOptions: Required<LazyLoadOptions> = {
  delay: 200,
  timeout: 5000,
  showLoading: true,
  showError: true,
  retryCount: 3,
  preload: false
}

/**
 * 创建错误组件
 */
const createErrorComponent = (error: Error, retry: () => void) => {
  return {
    template: `
      <div class="lazy-load-error">
        <div class="error-content">
          <el-icon class="error-icon" size="48">
            <WarningFilled />
          </el-icon>
          <h3>组件加载失败</h3>
          <p>{{ error.message }}</p>
          <div class="error-actions">
            <el-button @click="retry" type="primary">重试</el-button>
            <el-button @click="goBack">返回</el-button>
          </div>
        </div>
      </div>
    `,
    setup() {
      const goBack = () => {
        window.history.back()
      }

      return {
        error,
        retry,
        goBack
      }
    }
  }
}

/**
 * 组件懒加载函数
 * @param loader 组件加载器函数
 * @param options 配置选项
 * @returns 异步组件
 */
export const lazyLoad = (
  loader: AsyncComponentLoader,
  options: LazyLoadOptions = {}
): Component => {
  const config = { ...defaultOptions, ...options }
  let retryCount = 0

  const loadWithRetry: AsyncComponentLoader = async () => {
    try {
      const component = await loader()
      retryCount = 0 // 重置重试计数
      return component
    } catch (_error) {
      console.error('组件加载失败:', _error)

      if (retryCount < config.retryCount) {
        retryCount++
        console.log(`正在重试加载组件 (${retryCount}/${config.retryCount})`)
        // 延迟重试
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        return loadWithRetry()
      }

      throw error
    }
  }

  return defineAsyncComponent({
    loader: loadWithRetry,
    loadingComponent: config.showLoading ? LoadingComponent : undefined,
    errorComponent: config.showError ? createErrorComponent : undefined,
    delay: config.delay,
    timeout: config.timeout,
    suspensible: false
  })
}

/**
 * 路由懒加载函数
 * @param componentPath 组件路径
 * @param chunkName 代码块名称
 * @param options 配置选项
 * @returns 异步组件
 */
export const routeLazyLoad = (
  componentPath: string,
  chunkName?: string,
  options: LazyLoadOptions = {}
) => {
  // 动态导入映射
  const importMap: Record<string, () => Promise<any>> = {
    '@/views/Login.vue': () => import('@/views/Login.vue'),
    '@/views/Dashboard.vue': () => import('@/views/Dashboard.vue'),
    '@/views/UserManagement.vue': () => import('@/views/UserManagement.vue'),
    '@/views/UserProfile.vue': () => import('@/views/UserProfile.vue'),
    '@/views/RoleManagement.vue': () => import('@/views/RoleManagement.vue'),
    '@/views/SystemSettings.vue': () => import('@/views/SystemSettings.vue'),
    '@/views/404.vue': () => import('@/views/404.vue'),
    '@/components/Layout/BasicLayout.vue': () => import('@/components/Layout/BasicLayout.vue')
  }

  const loader = importMap[componentPath] || (() => import(/* @vite-ignore */ componentPath))

  return lazyLoad(loader, {
    delay: 100, // 路由切换时减少延迟
    timeout: 8000, // 路由组件允许更长的加载时间
    ...options
  })
}

/**
 * 预加载组件
 * @param componentPath 组件路径
 * @returns Promise
 */
export const preloadComponent = (componentPath: string): Promise<any> => {
  return import(componentPath).catch(error => {
    console.warn('组件预加载失败:', componentPath, error)
  })
}

/**
 * 批量预加载组件
 * @param componentPaths 组件路径数组
 * @returns Promise
 */
export const preloadComponents = async (componentPaths: string[]): Promise<void> => {
  const promises = componentPaths.map(path => preloadComponent(path))
  await Promise.allSettled(promises)
}

/**
 * 基于路由的智能预加载
 * @param currentRoute 当前路由
 * @param routeConfig 路由配置
 */
export const smartPreload = (currentRoute: string, routeConfig: Record<string, any>) => {
  // 预加载策略：预加载当前路由的子路由和相关路由
  const preloadRoutes: string[] = []

  // 根据当前路由推测可能访问的路由
  if (currentRoute === '/login') {
    preloadRoutes.push('/dashboard')
  } else if (currentRoute === '/dashboard') {
    preloadRoutes.push('/user/list', '/system/config')
  } else if (currentRoute.startsWith('/user')) {
    preloadRoutes.push('/user/list', '/user/roles')
  }

  // 执行预加载
  preloadRoutes.forEach(route => {
    const component = routeConfig[route]
    if (component) {
      preloadComponent(component)
    }
  })
}

/**
 * 组合式函数：懒加载管理
 */
export const useLazyLoad = () => {
  const loadedComponents = new Set<string>()
  const loadingComponents = new Map<string, Promise<any>>()

  const loadComponent = async (componentPath: string) => {
    if (loadedComponents.has(componentPath)) {
      return
    }

    if (loadingComponents.has(componentPath)) {
      return loadingComponents.get(componentPath)
    }

    const loadPromise = import(componentPath)
      .then(component => {
        loadedComponents.add(componentPath)
        loadingComponents.delete(componentPath)
        return component
      })
      .catch(error => {
        loadingComponents.delete(componentPath)
        throw error
      })

    loadingComponents.set(componentPath, loadPromise)
    return loadPromise
  }

  const isLoaded = (componentPath: string) => loadedComponents.has(componentPath)
  const isLoading = (componentPath: string) => loadingComponents.has(componentPath)

  return {
    loadComponent,
    isLoaded,
    isLoading,
    preloadComponent,
    preloadComponents
  }
}

/**
 * 导出默认懒加载函数（向后兼容）
 */
export default lazyLoad
