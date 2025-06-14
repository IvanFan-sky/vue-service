<!--
  应用顶部栏组件
  @description 包含面包屑导航、用户信息、主题切换、语言切换等功能
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <div class="app-header" :class="{ 'app-header--dark': isDark }">
    <!-- 左侧：面包屑导航 -->
    <div class="app-header__left">
      <el-breadcrumb separator="/" class="app-breadcrumb">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
          <el-icon v-if="item.icon" class="breadcrumb-icon">
            <component :is="item.icon" />
          </el-icon>
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧：工具栏 -->
    <div class="app-header__right">
      <!-- 主题切换 -->
      <el-tooltip :content="t('theme.switchTheme')" placement="bottom">
        <el-button class="header-action-btn" text @click="toggleTheme">
          <el-icon>
            <component :is="themeIconComponent" />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 语言切换 -->
      <el-dropdown @command="handleLanguageChange" class="language-dropdown">
        <el-button class="header-action-btn" text>
          <span class="language-text">{{ languageLabel }}</span>
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="lang in availableLanguages"
              :key="lang.value"
              :command="lang.value"
              :class="{ 'is-active': currentLanguage === lang.value }"
            >
              <span class="language-flag" :class="lang.flagClass">{{ lang.icon }}</span>
              <span>{{ lang.label }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 全屏切换 -->
      <el-tooltip :content="isFullscreen ? '退出全屏' : '进入全屏'" placement="bottom">
        <el-button class="header-action-btn" text @click="toggleFullscreen">
          <el-icon>
            <FullScreen v-if="!isFullscreen" />
            <Aim v-else />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 用户信息下拉菜单 -->
      <el-dropdown @command="handleUserCommand" class="user-dropdown">
        <div class="user-info">
          <el-avatar :size="32" :src="userInfo?.avatar" class="user-avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="user-name">{{ userInfo?.username || 'Guest' }}</span>
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              <span>{{ t('nav.profile') }}</span>
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              <span>{{ t('nav.systemSettings') }}</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              <span>{{ t('nav.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    ArrowDown,
    User,
    Setting,
    SwitchButton,
    FullScreen,
    Aim,
    Sunny,
    Moon,
    Monitor
  } from '@element-plus/icons-vue'
  import { useAuthStore } from '@/stores/auth'
  import { useTheme } from '@/composables/useTheme'
  import { useI18n } from '@/composables/useI18n'

  /**
   * 组件属性定义
   */
  interface Props {
    /** 是否折叠侧边栏 */
    collapsed?: boolean
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  withDefaults(defineProps<Props>(), {
    collapsed: false
  })

  /**
   * 组件事件定义
   */
  defineEmits<{
    toggleSidebar: []
  }>()

  // 路由和认证
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()

  // 主题和国际化
  const { toggleTheme, themeIcon, isDark } = useTheme()
  const { t, currentLanguage, languageLabel, switchLanguage, getAvailableLanguages } = useI18n()

  // 全屏状态
  const isFullscreen = ref(false)

  // 用户信息
  const userInfo = computed(() => authStore.user)

  /**
   * 主题图标组件映射
   */
  const themeIconComponent = computed(() => {
    const iconMap = {
      Sunny,
      Moon,
      Monitor
    }
    return iconMap[themeIcon.value as keyof typeof iconMap] || Sunny
  })

  /**
   * 可用语言列表
   */
  const availableLanguages = getAvailableLanguages()

  /**
   * 面包屑导航数据
   */
  const breadcrumbs = computed(() => {
    const { path } = route
    const breadcrumbList: Array<{ path: string; title: string; icon: string }> = []

    // 添加首页
    breadcrumbList.push({
      path: '/dashboard',
      title: t('nav.dashboard'),
      icon: 'Odometer'
    })

    // 处理用户管理页面
    if (path.startsWith('/user/')) {
      breadcrumbList.push({
        path: '/user',
        title: t('nav.userManagement'),
        icon: 'User'
      })

      if (path === '/user/list') {
        breadcrumbList.push({
          path: '/user/list',
          title: '用户列表',
          icon: 'UserFilled'
        })
      } else if (path === '/user/roles') {
        breadcrumbList.push({
          path: '/user/roles',
          title: '角色管理',
          icon: 'Avatar'
        })
      }
    }

    // 处理系统设置页面
    else if (path.startsWith('/system/')) {
      breadcrumbList.push({
        path: '/system',
        title: t('nav.systemSettings'),
        icon: 'Setting'
      })

      if (path === '/system/config') {
        breadcrumbList.push({
          path: '/system/config',
          title: '系统配置',
          icon: 'Tools'
        })
      } else if (path === '/system/logs') {
        breadcrumbList.push({
          path: '/system/logs',
          title: '系统日志',
          icon: 'Document'
        })
      }
    }

    // 处理其他页面
    else if (path === '/help') {
      breadcrumbList.push({
        path: '/help',
        title: '帮助中心',
        icon: 'QuestionFilled'
      })
    }

    // 如果是首页，移除重复的首页项
    if (path === '/dashboard' && breadcrumbList.length > 1) {
      return [breadcrumbList[0]]
    }

    return breadcrumbList
  })

  /**
   * 处理语言切换
   * @param language 目标语言
   */
  const handleLanguageChange = (language: string) => {
    switchLanguage(language as any)
    ElMessage.success(t('language.switchLanguage'))
  }

  /**
   * 切换全屏
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }

  /**
   * 处理用户下拉菜单命令
   * @param command 命令类型
   */
  const handleUserCommand = async (command: string) => {
    switch (command) {
      case 'profile':
        router.push('/user/profile')
        break

      case 'settings':
        router.push('/system/settings')
        break

      case 'logout':
        try {
          await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          })

          await authStore.logout()
          ElMessage.success(t('common.success'))
          router.push('/login')
        } catch (_error) {
          // 用户取消操作
        }
        break
    }
  }

  // 监听全屏状态变化
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
</script>

<style scoped lang="scss">
  @use '@/assets/styles/variables' as *;

  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $header-height;
    padding: 0 $spacing-lg;
    background: $color-white;
    border-bottom: 1px solid $border-color-base;
    box-shadow: $box-shadow-sm;
  }

  // 左侧区域
  .app-header__left {
    display: flex;
    align-items: center;
    flex: 1;
  }

  // 面包屑导航
  .app-breadcrumb {
    :deep(.el-breadcrumb__item) {
      .el-breadcrumb__inner {
        color: $text-color-regular;
        font-weight: 400;

        &:hover {
          color: $color-primary;
        }
      }

      &:last-child .el-breadcrumb__inner {
        color: $text-color-primary;
        font-weight: 500;
      }
    }

    .breadcrumb-icon {
      margin-right: $spacing-xs;
      font-size: $font-size-sm;
    }
  }

  // 右侧区域
  .app-header__right {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    flex-shrink: 0;
  }

  // 头部操作按钮
  .header-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: $border-radius-base;
    color: $text-color-regular;
    transition: all $transition-duration;
    border: none;
    background: transparent;
    cursor: pointer;

    &:hover {
      background-color: $background-color-hover;
      color: $color-primary;
    }

    .el-icon {
      font-size: $font-size-lg;
    }
  }

  // 语言切换下拉菜单
  .language-dropdown {
    .header-action-btn {
      width: auto;
      padding: 0 $spacing-sm;
      gap: $spacing-xs;
      min-width: 60px;
    }

    .language-text {
      font-size: $font-size-sm;
      color: $text-color-regular;
      white-space: nowrap;
    }

    .el-icon--right {
      margin-left: 4px;
    }

    :deep(.el-dropdown-menu__item) {
      .language-flag {
        margin-right: 8px;
      }

      &.is-active {
        color: $color-primary;
        background-color: rgba($color-primary, 0.1);
      }
    }
  }

  // 用户信息下拉菜单
  .user-dropdown {
    .user-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-base;
      cursor: pointer;
      transition: all $transition-duration;
      min-width: 120px;

      &:hover {
        background-color: $background-color-hover;
      }
    }

    .user-avatar {
      flex-shrink: 0;
    }

    .user-name {
      font-size: $font-size-sm;
      color: $text-color-primary;
      font-weight: 500;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-icon--right {
      margin-left: auto;
      flex-shrink: 0;
    }

    :deep(.el-dropdown-menu__item) {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-icon {
        font-size: 16px;
      }
    }
  }

  // 响应式设计优化
  @media (max-width: $breakpoint-xl) {
    .app-header {
      padding: 0 $spacing-md;
    }
  }

  @media (max-width: $breakpoint-lg) {
    .app-header {
      padding: 0 $spacing-sm;
    }

    .app-breadcrumb {
      :deep(.el-breadcrumb__item) {
        &:not(:last-child) {
          display: none;
        }
      }
    }

    .app-header__right {
      gap: $spacing-xs;
    }

    .header-action-btn {
      width: 32px;
      height: 32px;
    }

    .user-dropdown .user-info {
      min-width: 100px;

      .user-name {
        max-width: 80px;
      }
    }
  }

  @media (max-width: $breakpoint-md) {
    .app-header {
      padding: 0 $spacing-sm;
      height: 50px;
    }

    .app-breadcrumb {
      font-size: $font-size-sm;
    }

    .header-action-btn {
      width: 28px;
      height: 28px;

      .el-icon {
        font-size: 14px;
      }
    }

    .language-dropdown {
      .header-action-btn {
        min-width: 50px;
        padding: 0 $spacing-xs;
      }

      .language-text {
        font-size: 12px;
      }
    }

    .user-dropdown .user-info {
      min-width: 80px;
      padding: $spacing-xs;

      .user-name {
        font-size: 12px;
        max-width: 60px;
      }
    }
  }

  @media (max-width: $breakpoint-sm) {
    .app-header {
      padding: 0 $spacing-xs;
      height: 48px;
    }

    .app-header__left {
      flex: none;
      width: auto;
    }

    .app-breadcrumb {
      :deep(.el-breadcrumb__item) {
        &:not(:last-child) {
          display: none;
        }

        .breadcrumb-icon {
          display: none;
        }
      }
    }

    .app-header__right {
      gap: 2px;
    }

    .header-action-btn {
      width: 24px;
      height: 24px;

      .el-icon {
        font-size: 12px;
      }
    }

    .language-dropdown {
      .header-action-btn {
        min-width: 40px;
      }

      .language-text {
        display: none;
      }
    }

    .user-dropdown .user-info {
      min-width: 60px;

      .user-name {
        display: none;
      }
    }
  }

  // 深色主题适配
  .app-header--dark {
    background: #1f2937 !important;
    border-bottom-color: #374151 !important;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2) !important;

    .app-breadcrumb {
      :deep(.el-breadcrumb__item) {
        .el-breadcrumb__inner {
          color: #d1d5db !important;

          &:hover {
            color: $color-primary !important;
          }
        }

        &:last-child .el-breadcrumb__inner {
          color: #e5e7eb !important;
        }
      }
    }

    .header-action-btn {
      color: #d1d5db !important;

      &:hover {
        background-color: #374151 !important;
        color: $color-primary !important;
      }
    }

    .language-dropdown {
      .language-text {
        color: #d1d5db !important;
      }
    }

    .user-dropdown {
      .user-info {
        &:hover {
          background-color: #374151 !important;
        }
      }

      .user-name {
        color: #e5e7eb !important;
      }
    }
  }

  // 浅色主题适配（确保浅色主题样式正确）
  :global(html:not(.dark)) {
    .app-header {
      background: $color-white !important;
      border-bottom-color: $border-color-base !important;
      box-shadow: $box-shadow-sm !important;
    }

    .app-breadcrumb {
      :deep(.el-breadcrumb__item) {
        .el-breadcrumb__inner {
          color: $text-color-regular !important;

          &:hover {
            color: $color-primary !important;
          }
        }

        &:last-child .el-breadcrumb__inner {
          color: $text-color-primary !important;
        }
      }
    }

    .header-action-btn {
      color: $text-color-regular !important;

      &:hover {
        background-color: $background-color-hover !important;
        color: $color-primary !important;
      }
    }

    .language-dropdown {
      .language-text {
        color: $text-color-regular !important;
      }
    }

    .user-dropdown {
      .user-info {
        &:hover {
          background-color: $background-color-hover !important;
        }
      }

      .user-name {
        color: $text-color-primary !important;
      }
    }
  }
</style>
