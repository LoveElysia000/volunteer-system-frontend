# 登录API联调更新日志

**更新日期**: 2026-01-31
**更新内容**: 将前端项目从模拟API切换到真实后端接口，实现完整的登录、登出和token刷新功能

---

## 一、依赖安装

### package.json
**位置**: 项目根目录
**修改内容**: 新增axios依赖

```json
"axios": "^1.6.0"  // 新增
```

---

## 二、新建文件

### 2.1 类型定义文件

#### src/types/auth.ts
**位置**: `src/types/auth.ts`
**说明**: 认证相关类型定义

**新增类型**:
- `LoginType` 枚举：username/email/phone
- `UserIdentity` 枚举：volunteer/organization
- `UserInfo` 接口：后端返回的用户信息结构
- `LoginRequest` / `LoginResponse` 接口
- `LogoutRequest` / `LogoutResponse` 接口
- `RefreshTokenRequest` / `RefreshTokenResponse` 接口
- `User` 接口：前端使用的用户信息

#### src/api/types.ts
**位置**: `src/api/types.ts`
**说明**: API通用类型定义

**新增类型**:
- `HttpMethod` 类型：GET/POST/PUT/DELETE/PATCH
- `RequestConfig` 接口：请求配置
- `InternalRequestConfig` 接口：扩展请求配置（用于axios）
- `ApiError` 接口：API错误结构

### 2.2 工具文件

#### src/utils/token.ts
**位置**: `src/utils/token.ts`
**说明**: Token管理工具

**导出方法**:
- `getAccessToken()` / `setAccessToken()` - 访问令牌存储/获取
- `getRefreshToken()` / `setRefreshToken()` - 刷新令牌存储/获取
- `getExpiresAt()` / `setExpiresAt()` - 过期时间存储/获取
- `isTokenExpiringSoon()` - 检查是否即将过期（5分钟内）
- `isTokenExpired()` - 检查是否已过期
- `clearTokens()` - 清除所有token
- `setTokens()` - 批量设置token

### 2.3 API层文件

#### src/api/index.ts
**位置**: `src/api/index.ts`
**说明**: Axios实例配置

**配置内容**:
- baseURL: `http://localhost:1109` (可通过环境变量配置)
- timeout: 30秒
- **请求拦截器**: 自动添加 `Authorization: Bearer {token}` 请求头
- **响应拦截器**:
  - 处理401错误，自动刷新token并重试请求
  - 刷新失败时清除token并跳转登录页
  - 统一错误处理

#### src/api/request.ts
**位置**: `src/api/request.ts`
**说明**: 请求封装

**导出方法**:
- `request<T>()` - 通用请求方法
- `http.get()` - GET请求快捷方法
- `http.post()` - POST请求快捷方法
- `http.put()` - PUT请求快捷方法
- `http.delete()` - DELETE请求快捷方法
- `http.patch()` - PATCH请求快捷方法

#### src/api/auth.ts
**位置**: `src/api/auth.ts`
**说明**: 认证API

**导出方法**:
- `authApi.login(data)` - 用户登录 (POST /api/login)
- `authApi.logout(data)` - 用户登出 (POST /api/logout)
- `authApi.refreshToken(data)` - 刷新令牌 (POST /api/refresh)

### 2.4 环境配置文件

#### .env.development
**位置**: 项目根目录
**说明**: 开发环境配置

```env
VITE_API_BASE_URL=http://localhost:1109
```

#### .env.production
**位置**: 项目根目录
**说明**: 生产环境配置

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## 三、修改文件

### 3.1 认证状态管理

#### src/store/modules/auth.ts
**位置**: `src/store/modules/auth.ts`
**修改内容**: 完全重构为对接真实API

**主要变更**:
1. 导入真实API模块和token管理工具
2. 新增 `transformUserInfo()` 函数：将后端UserInfo转换为前端User
3. 新增 `isRefreshing` 状态：防止并发刷新token
4. **重构 `restoreAuthState()` 方法**:
   - 检查token是否过期
   - 自动刷新即将过期的token
5. **重构 `login()` 方法**:
   - 从 `{ username, password, role }` 改为 `{ loginType, identifier, password, identity }`
   - 调用真实API `authApi.login()`
   - 保存access token、refresh token和过期时间
6. **重构 `logout()` 方法**:
   - 调用真实API `authApi.logout()`
   - 无论请求成功与否都清除本地状态
7. **新增 `refreshToken()` 方法**:
   - 实现token刷新逻辑
   - 更新本地token和用户信息

**代码片段对比**:

```typescript
// 旧版 login 方法（模拟API）
const login = async (credentials: { username: string; password: string; role?: 'volunteer' | 'organization' }) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      token.value = 'mock-jwt-token'
      // ...
    }, 1000)
  })
}

// 新版 login 方法（真实API）
const login = async (credentials: {
  loginType: 'username' | 'email' | 'phone'
  identifier: string
  password: string
  identity: UserIdentity
}) => {
  const response = await authApi.login({
    loginType: credentials.loginType,
    identifier: credentials.identifier,
    password: credentials.password,
    identity: credentials.identity
  })
  // 保存token和用户信息...
}
```

