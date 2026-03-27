# 前端联调改造说明

本文档用于指导前端同步本轮后端改造。

请前端按本文逐项修改，避免出现以下问题：

1. 登录态字段读取错误
2. 本人类接口继续误传本人业务 ID
3. 资源接口路径仍使用旧地址
4. 将 `accountId`、`volunteerId`、`organizationId`、`activityId` 混用

## 1. 本轮改造核心结论

本轮后端改造的核心有 4 点：

1. 当前登录主体统一为 `accountId`
2. 本人类接口统一收口到 `/api/me/...`
3. 本人类接口不再由前端传本人业务 ID
4. 登录响应、刷新响应、JWT claims 对前端统一暴露 `accountId`

## 2. 前端必须先统一的 ID 概念

### 2.1 `accountId`

含义：当前登录账号 ID，对应后端 `sys_accounts.id`

使用场景：

1. 登录态
2. 当前用户缓存
3. JWT claims
4. 当前登录人判断

注意：

1. `accountId` 不是 `volunteerId`
2. `accountId` 不是 `organizationId`

### 2.2 `volunteerId`

含义：志愿者业务主键

使用场景：

1. 查看某个志愿者详情
2. 组织侧针对某个志愿者做业务操作
3. 某些补录、详情、管理类页面

注意：

1. “我的档案”“我的资料”“我的组织列表”不再传 `volunteerId`
2. 不允许把 `accountId` 当成 `volunteerId` 传

### 2.3 `organizationId`

含义：组织业务主键

使用场景：

1. 组织详情
2. 更新组织
3. 删除组织
4. 查询组织成员
5. 加入组织
6. 创建活动时指定所属组织

### 2.4 `activityId`

含义：活动业务主键

使用场景：

1. 活动详情
2. 更新活动
3. 删除活动
4. 取消活动
5. 完结活动
6. 签到码/签退码管理

### 2.5 `membershipId`

含义：组织成员关系主键

使用场景：

1. 退出组织
2. 更新成员状态

### 2.6 `signupId`

含义：活动报名记录主键

使用场景：

1. 工时流水
2. 作废工时
3. 重算工时

## 3. 登录态相关改造

### 3.1 登录响应字段变更

旧字段：

```json
userInfo.userId
```

新字段：

```json
userInfo.accountId
```

前端必须修改：

1. 登录成功后写入用户态的代码
2. 当前用户 store 中读取用户 ID 的代码
3. 页面中所有读取 `userInfo.userId` 的代码

### 3.2 刷新令牌响应字段变更

旧字段：

```json
userInfo.userId
```

新字段：

```json
userInfo.accountId
```

前端必须修改：

1. refresh token 成功后更新用户态的代码
2. 刷新后恢复当前用户信息的逻辑

### 3.3 JWT claims 字段变更

新 token 对前端可见字段：

```json
accountId
```

说明：

1. 新签发 token 中，前端应读取 `accountId`
2. 后端当前仍兼容旧 token 的 `sub`
3. 新前端逻辑不要再依赖旧字段

前端必须修改：

如果前端存在以下逻辑：

1. `parseJwt()`
2. `decodeToken()`
3. `getCurrentUserFromToken()`
4. 路由守卫里直接解 JWT
5. 页面初始化时从 token 中读用户信息

统一改为优先读取：

```js
accountId
```

如需兼容历史 token，可临时写成：

```js
const accountId = payload.accountId || payload.sub
```

但新代码不要再以 `userId` 为依据。

## 4. 登录接口数据结构变更

### 4.1 `LoginResponse.userInfo`

旧结构：

```json
{
  "userId": "123",
  "userName": "...",
  "email": "...",
  "phone": "...",
  "displayName": "...",
  "avatarUrl": "...",
  "identity": "...",
  "createdAt": 0,
  "updatedAt": 0
}
```

新结构：

