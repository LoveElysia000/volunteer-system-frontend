import { http } from './request'
import { createActivitiesApi } from './activities-client'
import {
  mapActivityItemToVolunteerView,
  mapRegisteredActivityItemToVolunteerView,
  mergeVolunteerActivityRows
} from './volunteer-activity-merge'
import type { ApiResponse } from './types'
import type {
  ActivityActionResult,
  ActivityCheckInRequest,
  ActivityCheckOutRequest,
  ActivityStatus,
  AttendanceCodeInfo,
  AttendanceCodeResetData,
  AttendanceCodeResetRequest,
  AttendanceCodeType,
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
  UpdateOrganizationActivityRequest,
  OrganizationManagementActivityItem
} from '@/types/activity'

const ACTIVITY_STATUS = {
  OPEN: 1 as ActivityStatus,
  ENDED: 2 as ActivityStatus,
  CANCELLED: 3 as ActivityStatus
} as const

export const ATTENDANCE_CODE_TYPE = {
  CHECK_IN: 1 as AttendanceCodeType,
  CHECK_OUT: 2 as AttendanceCodeType
} as const

export const mapActivityItemToOrganizationManagementView = (
  item: ActivityListItem
): OrganizationManagementActivityItem => ({
  id: item.id,
  orgId: item.orgId,
  orgName: item.orgName,
  title: item.title,
  description: item.description,
  date: item.startTime.slice(0, 10),
  startTime: item.startTime,
  endTime: item.endTime,
  location: item.location,
  address: '',
  status: item.status === ACTIVITY_STATUS.OPEN ? '进行中' : item.status === ACTIVITY_STATUS.ENDED ? '已结束' : '已取消',
  statusClass: item.status === ACTIVITY_STATUS.OPEN
    ? 'bg-green-100 text-green-800'
    : item.status === ACTIVITY_STATUS.ENDED
      ? 'bg-gray-100 text-gray-800'
      : 'bg-red-100 text-red-700',
  participants: item.currentPeople,
  maxPeople: item.maxPeople,
  duration: item.duration
})

const activitiesClient = createActivitiesApi(http)

export const activitiesApi = {
  list: (data: ActivityListRequest): Promise<ApiResponse<ActivityListData>> => activitiesClient.list<ApiResponse<ActivityListData>>(data),

  detail: (id: number): Promise<ApiResponse<ActivityDetailData>> => activitiesClient.detail<ApiResponse<ActivityDetailData>>(id),

  signup: (activityId: number): Promise<ApiResponse<ActivityActionResult>> => activitiesClient.signup<ApiResponse<ActivityActionResult>>(activityId),

  cancel: (activityId: number): Promise<ApiResponse<ActivityActionResult>> => activitiesClient.cancel<ApiResponse<ActivityActionResult>>(activityId),

  checkIn: (data: ActivityCheckInRequest): Promise<ApiResponse<ActivityActionResult>> => activitiesClient.checkIn<ApiResponse<ActivityActionResult>>(data),

  checkOut: (data: ActivityCheckOutRequest): Promise<ApiResponse<ActivityActionResult>> => activitiesClient.checkOut<ApiResponse<ActivityActionResult>>(data),

  listRegisteredActivities: (data: ActivityListRequest): Promise<ApiResponse<ActivityListData>> => activitiesClient.listRegisteredActivities<ApiResponse<ActivityListData>>(data),

  create: (data: CreateOrganizationActivityRequest): Promise<ApiResponse<CreateOrganizationActivityData>> => activitiesClient.create<ApiResponse<CreateOrganizationActivityData>>(data),

  update: (id: number, data: UpdateOrganizationActivityRequest): Promise<ApiResponse<OrganizationActivityActionResponse>> => activitiesClient.update<ApiResponse<OrganizationActivityActionResponse>>(id, data),

  remove: (id: number): Promise<ApiResponse<OrganizationActivityActionResponse>> => activitiesClient.remove<ApiResponse<OrganizationActivityActionResponse>>(id),

  cancelByOrganization: (id: number, data: CancelOrganizationActivityRequest): Promise<ApiResponse<OrganizationActivityActionResponse>> => activitiesClient.cancelByOrganization<ApiResponse<OrganizationActivityActionResponse>>(id, data),

  finishByOrganization: (id: number): Promise<ApiResponse<OrganizationActivityActionResponse>> => activitiesClient.finishByOrganization<ApiResponse<OrganizationActivityActionResponse>>(id),

  generateAttendanceCodes: (id: number, data: AttendanceCodesGenerateRequest): Promise<ApiResponse<AttendanceCodeInfo>> => activitiesClient.generateAttendanceCodes<ApiResponse<AttendanceCodeInfo>>(id, data),

  resetAttendanceCode: (id: number, data: AttendanceCodeResetRequest): Promise<ApiResponse<AttendanceCodeResetData>> => activitiesClient.resetAttendanceCode<ApiResponse<AttendanceCodeResetData>>(id, data),

  getAttendanceCodes: (id: number): Promise<ApiResponse<AttendanceCodeInfo>> => activitiesClient.getAttendanceCodes<ApiResponse<AttendanceCodeInfo>>(id),

  supplementAttendance: (data: SupplementAttendanceRequest): Promise<ApiResponse<SupplementAttendanceData>> => activitiesClient.supplementAttendance<ApiResponse<SupplementAttendanceData>>(data)
}

export {
  mapActivityItemToVolunteerView,
  mapRegisteredActivityItemToVolunteerView,
  mergeVolunteerActivityRows
}
