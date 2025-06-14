<!--
  用户个人信息页面
  @description 用户查看和编辑个人信息的页面
  @author 开发团队
  @date 2024-12-14
  @version 1.0.0
-->

<template>
  <div class="user-profile" :class="{ 'user-profile--dark': isDark }">
    <!-- 页面头部 -->
    <div class="profile-header">
      <div class="header-content">
        <div class="user-avatar">
          <el-avatar 
            :size="120" 
            :src="userInfo?.avatar" 
            :icon="UserFilled"
            class="avatar-image"
          />
          <el-button 
            type="primary" 
            size="small" 
            class="avatar-upload"
            @click="handleAvatarUpload"
            :loading="avatarUploading"
          >
            <el-icon><Camera /></el-icon>
            更换头像
          </el-button>
        </div>
        
        <div class="user-info">
          <h1 class="user-name">{{ userInfo?.realName || userInfo?.username }}</h1>
          <p class="user-role">{{ getRoleText(userInfo?.role) }}</p>
          <p class="user-department">{{ userInfo?.department }} - {{ userInfo?.position }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-label">注册时间</span>
              <span class="stat-value">{{ formatDate(userInfo?.createdAt) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最后登录</span>
              <span class="stat-value">{{ formatDate(userInfo?.lastLoginTime) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="profile-content">
      <el-row :gutter="24">
        <!-- 基本信息 -->
        <el-col :span="16">
          <el-card class="info-card" shadow="never">
            <template #header>
              <div class="card-header">
                <h3>基本信息</h3>
                <el-button 
                  type="primary" 
                  size="small"
                  @click="handleEdit"
                  :disabled="editing"
                >
                  {{ editing ? '编辑中...' : '编辑信息' }}
                </el-button>
              </div>
            </template>

            <el-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              label-width="100px"
              :disabled="!editing"
              class="profile-form"
            >
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="formData.username" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="formData.realName" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="formData.phone" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="formData.gender">
                      <el-radio value="male">男</el-radio>
                      <el-radio value="female">女</el-radio>
                      <el-radio value="other">其他</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年龄" prop="age">
                    <el-input-number 
                      v-model="formData.age" 
                      :min="1" 
                      :max="120"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="部门" prop="department">
                    <el-input v-model="formData.department" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职位" prop="position">
                    <el-input v-model="formData.position" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="地址" prop="address">
                <el-input v-model="formData.address" />
              </el-form-item>

              <el-form-item label="个人简介" prop="remark">
                <el-input 
                  v-model="formData.remark" 
                  type="textarea" 
                  :rows="4"
                  placeholder="请输入个人简介..."
                />
              </el-form-item>

              <el-form-item v-if="editing" class="form-actions">
                <el-button type="primary" @click="handleSave" :loading="saving">
                  保存
                </el-button>
                <el-button @click="handleCancel">
                  取消
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <!-- 侧边栏 -->
        <el-col :span="8">
          <!-- 安全设置 -->
          <el-card class="security-card" shadow="never">
            <template #header>
              <h3>安全设置</h3>
            </template>

            <div class="security-items">
              <div class="security-item">
                <div class="item-info">
                  <h4>登录密码</h4>
                  <p>定期更换密码可以提高账户安全性</p>
                </div>
                <el-button size="small" @click="showPasswordDialog = true">
                  修改
                </el-button>
              </div>

              <div class="security-item">
                <div class="item-info">
                  <h4>手机绑定</h4>
                  <p>{{ userInfo?.phone ? `已绑定：${maskPhone(userInfo.phone)}` : '未绑定' }}</p>
                </div>
                <el-button size="small" @click="showPhoneDialog = true">
                  {{ userInfo?.phone ? '更换' : '绑定' }}
                </el-button>
              </div>

              <div class="security-item">
                <div class="item-info">
                  <h4>邮箱绑定</h4>
                  <p>{{ userInfo?.email ? `已绑定：${maskEmail(userInfo.email)}` : '未绑定' }}</p>
                </div>
                <el-button size="small" @click="showEmailDialog = true">
                  {{ userInfo?.email ? '更换' : '绑定' }}
                </el-button>
              </div>
            </div>
          </el-card>

          <!-- 登录记录 -->
          <el-card class="login-record-card" shadow="never">
            <template #header>
              <h3>最近登录</h3>
            </template>

            <div class="login-records">
              <div 
                v-for="record in loginRecords" 
                :key="record.id"
                class="record-item"
              >
                <div class="record-info">
                  <div class="record-time">{{ formatDate(record.loginTime) }}</div>
                  <div class="record-location">{{ record.location }}</div>
                  <div class="record-device">{{ record.device }}</div>
                </div>
                <div class="record-status">
                  <el-tag :type="record.status === 'success' ? 'success' : 'danger'" size="small">
                    {{ record.status === 'success' ? '成功' : '失败' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword" 
            type="password" 
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordChange" :loading="passwordChanging">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 头像上传 -->
    <input
      ref="avatarInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleAvatarChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UserFilled,
  Camera
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { apiClient } from '@/utils/apiClient'
import type { User, UserGender } from '@/types/user'
import type { FormInstance, FormRules } from 'element-plus'

/**
 * 组合式函数
 */
const authStore = useAuthStore()
const { isDark } = useTheme()

/**
 * 响应式数据
 */
const editing = ref(false)
const saving = ref(false)
const avatarUploading = ref(false)
const passwordChanging = ref(false)
const showPasswordDialog = ref(false)
const showPhoneDialog = ref(false)
const showEmailDialog = ref(false)

const formRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const avatarInputRef = ref<HTMLInputElement>()

// 用户信息
const userInfo = computed(() => authStore.user)

// 表单数据
const formData = reactive<Partial<User>>({
  username: '',
  realName: '',
  email: '',
  phone: '',
  gender: 'male' as UserGender,
  age: 0,
  department: '',
  position: '',
  address: '',
  remark: ''
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 登录记录
const loginRecords = ref([
  {
    id: 1,
    loginTime: '2024-12-14 10:30:00',
    location: '北京市朝阳区',
    device: 'Chrome 120.0 / Windows 10',
    status: 'success'
  },
  {
    id: 2,
    loginTime: '2024-12-13 15:20:00',
    location: '北京市朝阳区',
    device: 'Chrome 120.0 / Windows 10',
    status: 'success'
  },
  {
    id: 3,
    loginTime: '2024-12-12 09:15:00',
    location: '上海市浦东新区',
    device: 'Safari 17.0 / macOS',
    status: 'success'
  }
])

/**
 * 表单验证规则
 */
const formRules: FormRules = {
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 1, max: 120, message: '年龄必须在 1-120 之间', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
      message: '密码必须包含大小写字母和数字',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

/**
 * 计算属性
 */
const getRoleText = (role?: string) => {
  const roleMap = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客'
  }
  return roleMap[role as keyof typeof roleMap] || '未知'
}

/**
 * 工具函数
 */
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '暂无'
  return new Date(dateStr).toLocaleString('zh-CN')
}

const maskPhone = (phone: string) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const maskEmail = (email: string) => {
  const [username, domain] = email.split('@')
  const maskedUsername = username.length > 3
    ? username.slice(0, 2) + '***' + username.slice(-1)
    : username
  return `${maskedUsername}@${domain}`
}

/**
 * 事件处理
 */
const initFormData = () => {
  if (userInfo.value) {
    Object.assign(formData, {
      username: userInfo.value.username,
      realName: userInfo.value.realName,
      email: userInfo.value.email,
      phone: userInfo.value.phone,
      gender: userInfo.value.gender,
      age: userInfo.value.age,
      department: userInfo.value.department,
      position: userInfo.value.position,
      address: userInfo.value.address,
      remark: userInfo.value.remark
    })
  }
}

const handleEdit = () => {
  editing.value = true
  initFormData()
}

const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    saving.value = true

    // 调用API更新用户信息
    await apiClient.put(`/api/users/${userInfo.value?.id}`, formData)

    // 更新本地用户信息
    await authStore.fetchUserInfo()

    editing.value = false
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    console.error('更新个人信息失败:', error)
    ElMessage.error('更新失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  editing.value = false
  initFormData()
}

const handleAvatarUpload = () => {
  avatarInputRef.value?.click()
}

const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 验证文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }

  try {
    avatarUploading.value = true

    const formData = new FormData()
    formData.append('avatar', file)

    // 上传头像
    const response = await apiClient.post('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // 更新用户信息
    await authStore.fetchUserInfo()

    ElMessage.success('头像更新成功')
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败，请稍后重试')
  } finally {
    avatarUploading.value = false
    target.value = ''
  }
}

const handlePasswordChange = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    passwordChanging.value = true

    // 调用API修改密码
    await apiClient.post('/api/users/change-password', {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })

    showPasswordDialog.value = false
    ElMessage.success('密码修改成功，请重新登录')

    // 清空表单
    Object.assign(passwordForm, {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // 延迟跳转到登录页
    setTimeout(() => {
      authStore.logout()
    }, 2000)
  } catch (error) {
    console.error('密码修改失败:', error)
    ElMessage.error('密码修改失败，请检查当前密码是否正确')
  } finally {
    passwordChanging.value = false
  }
}

/**
 * 生命周期
 */
onMounted(() => {
  initFormData()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.user-profile {
  padding: $spacing-lg;
  background: $background-color-base;
  min-height: calc(100vh - 60px);

  &--dark {
    background: $dark-background-color-base;
  }
}

// 页面头部
.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
  color: white;

  .header-content {
    display: flex;
    align-items: center;
    gap: $spacing-xl;
  }

  .user-avatar {
    position: relative;

    .avatar-image {
      border: 4px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .avatar-upload {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: $border-radius-round;
      font-size: 12px;
      padding: 4px 12px;
    }
  }

  .user-info {
    flex: 1;

    .user-name {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 $spacing-sm 0;
    }

    .user-role {
      font-size: 16px;
      opacity: 0.9;
      margin: 0 0 $spacing-xs 0;
    }

    .user-department {
      font-size: 14px;
      opacity: 0.8;
      margin: 0 0 $spacing-lg 0;
    }

    .user-stats {
      display: flex;
      gap: $spacing-xl;

      .stat-item {
        .stat-label {
          display: block;
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
}

// 主要内容
.profile-content {
  .info-card,
  .security-card,
  .login-record-card {
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
  }

  .profile-form {
    .form-actions {
      margin-top: $spacing-xl;
      text-align: center;
    }
  }
}

// 安全设置
.security-items {
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg 0;
    border-bottom: 1px solid $border-color-light;

    &:last-child {
      border-bottom: none;
    }

    .item-info {
      flex: 1;

      h4 {
        margin: 0 0 $spacing-xs 0;
        font-size: 14px;
        font-weight: 500;
        color: $text-color-primary;
      }

      p {
        margin: 0;
        font-size: 12px;
        color: $text-color-secondary;
      }
    }
  }
}

// 登录记录
.login-records {
  .record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md 0;
    border-bottom: 1px solid $border-color-light;

    &:last-child {
      border-bottom: none;
    }

    .record-info {
      flex: 1;

      .record-time {
        font-size: 14px;
        font-weight: 500;
        color: $text-color-primary;
        margin-bottom: 4px;
      }

      .record-location,
      .record-device {
        font-size: 12px;
        color: $text-color-secondary;
        margin-bottom: 2px;
      }
    }
  }
}

// 响应式设计
@media (max-width: $breakpoint-lg) {
  .profile-header {
    .header-content {
      flex-direction: column;
      text-align: center;
      gap: $spacing-lg;
    }

    .user-stats {
      justify-content: center;
    }
  }

  .profile-content {
    .el-col {
      margin-bottom: $spacing-lg;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .user-profile {
    padding: $spacing-md;
  }

  .profile-header {
    padding: $spacing-lg;

    .user-name {
      font-size: 24px;
    }
  }

  .profile-form {
    .el-row {
      .el-col {
        margin-bottom: $spacing-md;
      }
    }
  }
}

// 暗色主题适配
.user-profile--dark {
  .info-card,
  .security-card,
  .login-record-card {
    :deep(.el-card__body) {
      background: $dark-background-color-light;
    }

    .card-header h3 {
      color: $dark-text-color-primary;
    }
  }

  .security-items .security-item {
    border-bottom-color: $dark-border-color-light;

    .item-info {
      h4 {
        color: $dark-text-color-primary;
      }

      p {
        color: $dark-text-color-secondary;
      }
    }
  }

  .login-records .record-item {
    border-bottom-color: $dark-border-color-light;

    .record-info {
      .record-time {
        color: $dark-text-color-primary;
      }

      .record-location,
      .record-device {
        color: $dark-text-color-secondary;
      }
    }
  }
}
</style>
