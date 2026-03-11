<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="时长统计"
      title="观察你的服务投入趋势"
      description="从月份、服务类型和阶段进度看出你在哪些方向投入更多。"
      :meta-items="[{ label: '近三个月', value: '26h', detail: '本月提升最明显' }]"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
      <VolunteerSectionCard
        class="volunteer-statistics-insight"
        title="投入洞察"
        description="用阶段分布和月度变化判断下一步最值得投入的方向。"
      >
        <div class="mb-5 grid gap-4 md:grid-cols-3">
          <VolunteerSummaryCard
            label="本月时长"
            value="12h"
            detail="比上月多 4 小时"
            tone="green"
            class="volunteer-surface-lift"
          />
          <VolunteerSummaryCard
            label="季度累计"
            value="26h"
            detail="保持稳定节奏"
            tone="blue"
            class="volunteer-surface-lift"
          />
          <VolunteerSummaryCard
            label="高频类型"
            value="社区服务"
            detail="占总时长 46%"
            tone="amber"
            class="volunteer-surface-lift"
          />
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
          <article
            v-for="item in stageDistribution"
            :key="item.label"
            class="volunteer-surface-lift rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-5"
          >
            <p class="text-sm font-semibold text-slate-500">
              {{ item.label }}
            </p>
            <p class="mt-2 text-3xl font-black text-slate-900">
              {{ item.value }}
            </p>
            <div class="mt-3 h-2 rounded-full bg-slate-200">
              <div
                class="h-full rounded-full"
                :class="item.barTone"
                :style="{ width: item.value }"
              />
            </div>
          </article>
        </div>
      </VolunteerSectionCard>

      <VolunteerSectionCard
        title="月度变化"
        description="快速对比最近三个月投入节奏，决定是否要补强。"
        tone="soft"
      >
        <div class="space-y-3">
          <article
            v-for="row in monthlyInsightRows"
            :key="row.month"
            class="volunteer-surface-lift rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-slate-600">
                {{ row.month }}
              </p>
              <p class="text-lg font-black text-slate-900">
                {{ row.hours }}h
              </p>
            </div>
            <p class="mt-1 text-xs text-slate-500">
              {{ row.note }}
            </p>
          </article>
        </div>
      </VolunteerSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'

const stageDistribution = [
  { label: '社区服务', value: '46%', barTone: 'bg-emerald-500' },
  { label: '环保宣传', value: '31%', barTone: 'bg-sky-500' },
  { label: '生态修复', value: '23%', barTone: 'bg-amber-500' }
]

const monthlyInsightRows = [
  { month: '2026-01', hours: 6, note: '保持基础投入，重点在社区引导。' },
  { month: '2026-02', hours: 8, note: '参加两次高时长活动，节奏上升。' },
  { month: '2026-03', hours: 12, note: '本月投入明显增加，建议维持可持续频率。' }
]
</script>
