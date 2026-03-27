# 前端筛选后端化对接清单

## 目的

这份清单用于和后端确认：当前前端页面里哪些筛选项仍然是本地过滤，如果希望统一成“由后端筛选并返回结果”，后端需要补哪些查询参数，是否需要新增枚举值。

说明：

- `已传` 表示前端当前已经把该值传给后端接口。
- `本地过滤` 表示前端当前只在页面内用已返回数据做过滤，没有传给后端。
- `展示分类` 表示它更偏 UI 视图分类，不一定必须后端化。

## 已经完成后端传值的页面

这些页面当前主筛选项已经走后端，不属于这次需要补契约的重点：

| 页面 | 当前已传给后端的参数 |
| --- | --- |
| 志愿者管理页 `/organization/volunteers` | `keyword` `auditStatus` `status` `page` `pageSize` |
| 活动管理页 `/organization/activities` | `keyword` `status` `startFrom` `startTo` `page` `pageSize` |
| 审核中心 `/organization/activities/review` | `targetTypes` `keyword` `createdFrom` `createdTo` `slaHours` `page` `pageSize` |
| 成员管理页 `/organization/members` | `status` `role` `page` `pageSize` |
| 组织信息页 `/organization/organization-info` | `keyword` `status` `organizationType` `region` `startDate` `endDate` `page` `pageSize` |
| 工时流水页 `/organization/statistics/financial` | `activityId` `signupId` `operationType` `page` `pageSize` |
| 我的报名页 `/volunteer/activities/my-registrations` | `keyword` `status` `registeredOnly` `page` `pageSize` |
| 志愿者组织页 `/volunteer/organizations` | 公开组织列表：`keyword` `organizationType` `region` `page` `pageSize`；我的组织：`status` `page` `pageSize` |
| 通知中心 `/organization/notifications` | `unreadOnly` `page` `pageSize` |

## 建议优先后端化的筛选项

### 1. 通知中心

| 项目 | 当前情况 |
| --- | --- |
| 页面 | `/organization/notifications` |
| 前端筛选项 | `searchQuery` |
| 当前实现 | 本地过滤 |
| 当前后端参数 | `page` `pageSize` `unreadOnly` |
| 建议新增参数 | `keyword?` |
| 参数类型 | `string` |
| 是否需要新增枚举 | 否 |

建议后端筛选语义：

- 支持按 `title`
- 支持按 `content`
- 支持按 `notifications.biz_type`
- 支持按 `notifications.event_type`

建议接口效果：

- 前端传 `keyword` 后，后端返回过滤后的 `total` 和 `list`
- 这样分页总数、当前页数据、未读批量操作口径可以统一

### 2. 审核中心队列筛选

| 项目 | 当前情况 |
| --- | --- |
| 页面 | `/organization/activities/review` |
| 前端筛选项 | `queueFilter` |
| 当前实现 | 本地过滤 |
| 当前后端参数 | `targetTypes` `keyword` `createdFrom` `createdTo` `slaHours` `page` `pageSize` |
| 建议新增参数 | `queueState?` 或 `overdueOnly?` |
| 参数类型 | `string enum` 或 `boolean` |
| 是否需要新增枚举 | 如果走 `queueState`，建议需要；如果走 `overdueOnly`，则不需要 |

推荐方案：

#### 方案 A：`queueState`

推荐枚举值：

| 枚举值 | 含义 |
| --- | --- |
| `all` | 全部待审核 |
| `overdue` | 已超时 |
| `pending` | 正常待处理 |

优点：

- 和前端现有 UI 完全一致
- 语义完整

#### 方案 B：`overdueOnly`

推荐取值：

| 值 | 含义 |
| --- | --- |
| `true` | 仅超时 |
| `false` | 仅非超时 |

缺点：

- 还需要前端自己处理“全部”状态
- 不如 `queueState` 直观

### 3. 志愿者活动大厅 Tab

| 项目 | 当前情况 |
| --- | --- |
| 页面 | `/volunteer/activities` |
| 前端筛选项 | `activeTab` |
| 当前实现 | 展示分类 / 前端过滤 |
| 当前后端参数 | `keyword` `startFrom` `startTo` `page` `pageSize` |
| 建议新增参数 | `viewMode?` 或 `registrationView?` |
| 参数类型 | `string enum` |
| 是否需要新增枚举 | 是 |

这项是否需要后端化，要先和后端统一“Tab 的业务含义”。

推荐枚举值示例：

| 枚举值 | 含义 |
| --- | --- |
| `all` | 全部活动 |
| `available` | 可报名活动 |
| `registered` | 已报名活动 |
| `completed` | 已完成活动 |

注意：

- 这不是数据库天然枚举，更像查询视图枚举
- 如果后端不想承接视图层概念，也可以保持前端分类

## 当前可保留为前端视图过滤的项

这些项更偏展示层，不一定值得强行改成后端参数：

| 页面 | 前端项 | 原因 |
| --- | --- | --- |
| 审核中心 `/organization/activities/review` | `filteredItems.length` | 只是当前页展示统计 |
| 志愿者活动大厅 `/volunteer/activities` | 局部 badge / 当前页数量摘要 | 属于 UI 派生值 |
| 各页 header 摘要卡片 | 当前页数量、当前筛选结果统计 | 本质是页面展示信息，不是资源查询条件 |

## 是否需要新增枚举的结论

### 不需要新增枚举

这些只需要普通查询参数：

| 页面 | 建议参数 |
| --- | --- |
| 通知中心 | `keyword` |

### 建议新增枚举

这些属于“查询视图状态”，不是现成数据库枚举：

| 页面 | 建议参数 | 推荐是否新增枚举 |
| --- | --- | --- |
| 审核中心 | `queueState` | 建议新增 |
| 志愿者活动大厅 | `viewMode` / `registrationView` | 建议新增 |

## 对接建议顺序

### 第一优先级

通知中心补 `keyword`

原因：

- 改造成本最低
- 不需要新增枚举
- 能立即统一搜索结果、分页总数和批量已读口径

### 第二优先级

审核中心补 `queueState`

原因：

- 当前已有明确 UI
- 前后端口径更容易统一

### 第三优先级

志愿者活动大厅补 `viewMode`

原因：

- 需要先统一产品语义
- 更像查询视图能力，不一定必须立即做

## 备注

如果后端准备补这些参数，建议优先按下面规则实现：

- 由后端返回过滤后的 `total`
- 由后端返回过滤后的当前页 `list`
- 尽量避免“前端再对分页结果做二次本地过滤”

这样前端的列表数据、分页、摘要、批量操作才能长期保持一致。
