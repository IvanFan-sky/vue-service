import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RouteMeta } from '@/types'
import { routeLazyLoad, smartPreload } from '@/utils/lazyLoad'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: routeLazyLoad('@/views/Login.vue', 'login', {
      delay: 100,
      preload: true
    }),
    meta: {
      title: '登录',
      requireAuth: false,
      hidden: true
    } as RouteMeta,
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard',
    component: routeLazyLoad('@/components/Layout/BasicLayout.vue', 'layout', {
      delay: 50,
      preload: true
    }),
    meta: {
      title: '首页',
      requireAuth: true
    } as RouteMeta,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: routeLazyLoad('@/views/Dashboard.vue', 'dashboard', {
          delay: 100,
          preload: true
        }),
        meta: {
          title: '仪表盘',
          icon: 'Dashboard',
          requireAuth: true
        } as RouteMeta,
      },
      {
        path: '/user/list',
        name: 'UserManagement',
        component: routeLazyLoad('@/views/UserManagement.vue', 'user-management', {
          delay: 150
        }),
        meta: {
          title: '用户列表',
          icon: 'UserFilled',
          requireAuth: true,
          breadcrumb: [
            { title: '用户管理', path: '/user' },
            { title: '用户列表', path: '/user/list' }
          ]
        } as RouteMeta,
      }
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: routeLazyLoad('@/views/404.vue', 'error', {
      delay: 100
    }),
    meta: {
      title: '页面不存在',
      hidden: true
    } as RouteMeta,
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 路由前置守卫
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  if (to.meta?.['title']) {
    document.title = `${to.meta['title']} - Vue Service`
  }

  // 如果页面需要认证
  if (to.meta?.['requireAuth']) {
    if (!authStore.token) {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
      return
    }
    
    // 已登录但没有用户信息，获取用户信息
    if (!authStore.user) {
      try {
        await authStore.fetchUserInfo()
      } catch (error) {
        // 获取用户信息失败，跳转到登录页
        next('/login')
        return
      }
    }
  }

  // 如果已登录访问登录页，跳转到首页
  if (to.path === '/login' && authStore.token) {
    next('/')
    return
  }

  next()
})

// 路由后置守卫
router.afterEach((to) => {
  // 智能预加载相关路由
  const routePreloadMap: Record<string, string[]> = {
    '/login': ['/dashboard'],
    '/dashboard': ['/user/list'],
    '/user/list': ['/dashboard']
  }

  const preloadRoutes = routePreloadMap[to.path]
  if (preloadRoutes) {
    // 延迟预加载，避免影响当前页面性能
    setTimeout(() => {
      smartPreload(to.path, routePreloadMap)
    }, 1000)
  }
})

export default router 