# 前端联调接口文档

> 适用对象：前端开发、联调测试
>
> 数据来源：`internal/api/*.proto`、`internal/router/*.go`、`internal/handler/*.go`
>
> 说明：
> 1. 本文件用于前端联调，重点关注“接口做什么、怎么传、会返回什么”
> 2. 文中“给谁用”偏后端真实权限口径
> 3. 如果是直接转发给前端同学快速浏览，优先看 `docs/frontend-api-one-page.md`

## 1. 通用约定

建议阅读顺序：

1. 先看本章的通用规则、状态枚举、错误说明、必填字段速查
2. 再看对应模块的接口清单
3. 最后直接用文末“核心联调示例”发请求验证

### 1.1 基础信息

- 接口前缀：`/api`
- 文档原始定义：`docs/openapi.yaml`
- 除 `登录 / 注册 / 刷新令牌 / 登出` 外，其余接口默认都需要登录态

### 1.2 认证方式

请求头统一携带：

```http
Authorization: Bearer <accessToken>
```

### 1.3 响应格式

绝大多数 JSON 接口统一返回：

```json
{
  "code": 200,
  "msg": "OK",
  "data": {}
}
```

联调时注意：

- `code = 200` 表示成功
- 非 `200` 表示业务失败或鉴权失败
- 前端主要关注 `data`
- 导出接口是文件流下载，不走上面的 JSON 包装

### 1.4 时间字段

- 大多数时间字段是字符串，常见格式为 `YYYY-MM-DD HH:mm:ss`
- 登录/刷新接口里的 `expiresAt` 是 Unix 时间戳

### 1.5 身份说明

- `游客`：未登录用户
- `已登录用户`：只要登录即可调用
- `当前志愿者本人`：仅当前登录志愿者可操作自己的数据
- `有组织管理权限的账号`：拥有组织维度或全局 `organization.manage` 权限
- `有成员管理权限的账号`：拥有组织维度或全局 `membership.manage` 权限
- `有审核权限的账号`：拥有组织维度或全局 `audit.review` 权限
- `有统计查看权限的账号`：拥有组织维度或全局 `analytics.org_read` 权限
- `有导出权限的账号`：拥有组织维度或全局 `export.manage` 权限
- `有 RBAC 全局管理权限的账号`：拥有全局 `rbac.manage` 权限

### 1.6 常用枚举

前端联调时最常用的枚举如下：

| 字段 | 枚举值 |
| --- | --- |
| `organization.status` | `0=停用`，`1=正常` |
| `volunteer.status` | `1=活跃`，`2=非活跃`，`3=其他` |
| `volunteer.auditStatus` | `0=未认证`，`1=审核中`，`2=已通过`，`3=已驳回` |
| `member.status` | `1=待审核`，`2=正式成员`，`3=已拒绝`，`4=已退出` |
| `member.role` | `1=普通成员`，`2=管理员`，`3=负责人` |
| `activity.status` | `1=报名中`，`2=已结束`，`3=已取消` |
| `signup.status` | `1=待审核`，`2=报名成功`，`3=报名驳回`，`4=已取消` |
| `checkInStatus` | `0=未签到`，`1=已签到` |
| `checkOutStatus` | `0=未签退`，`1=已签退` |
| `workHourStatus` | `0=未结算`，`1=已发放`，`2=已作废` |
| `workHour.operationType` | `1=发放`，`2=作废`，`3=重发/重算` |
| `notification.readStatus` | `0=未读`，`1=已读` |
| `audit.targetType` | `1=志愿者实名审核`，`2=组织审核`，`3=加入组织审核`，`4=活动报名审核` |
| `audit.status` | `1=待审核`，`2=审核通过`，`3=审核拒绝` |
| `audit.auditResult` | `1=通过`，`2=驳回` |
| `attendance codeType` | `1=签到码`，`2=签退码` |

使用建议：

- 前端建议把这些枚举统一收口到一个 `constants` / `enum map` 文件里
- 文案展示以这份文档为准，后续如果后端扩枚举，需要同步更新前端映射

### 1.7 常见错误

接口虽然统一返回 HTTP 200，但业务失败时最外层 `code` 不等于 `200`。联调时最常见的失败类型：

