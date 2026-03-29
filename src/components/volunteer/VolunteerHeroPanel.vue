<template>
  <section class="rounded-[2rem] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(110,231,183,0.22),_transparent_38%),linear-gradient(135deg,_#0f172a,_#14532d_68%,_#1f2937)] p-6 text-white shadow-[0_30px_80px_-48px_rgba(15,23,42,0.65)] lg:p-8">
    <div class="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
      <div class="max-w-2xl space-y-5">
        <span class="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
          今日工作台
        </span>
        <div class="space-y-3">
          <h2 class="text-3xl font-black tracking-tight lg:text-4xl">
            欢迎回来，{{ user?.realName || '志愿者' }}
          </h2>
          <p class="max-w-xl text-sm leading-7 text-emerald-50/85 lg:text-base">
            {{ heroDescription }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <RouterLink
            to="/volunteer/activities"
            class="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            浏览推荐活动
          </RouterLink>
          <RouterLink
            to="/volunteer/profile"
            class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            查看个人资料
          </RouterLink>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-3 xl:w-[420px] xl:grid-cols-1">
        <div
          v-for="item in heroHighlights"
          :key="item.label"
          class="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
        >
          <p class="text-xs uppercase tracking-[0.2em] text-emerald-100/70">
            {{ item.label }}
          </p>
          <p class="mt-2 text-2xl font-black">
            {{ item.value }}
          </p>
          <div
            v-if="typeof item.progressPercentage === 'number'"
            class="mt-3 h-2 rounded-full bg-white/10"
          >
            <div
              class="h-full rounded-full bg-emerald-300"
              :style="{ width: `${item.progressPercentage}%` }"
            />
          </div>
          <p class="mt-1 text-sm text-emerald-50/75">
            {{ item.detail }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useVolunteerMetrics } from '@/composables/useVolunteerMetrics'
import {
  buildVolunteerHeroDescription,
  buildVolunteerHeroHighlights
} from '@/views/Volunteer/dashboardState'

const { user, points, serviceCount, volunteerLevel, levelProgressPercentage, upcomingActivities } = useVolunteerMetrics()
const heroDescription = computed(() => buildVolunteerHeroDescription(points.value))
const heroHighlights = computed(() => buildVolunteerHeroHighlights({
  volunteerLevel: volunteerLevel.value,
  levelProgressPercentage: levelProgressPercentage.value,
  serviceCount: serviceCount.value,
  upcomingActivities: upcomingActivities.value
}))
</script>
