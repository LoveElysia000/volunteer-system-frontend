# 注册接口文档

## 接口信息

| 项目 | 说明 |
|------|------|
| 接口名称 | 统一注册接口 |
| 请求方法 | POST |
| 接口路径 | `/api/register` |
| 是否需要认证 | 否 |

---

## 请求参数

### 请求头

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| Content-Type | string | 是 | 固定值：`application/json` |

### 请求体 (JSON)

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| registerType | string | 是 | 注册身份类型：`volunteer`-志愿者，`organization`-组织 |
| name | string | 是 | 名称 |
| phone | string | 是 | 手机号 |
| email | string | 是 | 邮箱 |
| password | string | 是 | 密码 |
| age | int32 | 是 | 年龄（志愿者注册时必填） |
| gender | string | 是 | 性别（志愿者注册时必填） |
| organizationName | string | 是 | 组织名称（组织注册时必填） |

---

## 请求示例

### 志愿者注册

```json
{
  "registerType": "volunteer",
  "name": "张三",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "password": "123456",
  "age": 25,
  "gender": "男"
}
```

### 组织注册

```json
{
  "registerType": "organization",
  "name": "李四",
  "phone": "13900139000",
  "email": "lisi@example.com",
  "password": "123456",
  "organizationName": "爱心志愿者协会"
}
```

---

## 响应参数

### 通用响应结构

| 参数名 | 类型 | 说明 |
|--------|------|------|
| code | int | 状态码 |
| msg | string | 响应消息 |
| data | object | 响应数据 |

### 成功响应

```json
{
  "code": 200,
  "msg": "OK",
  "data": {}
}
```

### 失败响应

```json
{
  "code": 1001,
  "msg": "invalid parameters: 参数验证失败详情",
  "data": {}
}
```

---

## 错误码

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

## cURL 示例

### 志愿者注册

```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "registerType": "volunteer",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "password": "123456",
    "age": 25,
    "gender": "男"
  }'
```

### 组织注册

```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "registerType": "organization",
    "name": "李四",
    "phone": "13900139000",
    "email": "lisi@example.com",
    "password": "123456",
    "organizationName": "爱心志愿者协会"
  }'
```

---

## 相关文件

| 文件路径 | 说明 |
|---------|------|
| `internal/router/register.go` | 路由定义 |
| `internal/handler/register.go` | 处理函数 |
| `internal/service/register.go` | 业务逻辑 |
| `internal/api/register.proto` | Proto接口定义 |
| `internal/response/response.go` | 响应结构 |
| `internal/response/errors.go` | 错误码定义 |
