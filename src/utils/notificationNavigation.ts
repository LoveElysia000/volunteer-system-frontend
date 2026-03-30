import type {
  NotificationAudience,
  NotificationItem,
  NotificationTarget
} from '../types/notification.ts'

const createDisabledTarget = (to: string): NotificationTarget => ({
  to,
  disabled: true,
  label: '留在通知中心'
})

const isBizType = (item: NotificationItem, expected: string) => item.bizType === expected

export const resolveNotificationTarget = (
  item: NotificationItem,
  audience: NotificationAudience
): NotificationTarget => {
  if (audience === 'volunteer') {
    if (
      item.eventType === 'member_join'
      || isBizType(item, 'membership')
      || isBizType(item, 'organization')
    ) {
      return { to: '/volunteer/organizations', disabled: false, label: '查看我的组织' }
    }

    if (
      item.eventType.startsWith('signup_')
      || isBizType(item, 'activity_signup')
    ) {
      if ((isBizType(item, 'activity') || isBizType(item, 'activity_signup')) && typeof item.bizId === 'number') {
        return { to: `/volunteer/activities/${item.bizId}`, disabled: false, label: '查看活动详情' }
      }

      return { to: '/volunteer/activities/my-registrations', disabled: false, label: '查看我的报名' }
    }

    if (
      item.eventType.startsWith('activity_')
      || isBizType(item, 'activity')
    ) {
      if (typeof item.bizId === 'number') {
        return { to: `/volunteer/activities/${item.bizId}`, disabled: false, label: '查看活动详情' }
      }

      return { to: '/volunteer/activities', disabled: false, label: '查看活动列表' }
    }

    if (item.eventType.startsWith('work_hour_') || isBizType(item, 'work_hour')) {
      return { to: '/volunteer/work-hours', disabled: false, label: '查看工时记录' }
    }

    return createDisabledTarget('/volunteer/notifications')
  }

  if (
    item.eventType.startsWith('signup_')
    || isBizType(item, 'activity_signup')
  ) {
    return { to: '/organization/activities/review', disabled: false, label: '查看审核中心' }
  }

  if (
    item.eventType.startsWith('activity_')
    || isBizType(item, 'activity')
  ) {
    return { to: '/organization/activities', disabled: false, label: '查看活动管理' }
  }

  if (
    item.eventType === 'member_join'
    || isBizType(item, 'membership')
    || isBizType(item, 'organization_member')
  ) {
    return { to: '/organization/members', disabled: false, label: '查看成员管理' }
  }

  if (item.eventType.startsWith('work_hour_') || isBizType(item, 'work_hour')) {
    return { to: '/organization/statistics/financial', disabled: false, label: '查看工时流水' }
  }

  return createDisabledTarget('/organization/notifications')
}
