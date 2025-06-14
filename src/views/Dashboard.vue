<!--
  仪表盘页面组件
  @description 系统首页，显示用户信息和系统概览
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <div class="dashboard" :class="{ 'dashboard--dark': isDark }">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="user-info">
          <div class="avatar">
            <img v-if="user?.avatar" :src="user.avatar" :alt="user.username" />
            <div v-else class="avatar-placeholder">
              {{ user?.username?.charAt(0)?.toUpperCase() }}
            </div>
          </div>
          <div class="user-details">
            <h1 class="welcome-title">
              {{ t('dashboard.welcome') }}，{{ user?.username || t('user.username') }}！
            </h1>
            <p class="welcome-subtitle">
              {{ t('dashboard.todayIs') }} {{ currentDate }}，{{ t('dashboard.workHappy') }}
            </p>
            <div class="user-meta">
              <span class="role-badge" :class="`role-${user?.role}`">
                {{ getRoleText(user?.role) }}
              </span>
              <span class="login-time"> 上次登录：{{ formatTime(user?.lastLoginTime) }} </span>
            </div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="quick-actions">
          <button class="action-btn" @click="handleLogout">
            <i class="icon-logout"></i>
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary">
            <i class="icon-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">1,234</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-success">
            <i class="icon-activity"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">98.5%</div>
            <div class="stat-label">系统可用性</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-warning">
            <i class="icon-clock"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">24h</div>
            <div class="stat-label">平均响应时间</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-info">
            <i class="icon-database"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">2.1GB</div>
            <div class="stat-label">数据存储</div>
          </div>
        </div>
      </div>
    </div>

    <!-- API模式信息 -->
    <div class="api-info-section">
      <div class="info-card">
        <h3 class="info-title">当前API配置</h3>
        <div class="info-content">
          <div class="info-item">
            <span class="info-label">运行模式：</span>
            <span :class="['info-value', `mode-${apiMode}`]">
              {{ apiMode === 'mock' ? '模拟数据模式' : '真实接口模式' }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">API地址：</span>
            <span class="info-value">{{ apiBaseUrl }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">环境：</span>
            <span class="info-value">{{ nodeEnv }}</span>
          </div>
        </div>

        <!-- 模拟模式提示 -->
        <div v-if="apiMode === 'mock'" class="mock-notice">
          <i class="icon-info"></i>
          <span>当前使用模拟数据，所有操作仅在本地生效</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useTheme } from '@/composables/useTheme'
  import { useI18n } from '@/composables/useI18n'
  import { getApiMode } from '@/api/auth'
  import type { UserRole } from '@/types'

  /**
   * 路由实例
   */
  const router = useRouter()

  /**
   * 认证状态管理
   */
  const authStore = useAuthStore()

  /**
   * 主题状态
   */
  const { isDark } = useTheme()

  /**
   * 国际化
   */
  const { t } = useI18n()

  /**
   * 响应式数据
   */
  const currentDate = ref('')
  const apiMode = ref<'mock' | 'real'>('real')
  const apiBaseUrl = ref('')
  const nodeEnv = ref('')

  /**
   * 计算属性
   */
  const user = computed(() => authStore.user)

  /**
   * 获取角色显示文本
   */
  const getRoleText = (role?: UserRole): string => {
    const roleMap = {
      admin: '管理员',
      user: '普通用户',
      guest: '访客'
    }
    return role ? roleMap[role] : '未知角色'
  }

  /**
   * 格式化时间
   */
  const formatTime = (time?: string): string => {
    if (!time) return '暂无记录'

    try {
      const date = new Date(time)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return '时间格式错误'
    }
  }

  /**
   * 处理退出登录
   */
  const handleLogout = async () => {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  /**
   * 初始化页面数据
   */
  const initPageData = () => {
    // 设置当前日期
    currentDate.value = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })

    // 获取API配置信息
    apiMode.value = getApiMode()
    apiBaseUrl.value = import.meta.env['VITE_API_BASE_URL'] || '未配置'
    nodeEnv.value = import.meta.env['VITE_NODE_ENV'] || 'development'
  }

  /**
   * 组件挂载时初始化
   */
  onMounted(() => {
    initPageData()

    // 开发环境下打印调试信息
    if (import.meta.env.DEV) {
      console.log('📊 仪表盘页面已加载')
      console.log('👤 当前用户:', user.value)
      console.log('🔧 API模式:', apiMode.value)
    }
  })
</script>