```json
{
  "accountId": "123",
  "userName": "...",
  "email": "...",
  "phone": "...",
  "displayName": "...",
  "avatarUrl": "...",
  "identity": "...",
  "createdAt": 0,
  "updatedAt": 0
}
```

### 4.2 `RefreshTokenResponse.userInfo`

同上，`userId` 改为 `accountId`。

## 5. 接口路径与请求参数改造

### 5.1 我的档案

旧接口：

```http
GET /api/volunteers/my/profile/:id
```

新接口：

```http
GET /api/me/profile
```

前端必须修改：

1. 删除路径中的 `id`
2. 不再传本人 `volunteerId`
3. 不再从 store 或页面状态中拼本人 ID

影响页面：

1. 我的档案页
2. 个人中心页
3. 志愿者个人资料页

### 5.2 我的账户信息更新

旧接口：

```http
PUT /api/volunteers/account
```

新接口：

```http
PUT /api/me/account
```

前端必须修改：

1. 修改请求地址
2. 请求体结构基本不变
3. 不需要附加任何本人业务 ID

影响页面：

1. 账号设置页
2. 账户基础信息编辑页

### 5.3 我的志愿者资料更新

旧接口：

```http
PUT /api/volunteers/:id
```

新接口：

```http
PUT /api/me/volunteer-profile
```

前端必须修改：

1. 删除路径中的 `id`
2. 不再传本人 `volunteerId`
3. 原先如果依赖详情接口拿 `volunteerId` 再拼路径，这段逻辑要删除

影响页面：

1. 我的资料编辑页
2. 志愿者资料编辑页

### 5.4 我的组织列表

旧接口：

```http
GET /api/volunteers/:volunteerId/organizations
```

新接口：

```http
GET /api/me/organizations
```

前端必须修改：

1. 删除路径中的 `volunteerId`
2. 不再传本人 `volunteerId`
3. 筛选、分页参数继续保留

影响页面：

1. 我加入的组织
2. 我的组织列表
3. 志愿者端组织关系页

### 5.5 加入组织

接口地址不变：

```http
POST /api/memberships/join
```

请求体变更如下。

旧请求体：

```json
{
  "volunteerId": 123,
  "organizationId": 456
}
```

新请求体：

```json
{
  "organizationId": 456
}
```

前端必须修改：

1. 删除 `volunteerId`
2. 只传 `organizationId`

影响页面：

1. 组织详情页中的加入组织
2. 组织列表页中的加入组织

### 5.6 志愿者详情

旧接口：

```http
GET /api/volunteers/detail/:id
```

新接口：

```http
GET /api/volunteers/:volunteerId
```

前端必须修改：

1. 路径改为新格式
2. 传入的必须是 `volunteerId`
3. 不要把 `accountId` 传到这里

影响页面：

1. 管理端志愿者详情
2. 志愿者列表跳详情页

### 5.7 组织相关路径统一

旧路径风格：

```http
/api/organizations/:id
/api/organizations/:id/disable
/api/organizations/:id/enable
```

新路径风格：

```http
/api/organizations/:organizationId
/api/organizations/:organizationId/disable
/api/organizations/:organizationId/enable
```

前端必须修改：

1. API 封装参数名统一改为 `organizationId`
2. 所有组织详情、编辑、删除、启停页面都要同步改

影响接口：

```http
GET    /api/organizations/:organizationId
PUT    /api/organizations/:organizationId
DELETE /api/organizations/:organizationId
POST   /api/organizations/:organizationId/disable
POST   /api/organizations/:organizationId/enable
```

### 5.8 活动相关路径统一

旧路径风格：

```http
/api/activities/:id
/api/activities/cancel/:id
/api/activities/finish/:id
/api/activities/attendance-codes/generate/:id
/api/activities/attendance-codes/reset/:id
/api/activities/attendance-codes/:id
```

新路径风格：

```http
/api/activities/:activityId
/api/activities/:activityId/cancel
/api/activities/:activityId/finish
/api/activities/:activityId/attendance-codes/generate
/api/activities/:activityId/attendance-codes/reset
/api/activities/:activityId/attendance-codes
```

