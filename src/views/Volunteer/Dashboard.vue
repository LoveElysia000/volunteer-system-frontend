<template>
  <WorkbenchPage>
    <WorkbenchHeroPanel>
      <VolunteerHeroPanel />
    </WorkbenchHeroPanel>

    <StatsOverview />

    <WorkbenchSplitLayout variant="dashboard-wide">
      <template #main>
        <VolunteerSectionCard
          title="推荐活动"
          description="结合你的近期参与偏好和距离，优先展示适合本周报名的任务。"
        >
          <VolunteerRecommendedActivities />
        </VolunteerSectionCard>
      </template>

      <template #aside>
        <div class="space-y-6">
          <VolunteerSectionCard
            title="近期成就动态"
            description="用最近的反馈和团队动态提醒你保持参与节奏。"
            tone="soft"
          >
            <VolunteerAchievementFeed />
          </VolunteerSectionCard>

          <VolunteerSectionCard
            title="即将开始"
            description="已报名任务和近期开启项目统一查看，避免错过签到。"
          >
            <UpcomingActivities />
          </VolunteerSectionCard>
        </div>
      </template>
    </WorkbenchSplitLayout>

    <VolunteerSectionCard
      title="本月节奏"
      description="保持一个稳定的参与节奏，比短期冲量更重要。"
    >
      <div class="grid gap-4 md:grid-cols-3">
        <div
          v-for="metric in displayMonthlyMetrics"
          :key="metric.label"
          class="rounded-[1.4rem] border border-slate-100 bg-slate-50/80 px-4 py-4"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-slate-500">
                {{ metric.label }}
              </p>
              <p class="mt-1 text-2xl font-black text-slate-900">
                {{ metric.value }}
              </p>
            </div>
            <VolunteerStatusBadge
              :label="metric.detail"
              :tone="metric.tone"
            />
          </div>
        </div>
      </div>
    </VolunteerSectionCard>
  </WorkbenchPage>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import WorkbenchHeroPanel from '@/components/workbench/WorkbenchHeroPanel.vue'
import WorkbenchPage from '@/components/workbench/WorkbenchPage.vue'
import WorkbenchSplitLayout from '@/components/workbench/WorkbenchSplitLayout.vue'
import VolunteerHeroPanel from '@/components/volunteer/VolunteerHeroPanel.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerRecommendedActivities from '@/components/volunteer/VolunteerRecommendedActivities.vue'
import VolunteerAchievementFeed from '@/components/volunteer/VolunteerAchievementFeed.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import StatsOverview from '@/components/volunteer/StatsOverview.vue'
import UpcomingActivities from '@/components/volunteer/UpcomingActivities.vue'
import { useVolunteerMetrics } from '@/composables/useVolunteerMetrics'
import { useVolunteerStore } from '@/store/modules/volunteer'
import {
  buildVolunteerDashboardMonthlyMetrics,
  shouldRefreshVolunteerDashboardData
} from './dashboardState'

const volunteerStore = useVolunteerStore()
const route = useRoute()
const hasLoadedOnce = ref(false)
const hasActivatedOnce = ref(false)
const {
  monthlyHoursGrowth,
  totalActivities,
  completedActivities,
  upcomingActivities
} = useVolunteerMetrics()

const displayMonthlyMetrics = computed(() => buildVolunteerDashboardMonthlyMetrics({
  monthlyHoursGrowth: monthlyHoursGrowth.value,
  totalActivities: totalActivities.value,
  completedActivities: completedActivities.value,
  upcomingActivities: upcomingActivities.value
}))

const loadDashboardData = async () => {
  try {
    await Promise.all([
      volunteerStore.fetchHomeSummary(),
      volunteerStore.fetchRegisteredActivities()
    ])
  } catch (error) {
    console.error('加载志愿者首页总览失败:', error)
  }
}

onMounted(async () => {
  await loadDashboardData()
  hasLoadedOnce.value = true
})

onActivated(async () => {
  if (shouldRefreshVolunteerDashboardData({
    currentRouteName: String(route.name || ''),
    hasLoadedOnce: hasLoadedOnce.value,
    hasActivatedOnce: hasActivatedOnce.value
  })) {
    await loadDashboardData()
  }

  hasActivatedOnce.value = true
})
</script>
