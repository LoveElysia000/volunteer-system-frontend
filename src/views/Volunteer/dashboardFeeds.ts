import { getNotificationEventLabel } from '../../store/modules/notifications.ts'
import { BACKEND_ACTIVITY_STATUS, BACKEND_ACTIVITY_SIGNUP_STATUS } from '../../constants/activityEnums.ts'
import type { ActivityListItem } from '../../types/activity.ts'
import type { NotificationItem } from '../../types/notification.ts'

export type VolunteerFeedTone = 'green' | 'blue' | 'amber' | 'slate' | 'rose'

export interface VolunteerRecommendedCardItem {
  id: number
  title: string
  description: string
  date: string
  location: string
  participants: number
  capacity: number
  orgName?: string
  tag: string
}

export interface VolunteerAchievementFeedItem {
  id: number
  title: string
  content: string
  context: string
  tone: VolunteerFeedTone
}

const formatMonthDayTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const resolveFeedTone = (eventType?: string): VolunteerFeedTone => {
  if (!eventType) return 'slate'
  if (eventType.startsWith('work_hour_')) return 'green'
  if (eventType.startsWith('signup_')) return 'blue'
  if (eventType === 'activity_canceled') return 'rose'
  if (eventType.startsWith('activity_') || eventType === 'member_join') return 'amber'
  return 'slate'
}

export const buildVolunteerRecommendedActivities = (items: ActivityListItem[]) => {
  return items
    .filter((item) => (
      item.status === BACKEND_ACTIVITY_STATUS.RECRUITING
      && !item.isRegistered
      && item.signupStatus !== BACKEND_ACTIVITY_SIGNUP_STATUS.SUCCESS
      && item.signupStatus !== BACKEND_ACTIVITY_SIGNUP_STATUS.PENDING
    ))
    .sort((left, right) => {
      const leftRemaining = Math.max((left.maxPeople || 0) - (left.currentPeople || 0), 0)
      const rightRemaining = Math.max((right.maxPeople || 0) - (right.currentPeople || 0), 0)
      if (leftRemaining !== rightRemaining) {
        return leftRemaining - rightRemaining
      }

      return new Date(left.startTime).getTime() - new Date(right.startTime).getTime()
    })
    .slice(0, 3)
    .map<VolunteerRecommendedCardItem>((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: formatMonthDayTime(item.startTime),
      location: item.location,
      participants: item.currentPeople,
      capacity: item.maxPeople,
      orgName: item.orgName,
      tag: item.orgName || '推荐活动'
    }))
}

export const buildVolunteerAchievementFeed = (items: NotificationItem[]) => {
  return items
    .filter((item) => (
      Boolean(item.eventType)
      && (
        item.eventType.startsWith('signup_')
        || item.eventType.startsWith('activity_')
        || item.eventType.startsWith('work_hour_')
        || item.eventType === 'member_join'
      )
    ))
    .slice(0, 4)
    .map<VolunteerAchievementFeedItem>((item) => ({
      id: item.inboxId,
      title: item.title || getNotificationEventLabel(item.eventType),
      content: item.content,
      context: item.createdAt,
      tone: resolveFeedTone(item.eventType)
    }))
}
