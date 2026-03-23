import {
  ActivitySignupStatus,
  ActivityStatus,
  AttendanceCodeType,
  AttendanceStatus,
  WorkHourStatus
} from '@/types/activity'
import { NotificationReadStatus } from '@/types/notification'
import { OrganizationStatus } from '@/types/organization'
import { VolunteerAuditStatus, VolunteerStatus } from '@/types/volunteer'

export interface StatusOption<T> {
  label: string
  value: T
}

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  [ActivityStatus.OPEN]: '报名中',
  [ActivityStatus.ENDED]: '已结束',
  [ActivityStatus.CANCELLED]: '已取消'
}

export const ACTIVITY_STATUS_OPTIONS: StatusOption<ActivityStatus>[] = [
  { label: ACTIVITY_STATUS_LABELS[ActivityStatus.OPEN], value: ActivityStatus.OPEN },
  { label: ACTIVITY_STATUS_LABELS[ActivityStatus.ENDED], value: ActivityStatus.ENDED },
  { label: ACTIVITY_STATUS_LABELS[ActivityStatus.CANCELLED], value: ActivityStatus.CANCELLED }
]

export const ACTIVITY_SIGNUP_STATUS_LABELS: Record<ActivitySignupStatus, string> = {
  [ActivitySignupStatus.PENDING]: '待审核',
  [ActivitySignupStatus.SUCCESS]: '报名成功',
  [ActivitySignupStatus.REJECTED]: '报名驳回',
  [ActivitySignupStatus.CANCELLED]: '已取消'
}

export const ACTIVITY_SIGNUP_STATUS_OPTIONS: StatusOption<ActivitySignupStatus>[] = [
  { label: ACTIVITY_SIGNUP_STATUS_LABELS[ActivitySignupStatus.PENDING], value: ActivitySignupStatus.PENDING },
  { label: ACTIVITY_SIGNUP_STATUS_LABELS[ActivitySignupStatus.SUCCESS], value: ActivitySignupStatus.SUCCESS },
  { label: ACTIVITY_SIGNUP_STATUS_LABELS[ActivitySignupStatus.REJECTED], value: ActivitySignupStatus.REJECTED },
  { label: ACTIVITY_SIGNUP_STATUS_LABELS[ActivitySignupStatus.CANCELLED], value: ActivitySignupStatus.CANCELLED }
]

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  [AttendanceStatus.NOT_CHECKED]: '未签到',
  [AttendanceStatus.CHECKED]: '已签到'
}

export const CHECK_OUT_STATUS_LABELS: Record<AttendanceStatus, string> = {
  [AttendanceStatus.NOT_CHECKED]: '未签退',
  [AttendanceStatus.CHECKED]: '已签退'
}

export const WORK_HOUR_STATUS_LABELS: Record<WorkHourStatus, string> = {
  [WorkHourStatus.UNSETTLED]: '未结算',
  [WorkHourStatus.GRANTED]: '已发放',
  [WorkHourStatus.VOIDED]: '已作废'
}

export const ATTENDANCE_CODE_TYPE_LABELS: Record<AttendanceCodeType, string> = {
  [AttendanceCodeType.CHECK_IN]: '签到码',
  [AttendanceCodeType.CHECK_OUT]: '签退码'
}

export const NOTIFICATION_READ_STATUS_LABELS: Record<NotificationReadStatus, string> = {
  [NotificationReadStatus.UNREAD]: '未读',
  [NotificationReadStatus.READ]: '已读'
}

export const NOTIFICATION_READ_STATUS_OPTIONS: StatusOption<NotificationReadStatus>[] = [
  { label: NOTIFICATION_READ_STATUS_LABELS[NotificationReadStatus.UNREAD], value: NotificationReadStatus.UNREAD },
  { label: NOTIFICATION_READ_STATUS_LABELS[NotificationReadStatus.READ], value: NotificationReadStatus.READ }
]

export const ORGANIZATION_STATUS_LABELS: Record<OrganizationStatus, string> = {
  [OrganizationStatus.DISABLED]: '停用',
  [OrganizationStatus.ACTIVE]: '正常'
}

export const ORGANIZATION_STATUS_OPTIONS: StatusOption<OrganizationStatus>[] = [
  { label: ORGANIZATION_STATUS_LABELS[OrganizationStatus.DISABLED], value: OrganizationStatus.DISABLED },
  { label: ORGANIZATION_STATUS_LABELS[OrganizationStatus.ACTIVE], value: OrganizationStatus.ACTIVE }
]

export const VOLUNTEER_STATUS_LABELS: Record<VolunteerStatus, string> = {
  [VolunteerStatus.ACTIVE]: '活跃',
  [VolunteerStatus.INACTIVE]: '非活跃',
  [VolunteerStatus.OTHER]: '其他'
}

export const VOLUNTEER_STATUS_OPTIONS: StatusOption<VolunteerStatus>[] = [
  { label: VOLUNTEER_STATUS_LABELS[VolunteerStatus.ACTIVE], value: VolunteerStatus.ACTIVE },
  { label: VOLUNTEER_STATUS_LABELS[VolunteerStatus.INACTIVE], value: VolunteerStatus.INACTIVE },
  { label: VOLUNTEER_STATUS_LABELS[VolunteerStatus.OTHER], value: VolunteerStatus.OTHER }
]

export const VOLUNTEER_AUDIT_STATUS_LABELS: Record<VolunteerAuditStatus, string> = {
  [VolunteerAuditStatus.UNVERIFIED]: '未认证',
  [VolunteerAuditStatus.PENDING]: '审核中',
  [VolunteerAuditStatus.APPROVED]: '已通过',
  [VolunteerAuditStatus.REJECTED]: '已驳回'
}

export const VOLUNTEER_AUDIT_STATUS_OPTIONS: StatusOption<VolunteerAuditStatus>[] = [
  { label: VOLUNTEER_AUDIT_STATUS_LABELS[VolunteerAuditStatus.UNVERIFIED], value: VolunteerAuditStatus.UNVERIFIED },
  { label: VOLUNTEER_AUDIT_STATUS_LABELS[VolunteerAuditStatus.PENDING], value: VolunteerAuditStatus.PENDING },
  { label: VOLUNTEER_AUDIT_STATUS_LABELS[VolunteerAuditStatus.APPROVED], value: VolunteerAuditStatus.APPROVED },
  { label: VOLUNTEER_AUDIT_STATUS_LABELS[VolunteerAuditStatus.REJECTED], value: VolunteerAuditStatus.REJECTED }
]
