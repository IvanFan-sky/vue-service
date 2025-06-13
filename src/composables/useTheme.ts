/**
 * 主题切换组合式函数
 * @description 提供主题切换功能，支持浅色、深色、自动模式
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import { ref, computed, watch, readonly } from 'vue'
import { STORAGE_KEYS, THEME_CONFIG } from '@/constants'

/**
 * 主题类型
 */
type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 当前主题模式
 */
const currentTheme = ref<ThemeMode>('light')

/**
 * 是否为深色模式
 */
const isDark = ref(false)

/**
 * 主题切换组合式函数
 * @returns 主题相关的状态和方法
 */
export function useTheme() {
  /**
   * 检测系统主题偏好
   * @returns 系统是否为深色模式
   */
  const getSystemTheme = (): boolean => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  /**
   * 应用主题到DOM
   * @param dark 是否为深色模式
   */
  const applyTheme = (dark: boolean) => {
    const html = document.documentElement
    
    if (dark) {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
    } else {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
    }
    
    isDark.value = dark
  }

  /**
   * 更新主题
   * @param theme 主题模式
   */
  const updateTheme = (theme: ThemeMode) => {
    currentTheme.value = theme
    
    let shouldBeDark = false
    
    switch (theme) {
      case 'dark':
        shouldBeDark = true
        break
      case 'light':
        shouldBeDark = false
        break
      case 'auto':
        shouldBeDark = getSystemTheme()
        break
    }
    
    applyTheme(shouldBeDark)
    
    // 保存到本地存储
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }

  /**
   * 切换主题
   */
  const toggleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    updateTheme(themes[nextIndex])
  }

  /**
   * 主题显示名称
   */
  const themeLabel = computed(() => {
    const labels = {
      light: '浅色模式',
      dark: '深色模式',
      auto: '跟随系统'
    }
    return labels[currentTheme.value]
  })

  /**
   * 主题图标名称
   */
  const themeIcon = computed(() => {
    const icons = {
      light: 'Sunny',
      dark: 'Moon',
      auto: 'Monitor'
    }
    return icons[currentTheme.value]
  })

  /**
   * 初始化主题
   */
  const initTheme = () => {
    // 从本地存储读取主题设置
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode
    const theme = savedTheme || THEME_CONFIG.LIGHT
    
    updateTheme(theme)
    
    // 监听系统主题变化
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (currentTheme.value === 'auto') {
          applyTheme(mediaQuery.matches)
        }
      })
    }
  }

  /**
   * 监听主题变化
   */
  watch(currentTheme, (newTheme) => {
    updateTheme(newTheme)
  })

  return {
    // 状态
    currentTheme: readonly(currentTheme),
    isDark: readonly(isDark),
    
    // 计算属性
    themeLabel,
    themeIcon,
    
    // 方法
    updateTheme,
    toggleTheme,
    initTheme
  }
} 