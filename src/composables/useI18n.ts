/**
 * 国际化组合式函数
 * @description 提供多语言支持和Element Plus国际化集成
 * @author 开发团队
 * @date 2024-12-12
 * @version 2.0.0
 */

import { ref, computed, watch, readonly } from 'vue'
import type { Ref } from 'vue'

// Element Plus 语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import type { Language as ElementPlusLanguage } from 'element-plus/es/locale'

/**
 * 支持的语言类型
 */
export type Language = 'zh-cn' | 'en-us'

/**
 * 当前语言
 */
const currentLanguage = ref<Language>('zh-cn')

/**
 * Element Plus 语言包映射
 */
const elementPlusLocales: Record<Language, ElementPlusLanguage> = {
  'zh-cn': zhCn,
  'en-us': en
}

/**
 * 语言包定义
 */
const messages = {
  'zh-cn': {
    // 通用
    common: {
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      add: '添加',
      search: '搜索',
      reset: '重置',
      submit: '提交',
      loading: '加载中...',
      noData: '暂无数据',
      success: '操作成功',
      error: '操作失败',
      warning: '警告',
      info: '提示',
      view: '查看',
      close: '关闭',
      refresh: '刷新',
      actions: '操作',
      previous: '上一步',
      next: '下一步',
      to: '至',
      startDate: '开始日期',
      endDate: '结束日期',
      never: '从未',
      loadError: '加载失败',
      deleteSuccess: '删除成功',
      deleteError: '删除失败',
      operationError: '操作失败'
    },
    // 导航
    nav: {
      dashboard: '仪表盘',
      userManagement: '用户管理',
      systemSettings: '系统设置',
      profile: '个人信息',
      logout: '退出登录'
    },
    // 仪表盘
    dashboard: {
      welcome: '欢迎回来',
      todayIs: '今天是',
      workHappy: '祝您工作愉快',
      lastLogin: '上次登录',
      totalUsers: '总用户数',
      systemAvailability: '系统可用性',
      avgResponseTime: '平均响应时间',
      dataStorage: '数据存储',
      currentApiConfig: '当前API配置',
      runMode: '运行模式',
      apiAddress: 'API地址',
      environment: '环境',
      mockMode: '模拟数据模式',
      realMode: '真实接口模式',
      mockNotice: '当前使用模拟数据，所有操作仅在本地生效',
      notConfigured: '未配置'
    },
    // 用户
    user: {
      username: '用户名',
      password: '密码',
      email: '邮箱',
      phone: '手机号',
      avatar: '头像',
      role: '角色',
      status: '状态',
      createTime: '创建时间',
      lastLoginTime: '最后登录时间'
    },
    // 主题
    theme: {
      light: '浅色模式',
      dark: '深色模式',
      auto: '跟随系统',
      switchTheme: '切换主题'
    },
    // 语言
    language: {
      chinese: '中文',
      english: 'English',
      switchLanguage: '切换语言成功'
    },
    // 用户管理
    userManagement: {
      title: '用户管理',
      description: '管理系统用户，包括用户信息的增删改查、批量操作、导入导出等功能',
      search: {
        placeholder: '搜索用户名、姓名、邮箱、手机号',
        role: '角色',
        status: '状态',
        department: '部门'
      },
      actions: {
        create: '新增用户',
        batchDelete: '批量删除',
        batchEnable: '批量启用',
        batchDisable: '批量禁用',
        import: '导入用户',
        export: '导出用户',
        downloadTemplate: '下载模板'
      },
      table: {
        avatar: '头像',
        username: '用户名',
        realName: '真实姓名',
        email: '邮箱',
        phone: '手机号',
        role: '角色',
        status: '状态',
        department: '部门',
        position: '职位',
        createdAt: '创建时间'
      },
      roles: {
        admin: '管理员',
        user: '普通用户',
        guest: '访客'
      },
      status: {
        active: '正常',
        disabled: '禁用',
        pending: '待审核'
      },
      gender: {
        male: '男',
        female: '女',
        other: '其他'
      },
      stats: {
        totalUsers: '总用户数',
        activeUsers: '活跃用户',
        todayNewUsers: '今日新增',
        monthNewUsers: '本月新增'
      },
      dialog: {
        createTitle: '新增用户',
        editTitle: '编辑用户',
        detailTitle: '用户详情',
        importTitle: '导入用户'
      },
      form: {
        username: '用户名',
        usernamePlaceholder: '请输入用户名',
        realName: '真实姓名',
        realNamePlaceholder: '请输入真实姓名',
        email: '邮箱',
        emailPlaceholder: '请输入邮箱地址',
        phone: '手机号',
        phonePlaceholder: '请输入手机号码',
        password: '密码',
        passwordPlaceholder: '请输入密码',
        confirmPassword: '确认密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        role: '角色',
        rolePlaceholder: '请选择角色',
        status: '状态',
        statusPlaceholder: '请选择状态',
        gender: '性别',
        genderPlaceholder: '请选择性别',
        age: '年龄',
        agePlaceholder: '请输入年龄',
        department: '部门',
        departmentPlaceholder: '请选择部门',
        position: '职位',
        positionPlaceholder: '请选择职位',
        address: '地址',
        addressPlaceholder: '请输入地址',
        avatar: '头像',
        avatarTips: '支持 JPG、PNG 格式，文件大小不超过 2MB',
        remark: '备注',
        remarkPlaceholder: '请输入备注信息'
      },
      validation: {
        usernameRequired: '请输入用户名',
        usernameLength: '用户名长度为 3-20 个字符',
        usernameFormat: '用户名只能包含字母、数字和下划线',
        usernameExists: '用户名已存在',
        realNameRequired: '请输入真实姓名',
        realNameLength: '真实姓名长度为 2-20 个字符',
        emailRequired: '请输入邮箱地址',
        emailFormat: '请输入正确的邮箱格式',
        emailExists: '邮箱已存在',
        phoneRequired: '请输入手机号码',
        phoneFormat: '请输入正确的手机号格式',
        passwordRequired: '请输入密码',
        passwordLength: '密码长度为 6-20 个字符',
        confirmPasswordRequired: '请确认密码',
        confirmPasswordMismatch: '两次输入的密码不一致',
        roleRequired: '请选择角色',
        statusRequired: '请选择状态',
        genderRequired: '请选择性别',
        ageRequired: '请输入年龄',
        ageRange: '年龄必须在 18-100 之间',
        departmentRequired: '请选择部门',
        positionRequired: '请选择职位',
        addressRequired: '请输入地址',
        avatarFormat: '头像只能是 JPG/PNG 格式',
        avatarSize: '头像大小不能超过 2MB'
      },
      detail: {
        basicInfo: '基本信息',
        contactInfo: '联系信息',
        personalInfo: '个人信息',
        workInfo: '工作信息',
        timeInfo: '时间信息',
        yearsOld: '岁',
        times: '次',
        loginCount: '登录次数',
        updatedAt: '更新时间',
        lastLoginTime: '最后登录'
      },
      import: {
        step1: '下载模板',
        step2: '上传文件',
        step3: '导入结果',
        downloadTemplate: '下载导入模板',
        downloadTemplateDesc: '请先下载用户导入模板，按照模板格式填写用户信息',
        downloadTemplateBtn: '下载模板文件',
        templateTips: '模板使用说明',
        tip1: '请严格按照模板格式填写用户信息',
        tip2: '用户名、邮箱不能重复',
        tip3: '密码将自动生成，用户首次登录后需要修改',
        tip4: '支持最多 1000 条用户数据导入',
        uploadFile: '上传用户文件',
        uploadFileDesc: '请选择填写好的用户数据文件进行上传',
        dragFile: '将文件拖到此处，或',
        clickUpload: '点击上传',
        fileFormat: '只能上传 xlsx/xls 文件，且不超过 10MB',
        importResult: '导入结果',
        successCount: '成功导入',
        failureCount: '导入失败',
        totalCount: '总计',
        failureDetails: '失败详情',
        rowNumber: '行号',
        errorReason: '失败原因',
        startImport: '开始导入',
        downloadingTemplate: '正在下载模板...',
        downloadTemplateSuccess: '模板下载成功',
        downloadTemplateError: '模板下载失败',
        fileTypeError: '文件格式不正确，请上传 Excel 文件',
        fileSizeError: '文件大小不能超过 10MB',
        importError: '导入失败，请检查文件格式'
      },
      confirmDelete: '确定要删除用户 "{name}" 吗？',
      confirmBatchDelete: '确定要删除选中的 {count} 个用户吗？',
      createSuccess: '用户创建成功',
      createError: '用户创建失败',
      updateSuccess: '用户更新成功',
      updateError: '用户更新失败',
      exportStarted: '导出任务已开始，请稍候...',
      exportSuccess: '用户数据导出成功',
      exportError: '用户数据导出失败',
      downloadTemplateStarted: '模板下载已开始...',
      downloadTemplateSuccess: '模板下载成功',
      downloadTemplateError: '模板下载失败'
    }
  },
  'en-us': {
    // Common
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      reset: 'Reset',
      submit: 'Submit',
      loading: 'Loading...',
      noData: 'No Data',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      view: 'View',
      close: 'Close',
      refresh: 'Refresh',
      actions: 'Actions',
      previous: 'Previous',
      next: 'Next',
      to: 'to',
      startDate: 'Start Date',
      endDate: 'End Date',
      never: 'Never',
      loadError: 'Load Error',
      deleteSuccess: 'Delete Success',
      deleteError: 'Delete Error',
      operationError: 'Operation Error'
    },
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      userManagement: 'User Management',
      systemSettings: 'System Settings',
      profile: 'Profile',
      logout: 'Logout'
    },
    // Dashboard
    dashboard: {
      welcome: 'Welcome back',
      todayIs: 'Today is',
      workHappy: 'Have a great day at work',
      lastLogin: 'Last login',
      totalUsers: 'Total Users',
      systemAvailability: 'System Availability',
      avgResponseTime: 'Avg Response Time',
      dataStorage: 'Data Storage',
      currentApiConfig: 'Current API Configuration',
      runMode: 'Run Mode',
      apiAddress: 'API Address',
      environment: 'Environment',
      mockMode: 'Mock Data Mode',
      realMode: 'Real API Mode',
      mockNotice: 'Currently using mock data, all operations are local only',
      notConfigured: 'Not configured'
    },
    // User
    user: {
      username: 'Username',
      password: 'Password',
      email: 'Email',
      phone: 'Phone',
      avatar: 'Avatar',
      role: 'Role',
      status: 'Status',
      createTime: 'Create Time',
      lastLoginTime: 'Last Login Time'
    },
    // Theme
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode',
      auto: 'Follow System',
      switchTheme: 'Switch Theme'
    },
    // Language
    language: {
      chinese: '中文',
      english: 'English',
      switchLanguage: 'Language switched successfully'
    },
    // User Management
    userManagement: {
      title: 'User Management',
      description:
        'Manage system users, including CRUD operations, batch operations, import/export functions',
      search: {
        placeholder: 'Search username, name, email, phone',
        role: 'Role',
        status: 'Status',
        department: 'Department'
      },
      actions: {
        create: 'Create User',
        batchDelete: 'Batch Delete',
        batchEnable: 'Batch Enable',
        batchDisable: 'Batch Disable',
        import: 'Import Users',
        export: 'Export Users',
        downloadTemplate: 'Download Template'
      },
      table: {
        avatar: 'Avatar',
        username: 'Username',
        realName: 'Real Name',
        email: 'Email',
        phone: 'Phone',
        role: 'Role',
        status: 'Status',
        department: 'Department',
        position: 'Position',
        createdAt: 'Created At'
      },
      roles: {
        admin: 'Administrator',
        user: 'User',
        guest: 'Guest'
      },
      status: {
        active: 'Active',
        disabled: 'Disabled',
        pending: 'Pending'
      },
      gender: {
        male: 'Male',
        female: 'Female',
        other: 'Other'
      },
      stats: {
        totalUsers: 'Total Users',
        activeUsers: 'Active Users',
        todayNewUsers: 'Today New',
        monthNewUsers: 'Month New'
      },
      dialog: {
        createTitle: 'Create User',
        editTitle: 'Edit User',
        detailTitle: 'User Details',
        importTitle: 'Import Users'
      },
      form: {
        username: 'Username',
        usernamePlaceholder: 'Please enter username',
        realName: 'Real Name',
        realNamePlaceholder: 'Please enter real name',
        email: 'Email',
        emailPlaceholder: 'Please enter email address',
        phone: 'Phone',
        phonePlaceholder: 'Please enter phone number',
        password: 'Password',
        passwordPlaceholder: 'Please enter password',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Please confirm password',
        role: 'Role',
        rolePlaceholder: 'Please select role',
        status: 'Status',
        statusPlaceholder: 'Please select status',
        gender: 'Gender',
        genderPlaceholder: 'Please select gender',
        age: 'Age',
        agePlaceholder: 'Please enter age',
        department: 'Department',
        departmentPlaceholder: 'Please select department',
        position: 'Position',
        positionPlaceholder: 'Please select position',
        address: 'Address',
        addressPlaceholder: 'Please enter address',
        avatar: 'Avatar',
        avatarTips: 'Support JPG, PNG format, file size no more than 2MB',
        remark: 'Remark',
        remarkPlaceholder: 'Please enter remark'
      },
      validation: {
        usernameRequired: 'Please enter username',
        usernameLength: 'Username length should be 3-20 characters',
        usernameFormat: 'Username can only contain letters, numbers and underscores',
        usernameExists: 'Username already exists',
        realNameRequired: 'Please enter real name',
        realNameLength: 'Real name length should be 2-20 characters',
        emailRequired: 'Please enter email address',
        emailFormat: 'Please enter correct email format',
        emailExists: 'Email already exists',
        phoneRequired: 'Please enter phone number',
        phoneFormat: 'Please enter correct phone format',
        passwordRequired: 'Please enter password',
        passwordLength: 'Password length should be 6-20 characters',
        confirmPasswordRequired: 'Please confirm password',
        confirmPasswordMismatch: 'Passwords do not match',
        roleRequired: 'Please select role',
        statusRequired: 'Please select status',
        genderRequired: 'Please select gender',
        ageRequired: 'Please enter age',
        ageRange: 'Age must be between 18-100',
        departmentRequired: 'Please select department',
        positionRequired: 'Please select position',
        addressRequired: 'Please enter address',
        avatarFormat: 'Avatar can only be JPG/PNG format',
        avatarSize: 'Avatar size cannot exceed 2MB'
      },
      detail: {
        basicInfo: 'Basic Information',
        contactInfo: 'Contact Information',
        personalInfo: 'Personal Information',
        workInfo: 'Work Information',
        timeInfo: 'Time Information',
        yearsOld: 'years old',
        times: 'times',
        loginCount: 'Login Count',
        updatedAt: 'Updated At',
        lastLoginTime: 'Last Login'
      },
      import: {
        step1: 'Download Template',
        step2: 'Upload File',
        step3: 'Import Result',
        downloadTemplate: 'Download Import Template',
        downloadTemplateDesc:
          'Please download the user import template first and fill in user information according to the template format',
        downloadTemplateBtn: 'Download Template File',
        templateTips: 'Template Usage Instructions',
        tip1: 'Please strictly follow the template format to fill in user information',
        tip2: 'Username and email cannot be duplicated',
        tip3: 'Password will be automatically generated, users need to change it after first login',
        tip4: 'Support up to 1000 user data import',
        uploadFile: 'Upload User File',
        uploadFileDesc: 'Please select the filled user data file for upload',
        dragFile: 'Drop file here, or',
        clickUpload: 'click to upload',
        fileFormat: 'Only xlsx/xls files are supported, no more than 10MB',
        importResult: 'Import Result',
        successCount: 'Successfully Imported',
        failureCount: 'Import Failed',
        totalCount: 'Total',
        failureDetails: 'Failure Details',
        rowNumber: 'Row Number',
        errorReason: 'Error Reason',
        startImport: 'Start Import',
        downloadingTemplate: 'Downloading template...',
        downloadTemplateSuccess: 'Template downloaded successfully',
        downloadTemplateError: 'Template download failed',
        fileTypeError: 'Incorrect file format, please upload Excel file',
        fileSizeError: 'File size cannot exceed 10MB',
        importError: 'Import failed, please check file format'
      },
      confirmDelete: 'Are you sure to delete user "{name}"?',
      confirmBatchDelete: 'Are you sure to delete {count} selected users?',
      createSuccess: 'User created successfully',
      createError: 'User creation failed',
      updateSuccess: 'User updated successfully',
      updateError: 'User update failed',
      exportStarted: 'Export task started, please wait...',
      exportSuccess: 'User data exported successfully',
      exportError: 'User data export failed',
      downloadTemplateStarted: 'Template download started...',
      downloadTemplateSuccess: 'Template downloaded successfully',
      downloadTemplateError: 'Template download failed'
    }
  }
}