| 场景 | 常见提示 |
| --- | --- |
| 未登录 / token 失效 | `未提供认证令牌`、`认证令牌格式错误`、`认证令牌已过期，请刷新` |
| 权限不足 | `无权操作该组织`、`无权执行该操作`、`无权查看工时流水`、`无权限执行审核` |
| 参数错误 | `请求不能为空`、`组织ID不能为空`、`活动ID不能为空`、`状态值不合法` |
| 时间格式错误 | `开始时间格式错误`、`结束时间格式错误`、`签到时间格式错误`、`签退时间格式错误` |
| 业务状态不允许 | `活动不存在`、`组织不存在`、`成员关系不存在`、`已取消活动不允许签到`、`结束时间不能早于开始时间` |

联调建议：

- 所有请求统一拦截最外层 `code`
- 如果 `code !== 200`，优先展示 `msg`
- 对鉴权失败建议统一跳登录 / 触发刷新 token 逻辑

### 1.8 字段规则

为了减少来回确认，字段口径统一如下：

- 表格或说明里明确写了 `必填` 的字段，前端联调时必须传
- 没写 `必填` 的字段，默认按 `可选` 处理
- 路径参数如 `:id`、`:roleId`、`:bindingId` 一律视为必填
- 查询列表接口如果带 `page`、`pageSize`，联调时建议始终传
- 时间字段如果文档里给了格式示例，联调时按示例格式传
- 导入接口不走 JSON，必须使用 `multipart/form-data`
- 导出接口返回文件流，前端不要按普通 JSON 解析

### 1.9 高频接口必填速查

前端最常先联调下面这些接口，这里给一份“最小必填字段”速查表：

| 接口 | 最小必填字段 |
| --- | --- |
| `POST /api/login` | `loginType, identifier, password, identity` |
| `POST /api/refresh` | `refreshToken` |
| `POST /api/volunteers/list` | `page, pageSize` |
| `POST /api/organizations/list` | `page, pageSize` |
| `POST /api/activities` | `page, pageSize` |
| `GET /api/activities/:id` | 路径参数 `id` |
| `POST /api/activities/signup` | `activityId` |
| `POST /api/activities/cancel` | `activityId` |
| `POST /api/activities/checkin` | `activityId, checkInCode` |
| `POST /api/activities/checkout` | `activityId, checkOutCode` |
| `POST /api/activities/create` | `orgId, title, startTime, endTime, location, duration, maxPeople` |
| `PUT /api/activities/:id` | 路径参数 `id` |
| `POST /api/audits/approval` | `id` |
| `POST /api/audits/rejection` | `id` |
| `POST /api/audits/batch-decision` | `ids, action` |
| `POST /api/memberships/join` | `organizationId` |
| `POST /api/memberships/leave` | `membershipId` |
| `POST /api/memberships/status/update` | `membershipId, status` |
| `POST /api/work-hours/void` | `signupId, reason, idempotencyKey` |
| `POST /api/work-hours/recalculate` | `signupId, reason, idempotencyKey` |
| `POST /api/notifications/read` | `ids` |
| `POST /api/admin/import/volunteers` | `form-data(file)` |
| `POST /api/admin/import/activities` | `form-data(file)` |
| `POST /api/admin/export/ops-report` | `periodType, orgId` |
| `POST /api/assistant/sessions` | `scene` |
| `POST /api/assistant/chat` | `session_id, message` |
| `POST /api/assistant/actions/activity-draft` | `topic` |

## 2. 接口总览

这一节用于先判断某个页面应该看哪一组接口。

| 模块 | 主要给谁用 |
| --- | --- |
| 注册登录 | 游客 |
| 志愿者信息 | 当前志愿者本人、有组织管理权限的账号 |
| 组织管理 | 已登录用户、有组织管理权限的账号 |
| 成员关系 | 当前志愿者本人、有成员管理权限的账号 |
| 活动管理 | 已登录用户、当前志愿者本人、有组织管理权限的账号 |
| 审核中心 | 有审核权限的账号 |
| 工时流水 | 当前志愿者本人、有组织管理权限的账号 |
| 通知中心 | 已登录用户 |
| 看板统计 | 有统计查看权限的账号 |
| RBAC 权限 | 有 RBAC 全局管理权限的账号 |
| 导入导出 | 有组织管理权限/导出权限的账号 |
| AI 助手 | 已登录用户 |

