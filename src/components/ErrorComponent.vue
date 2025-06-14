<!--
  错误组件
  @description 用于显示组件加载失败时的错误信息
  @author 开发团队
  @date 2024-12-14
  @version 1.0.0
-->

<template>
  <div class="error-component" :class="{ 'error-component--dark': isDark }">
    <div class="error-content">
      <el-icon class="error-icon" size="64">
        <WarningFilled />
      </el-icon>
      
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
      
      <div class="error-details" v-if="showDetails && details">
        <el-collapse>
          <el-collapse-item title="错误详情" name="details">
            <pre class="error-stack">{{ details }}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
      
      <div class="error-actions">
        <el-button 
          type="primary" 
          @click="handleRetry"
          :loading="retrying"
          v-if="showRetry"
        >
          {{ retrying ? '重试中...' : '重试' }}
        </el-button>
        
        <el-button @click="handleGoBack" v-if="showGoBack">
          返回上页
        </el-button>
        
        <el-button @click="handleGoHome" v-if="showGoHome">
          返回首页
        </el-button>
        
        <el-button 
          @click="handleReport" 
          type="info" 
          plain
          v-if="showReport"
        >
          报告问题
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useTheme } from '@/composables/useTheme'

/**
 * 组件属性
 */
interface Props {
  /** 错误标题 */
  title?: string
  /** 错误消息 */
  message?: string
  /** 错误详情 */
  details?: string
  /** 是否显示重试按钮 */
  showRetry?: boolean
  /** 是否显示返回按钮 */
  showGoBack?: boolean
  /** 是否显示首页按钮 */
  showGoHome?: boolean
  /** 是否显示报告按钮 */
  showReport?: boolean
  /** 是否显示错误详情 */
  showDetails?: boolean
  /** 重试回调函数 */
  onRetry?: () => void | Promise<void>
  /** 错误类型 */
  errorType?: 'component' | 'network' | 'permission' | 'unknown'
}

const props = withDefaults(defineProps<Props>(), {
  title: '加载失败',
  message: '组件加载时发生错误，请稍后重试',
  showRetry: true,
  showGoBack: true,
  showGoHome: false,
  showReport: false,
  showDetails: false,
  errorType: 'component'
})

/**
 * 组件状态
 */
const router = useRouter()
const { isDark } = useTheme()
const retrying = ref(false)

/**
 * 计算属性
 */
const errorTitle = computed(() => {
  const titles = {
    component: '组件加载失败',
    network: '网络连接错误',
    permission: '权限不足',
    unknown: '未知错误'
  }
  return props.title || titles[props.errorType]
})

const errorMessage = computed(() => {
  const messages = {
    component: '组件加载时发生错误，请检查网络连接或稍后重试',
    network: '网络连接失败，请检查网络设置后重试',
    permission: '您没有权限访问此内容，请联系管理员',
    unknown: '发生了未知错误，请稍后重试或联系技术支持'
  }
  return props.message || messages[props.errorType]
})

/**
 * 事件处理
 */
const handleRetry = async () => {
  if (!props.onRetry) {
    window.location.reload()
    return
  }

  try {
    retrying.value = true
    await props.onRetry()
    ElMessage.success('重试成功')
  } catch (error) {
    console.error('重试失败:', error)
    ElMessage.error('重试失败，请稍后再试')
  } finally {
    retrying.value = false
  }
}

const handleGoBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const handleGoHome = () => {
  router.push('/')
}

const handleReport = () => {
  // 这里可以集成错误报告系统
  const errorInfo = {
    title: props.title,
    message: props.message,
    details: props.details,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  }
  
  console.log('错误报告:', errorInfo)
  ElMessage.info('错误报告已记录，感谢您的反馈')
  
  // 可以发送到错误收集服务
  // errorReportService.report(errorInfo)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.error-component {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: $spacing-xl;
  background: $background-color-base;
  
  &--dark {
    background: $dark-background-color-base;
    color: $dark-text-color-primary;
  }
}

.error-content {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-icon {
  color: $color-warning;
  margin-bottom: $spacing-lg;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: $text-color-primary;
  margin-bottom: $spacing-md;
  
  .error-component--dark & {
    color: $dark-text-color-primary;
  }
}

.error-message {
  font-size: 16px;
  color: $text-color-regular;
  margin-bottom: $spacing-xl;
  line-height: 1.6;
  
  .error-component--dark & {
    color: $dark-text-color-regular;
  }
}

.error-details {
  margin-bottom: $spacing-xl;
  text-align: left;
}

.error-stack {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: $text-color-secondary;
  background: $background-color-light;
  padding: $spacing-md;
  border-radius: $border-radius-base;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  
  .error-component--dark & {
    color: $dark-text-color-secondary;
    background: $dark-background-color-light;
  }
}

.error-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
  
  .el-button {
    min-width: 100px;
  }
}

// 响应式设计
@media (max-width: $breakpoint-md) {
  .error-component {
    padding: $spacing-lg;
    min-height: 300px;
  }
  
  .error-title {
    font-size: 20px;
  }
  
  .error-message {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
    
    .el-button {
      width: 100%;
      max-width: 200px;
    }
  }
}
</style>
