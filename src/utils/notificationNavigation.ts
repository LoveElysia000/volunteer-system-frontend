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

export const resolveNotificationTarget = (
  item: NotificationItem,
  audience: NotificationAudience
): NotificationTarget => {
  if (audience === 'volunteer') {
    if (item.eventType === 'member_join') {
      return { to: '/volunteer/organizations', disabled: false, label: '查看我的组织' }
    }

    if (item.eventType === 'signup_approved' || item.eventType === 'signup_rejected') {
      if (item.bizType === 'activity' && typeof item.bizId === 'number') {
        return { to: `/volunteer/activities/${item.bizId}`, disabled: false, label: '查看活动详情' }
      }

      return { to: '/volunteer/activities/my-registrations', disabled: false, label: '查看我的报名' }
    }

    if (item.eventType === 'activity_updated' || item.eventType === 'activity_canceled') {
      if (typeof item.bizId === 'number') {
        return { to: `/volunteer/activities/${item.bizId}`, disabled: false, label: '查看活动详情' }
      }

      return { to: '/volunteer/activities', disabled: false, label: '查看活动列表' }
    }

    if (item.eventType.startsWith('work_hour_')) {
      return { to: '/volunteer/work-hours', disabled: false, label: '查看工时记录' }
    }

    return createDisabledTarget('/volunteer/notifications')
  }

  if (item.eventType.startsWith('activity_') || item.bizType === 'activity') {
    return { to: '/organization/activities', disabled: false, label: '查看活动管理' }
  }

  if (item.eventType === 'member_join') {
    return { to: '/organization/members', disabled: false, label: '查看成员管理' }
  }

  if (item.eventType.startsWith('work_hour_')) {
    return { to: '/organization/statistics/financial', disabled: false, label: '查看工时流水' }
  }

  return createDisabledTarget('/organization/notifications')
}
