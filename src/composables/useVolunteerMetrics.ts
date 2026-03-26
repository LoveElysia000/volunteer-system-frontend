import { computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { useVolunteerStore } from '@/store/modules/volunteer'

export const useVolunteerMetrics = () => {
  const authStore = useAuthStore()
  const volunteerStore = useVolunteerStore()
  const user = computed(() => authStore.user)
  const summary = computed(() => volunteerStore.summary)
  const profile = computed(() => volunteerStore.profile)

  const summaryStats = computed(() => summary.value?.stats)
  const points = computed(() =>
    summaryStats.value?.points ??
    user.value?.points ??
    0
  )
  const totalHours = computed(() =>
    summaryStats.value?.hours ??
    profile.value?.totalHours ??
    user.value?.totalHours ??
    0
  )
  const volunteerLevel = computed(() => summary.value?.level ?? (Math.floor(totalHours.value / 10) + 1))
  const currentLevelHours = computed(() => totalHours.value % 10)
  const levelProgressPercentage = computed(() => currentLevelHours.value * 10)
  const hoursToNextLevel = computed(() => summary.value?.needHoursToNextLevel ?? Math.max(10 - currentLevelHours.value, 0))
  const monthlyHoursGrowth = computed(() => summary.value?.monthlyGrowth ?? 0)
  const monthlyPointsGrowth = computed(() => 0)
  const totalActivities = computed(() => summaryStats.value?.activityCount ?? 0)
  const completedActivities = computed(() => 0)
  const upcomingActivities = computed(() => 0)

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
    upcomingActivities
  }
}
