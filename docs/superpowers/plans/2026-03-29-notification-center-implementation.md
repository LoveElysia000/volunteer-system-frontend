# Notification Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated volunteer notification center, keep organization notifications aligned with the same backend contract, and centralize notification jump behavior without coupling the two page designs.

**Architecture:** Build a small shared notification capability layer around the existing API/store so role-specific pages can reuse query shaping, read-state helpers, and jump resolution. Then add a volunteer-specific notification page and route while making only incremental changes to the organization notification page.

**Tech Stack:** Vue 3, Pinia, TypeScript, Vue Router, Vite, node:test, ESLint

---

### Task 1: Add shared notification helpers and contract tests

**Files:**
- Create: `tests/notification-helpers.test.ts`
- Create: `src/utils/notificationNavigation.ts`
- Modify: `src/types/notification.ts`
- Modify: `src/store/modules/notifications.ts`

- [ ] **Step 1: Write the failing test for role-aware notification jumps**

```ts
import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveNotificationTarget } from '../src/utils/notificationNavigation'
import { NotificationReadStatus, type NotificationItem } from '../src/types/notification'

const baseItem: NotificationItem = {
  inboxId: 101,
  notificationId: 88,
  eventType: 'activity_updated',
  bizType: 'activity',
  bizId: 9001,
  title: '活动更新',
  content: '活动时间已调整',
  readStatus: NotificationReadStatus.UNREAD,
  readAt: '',
  createdAt: '2026-03-29 14:30:00'
}

test('resolveNotificationTarget returns volunteer activity detail when bizId exists', () => {
  assert.deepEqual(resolveNotificationTarget(baseItem, 'volunteer'), {
    to: '/volunteer/activities/9001',
    disabled: false
  })
})

test('resolveNotificationTarget falls back to organization list page for activity notifications', () => {
  assert.deepEqual(resolveNotificationTarget(baseItem, 'organization'), {
    to: '/organization/activities',
    disabled: false
  })
})

test('resolveNotificationTarget disables jump when no safe route exists', () => {
  assert.deepEqual(resolveNotificationTarget({
    ...baseItem,
    eventType: 'unknown_event',
    bizType: '',
    bizId: 0
  }, 'volunteer'), {
    to: '/volunteer/notifications',
    disabled: true
  })
})
```

- [ ] **Step 2: Write the failing test for read updates and display labeling**

```ts
import { createNotificationsStoreForTest, getNotificationEventLabel } from '../src/store/modules/notifications'

test('markNotificationsAsRead updates items by inboxId instead of notificationId', async () => {
  const store = createNotificationsStoreForTest([
    {
      ...baseItem,
      inboxId: 201,
      notificationId: 999,
      readStatus: NotificationReadStatus.UNREAD
    }
  ])

  store.applyReadState([201], '2026-03-29T10:00:00.000Z')

  assert.equal(store.items.value[0].readStatus, NotificationReadStatus.READ)
  assert.equal(store.items.value[0].readAt, '2026-03-29T10:00:00.000Z')
})

test('getNotificationEventLabel returns readable text for supported event types', () => {
  assert.equal(getNotificationEventLabel('work_hour_granted'), '工时已发放')
  assert.equal(getNotificationEventLabel('signup_rejected'), '报名未通过')
  assert.equal(getNotificationEventLabel('unknown_event'), '未分类通知')
})
```

- [ ] **Step 3: Run the test file to verify it fails for missing exports**

Run:
```bash
node --test tests/notification-helpers.test.ts
```

Expected:
- FAIL because `resolveNotificationTarget`, `createNotificationsStoreForTest`, or `getNotificationEventLabel` do not exist yet

- [ ] **Step 4: Implement the minimal shared helper layer**