---

## 3. 注册登录

### 3.1 志愿者注册

- 接口：`POST /api/volunteer/register`
- 给谁用：`游客`
- 请求体：

```json
{
  "name": "张三",
  "phone": "13800000000",
  "email": "a@test.com",
  "password": "123456",
  "age": 20,
  "gender": "male",
  "username": "zhangsan"
}
```

- 返回 `data`：`{}`

### 3.2 组织管理员注册

- 接口：`POST /api/organization/register`
- 给谁用：`游客`
- 请求体：

```json
{
  "name": "李四",
  "phone": "13800000001",
  "email": "org@test.com",
  "password": "123456",
  "organizationName": "环保协会",
  "code": "9133XXXXXXXXXXXXXX"
}
```

- 返回 `data`：`{}`

### 3.3 登录

- 接口：`POST /api/login`
- 给谁用：`游客`
- 请求体：

```json
{
  "loginType": "username",
  "identifier": "zhangsan",
  "password": "123456",
  "identity": "volunteer"
}
```

- 返回 `data`：

```json
{
  "success": true,
  "message": "登录成功",
  "accessToken": "xxx",
  "refreshToken": "xxx",
  "expiresAt": 1710000000,
  "userInfo": {
    "userId": "1",
    "username": "zhangsan",
    "email": "a@test.com",
    "phone": "13800000000",
    "displayName": "张三",
    "avatarUrl": "",
    "identity": "volunteer",
    "createdAt": 1710000000,
    "updatedAt": 1710000000
  }
}
```

### 3.4 登出

- 接口：`POST /api/logout`
- 给谁用：`游客/已登录用户`
- 请求体：

```json
{
  "token": "当前 accessToken"
}
```

- 返回 `data`：

```json
{
  "success": true,
  "message": "登出成功"
}
```

### 3.5 刷新令牌

- 接口：`POST /api/refresh`
- 给谁用：`游客/已登录用户`
- 请求体：

```json
{
  "refreshToken": "xxx"
}
```

- 返回 `data`：

```json
{
  "success": true,
  "message": "刷新成功",
  "token": "newAccessToken",
  "refreshToken": "newRefreshToken",
  "expiresAt": 1710000000,
  "userInfo": {}
}
```

---

## 4. 志愿者信息

### 4.1 接口清单

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `POST /api/volunteers/list` | 有组织管理权限的账号 | `{ keyword, page, pageSize }` | `{ total, list: VolunteerListItem[] }` |
| `GET /api/volunteers/detail/:id` | 当前志愿者本人，或有组织管理权限且能覆盖该志愿者的账号 | 路径参数 `id` | `{ volunteer: VolunteerInfo }` |
| `GET /api/volunteers/my/profile/:id` | 当前志愿者本人 | 路径参数 `id` | `{ volunteer: VolunteerInfo }` |
| `GET /api/volunteers/home/summary` | 当前志愿者本人 | 无 | `{ nickname, level, stats, monthlyGrowth, needHoursToNextLevel }` |
| `PUT /api/volunteers/:id` | 当前志愿者本人，或有组织管理权限且能覆盖该志愿者的账号 | 路径参数 `id` + `{ realName, gender, birthday, avatarUrl, introduction }` | `{}` |
| `POST /api/volunteers/real-name/submit` | 当前志愿者本人 | `{ realName, idCard }` | `{ auditId, status }` |

### 4.2 关键返回结构

`VolunteerListItem`

```json
{
  "id": 1,
  "accountId": 1,
  "realName": "张三",
  "gender": 1,
  "avatarUrl": "",
  "totalHours": 12.5,
  "serviceCount": 6,
  "creditScore": 100,
  "auditStatus": 2,
  "createdAt": "2026-03-20 10:00:00",
  "updatedAt": "2026-03-20 10:00:00",
  "status": 1
}
```

`VolunteerInfo`