### 3.2 登录页面

#### src/views/Auth/Login.vue
**位置**: `src/views/Auth/Login.vue`
**修改内容**: 更新登录逻辑以适配后端API

**主要变更**:
1. 导入 `useMessageStore` 用于显示错误提示
2. **修改 `handleLogin()` 方法**:
  移除 `submitData` 变量，直接调用store的login方法
   - 参数格式从 `{ username, password, role }` 改为 `{ loginType, identifier, password, identity }`
   - 移除登录成功的 console.log
   - 添加错误处理，使用 `messageStore.error()` 显示错误信息

**代码位置**: 第460-489行

```typescript
try {
  // 调用认证store的登录方法，传递符合后端API格式的参数
  await authStore.login({
    loginType: loginState.mode,  // 'username' | 'email' | 'phone'
    identifier: loginState.mode === LoginMode.EMAIL ? loginState.form.email :
                loginState.mode === LoginMode.PHONE ? loginState.form.phone :
                loginState.form.username,
    password: loginState.form.password,
    identity: loginState.role as 'volunteer' | 'organization'
  })

  loading.value = false

  // 根据用户角色跳转到不同页面
  if (authStore.user?.role === 'volunteer') {
    router.push('/volunteer')
  } else if (authStore.user?.role === 'organization') {
    router.push('/organization')
  } else {
    router.push('/')
  }
} catch (error: any) {
  loading.value = false
  console.error('登录失败:', error)
  // 显示错误提示
  messageStore.error(error.message || '登录失败，请检查用户名和密码')
}
```

### 3.3 路由守卫

#### src/router/index.ts
**位置**: `src/router/index.ts`
**修改内容**: 增强路由守卫，支持token过期自动刷新

**主要变更**:
1. 导入 `tokenManager` 工具
2. 将 `beforeEach` 改为 `async` 以支持异步操作
3. 在认证检查中增加token过期检查:
   - 如果token过期，尝试自动刷新
   - 如果刷新失败，跳转登录页

**代码位置**: 第26-63行

```typescript
// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 对于404页面，直接放行，不进行认证检查
  if (to.name === 'not-found' || to.name === '404') {
    next()
    return
  }

  const authStore = useAuthStore()

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 检查token是否存在
    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    // 检查token是否过期
    if (tokenManager.isTokenExpired()) {
      // 尝试刷新token
      try {
        await authStore.refreshToken()
      } catch (error) {
        // 刷新失败，跳转登录
        return next('/login')
      }
    }
  }

  // 检查角色权限
  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    if (authStore.user?.role === 'volunteer') {
      return next('/volunteer')
    } else if (authStore.user?.role === 'organization') {
      return next('/organization')
    }
    return next('/')
  }

  next()
})
```

---

## 四、API接口对接说明

### 后端接口地址
- Base URL: `http://localhost:1109`
- 登录接口: `POST /api/login`
- 登出接口: `POST /api/logout`
- 刷新接口: `POST /api/refresh`

### 登录请求格式
```json
{
  "loginType": "username",  // username/email/phone
  "identifier": "testuser", // 用户名/邮箱/手机号
  "password": "password123",
  "identity": "volunteer"   // volunteer/organization
}
```

### 登录响应格式
```json
{
  "success": true,
  "message": "登录成功",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1738368000,
  "userInfo": {
    "userId": "123456",
    "username": "testuser",
    "email": "test@example.com",
    "phone": "13800138000",
    "displayName": "测试用户",
    "avatarUrl": "https://example.com/avatar.jpg",
    "identity": "volunteer",
    "createdAt": 1704067200,
    "updatedAt": 1704067200
  }
}
```

---

## 五、功能特性

### Token管理
- 自动保存access token、refresh token和过期时间到localStorage
- 自动在请求头中携带token
- Token过期自动刷新机制
- 刷新失败自动清除状态并跳转登录

### 登录支持
- 三种登录方式：用户名、邮箱、手机号
- 两种身份选择：志愿者、组织管理者
- 完整的表单验证
- 错误提示信息显示

### 安全机制
- 防止并发刷新token（isRefreshing标志位）
- 401错误统一处理
- 开发环境下不自动恢复登录状态

---

## 六、测试建议

1. **功能测试**
   - 使用用户名登录
   - 使用邮箱登录
   - 使用手机号登录
   - 测试志愿者身份登录
   - 测试组织管理者身份登录
   - 测试登出功能

2. **Token刷新测试**
   - 等待token即将过期（5分钟内），验证自动刷新
   - 手动修改localStorage中的过期时间为过去时间，验证刷新或跳转登录

3. **错误处理测试**
   - 测试错误的用户名密码提示
   - 测试网络错误处理
   - 测试后端服务未启动时的提示

4. **环境配置**
   - 确保后端服务运行在 `http://localhost:1109`
   - 生产环境需修改 `.env.production` 中的API地址