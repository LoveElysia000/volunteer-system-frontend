export interface VolunteerSummaryStats {
  totalHours?: number
  serviceCount?: number
  points?: number
  totalPoints?: number
  completedActivities?: number
  totalActivities?: number
  upcomingActivities?: number
  registeredCount?: number
}

export interface VolunteerMonthlyGrowth {
  hours?: number
  points?: number
}

export interface VolunteerHomeSummaryData {
  nickname?: string
  level?: number
  stats?: VolunteerSummaryStats
  monthlyGrowth?: VolunteerMonthlyGrowth
  needHoursToNextLevel?: number
}

export interface VolunteerProfileData {
  volunteer: {
    id: number
    accountId: number
    realName?: string
    gender?: number
    birthday?: string
    idCard?: string
    avatarUrl?: string
    introduction?: string
    totalHours?: number
    serviceCount?: number
    creditScore?: number
    auditStatus?: number
    createdAt?: string
    updatedAt?: string
    status?: number
  }
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
  status: number
}
