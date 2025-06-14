<!--
  系统设置页面
  @description 系统配置管理，包括基本设置、邮件配置、安全设置等
  @author 开发团队
  @date 2024-12-14
  @version 1.0.0
-->

<template>
  <div class="system-settings" :class="{ 'system-settings--dark': isDark }">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">系统设置</h1>
          <p class="page-description">管理系统配置和参数</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleSaveAll" :loading="saving">
            <el-icon><Check /></el-icon>
            保存所有设置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 系统信息卡片 -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>系统信息</h3>
          <el-button size="small" @click="loadSystemInfo">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <el-row :gutter="24">
        <el-col :span="8">
          <div class="info-item">
            <div class="info-label">系统名称</div>
            <div class="info-value">{{ systemInfo.name }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <div class="info-label">系统版本</div>
            <div class="info-value">{{ systemInfo.version }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <div class="info-label">构建时间</div>
            <div class="info-value">{{ systemInfo.buildTime }}</div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="8">
          <div class="info-item">
            <div class="info-label">运行环境</div>
            <div class="info-value">{{ systemInfo.environment }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <div class="info-label">操作系统</div>
            <div class="info-value">{{ systemInfo.server?.os }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <div class="info-label">运行时间</div>
            <div class="info-value">{{ systemInfo.server?.uptime }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 配置选项卡 -->
    <el-card class="config-card" shadow="never">
      <el-tabs v-model="activeTab" class="config-tabs">
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <el-form ref="basicFormRef" :model="basicConfig" label-width="120px" class="config-form">
            <el-form-item label="网站标题">
              <el-input v-model="basicConfig.siteTitle" placeholder="请输入网站标题" />
            </el-form-item>

            <el-form-item label="网站描述">
              <el-input
                v-model="basicConfig.siteDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入网站描述"
              />
            </el-form-item>

            <el-form-item label="网站关键词">
              <el-input
                v-model="basicConfig.siteKeywords"
                placeholder="请输入网站关键词，用逗号分隔"
              />
            </el-form-item>

            <el-form-item label="网站Logo">
              <div class="logo-upload">
                <el-upload
                  :show-file-list="false"
                  :before-upload="handleLogoUpload"
                  accept="image/*"
                  class="logo-uploader"
                >
                  <img v-if="basicConfig.siteLogo" :src="basicConfig.siteLogo" class="logo-image" />
                  <div v-else class="logo-placeholder">
                    <el-icon><Plus /></el-icon>
                    <div>上传Logo</div>
                  </div>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="备案号">
              <el-input v-model="basicConfig.icp" placeholder="请输入备案号" />
            </el-form-item>

            <el-form-item label="版权信息">
              <el-input v-model="basicConfig.copyright" placeholder="请输入版权信息" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 邮件设置 -->
        <el-tab-pane label="邮件设置" name="email">
          <el-form
            ref="emailFormRef"
            :model="emailConfig"
            :rules="emailRules"
            label-width="120px"
            class="config-form"
          >
            <el-form-item label="SMTP服务器" prop="host">
              <el-input v-model="emailConfig.host" placeholder="请输入SMTP服务器地址" />
            </el-form-item>

            <el-form-item label="SMTP端口" prop="port">
              <el-input-number
                v-model="emailConfig.port"
                :min="1"
                :max="65535"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="用户名" prop="username">
              <el-input v-model="emailConfig.username" placeholder="请输入邮箱用户名" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="emailConfig.password"
                type="password"
                show-password
                placeholder="请输入邮箱密码"
              />
            </el-form-item>

            <el-form-item label="启用SSL">
              <el-switch v-model="emailConfig.ssl" />
            </el-form-item>

            <el-form-item label="发件人邮箱" prop="fromEmail">
              <el-input v-model="emailConfig.fromEmail" placeholder="请输入发件人邮箱" />
            </el-form-item>

            <el-form-item label="发件人名称">
              <el-input v-model="emailConfig.fromName" placeholder="请输入发件人名称" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleTestEmail" :loading="testingEmail">
                测试邮件发送
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <el-form
            ref="securityFormRef"
            :model="securityConfig"
            label-width="150px"
            class="config-form"
          >
            <el-form-item label="密码最小长度">
              <el-input-number
                v-model="securityConfig.passwordMinLength"
                :min="6"
                :max="20"
                style="width: 100%"
              />
              <div class="form-tip">建议设置为8位以上</div>
            </el-form-item>

            <el-form-item label="密码复杂度要求">
              <el-switch v-model="securityConfig.passwordComplexity" />
              <div class="form-tip">开启后密码必须包含大小写字母、数字和特殊字符</div>
            </el-form-item>

            <el-form-item label="登录失败锁定次数">
              <el-input-number
                v-model="securityConfig.loginFailLockCount"
                :min="3"
                :max="10"
                style="width: 100%"
              />
              <div class="form-tip">连续登录失败达到此次数后锁定账户</div>
            </el-form-item>

            <el-form-item label="锁定时间（分钟）">
              <el-input-number
                v-model="securityConfig.loginFailLockTime"
                :min="5"
                :max="1440"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="会话超时（分钟）">
              <el-input-number
                v-model="securityConfig.sessionTimeout"
                :min="30"
                :max="1440"
                style="width: 100%"
              />
              <div class="form-tip">用户无操作超过此时间后自动退出登录</div>
            </el-form-item>

            <el-form-item label="启用验证码">
              <el-switch v-model="securityConfig.enableCaptcha" />
              <div class="form-tip">登录时是否需要输入验证码</div>
            </el-form-item>

            <el-form-item label="启用双因子认证">
              <el-switch v-model="securityConfig.enableTwoFactor" />
              <div class="form-tip">启用后用户需要绑定手机或邮箱进行二次验证</div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 存储设置 -->
        <el-tab-pane label="存储设置" name="storage">
          <el-form
            ref="storageFormRef"
            :model="storageConfig"
            label-width="120px"
            class="config-form"
          >
            <el-form-item label="存储类型">
              <el-radio-group v-model="storageConfig.type">
                <el-radio value="local">本地存储</el-radio>
                <el-radio value="oss">阿里云OSS</el-radio>
                <el-radio value="cos">腾讯云COS</el-radio>
                <el-radio value="qiniu">七牛云</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="storageConfig.type === 'local'" label="存储路径">
              <el-input v-model="storageConfig.path" placeholder="请输入本地存储路径" />
            </el-form-item>

            <template v-if="storageConfig.type !== 'local'">
              <el-form-item label="访问域名">
                <el-input v-model="storageConfig.domain" placeholder="请输入访问域名" />
              </el-form-item>

              <el-form-item label="AccessKey">
                <el-input v-model="storageConfig.config.accessKey" placeholder="请输入AccessKey" />
              </el-form-item>

              <el-form-item label="SecretKey">
                <el-input
                  v-model="storageConfig.config.secretKey"
                  type="password"
                  show-password
                  placeholder="请输入SecretKey"
                />
              </el-form-item>

              <el-form-item label="存储桶">
                <el-input v-model="storageConfig.config.bucket" placeholder="请输入存储桶名称" />
              </el-form-item>

              <el-form-item label="地域">
                <el-input v-model="storageConfig.config.region" placeholder="请输入地域" />
              </el-form-item>
            </template>

            <el-form-item>
              <el-button type="primary" @click="handleTestStorage" :loading="testingStorage">
                测试存储连接
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Check, Refresh, Plus } from '@element-plus/icons-vue'
  import { useTheme } from '@/composables/useTheme'
  import { systemApi, configApi, testApi } from '@/api/modules/system'
  import type { SystemInfo, EmailConfig, SecurityConfig, StorageConfig } from '@/types/system'
  import type { FormInstance, FormRules } from 'element-plus'

  /**
   * 组合式函数
   */
  const { isDark } = useTheme()

  /**
   * 响应式数据
   */
  const saving = ref(false)
  const testingEmail = ref(false)
  const testingStorage = ref(false)
  const activeTab = ref('basic')

  const basicFormRef = ref<FormInstance>()
  const emailFormRef = ref<FormInstance>()
  const securityFormRef = ref<FormInstance>()
  const storageFormRef = ref<FormInstance>()

  // 系统信息
  const systemInfo = ref<SystemInfo>({
    name: 'Vue Service',
    version: '1.0.0',
    description: 'Vue3 + TypeScript 前端项目',
    author: '开发团队',
    website: '',
    logo: '',
    buildTime: '2024-12-14 10:00:00',
    environment: 'development',
    server: {
      os: 'Windows 11',
      cpu: 'Intel Core i7-12700K',
      memory: '32GB',
      disk: '1TB SSD',
      uptime: '7天 12小时 30分钟'
    },
    database: {
      type: 'MySQL',
      version: '8.0.35',
      size: '256MB'
    }
  })

  // 基本配置
  const basicConfig = reactive({
    siteTitle: 'Vue Service',
    siteDescription: 'Vue3 + TypeScript 前端项目',
    siteKeywords: 'Vue3,TypeScript,前端,管理系统',
    siteLogo: '',
    icp: '',
    copyright: '© 2024 Vue Service. All rights reserved.'
  })

  // 邮件配置
  const emailConfig = reactive<EmailConfig>({
    host: '',
    port: 587,
    username: '',
    password: '',
    ssl: true,
    fromEmail: '',
    fromName: 'Vue Service'
  })

  // 安全配置
  const securityConfig = reactive<SecurityConfig>({
    passwordMinLength: 8,
    passwordComplexity: true,
    loginFailLockCount: 5,
    loginFailLockTime: 30,
    sessionTimeout: 120,
    enableCaptcha: true,
    enableTwoFactor: false
  })

  // 存储配置
  const storageConfig = reactive<StorageConfig>({
    type: 'local',
    path: '/uploads',
    domain: '',
    config: {
      accessKey: '',
      secretKey: '',
      bucket: '',
      region: ''
    }
  })

  /**
   * 表单验证规则
   */
  const emailRules: FormRules = {
    host: [{ required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }],
    port: [
      { required: true, message: '请输入SMTP端口', trigger: 'blur' },
      { type: 'number', min: 1, max: 65535, message: '端口范围为1-65535', trigger: 'blur' }
    ],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    fromEmail: [
      { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  }

  /**
   * API 调用
   */
  const loadSystemInfo = async () => {
    try {
      systemInfo.value = await systemApi.getInfo()
    } catch (error) {
      console.error('加载系统信息失败:', error)
    }
  }

  const loadConfigs = async () => {
    try {
      const configs = await configApi.getAll()

      // 解析配置数据
      configs.forEach((config: { group: string; key: string; value: string }) => {
        const { group, key, value } = config

        if (group === 'basic') {
          if (key in basicConfig) {
            (basicConfig as any)[key] = value
          }
        } else if (group === 'email') {
          if (key in emailConfig) {
            (emailConfig as any)[key] = value
          }
        } else if (group === 'security') {
          if (key in securityConfig) {
            (securityConfig as any)[key] = value
          }
        } else if (group === 'storage') {
          if (key in storageConfig) {
            (storageConfig as any)[key] = value
          }
        }
      })
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }

  /**
   * 事件处理
   */
  const handleSaveAll = async () => {
    try {
      saving.value = true

      // 收集所有配置
      const configs = [
        ...Object.entries(basicConfig).map(([key, value]) => ({
          group: 'basic',
          key,
          value: String(value)
        })),
        ...Object.entries(emailConfig).map(([key, value]) => ({
          group: 'email',
          key,
          value: String(value)
        })),
        ...Object.entries(securityConfig).map(([key, value]) => ({
          group: 'security',
          key,
          value: String(value)
        })),
        ...Object.entries(storageConfig).map(([key, value]) => ({
          group: 'storage',
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value)
        }))
      ]

      await configApi.update({ configs })
      ElMessage.success('配置保存成功')
    } catch (error) {
      console.error('保存配置失败:', error)
      ElMessage.error('保存配置失败')
    } finally {
      saving.value = false
    }
  }

  const handleLogoUpload = (file: File) => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请选择图片文件')
      return false
    }

    // 验证文件大小（2MB）
    if (file.size > 2 * 1024 * 1024) {
      ElMessage.error('图片大小不能超过 2MB')
      return false
    }

    // 这里应该上传文件到服务器
    // 暂时使用本地预览
    const reader = new FileReader()
    reader.onload = e => {
      basicConfig.siteLogo = e.target?.result as string
    }
    reader.readAsDataURL(file)

    return false // 阻止自动上传
  }

  const handleTestEmail = async () => {
    if (!emailFormRef.value) {return}

    try {
      await emailFormRef.value.validate()
      testingEmail.value = true

      const result = await testApi.testEmail(emailConfig)
      if (result.success) {
        ElMessage.success(result.message)
      } else {
        ElMessage.error(result.message)
      }
    } catch (error) {
      console.error('邮件测试失败:', error)
      ElMessage.error('邮件发送测试失败')
    } finally {
      testingEmail.value = false
    }
  }

  const handleTestStorage = async () => {
    try {
      testingStorage.value = true

      const result = await testApi.testStorage(storageConfig)
      if (result.success) {
        ElMessage.success(result.message)
      } else {
        ElMessage.error(result.message)
      }
    } catch (error) {
      console.error('存储测试失败:', error)
      ElMessage.error('存储连接测试失败')
    } finally {
      testingStorage.value = false
    }
  }

  /**
   * 生命周期
   */
  onMounted(() => {
    loadSystemInfo()
    loadConfigs()
  })
</script>

<style scoped lang="scss">
  @import '@/assets/styles/variables.scss';

  .system-settings {
    padding: $spacing-lg;
    background: $background-color-base;
    min-height: calc(100vh - 60px);

    &--dark {
      background: $dark-background-color-base;
    }
  }

  // 页面头部
  .page-header {
    margin-bottom: $spacing-lg;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      .page-title {
        font-size: 24px;
        font-weight: 600;
        color: $text-color-primary;
        margin: 0 0 $spacing-xs 0;
      }

      .page-description {
        color: $text-color-secondary;
        margin: 0;
      }
    }
  }

  // 信息卡片
  .info-card {
    margin-bottom: $spacing-lg;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: $text-color-primary;
      }
    }

    .info-item {
      padding: $spacing-md 0;
      border-bottom: 1px solid $border-color-lighter;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 14px;
        color: $text-color-secondary;
        margin-bottom: 4px;
      }

      .info-value {
        font-size: 16px;
        font-weight: 500;
        color: $text-color-primary;
      }
    }
  }

  // 配置卡片
  .config-card {
    .config-tabs {
      :deep(.el-tabs__header) {
        margin-bottom: $spacing-lg;
      }

      :deep(.el-tabs__nav-wrap) {
        padding: 0 $spacing-lg;
      }
    }

    .config-form {
      padding: 0 $spacing-lg $spacing-lg;

      .el-form-item {
        margin-bottom: $spacing-lg;
      }

      .form-tip {
        font-size: 12px;
        color: $text-color-secondary;
        margin-top: 4px;
        line-height: 1.4;
      }
    }
  }

  // Logo上传
  .logo-upload {
    .logo-uploader {
      :deep(.el-upload) {
        border: 2px dashed $border-color-base;
        border-radius: $border-radius-base;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.2s ease;

        &:hover {
          border-color: $color-primary;
        }
      }
    }

    .logo-image {
      width: 120px;
      height: 120px;
      object-fit: cover;
      display: block;
    }

    .logo-placeholder {
      width: 120px;
      height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: $text-color-secondary;

      .el-icon {
        font-size: 24px;
        margin-bottom: $spacing-xs;
      }

      div {
        font-size: 14px;
      }
    }
  }

  // 响应式设计
  @media (max-width: $breakpoint-lg) {
    .page-header {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: $spacing-md;
      }
    }

    .info-card {
      .el-col {
        margin-bottom: $spacing-md;
      }
    }
  }

  @media (max-width: $breakpoint-md) {
    .system-settings {
      padding: $spacing-md;
    }

    .config-tabs {
      :deep(.el-tabs__nav-wrap) {
        padding: 0;
      }
    }

    .config-form {
      padding: 0 0 $spacing-lg;
    }
  }

  // 暗色主题适配
  .system-settings--dark {
    .page-header {
      .header-left {
        .page-title {
          color: $dark-text-color-primary;
        }

        .page-description {
          color: $dark-text-color-secondary;
        }
      }
    }

    .info-card {
      .card-header h3 {
        color: $dark-text-color-primary;
      }

      .info-item {
        border-bottom-color: $dark-border-color-lighter;

        .info-label {
          color: $dark-text-color-secondary;
        }

        .info-value {
          color: $dark-text-color-primary;
        }
      }
    }

    .config-form {
      .form-tip {
        color: $dark-text-color-secondary;
      }
    }

    .logo-placeholder {
      color: $dark-text-color-secondary;
    }
  }
</style>
