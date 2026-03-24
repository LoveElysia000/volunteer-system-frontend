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
  gender: number
  birthday: string
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

export interface VolunteerAccountInfo {
  userName: string
  email: string
  phone: string
}

export interface VolunteerVerificationInfo {
  realName: string
  idCard: string
  auditStatus: VolunteerAuditStatus
}

export interface VolunteerProfileData {
  volunteer: VolunteerProfileInfo
  accountInfo: VolunteerAccountInfo
  profile: Pick<VolunteerProfileInfo, 'gender' | 'birthday' | 'avatarUrl' | 'introduction'>
  verification: VolunteerVerificationInfo
}

export interface VolunteerListRequest {
  keyword?: string
  page: number
  pageSize: number
}

export interface VolunteerListItem {
  id: number
  accountId: number
  realName: string
  gender: number
  avatarUrl: string
  totalHours: number
  serviceCount: number
  creditScore: number
  auditStatus: VolunteerAuditStatus
  createdAt: string
  updatedAt: string
  status: VolunteerStatus
}

export interface VolunteerListData {
  total: number
  list: VolunteerListItem[]
}

export interface UpdateVolunteerProfileRequest {
  gender?: number
  birthday?: string
  avatarUrl?: string
  introduction?: string
}

export interface UpdateVolunteerAccountRequest {
  userName?: string
  email?: string
  phone?: string
}

export interface VolunteerRealNameSubmitRequest {
  realName: string
  idCard: string
}

export interface VolunteerRealNameSubmitData {
  auditId: number
  status: VolunteerAuditStatus
}
