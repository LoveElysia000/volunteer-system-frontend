export enum AuditTargetType {
  VOLUNTEER_REAL_NAME = 1,
  ORGANIZATION = 2,
  MEMBERSHIP = 3,
  ACTIVITY_SIGNUP = 4
}

export enum AuditStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3
}

export enum AuditDecisionAction {
  APPROVE = 1,
  REJECT = 2
}

export interface PendingAuditItem {
  id: number
  targetType: AuditTargetType
  targetId: number
  title: string
  subTitle: string
  creatorId: number
  createdAt: string
  isOverdue: boolean
}

export interface PendingAuditsRequest {
  targetTypes?: AuditTargetType[]
  status?: AuditStatus[]
  keyword?: string
  page: number
  pageSize: number
  createdFrom?: string
  createdTo?: string
  slaHours?: number
}

export interface PendingAuditsData {
  total: number
  list: PendingAuditItem[]
}

export interface AuditRecordDetail {
  id: number
  targetType: AuditTargetType
  targetId: number
  auditorId: number
  status: AuditStatus
  oldContent: string
  newContent: string
  auditResult: AuditDecisionAction
  rejectReason: string
  auditTime: string
  createdAt: string
}

export interface AuditRecordDetailData {
  record: AuditRecordDetail
}

export interface AuditDecisionRequest {
  id: number
  reason?: string
}