```json
{
  "id": 1,
  "accountId": 1,
  "realName": "张三",
  "gender": 1,
  "birthday": "2000-01-01",
  "idCard": "310xxxxxxxxxxxxxxx",
  "avatarUrl": "",
  "introduction": "个人简介",
  "totalHours": 12.5,
  "serviceCount": 6,
  "creditScore": 100,
  "auditStatus": 2,
  "createdAt": "2026-03-20 10:00:00",
  "updatedAt": "2026-03-20 10:00:00",
  "status": 1
}
```

---

## 5. 组织管理

### 5.1 接口清单

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `POST /api/organizations/list` | 有组织管理权限的账号 | `{ keyword, status, organizationType, region, page, pageSize }` | `{ total, list: OrganizationListItem[] }` |
| `GET /api/organizations/:id` | 有组织管理权限且能管理该组织的账号 | 路径参数 `id` | `{ organization: OrganizationInfo }` |
| `POST /api/organizations/create` | 已登录用户 | `{ name, organizationCode, contactPerson, contactPhone, email, address, organizationType, region, description, websiteUrl, logoUrl }` | `{ id, message }` |
| `PUT /api/organizations/:id` | 有组织管理权限且能管理该组织的账号 | 路径参数 `id` + 可更新字段 | `{ message }` |
| `DELETE /api/organizations/:id` | 有组织管理权限且能管理该组织的账号 | 路径参数 `id` | `{ message }` |
| `POST /api/organizations/:id/disable` | 有组织管理权限且能管理该组织的账号 | 路径参数 `id` + `{ reason }` | `{ message }` |
| `POST /api/organizations/:id/enable` | 有组织管理权限且能管理该组织的账号 | 路径参数 `id` + `{ reason }` | `{ message }` |
| `POST /api/organizations/search` | 有组织管理权限的账号 | `{ keyword, status, organizationType, region, startDate, endDate, page, pageSize }` | `{ total, list: OrganizationListItem[] }` |
| `POST /api/organizations/bulk-delete` | 有组织管理权限且能管理目标组织的账号 | `{ ids }` | `{ successCount, failedCount, message }` |
| `POST /api/organizations/batch-disable` | 有组织管理权限且能管理目标组织的账号 | `{ ids, reason }` | `{ successCount, failedIds, message }` |
| `POST /api/organizations/batch-enable` | 有组织管理权限且能管理目标组织的账号 | `{ ids, reason }` | `{ successCount, failedIds, message }` |

### 5.2 关键返回结构

`OrganizationListItem`

```json
{
  "id": 1,
  "name": "环保协会",
  "organizationCode": "ORG001",
  "contactPerson": "李四",
  "contactPhone": "13800000001",
  "email": "org@test.com",
  "address": "上海",
  "status": 1,
  "organizationType": "ngo",
  "region": "上海",
  "createdAt": "2026-03-20 10:00:00"
}
```

`OrganizationInfo`

```json
{
  "id": 1,
  "accountId": 10,
  "name": "环保协会",
  "organizationCode": "ORG001",
  "contactPerson": "李四",
  "contactPhone": "13800000001",
  "email": "org@test.com",
  "address": "上海",
  "status": 1,
  "organizationType": "ngo",
  "region": "上海",
  "description": "组织简介",
  "websiteUrl": "https://example.com",
  "logoUrl": "",
  "createdAt": "2026-03-20 10:00:00",
  "updatedAt": "2026-03-20 10:00:00"
}
```

---

## 6. 成员关系

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `POST /api/memberships/join` | 当前志愿者本人 | `{ volunteerId, organizationId }` | `{ membershipId, status, message }` |
| `POST /api/memberships/leave` | 当前志愿者本人 | `{ membershipId, reason }` | `{ message }` |
| `GET /api/organizations/:organizationId/members` | 有成员管理权限且能管理该组织的账号 | 查询参数 `{ status, role, keyword, page, pageSize }` | `{ total, list: MemberInfo[] }` |
| `GET /api/volunteers/:volunteerId/organizations` | 当前志愿者本人 | 查询参数 `{ status, page, pageSize }` | `{ total, list: OrganizationMemberInfo[] }` |
| `POST /api/memberships/status/update` | 有成员管理权限且能管理该组织的账号 | `{ membershipId, status, reviewComment }` | `{ message }` |
| `GET /api/memberships/stats` | 有成员管理权限的账号 | 查询参数 `{ organizationId }` | `{ pendingCount, activeCount, inactiveCount, suspendedCount, totalCount }` |

