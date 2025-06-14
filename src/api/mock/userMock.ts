/**
 * 用户模拟数据生成器
 * @description 使用faker.js生成真实的用户模拟数据
 * @author 开发团队
 * @date 2024-12-12
 * @version 1.0.0
 */

import { faker } from '@faker-js/faker'
import type {
  User,
  UserListQuery,
  UserListResult,
  CreateUserRequest,
  UpdateUserRequest,
  BatchOperationRequest,
  UserImportResult,
  UserStatistics,
  UserRole,
  UserGender
} from '@/types/user'
import { UserStatus } from '@/types/user'

/**
 * 部门列表
 */
const DEPARTMENTS = [
  '技术部',
  '产品部',
  '设计部',
  '运营部',
  '市场部',
  '销售部',
  '人事部',
  '财务部',
  '法务部',
  '行政部'
]

/**
 * 职位列表
 */
const POSITIONS = [
  '前端工程师',
  '后端工程师',
  '全栈工程师',
  '产品经理',
  '项目经理',
  'UI设计师',
  'UX设计师',
  '运营专员',
  '市场专员',
  '销售经理',
  'HR专员',
  '财务专员',
  '法务专员',
  '行政助理',
  '总监',
  'VP'
]

/**
 * 用户角色权重（用于随机生成）
 */
const ROLE_WEIGHTS: Array<{ role: UserRole; weight: number }> = [
  { role: 'user', weight: 70 },
  { role: 'admin', weight: 20 },
  { role: 'guest', weight: 10 }
]

/**
 * 用户状态权重
 */
const STATUS_WEIGHTS: Array<{ status: UserStatus; weight: number }> = [
  { status: UserStatus.ACTIVE, weight: 80 },
  { status: UserStatus.DISABLED, weight: 15 },
  { status: UserStatus.PENDING, weight: 5 }
]

/**
 * 性别权重
 */
const GENDER_WEIGHTS: Array<{ gender: UserGender; weight: number }> = [
  { gender: 'male', weight: 45 },
  { gender: 'female', weight: 45 },
  { gender: 'other', weight: 10 }
]

/**
 * 根据权重随机选择
 */
function weightedRandom<T>(items: Array<{ weight: number } & T>): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * totalWeight

  for (const item of items) {
    random -= item.weight
    if (random <= 0) {
      return item
    }
  }

  return items[0]
}

/**
 * 生成随机用户数据
 */
function generateUser(id?: number): User {
  const role = weightedRandom(ROLE_WEIGHTS).role
  const status = weightedRandom(STATUS_WEIGHTS).status
  const gender = weightedRandom(GENDER_WEIGHTS).gender
  const department = faker.helpers.arrayElement(DEPARTMENTS)
  const position = faker.helpers.arrayElement(POSITIONS)

  // 根据性别生成对应的姓名和头像
  const firstName =
    gender === 'female' ? faker.person.firstName('female') : faker.person.firstName('male')
  const lastName = faker.person.lastName()
  const realName = `${lastName}${firstName}`

  const createdAt = faker.date.between({ from: '2020-01-01', to: new Date() })
  const lastLoginTime = faker.date.between({ from: createdAt, to: new Date() })

  return {
    id: id || faker.number.int({ min: 1, max: 10000 }),
    username: faker.internet.userName(),
    realName,
    email: faker.internet.email(),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    role,
    status,
    gender,
    age: faker.number.int({ min: 18, max: 65 }),
    department,
    position,
    address: faker.location.streetAddress(),
    remark: Math.random() > 0.7 ? faker.lorem.sentence() : undefined,
    createdAt: createdAt.toISOString(),
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }).toISOString(),
    lastLoginTime: lastLoginTime.toISOString(),
    loginCount: faker.number.int({ min: 0, max: 1000 })
  }
}

/**
 * 生成用户列表
 */
function generateUserList(count: number): User[] {
  return Array.from({ length: count }, (_, index) => generateUser(index + 1))
}

