export enum MembershipStatus {
  PENDING = 1,
  ACTIVE = 2,
  REJECTED = 3,
  LEFT = 4
}

export enum MembershipRole {
  MEMBER = 1,
  ADMIN = 2,
  OWNER = 3
}

export interface MemberInfo {
  membershipId: number
  volunteerId: number
  volunteerName: string
  volunteerCode: string
  organizationId: number
  organizationName: string
  status: MembershipStatus
  role: MembershipRole
  position: string
  motivation: string
  expectedHours: string
  joinDate: string
  reviewDate: string
  reviewComment: string
  leaveDate: string
  leaveReason: string
  createdAt: string
  updatedAt: string
}

export interface OrganizationMembersParams {
  organizationId: number
  status?: MembershipStatus
  role?: MembershipRole
  keyword?: string
  page: number
  pageSize: number
}

export interface OrganizationMembersData {
  total: number
  list: MemberInfo[]
}

export interface OrganizationMemberInfo {
  membershipId: number
  organizationId: number
  organizationName: string
  organizationCode: string
  status: MembershipStatus
  role: MembershipRole
  position: string
  joinDate: string
  reviewDate: string
  reviewComment: string
  createdAt: string
  updatedAt: string
}

export interface VolunteerJoinRequest {
  organizationId: number
}

export interface VolunteerJoinData {
  membershipId: number
  status: MembershipStatus
  message: string
}

export interface VolunteerLeaveRequest {
  membershipId: number
  reason?: string
}

export interface VolunteerLeaveData {
  message: string
}

export interface VolunteerOrganizationsParams {
  status?: MembershipStatus
  page: number
  pageSize: number
}

export interface VolunteerOrganizationsData {
  total: number
  list: OrganizationMemberInfo[]
}

export interface MembershipStatsData {
  pendingCount: number
  activeCount: number
  inactiveCount: number
  suspendedCount: number
  totalCount: number
}

export interface MembershipStatsParams {
  organizationId: number
}

export interface UpdateMembershipStatusRequest {
  membershipId: number
  status: MembershipStatus
  reviewComment?: string
}

export interface UpdateMembershipStatusData {
  message: string
}