/**
 * 语言显示名称
 */
const languageLabel = computed(() => {
  const labels = {
    'zh-cn': '中文',
    'en-us': 'English'
  }
  return labels[currentLanguage.value]
})

/**
 * Element Plus 当前语言包
 */
const elementPlusLocale: Ref<ElementPlusLanguage> = computed(() => {
  return elementPlusLocales[currentLanguage.value]
})

/**
 * 翻译函数
 * @param key 翻译键，支持嵌套键如 'nav.dashboard'
 * @param params 参数对象，用于字符串插值
 * @returns 翻译后的文本
 */
const t = (key: string, params?: Record<string, any>): string => {
  const keys = key.split('.')
  let value: any = messages[currentLanguage.value]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Translation key "${key}" not found for language "${currentLanguage.value}"`)
      return key
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation key "${key}" does not resolve to a string`)
    return key
  }

  // 简单的字符串插值
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? String(params[paramKey]) : match
    })
  }

  return value
}

/**
 * 切换语言
 * @param language 目标语言
 */
const switchLanguage = (language: Language) => {
  currentLanguage.value = language
  localStorage.setItem('language', language)

  // 更新HTML lang属性
  document.documentElement.lang = language === 'zh-cn' ? 'zh-CN' : 'en-US'
}

/**
 * 获取所有可用语言
 */
