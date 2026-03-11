<template>
  <div class="volunteer-aside-stack space-y-4">
    <article
      v-for="activity in registeredActivities"
      :key="activity.id"
      class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_-36px_rgba(15,23,42,0.26)] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_24px_54px_-38px_rgba(16,185,129,0.28)]"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex min-w-0 flex-1 gap-4">
          <div class="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-[1.25rem] bg-emerald-50 text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.08)]">
            <span class="text-xs font-semibold uppercase tracking-[0.2em]">Mar</span>
            <span class="text-xl font-black">{{ activity.date.slice(3, 5) }}</span>
          </div>
          <div class="min-w-0 flex-1 space-y-2">
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="text-lg font-bold text-slate-900">
                {{ activity.title }}
              </h3>
              <VolunteerStatusBadge
                label="已报名"
                tone="blue"
              />
            </div>
            <p class="text-sm leading-6 text-slate-600">
              {{ activity.description }}
            </p>
            <div class="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>{{ activity.date }}</span>
              <span>{{ activity.location }}</span>
              <span>{{ activity.duration }} 小时</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <RouterLink
            to="/volunteer/activities/my-registrations"
            class="volunteer-toolbar-button volunteer-toolbar-button--soft"
          >
            查看详情
          </RouterLink>
          <button class="volunteer-toolbar-button volunteer-toolbar-button--ghost">
            分享提醒
          </button>
        </div>
      </div>
    </article>

    <div
      v-if="registeredActivities.length === 0"
      class="rounded-[1.5rem] border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center"
    >
      <p class="text-base font-semibold text-slate-700">
        还没有已报名活动
      </p>
      <p class="mt-2 text-sm text-slate-500">
        去活动列表看看距离近、积分高的推荐任务。
      </p>
      <RouterLink
        to="/volunteer/activities"
        class="mt-4 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
      >
        浏览活动
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import VolunteerStatusBadge from './VolunteerStatusBadge.vue'
import { registeredActivities } from '@/data/volunteerCenter'
</script>
