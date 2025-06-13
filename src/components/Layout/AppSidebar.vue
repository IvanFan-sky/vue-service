<!--
  应用侧边栏组件
  @description 包含导航菜单、Logo等功能
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <div class="app-sidebar" :class="{ 'is-collapsed': collapsed }">
    <!-- Logo区域 -->
    <div class="sidebar-logo">
      <div class="logo-content">
        <img 
          v-if="!collapsed" 
          src="/logo.svg" 
          alt="Logo" 
          class="logo-image"
        >
        <img 
          v-else 
          src="/logo-mini.svg" 
          alt="Logo" 
          class="logo-image-mini"
        >
        <h3 v-if="!collapsed" class="logo-title">
          Vue Service
        </h3>
      </div>
    </div>

    <!-- 导航菜单 -->
    <el-scrollbar class="sidebar-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :unique-opened="true"
        class="sidebar-menu"
        background-color="transparent"
        text-color="var(--sidebar-text-color)"
        active-text-color="var(--sidebar-active-text-color)"
        router
      >
        <!-- 仪表盘 -->
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>{{ t('nav.dashboard') }}</template>
        </el-menu-item>

        <!-- 用户管理 -->
        <el-sub-menu index="user">
          <template #title>
            <el-icon><User /></el-icon>
            <span>{{ t('nav.userManagement') }}</span>
          </template>
          <el-menu-item index="/user/list">
            <el-icon><UserFilled /></el-icon>
            <template #title>用户列表</template>
          </el-menu-item>
          <el-menu-item index="/user/roles">
            <el-icon><Avatar /></el-icon>
            <template #title>角色管理</template>
          </el-menu-item>
        </el-sub-menu>

        <!-- 系统设置 -->
        <el-sub-menu index="system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>{{ t('nav.systemSettings') }}</span>
          </template>
          <el-menu-item index="/system/config">
            <el-icon><Tools /></el-icon>
            <template #title>系统配置</template>
          </el-menu-item>
          <el-menu-item index="/system/logs">
            <el-icon><Document /></el-icon>
            <template #title>系统日志</template>
          </el-menu-item>
        </el-sub-menu>

        <!-- 帮助中心 -->
        <el-menu-item index="/help">
          <el-icon><QuestionFilled /></el-icon>
          <template #title>帮助中心</template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>

    <!-- 折叠按钮 -->
    <div class="sidebar-toggle" @click="handleToggle">
      <el-icon class="toggle-icon">
        <Expand v-if="collapsed" />
        <Fold v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Odometer,
  User,
  UserFilled,
  Avatar,
  Setting,
  Tools,
  Document,
  QuestionFilled,
  Expand,
  Fold
} from '@element-plus/icons-vue'
import { useI18n } from '@/composables/useI18n'

/**
 * 组件属性定义
 */
interface Props {
  /** 是否折叠侧边栏 */
  collapsed?: boolean
}

withDefaults(defineProps<Props>(), {
  collapsed: false
})

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  toggle: []
}>()

// 路由和国际化
const route = useRoute()
const { t } = useI18n()

/**
 * 当前激活的菜单项
 */
const activeMenu = computed(() => {
  const { path } = route
  
  // 处理子路由的激活状态
  if (path.startsWith('/user/')) {
    return path
  }
  if (path.startsWith('/system/')) {
    return path
  }
  
  return path
})

/**
 * 处理侧边栏折叠切换
 */
const handleToggle = () => {
  emit('toggle')
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

// CSS变量定义
:root {
  --sidebar-text-color: rgba(255, 255, 255, 0.8);
  --sidebar-active-text-color: #ffffff;
  --sidebar-bg-color: #304156;
  --sidebar-hover-bg-color: rgba(255, 255, 255, 0.1);
}

.app-sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  width: $sidebar-width;
  height: 100vh;
  background: linear-gradient(180deg, #304156 0%, #263445 100%);
  transition: width $transition-duration;
  overflow: hidden;

  &.is-collapsed {
    width: $sidebar-collapsed-width;
  }
}

// Logo区域
.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $header-height;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  .logo-content {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  .logo-image,
  .logo-image-mini {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .logo-title {
    color: $color-white;
    font-size: $font-size-lg;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
  }
}

// 滚动区域
.sidebar-scrollbar {
  flex: 1;
  
  :deep(.el-scrollbar__view) {
    height: 100%;
  }
}

// 菜单样式
.sidebar-menu {
  border: none;
  background: transparent;
  
  // 菜单项
  :deep(.el-menu-item) {
    color: var(--sidebar-text-color);
    border-radius: 0;
    margin: 0 $spacing-sm;
    border-radius: $border-radius-base;
    
    &:hover {
      background-color: var(--sidebar-hover-bg-color);
      color: var(--sidebar-active-text-color);
    }
    
    &.is-active {
      background-color: $color-primary;
      color: var(--sidebar-active-text-color);
    }
  }
  
  // 子菜单
  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      color: var(--sidebar-text-color);
      border-radius: 0;
      margin: 0 $spacing-sm;
      border-radius: $border-radius-base;
      
      &:hover {
        background-color: var(--sidebar-hover-bg-color);
        color: var(--sidebar-active-text-color);
      }
    }
    
    .el-menu {
      background: rgba(0, 0, 0, 0.1);
    }
    
    .el-menu-item {
      background: transparent;
      
      &:hover {
        background-color: var(--sidebar-hover-bg-color);
      }
      
      &.is-active {
        background-color: $color-primary;
      }
    }
  }
  
  // 图标
  :deep(.el-icon) {
    margin-right: $spacing-sm;
    font-size: $font-size-lg;
  }
}