// 生成模拟用户数据（500个用户）
const mockUsers: User[] = generateUserList(500)

/**
 * 用户模拟API
 */
export const userMockApi = {
  /**
   * 获取用户列表
   */
  getList: async (params: UserListQuery): Promise<UserListResult> => {
    await new Promise(resolve => setTimeout(resolve, 300)) // 模拟网络延迟

    let filteredUsers = [...mockUsers]

    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredUsers = filteredUsers.filter(
        user =>
          user.username.toLowerCase().includes(keyword) ||
          user.realName.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword) ||
          user.phone.includes(keyword) ||
          user.department.toLowerCase().includes(keyword) ||
          user.position.toLowerCase().includes(keyword)
      )
    }

    // 角色筛选
    if (params.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role)
    }

    // 状态筛选
    if (params.status !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status)
    }

    // 性别筛选
    if (params.gender) {
      filteredUsers = filteredUsers.filter(user => user.gender === params.gender)
    }

    // 部门筛选
    if (params.department) {
      filteredUsers = filteredUsers.filter(user => user.department === params.department)
    }

    // 时间范围筛选
    if (params.startDate) {
      filteredUsers = filteredUsers.filter(
        user => new Date(user.createdAt) >= new Date(params.startDate!)
      )
    }
    if (params.endDate) {
      filteredUsers = filteredUsers.filter(
        user => new Date(user.createdAt) <= new Date(params.endDate!)
      )
    }

    // 排序
    if (params.sortField && params.sortOrder) {
      filteredUsers.sort((a, b) => {
        const aValue = (a as any)[params.sortField!]
        const bValue = (b as any)[params.sortField!]

        if (params.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    // 分页
    const total = filteredUsers.length
    const totalPages = Math.ceil(total / params.pageSize)
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredUsers.slice(start, end)

    return {
      list,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages
    }
  },

  /**
   * 获取用户详情
   */
  getById: async (id: number): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 200))

    const user = mockUsers.find(u => u.id === id)
    if (!user) {
      throw new Error('用户不存在')
    }

    return user
  },

  /**
   * 创建用户
   */
  create: async (data: CreateUserRequest): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    // 检查用户名是否已存在
    if (mockUsers.some(u => u.username === data.username)) {
      throw new Error('用户名已存在')
    }

    // 检查邮箱是否已存在
    if (mockUsers.some(u => u.email === data.email)) {
      throw new Error('邮箱已存在')
    }

    const newUser: User = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      username: data.username,
      realName: data.realName,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar || faker.image.avatar(),
      role: data.role,
      status: data.status,
      gender: data.gender,
      age: data.age,
      department: data.department,
      position: data.position,
      address: data.address,
      remark: data.remark,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginTime: undefined,
      loginCount: 0
    }

    mockUsers.push(newUser)
    return newUser
  },

  /**
   * 更新用户
   */
  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      throw new Error('用户不存在')
    }

    // 检查邮箱是否已被其他用户使用
    if (data.email && mockUsers.some(u => u.id !== id && u.email === data.email)) {
      throw new Error('邮箱已被其他用户使用')
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString()
    }

    mockUsers[userIndex] = updatedUser
    return updatedUser
  },

  /**
   * 删除用户
   */
  delete: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      throw new Error('用户不存在')
    }

    mockUsers.splice(userIndex, 1)
  },

  /**
   * 批量操作
   */
  batchOperation: async (
    data: BatchOperationRequest
  ): Promise<{
    successCount: number
    failureCount: number
    message: string
  }> => {
    await new Promise(resolve => setTimeout(resolve, 800))

    let successCount = 0
    let failureCount = 0

    for (const id of data.ids) {
      const userIndex = mockUsers.findIndex(u => u.id === id)

      if (userIndex === -1) {
        failureCount++
        continue
      }

      switch (data.action) {
        case 'delete':
          mockUsers.splice(userIndex, 1)
          successCount++
          break
        case 'enable':
          mockUsers[userIndex].status = UserStatus.ACTIVE
          mockUsers[userIndex].updatedAt = new Date().toISOString()
          successCount++
          break
        case 'disable':
          mockUsers[userIndex].status = UserStatus.DISABLED
          mockUsers[userIndex].updatedAt = new Date().toISOString()
          successCount++
          break
        default:
          failureCount++
      }
    }

    const actionNames = {
      delete: '删除',
      enable: '启用',
      disable: '禁用',
      export: '导出'
    }

    return {
      successCount,
      failureCount,
      message: `${actionNames[data.action]}操作完成：成功 ${successCount} 个，失败 ${failureCount} 个`
    }
  },

  /**
   * 获取统计数据
   */
  getStatistics: async (): Promise<UserStatistics> => {
    await new Promise(resolve => setTimeout(resolve, 200))

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const totalUsers = mockUsers.length
    const activeUsers = mockUsers.filter(u => u.status === UserStatus.ACTIVE).length
    const todayNewUsers = mockUsers.filter(u => new Date(u.createdAt) >= today).length
    const monthNewUsers = mockUsers.filter(u => new Date(u.createdAt) >= thisMonth).length

    // 角色分布
    const roleDistribution = mockUsers.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<UserRole, number>
    )

    // 状态分布
    const statusDistribution = mockUsers.reduce(
      (acc, user) => {
        acc[user.status] = (acc[user.status] || 0) + 1
        return acc
      },
      {} as Record<UserStatus, number>
    )

    // 部门分布
    const departmentDistribution = mockUsers.reduce(
      (acc, user) => {
        acc[user.department] = (acc[user.department] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      totalUsers,
      activeUsers,
      todayNewUsers,
      monthNewUsers,
      roleDistribution,
      statusDistribution,
      departmentDistribution
    }
  },

  /**
   * 检查用户名是否可用
   */
  checkUsername: async (username: string): Promise<{ available: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 200))

    const available = !mockUsers.some(u => u.username === username)
    return { available }
  },

  /**
   * 检查邮箱是否可用
   */
  checkEmail: async (email: string): Promise<{ available: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 200))

    const available = !mockUsers.some(u => u.email === email)
    return { available }
  },

  /**
   * 获取部门列表
   */
  getDepartments: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return DEPARTMENTS
  },

  /**
   * 获取职位列表
   */
  getPositions: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return POSITIONS
  },

  /**
   * 重置用户密码
   */
  resetPassword: async (id: number, newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      throw new Error('用户不存在')
    }

    // 模拟密码重置（实际项目中需要加密处理）
    mockUsers[userIndex].updatedAt = new Date().toISOString()
  },

  /**
   * 更新用户状态
   */
  updateStatus: async (id: number, status: number): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      throw new Error('用户不存在')
    }

    mockUsers[userIndex].status = status as UserStatus
    mockUsers[userIndex].updatedAt = new Date().toISOString()

    return mockUsers[userIndex]
  },

  /**
   * 模拟用户导入
   */
  import: async (file: File): Promise<UserImportResult> => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟解析Excel文件并导入用户
    const importCount = faker.number.int({ min: 5, max: 20 })
    const successCount = Math.floor(importCount * 0.8)
    const failureCount = importCount - successCount

    const newUsers = generateUserList(successCount).map(user => ({
      ...user,
      id: Math.max(...mockUsers.map(u => u.id)) + user.id
    }))

    mockUsers.push(...newUsers)

    return {
      successCount,
      failureCount,
      failures: Array.from({ length: failureCount }, (_, index) => ({
        row: index + successCount + 1,
        data: {
          username: faker.internet.userName(),
          realName: faker.name.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          role: 'user',
          gender: 'male',
          age: 25,
          department: '技术部',
          position: '工程师',
          address: faker.address.streetAddress()
        },
        error: '邮箱格式不正确'
      })),
      users: newUsers
    }
  }
}