前端必须修改：

1. API 封装参数名统一改为 `activityId`
2. 所有活动详情、编辑、删除、取消、完结、签到码页面同步改

影响接口：

```http
GET    /api/activities/:activityId
PUT    /api/activities/:activityId
DELETE /api/activities/:activityId
POST   /api/activities/:activityId/cancel
POST   /api/activities/:activityId/finish
POST   /api/activities/:activityId/attendance-codes/generate
POST   /api/activities/:activityId/attendance-codes/reset
GET    /api/activities/:activityId/attendance-codes
```

## 6. 前端必须改的代码位置

### 6.1 用户态 Store

请检查：

1. 登录成功后写入用户态的地方
2. 刷新 token 成功后写入用户态的地方
3. 页面初始化恢复当前用户的地方
4. 所有 `currentUser.id`、`userInfo.userId`、`auth.userId` 类逻辑

统一改为：

```js
userInfo.accountId
```

### 6.2 JWT 解码工具

请检查：

1. `parseJwt`
2. `decodeToken`
3. `getCurrentUserFromToken`
4. 权限守卫
5. 登录恢复逻辑

统一改为读取：

```js
accountId
```

如需兼容历史 token，可临时写为：

```js
const accountId = payload.accountId || payload.sub
```

### 6.3 “我的”页面 API 封装

请检查：

1. 我的档案
2. 我的账户
3. 我的志愿者资料
4. 我的组织列表

必须删除的逻辑：

1. 从 store 中拿 `volunteerId`
2. 把本人 `volunteerId` 拼到路径中
3. 请求体中传本人 `volunteerId`

### 6.4 加入组织请求 DTO

必须删除：

```json
volunteerId
```

保留：

```json
organizationId
```

### 6.5 组织与活动 API 封装函数命名

建议前端统一把函数参数名改成明确资源名，避免误传。

推荐写法：

```ts
getOrganizationDetail(organizationId)
updateOrganization(organizationId, data)
deleteOrganization(organizationId)

getActivityDetail(activityId)
updateActivity(activityId, data)
cancelActivity(activityId)
finishActivity(activityId)
getAttendanceCodes(activityId)
```

不建议继续保留：

```ts
getOrganizationDetail(id)
getActivityDetail(id)
```

因为会加剧 ID 混用。

## 7. 旧调用与新调用对照表

| 场景 | 旧调用 | 新调用 | 前端要改什么 |
|---|---|---|---|
| 登录响应用户信息 | `userInfo.userId` | `userInfo.accountId` | 改 store 和页面读取字段 |
| 刷新响应用户信息 | `userInfo.userId` | `userInfo.accountId` | 改 refresh 后用户态恢复 |
| JWT claims | 旧逻辑读 `userId` | 新逻辑读 `accountId` | 改 token decode 工具 |
| 我的档案 | `GET /api/volunteers/my/profile/:id` | `GET /api/me/profile` | 删除本人 `id` |
| 我的账户更新 | `PUT /api/volunteers/account` | `PUT /api/me/account` | 改路径 |
| 我的志愿者资料更新 | `PUT /api/volunteers/:id` | `PUT /api/me/volunteer-profile` | 删除本人 `volunteerId` |
| 我的组织列表 | `GET /api/volunteers/:volunteerId/organizations` | `GET /api/me/organizations` | 删除本人 `volunteerId` |
| 加入组织 | `{ volunteerId, organizationId }` | `{ organizationId }` | 删除 `volunteerId` |
| 志愿者详情 | `/api/volunteers/detail/:id` | `/api/volunteers/:volunteerId` | 路径调整，必须传 `volunteerId` |
| 组织详情/编辑/删除 | `/api/organizations/:id` | `/api/organizations/:organizationId` | 统一按 `organizationId` 拼接 |
| 活动详情 | `/api/activities/:id` | `/api/activities/:activityId` | 统一按 `activityId` 拼接 |
| 取消活动 | `/api/activities/cancel/:id` | `/api/activities/:activityId/cancel` | 路径顺序变更 |
| 完结活动 | `/api/activities/finish/:id` | `/api/activities/:activityId/finish` | 路径顺序变更 |
| 生成签到码 | `/api/activities/attendance-codes/generate/:id` | `/api/activities/:activityId/attendance-codes/generate` | 路径顺序变更 |
| 重置签到码 | `/api/activities/attendance-codes/reset/:id` | `/api/activities/:activityId/attendance-codes/reset` | 路径顺序变更 |
| 查询签到码 | `/api/activities/attendance-codes/:id` | `/api/activities/:activityId/attendance-codes` | 路径顺序变更 |