```ts
// src/utils/notificationNavigation.ts
import type { NotificationItem, NotificationAudience, NotificationTarget } from '@/types/notification'

export const resolveNotificationTarget = (
  item: NotificationItem,
  audience: NotificationAudience
): NotificationTarget => {
  if (audience === 'volunteer') {
    if (item.eventType === 'member_join') return { to: '/volunteer/organizations', disabled: false }
    if (item.eventType === 'signup_approved' || item.eventType === 'signup_rejected') {
      return { to: '/volunteer/activities/my-registrations', disabled: false }
    }
    if ((item.eventType === 'activity_updated' || item.eventType === 'activity_canceled') && item.bizId) {
      return { to: `/volunteer/activities/${item.bizId}`, disabled: false }
    }
    if (item.eventType.startsWith('work_hour_')) return { to: '/volunteer/work-hours', disabled: false }
    return { to: '/volunteer/notifications', disabled: true }
  }

  if (item.eventType.startsWith('activity_') || item.bizType === 'activity') {
    return { to: '/organization/activities', disabled: false }
  }
  if (item.eventType === 'member_join') return { to: '/organization/members', disabled: false }
  if (item.eventType.startsWith('work_hour_')) return { to: '/organization/statistics/financial', disabled: false }
  return { to: '/organization/notifications', disabled: true }
}
```

```ts
// src/store/modules/notifications.ts
const applyReadState = (ids: number[], readAt: string) => {
  items.value = items.value.map((item) => (
    ids.includes(item.inboxId)
      ? { ...item, readStatus: NotificationReadStatus.READ, readAt }
      : item
  ))
}

export const getNotificationEventLabel = (eventType?: string) => {
  const labels: Record<string, string> = {
    member_join: '组织加入结果',
    signup_approved: '报名已通过',
    signup_rejected: '报名未通过',
    activity_updated: '活动信息更新',
    activity_canceled: '活动已取消',
    work_hour_granted: '工时已发放',
    work_hour_voided: '工时已作废',
    work_hour_regranted: '工时已重算'
  }
  return labels[eventType || ''] || '未分类通知'
}
```

- [ ] **Step 5: Re-run the tests to verify the helper layer passes**

Run:
```bash
node --test tests/notification-helpers.test.ts
```

Expected:
- PASS for jump-resolution, label mapping, and inboxId-based read updates


### Task 2: Add the volunteer notification route, sidebar entry, and page shell

**Files:**
- Create: `src/views/Volunteer/Notifications.vue`
- Modify: `src/router/routes.ts`
- Modify: `src/components/volunteer/VolunteerSidebar.vue`
- Modify: `src/views/Volunteer/VolunteerLayout.vue`

- [ ] **Step 1: Write the failing route/navigation test**

```ts
import test from 'node:test'
import assert from 'node:assert/strict'
import { routes } from '../src/router/routes'

test('volunteer routes include notification center entry', () => {
  const volunteerRoute = routes.find((route) => route.name === 'volunteer')
  const children = volunteerRoute?.children || []
  const notificationRoute = children.find((route) => route.name === 'volunteer-notifications')

  assert.ok(notificationRoute)
  assert.equal(notificationRoute?.path, 'notifications')
  assert.equal(notificationRoute?.meta?.title, '通知中心')
})
```

- [ ] **Step 2: Run the targeted tests to verify route coverage fails first**

Run:
```bash
node --test tests/notification-helpers.test.ts
```

Expected:
- FAIL because the volunteer notification route is not present yet

- [ ] **Step 3: Add the route and sidebar entry**

```ts
// src/router/routes.ts
{
  path: 'notifications',
  name: 'volunteer-notifications',
  component: () => import('@/views/Volunteer/Notifications.vue'),
  meta: { title: '通知中心' }
}
```

```ts
// src/components/volunteer/VolunteerSidebar.vue
{
  key: 'notification-center',
  label: '通知中心',
  icon: BellIcon,
  to: '/volunteer/notifications',
  badge: '消息',
  badgeClass: 'bg-emerald-100 text-emerald-700'
}
```

- [ ] **Step 4: Implement the volunteer notification page with independent volunteer styling**

```vue
<VolunteerPageHeader
  eyebrow="通知中心"
  title="跟进我的服务动态"
  description="统一查看报名结果、活动变更和工时结算，避免错过关键提醒。"
  :meta-items="headerMeta"
  layout="operations"
>
  <template #actions>
    <Input v-model.trim="searchQuery" placeholder="搜索标题、内容或业务类型" theme="emerald" />
  </template>
</VolunteerPageHeader>
```

```vue
<div class="grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
  <VolunteerSectionCard title="通知流" description="优先处理未读提醒和最近变更。">
    <!-- unread filter, summary cards, list, batch-read button -->
  </VolunteerSectionCard>

  <VolunteerSectionCard title="通知详情" description="保留显式已读和业务跳转操作。" tone="soft">
    <!-- selected notification detail, mark-read button, jump button -->
  </VolunteerSectionCard>
</div>
```

