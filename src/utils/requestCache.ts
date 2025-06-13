/**
 * 请求缓存管理器
 * @description 提供智能的HTTP请求缓存功能
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

interface CacheItem {
  data: any
  timestamp: number
  lastAccess: number
  priority: 'high' | 'medium' | 'low'
  type: string
  expiresAt: number
}

interface CacheConfig {
  maxAge: number
  priority: 'high' | 'medium' | 'low'
  maxSize?: number
}

export class RequestCache {
  private cache = new Map<string, CacheItem>()
  private maxSize = 100
  
  private readonly cacheConfig: Record<string, CacheConfig> = {
    user: { maxAge: 10 * 60 * 1000, priority: 'high' }, // 10分钟
    dashboard: { maxAge: 5 * 60 * 1000, priority: 'medium' }, // 5分钟
    list: { maxAge: 2 * 60 * 1000, priority: 'low' }, // 2分钟
    static: { maxAge: 30 * 60 * 1000, priority: 'high' }, // 30分钟
    config: { maxAge: 15 * 60 * 1000, priority: 'medium' } // 15分钟
  }

  /**
   * 获取缓存数据
   * @param key 缓存键
   * @param type 缓存类型
   * @returns 缓存的数据或null
   */
  get(key: string, type: keyof typeof this.cacheConfig = 'list'): any {
    const item = this.cache.get(key)
    const config = this.cacheConfig[type]
    
    if (!item) {
      return null
    }
    
    const now = Date.now()
    
    // 检查是否过期
    if (now > item.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    // 更新访问时间
    item.lastAccess = now
    
    return item.data
  }

  /**
   * 设置缓存数据
   * @param key 缓存键
   * @param data 要缓存的数据
   * @param type 缓存类型
   */
  set(key: string, data: any, type: keyof typeof this.cacheConfig = 'list'): void {
    const config = this.cacheConfig[type]
    const now = Date.now()
    
    // 检查缓存大小限制
    if (this.cache.size >= this.maxSize) {
      this.evictLRU()
    }
    
    const item: CacheItem = {
      data,
      timestamp: now,
      lastAccess: now,
      priority: config.priority,
      type,
      expiresAt: now + config.maxAge
    }
    
    this.cache.set(key, item)
  }

  /**
   * 删除缓存项
   * @param key 缓存键
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 检查缓存是否存在且有效
   * @param key 缓存键
   * @param type 缓存类型
   * @returns 是否存在有效缓存
   */
  has(key: string, type: keyof typeof this.cacheConfig = 'list'): boolean {
    const item = this.cache.get(key)
    if (!item) {
      return false
    }
    
    const now = Date.now()
    if (now > item.expiresAt) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 清空指定类型的缓存
   * @param type 缓存类型
   */
  clearByType(type: string): void {
    for (const [key, item] of this.cache.entries()) {
      if (item.type === type) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 清理过期缓存
   */
  cleanExpired(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * LRU淘汰策略
   * @private
   */
  private evictLRU(): void {
    let oldestKey = ''
    let oldestTime = Date.now()
    let lowestPriority: 'high' | 'medium' | 'low' = 'high'
    
    // 优先淘汰低优先级的缓存
    for (const [key, item] of this.cache.entries()) {
      if (item.priority === 'low' && item.lastAccess < oldestTime) {
        oldestTime = item.lastAccess
        oldestKey = key
        lowestPriority = 'low'
      }
    }
    
    // 如果没有低优先级的，淘汰中优先级的
    if (!oldestKey) {
      oldestTime = Date.now()
      for (const [key, item] of this.cache.entries()) {
        if (item.priority === 'medium' && item.lastAccess < oldestTime) {
          oldestTime = item.lastAccess
          oldestKey = key
          lowestPriority = 'medium'
        }
      }
    }
    
    // 最后才淘汰高优先级的
    if (!oldestKey) {
      oldestTime = Date.now()
      for (const [key, item] of this.cache.entries()) {
        if (item.priority === 'high' && item.lastAccess < oldestTime) {
          oldestTime = item.lastAccess
          oldestKey = key
        }
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  /**
   * 获取缓存统计信息
   * @returns 缓存统计
   */
  getStats(): {
    size: number
    maxSize: number
    hitRate: number
    types: Record<string, number>
    priorities: Record<string, number>
  } {
    const types: Record<string, number> = {}
    const priorities: Record<string, number> = {}
    
    for (const item of this.cache.values()) {
      types[item.type] = (types[item.type] || 0) + 1
      priorities[item.priority] = (priorities[item.priority] || 0) + 1
    }
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // 需要额外统计
      types,
      priorities
    }
  }

  /**
   * 设置最大缓存大小
   * @param size 最大大小
   */
  setMaxSize(size: number): void {
    this.maxSize = size
    
    // 如果当前缓存超过新的限制，进行清理
    while (this.cache.size > this.maxSize) {
      this.evictLRU()
    }
  }

  /**
   * 生成缓存键
   * @param url 请求URL
   * @param params 请求参数
   * @param method 请求方法
   * @returns 缓存键
   */
  static generateKey(url: string, params?: any, method = 'GET'): string {
    const paramStr = params ? JSON.stringify(params) : ''
    return btoa(`${method}_${url}_${paramStr}`).replace(/[+/=]/g, '')
  }

  /**
   * 预热缓存
   * @description 预先加载一些重要数据到缓存中
   */
  async preload(preloadFunctions: Array<() => Promise<{ key: string; data: any; type: string }>>): Promise<void> {
    const promises = preloadFunctions.map(async (fn) => {
      try {
        const { key, data, type } = await fn()
        this.set(key, data, type as keyof typeof this.cacheConfig)
      } catch (error) {
        console.warn('缓存预热失败:', error)
      }
    })
    
    await Promise.allSettled(promises)
  }
}

// 创建全局缓存实例
export const requestCache = new RequestCache()

// 定期清理过期缓存
setInterval(() => {
  requestCache.cleanExpired()
}, 5 * 60 * 1000) // 每5分钟清理一次

export default requestCache
