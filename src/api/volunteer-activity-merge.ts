import type {
  ActivityListItem,
  VolunteerActivityViewItem
} from '../types/activity'

const ACTIVITY_STATUS = {
  OPEN: 1,
  ENDED: 2,
  CANCELLED: 3
} as const

const SIGNUP_STATUS = {
  PENDING: 1,
  SUCCESS: 2,
  REJECTED: 3,
  CANCELLED: 4
} as const

const formatMonthDayTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const resolveVolunteerStatus = (
  status: number,
  isRegistered: boolean,
  signupStatus?: number
): VolunteerActivityViewItem['status'] => {
  if (status === ACTIVITY_STATUS.ENDED || status === ACTIVITY_STATUS.CANCELLED) {
    return 'completed'
  }

  if (isRegistered || signupStatus === SIGNUP_STATUS.PENDING || signupStatus === SIGNUP_STATUS.SUCCESS) {
    return 'registered'
  }

  return 'upcoming'
}

const resolveTag = (
  status: number,
  orgName?: string,
  signupStatus?: number
) => {
  if (status === ACTIVITY_STATUS.CANCELLED) {
    return '已取消'
  }

  if (status === ACTIVITY_STATUS.ENDED) {
    return '已结束'
  }

  if (signupStatus === SIGNUP_STATUS.PENDING) {
    return '待审核'
  }

  if (signupStatus === SIGNUP_STATUS.REJECTED) {
    return '已驳回'
  }

  return orgName || '活动任务'
}

export const mapActivityItemToVolunteerView = (
  item: ActivityListItem,
  registrationItem?: ActivityListItem
): VolunteerActivityViewItem => {
  const mergedItem = registrationItem ?? item
  const isRegistered = Boolean(registrationItem || item.isRegistered)

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    startAt: item.startTime,
    date: formatMonthDayTime(item.startTime),
    signupTime: mergedItem.signupTime,
    location: item.location,
    participants: item.currentPeople,
    capacity: item.maxPeople,
    duration: item.duration,
    activityStatus: item.status,
    status: resolveVolunteerStatus(item.status, isRegistered, mergedItem.signupStatus),
    userRegistrationStatus: isRegistered ? 'registered' : 'not_registered',
    tag: resolveTag(item.status, mergedItem.orgName, mergedItem.signupStatus),
    orgName: mergedItem.orgName,
    signupStatus: mergedItem.signupStatus,
    grantedHours: mergedItem.grantedHours,
    auditReason: mergedItem.auditReason
  }
}

export const mapRegisteredActivityItemToVolunteerView = (item: ActivityListItem): VolunteerActivityViewItem => ({
  id: item.id,
  title: item.title,
  description: item.description,
  startAt: item.startTime,
  date: formatMonthDayTime(item.startTime),
  signupTime: item.signupTime,
  location: item.location,
  participants: item.currentPeople,
  capacity: item.maxPeople,
  duration: item.duration,
  activityStatus: item.status,
  status: resolveVolunteerStatus(item.status, item.signupStatus !== SIGNUP_STATUS.CANCELLED, item.signupStatus),
  userRegistrationStatus: item.signupStatus === SIGNUP_STATUS.CANCELLED ? 'not_registered' : 'registered',
  tag: resolveTag(item.status, item.orgName, item.signupStatus),
  orgName: item.orgName,
  signupStatus: item.signupStatus,
  grantedHours: item.grantedHours,
  auditReason: item.auditReason
})

export const mergeVolunteerActivityRows = (
  activities: ActivityListItem[],
  registeredActivities: ActivityListItem[]
) => {
  const registrationMap = new Map(registeredActivities.map(item => [item.id, item]))
  const mergedRows = activities.map(item =>
    mapActivityItemToVolunteerView(item, registrationMap.get(item.id))
  )

  const missingRegisteredRows = registeredActivities
    .filter(item => !activities.some(activity => activity.id === item.id))
    .map(mapRegisteredActivityItemToVolunteerView)

  return [...mergedRows, ...missingRegisteredRows]
}
