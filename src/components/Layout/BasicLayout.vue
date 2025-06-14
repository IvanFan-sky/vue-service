<!--
  基础布局组件
  @description 应用的主要布局框架，包含侧边栏、头部导航和内容区域
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <div class="basic-layout" :class="{ 'basic-layout--dark': isDark }">
    <!-- 侧边栏 -->
    <AppSidebar
      :collapsed="sidebarCollapsed"
      @toggle="handleSidebarToggle"
      class="layout-sidebar"
    />

    <!-- 主要内容区域 -->
    <div class="layout-container" :class="{ 'is-collapsed': sidebarCollapsed }">
      <!-- 头部导航 -->
      <AppHeader
        :collapsed="sidebarCollapsed"
        @toggle-sidebar="handleSidebarToggle"
        class="layout-header"
      />

      <!-- 页面内容 -->
      <main class="layout-main">
        <div class="main-content">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import AppSidebar from '@/components/Layout/AppSidebar.vue'
  import AppHeader from '@/components/Layout/AppHeader.vue'
  import { useTheme } from '@/composables/useTheme'

  /**
   * 主题状态
   */
  const { isDark } = useTheme()

  /**
   * 侧边栏状态管理
   */
  const sidebarCollapsed = ref(false)

  /**
   * 处理侧边栏折叠切换
   */
  const handleSidebarToggle = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value

    // 保存状态到本地存储
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed.value))
  }

  /**
   * 初始化侧边栏状态
   */
  const initSidebarState = () => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      sidebarCollapsed.value = saved === 'true'
    }
  }

  // 初始化
  onMounted(() => {
    initSidebarState()
  })
</script>

<style scoped lang="scss">
  @use '@/assets/styles/variables' as *;

  .basic-layout {
    display: flex;
    min-height: 100vh;
    background: $background-color-base;
    position: relative;
  }

  // 侧边栏
  .layout-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1001;
    height: 100vh;
    transition: all $transition-duration;
  }

  // 主要容器
  .layout-container {
    flex: 1;
    margin-left: $sidebar-width;
    display: flex;
    flex-direction: column;
    transition: margin-left $transition-duration;
    min-height: 100vh;

    &.is-collapsed {
      margin-left: $sidebar-collapsed-width;
    }
  }

  // 头部导航
  .layout-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: $color-white;
    border-bottom: 1px solid $border-color-base;
    box-shadow: $box-shadow-sm;
    height: $header-height;
    flex-shrink: 0;
  }

  // 主要内容区域
  .layout-main {
    flex: 1;
    overflow: auto;
    background: $background-color-base;

    .main-content {
      padding: $spacing-lg;
      min-height: calc(100vh - #{$header-height});
      width: 100%;
    }
  }

  // 响应式设计优化
  @media (max-width: $breakpoint-xl) {
    .main-content {
      padding: $spacing-lg $spacing-md;
    }
  }

  @media (max-width: $breakpoint-lg) {
    .layout-container {
      margin-left: 0;

      &.is-collapsed {
        margin-left: 0;
      }
    }

    .layout-sidebar {
      transform: translateX(-100%);
      transition: transform $transition-duration;

      &:not(.is-collapsed) {
        transform: translateX(0);
      }
    }

    .main-content {
      padding: $spacing-md;
    }

    // 移动端遮罩层
    .layout-sidebar:not(.is-collapsed)::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
  }

  @media (max-width: $breakpoint-md) {
    .layout-header {
      height: 50px;
      padding: 0 $spacing-sm;
    }

    .layout-main {
      .main-content {
        padding: $spacing-sm;
        min-height: calc(100vh - 50px);
      }
    }
  }

  @media (max-width: $breakpoint-sm) {
    .layout-header {
      height: 48px;
      padding: 0 $spacing-xs;
    }

    .layout-main {
      .main-content {
        padding: $spacing-xs;
        min-height: calc(100vh - 48px);
      }
    }
  }

  // 移动端侧边栏优化
  @media (max-width: $breakpoint-lg) {
    .layout-sidebar {
      width: $sidebar-width;
      box-shadow: $box-shadow-lg;

      &.is-collapsed {
        transform: translateX(-100%);
      }
    }
  }

  // 深色主题适配
  .basic-layout--dark {
    background: #111827 !important;

    .layout-main {
      background: #111827 !important;
    }

    .layout-header {
      background: #1f2937 !important;
      border-bottom-color: #374151 !important;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2) !important;
    }
  }

  // 浅色主题适配
  :global(html:not(.dark)) {
    .basic-layout {
      background: $background-color-base !important;
    }

    .layout-main {
      background: $background-color-base !important;
    }

    .layout-header {
      background: $color-white !important;
      border-bottom-color: $border-color-base !important;
      box-shadow: $box-shadow-sm !important;
    }
  }
</style>
