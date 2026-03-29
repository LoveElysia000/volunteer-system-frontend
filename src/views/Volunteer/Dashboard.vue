<template>
  <div class="space-y-6">
    <VolunteerHeroPanel />

    <StatsOverview />

    <div class="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
      <VolunteerSectionCard
        title="推荐活动"
        description="结合你的近期参与偏好和距离，优先展示适合本周报名的任务。"
      >
        <VolunteerRecommendedActivities />
      </VolunteerSectionCard>

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
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VolunteerHeroPanel from '@/components/volunteer/VolunteerHeroPanel.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerRecommendedActivities from '@/components/volunteer/VolunteerRecommendedActivities.vue'
import VolunteerAchievementFeed from '@/components/volunteer/VolunteerAchievementFeed.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import StatsOverview from '@/components/volunteer/StatsOverview.vue'
import UpcomingActivities from '@/components/volunteer/UpcomingActivities.vue'
import { monthlyMetrics } from '@/data/volunteerCenter'

const displayMonthlyMetrics = computed(() => {
  if (monthlyMetrics.length > 0) return monthlyMetrics
  return [
    { label: '本月服务时长', value: '0 小时', detail: '等待接口同步', tone: 'green' as const },
    { label: '完成活动', value: '0 场', detail: '保留当前展示结构', tone: 'blue' as const },
    { label: '积分增长', value: '0', detail: '真实数据接入后更新', tone: 'amber' as const }
  ]
})
</script>
