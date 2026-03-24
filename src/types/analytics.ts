export interface OrganizationAnalyticsQuery {
  orgId: number
  start: string
  end: string
}

export interface OrganizationFunnelData {
  registrationCount: number
  membershipCount: number
  signupCount: number
  attendanceCount: number
  workhourCount: number
  registrationToMembershipRate: number
  membershipToSignupRate: number
  signupToAttendanceRate: number
  attendanceToWorkhourRate: number
  start: string
  end: string
}

export interface OrganizationDashboardAnalyticsData {
  signupCount: number
  approvedSignupCount: number
  attendanceCount: number
  attendanceRate: number
  grantedWorkHours: number
  start: string
  end: string
}
