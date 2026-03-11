<template>
  <div class="space-y-4">
    <div
      v-for="item in achievementFeed"
      :key="item.id"
      class="flex items-start gap-4 rounded-[1.4rem] border border-slate-100 bg-slate-50/80 p-4"
    >
      <div
        class="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl"
        :class="avatarClass(item.tone)"
      >
        {{ item.name.slice(0, 1) }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm leading-6 text-slate-700">
          <span class="font-bold text-slate-900">{{ item.name }}</span>
          {{ item.action }}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          {{ item.context }}
        </p>
      </div>
      <VolunteerStatusBadge
        :label="badgeText(item.tone)"
        :tone="item.tone"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VolunteerStatusBadge from './VolunteerStatusBadge.vue'
import { achievementFeed, type VolunteerTone } from '@/data/volunteerCenter'

const avatarClass = (tone: VolunteerTone) => ({
  green: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-sky-100 text-sky-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-200 text-slate-700',
  rose: 'bg-rose-100 text-rose-700'
}[tone])

const badgeText = (tone: VolunteerTone) => ({
  green: '已完成',
  blue: '团队动态',
  amber: '新任务',
  slate: '提醒',
  rose: '关注'
}[tone])
</script>
