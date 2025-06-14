<!--
  用户导入对话框
  @description 用于批量导入用户数据的对话框
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('userManagement.dialog.importTitle')"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 步骤条 -->
    <el-steps :active="currentStep" finish-status="success" class="import-steps">
      <el-step :title="t('userManagement.import.step1')" />
      <el-step :title="t('userManagement.import.step2')" />
      <el-step :title="t('userManagement.import.step3')" />
    </el-steps>

    <div class="step-container">
      <!-- 步骤1: 下载模板 -->
      <div v-if="currentStep === 0" class="step-content">
        <div class="step-description">
          <h3>{{ t('userManagement.import.downloadTemplate') }}</h3>
          <p>{{ t('userManagement.import.downloadTemplateDesc') }}</p>
        </div>
        <div class="template-download">
          <el-button type="primary" @click="handleDownloadTemplate">
            <el-icon><Download /></el-icon>
            {{ t('userManagement.import.downloadTemplateBtn') }}
          </el-button>
        </div>
        <el-alert
          :title="t('userManagement.import.templateTips')"
          type="info"
          show-icon
          :closable="false"
        >
          <ul class="tips-list">
            <li>{{ t('userManagement.import.tip1') }}</li>
            <li>{{ t('userManagement.import.tip2') }}</li>
            <li>{{ t('userManagement.import.tip3') }}</li>
            <li>{{ t('userManagement.import.tip4') }}</li>
          </ul>
        </el-alert>
      </div>

      <!-- 步骤2: 上传文件 -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="step-description">
          <h3>{{ t('userManagement.import.uploadFile') }}</h3>
          <p>{{ t('userManagement.import.uploadFileDesc') }}</p>
        </div>
        <div class="file-upload">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            drag
            action="#"
            :multiple="false"
            :auto-upload="false"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            accept=".xlsx,.xls"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              {{ t('userManagement.import.dragFile') }}
              <em>{{ t('userManagement.import.clickUpload') }}</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                {{ t('userManagement.import.fileFormat') }}
              </div>
            </template>
          </el-upload>
        </div>
      </div>

      <!-- 步骤3: 导入结果 -->
      <div v-if="currentStep === 2" class="step-content">
        <div class="step-description">
          <h3>{{ t('userManagement.import.importResult') }}</h3>
        </div>
        <div v-if="importResult" class="import-result">
          <div class="result-summary">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="result-item success">
                  <div class="result-number">{{ importResult.successCount }}</div>
                  <div class="result-label">{{ t('userManagement.import.successCount') }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="result-item error">
                  <div class="result-number">{{ importResult.failureCount }}</div>
                  <div class="result-label">{{ t('userManagement.import.failureCount') }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="result-item total">
                  <div class="result-number">
                    {{ importResult.successCount + importResult.failureCount }}
                  </div>
                  <div class="result-label">{{ t('userManagement.import.totalCount') }}</div>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 失败详情 -->
          <div v-if="importResult.failureCount > 0" class="failure-details">
            <h4>{{ t('userManagement.import.failureDetails') }}</h4>
            <el-table :data="importResult.failures" style="width: 100%">
              <el-table-column
                prop="row"
                :label="t('userManagement.import.rowNumber')"
                width="80"
              />
              <el-table-column
                prop="username"
                :label="t('userManagement.form.username')"
                width="120"
              />
              <el-table-column
                prop="realName"
                :label="t('userManagement.form.realName')"
                width="120"
              />
              <el-table-column prop="email" :label="t('userManagement.form.email')" width="180" />
              <el-table-column
                prop="reason"
                :label="t('userManagement.import.errorReason')"
                show-overflow-tooltip
              />
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="currentStep > 0" @click="handlePrevious">
          {{ t('common.previous') }}
        </el-button>
        <el-button @click="handleClose">
          {{ currentStep === 2 ? t('common.close') : t('common.cancel') }}
        </el-button>
        <el-button
          v-if="currentStep < 2"
          type="primary"
          :disabled="currentStep === 1 && !selectedFile"
          :loading="importing"
          @click="handleNext"
        >
          {{ currentStep === 1 ? t('userManagement.import.startImport') : t('common.next') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { ElMessage, type UploadInstance, type UploadFile } from 'element-plus'
  import { Download, UploadFilled } from '@element-plus/icons-vue'
  import { useI18n } from '@/composables/useI18n'
  import { userMockApi } from '@/api/mock/userMock'
  import type { UserImportResult } from '@/types/user'

  interface Props {
    visible: boolean
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'success'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const { t } = useI18n()

  // 响应式数据
  const uploadRef = ref<UploadInstance>()
  const currentStep = ref(0)
  const selectedFile = ref<File | null>(null)
  const importing = ref(false)
  const importResult = ref<UserImportResult | null>(null)

  // 计算属性
  const dialogVisible = computed({
    get: () => props.visible,
    set: value => emit('update:visible', value)
  })

  const _canNextStep = computed(() => {
    if (currentStep.value === 0) {
      return true
    }
    if (currentStep.value === 1) {
      return selectedFile.value !== null
    }
    return false
  })

  // 方法
  const handleDownloadTemplate = async () => {
    try {
      ElMessage.info(t('userManagement.import.downloadingTemplate'))
      // 这里应该调用真实的模板下载API
      // const blob = await userApi.downloadTemplate()
      // downloadFile(blob, 'user_import_template.xlsx')
      setTimeout(() => {
        ElMessage.success(t('userManagement.import.downloadTemplateSuccess'))
      }, 1000)
    } catch (_error) {
      ElMessage.error(t('userManagement.import.downloadTemplateError'))
    }
  }

  const beforeUpload = (file: File) => {
    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel'
    const isLt10M = file.size / 1024 / 1024 < 10

    if (!isExcel) {
      ElMessage.error(t('userManagement.import.fileTypeError'))
      return false
    }
    if (!isLt10M) {
      ElMessage.error(t('userManagement.import.fileSizeError'))
      return false
    }
    return false // 阻止自动上传
  }

  const handleFileChange = (file: UploadFile) => {
    if (file.raw) {
      selectedFile.value = file.raw
    }
  }

  const handleImport = async () => {
    if (!selectedFile.value) {
      return
    }

    try {
      importing.value = true
      importResult.value = await userMockApi.import(selectedFile.value)
      currentStep.value = 2

      if (importResult.value.successCount > 0) {
        emit('success')
      }
    } catch (_error) {
      ElMessage.error(t('userManagement.import.importError'))
      console.error('导入用户失败:', _error)
    } finally {
      importing.value = false
    }
  }

  const handleNext = async () => {
    if (currentStep.value === 0) {
      currentStep.value = 1
    } else if (currentStep.value === 1) {
      await handleImport()
    }
  }

  const handlePrevious = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const handleClose = () => {
    dialogVisible.value = false
    resetDialog()
  }

  const resetDialog = () => {
    currentStep.value = 0
    selectedFile.value = null
    importing.value = false
    importResult.value = null
    uploadRef.value?.clearFiles()
  }
</script>

<style scoped>
  .import-content {
    padding: 20px 0;
  }

  .step-content {
    margin-top: 30px;
    min-height: 300px;
  }

  .step-description {
    margin-bottom: 20px;
    text-align: center;
  }

  .step-description h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .step-description p {
    margin: 0;
    color: var(--el-text-color-regular);
  }

  .template-download {
    text-align: center;
    margin-bottom: 20px;
  }

  .template-tips {
    margin-top: 20px;
  }

  .template-tips ul {
    margin: 10px 0 0 0;
    padding-left: 20px;
  }

  .template-tips li {
    margin-bottom: 5px;
    color: var(--el-text-color-regular);
  }

  .file-upload {
    margin-bottom: 20px;
  }

  .selected-file {
    text-align: center;
  }

  .import-result {
    margin-top: 20px;
  }

  .result-summary {
    margin-bottom: 30px;
  }

  .result-item {
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    background: var(--el-bg-color-page);
  }

  .result-item.success {
    border-left: 4px solid var(--el-color-success);
  }

  .result-item.error {
    border-left: 4px solid var(--el-color-danger);
  }

  .result-item.total {
    border-left: 4px solid var(--el-color-primary);
  }

  .result-number {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .result-item.success .result-number {
    color: var(--el-color-success);
  }

  .result-item.error .result-number {
    color: var(--el-color-danger);
  }

  .result-item.total .result-number {
    color: var(--el-color-primary);
  }

  .result-label {
    font-size: 14px;
    color: var(--el-text-color-regular);
  }

  .failure-details {
    margin-top: 20px;
  }

  .failure-details h4 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .dialog-footer {
    text-align: right;
  }
</style>