`MemberInfo` 主要字段：`membershipId, volunteerId, volunteerName, volunteerCode, organizationId, organizationName, status, role, position, motivation, expectedHours, joinDate, reviewDate, reviewComment, leaveDate, leaveReason, createdAt, updatedAt`

`OrganizationMemberInfo` 主要字段：`membershipId, organizationId, organizationName, organizationCode, status, role, position, joinDate, reviewDate, reviewComment, createdAt, updatedAt`

---

## 7. 活动管理

### 7.1 志愿者侧

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `POST /api/activities` | 已登录用户 | `{ page, pageSize, status, keyword, startFrom, startTo, sortBy, sortOrder }` | `{ total, list: ActivityItem[] }` |
| `GET /api/activities/:id` | 已登录用户 | 路径参数 `id` | `{ activity: ActivityInfo }` |
| `POST /api/activities/signup` | 当前志愿者本人 | `{ activityId }` | `{ success }` |
| `POST /api/activities/cancel` | 当前志愿者本人 | `{ activityId }` | `{ success }` |
| `POST /api/activities/my` | 当前志愿者本人 | `{ page, pageSize, status }` | `{ total, list: MyActivityItem[] }` |
| `POST /api/activities/checkin` | 当前志愿者本人 | `{ activityId, checkInCode }` | `{ success, checkInTime }` |
| `POST /api/activities/checkout` | 当前志愿者本人 | `{ activityId, checkOutCode }` | `{ success, checkOutTime, grantedHours }` |

### 7.2 组织侧

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `POST /api/activities/create` | 有组织管理权限且能管理该组织的账号 | `{ orgId, title, description, coverUrl, startTime, endTime, location, address, duration, maxPeople }` | `{ id, message }` |
| `PUT /api/activities/:id` | 有组织管理权限且能管理该活动所属组织的账号 | 路径参数 `id` + 可更新字段 | `{ message }` |
| `DELETE /api/activities/:id` | 有组织管理权限且能管理该活动所属组织的账号 | 路径参数 `id` | `{ message }` |
| `POST /api/activities/cancel/:id` | 有组织管理权限且能管理该活动所属组织的账号 | 路径参数 `id` + `{ reason }` | `{ message }` |
| `POST /api/activities/finish/:id` | 有组织管理权限且能管理该活动所属组织的账号 | 路径参数 `id` | `{ message }` |
| `POST /api/activities/attendance-codes/generate/:id` | 有组织管理权限且能管理该活动所属组织的账号 | 路径参数 `id` + `{ checkInValidMinutes, checkOutValidMinutes }` | `{ success, checkInCode, checkOutCode, attendanceCodeVersion, attendanceCodeUpdatedAt, checkInExpireAt, checkOutExpireAt }` |
| `POST /api/activities/attendance-codes/reset/:id` | 有组织管理权限且能管理该活动所属组织的账号 | 路径参数 `id` + `{ codeType, validMinutes }` | `{ success, code, codeType, attendanceCodeVersion, attendanceCodeUpdatedAt, expireAt }` |
| `GET /api/activities/attendance-codes/:id` | 有组织管理权限且能管理该活动所属组织的账号 | 路径参数 `id` | `{ success, checkInCode, checkOutCode, attendanceCodeVersion, attendanceCodeUpdatedAt, checkInExpireAt, checkOutExpireAt }` |
| `POST /api/activities/supplement-attendance` | 有组织管理权限且能管理该活动所属组织的账号 | `{ activityId, volunteerId, checkInTime, checkOutTime, reason }` | `{ success, checkInTime, checkOutTime, grantedHours }` |

### 7.3 关键返回结构

`ActivityItem` 主要字段：`id, title, description, coverUrl, startTime, endTime, location, duration, maxPeople, currentPeople, status, isRegistered, isFull`

