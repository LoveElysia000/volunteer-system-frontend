export type EmptyObjectData = Record<string, never>

export enum VolunteerStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  OTHER = 3
}

export enum VolunteerAuditStatus {
  UNVERIFIED = 0,
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3
}

export interface VolunteerHomeSummaryStats {
  points: number
  hours: number
  activityCount: number
}

export interface VolunteerHomeSummaryData {
  nickname: string
  level: number
  stats: VolunteerHomeSummaryStats
  monthlyGrowth: number
  needHoursToNextLevel: number
}

export interface VolunteerProfileInfo {
  id: number
  accountId: number
  realName: string
  gender: number
  birthday: string
  idCard: string
  avatarUrl: string
  introduction: string
  totalHours: number
  serviceCount: number
  creditScore: number
  auditStatus: VolunteerAuditStatus
  createdAt: string
  updatedAt: string
  status: VolunteerStatus
}

export interface VolunteerProfileData {
  volunteer: VolunteerProfileInfo
}

export interface UpdateVolunteerProfileRequest {
  realName?: string
  gender?: number
  birthday?: string
  avatarUrl?: string
  introduction?: string
}

export interface VolunteerRealNameSubmitRequest {
  realName: string
  idCard: string
}

export interface VolunteerRealNameSubmitData {
  auditId: number
  status: VolunteerAuditStatus
}
