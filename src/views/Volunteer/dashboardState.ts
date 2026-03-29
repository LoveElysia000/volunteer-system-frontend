import { BACKEND_ACTIVITY_STATUS } from '../../constants/activityEnums.ts'
import { shouldRefreshOnKeepAliveActivated } from '../../utils/keepAliveRefresh.ts'
import type { ActivityListRequest } from '../../types/activity.ts'
import type { NotificationListRequest } from '../../types/notification.ts'

type DashboardMetricTone = 'green' | 'blue' | 'amber'

interface VolunteerDashboardMetric {
  label: string
  value: string
  detail: string
  tone: DashboardMetricTone
}

interface VolunteerDashboardMetricInput {
  monthlyHoursGrowth: number
  totalActivities: number
  completedActivities: number
  upcomingActivities: number
}

interface VolunteerHeroHighlight {
  label: string
  value: string
  detail: string
  progressPercentage?: number
}

export const shouldLoadVolunteerDashboardData = (routeName: string) => {
  return routeName === 'volunteer-dashboard'
}

export const shouldRefreshVolunteerDashboardData = ({
  currentRouteName,
  hasLoadedOnce,
  hasActivatedOnce
}: {
  currentRouteName: string
  hasLoadedOnce: boolean
  hasActivatedOnce: boolean
}) => {
  return shouldRefreshOnKeepAliveActivated({
    currentRouteName,
    expectedRouteName: 'volunteer-dashboard',
    hasLoadedOnce,
    hasActivatedOnce
  })
}

export const getVolunteerRecommendedActivitiesRequest = (): ActivityListRequest => ({
  page: 1,
  pageSize: 24,
  status: [BACKEND_ACTIVITY_STATUS.RECRUITING],
  sortBy: 'start_time',
  sortOrder: 'asc'
})

export const getVolunteerAchievementFeedRequest = (): NotificationListRequest => ({
  page: 1,
  pageSize: 20
})

export const buildVolunteerDashboardMonthlyMetrics = ({
  monthlyHoursGrowth,
  totalActivities,
  completedActivities,
  upcomingActivities
}: VolunteerDashboardMetricInput): VolunteerDashboardMetric[] => {
  return [
    {
      label: '本月服务时长',
      value: `${monthlyHoursGrowth >= 0 ? '+' : ''}${monthlyHoursGrowth} 小时`,
      detail: `来自首页汇总接口的月度变化`,
      tone: 'green'
    },
    {
      label: '完成活动',
      value: `${completedActivities} 场`,
      detail: `累计参与 ${totalActivities} 场活动中的已完成部分`,
      tone: 'blue'
    },
    {
      label: '待参加活动',
      value: `${upcomingActivities} 场`,
      detail: '来自已报名活动列表的待参加数量',
      tone: 'amber'
    }
  ]
}

export const buildVolunteerHeroDescription = (points: number) => {
  if (points > 0) {
    return `你的服务记录、成长进度和近期任务都在这里。当前已累计 ${points} 积分。`
  }

  return '你的服务记录、成长进度和近期任务都在这里。新的服务完成后，积分会同步更新。'
}

export const buildVolunteerHeroHighlights = ({
  volunteerLevel,
  levelProgressPercentage,
  serviceCount,
  upcomingActivities
}: {
  volunteerLevel: number
  levelProgressPercentage: number
  serviceCount: number
  upcomingActivities: number
}): VolunteerHeroHighlight[] => {
  return [
    {
      label: '当前等级',
      value: `Lv.${volunteerLevel}`,
      detail: `当前等级进度 ${levelProgressPercentage}%`,
      progressPercentage: levelProgressPercentage
    },
    {
      label: '累计服务',
      value: `${serviceCount} 次`,
      detail: '来自个人资料接口的累计服务次数'
    },
    {
      label: '本周安排',
      value: `${upcomingActivities} 场`,
      detail: '来自已报名活动列表的待参加数量'
    }
  ]
}

export const buildVolunteerServiceHourFootnotes = ({
  monthlyHoursGrowth,
  serviceCount
}: {
  monthlyHoursGrowth: number
  serviceCount: number
}) => {
  return [
    `本月 ${monthlyHoursGrowth >= 0 ? '+' : ''}${monthlyHoursGrowth}h`,
    serviceCount > 0 ? `已完成 ${serviceCount} 次服务` : '累计服务次数待更新'
  ]
}
