<template>
  <div class="grid gap-4 lg:grid-cols-3">
    <article
      v-for="activity in recommendedActivities"
      :key="activity.id"
      class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_-36px_rgba(15,23,42,0.38)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-34px_rgba(16,185,129,0.35)]"
    >
      <div class="flex items-start justify-between gap-4">
        <VolunteerStatusBadge
          :label="activity.tag || '推荐'"
          tone="green"
        />
        <span class="text-sm font-semibold text-emerald-700">+{{ activity.points }} 积分</span>
      </div>
      <div class="mt-5 space-y-3">
        <h3 class="text-xl font-bold text-slate-900">
          {{ activity.title }}
        </h3>
        <p class="text-sm leading-6 text-slate-600">
          {{ activity.description }}
        </p>
      </div>
      <dl class="mt-5 space-y-2 text-sm text-slate-500">
        <div class="flex items-center justify-between">
          <dt>时间</dt>
          <dd class="font-medium text-slate-700">
            {{ activity.date }}
          </dd>
        </div>
        <div class="flex items-center justify-between">
          <dt>地点</dt>
          <dd class="font-medium text-slate-700">
            {{ activity.location }}
          </dd>
        </div>
        <div class="flex items-center justify-between">
          <dt>名额</dt>
          <dd class="font-medium text-slate-700">
            {{ activity.participants }}/{{ activity.capacity }}
          </dd>
        </div>
      </dl>
      <RouterLink
        to="/volunteer/activities"
        class="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
      >
        去查看详情
      </RouterLink>
    </article>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import VolunteerStatusBadge from './VolunteerStatusBadge.vue'
import { recommendedActivities } from '@/data/volunteerCenter'
</script>
