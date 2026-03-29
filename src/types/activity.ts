import type { DateOnlyString, DateTimeSecondString } from './datetime'

export interface Activity {
  id: number
  title: string
  description: string
  type: 'cleaning' | 'planting' | 'education' | 'other'
  location: string
  latitude?: number
  longitude?: number
  startTime: DateTimeSecondString
  endTime: DateTimeSecondString
  maxParticipants: number
  currentParticipants: number
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  organizerId: number
  pointsReward: number
  requirements?: string
  contactInfo?: Record<string, any>
  createdAt: DateTimeSecondString
  updatedAt: DateTimeSecondString
}

export interface ActivityFilters {
  type?: string
  status?: string
  location?: string
  dateRange?: {
    start: DateOnlyString
    end: DateOnlyString
  }
}

export enum ActivityStatus {
  OPEN = 1,
  ENDED = 2,
  CANCELLED = 3
}

export enum ActivitySignupStatus {
  PENDING = 1,
  SUCCESS = 2,
  REJECTED = 3,
  CANCELLED = 4
}

export enum AttendanceStatus {
  NOT_CHECKED = 0,
  CHECKED = 1
}

export enum WorkHourStatus {
  UNSETTLED = 0,
  GRANTED = 1,
  VOIDED = 2
}

export interface ActivityListRequest {
  page: number
  pageSize: number
  status?: number[]
  keyword?: string
  startFrom?: DateOnlyString
  startTo?: DateOnlyString
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ActivityListItem {
  id: number
  orgId?: number
  orgName?: string
  title: string
  description: string
  coverUrl?: string
  startTime: DateTimeSecondString
  endTime: DateTimeSecondString
  location: string
  duration: number
  maxPeople: number
  currentPeople: number
  status: ActivityStatus
  isRegistered?: boolean
  isFull?: boolean
  signupTime?: DateTimeSecondString
  checkInStatus?: AttendanceStatus
  checkInTime?: DateTimeSecondString
  checkOutStatus?: AttendanceStatus
  checkOutTime?: DateTimeSecondString
  workHourStatus?: WorkHourStatus
  grantedHours?: number
  signupStatus?: ActivitySignupStatus
  auditReason?: string
}

export interface ActivityListData {
  total: number
  list: ActivityListItem[]
}

export interface ActivityDetailData {
  activity: {
    id: number
    orgId: number
    orgName?: string
    title: string
    description: string
    coverUrl?: string
    startTime: DateTimeSecondString
    endTime: DateTimeSecondString
    location: string
    address?: string
    duration: number
    maxPeople: number
    currentPeople: number
    status: ActivityStatus
    isRegistered?: boolean
    createdAt?: DateTimeSecondString
    checkInStatus?: AttendanceStatus
    checkInTime?: DateTimeSecondString
    checkOutStatus?: AttendanceStatus
    checkOutTime?: DateTimeSecondString
    workHourStatus?: WorkHourStatus
    grantedHours?: number
  }
}

export interface ActivityActionResult {
  success: boolean
  checkInTime?: DateTimeSecondString
  checkOutTime?: DateTimeSecondString
  grantedHours?: number
}

export interface ActivityCheckInRequest {
  activityId: number
  checkInCode: string
}

export interface ActivityCheckOutRequest {
  activityId: number
  checkOutCode: string
}

export interface CreateOrganizationActivityRequest {
  orgId: number
  title: string
  description: string
  coverUrl?: string
  startTime: DateTimeSecondString
  endTime: DateTimeSecondString
  location: string
  address?: string
  duration: number
  maxPeople: number
}

export interface CreateOrganizationActivityData {
  id: number
  message: string
}

export interface UpdateOrganizationActivityRequest {
  title?: string
  description?: string
  coverUrl?: string
  startTime?: DateTimeSecondString
  endTime?: DateTimeSecondString
  location?: string
  address?: string
  duration?: number
  maxPeople?: number
}

export interface OrganizationActivityActionResponse {
  message: string
}

export interface CancelOrganizationActivityRequest {
  reason: string
}

export enum AttendanceCodeType {
  CHECK_IN = 1,
  CHECK_OUT = 2
}

export interface AttendanceCodesGenerateRequest {
  checkInValidMinutes: number
  checkOutValidMinutes: number
}

export interface AttendanceCodeInfo {
  success: boolean
  checkInCode: string
  checkOutCode: string
  attendanceCodeVersion: number
  attendanceCodeUpdatedAt: DateTimeSecondString
  checkInExpireAt: DateTimeSecondString
  checkOutExpireAt: DateTimeSecondString
}

export interface AttendanceCodeResetRequest {
  codeType: AttendanceCodeType
  validMinutes: number
}

export interface AttendanceCodeResetData {
  success: boolean
  code: string
  codeType: AttendanceCodeType
  attendanceCodeVersion: number
  attendanceCodeUpdatedAt: DateTimeSecondString
  expireAt: DateTimeSecondString
}

export interface SupplementAttendanceRequest {
  activityId: number
  volunteerId: number
  checkInTime: DateTimeSecondString
  checkOutTime: DateTimeSecondString
  reason: string
}

export interface SupplementAttendanceData {
  success: boolean
  checkInTime: DateTimeSecondString
  checkOutTime: DateTimeSecondString
  grantedHours: number
}

export interface VolunteerActivityViewItem {
  id: number
  title: string
  description: string
  startAt: string
  date: string
  timeRange: string
  signupTime?: string
  location: string
  participants: number
  capacity: number
  duration: number
  activityStatus: ActivityStatus
  status: 'upcoming' | 'registered' | 'completed'
  userRegistrationStatus: 'registered' | 'not_registered'
  tag?: string
  orgName?: string
  signupStatus?: ActivitySignupStatus
  grantedHours?: number
  auditReason?: string
}

export interface OrganizationManagementActivityItem {
  id: number
  orgId?: number
  orgName?: string
  title: string
  description: string
  date: string
  timeRange: string
  startTime: DateTimeSecondString
  endTime: DateTimeSecondString
  location: string
  address?: string
  status: string
  statusClass: string
  participants: number
  maxPeople: number
  duration: number
}
