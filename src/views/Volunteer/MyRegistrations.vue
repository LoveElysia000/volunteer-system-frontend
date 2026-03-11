<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="我的报名"
      title="确认本周已预约任务"
      description="在同一页面里完成行前核对、优先排序和准备动作，避免临近活动时手忙脚乱。"
      :meta-items="headerMeta"
    >
      <template #actions>
        <RouterLink
          to="/volunteer/activities"
          class="volunteer-toolbar-button volunteer-toolbar-button--soft"
        >
          继续报名活动
        </RouterLink>
      </template>
    </VolunteerPageHeader>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
      <VolunteerSectionCard
        class="volunteer-registration-ops"
        title="行前运营面板"
        description="按时间优先级处理最接近开始的活动，减少漏签到风险。"
      >
        <div class="space-y-5">
          <div class="grid gap-4 md:grid-cols-3">
            <VolunteerSummaryCard
              label="已报名活动"
              :value="String(registeredActivities.length)"
              detail="当前在排期中"
              tone="blue"
              class="volunteer-surface-lift"
            />
            <VolunteerSummaryCard
              label="本周待参与"
              :value="String(soonCount)"
              detail="优先查看时间提醒"
              tone="green"
              class="volunteer-surface-lift"
            />
            <VolunteerSummaryCard
              label="平均服务时长"
              :value="`${averageDuration}h`"
              detail="按活动排班估算"
              tone="amber"
              class="volunteer-surface-lift"
            />
          </div>

          <div class="space-y-3">
            <article
              v-for="activity in sortedRegistrations"
              :key="activity.id"
              class="volunteer-surface-lift rounded-[1.5rem] border border-slate-200 bg-slate-50/85 p-5"
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-3">
                    <h3 class="text-lg font-bold text-slate-900">
                      {{ activity.title }}
                    </h3>
                    <VolunteerStatusBadge
                      :label="activity.userRegistrationStatus === 'registered' ? '已报名' : '未报名'"
                      tone="blue"
                    />
                  </div>
                  <p class="mt-2 text-sm leading-6 text-slate-600">
                    {{ activity.description }}
                  </p>
                </div>
                <button class="volunteer-toolbar-button">
                  查看详情
                </button>
              </div>
              <div class="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2 xl:grid-cols-4">
                <p>时间：{{ activity.date }}</p>
                <p>地点：{{ activity.location }}</p>
                <p>预计服务：{{ activity.duration }} 小时</p>
                <p class="font-semibold text-emerald-700">
                  +{{ activity.points }} 积分
                </p>
              </div>
            </article>
          </div>
        </div>
      </VolunteerSectionCard>

      <VolunteerSectionCard
        title="报名检查清单"
        description="活动开始前逐项确认，可以明显降低迟到和缺席情况。"
        tone="soft"
      >
        <ul class="volunteer-aside-stack">
          <li
            v-for="item in registrationChecklist"
            :key="item.label"
            class="volunteer-surface-lift rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-slate-900">
                {{ item.label }}
              </p>
              <span
                class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ item.done ? '已完成' : '待处理' }}
              </span>
            </div>
            <p class="mt-2 text-xs leading-5 text-slate-500">
              {{ item.detail }}
            </p>
          </li>
        </ul>
      </VolunteerSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import { registeredActivities } from '@/data/volunteerCenter'
import type { VolunteerActivityItem } from '@/data/volunteerCenter'

const sortedRegistrations = computed<VolunteerActivityItem[]>(() => {
  return [...registeredActivities].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
})

const soonCount = computed(() => sortedRegistrations.value.slice(0, 2).length)
const averageDuration = computed(() => {
  if (!registeredActivities.length) return 0
  const totalDuration = registeredActivities.reduce((sum, item) => sum + item.duration, 0)
  return Number((totalDuration / registeredActivities.length).toFixed(1))
})

const headerMeta = computed(() => [
  { label: '已报名', value: `${registeredActivities.length} 场`, detail: '保持到场率' },
  { label: '近期优先', value: `${soonCount.value} 场`, detail: '建议提前确认路线' }
])

const registrationChecklist = [
  { label: '确认签到时间', detail: '建议活动开始前 20 分钟到场，预留物资领取时间。', done: true },
  { label: '查看路线与交通', detail: '高峰时段活动建议提前规划到场路线。', done: false },
  { label: '准备个人物资', detail: '水杯、手套、帽子和雨具会提升现场协作效率。', done: false }
]
</script>
