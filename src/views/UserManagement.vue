<!--
  用户管理页面
  @description 用户CRUD、分页查询、条件搜索、批量操作、导入导出等功能
  @author 开发团队
  @date 2024-12-12
  @version 1.0.0
-->

<template>
  <div class="user-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>{{ t('userManagement.title') }}</h1>
      <p>{{ t('userManagement.description') }}</p>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchForm.keyword"
            :placeholder="t('userManagement.search.placeholder')"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchForm.role"
            :placeholder="t('userManagement.search.role')"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="role in roleOptions"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchForm.status"
            :placeholder="t('userManagement.search.status')"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="searchForm.department"
            :placeholder="t('userManagement.search.department')"
            clearable
            @change="handleSearch"
          >
            <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            :range-separator="t('common.to')"
            :start-placeholder="t('common.startDate')"
            :end-placeholder="t('common.endDate')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateRangeChange"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮栏 -->
    <div class="action-bar">
      <div class="left-actions">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          {{ t('userManagement.actions.create') }}
        </el-button>
        <el-button type="danger" :disabled="selectedUsers.length === 0" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>
          {{ t('userManagement.actions.batchDelete') }}
        </el-button>
        <el-button type="success" :disabled="selectedUsers.length === 0" @click="handleBatchEnable">
          <el-icon><Check /></el-icon>
          {{ t('userManagement.actions.batchEnable') }}
        </el-button>
        <el-button
          type="warning"
          :disabled="selectedUsers.length === 0"
          @click="handleBatchDisable"
        >
          <el-icon><Close /></el-icon>
          {{ t('userManagement.actions.batchDisable') }}
        </el-button>
      </div>
      <div class="right-actions">
        <el-button @click="handleImport">
          <el-icon><Upload /></el-icon>
          {{ t('userManagement.actions.import') }}
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          {{ t('userManagement.actions.export') }}
        </el-button>
        <el-button @click="handleDownloadTemplate">
          <el-icon><Document /></el-icon>
          {{ t('userManagement.actions.downloadTemplate') }}
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          {{ t('common.refresh') }}
        </el-button>
      </div>
    </div>

    <!-- 用户统计卡片 -->
    <div class="statistics-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon total">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.totalUsers }}</div>
                <div class="stat-label">{{ t('userManagement.stats.totalUsers') }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon active">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.activeUsers }}</div>
                <div class="stat-label">{{ t('userManagement.stats.activeUsers') }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon today">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.todayNewUsers }}</div>
                <div class="stat-label">{{ t('userManagement.stats.todayNewUsers') }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon month">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.monthNewUsers }}</div>
                <div class="stat-label">{{ t('userManagement.stats.monthNewUsers') }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 用户列表表格 -->
    <div class="user-table">
      <el-table
        v-loading="loading"
        :data="userList"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        stripe
        border
        height="600"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" sortable="custom" />
        <el-table-column prop="avatar" :label="t('userManagement.table.avatar')" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :alt="row.realName">
              {{ row.realName.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          :label="t('userManagement.table.username')"
          width="120"
          sortable="custom"
        />
        <el-table-column
          prop="realName"
          :label="t('userManagement.table.realName')"
          width="120"
          sortable="custom"
        />
        <el-table-column
          prop="email"
          :label="t('userManagement.table.email')"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="phone" :label="t('userManagement.table.phone')" width="140" />
        <el-table-column prop="role" :label="t('userManagement.table.role')" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)">
              {{ getRoleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('userManagement.table.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="department"
          :label="t('userManagement.table.department')"
          width="120"
        />
        <el-table-column prop="position" :label="t('userManagement.table.position')" width="120" />
        <el-table-column
          prop="createdAt"
          :label="t('userManagement.table.createdAt')"
          width="180"
          sortable="custom"
        >
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('common.actions')" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              {{ t('common.view') }}
            </el-button>
            <el-button type="success" size="small" @click="handleEdit(row)">
              {{ t('common.edit') }}
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              {{ t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 用户表单对话框 -->
    <UserFormDialog
      v-model:visible="formDialogVisible"
      :user="currentUser"
      :mode="formMode"
      @success="handleFormSuccess"
    />

    <!-- 用户详情对话框 -->
    <UserDetailDialog v-model:visible="detailDialogVisible" :user="currentUser" />

    <!-- 导入对话框 -->
    <UserImportDialog v-model:visible="importDialogVisible" @success="handleImportSuccess" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    Search,
    Plus,
    Delete,
    Check,
    Close,
    Upload,
    Download,
    Document,
    Refresh,
    User,
    UserFilled,
    Calendar,
    TrendCharts
  } from '@element-plus/icons-vue'
  import { useI18n } from '@/composables/useI18n'
  import { userMockApi } from '@/api/mock/userMock'
  import type {
    User as UserType,
    UserListQuery,
    UserStatistics,
    UserRole,
    UserStatus
  } from '@/types/user'
  import UserFormDialog from '@/components/User/UserFormDialog.vue'
  import UserDetailDialog from '@/components/User/UserDetailDialog.vue'
  import UserImportDialog from '@/components/User/UserImportDialog.vue'

  const { t } = useI18n()

  // 响应式数据
  const loading = ref(false)
  const userList = ref<UserType[]>([])
  const selectedUsers = ref<UserType[]>([])
  const departments = ref<string[]>([])
  const statistics = ref<UserStatistics>({
    totalUsers: 0,
    activeUsers: 0,
    todayNewUsers: 0,
    monthNewUsers: 0,
    roleDistribution: {} as Record<UserRole, number>,
    statusDistribution: {} as Record<UserStatus, number>,
    departmentDistribution: {} as Record<string, number>
  })

  // 搜索表单
  const searchForm = reactive<Partial<UserListQuery>>({
    keyword: '',
    role: undefined,
    status: undefined,
    department: '',
    startDate: '',
    endDate: ''
  })

  // 日期范围
  const dateRange = ref<[string, string] | null>(null)

  // 分页
  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 0
  })

  // 对话框状态
  const formDialogVisible = ref(false)
  const detailDialogVisible = ref(false)
  const importDialogVisible = ref(false)
  const currentUser = ref<UserType | null>(null)
  const formMode = ref<'create' | 'edit'>('create')

  // 选项数据
  const roleOptions = computed(() => [
    { label: t('userManagement.roles.admin'), value: 'admin' },
    { label: t('userManagement.roles.user'), value: 'user' },
    { label: t('userManagement.roles.guest'), value: 'guest' }
  ])

  const statusOptions = computed(() => [
    { label: t('userManagement.status.active'), value: 1 },
    { label: t('userManagement.status.disabled'), value: 0 },
    { label: t('userManagement.status.pending'), value: 2 }
  ])

  // 方法
  const loadUserList = async () => {
    try {
      loading.value = true
      const params: UserListQuery = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...searchForm
      }

      const result = await userMockApi.getList(params)
      userList.value = result.list
      pagination.total = result.total
    } catch (_error) {
      ElMessage.error(t('common.loadError'))
      console.error('加载用户列表失败:', _error)
    } finally {
      loading.value = false
    }
  }

  const loadStatistics = async () => {
    try {
      statistics.value = await userMockApi.getStatistics()
    } catch (_error) {
      console.error('加载统计数据失败:', _error)
    }
  }

  const loadDepartments = async () => {
    try {
      departments.value = await userMockApi.getDepartments()
    } catch (_error) {
      console.error('加载部门列表失败:', _error)
    }
  }

  const handleSearch = () => {
    pagination.page = 1
    loadUserList()
  }

  const handleDateRangeChange = (dates: [string, string] | null) => {
    if (dates) {
      searchForm.startDate = dates[0]
      searchForm.endDate = dates[1]
    } else {
      searchForm.startDate = ''
      searchForm.endDate = ''
    }
    handleSearch()
  }

  const handleSelectionChange = (selection: UserType[]) => {
    selectedUsers.value = selection
  }

  const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
    if (order) {
      searchForm.sortField = prop
      searchForm.sortOrder = order === 'ascending' ? 'asc' : 'desc'
    } else {
      searchForm.sortField = undefined
      searchForm.sortOrder = undefined
    }
    handleSearch()
  }

  const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.page = 1
    loadUserList()
  }

  const handleCurrentChange = (page: number) => {
    pagination.page = page
    loadUserList()
  }

  const handleCreate = () => {
    currentUser.value = null
    formMode.value = 'create'
    formDialogVisible.value = true
  }

  const handleView = (user: UserType) => {
    currentUser.value = user
    detailDialogVisible.value = true
  }

  const handleEdit = (user: UserType) => {
    currentUser.value = user
    formMode.value = 'edit'
    formDialogVisible.value = true
  }

  const handleDelete = async (user: UserType) => {
    try {
      await ElMessageBox.confirm(
        t('userManagement.confirmDelete', { name: user.realName }),
        t('common.warning'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )

      await userMockApi.delete(user.id)
      ElMessage.success(t('common.deleteSuccess'))
      loadUserList()
      loadStatistics()
    } catch (_error) {
      if (_error !== 'cancel') {
        ElMessage.error(t('common.deleteError'))
      }
    }
  }

  const handleBatchDelete = async () => {
    try {
      await ElMessageBox.confirm(
        t('userManagement.confirmBatchDelete', { count: selectedUsers.value.length }),
        t('common.warning'),
        {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )

      const ids = selectedUsers.value.map(user => user.id)
      const result = await userMockApi.batchOperation({ ids, action: 'delete' })
      ElMessage.success(result.message)
      loadUserList()
      loadStatistics()
    } catch (_error) {
      if (_error !== 'cancel') {
        ElMessage.error(t('common.operationError'))
      }
    }
  }

  const handleBatchEnable = async () => {
    try {
      const ids = selectedUsers.value.map(user => user.id)
      const result = await userMockApi.batchOperation({ ids, action: 'enable' })
      ElMessage.success(result.message)
      loadUserList()
      loadStatistics()
    } catch (_error) {
      ElMessage.error(t('common.operationError'))
    }
  }

  const handleBatchDisable = async () => {
    try {
      const ids = selectedUsers.value.map(user => user.id)
      const result = await userMockApi.batchOperation({ ids, action: 'disable' })
      ElMessage.success(result.message)
      loadUserList()
      loadStatistics()
    } catch (_error) {
      ElMessage.error(t('common.operationError'))
    }
  }

  const handleImport = () => {
    importDialogVisible.value = true
  }

  const handleExport = async () => {
    try {
      ElMessage.info(t('userManagement.exportStarted'))
      // 这里应该调用真实的导出API
      // const blob = await userApi.export(searchForm)
      // downloadFile(blob, 'users.xlsx')
      setTimeout(() => {
        ElMessage.success(t('userManagement.exportSuccess'))
      }, 2000)
    } catch (_error) {
      ElMessage.error(t('userManagement.exportError'))
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      ElMessage.info(t('userManagement.downloadTemplateStarted'))
      // 这里应该调用真实的模板下载API
      // const blob = await userApi.downloadTemplate()
      // downloadFile(blob, 'user_template.xlsx')
      setTimeout(() => {
        ElMessage.success(t('userManagement.downloadTemplateSuccess'))
      }, 1000)
    } catch (_error) {
      ElMessage.error(t('userManagement.downloadTemplateError'))
    }
  }

  const handleRefresh = () => {
    loadUserList()
    loadStatistics()
  }

  const handleFormSuccess = () => {
    loadUserList()
    loadStatistics()
  }

  const handleImportSuccess = () => {
    loadUserList()
    loadStatistics()
  }

  // 辅助方法
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // 生命周期
  onMounted(() => {
    loadUserList()
    loadStatistics()
    loadDepartments()
  })
</script>

<style scoped>
  .user-management {
    padding: 20px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .page-header h1 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .page-header p {
    margin: 0;
    color: var(--el-text-color-regular);
  }

  .search-bar {
    margin-bottom: 20px;
    padding: 20px;
    background: var(--el-bg-color);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-light);
  }

  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .left-actions,
  .right-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .statistics-cards {
    margin-bottom: 20px;
  }

  .stat-card {
    border: none;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    flex-shrink: 0;
  }

  .stat-icon.total {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .stat-icon.active {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  .stat-icon.today {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  .stat-icon.month {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }

  .stat-info {
    flex: 1;
    min-width: 0;
  }

  .stat-number {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 14px;
    color: var(--el-text-color-regular);
    word-break: break-all;
  }

  .user-table {
    margin-bottom: 20px;
    overflow-x: auto;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  /* 响应式设计优化 */
  @media (max-width: 1600px) {
    .user-management {
      padding: 16px;
    }
  }

  @media (max-width: 1200px) {
    .page-header h1 {
      font-size: 20px;
    }

    .search-bar {
      padding: 16px;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }

    .stat-number {
      font-size: 20px;
    }

    .stat-content {
      gap: 12px;
    }
  }

  @media (max-width: 992px) {
    .user-management {
      padding: 12px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 16px;
    }

    .action-bar {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .left-actions,
    .right-actions {
      justify-content: center;
      flex-wrap: wrap;
    }

    .search-bar {
      padding: 12px;
    }

    .statistics-cards .el-row {
      margin: 0 -6px;
    }

    .statistics-cards .el-col {
      padding: 0 6px;
      margin-bottom: 12px;
    }

    .user-table {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
  }

  @media (max-width: 768px) {
    .user-management {
      padding: 8px;
    }

    .page-header h1 {
      font-size: 18px;
    }

    .page-header p {
      font-size: 13px;
    }

    .search-bar {
      padding: 10px;
    }

    .search-bar .el-row {
      margin: 0 -4px;
    }

    .search-bar .el-col {
      padding: 0 4px;
      margin-bottom: 8px;
    }

    .action-bar {
      margin-bottom: 16px;
    }

    .left-actions,
    .right-actions {
      gap: 6px;
    }

    .left-actions .el-button,
    .right-actions .el-button {
      font-size: 12px;
      padding: 6px 12px;
    }

    .statistics-cards {
      margin-bottom: 16px;
    }

    .statistics-cards .el-row {
      margin: 0 -4px;
    }

    .statistics-cards .el-col {
      padding: 0 4px;
      margin-bottom: 8px;
    }

    .stat-card {
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    }

    .stat-content {
      gap: 8px;
      padding: 12px;
    }

    .stat-icon {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }

    .stat-number {
      font-size: 16px;
    }

    .stat-label {
      font-size: 12px;
    }

    .user-table {
      font-size: 12px;
    }

    .pagination {
      :deep(.el-pagination) {
        .el-pagination__sizes,
        .el-pagination__jump {
          display: none;
        }

        .btn-prev,
        .btn-next,
        .el-pager li {
          min-width: 28px;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
        }
      }
    }
  }

  @media (max-width: 576px) {
    .user-management {
      padding: 6px;
    }

    .page-header {
      margin-bottom: 12px;
    }

    .page-header h1 {
      font-size: 16px;
    }

    .search-bar {
      padding: 8px;
      margin-bottom: 12px;
    }

    .search-bar .el-col {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .action-bar {
      margin-bottom: 12px;
    }

    .left-actions,
    .right-actions {
      width: 100%;
      justify-content: space-around;
    }

    .left-actions .el-button,
    .right-actions .el-button {
      flex: 1;
      max-width: none;
      margin: 0 2px;
      font-size: 11px;
      padding: 4px 8px;
    }

    .statistics-cards {
      margin-bottom: 12px;
    }

    .statistics-cards .el-col {
      flex: 0 0 50%;
      max-width: 50%;
      margin-bottom: 6px;
    }

    .stat-content {
      padding: 8px;
    }

    .stat-icon {
      width: 28px;
      height: 28px;
      font-size: 14px;
    }

    .stat-number {
      font-size: 14px;
    }

    .stat-label {
      font-size: 11px;
    }

    .user-table {
      font-size: 11px;
      margin-bottom: 12px;
    }

    .user-table :deep(.el-table) {
      .el-table__header th,
      .el-table__body td {
        padding: 6px 4px;
      }

      .el-button {
        padding: 2px 6px;
        font-size: 10px;
      }

      .el-avatar {
        width: 24px;
        height: 24px;
      }

      .el-tag {
        padding: 0 4px;
        font-size: 10px;
      }
    }

    .pagination {
      :deep(.el-pagination) {
        .el-pagination__total,
        .el-pagination__sizes,
        .el-pagination__jump {
          display: none;
        }

        .btn-prev,
        .btn-next {
          min-width: 24px;
          height: 24px;
          line-height: 24px;
        }

        .el-pager li {
          min-width: 24px;
          height: 24px;
          line-height: 24px;
          font-size: 11px;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .statistics-cards .el-col {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .left-actions,
    .right-actions {
      flex-direction: column;
      gap: 4px;
    }

    .left-actions .el-button,
    .right-actions .el-button {
      width: 100%;
      margin: 0;
    }
  }
</style>