## 8. 前端推荐改造顺序

### 第一步：先改登录态

必须先完成：

1. `userInfo.userId -> userInfo.accountId`
2. JWT 解码读取 `accountId`

这是最优先改造项，不改这里，后续页面判断主体时会继续混乱。

### 第二步：改 `/api/me/...` 接口

必须同步替换：

1. `/api/me/profile`
2. `/api/me/account`
3. `/api/me/volunteer-profile`
4. `/api/me/organizations`

并删除本人业务 ID 传参。

### 第三步：改加入组织请求体

删除：

```json
volunteerId
```

### 第四步：改组织与活动路径

统一资源路径参数：

1. `organizationId`
2. `activityId`
3. `volunteerId`

### 第五步：做页面级回归

重点回归以下页面：

1. 登录页
2. token 刷新链路
3. 个人中心
4. 我的档案
5. 我的资料编辑
6. 我的组织列表
7. 组织详情
8. 组织管理
9. 活动详情
10. 活动管理
11. 加入组织
12. 签到码管理

## 9. 联调时重点检查项

请前端联调时逐项确认：

1. 登录成功后，是否能正确拿到 `userInfo.accountId`
2. 刷新 token 后，是否还能恢复用户态
3. 如果前端解 JWT，是否已改为读取 `accountId`
4. “我的档案”是否不再拼接本人 `id`
5. “我的资料更新”是否不再拼接本人 `volunteerId`
6. “我的组织列表”是否不再传本人 `volunteerId`
7. “加入组织”是否只传 `organizationId`
8. 组织详情、编辑、删除、启停是否都已改成 `organizationId`
9. 活动详情、取消、完结、签到码管理是否都已改成 `activityId`
10. 代码中是否还残留 `userInfo.userId`
11. 代码中是否把 `accountId` 误传给需要 `volunteerId` 的接口

## 10. 特别说明

### 10.1 旧 token 兼容

后端当前仍兼容旧 token 的 `sub` 解析。
因此已经登录的历史 token 不会因为这轮立即全部失效。

但新前端不要继续围绕旧字段写逻辑。

### 10.2 不要再让前端决定“我是谁”

以后前端只负责：

1. 传目标资源 ID
2. 传普通业务字段

不要再传这些字段来决定身份：

1. 本人 `volunteerId`
2. 当前 `accountId`
3. `role`
4. `permission`
5. `createdBy`
6. `updatedBy`

这些都应以后端上下文为准。

## 11. 本轮前端最重要的结论

请前端统一记住两句话：

1. 当前登录主体统一叫 `accountId`
2. “我的”接口一律不再传本人业务 ID

如果前端仍按旧方式调用，最常见的结果不是越权，而是：

1. 404
2. 参数绑定失败
3. 无权限
4. 查不到数据
5. 页面拿不到当前用户 ID

## 12. 建议前端自查关键词

建议全局搜索并逐项修改：

```txt
userInfo.userId
userId
volunteers/my/profile
volunteers/account
volunteers/:id
volunteers/:volunteerId/organizations
volunteerId
activities/cancel/
activities/finish/
attendance-codes/generate/
attendance-codes/reset/
attendance-codes/
organizations/:id
activities/:id
```