<style scoped lang="scss">
  @import '@/assets/styles/variables.scss';

  .dashboard {
    width: 100%;
    min-height: 100%;
  }

  // 欢迎区域
  .welcome-section {
    background: linear-gradient(135deg, $color-primary 0%, lighten($color-primary, 10%) 100%);
    border-radius: $border-radius-lg;
    padding: $spacing-xl;
    margin-bottom: $spacing-lg;
    color: $color-white;
    box-shadow: $box-shadow-md;
  }

  .welcome-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: $spacing-lg;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: $border-radius-full;
    overflow: hidden;
    border: 3px solid rgba(255, 255, 255, 0.3);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-2xl;
    font-weight: 600;
    color: $color-white;
  }

  .user-details {
    flex: 1;
  }

  .welcome-title {
    font-size: $font-size-3xl;
    font-weight: 600;
    margin: 0 0 $spacing-sm 0;
    color: $color-white;
  }

  .welcome-subtitle {
    font-size: $font-size-lg;
    margin: 0 0 $spacing-md 0;
    opacity: 0.9;
  }

  .user-meta {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    flex-wrap: wrap;
  }

  .role-badge {
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-base;
    font-size: $font-size-sm;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.2);
    color: $color-white;

    &.role-admin {
      background: rgba(255, 193, 7, 0.2);
    }

    &.role-user {
      background: rgba(40, 167, 69, 0.2);
    }
  }

  .login-time {
    font-size: $font-size-sm;
    opacity: 0.8;
  }

  .quick-actions {
    display: flex;
    gap: $spacing-sm;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-md;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: $border-radius-base;
    color: $color-white;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all $transition-duration;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  }

  // 统计卡片区域
  .stats-section {
    margin-bottom: $spacing-lg;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-lg;
  }

  .stat-card {
    background: $color-white;
    border-radius: $border-radius-lg;
    padding: $spacing-lg;
    box-shadow: $box-shadow-base;
    display: flex;
    align-items: center;
    gap: $spacing-md;
    transition: all $transition-duration;

    &:hover {
      box-shadow: $box-shadow-lg;
      transform: translateY(-4px);
    }
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-2xl;
    color: $color-white;

    &.stat-icon-primary {
      background: linear-gradient(135deg, $color-primary 0%, lighten($color-primary, 10%) 100%);
    }

    &.stat-icon-success {
      background: linear-gradient(135deg, $color-success 0%, lighten($color-success, 10%) 100%);
    }

    &.stat-icon-warning {
      background: linear-gradient(135deg, $color-warning 0%, lighten($color-warning, 10%) 100%);
    }

    &.stat-icon-info {
      background: linear-gradient(135deg, $color-info 0%, lighten($color-info, 10%) 100%);
    }
  }

  .stat-content {
    flex: 1;
  }

  .stat-value {
    font-size: $font-size-3xl;
    font-weight: 600;
    color: $text-color-primary;
    margin-bottom: $spacing-xs;
  }

  .stat-label {
    font-size: $font-size-base;
    color: $text-color-secondary;
  }

  // API信息区域
  .api-info-section {
    margin-bottom: $spacing-lg;
  }

  .info-card {
    background: $color-white;
    border-radius: $border-radius-lg;
    padding: $spacing-lg;
    box-shadow: $box-shadow-base;
  }

  .info-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-color-primary;
    margin: 0 0 $spacing-md 0;
  }

  .info-content {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  .info-label {
    font-weight: 500;
    color: $text-color-secondary;
    min-width: 80px;
  }

  .info-value {
    color: $text-color-primary;

    &.mode-mock {
      color: $color-warning;
      font-weight: 500;
    }

    &.mode-real {
      color: $color-success;
      font-weight: 500;
    }
  }

  .mock-notice {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-top: $spacing-md;
    padding: $spacing-sm;
    background: rgba($color-warning, 0.1);
    border: 1px solid rgba($color-warning, 0.2);
    border-radius: $border-radius-base;
    color: $color-warning;
    font-size: $font-size-sm;
  }

  // 响应式设计
  @media (max-width: $breakpoint-lg) {
    .welcome-content {
      flex-direction: column;
      text-align: center;
    }

    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: $spacing-md;
    }
  }

  @media (max-width: $breakpoint-md) {
    .welcome-section {
      padding: $spacing-lg;
    }

    .welcome-title {
      font-size: $font-size-2xl;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .user-info {
      flex-direction: column;
      text-align: center;
    }

    .avatar {
      width: 60px;
      height: 60px;
    }
  }

  @media (max-width: $breakpoint-sm) {
    .welcome-section {
      padding: $spacing-md;
    }

    .user-meta {
      justify-content: center;
    }
  }

  // 深色主题适配
  .dashboard--dark {
    background: #111827 !important;

    .stat-card {
      background: #1f2937 !important;
      box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.3),
        0 1px 2px 0 rgba(0, 0, 0, 0.2) !important;

      &:hover {
        box-shadow:
          0 10px 15px -3px rgba(0, 0, 0, 0.3),
          0 4px 6px -2px rgba(0, 0, 0, 0.2) !important;
      }
    }

    .stat-value {
      color: #e5e7eb !important;
    }

    .stat-label {
      color: #9ca3af !important;
    }

    .info-card {
      background: #1f2937 !important;
      box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.3),
        0 1px 2px 0 rgba(0, 0, 0, 0.2) !important;
    }

    .info-title {
      color: #e5e7eb !important;
    }

    .info-label {
      color: #9ca3af !important;
    }

    .info-value {
      color: #e5e7eb !important;
    }

    .mock-notice {
      background: rgba($color-warning, 0.2) !important;
      border-color: rgba($color-warning, 0.3) !important;
    }
  }

  // 浅色主题适配
  :global(html:not(.dark)) {
    .dashboard {
      background: transparent !important;
    }

    .stat-card {
      background: $color-white !important;
      box-shadow: $box-shadow-md !important;

      &:hover {
        box-shadow: $box-shadow-lg !important;
      }
    }

    .stat-value {
      color: $text-color-primary !important;
    }

    .stat-label {
      color: $text-color-secondary !important;
    }

    .info-card {
      background: $color-white !important;
      box-shadow: $box-shadow-base !important;
    }

    .info-title {
      color: $text-color-primary !important;
    }

    .info-label {
      color: $text-color-secondary !important;
    }

    .info-value {
      color: $text-color-primary !important;
    }

    .mock-notice {
      background: rgba($color-warning, 0.1) !important;
      border-color: rgba($color-warning, 0.3) !important;
    }
  }

  // 图标样式
  .icon-logout::before {
    content: '🚪';
  }
  .icon-users::before {
    content: '👥';
  }
  .icon-activity::before {
    content: '📈';
  }
  .icon-clock::before {
    content: '⏰';
  }
  .icon-database::before {
    content: '💾';
  }
  .icon-info::before {
    content: 'ℹ️';
  }
</style>
