<!--
  用户详情对话框
  @description 用于查看用户详细信息的对话框
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('userManagement.dialog.detailTitle')"
    width="800px"
    @close="handleClose"
  >
    <div v-if="user" class="user-detail">
      <!-- 用户基本信息 -->
      <div class="detail-section">
        <h3 class="section-title">{{ t('userManagement.detail.basicInfo') }}</h3>
        <div class="user-header">
          <div class="user-avatar">
            <el-avatar :size="80" :src="user.avatar" :alt="user.realName">
              {{ user.realName.charAt(0) }}
            </el-avatar>
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ user.realName }}</h2>
            <p class="user-username">@{{ user.username }}</p>
            <div class="user-tags">
              <el-tag :type="getRoleTagType(user.role)" size="small">
                {{ getRoleLabel(user.role) }}
              </el-tag>
              <el-tag :type="getStatusTagType(user.status)" size="small">
                {{ getStatusLabel(user.status) }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="detail-section">
        <h3 class="section-title">{{ t('userManagement.detail.contactInfo') }}</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>{{ t('userManagement.table.email') }}:</label>
              <span>{{ user.email }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>{{ t('userManagement.table.phone') }}:</label>
              <span>{{ user.phone }}</span>
            </div>
          </el-col>
        </el-row>
        <div class="info-item">
          <label>{{ t('userManagement.form.address') }}:</label>
          <span>{{ user.address }}</span>
        </div>
      </div>

      <!-- 个人信息 -->
      <div class="detail-section">
        <h3 class="section-title">{{ t('userManagement.detail.personalInfo') }}</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>{{ t('userManagement.form.gender') }}:</label>
              <span>{{ getGenderLabel(user.gender) }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>{{ t('userManagement.form.age') }}:</label>
              <span>{{ user.age }} {{ t('userManagement.detail.yearsOld') }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>{{ t('userManagement.detail.loginCount') }}:</label>
              <span>{{ user.loginCount }} {{ t('userManagement.detail.times') }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 工作信息 -->
      <div class="detail-section">
        <h3 class="section-title">{{ t('userManagement.detail.workInfo') }}</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>{{ t('userManagement.table.department') }}:</label>
              <span>{{ user.department }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>{{ t('userManagement.table.position') }}:</label>
              <span>{{ user.position }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 时间信息 -->
      <div class="detail-section">
        <h3 class="section-title">{{ t('userManagement.detail.timeInfo') }}</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>{{ t('userManagement.table.createdAt') }}:</label>
              <span>{{ formatDate(user.createdAt) }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>{{ t('userManagement.detail.updatedAt') }}:</label>
              <span>{{ formatDate(user.updatedAt) }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>{{ t('userManagement.detail.lastLoginTime') }}:</label>
              <span>{{ user.lastLoginTime ? formatDate(user.lastLoginTime) : t('common.never') }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 备注信息 -->
      <div v-if="user.remark" class="detail-section">
        <h3 class="section-title">{{ t('userManagement.form.remark') }}</h3>
        <div class="remark-content">
          {{ user.remark }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ t('common.close') }}</el-button>
        <el-button type="primary" @click="handleEdit">
          {{ t('common.edit') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { User, UserRole, UserStatus, UserGender } from '@/types/user'

interface Props {
  visible: boolean
  user?: User | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'edit', user: User): void
}

const props = withDefaults(defineProps<Props>(), {
  user: null
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 方法
const getRoleTagType = (role: UserRole) => {
  const types = {
    admin: 'danger',
    user: 'primary',
    guest: 'info'
  }
  return types[role] || 'info'
}

const getRoleLabel = (role: UserRole) => {
  const labels = {
    admin: t('userManagement.roles.admin'),
    user: t('userManagement.roles.user'),
    guest: t('userManagement.roles.guest')
  }
  return labels[role] || role
}

const getStatusTagType = (status: UserStatus) => {
  const types = {
    [1]: 'success',
    [0]: 'danger',
    [2]: 'warning'
  }
  return types[status] || 'info'
}

const getStatusLabel = (status: UserStatus) => {
  const labels = {
    [1]: t('userManagement.status.active'),
    [0]: t('userManagement.status.disabled'),
    [2]: t('userManagement.status.pending')
  }
  return labels[status] || status.toString()
}

const getGenderLabel = (gender: UserGender) => {
  const labels = {
    male: t('userManagement.gender.male'),
    female: t('userManagement.gender.female'),
    other: t('userManagement.gender.other')
  }
  return labels[gender] || gender
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleEdit = () => {
  if (props.user) {
    emit('edit', props.user)
    handleClose()
  }
}
</script>

<style scoped>
.user-detail {
  padding: 0;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-light);
  padding-bottom: 8px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
}

.user-avatar {
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.user-username {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.user-tags {
  display: flex;
  gap: 8px;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item label {
  display: inline-block;
  width: 120px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  flex-shrink: 0;
}

.info-item span {
  color: var(--el-text-color-primary);
  flex: 1;
}

.remark-content {
  padding: 12px;
  background: var(--el-bg-color-page);
  border-radius: 4px;
  color: var(--el-text-color-primary);
  line-height: 1.6;
}

.dialog-footer {
  text-align: right;
}
</style> 