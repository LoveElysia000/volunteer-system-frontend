# 登录流程接口文档

> 本文档提供给前端开发人员使用，描述登录相关的所有API接口。

---

## 服务端配置

| 配置项 | 值 | 说明 |
|-------|---|------|
| Host | `localhost` | 本地开发环境 |
| Port | `1109` | 服务端口 |
| Base URL | `http://localhost:1109` | 基础请求地址 |

> 注意：如果是局域网跨设备联调，请将 `localhost` 替换为服务器的实际 IP 地址（如 `http://192.168.1.100:1109`）

---

## 接口列表

| 接口名称 | HTTP方法 | 完整URL | 是否需要认证 |
|---------|---------|---------|-------------|
| 用户登录 | POST | `http://localhost:1109/api/login` | 否 |
| 用户登出 | POST | `http://localhost:1109/api/logout` | 否 |
| 刷新令牌 | POST | `http://localhost:1109/api/refresh` | 否 |

---

## 1. 用户登录

### 接口信息
- **路径**: `/api/login`
- **方法**: `POST`
- **描述**: 用户通过用户名/邮箱/手机号进行登录

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| loginType | string | 是 | 登录类型：`username`(用户名) / `email`(邮箱) / `phone`(手机号) |
| identifier | string | 是 | 登录标识（根据loginType对应填写用户名/邮箱/手机号） |
| password | string | 是 | 用户密码 |
| identity | string | 是 | 身份类型：`volunteer`(志愿者) / `organization`(组织管理者) |

**请求示例:**
```json
{
  "loginType": "username",
  "identifier": "testuser",
  "password": "password123",
  "identity": "volunteer"
}
```

### 返回参数

| 参数名 | 类型 | 说明 |
|-------|------|------|
| success | boolean | 登录是否成功 |
| message | string | 响应消息 |
| accessToken | string | 访问令牌（用于后续请求认证） |
| refreshToken | string | 刷新令牌（用于获取新的访问令牌） |
| expiresAt | int64 | 令牌过期时间（Unix时间戳，24小时） |
| userInfo | object | 用户信息对象 |

**userInfo 对象结构:**

| 参数名 | 类型 | 说明 |
|-------|------|------|
| userId | string | 用户ID |
| username | string | 用户名 |
| email | string | 邮箱 |
| phone | string | 手机号 |
| displayName | string | 显示名称 |
| avatarUrl | string | 头像URL |
| identity | string | 身份类型 |
| createdAt | int64 | 创建时间 |
| updatedAt | int64 | 更新时间 |

**返回示例:**
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

## 2. 用户登出

### 接口信息
- **路径**: `/api/logout`
- **方法**: `POST`
- **描述**: 用户退出登录，撤销当前令牌

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| token | string | 是 | 要注销的令牌 |

**请求示例:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 返回参数

| 参数名 | 类型 | 说明 |
|-------|------|------|
| success | boolean | 登出是否成功 |
| message | string | 响应消息 |

**返回示例:**
```json
{
  "success": true,
  "message": "登出成功"
}
```

---

## 3. 刷新令牌

### 接口信息
- **路径**: `/api/refresh`
- **方法**: `POST`
- **描述**: 使用刷新令牌获取新的访问令牌

### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

**请求示例:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 返回参数

| 参数名 | 类型 | 说明 |
|-------|------|------|
| success | boolean | 刷新是否成功 |
| message | string | 响应消息 |
| token | string | 新的访问令牌 |
| refreshToken | string | 新的刷新令牌 |
| expiresAt | int64 | 令牌过期时间（Unix时间戳，24小时） |
| userInfo | object | 用户信息对象（结构同登录接口） |

**返回示例:**
```json
{
  "success": true,
  "message": "令牌刷新成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

## 完整登录流程

```
1. 用户登录
   └─> POST /api/login
       └─> 返回 accessToken 和 refreshToken

2. 访问受保护资源
   └─> 在请求头中携带 accessToken
       └─> Authorization: Bearer {accessToken}

3. 令牌即将过期时刷新
   └─> POST /api/refresh
       └─> 返回新的 accessToken 和 refreshToken

4. 用户登出
   └─> POST /api/logout
       └─> 撤销令牌
```

---

## 相关文件

| 文件路径 | 说明 |
|---------|------|
| `internal/router/login.go` | 登录路由定义 |
| `internal/handler/login.go` | 登录处理器 |
| `internal/service/login.go` | 登录业务逻辑 |
| `internal/api/login.proto` | Protobuf接口定义 |
| `pkg/auth/jwt.go` | JWT令牌管理 |
| `internal/middleware/auth.go` | 认证中间件 |

---

注意事项：

1. **服务地址**: 本地开发环境为 `http://localhost:1109`
2. **令牌有效期**:
   - accessToken: 30 分钟
   - refreshToken: 7 天
3. **认证方式**: 访问受保护资源时，需要在请求头中携带 `Authorization: Bearer {accessToken}`
4. **令牌刷新**: 建议在 accessToken 过期前 5 分钟内调用刷新接口
5. **登录类型**: 支持三种登录方式：用户名、邮箱、手机号
6. **身份类型**: 需要明确指定用户身份（志愿者或组织管理者）
