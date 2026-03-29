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