- [ ] **Step 5: Re-run the route test and lint the new page**

Run:
```bash
node --test tests/notification-helpers.test.ts
npm run lint -- src/views/Volunteer/Notifications.vue src/components/volunteer/VolunteerSidebar.vue src/router/routes.ts
```

Expected:
- route-related tests pass
- lint passes for the new volunteer page and route wiring


### Task 3: Refine the organization notification page to use shared jump behavior

**Files:**
- Modify: `src/views/Organization/Notifications.vue`

- [ ] **Step 1: Write the failing organization interaction test**

```ts
import test from 'node:test'
import assert from 'node:assert/strict'
import { getNotificationEventLabel } from '../src/store/modules/notifications'
import { resolveNotificationTarget } from '../src/utils/notificationNavigation'

test('organization notification helper returns safe jump for work-hour events', () => {
  assert.deepEqual(resolveNotificationTarget({
    ...baseItem,
    eventType: 'work_hour_granted',
    bizType: 'activity',
    bizId: 9001
  }, 'organization'), {
    to: '/organization/statistics/financial',
    disabled: false
  })
})

test('organization event labels are readable in the drawer metadata', () => {
  assert.equal(getNotificationEventLabel('activity_canceled'), '活动已取消')
})
```

- [ ] **Step 2: Run the helper tests to verify the new organization expectation fails if mapping is incomplete**

Run:
```bash
node --test tests/notification-helpers.test.ts
```

Expected:
- FAIL if organization mapping or labels are still incomplete

- [ ] **Step 3: Update the organization page to consume the shared helper**

```ts
import { useRouter } from 'vue-router'
import { getNotificationEventLabel } from '@/store/modules/notifications'
import { resolveNotificationTarget } from '@/utils/notificationNavigation'

const router = useRouter()

const selectedNotificationTarget = computed(() => (
  selectedNotification.value
    ? resolveNotificationTarget(selectedNotification.value, 'organization')
    : null
))

const goToRelatedPage = async () => {
  if (!selectedNotificationTarget.value || selectedNotificationTarget.value.disabled) {
    messageStore.info('暂未配置对应页面')
    return
  }
  await router.push(selectedNotificationTarget.value.to)
}
```

```vue
<Button
  v-if="selectedNotificationTarget"
  variant="outline"
  :disabled="selectedNotificationTarget.disabled"
  @click="goToRelatedPage"
>
  前往相关页面
</Button>
```

- [ ] **Step 4: Refresh wording and event display text without redesigning the page**

```vue
<OrganizationPageHeader
  eyebrow="通知中心"
  title="通知中心"
  description="集中查看当前账号收到的活动提醒、成员动态和工时通知。"
  :meta-items="headerMeta"
  mode="compact"
/>
```

```vue
<p class="mt-1 text-sm font-semibold text-slate-900">
  {{ getNotificationEventLabel(selectedNotification.eventType) }}
</p>
```

- [ ] **Step 5: Re-run the helper test and lint the organization page**

Run:
```bash
node --test tests/notification-helpers.test.ts
npm run lint -- src/views/Organization/Notifications.vue
```

Expected:
- PASS for organization helper assertions
- lint passes for the updated organization page


### Task 4: Final verification and fallout fixes

**Files:**
- Modify: only files required by verification fallout

- [ ] **Step 1: Run the full planned automated verification**

Run:
```bash
node --test tests/notification-helpers.test.ts
npm run lint
npm run build
```

Expected:
- all helper tests pass
- lint passes
- build completes successfully

- [ ] **Step 2: Fix any failures using the same red-green loop**

```ts
// Example fallout shape: narrow any route target types instead of weakening caller code
export interface NotificationTarget {
  to: string
  disabled: boolean
}
```

```vue
<!-- Example fallout shape: guard against null detail state -->
<Button
  v-if="selectedNotification && selectedNotificationTarget"
  :disabled="selectedNotificationTarget.disabled"
>
  前往相关页面
</Button>
```

- [ ] **Step 3: Re-run verification after fallout fixes**

Run:
```bash
node --test tests/notification-helpers.test.ts
npm run lint
npm run build
```

Expected:
- all commands remain green with no new notification-related regressions
