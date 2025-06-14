<!--
  角色管理页面
  @description 系统角色管理，包括角色的增删改查和权限分配
  @author 开发团队
  @date 2024-12-14
  @version 1.0.0
-->

<template>
  <div class="role-management" :class="{ 'role-management--dark': isDark }">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">角色管理</h1>
          <p class="page-description">管理系统角色和权限分配</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新增角色
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon stat-icon-primary">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.totalRoles }}</div>
              <div class="stat-label">总角色数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon stat-icon-success">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.enabledRoles }}</div>
              <div class="stat-label">启用角色</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon stat-icon-warning">
              <el-icon><Setting /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.systemRoles }}</div>
              <div class="stat-label">系统角色</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon stat-icon-info">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ statistics.customRoles }}</div>
              <div class="stat-label">自定义角色</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索和操作栏 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="角色名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入角色名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.enabled"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="searchForm.isSystem"
            placeholder="请选择类型"
            clearable
            style="width: 120px"
          >
            <el-option label="系统角色" :value="true" />
            <el-option label="自定义角色" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 角色列表 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="roleList"
        stripe
        class="role-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column prop="name" label="角色名称" min-width="150">
          <template #default="{ row }">
            <div class="role-name">
              <el-tag v-if="row.isSystem" type="warning" size="small">系统</el-tag>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="角色代码" width="120" />

        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />

        <el-table-column prop="userCount" label="用户数量" width="100" align="center">
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewUsers(row)">
              {{ row.userCount }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="enabled" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.enabled"
              :disabled="row.isSystem"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleViewPermissions(row)">
              权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(row)"
              :disabled="row.isSystem"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
              :disabled="row.isSystem || row.userCount > 0"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
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
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="formMode === 'create' ? '新增角色' : '编辑角色'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="角色代码" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入角色代码"
            :disabled="formMode === 'edit'"
          />
        </el-form-item>

        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>

        <el-form-item label="是否启用" prop="enabled">
          <el-switch v-model="formData.enabled" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting"> 确定 </el-button>
      </template>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限分配"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="permission-content">
        <div class="permission-header">
          <h4>为角色 "{{ currentRole?.name }}" 分配权限</h4>
          <div class="permission-actions">
            <el-button size="small" @click="handleExpandAll">
              {{ allExpanded ? '收起全部' : '展开全部' }}
            </el-button>
            <el-button size="small" @click="handleCheckAll">
              {{ allChecked ? '取消全选' : '全选' }}
            </el-button>
          </div>
        </div>

        <el-tree
          ref="permissionTreeRef"
          :data="permissionTree"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-expanded-keys="expandedKeys"
          :default-checked-keys="checkedKeys"
          class="permission-tree"
        >
          <template #default="{ data }">
            <div class="tree-node">
              <el-icon v-if="data.type === 'menu'"><Menu /></el-icon>
              <el-icon v-else-if="data.type === 'button'"><Operation /></el-icon>
              <el-icon v-else><Link /></el-icon>
              <span class="node-label">{{ data.name }}</span>
              <el-tag v-if="data.type" :type="getPermissionTypeColor(data.type)" size="small">
                {{ getPermissionTypeText(data.type) }}
              </el-tag>
            </div>
          </template>
        </el-tree>
      </div>

      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePermissions" :loading="permissionSaving">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    Plus,
    Search,
    Refresh,
    UserFilled,
    Check,
    Setting,
    User,
    Menu,
    Operation,
    Link
  } from '@element-plus/icons-vue'
  import { useTheme } from '@/composables/useTheme'
  import { roleApi, permissionApi } from '@/api/modules/role'
  import type {
    Role,
    RoleListQuery,
    CreateRoleRequest,
    UpdateRoleRequest,
    RoleStatistics,
    PermissionTreeNode
  } from '../types/role'
  import type { FormInstance, FormRules } from 'element-plus'

  /**
   * 组合式函数
   */
  const { isDark } = useTheme()

  /**
   * 响应式数据
   */
  const loading = ref(false)
  const submitting = ref(false)
  const permissionSaving = ref(false)
  const formDialogVisible = ref(false)
  const permissionDialogVisible = ref(false)
  const formMode = ref<'create' | 'edit'>('create')
  const allExpanded = ref(false)
  const allChecked = ref(false)

  const formRef = ref<FormInstance>()
  const permissionTreeRef = ref()

  // 角色列表
  const roleList = ref<Role[]>([])
  const selectedRoles = ref<Role[]>([])
  const currentRole = ref<Role | null>(null)

  // 分页
  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 0
  })

  // 搜索表单
  const searchForm = reactive<Partial<RoleListQuery>>({
    keyword: '',
    enabled: undefined,
    isSystem: undefined
  })

  // 表单数据
  const formData = reactive<Partial<CreateRoleRequest>>({
    code: '',
    name: '',
    description: '',
    enabled: true,
    permissionIds: []
  })

  // 统计数据
  const statistics = ref<RoleStatistics>({
    totalRoles: 0,
    enabledRoles: 0,
    systemRoles: 0,
    customRoles: 0
  })

  // 权限树
  const permissionTree = ref<PermissionTreeNode[]>([])
  const expandedKeys = ref<number[]>([])
  const checkedKeys = ref<number[]>([])

  /**
   * 表单验证规则
   */
  const formRules: FormRules = {
    code: [
      { required: true, message: '请输入角色代码', trigger: 'blur' },
      { min: 2, max: 50, message: '角色代码长度在 2 到 50 个字符', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
        message: '角色代码只能包含字母、数字和下划线，且以字母开头',
        trigger: 'blur'
      }
    ],
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 50, message: '角色名称长度在 2 到 50 个字符', trigger: 'blur' }
    ]
  }

  /**
   * 树形组件配置
   */
  const treeProps = {
    children: 'children',
    label: 'name'
  }

  /**
   * 工具函数
   */
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
  }

  const getPermissionTypeColor = (type: string) => {
    const colorMap = {
      menu: 'primary',
      button: 'success',
      api: 'info'
    }
    return colorMap[type as keyof typeof colorMap] || 'info'
  }

  const getPermissionTypeText = (type: string) => {
    const textMap = {
      menu: '菜单',
      button: '按钮',
      api: '接口'
    }
    return textMap[type as keyof typeof textMap] || '未知'
  }

  /**
   * API 调用
   */
  const loadRoleList = async () => {
    try {
      loading.value = true
      const params: RoleListQuery = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...searchForm
      }

      const response = await roleApi.getList(params)
      roleList.value = response.list
      pagination.total = response.total
    } catch (_error) {
      console.error('加载角色列表失败:', _error)
      ElMessage.error('加载角色列表失败')
    } finally {
      loading.value = false
    }
  }

  const loadStatistics = async () => {
    try {
      statistics.value = await roleApi.getStatistics()
    } catch (_error) {
      console.error('加载统计数据失败:', _error)
    }
  }

  const loadPermissionTree = async () => {
    try {
      permissionTree.value = await permissionApi.getTree()
    } catch (_error) {
      console.error('加载权限树失败:', _error)
      ElMessage.error('加载权限树失败')
    }
  }

  /**
   * 事件处理
   */
  const handleSearch = () => {
    pagination.page = 1
    loadRoleList()
  }

  const handleReset = () => {
    Object.assign(searchForm, {
      keyword: '',
      enabled: undefined,
      isSystem: undefined
    })
    handleSearch()
  }

  const handleCreate = () => {
    formMode.value = 'create'
    Object.assign(formData, {
      code: '',
      name: '',
      description: '',
      enabled: true,
      permissionIds: []
    })
    formDialogVisible.value = true
  }

  const handleEdit = (role: Role) => {
    formMode.value = 'edit'
    Object.assign(formData, {
      code: role.code,
      name: role.name,
      description: role.description,
      enabled: role.enabled,
      permissionIds: role.permissions.map(p => p.id)
    })
    currentRole.value = role
    formDialogVisible.value = true
  }

  const handleDelete = async (role: Role) => {
    try {
      await ElMessageBox.confirm(`确定要删除角色 "${role.name}" 吗？此操作不可恢复。`, '确认删除', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })

      await roleApi.delete(role.id)
      ElMessage.success('删除成功')
      loadRoleList()
      loadStatistics()
    } catch (_error) {
      if (_error !== 'cancel') {
        console.error('删除角色失败:', _error)
        ElMessage.error('删除失败')
      }
    }
  }

  const handleSubmit = async () => {
    if (!formRef.value) {
      return
    }

    try {
      await formRef.value.validate()
      submitting.value = true

      if (formMode.value === 'create') {
        await roleApi.create(formData as CreateRoleRequest)
        ElMessage.success('创建成功')
      } else {
        await roleApi.update(currentRole.value!.id, formData as UpdateRoleRequest)
        ElMessage.success('更新成功')
      }

      formDialogVisible.value = false
      loadRoleList()
      loadStatistics()
    } catch (_error) {
      console.error('提交失败:', _error)
      ElMessage.error('操作失败')
    } finally {
      submitting.value = false
    }
  }

  const handleStatusChange = async (role: Role) => {
    try {
      await roleApi.updateStatus(role.id, role.enabled)
      ElMessage.success('状态更新成功')
      loadStatistics()
    } catch (_error) {
      console.error('状态更新失败:', _error)
      ElMessage.error('状态更新失败')
      // 恢复原状态
      role.enabled = !role.enabled
    }
  }

  const handleViewPermissions = async (role: Role) => {
    currentRole.value = role
    checkedKeys.value = role.permissions.map(p => p.id)
    permissionDialogVisible.value = true

    if (permissionTree.value.length === 0) {
      await loadPermissionTree()
    }
  }

  const handleViewUsers = (row: any) => {
    // 跳转到用户管理页面，并筛选该角色的用户
    console.log('查看角色用户:', row)
    ElMessage.info('跳转到用户管理页面功能待实现')
  }

  const handleSelectionChange = (selection: Role[]) => {
    selectedRoles.value = selection
  }

  const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.page = 1
    loadRoleList()
  }

  const handleCurrentChange = (page: number) => {
    pagination.page = page
    loadRoleList()
  }

  const handleExpandAll = () => {
    allExpanded.value = !allExpanded.value
    if (allExpanded.value) {
      expandedKeys.value = getAllNodeIds(permissionTree.value)
      permissionTreeRef.value?.setExpandedKeys(expandedKeys.value)
    } else {
      expandedKeys.value = []
      permissionTreeRef.value?.setExpandedKeys([])
    }
  }

  const handleCheckAll = () => {
    allChecked.value = !allChecked.value
    if (allChecked.value) {
      checkedKeys.value = getAllNodeIds(permissionTree.value)
      permissionTreeRef.value?.setCheckedKeys(checkedKeys.value)
    } else {
      checkedKeys.value = []
      permissionTreeRef.value?.setCheckedKeys([])
    }
  }

  const getAllNodeIds = (nodes: PermissionTreeNode[]): number[] => {
    const ids: number[] = []
    const traverse = (nodeList: PermissionTreeNode[]) => {
      nodeList.forEach(node => {
        ids.push(node.id)
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    traverse(nodes)
    return ids
  }

  const handleSavePermissions = async () => {
    try {
      permissionSaving.value = true
      const checkedNodes = permissionTreeRef.value?.getCheckedKeys() || []

      await roleApi.assignPermissions({
        roleId: currentRole.value!.id,
        permissionIds: checkedNodes
      })

      ElMessage.success('权限分配成功')
      permissionDialogVisible.value = false
      loadRoleList()
    } catch (_error) {
      console.error('权限分配失败:', _error)
      ElMessage.error('权限分配失败')
    } finally {
      permissionSaving.value = false
    }
  }

  /**
   * 生命周期
   */
  onMounted(() => {
    loadRoleList()
    loadStatistics()
  })
</script>

<style scoped lang="scss">
  @use '@/assets/styles/variables' as *;

  .role-management {
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

  // 统计卡片
  .stats-section {
    margin-bottom: $spacing-lg;

    .stat-card {
      display: flex;
      align-items: center;
      padding: $spacing-lg;
      background: white;
      border-radius: $border-radius-lg;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: $border-radius-round;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: $spacing-lg;

        .el-icon {
          font-size: 24px;
          color: white;
        }

        &.stat-icon-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.stat-icon-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.stat-icon-warning {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        &.stat-icon-info {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }
      }

      .stat-content {
        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: $text-color-primary;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: $text-color-secondary;
        }
      }
    }
  }

  // 搜索卡片
  .search-card {
    margin-bottom: $spacing-lg;

    .search-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  // 表格卡片
  .table-card {
    .role-table {
      .role-name {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin-top: $spacing-lg;
    }
  }

  // 权限对话框
  .permission-content {
    .permission-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-lg;
      padding-bottom: $spacing-md;
      border-bottom: 1px solid $border-color-light;

      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: $text-color-primary;
      }

      .permission-actions {
        display: flex;
        gap: $spacing-sm;
      }
    }

    .permission-tree {
      max-height: 400px;
      overflow-y: auto;

      .tree-node {
        display: flex;
        align-items: center;
        gap: $spacing-sm;

        .el-icon {
          font-size: 16px;
          color: $text-color-secondary;
        }

        .node-label {
          flex: 1;
          font-size: 14px;
        }

        .el-tag {
          margin-left: auto;
        }
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

    .stats-section {
      .el-col {
        margin-bottom: $spacing-md;
      }
    }

    .search-form {
      .el-form-item {
        margin-bottom: $spacing-md;
      }
    }
  }

  @media (max-width: $breakpoint-md) {
    .role-management {
      padding: $spacing-md;
    }

    .stat-card {
      .stat-icon {
        width: 50px;
        height: 50px;
        margin-right: $spacing-md;

        .el-icon {
          font-size: 20px;
        }
      }

      .stat-content {
        .stat-value {
          font-size: 24px;
        }
      }
    }

    .role-table {
      .el-table__body-wrapper {
        overflow-x: auto;
      }
    }
  }

  // 暗色主题适配
  .role-management--dark {
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

    .stat-card {
      background: $dark-background-color-light;

      .stat-content {
        .stat-value {
          color: $dark-text-color-primary;
        }

        .stat-label {
          color: $dark-text-color-secondary;
        }
      }
    }

    .permission-content {
      .permission-header {
        border-bottom-color: $dark-border-color-light;

        h4 {
          color: $dark-text-color-primary;
        }
      }

      .tree-node {
        .el-icon {
          color: $dark-text-color-secondary;
        }
      }
    }
  }
</style>
