/**
 * 性能优化工具函数
 * @description 包含防抖、节流、内存泄漏防护等性能优化工具
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import { onUnmounted } from 'vue'

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) {func(...args)}
    }

    const callNow = immediate && !timeout

    if (timeout) {clearTimeout(timeout)}
    timeout = setTimeout(later, wait)

    if (callNow) {func(...args)}
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 内存泄漏防护 Hook
 * @description 用于清理定时器、事件监听器等资源
 * @returns 清理函数管理器
 */
export function useCleanup() {
  const cleanupFunctions: (() => void)[] = []

  /**
   * 添加清理函数
   * @param fn 清理函数
   */
  const addCleanup = (fn: () => void) => {
    cleanupFunctions.push(fn)
  }

  /**
   * 执行所有清理函数
   */
  const cleanup = () => {
    cleanupFunctions.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.error('清理函数执行失败:', error)
      }
    })
    cleanupFunctions.length = 0
  }

  // 组件卸载时自动清理
  onUnmounted(cleanup)

  return { addCleanup, cleanup }
}

/**
 * 创建可取消的定时器
 * @param callback 回调函数
 * @param delay 延迟时间
 * @returns 取消函数
 */
export function createCancelableTimeout(callback: () => void, delay: number): () => void {
  const timeoutId = setTimeout(callback, delay)

  return () => {
    clearTimeout(timeoutId)
  }
}

/**
 * 创建可取消的间隔定时器
 * @param callback 回调函数
 * @param interval 间隔时间
 * @returns 取消函数
 */
export function createCancelableInterval(callback: () => void, interval: number): () => void {
  const intervalId = setInterval(callback, interval)

  return () => {
    clearInterval(intervalId)
  }
}

/**
 * RAF节流
 * @description 使用requestAnimationFrame进行节流，适用于动画和滚动事件
 * @param func 要节流的函数
 * @returns 节流后的函数
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null

  return function executedFunction(...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args)
        rafId = null
      })
    }
  }
}

/**
 * 空闲时执行
 * @description 使用requestIdleCallback在浏览器空闲时执行函数
 * @param func 要执行的函数
 * @param options 选项
 */
export function runWhenIdle(func: () => void, options: { timeout?: number } = {}): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(func, options)
  } else {
    // 降级到setTimeout
    setTimeout(func, 0)
  }
}

/**
 * 批量执行函数
 * @description 将多个函数调用批量执行，减少重复计算
 * @param batchSize 批次大小
 * @param delay 延迟时间
 */
export function createBatchExecutor<T>(batchSize = 10, delay = 16) {
  const queue: Array<{ func: () => T; resolve: (value: T) => void; reject: (error: any) => void }> =
    []
  let timeoutId: NodeJS.Timeout | null = null

  const processBatch = () => {
    const batch = queue.splice(0, batchSize)

    batch.forEach(({ func, resolve, reject }) => {
      try {
        const result = func()
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })

    if (queue.length > 0) {
      timeoutId = setTimeout(processBatch, delay)
    } else {
      timeoutId = null
    }
  }

  return {
    add: (func: () => T): Promise<T> => {
      return new Promise((resolve, reject) => {
        queue.push({ func, resolve, reject })

        if (!timeoutId) {
          timeoutId = setTimeout(processBatch, delay)
        }
      })
    },

    clear: () => {
      queue.length = 0
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
  }
}

/**
 * 内存使用监控
 * @description 监控内存使用情况，在内存使用过高时发出警告
 */
export function createMemoryMonitor() {
  let isMonitoring = false
  let intervalId: NodeJS.Timeout | null = null

  const checkMemory = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = memory.usedJSHeapSize / 1024 / 1024
      const totalMB = memory.totalJSHeapSize / 1024 / 1024
      const limitMB = memory.jsHeapSizeLimit / 1024 / 1024

      const usagePercent = (usedMB / limitMB) * 100

      if (usagePercent > 80) {
        console.warn(
          `内存使用率过高: ${usagePercent.toFixed(2)}% (${usedMB.toFixed(2)}MB / ${limitMB.toFixed(2)}MB)`
        )
      }

      return {
        used: usedMB,
        total: totalMB,
        limit: limitMB,
        usagePercent
      }
    }

    return null
  }

  return {
    start: (interval = 10000) => {
      if (!isMonitoring) {
        isMonitoring = true
        intervalId = setInterval(checkMemory, interval)
      }
    },

    stop: () => {
      if (isMonitoring && intervalId) {
        clearInterval(intervalId)
        intervalId = null
        isMonitoring = false
      }
    },

    check: checkMemory
  }
}

/**
 * 组合式函数：性能监控
 * @description 提供性能监控的组合式函数
 */
export function usePerformanceMonitor() {
  const { addCleanup } = useCleanup()
  const memoryMonitor = createMemoryMonitor()

  // 开始内存监控
  memoryMonitor.start()
  addCleanup(() => memoryMonitor.stop())

  return {
    memoryMonitor,
    debounce,
    throttle,
    rafThrottle,
    runWhenIdle
  }
}
