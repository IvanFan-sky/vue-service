/**
 * 全局指令注册
 * @description 注册所有自定义指令
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import type { App } from 'vue'
import { lazyLoad, lazyLoadBg } from './lazyLoad'

/**
 * 注册全局指令
 * @param app Vue应用实例
 */
export function setupDirectives(app: App) {
  // 图片懒加载指令
  app.directive('lazy', lazyLoad)

  // 背景图片懒加载指令
  app.directive('lazy-bg', lazyLoadBg)
}

export default setupDirectives