const getAvailableLanguages = () => {
  return [
    { value: 'zh-cn', label: '中文', icon: '🇨🇳', flagClass: 'flag-cn' },
    { value: 'en-us', label: 'English', icon: '🇺🇸', flagClass: 'flag-us' }
  ]
}

/**
 * 初始化语言设置
 */
const initLanguage = () => {
  // 从localStorage获取保存的语言
  const savedLanguage = localStorage.getItem('language') as Language

  if (savedLanguage && ['zh-cn', 'en-us'].includes(savedLanguage)) {
    currentLanguage.value = savedLanguage
  } else {
    // 检测浏览器语言
    const browserLanguage = navigator.language.toLowerCase()
    if (browserLanguage.startsWith('zh')) {
      currentLanguage.value = 'zh-cn'
    } else {
      currentLanguage.value = 'en-us'
    }
  }

  // 设置HTML lang属性
  document.documentElement.lang = currentLanguage.value === 'zh-cn' ? 'zh-CN' : 'en-US'
}

// 监听语言变化，自动保存到localStorage
watch(
  currentLanguage,
  newLanguage => {
    localStorage.setItem('language', newLanguage)
    document.documentElement.lang = newLanguage === 'zh-cn' ? 'zh-CN' : 'en-US'
  },
  { immediate: false }
)

// 初始化语言
initLanguage()

/**
 * 国际化组合式函数
 */
export function useI18n() {
  return {
    // 状态
    currentLanguage: readonly(currentLanguage),
    languageLabel,
    elementPlusLocale,

    // 方法
    t,
    switchLanguage,
    getAvailableLanguages,
    initLanguage
  }
}
