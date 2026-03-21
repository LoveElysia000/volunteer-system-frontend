import { computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { useVolunteerStore } from '@/store/modules/volunteer'

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
  const volunteerStore = useVolunteerStore()
  const user = computed(() => authStore.user)
  const summary = computed(() => volunteerStore.summary)
  const profile = computed(() => volunteerStore.profile)

  const summaryStats = computed(() => summary.value?.stats || {})
  const points = computed(() =>
    summaryStats.value.points ??
    summaryStats.value.totalPoints ??
    user.value?.points ??
    fallbackMetrics.points
  )
  const totalHours = computed(() =>
    summaryStats.value.totalHours ??
    profile.value?.totalHours ??
    user.value?.totalHours ??
    fallbackMetrics.totalHours
  )
  const volunteerLevel = computed(() => summary.value?.level ?? (Math.floor(totalHours.value / 10) + 1))
  const currentLevelHours = computed(() => totalHours.value % 10)
  const levelProgressPercentage = computed(() => currentLevelHours.value * 10)
  const hoursToNextLevel = computed(() => summary.value?.needHoursToNextLevel ?? Math.max(10 - currentLevelHours.value, 0))
  const monthlyHoursGrowth = computed(() => summary.value?.monthlyGrowth?.hours ?? fallbackMetrics.monthHoursGrowth)
  const monthlyPointsGrowth = computed(() => summary.value?.monthlyGrowth?.points ?? fallbackMetrics.monthPointsGrowth)
  const totalActivities = computed(() => summaryStats.value.totalActivities ?? fallbackMetrics.totalActivities)
  const completedActivities = computed(() => summaryStats.value.completedActivities ?? fallbackMetrics.completedActivities)
  const upcomingActivities = computed(() => summaryStats.value.upcomingActivities ?? fallbackMetrics.upcomingActivities)

  return {
    user,
    summary,
    profile,
    points,
    totalHours,
    volunteerLevel,
    currentLevelHours,
    levelProgressPercentage,
    hoursToNextLevel,
    monthlyHoursGrowth,
    monthlyPointsGrowth,
    totalActivities,
    completedActivities,
    upcomingActivities,
    fallbackMetrics
  }
}
