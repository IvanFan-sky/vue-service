<!--
  登录页面组件
  @description 用户登录界面，支持用户名密码登录、记住登录状态等功能
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="bg-shape bg-shape-1"></div>
      <div class="bg-shape bg-shape-2"></div>
      <div class="bg-shape bg-shape-3"></div>
    </div>

    <!-- 登录表单卡片 -->
    <div class="login-card">
      <!-- 头部Logo和标题 -->
      <div class="login-header">
        <div class="logo">
          <img src="/logo.svg" alt="Logo" class="logo-image" />
        </div>
        <h1 class="login-title">Vue Service</h1>
        <p class="login-subtitle">欢迎回来，请登录您的账户</p>
      </div>

      <!-- 登录表单 -->
      <form class="login-form" @submit.prevent="handleLogin">
        <!-- 用户名输入框 -->
        <div class="form-group">
          <label for="username" class="form-label">用户名</label>
          <div class="input-wrapper">
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              class="form-input"
              placeholder="请输入用户名"
              :disabled="loading"
              required
            />
            <i class="input-icon icon-user"></i>
          </div>
        </div>

        <!-- 密码输入框 -->
        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <div class="input-wrapper">
            <input
              id="password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请输入密码"
              :disabled="loading"
              required
            />
            <i class="input-icon icon-lock"></i>
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :disabled="loading"
            >
              <i :class="showPassword ? 'icon-eye-off' : 'icon-eye'"></i>
            </button>
          </div>
        </div>

        <!-- 记住登录和忘记密码 -->
        <div class="form-options">
          <label class="checkbox-wrapper">
            <input
              v-model="loginForm.rememberMe"
              type="checkbox"
              class="checkbox-input"
              :disabled="loading"
            />
            <span class="checkbox-label">记住登录状态</span>
          </label>
          <a href="#" class="forgot-password" @click.prevent="handleForgotPassword"> 忘记密码？ </a>
        </div>

        <!-- 登录按钮 -->
        <button
          type="submit"
          class="login-button"
          :disabled="loading || !isFormValid"
          :class="{ loading }"
        >
          <span v-if="loading" class="loading-spinner"></span>
          <span>{{ loading ? '登录中...' : '登录' }}</span>
        </button>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message">
          <i class="icon-alert-circle"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </form>

      <!-- 底部信息 -->
      <div class="login-footer">
        <div class="api-mode-indicator">
          <span class="mode-label">当前模式:</span>
          <span :class="['mode-badge', `mode-${apiMode}`]">
            {{ apiMode === 'mock' ? '模拟数据' : '真实接口' }}
          </span>
        </div>

        <!-- 测试账号提示（仅模拟模式显示） -->
        <div v-if="apiMode === 'mock'" class="test-accounts">
          <p class="test-title">测试账号：</p>
          <div class="account-list">
            <div class="account-item" @click="fillTestAccount('admin')">
              <strong>admin</strong> / 123456 (管理员)
            </div>
            <div class="account-item" @click="fillTestAccount('user')">
              <strong>user</strong> / 123456 (普通用户)
            </div>
            <div class="account-item" @click="fillTestAccount('guest')">
              <strong>guest</strong> / 123456 (访客)
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { getApiMode } from '@/api/auth'
  import type { LoginForm } from '@/types'

  /**
   * 路由实例
   */
  const router = useRouter()

  /**
   * 认证状态管理
   */
  const authStore = useAuthStore()

  /**
   * 登录表单数据
   */
  const loginForm = ref<LoginForm>({
    username: '',
    password: '',
    rememberMe: false
  })

  /**
   * 组件状态
   */
  const loading = ref(false)
  const showPassword = ref(false)
  const errorMessage = ref('')
  const apiMode = ref<'mock' | 'real'>('real')

  /**
   * 表单验证
   */
  const isFormValid = computed(() => {
    return loginForm.value.username.trim() !== '' && loginForm.value.password.trim() !== ''
  })

  /**
   * 处理登录
   */
  const handleLogin = async () => {
    if (!isFormValid.value || loading.value) {
      return
    }

    loading.value = true
    errorMessage.value = ''

    try {
      await authStore.login(loginForm.value.username, loginForm.value.password)

      // 登录成功，跳转到首页
      router.push('/')
    } catch (error: any) {
      console.error('登录失败:', error)
      errorMessage.value = error.message || '登录失败，请检查用户名和密码'
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理忘记密码
   */
  const handleForgotPassword = () => {
    // TODO: 实现忘记密码功能
    alert('忘记密码功能待实现')
  }

  /**
   * 填充测试账号（仅模拟模式）
   */
  const fillTestAccount = (username: string) => {
    if (apiMode.value === 'mock') {
      loginForm.value.username = username
      loginForm.value.password = '123456'
    }
  }

  /**
   * 组件挂载时初始化
   */
  onMounted(() => {
    // 获取当前API模式
    apiMode.value = getApiMode()

    // 如果已经登录，直接跳转到首页
    if (authStore.isAuthenticated) {
      router.push('/')
    }

    // 开发环境下打印调试信息
    if (import.meta.env.DEV) {
      console.log('🔐 登录页面已加载')
      console.log(`📡 API模式: ${apiMode.value}`)
    }
  })
</script>

<style scoped lang="scss">
  @import '@/assets/styles/variables.scss';

  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    overflow: hidden;
  }

  // 背景装饰
  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .bg-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;

      &.bg-shape-1 {
        width: 200px;
        height: 200px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }

      &.bg-shape-2 {
        width: 150px;
        height: 150px;
        top: 60%;
        right: 15%;
        animation-delay: 2s;
      }

      &.bg-shape-3 {
        width: 100px;
        height: 100px;
        bottom: 20%;
        left: 20%;
        animation-delay: 4s;
      }
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  // 登录卡片
  .login-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
  }

  // 头部
  .login-header {
    text-align: center;
    margin-bottom: 32px;

    .logo {
      margin-bottom: 16px;

      .logo-image {
        width: 64px;
        height: 64px;
      }
    }

    .login-title {
      font-size: 28px;
      font-weight: 700;
      color: $text-color-primary;
      margin: 0 0 8px 0;
    }

    .login-subtitle {
      font-size: 16px;
      color: $text-color-secondary;
      margin: 0;
    }
  }

  // 表单
  .login-form {
    .form-group {
      margin-bottom: 24px;

      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: $text-color-primary;
        margin-bottom: 8px;
      }

      .input-wrapper {
        position: relative;

        .form-input {
          width: 100%;
          height: 48px;
          padding: 0 48px 0 16px;
          border: 2px solid $border-color-base;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;

          &:focus {
            outline: none;
            border-color: $color-primary;
            box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
          }

          &:disabled {
            background: $background-color-disabled;
            cursor: not-allowed;
          }

          &::placeholder {
            color: $text-color-placeholder;
          }
        }

        .input-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: $text-color-secondary;
          font-size: 18px;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: $text-color-secondary;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.3s ease;

          &:hover:not(:disabled) {
            color: $color-primary;
          }

          &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }
        }
      }
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;

      .checkbox-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;

        .checkbox-input {
          margin-right: 8px;
        }

        .checkbox-label {
          font-size: 14px;
          color: $text-color-secondary;
        }
      }

      .forgot-password {
        font-size: 14px;
        color: $color-primary;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .login-button {
      width: 100%;
      height: 48px;
      background: $color-primary;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      &:hover:not(:disabled) {
        background: darken($color-primary, 10%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba($color-primary, 0.3);
      }

      &:disabled {
        background: $background-color-disabled;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      &.loading {
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      }
    }

    .error-message {
      margin-top: 16px;
      padding: 12px;
      background: rgba($color-danger, 0.1);
      border: 1px solid rgba($color-danger, 0.3);
      border-radius: 8px;
      color: $color-danger;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  // 底部
  .login-footer {
    margin-top: 32px;
    text-align: center;

    .api-mode-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;

      .mode-label {
        font-size: 12px;
        color: $text-color-secondary;
      }

      .mode-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.mode-mock {
          background: rgba($color-warning, 0.1);
          color: $color-warning;
          border: 1px solid rgba($color-warning, 0.3);
        }

        &.mode-real {
          background: rgba($color-success, 0.1);
          color: $color-success;
          border: 1px solid rgba($color-success, 0.3);
        }
      }
    }

    .test-accounts {
      .test-title {
        font-size: 12px;
        color: $text-color-secondary;
        margin: 0 0 8px 0;
      }

      .account-list {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .account-item {
          font-size: 12px;
          color: $text-color-secondary;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.3s ease;

          &:hover {
            background: rgba($color-primary, 0.1);
            color: $color-primary;
          }

          strong {
            color: $text-color-primary;
          }
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 480px) {
    .login-container {
      padding: 16px;
    }

    .login-card {
      padding: 24px;
    }

    .login-header {
      .login-title {
        font-size: 24px;
      }

      .login-subtitle {
        font-size: 14px;
      }
    }
  }

  // 图标样式（使用CSS类模拟图标）
  .icon-user::before {
    content: '👤';
  }
  .icon-lock::before {
    content: '🔒';
  }
  .icon-eye::before {
    content: '👁';
  }
  .icon-eye-off::before {
    content: '🙈';
  }
  .icon-alert-circle::before {
    content: '⚠️';
  }
</style>