`ActivityInfo` 主要字段：`id, orgId, orgName, title, description, coverUrl, startTime, endTime, location, address, duration, maxPeople, currentPeople, status, isRegistered, createdAt, checkInStatus, checkInTime, checkOutStatus, checkOutTime, workHourStatus, grantedHours`

`MyActivityItem` 主要字段：`id, orgId, orgName, title, description, coverUrl, startTime, endTime, location, duration, maxPeople, currentPeople, status, signupTime, checkInStatus, checkInTime, checkOutStatus, checkOutTime, workHourStatus, grantedHours, signupStatus, auditReason`

---

## 8. 审核中心

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `POST /api/audits/pending` | 有审核权限的账号 | `{ targetTypes, status, keyword, page, pageSize, createdFrom, createdTo, slaHours }` | `{ total, list: PendingAuditItem[] }` |
| `POST /api/audits/approval` | 有审核权限且能审核该记录的账号 | `{ id, reason }` | `{}` |
| `POST /api/audits/rejection` | 有审核权限且能审核该记录的账号 | `{ id, reason }` | `{}` |
| `POST /api/audits/batch-decision` | 有审核权限且能审核目标记录的账号 | `{ ids, action, reason }` | `{ successCount, failedIds }` |
| `GET /api/audits/records/:id` | 有审核权限且能查看该记录的账号 | 路径参数 `id` | `{ record: AuditRecordDetail }` |

`PendingAuditItem` 主要字段：`id, targetType, targetId, title, subTitle, creatorId, createdAt, isOverdue`

`AuditRecordDetail` 主要字段：`id, targetType, targetId, auditorId, status, oldContent, newContent, auditResult, rejectReason, auditTime, createdAt`

---

## 9. 工时流水

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `POST /api/work-hours/list` | 当前志愿者本人，或有组织管理权限的账号 | `{ page, pageSize, activityId, signupId, operationType }` | `{ total, list: WorkHourLogItem[] }` |
| `POST /api/work-hours/void` | 有组织管理权限且能管理该报名所属活动的账号 | `{ signupId, reason, idempotencyKey }` | `{ success, workHourLogId }` |
| `POST /api/work-hours/recalculate` | 有组织管理权限且能管理该报名所属活动的账号 | `{ signupId, hours, reason, idempotencyKey }` | `{ success, workHourLogId, grantedHours }` |

`WorkHourLogItem` 主要字段：`id, volunteerId, activityId, signupId, operationType, hoursDelta, serviceCountDelta, beforeTotalHours, afterTotalHours, beforeServiceCount, afterServiceCount, workHourVersion, refLogId, reason, operatorId, idempotencyKey, createdAt`

---

## 10. 通知中心

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `GET /api/notifications` | 已登录用户 | 查询参数 `{ page, pageSize, unreadOnly }` | `{ total, list: NotificationItem[] }` |
| `POST /api/notifications/read` | 已登录用户 | `{ ids }` | `{ updated }` |

`NotificationItem` 主要字段：`inboxId, notificationId, eventType, bizType, bizId, title, content, readStatus, readAt, createdAt`

---

## 11. 看板统计

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `GET /api/analytics/org/funnel` | 有统计查看权限且能访问该组织的账号 | 查询参数 `{ orgId, start, end }` | `{ registrationCount, membershipCount, signupCount, attendanceCount, workhourCount, registrationToMembershipRate, membershipToSignupRate, signupToAttendanceRate, attendanceToWorkhourRate, start, end }` |
| `GET /api/analytics/org/dashboard` | 有统计查看权限且能访问该组织的账号 | 查询参数 `{ orgId, start, end }` | `{ signupCount, approvedSignupCount, attendanceCount, attendanceRate, grantedWorkHours, start, end }` |

---

