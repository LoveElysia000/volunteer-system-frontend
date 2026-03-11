import type { Activity } from '@/types/activity'

export type VolunteerTone = 'green' | 'blue' | 'amber' | 'slate' | 'rose'

export interface VolunteerActivityItem {
  id: number
  title: string
  description: string
  startAt: string
  date: string
  location: string
  participants: number
  capacity: number
  duration: number
  points: number
  status: 'upcoming' | 'registered' | 'completed'
  userRegistrationStatus: 'registered' | 'not_registered'
  tag?: string
}

export interface VolunteerRecordItem {
  id: number
  activityName: string
  location: string
  date: string
  hours: number
  points: number
  status: 'completed' | 'pending' | 'cancelled'
  highlight?: string
}

export interface VolunteerBadgeItem {
  id: number
  name: string
  description: string
  earned: boolean
  progress?: string
}

export interface VolunteerReviewItem {
  id: number
  activityName: string
  reviewer: string
  date: string
  rating: number
  comment: string
  tag: string
}

export interface VolunteerRankItem {
  id: number
  name: string
  score: number
  hours: number
  streak: string
}

export interface VolunteerRecordEntity {
  id: number
  activityId: number
  verifiedHours: number
  awardedPoints: number
  reviewStatus: 'completed' | 'pending' | 'cancelled'
  completedAt: string
  note?: string
}

interface VolunteerRegistrationEntity {
  activityId: number
  registrationStatus: 'registered' | 'cancelled'
}

const activityEntities: Activity[] = [
  {
    id: 1,
    title: '社区垃圾分类指导活动',
    description: '协助社区居民完成分类投放指导，并记录高频误投点位。',
    type: 'education',
    location: '朝阳社区中心',
    startTime: '2026-03-18T09:00:00+08:00',
    endTime: '2026-03-18T12:00:00+08:00',
    maxParticipants: 30,
    currentParticipants: 15,
    status: 'ongoing',
    organizerId: 101,
    pointsReward: 30,
    createdAt: '2026-03-01T10:00:00+08:00',
    updatedAt: '2026-03-10T10:00:00+08:00'
  },
  {
    id: 2,
    title: '城市公园清洁行动',
    description: '清理步道与湖岸可见垃圾，配合现场环保打卡宣传。',
    type: 'cleaning',
    location: '人民公园',
    startTime: '2026-03-20T14:00:00+08:00',
    endTime: '2026-03-20T16:00:00+08:00',
    maxParticipants: 20,
    currentParticipants: 8,
    status: 'published',
    organizerId: 102,
    pointsReward: 20,
    createdAt: '2026-03-02T09:00:00+08:00',
    updatedAt: '2026-03-10T09:00:00+08:00'
  },
  {
    id: 3,
    title: '环保知识流动讲座',
    description: '面向居民讲解节能、低碳出行与日常环保实践。',
    type: 'education',
    location: '环保教育中心',
    startTime: '2026-03-22T10:00:00+08:00',
    endTime: '2026-03-22T12:00:00+08:00',
    maxParticipants: 50,
    currentParticipants: 12,
    status: 'published',
    organizerId: 103,
    pointsReward: 15,
    createdAt: '2026-03-03T11:00:00+08:00',
    updatedAt: '2026-03-09T11:00:00+08:00'
  },
  {
    id: 4,
    title: '春季植树造林活动',
    description: '参与栽种与围护工作，协助记录苗木编号与区域分布。',
    type: 'planting',
    location: '西山森林公园',
    startTime: '2026-03-08T08:00:00+08:00',
    endTime: '2026-03-08T12:00:00+08:00',
    maxParticipants: 30,
    currentParticipants: 30,
    status: 'completed',
    organizerId: 104,
    pointsReward: 40,
    createdAt: '2026-02-25T08:00:00+08:00',
    updatedAt: '2026-03-08T18:00:00+08:00'
  },
  {
    id: 5,
    title: '社区旧物循环市集',
    description: '负责摊位引导、回收登记与以旧换新互动说明。',
    type: 'other',
    location: '望京青年广场',
    startTime: '2026-03-24T13:30:00+08:00',
    endTime: '2026-03-24T16:30:00+08:00',
    maxParticipants: 24,
    currentParticipants: 18,
    status: 'published',
    organizerId: 105,
    pointsReward: 28,
    createdAt: '2026-03-04T08:00:00+08:00',
    updatedAt: '2026-03-10T08:00:00+08:00'
  }
]

