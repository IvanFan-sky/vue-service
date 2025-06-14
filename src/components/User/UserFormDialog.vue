<!--
  用户表单对话框
  @description 用于创建和编辑用户的表单对话框
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" @submit.prevent>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="t('userManagement.form.username')" prop="username">
            <el-input
              v-model="formData.username"
              :placeholder="t('userManagement.form.usernamePlaceholder')"
              :disabled="mode === 'edit'"
              @blur="checkUsername"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('userManagement.form.realName')" prop="realName">
            <el-input
              v-model="formData.realName"
              :placeholder="t('userManagement.form.realNamePlaceholder')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="t('userManagement.form.email')" prop="email">
            <el-input
              v-model="formData.email"
              type="email"
              :placeholder="t('userManagement.form.emailPlaceholder')"
              @blur="checkEmail"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('userManagement.form.phone')" prop="phone">
            <el-input
              v-model="formData.phone"
              :placeholder="t('userManagement.form.phonePlaceholder')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="mode === 'create'" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="t('userManagement.form.password')" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              :placeholder="t('userManagement.form.passwordPlaceholder')"
              show-password
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('userManagement.form.confirmPassword')" prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              :placeholder="t('userManagement.form.confirmPasswordPlaceholder')"
              show-password
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="t('userManagement.form.role')" prop="role">
            <el-select
              v-model="formData.role"
              :placeholder="t('userManagement.form.rolePlaceholder')"
            >
              <el-option
                v-for="role in roleOptions"
                :key="role.value"
                :label="role.label"
                :value="role.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('userManagement.form.status')" prop="status">
            <el-select
              v-model="formData.status"
              :placeholder="t('userManagement.form.statusPlaceholder')"
            >
              <el-option
                v-for="status in statusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('userManagement.form.gender')" prop="gender">
            <el-select
              v-model="formData.gender"
              :placeholder="t('userManagement.form.genderPlaceholder')"
            >
              <el-option
                v-for="gender in genderOptions"
                :key="gender.value"
                :label="gender.label"
                :value="gender.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="t('userManagement.form.age')" prop="age">
            <el-input-number
              v-model="formData.age"
              :min="18"
              :max="100"
              :placeholder="t('userManagement.form.agePlaceholder')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('userManagement.form.department')" prop="department">
            <el-select
              v-model="formData.department"
              :placeholder="t('userManagement.form.departmentPlaceholder')"
              filterable
              allow-create
            >
              <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="t('userManagement.form.position')" prop="position">
            <el-select
              v-model="formData.position"
              :placeholder="t('userManagement.form.positionPlaceholder')"
              filterable
              allow-create
            >
              <el-option v-for="pos in positions" :key="pos" :label="pos" :value="pos" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item :label="t('userManagement.form.address')" prop="address">
        <el-input
          v-model="formData.address"
          :placeholder="t('userManagement.form.addressPlaceholder')"
        />
      </el-form-item>

      <el-form-item :label="t('userManagement.form.avatar')" prop="avatar">
        <div class="avatar-upload">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
          >
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="avatar-tips">
            <p>{{ t('userManagement.form.avatarTips') }}</p>
          </div>
        </div>
      </el-form-item>

      <el-form-item :label="t('userManagement.form.remark')" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          :placeholder="t('userManagement.form.remarkPlaceholder')"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ t('common.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch, nextTick } from 'vue'
  import { ElMessage, type FormInstance, type UploadProps } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  import { useI18n } from '@/composables/useI18n'
  import { userMockApi } from '@/api/mock/userMock'
  import type {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    UserRole,
    UserStatus,
    UserGender
  } from '@/types/user'

  interface Props {
    visible: boolean
    user?: User | null
    mode: 'create' | 'edit'
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'success'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    user: null
  })

  const emit = defineEmits<Emits>()

  const { t } = useI18n()

  // 响应式数据
  const formRef = ref<FormInstance>()
  const submitting = ref(false)
  const departments = ref<string[]>([])
  const positions = ref<string[]>([])

  // 表单数据
  const formData = reactive<CreateUserRequest>({
    username: '',
    realName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 1,
    gender: 'male',
    age: 25,
    department: '',
    position: '',
    address: '',
    avatar: '',
    remark: ''
  })

  // 计算属性
  const dialogVisible = computed({
    get: () => props.visible,
    set: value => emit('update:visible', value)
  })

  const dialogTitle = computed(() => {
    return props.mode === 'create'
      ? t('userManagement.dialog.createTitle')
      : t('userManagement.dialog.editTitle')
  })

  const roleOptions = computed(() => [
    { label: t('userManagement.roles.admin'), value: 'admin' as UserRole },
    { label: t('userManagement.roles.user'), value: 'user' as UserRole },
    { label: t('userManagement.roles.guest'), value: 'guest' as UserRole }
  ])

  const statusOptions = computed(() => [
    { label: t('userManagement.status.active'), value: 1 as UserStatus },
    { label: t('userManagement.status.disabled'), value: 0 as UserStatus },
    { label: t('userManagement.status.pending'), value: 2 as UserStatus }
  ])

  const genderOptions = computed(() => [
    { label: t('userManagement.gender.male'), value: 'male' as UserGender },
    { label: t('userManagement.gender.female'), value: 'female' as UserGender },
    { label: t('userManagement.gender.other'), value: 'other' as UserGender }
  ])

  // 表单验证规则
  const formRules = computed(() => ({
    username: [
      { required: true, message: t('userManagement.validation.usernameRequired'), trigger: 'blur' },
      { min: 3, max: 20, message: t('userManagement.validation.usernameLength'), trigger: 'blur' },
      {
        pattern: /^[a-zA-Z0-9_]+$/,
        message: t('userManagement.validation.usernameFormat'),
        trigger: 'blur'
      }
    ],
    realName: [
      { required: true, message: t('userManagement.validation.realNameRequired'), trigger: 'blur' },
      { min: 2, max: 20, message: t('userManagement.validation.realNameLength'), trigger: 'blur' }
    ],
    email: [
      { required: true, message: t('userManagement.validation.emailRequired'), trigger: 'blur' },
      { type: 'email', message: t('userManagement.validation.emailFormat'), trigger: 'blur' }
    ],
    phone: [
      { required: true, message: t('userManagement.validation.phoneRequired'), trigger: 'blur' },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: t('userManagement.validation.phoneFormat'),
        trigger: 'blur'
      }
    ],
    password:
      props.mode === 'create'
        ? [
            {
              required: true,
              message: t('userManagement.validation.passwordRequired'),
              trigger: 'blur'
            },
            {
              min: 6,
              max: 20,
              message: t('userManagement.validation.passwordLength'),
              trigger: 'blur'
            }
          ]
        : [],
    confirmPassword:
      props.mode === 'create'
        ? [
            {
              required: true,
              message: t('userManagement.validation.confirmPasswordRequired'),
              trigger: 'blur'
            },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        : [],
    role: [
      { required: true, message: t('userManagement.validation.roleRequired'), trigger: 'change' }
    ],
    status: [
      { required: true, message: t('userManagement.validation.statusRequired'), trigger: 'change' }
    ],
    gender: [
      { required: true, message: t('userManagement.validation.genderRequired'), trigger: 'change' }
    ],
    age: [
      { required: true, message: t('userManagement.validation.ageRequired'), trigger: 'blur' },
      {
        type: 'number',
        min: 18,
        max: 100,
        message: t('userManagement.validation.ageRange'),
        trigger: 'blur'
      }
    ],
    department: [
      {
        required: true,
        message: t('userManagement.validation.departmentRequired'),
        trigger: 'change'
      }
    ],
    position: [
      {
        required: true,
        message: t('userManagement.validation.positionRequired'),
        trigger: 'change'
      }
    ],
    address: [
      { required: true, message: t('userManagement.validation.addressRequired'), trigger: 'blur' }
    ]
  }))

  // 验证确认密码
  function validateConfirmPassword(rule: any, value: any, callback: any) {
    if (value !== formData.password) {
      callback(new Error(t('userManagement.validation.confirmPasswordMismatch')))
    } else {
      callback()
    }
  }

  // 方法
  const loadDepartments = async () => {
    try {
      departments.value = await userMockApi.getDepartments()
    } catch (error) {
      console.error('加载部门列表失败:', error)
    }
  }

  const loadPositions = async () => {
    try {
      positions.value = await userMockApi.getPositions()
    } catch (error) {
      console.error('加载职位列表失败:', error)
    }
  }

  const checkUsername = async () => {
    if (!formData.username || props.mode === 'edit') return

    try {
      const result = await userMockApi.checkUsername(formData.username)
      if (!result.available) {
        ElMessage.warning(t('userManagement.validation.usernameExists'))
      }
    } catch (error) {
      console.error('检查用户名失败:', error)
    }
  }

  const checkEmail = async () => {
    if (!formData.email) return

    try {
      const result = await userMockApi.checkEmail(formData.email)
      if (!result.available && props.mode === 'create') {
        ElMessage.warning(t('userManagement.validation.emailExists'))
      }
    } catch (error) {
      console.error('检查邮箱失败:', error)
    }
  }

  const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
    const isImage = rawFile.type.startsWith('image/')
    const isLt2M = rawFile.size / 1024 / 1024 < 2

    if (!isImage) {
      ElMessage.error(t('userManagement.validation.avatarFormat'))
      return false
    }
    if (!isLt2M) {
      ElMessage.error(t('userManagement.validation.avatarSize'))
      return false
    }
    return true
  }

  const handleAvatarUpload = (options: any) => {
    // 模拟上传头像
    const reader = new FileReader()
    reader.onload = e => {
      formData.avatar = e.target?.result as string
    }
    reader.readAsDataURL(options.file)
  }

  const resetForm = () => {
    Object.assign(formData, {
      username: '',
      realName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      status: 1,
      gender: 'male',
      age: 25,
      department: '',
      position: '',
      address: '',
      avatar: '',
      remark: ''
    })

    nextTick(() => {
      formRef.value?.clearValidate()
    })
  }

  const fillForm = (user: User) => {
    Object.assign(formData, {
      username: user.username,
      realName: user.realName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      gender: user.gender,
      age: user.age,
      department: user.department,
      position: user.position,
      address: user.address,
      avatar: user.avatar || '',
      remark: user.remark || ''
    })
  }

  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      submitting.value = true

      if (props.mode === 'create') {
        await userMockApi.create(formData)
        ElMessage.success(t('userManagement.createSuccess'))
      } else {
        const updateData: UpdateUserRequest = { ...formData }
        delete (updateData as any).username
        delete (updateData as any).password
        delete (updateData as any).confirmPassword

        await userMockApi.update(props.user!.id, updateData)
        ElMessage.success(t('userManagement.updateSuccess'))
      }

      emit('success')
      handleClose()
    } catch (error) {
      ElMessage.error(
        props.mode === 'create' ? t('userManagement.createError') : t('userManagement.updateError')
      )
      console.error('提交表单失败:', error)
    } finally {
      submitting.value = false
    }
  }

  const handleClose = () => {
    dialogVisible.value = false
    resetForm()
  }

  // 监听器
  watch(
    () => props.visible,
    visible => {
      if (visible) {
        loadDepartments()
        loadPositions()

        if (props.mode === 'edit' && props.user) {
          fillForm(props.user)
        } else {
          resetForm()
        }
      }
    }
  )
</script>

<style scoped>
  .avatar-upload {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .avatar-uploader .avatar {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    display: block;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
  }

  .avatar-tips {
    flex: 1;
  }

  .avatar-tips p {
    margin: 0;
    font-size: 12px;
    color: var(--el-text-color-regular);
    line-height: 1.5;
  }

  .dialog-footer {
    text-align: right;
  }
</style>
