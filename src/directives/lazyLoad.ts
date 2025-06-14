/**
 * 图片懒加载指令
 * @description 使用Intersection Observer API实现图片懒加载
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import type { Directive, DirectiveBinding } from 'vue'

interface LazyLoadElement extends HTMLImageElement {
  _observer?: IntersectionObserver
}

/**
 * 图片懒加载指令
 * 使用方法: v-lazy="imageUrl"
 */
export const lazyLoad: Directive = {
  mounted(el: LazyLoadElement, binding: DirectiveBinding) {
    // 创建Intersection Observer
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement

            // 设置图片源
            if (binding.value) {
              img.src = binding.value
            }

            // 移除loading类，添加loaded类
            img.classList.remove('lazy-loading')
            img.classList.add('lazy-loaded')

            // 停止观察
            observer.unobserve(img)
          }
        })
      },
      {
        // 当图片进入视口前50px时开始加载
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    // 添加loading类
    el.classList.add('lazy-loading')

    // 设置占位图片
    if (!el.src) {
      el.src =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
    }

    // 开始观察
    observer.observe(el)

    // 保存observer引用，用于清理
    el._observer = observer
  },

  updated(el: LazyLoadElement, binding: DirectiveBinding) {
    // 如果绑定值发生变化，更新图片源
    if (binding.value !== binding.oldValue) {
      if (el.classList.contains('lazy-loaded')) {
        // 如果已经加载过，直接更新src
        el.src = binding.value
      } else {
        // 如果还没加载，重新开始观察
        if (el._observer) {
          el._observer.unobserve(el)
          el._observer.observe(el)
        }
      }
    }
  },

  unmounted(el: LazyLoadElement) {
    // 清理observer
    if (el._observer) {
      el._observer.unobserve(el)
      el._observer.disconnect()
      delete el._observer
    }
  }
}

/**
 * 背景图片懒加载指令
 * 使用方法: v-lazy-bg="imageUrl"
 */
export const lazyLoadBg: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement

            // 设置背景图片
            if (binding.value) {
              element.style.backgroundImage = `url(${binding.value})`
            }

            // 移除loading类，添加loaded类
            element.classList.remove('lazy-bg-loading')
            element.classList.add('lazy-bg-loaded')

            // 停止观察
            observer.unobserve(element)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    // 添加loading类
    el.classList.add('lazy-bg-loading')

    // 开始观察
    observer.observe(el)

    // 保存observer引用
    ;(el as any)._bgObserver = observer
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value !== binding.oldValue) {
      if (el.classList.contains('lazy-bg-loaded')) {
        el.style.backgroundImage = `url(${binding.value})`
      }
    }
  },

  unmounted(el: HTMLElement) {
    const observer = (el as any)._bgObserver
    if (observer) {
      observer.unobserve(el)
      observer.disconnect()
      delete (el as any)._bgObserver
    }
  }
}

/**
 * 默认导出懒加载指令
 */
export default {
  lazyLoad,
  lazyLoadBg
}
