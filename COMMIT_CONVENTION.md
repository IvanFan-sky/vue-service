# Git 提交信息规范

## 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 必填部分

#### Type (类型)

- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能的变更）
- **refactor**: 重构代码（既不是新增功能，也不是修复bug）
- **perf**: 性能优化
- **test**: 添加或修改测试
- **chore**: 构建过程或辅助工具的变动
- **ci**: CI/CD相关变更
- **build**: 构建系统或外部依赖变更

#### Subject (主题)

- 使用中文描述
- 不超过50个字符
- 首字母小写
- 结尾不加句号
- 使用祈使句，描述做了什么而不是做过什么

### 可选部分

#### Scope (范围)

- 用于说明 commit 影响的范围
- 常见范围：
  - `auth`: 认证相关
  - `user`: 用户管理
  - `role`: 角色管理
  - `system`: 系统设置
  - `api`: API接口
  - `ui`: 用户界面
  - `config`: 配置文件
  - `deps`: 依赖管理

#### Body (正文)

- 详细描述变更的动机和与之前行为的对比
- 每行不超过72个字符

#### Footer (页脚)

- 用于关闭 Issue 或说明破坏性变更
- 格式：`Closes #123` 或 `BREAKING CHANGE: 描述`

## 示例

### 基本格式

```
feat: 添加用户登录功能
```

### 带范围

```
fix(auth): 修复登录状态验证问题
```

### 完整格式

```
feat(user): 添加用户个人信息编辑功能

允许用户编辑个人基本信息，包括姓名、邮箱、电话等字段。
添加表单验证和数据保存功能。

Closes #123
```

### 破坏性变更

```
feat(api): 重构用户API接口

BREAKING CHANGE: 用户API响应格式发生变更，需要更新前端调用代码
```

## 常见错误示例

❌ **错误示例**

```
修复bug
Update README
添加了新功能
fixed login issue
```

✅ **正确示例**

```
fix: 修复登录验证问题
docs: 更新README文档
feat: 添加用户管理功能
fix(auth): 修复登录状态验证
```

## 工具配置

### Commitizen 配置

可以使用 commitizen 工具来规范提交信息：

```bash
npm install -g commitizen cz-conventional-changelog
echo '{"path": "cz-conventional-changelog"}' > ~/.czrc
```

使用 `git cz` 代替 `git commit` 来提交代码。

### Git Hooks

项目已配置 husky 和 lint-staged，确保代码质量和提交规范。

## 注意事项

1. 提交信息应该清晰明了，让其他开发者能够快速理解变更内容
2. 一次提交只做一件事，避免混合多种类型的变更
3. 提交前确保代码已经过测试和代码检查
4. 重要的破坏性变更必须在 footer 中说明
5. 使用中文描述，保持团队沟通的一致性

---

遵循这个规范有助于：

- 提高代码审查效率
- 自动生成 CHANGELOG
- 快速定位问题
- 更好的项目维护
