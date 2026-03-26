<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="时长统计"
      title="观察你的服务投入趋势"
      description="从月份、服务类型和阶段进度看出你在哪些方向投入更多。"
      :meta-items="[{ label: '近三个月', value: '0h', detail: '等待接口返回' }]"
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
            value="0h"
            detail="等待后端同步"
            tone="green"
            class="volunteer-surface-lift"
          />
          <VolunteerSummaryCard
            label="季度累计"
            value="0h"
            detail="后端返回后自动更新"
            tone="blue"
            class="volunteer-surface-lift"
          />
          <VolunteerSummaryCard
            label="高频类型"
            value="暂无"
            detail="接口接入后展示"
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
  { label: '社区服务', value: '0%', barTone: 'bg-emerald-500' },
  { label: '环保宣传', value: '0%', barTone: 'bg-sky-500' },
  { label: '生态修复', value: '0%', barTone: 'bg-amber-500' }
]

const monthlyInsightRows = [
  { month: '最近一月', hours: 0, note: '等待后端返回统计结果。' },
  { month: '最近两月', hours: 0, note: '当前不再展示本地模拟趋势。' },
  { month: '最近三月', hours: 0, note: '接口接入后将自动更新。' }
]
</script>
