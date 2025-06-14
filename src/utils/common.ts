/**
 * 通用工具函数
 * @description 包含项目中常用的工具函数
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 * @example
 * ```typescript
 * const debouncedSearch = debounce((keyword: string) => {
 *   console.log('搜索:', keyword)
 * }, 300)
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   console.log('滚动事件')
 * }, 100)
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastTime = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastTime >= delay) {
      lastTime = now
      func(...args)
    }
  }
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 拷贝后的对象
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 } }
 * const copied = deepClone(original)
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  return obj
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数，默认2位
 * @returns 格式化后的文件大小字符串
 * @example
 * ```typescript
 * formatFileSize(1024) // "1.00 KB"
 * formatFileSize(1048576) // "1.00 MB"
 * ```
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 格式化日期时间
 * @param date 日期对象或时间戳
 * @param format 格式字符串，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @example
 * ```typescript
 * formatDateTime(new Date()) // "2024-12-12 16:30:45"
 * formatDateTime(Date.now(), 'YYYY-MM-DD') // "2024-12-12"
 * ```
 */
export function formatDateTime(date: Date | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @param chars 可选字符集，默认包含字母和数字
 * @returns 随机字符串
 * @example
 * ```typescript
 * generateRandomString(8) // "aB3dE7fG"
 * generateRandomString(6, '0123456789') // "123456"
 * ```
 */
export function generateRandomString(
  length: number,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否为有效邮箱
 * @example
 * ```typescript
 * isValidEmail('test@example.com') // true
 * isValidEmail('invalid-email') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式（中国大陆）
 * @param phone 手机号
 * @returns 是否为有效手机号
 * @example
 * ```typescript
 * isValidPhone('13812345678') // true
 * isValidPhone('12345678901') // false
 * ```
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 获取URL参数
 * @param name 参数名
 * @param url 可选的URL，默认为当前页面URL
 * @returns 参数值或null
 * @example
 * ```typescript
 * // URL: https://example.com?id=123&name=test
 * getUrlParam('id') // "123"
 * getUrlParam('name') // "test"
 * getUrlParam('notexist') // null
 * ```
 */
export function getUrlParam(name: string, url?: string): string | null {
  const targetUrl = url || window.location.href
  const urlObj = new URL(targetUrl)
  return urlObj.searchParams.get(name)
}

/**
 * 设置URL参数
 * @param params 参数对象
 * @param url 可选的URL，默认为当前页面URL
 * @returns 新的URL字符串
 * @example
 * ```typescript
 * setUrlParams({ id: '123', name: 'test' })
 * // 返回: "https://example.com?id=123&name=test"
 * ```
 */
export function setUrlParams(params: Record<string, string>, url?: string): string {
  const targetUrl = url || window.location.href
  const urlObj = new URL(targetUrl)

  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value)
  })

  return urlObj.toString()
}

/**
 * 下载文件
 * @param url 文件URL
 * @param filename 文件名
 * @example
 * ```typescript
 * downloadFile('https://example.com/file.pdf', 'document.pdf')
 * ```
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否复制成功
 * @example
 * ```typescript
 * const success = await copyToClipboard('Hello World')
 * if (success) {
 *   console.log('复制成功')
 * }
 * ```
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (_error) {
    console.error('复制到剪贴板失败:', _error)
    return false
  }
}
