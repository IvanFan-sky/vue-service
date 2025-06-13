 # Vue Service - 登录认证系统

一个基于 Vue 3 + TypeScript 的现代化前端项目，支持真实接口和模拟接口的登录认证功能。

## 🚀 功能特性

- ✅ **双模式认证**：支持真实接口和模拟接口切换
- ✅ **完整登录流程**：用户登录、状态管理、权限控制
- ✅ **现代化UI**：响应式设计，美观的登录界面
- ✅ **类型安全**：完整的 TypeScript 类型定义
- ✅ **状态管理**：基于 Pinia 的用户状态管理
- ✅ **路由守卫**：自动登录状态检查和跳转

## 📦 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: SCSS
- **代码规范**: ESLint + Prettier

## 🛠️ 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式启动

#### 使用真实接口（dev模式）
```bash
npm run dev
```
- 环境：开发环境
- API模式：真实接口
- API地址：http://localhost:8080/api

#### 使用模拟接口（mock模式）
```bash
npm run mock
```
- 环境：模拟环境
- API模式：模拟数据
- 数据：本地模拟数据

### 构建项目

```bash
# 生产环境构建
npm run build

# 开发环境构建
npm run build:dev

# 模拟环境构建
npm run build:mock
```

### 代码检查和格式化

```bash
# ESLint 检查和修复
npm run lint

# Prettier 格式化
npm run format

# TypeScript 类型检查
npm run type-check
```

## 🔐 登录功能说明

### 模拟模式测试账号

当使用 `npm run mock` 启动时，可以使用以下测试账号：

| 用户名 | 密码 | 角色 | 权限 |
|--------|------|------|------|
| admin | 123456 | 管理员 | 所有权限 |
| user | 123456 | 普通用户 | 基础权限 |
| guest | 123456 | 访客 | 只读权限 |

### 真实接口模式

当使用 `npm run dev` 启动时，需要：

1. 确保后端API服务运行在 `http://localhost:8080`
2. 后端需要提供以下接口：
   - `POST /api/auth/login` - 用户登录
   - `GET /api/auth/user` - 获取用户信息
   - `POST /api/auth/logout` - 用户登出

## 📁 项目结构

```
src/
├── api/                    # API接口层
│   ├── mock/              # 模拟数据
│   │   └── auth.ts        # 认证模拟API
│   └── auth.ts            # 认证API（支持真实/模拟切换）
├── assets/                # 静态资源
│   └── styles/            # 样式文件
├── components/            # 公共组件
│   └── Layout/            # 布局组件
├── composables/           # 组合式函数
├── constants/             # 常量定义
├── router/                # 路由配置
├── stores/                # 状态管理
│   └── auth.ts            # 认证状态管理
├── types/                 # 类型定义
├── utils/                 # 工具函数
├── views/                 # 页面组件
│   ├── Login.vue          # 登录页面
│   └── Dashboard.vue      # 仪表盘页面
├── App.vue               # 根组件
└── main.ts               # 应用入口
```

## 🔧 环境配置

### 环境变量文件

- `.env` - 基础配置
- `.env.development` - 开发环境（真实接口）
- `.env.mock` - 模拟环境（模拟数据）
- `.env.production` - 生产环境

### 主要环境变量

```bash
# 应用标题
VITE_APP_TITLE=Vue Service

# API基础URL
VITE_API_BASE_URL=http://localhost:8080/api

# 是否使用模拟数据
VITE_USE_MOCK=false

# 是否开启调试
VITE_DEBUG=true
```

## 🎯 核心功能实现

### 1. API模式切换

系统根据环境变量 `VITE_USE_MOCK` 自动选择使用真实API还是模拟API：

```typescript
// src/api/auth.ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
export const authApi = USE_MOCK ? mockAuthApi : realAuthApi
```

### 2. 用户状态管理

使用 Pinia 管理用户登录状态：

```typescript
// src/stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  
  const login = async (username: string, password: string) => {
    // 登录逻辑
  }
  
  return { token, user, isAuthenticated, login }
})
```

### 3. 路由守卫

自动检查登录状态和权限：

```typescript
// src/router/index.ts
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta?.requireAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  next()
})
```

## 🎨 界面特性

### 登录页面
- 响应式设计，支持移动端
- 实时表单验证
- 密码显示/隐藏切换
- 加载状态和错误提示
- 模拟模式下显示测试账号

### 仪表盘页面
- 用户信息展示
- 系统统计卡片
- API模式指示器
- 快捷退出登录

## 🔍 开发调试

### 控制台信息

开发环境下，系统会在控制台输出有用的调试信息：

```
🔧 认证API模式: mock
🌐 API基础URL: http://localhost:8080/api
🎭 使用模拟数据: true
🔐 登录页面已加载
📡 API模式: mock
```

### 模拟数据

模拟API提供完整的认证流程模拟：
- Token生成和验证
- 用户信息管理
- 登录状态持久化
- 网络延迟模拟

## 📝 开发规范

项目遵循严格的开发规范：

- **代码风格**: ESLint + Prettier
- **类型安全**: 完整的 TypeScript 类型定义
- **注释规范**: 所有代码都有详细的中文注释
- **组件规范**: 统一的组件结构和命名
- **样式规范**: BEM命名法 + SCSS变量

## 🚀 部署说明

### 生产环境部署

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 目录部署到Web服务器

3. 配置环境变量：
```bash
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_USE_MOCK=false
```

### Docker部署

项目支持Docker容器化部署，详见 `Dockerfile`。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

如有问题或建议，请联系开发团队。

---

**Vue Service** - 现代化的前端认证解决方案 🎉