## 12. RBAC 权限

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `GET /api/authz/roles` | 有 RBAC 全局管理权限的账号 | 查询参数 `{ keyword, includeDisabled, page, pageSize }` | `{ total, list: RoleInfo[] }` |
| `POST /api/authz/roles` | 有 RBAC 全局管理权限的账号 | `{ roleCode, roleName, description }` | `{ id }` |
| `PUT /api/authz/roles/:id` | 有 RBAC 全局管理权限的账号 | 路径参数 `id` + `{ roleName, description }` | `{ message }` |
| `POST /api/authz/roles/:id/status` | 有 RBAC 全局管理权限的账号 | 路径参数 `id` + `{ status }` | `{ message }` |
| `GET /api/authz/permissions` | 有 RBAC 全局管理权限的账号 | 查询参数 `{ keyword, onlyEnabled }` | `{ list: PermissionInfo[] }` |
| `GET /api/authz/roles/:roleId/permissions` | 有 RBAC 全局管理权限的账号 | 路径参数 `roleId` | `{ roleId, permissions: RolePermissionItem[] }` |
| `POST /api/authz/roles/:roleId/permissions/set` | 有 RBAC 全局管理权限的账号 | 路径参数 `roleId` + `{ permissionIds }` | `{ message }` |
| `GET /api/authz/grants` | 有 RBAC 全局管理权限的账号 | 查询参数 `{ accountId, scopeType, scopeId, onlyActive, page, pageSize }` | `{ total, list: AccountRoleBindingInfo[] }` |
| `POST /api/authz/grants` | 有 RBAC 全局管理权限的账号 | `{ accountId, roleId, scopeType, scopeId, expiresAt, remark }` | `{ message }` |
| `POST /api/authz/grants/:bindingId/revoke` | 有 RBAC 全局管理权限的账号 | 路径参数 `bindingId` + `{ remark }` | `{ message }` |
| `GET /api/authz/me` | 已登录用户 | 无 | `{ accountId, roles, permissions }` |

---

## 13. 导入导出

### 13.1 导出接口

这 3 个接口返回的是文件流，不是 JSON：

| 接口 | 给谁用 | 请求结构 | 返回 |
| --- | --- | --- | --- |
| `POST /api/admin/export/volunteers` | 有导出权限的账号；若存在多个组织作用域则此接口可能无法直接确定组织 | `{ idList, keyword, auditStatus, status }` | Excel 文件流 |
| `POST /api/admin/export/activities` | 有导出权限的账号；若存在多个组织作用域则此接口可能无法直接确定组织 | `{ idList, keyword, status, startFrom, startTo }` | Excel 文件流 |
| `POST /api/admin/export/ops-report` | 有导出权限且能访问指定组织的账号 | `{ periodType, orgId, start, end }` | Excel 文件流 |

前端处理建议：

- `responseType` 设为 `blob`
- 从响应头 `Content-Disposition` 取文件名

### 13.2 导入接口

这 2 个接口使用 `multipart/form-data` 上传文件，字段名固定为 `file`：

| 接口 | 给谁用 | 请求格式 | 返回 data 结构 |
| --- | --- | --- | --- |
| `POST /api/admin/import/volunteers` | 有组织管理权限的账号 | `form-data(file)` | `{ totalCount, successCount, failedCount, errorFileName, errorFileContentType, errorFileContent, failures }` |
| `POST /api/admin/import/activities` | 有组织管理权限且能管理导入数据所属组织的账号 | `form-data(file)` | `{ totalCount, successCount, failedCount, errorFileName, errorFileContentType, errorFileContent, failures }` |

`failures[]` 结构：`{ rowNumber, reason, raw }`

---

## 14. AI 助手

### 14.1 普通接口

| 接口 | 给谁用 | 请求结构 | 返回 data 结构 |
| --- | --- | --- | --- |
| `POST /api/assistant/sessions` | 已登录用户 | `{ scene, title }` | `{ session_id }` |
| `POST /api/assistant/chat` | 已登录用户（且仅能对自己的会话发消息） | `{ session_id, message, stream }` | `{ reply, tool_calls, usage }` |
| `GET /api/assistant/sessions/:id/messages` | 已登录用户（且仅能查看自己的会话） | 路径参数 `id` | `{ list: AssistantMessageItem[] }` |
| `POST /api/assistant/actions/activity-draft` | 已登录用户；实际能否生成具体组织草案取决于该用户是否拥有对应组织成员/可访问组织范围 | `{ session_id, topic, target_people, location }` | `{ session_id, result }` |