// 折叠按钮
.sidebar-toggle {
  position: absolute;
  bottom: $spacing-md;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $border-radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all $transition-duration;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .toggle-icon {
    color: $color-white;
    font-size: $font-size-lg;
  }
}

// 折叠状态下的样式调整
.app-sidebar.is-collapsed {
  .sidebar-menu {
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      padding: 0 calc((#{$sidebar-collapsed-width} - 24px) / 2);
      justify-content: center;
      
      .el-icon {
        margin-right: 0;
      }
    }
  }
}

// 响应式设计优化
@media (max-width: $breakpoint-xl) {
  .sidebar-menu {
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      padding: 0 16px;
    }
  }
}

@media (max-width: $breakpoint-lg) {
  .app-sidebar {
    z-index: 1002;
    box-shadow: $box-shadow-lg;
  }
  
  .sidebar-logo {
    height: 50px;
    
    .logo-content {
      gap: 8px;
    }
    
    .logo-image,
    .logo-image-mini {
      width: 28px;
      height: 28px;
    }
    
    .logo-title {
      font-size: 16px;
    }
  }
  
  .sidebar-menu {
    font-size: 14px;
    
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      height: 48px;
      line-height: 48px;
      padding: 0 16px;
    }
    
    :deep(.el-menu-item-group__title) {
      padding: 8px 16px;
      font-size: 12px;
    }
  }
  
  .sidebar-toggle {
    height: 40px;
    
    .toggle-icon {
      font-size: 16px;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .app-sidebar {
    width: 220px;
    
    &.is-collapsed {
      width: 60px;
    }
  }
  
  .sidebar-logo {
    height: 48px;
    
    .logo-image,
    .logo-image-mini {
      width: 24px;
      height: 24px;
    }
    
    .logo-title {
      font-size: 14px;
    }
  }
  
  .sidebar-menu {
    font-size: 13px;
    
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      height: 44px;
      line-height: 44px;
      padding: 0 12px;
    }
    
    :deep(.el-icon) {
      width: 18px;
      font-size: 16px;
    }
  }
  
  .sidebar-toggle {
    height: 36px;
    
    .toggle-icon {
      font-size: 14px;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .app-sidebar {
    width: 200px;
    
    &.is-collapsed {
      width: 56px;
    }
  }
  
  .sidebar-logo {
    height: 44px;
    padding: 0 8px;
    
    .logo-content {
      gap: 6px;
    }
    
    .logo-image,
    .logo-image-mini {
      width: 20px;
      height: 20px;
    }
    
    .logo-title {
      font-size: 13px;
    }
  }
  
  .sidebar-scrollbar {
    :deep(.el-scrollbar__view) {
      padding-bottom: 44px;
    }
  }
  
  .sidebar-menu {
    font-size: 12px;
    
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
    }
    
    :deep(.el-icon) {
      width: 16px;
      font-size: 14px;
      margin-right: 6px;
    }
    
    :deep(.el-sub-menu .el-menu-item) {
      padding-left: 30px;
    }
  }
  
  .sidebar-toggle {
    height: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    
    .toggle-icon {
      font-size: 12px;
    }
  }
}

// 移动端手势优化
@media (max-width: $breakpoint-lg) {
  .app-sidebar {
    // 添加触摸优化
    -webkit-overflow-scrolling: touch;
    
    // 防止选中文本
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  .sidebar-menu {
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      // 增加触摸目标尺寸
      min-height: 44px;
      
      // 触摸反馈
      &:active {
        background-color: rgba(255, 255, 255, 0.15);
      }
    }
  }
}

// 深色主题适配
:global(.dark) {
  .app-sidebar {
    // 深色主题保持原有的暗色背景
    background: linear-gradient(180deg, #304156 0%, #263445 100%);
    
    // 深色主题的CSS变量
    --sidebar-text-color: rgba(255, 255, 255, 0.8);
    --sidebar-active-text-color: #ffffff;
    --sidebar-bg-color: #304156;
    --sidebar-hover-bg-color: rgba(255, 255, 255, 0.1);
  }
  
  .sidebar-logo {
    border-bottom-color: rgba(255, 255, 255, 0.1);
    
    .logo-title {
      color: $color-white;
    }
  }
  
  .sidebar-toggle {
    background: rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .toggle-icon {
      color: $color-white;
    }
  }
}

// 浅色主题适配
:global(html:not(.dark)) {
  .app-sidebar {
    // 浅色主题使用亮色背景
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    border-right: 1px solid #e2e8f0;
    
    // 浅色主题的CSS变量
    --sidebar-text-color: #64748b;
    --sidebar-active-text-color: #1e293b;
    --sidebar-bg-color: #ffffff;
    --sidebar-hover-bg-color: #f1f5f9;
  }
  
  .sidebar-logo {
    border-bottom-color: #e2e8f0;
    
    .logo-title {
      color: #1e293b;
    }
  }
  
  .sidebar-menu {
    // 子菜单背景
    :deep(.el-sub-menu) {
      .el-menu {
        background: #f8fafc;
      }
    }
  }
  
  .sidebar-toggle {
    background: #f1f5f9;
    
    &:hover {
      background: #e2e8f0;
    }
    
    .toggle-icon {
      color: #64748b;
    }
  }
}
</style> 