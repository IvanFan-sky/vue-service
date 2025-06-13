/**
 * 应用程序入口文件
 * @description Vue应用的主入口，配置全局插件和样式
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import { createApp } from 'vue'
import App from './App.vue'

// 导入全局样式
import './assets/styles/index.scss'

// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入状态管理
import { createPinia } from 'pinia'

// 导入路由
import router from './router'

// 导入主题系统
import { useTheme } from './composables/useTheme'

// 导入认证状态管理
import { useAuthStore } from './stores/auth'

// 导入国际化系统
import { useI18n } from './composables/useI18n'

// 导入Element Plus中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

/**
 * 创建Vue应用实例
 */
const app = createApp(App)

/**
 * 注册Element Plus图标
 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

/**
 * 安装插件
 */
// Element Plus UI组件库
app.use(ElementPlus)

// Pinia状态管理
const pinia = createPinia()
app.use(pinia)

/**
 * 初始化国际化系统
 */
const { currentLanguage } = useI18n()

// 根据当前语言配置Element Plus
const elementPlusLocale = currentLanguage.value === 'zh-cn' ? zhCn : en

// 配置Element Plus
app.use(ElementPlus, {
  locale: elementPlusLocale,
  size: 'default',
  zIndex: 3000
})

// Vue Router路由
app.use(router)

/**
 * 初始化主题系统
 */
const { initTheme } = useTheme()
initTheme()

/**
 * 初始化认证状态
 */
// 需要在Pinia安装后初始化认证状态
const initAuth = () => {
  const authStore = useAuthStore()
  // authStore会自动从localStorage恢复用户信息
}

// 在下一个tick中初始化认证状态，确保Pinia已经安装
setTimeout(initAuth, 0)

/**
 * 挂载应用到DOM
 */
app.mount('#app')

// 开发环境下的调试信息
if (import.meta.env.DEV) {
  console.log('🚀 Vue应用已启动')
  console.log('📦 当前环境:', import.meta.env.MODE)
  console.log('🔗 API地址:', import.meta.env.VITE_API_BASE_URL)
}
