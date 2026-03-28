<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-[2rem] border border-[#ffd8c2] bg-[radial-gradient(circle_at_top_left,rgba(255,244,236,0.98),rgba(255,255,255,0.97)_45%,rgba(255,248,243,0.98)_100%)] p-6 shadow-[0_28px_70px_-54px_rgba(120,53,15,0.42)] lg:p-8">
      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] xl:items-start">
        <div class="space-y-5">
          <div class="space-y-3">
            <span class="inline-flex items-center rounded-full bg-[#fff1ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#ec5b13]">
              运营驾驶台
            </span>
            <div class="space-y-2">
              <h1 class="text-3xl font-black tracking-tight text-slate-900 lg:text-[2.35rem]">
                组织管理总览
              </h1>
              <p class="text-sm font-medium tracking-[0.22em] text-slate-400">
                Organization Overview
              </p>
              <p class="max-w-2xl text-sm leading-6 text-slate-600">
                集中查看组织运行节奏、关键审批与重点活动进展，把核心运营信息放在一个工作台视图里。
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <div
              v-for="item in workbenchHighlights"
              :key="item.label"
              class="rounded-full border px-4 py-2.5 text-sm font-semibold shadow-[0_12px_26px_-22px_rgba(15,23,42,0.22)]"
              :class="item.tone === 'accent'
                ? 'border-[#ffd7bf] bg-[#fff6f0] text-[#b45309]'
                : 'border-slate-200 bg-white/92 text-slate-600'"
            >
              <span class="mr-2 text-xs uppercase tracking-[0.18em] text-slate-400">{{ item.label }}</span>
              <span class="text-slate-900">{{ item.value }}</span>
            </div>
          </div>

          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="item in quickPanels"
              :key="item.label"
              class="rounded-2xl border px-4 py-4"
              :class="item.tone === 'soft'
                ? 'border-[#ffe1d0] bg-[#fff8f4]'
                : 'border-slate-200 bg-white/92'"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {{ item.label }}
              </p>
              <p class="mt-2 text-lg font-bold text-slate-900">
                {{ item.value }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ item.detail }}
              </p>
            </article>
          </div>
        </div>

        <div class="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,247,242,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_22px_52px_-42px_rgba(120,53,15,0.45)] lg:p-5">
          <div class="flex flex-col gap-3">
            <Input
              v-model.trim="searchKeyword"
              placeholder="搜索活动名称、志愿者姓名..."
              :icon="SearchIcon"
              allow-clear
              class="!border-[#ffd9c4] !bg-white"
            />

            <div class="grid gap-3 sm:grid-cols-2">
              <button
                class="org-toolbar-button justify-center disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isExporting"
                @click="handleExport"
              >
                <DownloadIcon class="h-4 w-4" />
                {{ isExporting ? '导出中...' : '导出报表' }}
              </button>

              <RouterLink
                to="/organization/activities/create"
                class="org-toolbar-button org-toolbar-button--soft justify-center"
              >
                <PlusIcon class="h-4 w-4" />
                新建活动
              </RouterLink>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  报表周期
                </p>
                <div class="mt-2">
                  <FilterSelect
                    v-model="selectedReportPeriod"
                    :options="reportPeriodOptions"
                    :icon="CalendarRangeIcon"
                    compact
                  />
                </div>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  当前范围
                </p>
                <p class="mt-2 text-sm font-semibold text-slate-900">
                  {{ resolvedRange.start }} ~ {{ resolvedRange.end }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  用于当前看板统计与导出报表
                </p>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
              <article
                v-for="item in headerMeta"
                :key="item.label"
                class="rounded-2xl border border-[#ffd8c2] bg-[#fff8f4] px-4 py-3"
              >
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {{ item.label }}
                </p>
                <p class="mt-2 text-base font-bold text-slate-900">
                  {{ item.value }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ item.detail }}
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <OrganizationMetricCard
        v-for="metric in organizationKpiMetrics"
        :key="metric.key"
        :label="metric.label"
        :caption="metricCaptionMap[metric.key] || ''"
        :value="metric.value"
        :detail="metric.detail"
        :tone="metric.tone"
      >
        <template #icon>
          <component
            :is="metricIconMap[metric.key] || BarChart3Icon"
            class="h-6 w-6"
          />
        </template>

        <div
          class="mt-4 flex items-center text-xs font-semibold"
          :class="metricTrendClass(metric.trend)"
        >
          <TrendingUpIcon
            v-if="metric.trend.startsWith('+')"
            class="mr-1 h-3.5 w-3.5"
          />
          <MinusIcon
            v-else
            class="mr-1 h-3.5 w-3.5"
          />
          {{ metric.trend }} 较上一周期
        </div>
      </OrganizationMetricCard>
    </div>

    <OrganizationSectionCard
      title="报表范围"
      caption="Report Range"
      description="控制看板统计与运营报表导出的时间范围。"
      tone="soft"
    >
      <div class="grid gap-4 md:grid-cols-3">
        <DatePicker
          v-model="customStart"
          :disabled="selectedReportPeriod !== 'custom'"
          placeholder="自定义开始"
          mode="date"
        />
        <DatePicker
          v-model="customEnd"
          :disabled="selectedReportPeriod !== 'custom'"
          placeholder="自定义结束"
          mode="date"
        />
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <p class="font-semibold text-slate-900">
            当前导出范围
          </p>
          <p class="mt-1">
            {{ resolvedRange.start }} ~ {{ resolvedRange.end }}
          </p>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-500">
        自定义开始 / 自定义结束仅在选择“自定义区间”后生效。
      </p>
    </OrganizationSectionCard>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
      <OrganizationSectionCard
        class="organization-impact-trend"
        title="环保成效趋势"
        caption="Impact Trends"
        description="基于当前活跃活动的综合表现，观察阶段性变化。"
      >
        <template #header>
          <FilterSelect
            v-model="selectedTrendRange"
            :options="trendRangeOptions"
            :icon="CalendarRangeIcon"
            compact
          />
        </template>

        <div class="flex min-h-[280px] items-end gap-3 border-b border-slate-100 pb-5">
          <div
            v-for="row in trendRowsForView"
            :key="`${selectedTrendRange}-${row.month}`"
            class="group flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <div
              class="w-full rounded-t-xl transition-all duration-200"
              :class="row.highlight ? 'bg-[#ec5b13] shadow-[0_18px_36px_-30px_rgba(236,91,19,0.85)]' : 'bg-[#ffd7c1] group-hover:bg-[#f8b28a]'"
              :style="{ height: `${Math.max(row.value, 18)}%` }"
            />
            <span
              class="text-[10px] font-bold"
              :class="row.highlight ? 'text-[#ec5b13]' : 'text-slate-400'"
            >
              {{ row.month }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
          <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-[#ec5b13]" /> 当前周期
          </div>
          <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-slate-300" /> 上一周期
          </div>
        </div>
      </OrganizationSectionCard>

      <OrganizationSectionCard
        class="organization-critical-tasks"
        title="关键任务"
        caption="Critical Tasks"
        description="优先处理审批事项与执行阻塞问题"
        tone="soft"
      >
        <template #header>
          <RouterLink
            to="/organization/activities/review"
            class="text-xs font-bold text-[#ec5b13] hover:underline"
          >
            查看全部
          </RouterLink>
        </template>

        <transition-group
          name="organization-list-rise"
          tag="div"
          class="space-y-5"
        >
          <div
            v-for="task in filteredCriticalTaskRows"
            :key="task.key"
            class="rounded-2xl border border-white/70 bg-white/90 p-4"
          >
            <div class="mb-2 flex items-center justify-between gap-3">
              <p class="text-sm font-bold text-slate-800">
                {{ task.title }}
              </p>
              <span
                class="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                :class="taskStatusClass(task.tone)"
              >
                {{ task.status }}
              </span>
            </div>

            <div class="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                class="h-full rounded-full"
                :class="taskProgressClass(task.tone)"
                :style="{ width: `${task.progress}%` }"
              />
            </div>

            <p class="mt-2 text-xs text-slate-500">
              {{ task.detail }}
            </p>
          </div>
        </transition-group>
        <p
          v-if="!filteredCriticalTaskRows.length"
          class="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-500"
        >
          当前搜索条件下没有匹配的关键任务。
        </p>

        <RouterLink
          to="/organization/activities"
          class="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#ffd2ba] hover:text-[#ec5b13]"
        >
          进入任务管理
          <ArrowRightIcon class="h-4 w-4" />
        </RouterLink>
      </OrganizationSectionCard>
    </div>

    <OrganizationSectionCard
      class="organization-top-projects"
      title="重点活动"
      caption="Top Projects"
      description="优先查看当前执行节奏稳定、反馈较好的重点活动。"
    >
      <transition-group
        name="organization-list-rise"
        tag="div"
        class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="project in filteredTopProjectRows"
          :key="project.key"
          class="organization-surface-lift overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white"
        >
          <div
            class="relative h-36 bg-gradient-to-br"
            :class="project.imageClass"
          >
            <div class="absolute right-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-slate-700">
              ★ {{ project.rating.toFixed(1) }}
            </div>
            <div class="absolute left-3 top-3 rounded-full bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              {{ project.category }}
            </div>
          </div>

          <div class="space-y-4 p-5">
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                {{ project.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                {{ project.summary }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  参与志愿者
                </p>
                <p class="font-bold text-slate-800">
                  {{ project.volunteers.toLocaleString('en-US') }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  完成进度
                </p>
                <p class="font-bold text-slate-800">
                  {{ project.completion }}%
                </p>
              </div>
            </div>

            <RouterLink
              to="/organization/activities"
              class="inline-flex items-center gap-1 text-sm font-bold text-[#ec5b13] hover:underline"
            >
              查看详情
              <ArrowRightIcon class="h-4 w-4" />
            </RouterLink>
          </div>
        </article>
      </transition-group>
      <p
        v-if="!filteredTopProjectRows.length"
        class="rounded-2xl border border-dashed border-slate-200 bg-white/75 px-4 py-7 text-center text-sm text-slate-500"
      >
        当前搜索条件下没有匹配的重点活动。
      </p>
    </OrganizationSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRightIcon,
  BarChart3Icon,
  CalendarRangeIcon,
  CircleDollarSignIcon,
  DownloadIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  RocketIcon,
  SearchIcon,
  TrendingUpIcon,
  UsersIcon
} from 'lucide-vue-next'
import Input from '@/components/ui/Input.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import DatePicker from '@/components/ui/DatePicker.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import OrganizationMetricCard from '@/components/organization/OrganizationMetricCard.vue'
import { useOrganizationDashboardMetrics } from '@/composables/useOrganizationDashboardMetrics'
import { useAnalyticsStore } from '@/store/modules/analytics'
import { useMessageStore } from '@/store/modules/messages'
import { adminApi } from '@/api/admin'
import { useOrganizationContext } from '@/composables/useOrganizationContext'

const {
  user,
  organizationKpiMetrics,
  organizationImpactTrendRows,
  criticalTaskRows,
  topProjectRows,
  currentDateLabel
} = useOrganizationDashboardMetrics()
const analyticsStore = useAnalyticsStore()
const messageStore = useMessageStore()
const { ensureOrganizationId } = useOrganizationContext()

const searchKeyword = ref('')
const selectedTrendRange = ref<'12m' | 'qtr' | 'ytd'>('12m')
const selectedReportPeriod = ref<'last_7_days' | 'last_30_days' | 'custom'>('last_30_days')
const customStart = ref('')
const customEnd = ref('')
const trendRangeOptions = [
  { value: '12m', label: '近 12 个月', description: '查看完整年度趋势' },
  { value: 'qtr', label: '近一季度', description: '聚焦最近 4 个周期变化' },
  { value: 'ytd', label: '年初至今', description: '查看本年度累计走势' }
] as const
const reportPeriodOptions = [
  { value: 'last_7_days', label: '近 7 天', description: '适合查看最近执行波动' },
  { value: 'last_30_days', label: '近 30 天', description: '默认运营周期' },
  { value: 'custom', label: '自定义区间', description: '手动选择导出和统计范围' }
] as const
const isExporting = ref(false)

const normalizeKeyword = (value: string) => value.trim().toLowerCase()

const trendRowsForView = computed(() => {
  if (selectedTrendRange.value === 'qtr') {
    return organizationImpactTrendRows.value.slice(-4)
  }
  if (selectedTrendRange.value === 'ytd') {
    return organizationImpactTrendRows.value.slice(0, 6)
  }
  return organizationImpactTrendRows.value
})

const filteredCriticalTaskRows = computed(() => {
  const keyword = normalizeKeyword(searchKeyword.value)
  if (!keyword) return criticalTaskRows.value

  return criticalTaskRows.value.filter(task => {
    return normalizeKeyword(`${task.title} ${task.detail} ${task.status}`).includes(keyword)
  })
})

const filteredTopProjectRows = computed(() => {
  const keyword = normalizeKeyword(searchKeyword.value)
  if (!keyword) return topProjectRows.value

  return topProjectRows.value.filter(project => {
    return normalizeKeyword(`${project.title} ${project.summary} ${project.category}`).includes(keyword)
  })
})

const formatDate = (value: Date) => value.toISOString().slice(0, 10)

const resolvedRange = computed(() => {
  if (selectedReportPeriod.value === 'custom' && customStart.value && customEnd.value) {
    return { start: customStart.value, end: customEnd.value }
  }

  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - (selectedReportPeriod.value === 'last_7_days' ? 7 : 30))

  return {
    start: formatDate(startDate),
    end: formatDate(endDate)
  }
})

const headerMeta = computed(() => [
  { label: '当前管理员', value: user.value?.realName || '组织管理员', detail: '当前在线' },
  { label: '当前日期', value: currentDateLabel.value, detail: '本地工作区时间' },
  { label: '统计范围', value: `${resolvedRange.value.start} ~ ${resolvedRange.value.end}`, detail: '用于看板和报表导出' }
])
const workbenchHighlights = computed(() => [
  {
    label: '搜索结果',
    value: searchKeyword.value ? `${filteredTopProjectRows.value.length + filteredCriticalTaskRows.value.length} 项` : '全部内容',
    tone: 'accent'
  },
  {
    label: '关键任务',
    value: `${filteredCriticalTaskRows.value.length} 条待跟进`,
    tone: 'neutral'
  },
  {
    label: '重点活动',
    value: `${filteredTopProjectRows.value.length} 个项目`,
    tone: 'neutral'
  }
])
const quickPanels = computed(() => [
  {
    label: '活跃项目',
    value: organizationKpiMetrics.value[0]?.value || '0',
    detail: '当前运营周期内保持推进的活动数量',
    tone: 'soft'
  },
  {
    label: '参与成员',
    value: organizationKpiMetrics.value[1]?.value || '0',
    detail: '当前周期内有实际参与动作的成员规模',
    tone: 'neutral'
  },
  {
    label: '工时沉淀',
    value: organizationKpiMetrics.value[3]?.value || '0',
    detail: '当前周期内已结算并沉淀的服务产出',
    tone: 'neutral'
  }
])

const metricIconMap: Record<string, any> = {
  'active-projects': RocketIcon,
  volunteers: UsersIcon,
  'co2-offset': LeafIcon,
  'funds-raised': CircleDollarSignIcon
}

const metricCaptionMap: Record<string, string> = {
  'active-projects': 'Total Signups',
  volunteers: 'Member Conversion',
  'co2-offset': 'Check-in Count',
  'funds-raised': 'Granted Hours'
}

const metricTrendClass = (trend: string) => {
  return trend.startsWith('+')
    ? 'text-emerald-600'
    : 'text-slate-500'
}

const taskStatusClass = (tone: 'green' | 'amber' | 'orange') => {
  if (tone === 'green') return 'bg-emerald-100 text-emerald-700'
  if (tone === 'amber') return 'bg-amber-100 text-amber-700'
  return 'bg-[#ffe6d7] text-[#c94f14]'
}

const taskProgressClass = (tone: 'green' | 'amber' | 'orange') => {
  if (tone === 'green') return 'bg-emerald-500'
  if (tone === 'amber') return 'bg-amber-500'
  return 'bg-[#ec5b13]'
}

const handleExport = async () => {
  if (isExporting.value) return
  const orgId = await ensureOrganizationId()
  if (!orgId) {
    messageStore.error('当前没有可用的组织 ID，暂时无法导出运营报表')
    return
  }

  const getDownloadFileName = (contentDisposition?: string | null, fallback = 'export.xlsx') => {
    const match = contentDisposition?.match(/filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/)
    return decodeURIComponent(match?.[1] || match?.[2] || fallback)
  }
  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  isExporting.value = true
  try {
    const response = await adminApi.exportOpsReport({
      periodType: selectedReportPeriod.value,
      orgId,
      start: resolvedRange.value.start,
      end: resolvedRange.value.end
    })
    downloadBlob(
      response.data,
      getDownloadFileName(response.headers['content-disposition'], 'ops-report.xlsx')
    )
    messageStore.success('运营报表导出已开始')
  } catch (error: any) {
    console.error('导出运营报表失败:', error)
    messageStore.error(error.message || '导出运营报表失败，请稍后重试')
  } finally {
    isExporting.value = false
  }
}

const loadAnalytics = async () => {
  const orgId = await ensureOrganizationId()
  if (!orgId) return

  try {
    await analyticsStore.fetchOrganizationAnalytics({
      orgId,
      start: resolvedRange.value.start,
      end: resolvedRange.value.end
    })
  } catch (error: any) {
    console.error('加载组织看板统计失败:', error)
    messageStore.error(error.message || '加载组织看板统计失败，请稍后重试')
  }
}

onMounted(() => {
  void loadAnalytics()
})
</script>
