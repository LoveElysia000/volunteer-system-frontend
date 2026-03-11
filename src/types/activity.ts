export interface Activity {
  id: number
  title: string
  description: string
  type: 'cleaning' | 'planting' | 'education' | 'other'
  location: string
  latitude?: number
  longitude?: number
  startTime: string
  endTime: string
  maxParticipants: number
  currentParticipants: number
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
  organizerId: number
  pointsReward: number
  requirements?: string
  contactInfo?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ActivityFilters {
  type?: string
  status?: string
  location?: string
  dateRange?: {
    start: string
    end: string
  }
}
