<template>
  <DataList
    :items="recommendedActivities"
    row-key="id"
    open-text="查看详情"
    empty-title="当前没有推荐活动"
    empty-description="系统会根据你的近期参与偏好继续推荐合适任务。"
  >
    <template #default="{ item }">
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
          <VolunteerStatusBadge
            :label="item.tag || '推荐'"
            tone="green"
          />
          <span class="text-sm font-semibold text-emerald-700">+{{ item.points }} 积分</span>
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
          <span>{{ item.participants }}/{{ item.capacity }} 名额</span>
        </div>
      </div>
    </template>

    <template #actions="{ item }">
      <RouterLink
        :to="`/volunteer/activities?id=${item.id}`"
        class="volunteer-toolbar-button volunteer-toolbar-button--soft"
      >
        去查看详情
      </RouterLink>
    </template>
  </DataList>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DataList from '@/components/data-list/DataList.vue'
import VolunteerStatusBadge from './VolunteerStatusBadge.vue'
import { recommendedActivities } from '@/data/volunteerCenter'
</script>
