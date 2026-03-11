<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="历史活动"
      title="沉淀你的长期贡献轨迹"
      description="回看已完成项目、参与类型和高频服务区域，帮助你判断下一阶段的投入重点。"
      :meta-items="headerMeta"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
      <VolunteerSectionCard
        class="volunteer-history-timeline"
        title="完成时间轴"
        description="把最近完成活动按时间排序，快速浏览你的参与节奏。"
      >
        <transition-group
          name="volunteer-list-rise"
          tag="div"
          class="space-y-4"
        >
          <article
            v-for="activity in sortedHistoryActivities"
            :key="activity.id"
            class="volunteer-surface-lift rounded-[1.5rem] border border-slate-200 bg-white p-5"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="text-lg font-bold text-slate-900">
                    {{ activity.title }}
                  </h3>
                  <VolunteerStatusBadge
                    label="已完成"
                    tone="slate"
                  />
                </div>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  {{ activity.description }}
                </p>
              </div>
              <p class="text-sm font-semibold text-slate-500">
                {{ activity.date }}
              </p>
            </div>
            <div class="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>{{ activity.location }}</span>
              <span>{{ activity.duration }} 小时</span>
              <span class="font-semibold text-emerald-700">+{{ activity.points }} 积分</span>
            </div>
          </article>
        </transition-group>
      </VolunteerSectionCard>

      <div class="space-y-6">
        <VolunteerSectionCard
          title="历史亮点"
          description="从服务分布中识别你的稳定强项。"
          tone="soft"
        >
          <div class="space-y-3">
            <article
              v-for="item in historyHighlights"
              :key="item.label"
              class="volunteer-surface-lift rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-4"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {{ item.label }}
              </p>
              <p class="mt-2 text-xl font-bold text-slate-900">
                {{ item.value }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ item.detail }}
              </p>
            </article>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="复盘建议"
          description="基于近期记录给出的下一步建议。"
        >
          <ul class="space-y-3 text-sm leading-6 text-slate-600">
            <li>优先延续你熟悉的服务类型，保持稳定节奏再扩展新主题。</li>
            <li>高积分活动可与高时长活动搭配，兼顾成长速度与可持续参与。</li>
            <li>若连续两周无记录，可提前锁定下周时段防止断档。</li>
          </ul>
        </VolunteerSectionCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import { historyActivities } from '@/data/volunteerCenter'

const sortedHistoryActivities = computed(() => {
  return [...historyActivities].sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())
})

const totalHistoryHours = computed(() => historyActivities.reduce((sum, item) => sum + item.duration, 0))
const totalHistoryPoints = computed(() => historyActivities.reduce((sum, item) => sum + item.points, 0))

const headerMeta = computed(() => [
  { label: '已完成', value: `${historyActivities.length} 场`, detail: '形成长期记录' },
  { label: '累计时长', value: `${totalHistoryHours.value}h`, detail: '持续沉淀服务经验' }
])

const historyHighlights = computed(() => [
  { label: '累计积分', value: `${totalHistoryPoints.value}`, detail: '由已完成活动自动累积' },
  { label: '最近完成', value: sortedHistoryActivities.value[0]?.title || '暂无', detail: sortedHistoryActivities.value[0]?.location || '待记录' },
  { label: '平均单场时长', value: historyActivities.length ? `${(totalHistoryHours.value / historyActivities.length).toFixed(1)}h` : '0h', detail: '可用于规划可承受投入强度' }
])
</script>
