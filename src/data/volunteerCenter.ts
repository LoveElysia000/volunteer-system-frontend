export type VolunteerTone = 'green' | 'blue' | 'amber' | 'slate' | 'rose'

export interface VolunteerActivityItem {
  id: number
  title: string
  description: string
  startAt: string
  date: string
  location: string
  participants: number
  capacity: number
  duration: number
  points: number
  status: 'upcoming' | 'registered' | 'completed'
  userRegistrationStatus: 'registered' | 'not_registered'
  tag?: string
}

export interface VolunteerRecordItem {
  id: number
  activityName: string
  location: string
  date: string
  hours: number
  points: number
  status: 'completed' | 'pending' | 'cancelled'
  highlight?: string
}

export interface VolunteerBadgeItem {
  id: number
  name: string
  description: string
  earned: boolean
  progress?: string
}

export interface VolunteerReviewItem {
  id: number
  activityName: string
  reviewer: string
  date: string
  rating: number
  comment: string
  tag: string
}

export interface VolunteerRankItem {
  id: number
  name: string
  score: number
  hours: number
  streak: string
}

export const volunteerActivities: VolunteerActivityItem[] = []
export const recommendedActivities: VolunteerActivityItem[] = []
export const registeredActivities: VolunteerActivityItem[] = []
export const historyActivities: VolunteerActivityItem[] = []
export const volunteerRecords: VolunteerRecordItem[] = []
export const volunteerBadges: VolunteerBadgeItem[] = []
export const volunteerReviews: VolunteerReviewItem[] = []
export const leaderboard: VolunteerRankItem[] = []

export const achievementFeed: Array<{
  id: number
  name: string
  action: string
  context: string
  tone: VolunteerTone
}> = []

export const monthlyMetrics: Array<{
  label: string
  value: string
  detail: string
  tone: VolunteerTone
}> = []

export const notificationChannels: Array<{
  key: string
  label: string
  description: string
  enabled: boolean
}> = []