### 14.2 SSE 流式接口

- 接口：`POST /api/assistant/chat/stream`
- 给谁用：`登录用户通用`
- 请求体：

```json
{
  "session_id": 1,
  "message": "帮我生成一个环保活动方案",
  "stream": false
}
```

- 返回类型：`text/event-stream`
- 事件流示例：

```text
event: start
data: {"session_id":1}

event: delta
data: {"text":"第一段文本"}

event: tool
data: {"tool_name":"xxx","success":true}

event: usage
data: {"model":"xxx","token_in":10,"token_out":20,"latency_ms":800}

event: done
data: {"finish_reason":"stop"}
```

---

## 15. 前端联调建议

### 15.1 建议优先联调顺序

1. 注册/登录/刷新令牌
2. 当前用户信息、组织列表、活动列表
3. 报名/取消报名/签到/签退
4. 组织侧活动管理、成员管理、审核
5. 通知、统计、导出导入、AI 助手

### 15.2 前端需要特别注意

- 所有 JSON 接口都先判断最外层 `code`
- 导出接口要按文件流处理
- 导入接口要用 `multipart/form-data`
- 大多数列表接口带分页：`page`、`pageSize`
- 多数字段是可选的，联调时建议只传当前页面真实需要的字段
- 活动、审核、工时等模块里有较多状态码，前端最好统一做枚举映射

---

## 16. 文档边界说明

这份文档是给前端联调使用的“简版说明”，重点是：

- 这个接口给谁用
- 需要传什么
- 会返回什么
- 有没有鉴权/文件流/SSE 这类特殊处理

---

## 17. 核心联调示例

下面这些示例尽量选“最小可用请求”，前端可以直接照着调。

### 17.1 登录

请求：

```http
POST /api/login
Content-Type: application/json
```

```json
{
  "loginType": "username",
  "identifier": "zhangsan",
  "password": "123456",
  "identity": "volunteer"
}
```

成功响应：

```json
{
  "code": 200,
  "msg": "OK",
  "data": {
    "success": true,
    "message": "登录成功",
    "accessToken": "xxx",
    "refreshToken": "xxx",
    "expiresAt": 1710000000,
    "userInfo": {
      "userId": "1",
      "username": "zhangsan",
      "identity": "volunteer"
    }
  }
}
```

### 17.2 活动列表

请求：

```http
POST /api/activities
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "page": 1,
  "pageSize": 10,
  "status": 1,
  "keyword": "",
  "sortBy": "start_time",
  "sortOrder": "asc"
}
```

### 17.3 创建活动

请求：

```http
POST /api/activities/create
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "orgId": 1,
  "title": "社区环保日",
  "description": "社区清洁和垃圾分类宣传",
  "coverUrl": "",
  "startTime": "2026-03-28 09:00:00",
  "endTime": "2026-03-28 12:00:00",
  "location": "社区广场",
  "address": "上海市XX路XX号",
  "duration": 3,
  "maxPeople": 30
}
```

成功响应：

```json
{
  "code": 200,
  "msg": "OK",
  "data": {
    "id": 1001,
    "message": "创建活动成功"
  }
}
```

### 17.4 活动报名审核通过

请求：

```http
POST /api/audits/approval
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "id": 5001,
  "reason": "审核通过"
}
```

### 17.5 通知批量已读

请求：

```http
POST /api/notifications/read
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "ids": [101, 102, 103]
}
```

成功响应：

```json
{
  "code": 200,
  "msg": "OK",
  "data": {
    "updated": 3
  }
}
```

### 17.6 导入志愿者

请求方式：

```http
POST /api/admin/import/volunteers
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

表单字段：

- `file`：Excel 文件

### 17.7 导出活动

请求：

```http
POST /api/admin/export/activities
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "keyword": "",
  "status": 1,
  "startFrom": "2026-03-01 00:00:00",
  "startTo": "2026-03-31 23:59:59"
}
```

说明：

- 返回是文件流
- 前端要用 `blob` 方式接收
- 文件名从 `Content-Disposition` 读取

如果需要更完整的字段定义和类型细节，以以下文件为准：

- `internal/api/*.proto`
- `docs/openapi.yaml`
