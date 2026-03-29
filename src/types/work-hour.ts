export enum WorkHourOperationType {
  GRANT = 1,
  VOID = 2,
  RECALCULATE = 3
}

export interface WorkHourListRequest {
  page: number
  pageSize: number
  activityId?: number
  signupId?: number
  operationType?: WorkHourOperationType
}

export interface WorkHourLogItem {
  id: number
  volunteerId: number
  activityId: number
  signupId: number
  operationType: WorkHourOperationType
  hoursDelta: number
  serviceCountDelta: number
  beforeTotalHours: number
  afterTotalHours: number
  beforeServiceCount: number
  afterServiceCount: number
  workHourVersion: number
  refLogId: number
  reason: string
  operatorId: number
  idempotencyKey: string
  createdAt: string
}

export interface WorkHourListData {
  total: number
  list: WorkHourLogItem[]
}

export interface VolunteerWorkHoursRequest {
  page?: number
  pageSize?: number
  activityId?: number
  operationTypes?: WorkHourOperationType[]
}

export interface VolunteerWorkHourItem {
  id: number
  activityId: number
  signupId: number
  operationType: WorkHourOperationType
  hoursDelta: number
  beforeTotalHours: number
  afterTotalHours: number
  reason: string
  createdAt: string
}

export interface VolunteerWorkHoursData {
  total: number
  list: VolunteerWorkHourItem[]
}

export interface VoidWorkHourRequest {
  signupId: number
  reason: string
  idempotencyKey: string
}

export interface VoidWorkHourData {
  success: boolean
  workHourLogId: number
}

export interface RecalculateWorkHourRequest {
  signupId: number
  hours: number
  reason: string
  idempotencyKey: string
}

export interface RecalculateWorkHourData {
  success: boolean
  workHourLogId: number
  grantedHours: number
}
