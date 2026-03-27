<template>
  <DataList
    :items="registeredActivities"
    row-key="id"
    open-text="查看详情"
    empty-title="还没有已报名活动"
    empty-description="去活动列表看看距离近、积分高的推荐任务。"
  >
    <template #default="{ item }">
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
          <VolunteerStatusBadge
            label="已报名"
            tone="blue"
          />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            即将开始
          </span>
        </div>

        <div>
          <h3 class="text-lg font-bold tracking-tight text-slate-900">
            {{ item.title }}
          </h3>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            {{ item.description }}
          </p>
        </div>

        <div class="flex flex-wrap gap-4 text-sm text-slate-500">
          <span>{{ item.date }}</span>
          <span>{{ item.location }}</span>
          <span>{{ item.duration }} 小时</span>
        </div>
      </div>
    </template>

    <template #actions>
      <RouterLink
        to="/volunteer/activities/my-registrations"
        class="volunteer-toolbar-button volunteer-toolbar-button--soft"
      >
        查看详情
      </RouterLink>
      <button class="volunteer-toolbar-button volunteer-toolbar-button--ghost">
        分享提醒
      </button>
    </template>

    <template #empty>
      <div class="rounded-[1.5rem] border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center">
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
    </template>
  </DataList>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import DataList from '@/components/data-list/DataList.vue'
import { useVolunteerStore } from '@/store/modules/volunteer'
import VolunteerStatusBadge from './VolunteerStatusBadge.vue'

const volunteerStore = useVolunteerStore()
const registeredActivities = computed(() => volunteerStore.registeredActivities.slice(0, 3))
</script>
