import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveNotificationTarget } from '../src/utils/notificationNavigation.ts'
import {
  NotificationReadStatus,
  type NotificationItem
} from '../src/types/notification.ts'
import {
  applyNotificationReadState,
  getNotificationEventLabel
} from '../src/store/modules/notifications.ts'

const baseItem: NotificationItem = {
  inboxId: 101,
  notificationId: 88,
  eventType: 'activity_updated',
  title: '活动更新',
  content: '活动时间已调整',
  readStatus: NotificationReadStatus.UNREAD,
  readAt: '',
  createdAt: '2026-03-29 14:30:00'
}

test('resolveNotificationTarget returns volunteer activity detail when bizId exists', () => {
  assert.deepEqual(
    resolveNotificationTarget(
      {
        ...baseItem,
        bizType: 'activity',
        bizId: 9001
      },
      'volunteer'
    ),
    {
      to: '/volunteer/activities/9001',
      disabled: false,
      label: '查看活动详情'
    }
  )
})

test('resolveNotificationTarget sends volunteer signup decisions to activity detail when business context is available', () => {
  assert.deepEqual(
    resolveNotificationTarget(
      {
        ...baseItem,
        eventType: 'signup_approved',
        bizType: 'activity',
        bizId: 3002
      },
      'volunteer'
    ),
    {
      to: '/volunteer/activities/3002',
      disabled: false,
      label: '查看活动详情'
    }
  )
})

test('resolveNotificationTarget falls back to volunteer activity list when activity notification has no bizId', () => {
  assert.deepEqual(
    resolveNotificationTarget(
      {
        ...baseItem,
        bizType: 'activity'
      },
      'volunteer'
    ),
    {
      to: '/volunteer/activities',
      disabled: false,
      label: '查看活动列表'
    }
  )
})

test('resolveNotificationTarget falls back to organization activity list for activity notifications', () => {
  assert.deepEqual(
    resolveNotificationTarget(
      {
        ...baseItem,
        bizType: 'activity',
        bizId: 9001
      },
      'organization'
    ),
    {
      to: '/organization/activities',
      disabled: false,
      label: '查看活动管理'
    }
  )
})

test('resolveNotificationTarget sends organization member joins to members management', () => {
  assert.deepEqual(
    resolveNotificationTarget(
      {
        ...baseItem,
        eventType: 'member_join'
      },
      'organization'
    ),
    {
      to: '/organization/members',
      disabled: false,
      label: '查看成员管理'
    }
  )
})

test('resolveNotificationTarget disables jump when no safe route exists', () => {
  assert.deepEqual(
    resolveNotificationTarget(
      {
        ...baseItem,
        eventType: 'unknown_event'
      },
      'volunteer'
    ),
    {
      to: '/volunteer/notifications',
      disabled: true,
      label: '留在通知中心'
    }
  )
})

test('applyNotificationReadState updates items by inboxId instead of notificationId', () => {
  const items = applyNotificationReadState(
    [
      {
        ...baseItem,
        inboxId: 201,
        notificationId: 999,
        readStatus: NotificationReadStatus.UNREAD,
        readAt: ''
      }
    ],
    [201],
    '2026-03-29T10:00:00.000Z'
  )

  assert.equal(items[0]?.readStatus, NotificationReadStatus.READ)
  assert.equal(items[0]?.readAt, '2026-03-29T10:00:00.000Z')
})

test('getNotificationEventLabel returns readable text for supported event types', () => {
  assert.equal(getNotificationEventLabel('work_hour_granted'), '工时已发放')
  assert.equal(getNotificationEventLabel('signup_rejected'), '报名未通过')
  assert.equal(getNotificationEventLabel('unknown_event'), '未分类通知')
})
