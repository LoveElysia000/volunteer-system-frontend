import { computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'

const fallbackMetrics = {
  points: 1240,
  totalHours: 41,
  monthHoursGrowth: 12,
  monthPointsGrowth: 92,
  totalActivities: 8,
  completedActivities: 4,
  upcomingActivities: 2
}

export const useVolunteerMetrics = () => {
  const authStore = useAuthStore()
  const user = computed(() => authStore.user)

  const points = computed(() => user.value?.points ?? fallbackMetrics.points)
  const totalHours = computed(() => user.value?.totalHours ?? fallbackMetrics.totalHours)
  const volunteerLevel = computed(() => Math.floor(totalHours.value / 10) + 1)
  const currentLevelHours = computed(() => totalHours.value % 10)
  const levelProgressPercentage = computed(() => currentLevelHours.value * 10)
  const hoursToNextLevel = computed(() => Math.max(10 - currentLevelHours.value, 0))

  return {
    user,
    points,
    totalHours,
    volunteerLevel,
    currentLevelHours,
    levelProgressPercentage,
    hoursToNextLevel,
    fallbackMetrics
  }
}
