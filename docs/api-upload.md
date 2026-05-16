# 图片上传接口文档

## 上传图片

上传图片文件，返回可访问的 URL。支持头像、活动封面、组织 Logo。

### 请求

```
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `file` | File | 是 | 图片文件，支持 jpg/jpeg/png/gif |
| `type` | String | 是 | `avatar` — 头像<br>`activity` — 活动封面<br>`org` — 组织 Logo |

### 响应

**成功：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "url": "/uploads/avatar/550e8400-e29b-41d4-a716-446655440000.jpg"
  }
}
```

**失败：**
```json
{
  "code": 400,
  "msg": "不支持的文件格式",
  "data": {}
}
```

### 错误码

| HTTP 状态码 | msg | 说明 |
|-------------|-----|------|
| 400 | 无效的上传类型 | type 不是 avatar/activity/org |
| 400 | 文件大小超出限制 | 默认最大 10MB |
| 400 | 不支持的文件格式 | 只允许 jpg/jpeg/png/gif |
| 401 | 未提供认证令牌 | 缺少 Authorization 头 |

---

## 上传后如何使用

拿到 `url` 后，传给对应的业务接口存入数据库：

| 场景 | API | 字段 |
|------|-----|------|
| 更新头像 | `PUT /api/me/volunteer/profile` | `avatar_url` |
| 创建活动 | `POST /api/activities` | `cover_url` |
| 更新活动封面 | `PUT /api/activities/{id}` | `cover_url` |
| 创建组织 | `POST /api/organizations` | `logo_url` |
| 更新组织Logo | `PUT /api/organizations/{id}` | `logo_url` |

---

## 前端示例

```javascript
async function uploadImage(file, type) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + getToken() },
    body: formData
  })
  const result = await res.json()
  if (result.code !== 200) throw new Error(result.msg)
  return result.data.url
}

// 上传头像
const url = await uploadImage(fileInput.files[0], 'avatar')
await fetch('/api/me/volunteer/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
  body: JSON.stringify({ avatar_url: url })
})
```

---

## 注意事项

1. 上传后返回的 URL 是相对路径，前端拼接域名即可访问：`https://greenactionhub.tech/uploads/avatar/uuid.jpg`
2. 返回的 URL 可直接存入数据库，已有业务接口的 `avatar_url`、`cover_url`、`logo_url` 字段均为字符串类型，无需额外处理
3. 图片文件大小不能超过 10MB
4. 上传接口需要 JWT 认证，请求头需携带 `Authorization: Bearer {token}`
