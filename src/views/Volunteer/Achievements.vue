<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="徽章墙"
      title="看见你的阶段成果"
      description="通过徽章进度追踪稳定贡献，把每次参与沉淀成长期成长轨迹。"
      :meta-items="achievementMeta"
    >
      <template #actions>
        <RouterLink
          to="/volunteer/achievements/levels"
          class="volunteer-toolbar-button volunteer-toolbar-button--soft"
        >
          查看等级进度
        </RouterLink>
      </template>
    </VolunteerPageHeader>

    <VolunteerSectionCard
      class="volunteer-achievement-spotlight"
      title="成长聚光区"
      description="优先关注还差一步完成的阶段目标，让投入转化为可见成果。"
      tone="soft"
    >
      <div class="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div class="rounded-[1.6rem] border border-white/80 bg-white/90 p-5">
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            当前完成率
          </p>
          <div class="mt-3 flex items-end gap-3">
            <p class="text-4xl font-black tracking-tight text-slate-900">
              {{ completionRate }}%
            </p>
            <p class="pb-1 text-sm font-semibold text-slate-500">
              {{ earnedCount }} / {{ totalBadges }} 徽章
            </p>
          </div>
          <div class="mt-4 h-3 overflow-hidden rounded-full bg-emerald-100">
            <div
              class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-500"
              :style="{ width: `${completionRate}%` }"
            />
          </div>
          <p class="mt-3 text-sm text-slate-500">
            再点亮 <span class="font-semibold text-slate-800">{{ Math.max(totalBadges - earnedCount, 0) }}</span> 枚徽章即可完成本阶段。
          </p>
        </div>

        <div class="space-y-3">
          <article
            v-for="item in displayMilestoneRoadmap"
            :key="item.id"
            class="volunteer-surface-lift rounded-[1.25rem] border border-white/75 bg-white/92 px-4 py-4 shadow-[0_16px_38px_-30px_rgba(15,23,42,0.4)]"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-bold text-slate-900">
                {{ item.name }}
              </p>
              <VolunteerStatusBadge
                :label="item.earned ? '已获得' : '下一目标'"
                :tone="item.earned ? 'green' : 'amber'"
              />
            </div>
            <p class="mt-2 text-xs text-slate-500">
              {{ item.progress || '持续参与以解锁' }}
            </p>
          </article>
        </div>
      </div>
    </VolunteerSectionCard>

    <VolunteerSectionCard
      title="我的徽章"
      description="按状态筛选查看全部徽章，快速定位下一步冲刺目标。"
    >
      <div class="mb-5 flex flex-wrap gap-2">
        <button
          v-for="filter in badgeFilters"
          :key="filter.id"
          class="rounded-full px-4 py-2 text-sm font-semibold transition"
          :class="activeBadgeFilter === filter.id ? 'bg-emerald-600 text-white shadow-[0_10px_24px_-16px_rgba(5,150,105,0.9)]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          @click="activeBadgeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>

      <transition-group
        name="volunteer-list-rise"
        tag="div"
        class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="badge in displayBadges"
          :key="badge.id"
          class="volunteer-surface-lift rounded-[1.5rem] border p-5"
          :class="badge.earned ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-white'"
        >
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-lg font-bold text-slate-900">
              {{ badge.name }}
            </h3>
            <VolunteerStatusBadge
              :label="badge.earned ? '已获得' : '进行中'"
              :tone="badge.earned ? 'green' : 'amber'"
            />
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-600">
            {{ badge.description }}
          </p>
          <p class="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {{ badge.progress }}
          </p>
        </article>
      </transition-group>
    </VolunteerSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import { volunteerBadges } from '@/data/volunteerCenter'

type BadgeFilter = 'all' | 'earned' | 'in_progress'

const activeBadgeFilter = ref<BadgeFilter>('all')

const badgeFilters: Array<{ id: BadgeFilter, label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'earned', label: '已获得' },
  { id: 'in_progress', label: '进行中' }
]

const earnedCount = computed(() => volunteerBadges.filter(item => item.earned).length)
const totalBadges = computed(() => volunteerBadges.length)
const completionRate = computed(() => Math.round((earnedCount.value / Math.max(totalBadges.value, 1)) * 100))

const achievementMeta = computed(() => [
  { label: '已点亮', value: `${earnedCount.value} 枚`, detail: '等待接口同步' },
  { label: '完成率', value: `${completionRate.value}%`, detail: '后端返回后自动更新' }
])

const filteredBadges = computed(() => {
  if (activeBadgeFilter.value === 'earned') {
    return volunteerBadges.filter(item => item.earned)
  }
  if (activeBadgeFilter.value === 'in_progress') {
    return volunteerBadges.filter(item => !item.earned)
  }
  return volunteerBadges
})

const milestoneRoadmap = computed(() => {
  const pending = volunteerBadges.filter(item => !item.earned).slice(0, 3)
  if (pending.length > 0) return pending
  return volunteerBadges.slice(0, 3)
})

const displayMilestoneRoadmap = computed(() => {
  if (milestoneRoadmap.value.length > 0) return milestoneRoadmap.value
  return [
    { id: -1, name: '成长里程碑待同步', earned: false, progress: '接口接入后显示真实进度' },
    { id: -2, name: '阶段目标待同步', earned: false, progress: '不再展示本地模拟成就' },
    { id: -3, name: '徽章解锁待同步', earned: false, progress: '保留现有卡片布局' }
  ]
})

const displayBadges = computed(() => {
  if (filteredBadges.value.length > 0) return filteredBadges.value
  return [
    { id: -1, name: '徽章数据待同步', description: '当前页面结构保留，等待后端返回真实徽章数据。', earned: false, progress: '待接入' },
    { id: -2, name: '成长进度待同步', description: '不再展示前端伪造的徽章状态与进度。', earned: false, progress: '待接入' },
    { id: -3, name: '荣誉记录待同步', description: '接口接入后将按现有样式自动更新。', earned: false, progress: '待接入' }
  ]
})
</script>
