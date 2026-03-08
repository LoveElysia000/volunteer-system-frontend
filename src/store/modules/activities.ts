import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Activity {
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

interface ActivityFilters {
  type?: string
  status?: string
  location?: string
  dateRange?: {
    start: string
    end: string
  }
}

export const useActivitiesStore = defineStore('activities', () => {
  // 状态
  const activities = ref<Activity[]>([])
  const currentActivity = ref<Activity | null>(null)
  const filters = ref<ActivityFilters>({})
  const loading = ref(false)

  // Actions
  const fetchActivities = async (newFilters?: ActivityFilters) => {
    loading.value = true

    // 模拟API调用
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        activities.value = [
          {
            id: 1,
            title: '公园清洁活动',
            description: '一起来清理公园垃圾，保护环境',
            type: 'cleaning',
            location: '中央公园',
            startTime: '2026-01-20T09:00:00Z',
            endTime: '2026-01-20T12:00:00Z',
            maxParticipants: 50,
            currentParticipants: 25,
            status: 'published',
            organizerId: 1,
            pointsReward: 10,
            createdAt: '2026-01-10T10:00:00Z',
            updatedAt: '2026-01-10T10:00:00Z'
          }
        ]
        loading.value = false
        resolve()
      }, 500)
    })
  }

  const fetchActivity = async (id: number) => {
    loading.value = true

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        currentActivity.value = {
          id,
          title: '公园清洁活动',
          description: '一起来清理公园垃圾，保护环境',
          type: 'cleaning',
          location: '中央公园',
          startTime: '2026-01-20T09:00:00Z',
          endTime: '2026-01-20T12:00:00Z',
          maxParticipants: 50,
          currentParticipants: 25,
          status: 'published',
          organizerId: 1,
          pointsReward: 10,
          createdAt: '2026-01-10T10:00:00Z',
          updatedAt: '2026-01-10T10:00:00Z'
        }
        loading.value = false
        resolve()
      }, 500)
    })
  }

  const createActivity = async (activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => {
    // 模拟创建活动
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  }

  const registerActivity = async (activityId: number) => {
    // 模拟报名活动
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })
  }

  const updateFilters = (newFilters: ActivityFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  return {
    // 状态
    activities,
    currentActivity,
    filters,
    loading,

    // Actions
    fetchActivities,
    fetchActivity,
    createActivity,
    registerActivity,
    updateFilters
  }
})