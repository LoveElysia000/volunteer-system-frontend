# 注册和登录API联调更新文档

## 更新时间
2026-01-31

## 概述
本次更新完成了后端接口的联调工作，包括注册接口和登录功能，修复了前端类型定义和数据格式不匹配的问题。

---

## 修改内容

### 1. 注册接口联调

#### 1.1 类型定义 (src/types/auth.ts)

新增注册相关的类型定义：

```typescript
// 注册请求参数
export interface RegisterRequest {
  registerType: UserIdentity    // 'volunteer' | 'organization'
  name: string                   // 真实姓名
  phone: string                  // 手机号
  email: string                  // 邮箱
  password: string               // 密码
  age?: number                   // 年龄（志愿者必填）
  gender?: string                // 性别（志愿者必填）
  organizationName?: string      // 组织名称（组织必填）
}

// 注册响应
export interface RegisterResponse {
  code: number
  msg: string
  data: Record<string, any>
}
```

#### 1.2 API方法 (src/api/auth.ts)

新增注册API方法：

```typescript
// 用户注册
register: (data: RegisterRequest): Promise<RegisterResponse> => {
  return http.post<RegisterResponse>('/api/register', data, { skipAuth: true })
}
```

#### 1.3 Store方法 (src/store/modules/auth.ts)

新增注册action：

```typescript
// 用户注册
const register = async (data: RegisterRequest) => {
  const response = await authApi.register(data)
  return response
}
```

#### 1.4 注册页面 (src/views/Auth/Register.vue)

修改 `handleRegister` 函数，连接真实API：

- 导入 `useAuthStore`
- 构建符合后端API要求的请求参数
- 处理性别字段转换（前端英文 `male/female/other` -> 后端中文 `男/女/其他`）
- 添加完善的错误处理

```typescript
const handleRegister = async () => {
  // 表单验证...

  try {
    const registerData: any = {
      registerType: form.value.role === 'volunteer' ? 'volunteer' : 'organization',
      name: form.value.realName,
      phone: form.value.phone,
      email: form.value.email,
      password: form.value.password
    }

    // 志愿者注册需要年龄和性别
    if (form.value.role === 'volunteer') {
      registerData.age = parseInt(form.value.age)
      const genderMap: Record<string, string> = {
        'male': '男',
        'female': '女',
        'other': '其他'
      }
      registerData.gender = genderMap[form.value.gender] || form.value.gender
    }

    // 组织注册需要组织名称
    if (form.value.role === 'organization') {
      registerData.organizationName = form.value.organization
    }

    const response = await authStore.register(registerData)

    if (response.code === 200) {
      router.push('/login')
    } else {
      alert(`注册失败: ${response.msg}`)
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.msg || error.message || '注册失败，请稍后重试'
    alert(`注册失败: ${errorMsg}`)
  }
}
```

---

### 2. 登录接口类型修复

#### 2.1 响应类型定义 (src/types/auth.ts)

修改登录和刷新令牌的响应类型，统一使用后端返回的 `{code, msg, data}` 格式：

```typescript
// 登录响应
export interface LoginResponse {
  code: number
  msg: string
  data: {
    accessToken: string
    refreshToken: string
    expiresAt: number
    userInfo: UserInfo
  }
}

// 刷新令牌响应
export interface RefreshTokenResponse {
  code: number
  msg: string
  data: {
    token: string
    refreshToken: string
    expiresAt: number
    userInfo: UserInfo
  }
}
```

#### 2.2 Store更新 (src/store/modules/auth.ts)

更新 `login` 和 `refreshToken` 方法，适配新的响应结构：

```typescript
// 登录
const login = async (credentials: {
  loginType: LoginType
  identifier: string
  password: string
  identity: UserIdentity
}) => {
  const response = await authApi.login(loginRequest)

  // 检查响应是否成功
  if (response.code !== 200) {
    throw new Error(response.msg || '登录失败')
  }

  // 从 data 中提取登录数据
  const loginData = response.data

  // 保存token
  tokenManager.setTokens(
    loginData.accessToken,
    loginData.refreshToken,
    loginData.expiresAt
  )

  // 转换并保存用户信息
  const transformedUser = transformUserInfo(loginData.userInfo)
  user.value = transformedUser
  token.value = loginData.accessToken

  return response
}

// 刷新token
const refreshToken = async () => {
  const response = await authApi.refreshToken({ refreshToken: refreshTokenValue })

  // 检查响应是否成功
  if (response.code !== 200) {
    throw new Error(response.msg || '刷新token失败')
  }

  // 更新token
  tokenManager.setTokens(
    response.data.token,
    response.data.refreshToken,
    response.data.expiresAt
  )

  return response
}
```

