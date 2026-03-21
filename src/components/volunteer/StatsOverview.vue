<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <VolunteerSummaryCard
      label="当前积分"
      :value="String(points)"
      :detail="`本月新增 ${monthlyPointsGrowth} 分`"
      tone="green"
    >
      <template #icon>
        <StarIcon class="h-6 w-6" />
      </template>
      <div class="mt-4 h-2 rounded-full bg-emerald-100">
        <div
          class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
          :style="{ width: `${levelProgressPercentage}%` }"
        />
      </div>
    </VolunteerSummaryCard>

    <VolunteerSummaryCard
      label="服务时长"
      :value="`${totalHours}h`"
      :detail="`年度目标完成 ${Math.min(Math.round((totalHours / 100) * 100), 100)}%`"
      tone="blue"
    >
      <template #icon>
        <ClockIcon class="h-6 w-6" />
      </template>
      <div class="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>本月 +{{ monthlyHoursGrowth }}h</span>
        <span>100h 年度目标</span>
      </div>
    </VolunteerSummaryCard>

    <VolunteerSummaryCard
      label="参与活动"
      :value="String(totalActivities)"
      :detail="`其中 ${completedActivities} 场已完成`"
      tone="amber"
    >
      <template #icon>
        <CalendarIcon class="h-6 w-6" />
      </template>
      <div class="mt-4 flex gap-2 text-xs">
        <VolunteerStatusBadge
          :label="`${upcomingActivities} 场待参加`"
          tone="amber"
        />
        <VolunteerStatusBadge
          :label="`${completedActivities} 场已完成`"
          tone="blue"
        />
      </div>
    </VolunteerSummaryCard>

    <VolunteerSummaryCard
      label="志愿者等级"
      :value="`Lv.${volunteerLevel}`"
      :detail="`距离升级还差 ${hoursToNextLevel} 小时`"
      tone="slate"
    >
      <template #icon>
        <AwardIcon class="h-6 w-6" />
      </template>
      <div class="mt-4 rounded-2xl bg-slate-50 px-3 py-3 text-xs text-slate-600">
        当前阶段进度 {{ currentLevelHours }}/10 小时
      </div>
    </VolunteerSummaryCard>
  </div>
</template>

<script setup lang="ts">
import { StarIcon, ClockIcon, CalendarIcon, AwardIcon } from 'lucide-vue-next'
import { useVolunteerMetrics } from '@/composables/useVolunteerMetrics'
import VolunteerSummaryCard from './VolunteerSummaryCard.vue'
import VolunteerStatusBadge from './VolunteerStatusBadge.vue'

const {
  points,
  totalHours,
  volunteerLevel,
  currentLevelHours,
  hoursToNextLevel,
  levelProgressPercentage,
  monthlyHoursGrowth,
  monthlyPointsGrowth,
  totalActivities,
  completedActivities,
  upcomingActivities
} = useVolunteerMetrics()
</script>
