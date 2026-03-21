export interface Activity {
  id: number
  title: string
  description: string
  type: 'cleaning' | 'planting' | 'education' | 'other'
  location: string
  latitude?: number
  longitude?: number
  startTime: string
  endTime: string
  maxParticipants: number
  currentParticipants: number
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  organizerId: number
  pointsReward: number
  requirements?: string
  contactInfo?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ActivityFilters {
  type?: string
  status?: string
  location?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface ActivityListRequest {
  page: number
  pageSize: number
  status?: number
  keyword?: string
  startFrom?: string
  startTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ActivityListItem {
  id: number
  title: string
  description: string
  coverUrl?: string
  startTime: string
  endTime: string
  location: string
  duration: number
  maxPeople: number
  currentPeople: number
  status: number
  isRegistered?: boolean
  isFull?: boolean
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
    startTime: string
    endTime: string
    location: string
    address?: string
    duration: number
    maxPeople: number
    currentPeople: number
    status: number
    isRegistered?: boolean
    createdAt?: string
    checkInStatus?: number
    checkInTime?: string
    checkOutStatus?: number
    checkOutTime?: string
    workHourStatus?: number
    grantedHours?: number
  }
}

export interface MyActivitiesRequest {
  page: number
  pageSize: number
  status?: number
}

export interface MyActivityItem {
  id: number
  orgId: number
  orgName?: string
  title: string
  description: string
  coverUrl?: string
  startTime: string
  endTime: string
  location: string
  duration: number
  maxPeople: number
  currentPeople: number
  status: number
  signupTime?: string
  checkInStatus?: number
  checkInTime?: string
  checkOutStatus?: number
  checkOutTime?: string
  workHourStatus?: number
  grantedHours?: number
  signupStatus?: number
  auditReason?: string
}

export interface MyActivitiesData {
  total: number
  list: MyActivityItem[]
}

export interface ActivityActionResult {
  success?: boolean
  checkInTime?: string
  checkOutTime?: string
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
  startTime: string
  endTime: string
  location: string
  address?: string
  duration: number
  maxPeople: number
}

export interface CreateOrganizationActivityData {
  id: number
  message?: string
}

export interface UpdateOrganizationActivityRequest {
  title?: string
  description?: string
  coverUrl?: string
  startTime?: string
  endTime?: string
  location?: string
  address?: string
  duration?: number
  maxPeople?: number
}

export interface OrganizationActivityActionResponse {
  message?: string
}

export interface CancelOrganizationActivityRequest {
  reason: string
}

export interface AttendanceCodesGenerateRequest {
  checkInValidMinutes: number
  checkOutValidMinutes: number
}

export interface AttendanceCodeInfo {
  success?: boolean
  checkInCode?: string
  checkOutCode?: string
  attendanceCodeVersion?: number
  attendanceCodeUpdatedAt?: string
  checkInExpireAt?: string
  checkOutExpireAt?: string
}

export interface AttendanceCodeResetRequest {
  codeType: 'checkin' | 'checkout'
  validMinutes: number
}

export interface AttendanceCodeResetData {
  success?: boolean
  code?: string
  codeType?: string
  attendanceCodeVersion?: number
  attendanceCodeUpdatedAt?: string
  expireAt?: string
}

export interface SupplementAttendanceRequest {
  activityId: number
  volunteerId: number
  checkInTime: string
  checkOutTime: string
  reason: string
}

export interface SupplementAttendanceData {
  success?: boolean
  checkInTime?: string
  checkOutTime?: string
  grantedHours?: number
}

export interface VolunteerActivityViewItem {
  id: number
  title: string
  description: string
  startAt: string
  date: string
  location: string
  participants: number
  capacity: number
  duration: number
  status: 'upcoming' | 'registered' | 'completed'
  userRegistrationStatus: 'registered' | 'not_registered'
  tag?: string
  orgName?: string
  signupStatus?: number
  grantedHours?: number
  auditReason?: string
}
