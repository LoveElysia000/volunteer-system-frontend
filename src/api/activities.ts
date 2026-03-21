import { http } from './request'
import type {
  ActivityActionResult,
  ActivityCheckInRequest,
  ActivityCheckOutRequest,
  AttendanceCodeInfo,
  AttendanceCodeResetData,
  AttendanceCodeResetRequest,
  AttendanceCodesGenerateRequest,
  CancelOrganizationActivityRequest,
  CreateOrganizationActivityData,
  CreateOrganizationActivityRequest,
  OrganizationActivityActionResponse,
  SupplementAttendanceData,
  SupplementAttendanceRequest,
  ActivityDetailData,
  ActivityListData,
  ActivityListItem,
  ActivityListRequest,
  MyActivitiesData,
  MyActivitiesRequest,
  MyActivityItem,
  UpdateOrganizationActivityRequest,
  VolunteerActivityViewItem
} from '@/types/activity'

interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

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

const resolveTag = (status: number, orgName?: string, signupStatus?: number) => {
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
  myItem?: MyActivityItem
): VolunteerActivityViewItem => {
  const isRegistered = Boolean(myItem || item.isRegistered)

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    startAt: item.startTime,
    date: formatMonthDayTime(item.startTime),
    location: item.location,
    participants: item.currentPeople,
    capacity: item.maxPeople,
    duration: item.duration,
    status: resolveVolunteerStatus(item.status, isRegistered, myItem?.signupStatus),
    userRegistrationStatus: isRegistered ? 'registered' : 'not_registered',
    tag: resolveTag(item.status, myItem?.orgName, myItem?.signupStatus),
    orgName: myItem?.orgName,
    signupStatus: myItem?.signupStatus,
    grantedHours: myItem?.grantedHours,
    auditReason: myItem?.auditReason
  }
}

export const mapMyActivityItemToVolunteerView = (item: MyActivityItem): VolunteerActivityViewItem => ({
  id: item.id,
  title: item.title,
  description: item.description,
  startAt: item.startTime,
  date: formatMonthDayTime(item.startTime),
  location: item.location,
  participants: item.currentPeople,
  capacity: item.maxPeople,
  duration: item.duration,
  status: resolveVolunteerStatus(item.status, true, item.signupStatus),
  userRegistrationStatus: item.signupStatus === SIGNUP_STATUS.CANCELLED ? 'not_registered' : 'registered',
  tag: resolveTag(item.status, item.orgName, item.signupStatus),
  orgName: item.orgName,
  signupStatus: item.signupStatus,
  grantedHours: item.grantedHours,
  auditReason: item.auditReason
})

export const activitiesApi = {
  list: (data: ActivityListRequest): Promise<ApiResponse<ActivityListData>> => {
    return http.post<ApiResponse<ActivityListData>>('/api/activities', data)
  },

  detail: (id: number | string): Promise<ApiResponse<ActivityDetailData>> => {
    return http.get<ApiResponse<ActivityDetailData>>(`/api/activities/${id}`)
  },

  signup: (activityId: number): Promise<ApiResponse<ActivityActionResult>> => {
    return http.post<ApiResponse<ActivityActionResult>>('/api/activities/signup', { activityId })
  },

  cancel: (activityId: number): Promise<ApiResponse<ActivityActionResult>> => {
    return http.post<ApiResponse<ActivityActionResult>>('/api/activities/cancel', { activityId })
  },

  checkIn: (data: ActivityCheckInRequest): Promise<ApiResponse<ActivityActionResult>> => {
    return http.post<ApiResponse<ActivityActionResult>>('/api/activities/checkin', data)
  },

  checkOut: (data: ActivityCheckOutRequest): Promise<ApiResponse<ActivityActionResult>> => {
    return http.post<ApiResponse<ActivityActionResult>>('/api/activities/checkout', data)
  },

  myActivities: (data: MyActivitiesRequest): Promise<ApiResponse<MyActivitiesData>> => {
    return http.post<ApiResponse<MyActivitiesData>>('/api/activities/my', data)
  },

  create: (data: CreateOrganizationActivityRequest): Promise<ApiResponse<CreateOrganizationActivityData>> => {
    return http.post<ApiResponse<CreateOrganizationActivityData>>('/api/activities/create', data)
  },

  update: (id: number | string, data: UpdateOrganizationActivityRequest): Promise<ApiResponse<OrganizationActivityActionResponse>> => {
    return http.put<ApiResponse<OrganizationActivityActionResponse>>(`/api/activities/${id}`, data)
  },

  remove: (id: number | string): Promise<ApiResponse<OrganizationActivityActionResponse>> => {
    return http.delete<ApiResponse<OrganizationActivityActionResponse>>(`/api/activities/${id}`)
  },

  cancelByOrganization: (id: number | string, data: CancelOrganizationActivityRequest): Promise<ApiResponse<OrganizationActivityActionResponse>> => {
    return http.post<ApiResponse<OrganizationActivityActionResponse>>(`/api/activities/cancel/${id}`, data)
  },

  finishByOrganization: (id: number | string): Promise<ApiResponse<OrganizationActivityActionResponse>> => {
    return http.post<ApiResponse<OrganizationActivityActionResponse>>(`/api/activities/finish/${id}`)
  },

  generateAttendanceCodes: (id: number | string, data: AttendanceCodesGenerateRequest): Promise<ApiResponse<AttendanceCodeInfo>> => {
    return http.post<ApiResponse<AttendanceCodeInfo>>(`/api/activities/attendance-codes/generate/${id}`, data)
  },

  resetAttendanceCode: (id: number | string, data: AttendanceCodeResetRequest): Promise<ApiResponse<AttendanceCodeResetData>> => {
    return http.post<ApiResponse<AttendanceCodeResetData>>(`/api/activities/attendance-codes/reset/${id}`, data)
  },

  getAttendanceCodes: (id: number | string): Promise<ApiResponse<AttendanceCodeInfo>> => {
    return http.get<ApiResponse<AttendanceCodeInfo>>(`/api/activities/attendance-codes/${id}`)
  },

  supplementAttendance: (data: SupplementAttendanceRequest): Promise<ApiResponse<SupplementAttendanceData>> => {
    return http.post<ApiResponse<SupplementAttendanceData>>('/api/activities/supplement-attendance', data)
  }
}