const formatMonthDay = (value: string) => {
  const date = new Date(value)
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const activityStatusMap: Record<Activity['status'], VolunteerActivityItem['status']> = {
  draft: 'upcoming',
  published: 'upcoming',
  ongoing: 'upcoming',
  completed: 'completed',
  cancelled: 'completed'
}

const activityTagMap: Record<Activity['type'], string> = {
  cleaning: '环境清洁',
  planting: '生态修复',
  education: '宣传倡导',
  other: '综合协作'
}

const getDurationHours = (activity: Activity) => {
  const start = new Date(activity.startTime).getTime()
  const end = new Date(activity.endTime).getTime()
  return Math.max(Math.round((end - start) / 3600000), 1)
}

const registrationEntities: VolunteerRegistrationEntity[] = [
  { activityId: 1, registrationStatus: 'registered' }
]

const registrationMap = new Map(
  registrationEntities.map((registration) => [registration.activityId, registration.registrationStatus])
)

const mapActivityToCard = (activity: Activity): VolunteerActivityItem => ({
  id: activity.id,
  title: activity.title,
  description: activity.description,
  startAt: activity.startTime,
  date: formatMonthDay(activity.startTime),
  location: activity.location,
  participants: activity.currentParticipants,
  capacity: activity.maxParticipants,
  duration: getDurationHours(activity),
  points: activity.pointsReward,
  status: activityStatusMap[activity.status],
  userRegistrationStatus: registrationMap.get(activity.id) === 'registered' ? 'registered' : 'not_registered',
  tag: activity.status === 'completed' ? '已完成' : activityTagMap[activity.type]
})

export const volunteerActivities = activityEntities.map(mapActivityToCard)
export const recommendedActivities = volunteerActivities.filter((item) => item.status !== 'completed').slice(0, 3)
export const registeredActivities = volunteerActivities.filter((item) => item.userRegistrationStatus === 'registered')
export const historyActivities = volunteerActivities.filter((item) => item.status === 'completed')

const recordEntities: VolunteerRecordEntity[] = [
  {
    id: 1,
    activityId: 1,
    verifiedHours: 3,
    awardedPoints: 30,
    reviewStatus: 'completed',
    completedAt: '2026-03-04T18:00:00+08:00',
    note: '现场反馈积极'
  },
  {
    id: 2,
    activityId: 2,
    verifiedHours: 2,
    awardedPoints: 20,
    reviewStatus: 'completed',
    completedAt: '2026-02-26T17:00:00+08:00',
    note: '按时签到'
  },
  {
    id: 3,
    activityId: 3,
    verifiedHours: 4,
    awardedPoints: 38,
    reviewStatus: 'pending',
    completedAt: '2026-02-18T16:00:00+08:00',
    note: '待组织确认'
  },
  {
    id: 4,
    activityId: 5,
    verifiedHours: 2,
    awardedPoints: 18,
    reviewStatus: 'completed',
    completedAt: '2026-02-09T15:00:00+08:00',
    note: '新增居民 16 人参与'
  }
]

const activityEntityMap = new Map(activityEntities.map((activity) => [activity.id, activity]))

export const volunteerRecords: VolunteerRecordItem[] = recordEntities.map((record) => {
  const activity = activityEntityMap.get(record.activityId)
  return {
    id: record.id,
    activityName: activity?.title || '未知活动',
    location: activity?.location || '待确认地点',
    date: record.completedAt.slice(0, 10),
    hours: record.verifiedHours,
    points: record.awardedPoints,
    status: record.reviewStatus,
    highlight: record.note
  }
})

export const volunteerBadges: VolunteerBadgeItem[] = [
  { id: 1, name: '环保新星', description: '完成首次志愿服务', earned: true, progress: '已获得' },
  { id: 2, name: '热心志愿者', description: '累计参与 5 次活动', earned: true, progress: '已获得' },
  { id: 3, name: '时长进阶者', description: '累计服务 20 小时', earned: false, progress: '16 / 20 小时' },
  { id: 4, name: '社区影响者', description: '推动 50 人参与环保行动', earned: false, progress: '34 / 50 人' },
  { id: 5, name: '自然守护者', description: '完成 3 次生态修复活动', earned: true, progress: '已获得' },
  { id: 6, name: '稳定出勤', description: '连续 4 周保持服务记录', earned: false, progress: '3 / 4 周' }
]

export const volunteerReviews: VolunteerReviewItem[] = [
  {
    id: 1,
    activityName: '社区垃圾分类指导活动',
    reviewer: '朝阳社区项目组',
    date: '2026-03-05',
    rating: 5,
    comment: '沟通主动，能独立完成引导与答疑，现场秩序维护稳定。',
    tag: '表现突出'
  },
  {
    id: 2,
    activityName: '河岸巡护清理',
    reviewer: '城市绿水计划',
    date: '2026-02-27',
    rating: 4,
    comment: '执行稳定，建议后续继续参与物资登记工作。',
    tag: '稳定可靠'
  }
]

export const leaderboard: VolunteerRankItem[] = [
  { id: 1, name: '林晨', score: 1480, hours: 62, streak: '连续 7 周' },
  { id: 2, name: '赵可', score: 1360, hours: 58, streak: '连续 6 周' },
  { id: 3, name: '你', score: 1240, hours: 41, streak: '连续 4 周' },
  { id: 4, name: '陈沐', score: 1180, hours: 39, streak: '连续 3 周' },
  { id: 5, name: '孙泽', score: 1110, hours: 35, streak: '连续 5 周' }
]

export const achievementFeed = [
  { id: 1, name: '你', action: '完成了垃圾分类指导活动', context: '新增 30 积分', tone: 'green' as VolunteerTone },
  { id: 2, name: '绿城小队', action: '达成了本月减碳挑战', context: '团队排名上升 2 位', tone: 'blue' as VolunteerTone },
  { id: 3, name: '朝阳社区项目组', action: '发布了新的河岸巡护任务', context: '还剩 5 个名额', tone: 'amber' as VolunteerTone }
]

export const monthlyMetrics = [
  { label: '本月服务时长', value: '12 小时', detail: '较上月 +4 小时', tone: 'green' as VolunteerTone },
  { label: '完成活动', value: '4 场', detail: '2 场已完成，2 场待参加', tone: 'blue' as VolunteerTone },
  { label: '积分增长', value: '+92', detail: '距离下一级还差 108 分', tone: 'amber' as VolunteerTone }
]

export const notificationChannels = [
  { key: 'system', label: '系统更新', description: '账户安全、策略变更和重要公告。', enabled: true },
  { key: 'activity', label: '活动提醒', description: '报名成功、行前提醒和活动变更。', enabled: true },
  { key: 'community', label: '社区动态', description: '团队成就、排行榜变动和互动消息。', enabled: false },
  { key: 'sms', label: '短信通知', description: '仅发送临近活动和紧急调整。', enabled: true }
]