#### 2.3 登录页面 (src/views/Auth/Login.vue)

修复登录请求中的类型问题：

- 导入 `LoginType` 和 `UserIdentity` 枚举
- 修复 `loginState.mode` 到 `LoginType` 的转换

```typescript
await authStore.login({
  loginType: loginState.mode === LoginMode.EMAIL ? LoginType.EMAIL : LoginType.PHONE,
  identifier: loginState.mode === LoginMode.EMAIL ? loginState.form.email : loginState.form.phone,
  password: loginState.form.password,
  identity: loginState.role
})
```

---

### 3. 错误处理修复

#### 3.1 响应拦截器 (src/api/index.ts)

修复错误处理，支持后端返回的 `msg` 字段：

```typescript
// 处理其他错误
const apiError: ApiError = {
  code: error.response?.status || 0,
  message: (error.response?.data as any)?.msg || (error.response?.data as any)?.message || (error.message ? String(error.message) : '请求失败'),
  details: error.response?.data
}
```

#### 3.2 修复 undefined.toString() 问题

当 `error.message` 为 undefined 时，使用 `String()` 替代直接调用 `.toString()`：

```typescript
// 修复前
message: (error.response?.data as any)?.message || error.message?.toString() || '请求失败'

// 修复后
message: (error.response?.data as any)?.msg || (error.response?.data as any)?.message || (error.message ? String(error.message) : '请求失败')
```

---

## 接口映射表

### 注册接口

| 前端字段 | 后端字段 | 说明 |
|---------|---------|------|
| `role` | `registerType` | 注册身份类型：`volunteer` / `organization` |
| `realName` | `name` | 真实姓名 |
| `phone` | `phone` | 手机号 |
| `email` | `email` | 邮箱 |
| `password` | `password` | 密码 |
| `age` | `age` | 年龄（志愿者必填，数字类型） |
| `gender` | `gender` | 性别（志愿者必填，中文：男/女/其他） |
| `organization` | `organizationName` | 组织名称（组织必填） |

### 登录接口

| 前端字段 | 后端字段 | 说明 |
|---------|---------|------|
| `loginType` | `loginType` | 登录类型：`email` / `phone` |
| `identifier` | `identifier` | 邮箱或手机号 |
| `password` | `password` | 密码 |
| `identity` | `identity` | 身份类型：`volunteer` / `organization` |

### 统一响应格式

```typescript
{
  code: number,        // 状态码：200-成功，其他-失败
  msg: string,         // 响应消息
  data: any           // 响应数据
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 参数无效 |
| 1002 | 用户不存在 |
| 1003 | 用户已存在 |
| 1004 | 密码错误 |
| 1005 | Token过期 |
| 1006 | Token无效 |
| 1007 | 权限不足 |
| 1008 | 资源不存在 |
| 1009 | 操作失败 |
| 1010 | 请求频率超限 |

---

## 测试要点

### 注册功能测试

1. ✅ 志愿者注册 - 填写完整信息（包含年龄、性别）
2. ✅ 组织注册 - 填写完整信息（包含组织名称）
3. ✅ 表单验证 - 各字段的必填和格式验证
4. ✅ 错误处理 - 网络错误、服务器错误的提示
5. ✅ 注册成功 - 自动跳转到登录页

### 登录功能测试

1. ✅ 邮箱登录 - 志愿者/组织身份
2. ✅ 手机号登录 - 志愿者/组织身份
3. ✅ 错误提示 - 用户不存在、密码错误等
4. ✅ 登录成功 - token保存、用户信息更新
5. ✅ 路由跳转 - 根据角色跳转到不同页面

---

## 相关文件清单

| 文件路径 | 修改内容 |
|---------|---------|
| `src/types/auth.ts` | 新增注册类型定义，修改登录/刷新Token响应类型 |
| `src/api/auth.ts` | 新增register方法 |
| `src/store/modules/auth.ts` | 新增register action，修改login和refreshToken方法 |
| `src/views/Auth/Register.vue` | 修改handleRegister函数，连接真实API |
| `src/views/Auth/Login.vue` | 修复类型导入和类型转换 |
| `src/api/index.ts` | 修复错误处理，支持msg字段 |

---

## 注意事项

1. **性别字段转换**：前端使用英文枚举值（`male`/`female`/`other`），发送到后端时需要转换为中文（`男`/`女`/`其他`）

2. **响应格式统一**：所有API响应都遵循 `{code, msg, data}` 格式

3. **错误处理**：后端返回错误时，响应状态码可能是4xx或5xx，需要通过 `response.code` 或 `error.response?.data.msg` 获取错误信息

4. **Token管理**：登录成功后会自动保存 access token 和 refresh token，并处理token刷新逻辑