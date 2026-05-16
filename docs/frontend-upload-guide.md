# 前端图片上传接入指南

## 接口

### 上传图片

```
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `file` | File | 是 | jpg/jpeg/png/gif，最大 10MB |
| `type` | String | 是 | `avatar` / `activity` / `org` |

**响应：**
```json
{
  "code": 200,
  "msg": "success",
  "data": { "url": "/uploads/avatar/550e8400-e29b-41d4-a716-446655440000.jpg" }
}
```

### 拿到 URL 后如何使用

| 场景 | 调用的 API | 字段 |
|------|-----------|------|
| 更新头像 | `PUT /api/me/volunteer/profile` | `avatar_url` |
| 创建活动 | `POST /api/activities` | `cover_url` |
| 更新活动封面 | `PUT /api/activities/{id}` | `cover_url` |
| 创建组织 | `POST /api/organizations` | `logo_url` |
| 更新组织Logo | `PUT /api/organizations/{id}` | `logo_url` |

---

## 本地开发配置（Vite）

`vite.config.ts` 加一行 proxy：

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://localhost:1109' },
      '/uploads': { target: 'http://localhost:1109' }   // 加这一行
    }
  }
})
```

**原因：** 上传返回的 URL 是相对路径 `/uploads/avatar/xxx.jpg`，前端 3000 端口需要把 `/uploads/` 代理到后端 1109 端口才能显示图片。

---

## 代码示例

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

## 展示图片

上传返回的 URL 是**相对路径**，直接当 `src` 用：

```html
<img src="/uploads/avatar/uuid.jpg" />
<!-- ✅ 本地开发：通过 Vite proxy 转发到后端 -->
<!-- ✅ 生产环境：同一域名下直接访问，不需要额外配置 -->
```

---

## 生产环境注意事项

- 部署到服务器后前端**不需要任何改动**，图片 URL 走同一域名
- 代码推 `main` 后 GitHub Actions 自动构建部署，后端已有 `/uploads/` 静态文件服务
- **前端只管用 URL 展示，不需要关心文件存在服务器的哪个目录**
