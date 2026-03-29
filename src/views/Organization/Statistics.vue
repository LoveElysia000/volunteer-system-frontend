<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="数据统计"
      title="数据统计"
      description="查看组织近期报名、到场和工时等核心指标。"
      :meta-items="headerMeta"
    >
      <template #actions>
        <FilterSelect
          v-model="selectedReportPeriod"
          :options="reportPeriodOptions"
          :icon="CalendarRangeIcon"
          compact
        />
        <button
          class="org-toolbar-button org-toolbar-button--soft w-full sm:w-auto"
          @click="exportOpsReport"
        >
          导出运营报表
        </button>
      </template>
    </OrganizationPageHeader>

    <OrganizationSectionCard
      title="统计范围"
      description="选择统计查询与运营报表导出的时间区间。"
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
        <div class="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <p class="font-semibold text-slate-900">
            当前统计范围
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

    <div class="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      <OrganizationMetricCard
        v-for="metric in metrics"
        :key="metric.label"
        :label="metric.label"
        :value="metric.value"
        :detail="metric.detail"
        :tone="metric.tone"
      />
    </div>

    <OrganizationSectionCard
      title="转化漏斗"
      description="查看从注册到工时的关键转化环节。"
    >
      <div class="grid gap-4 md:grid-cols-2 2xl:grid-cols-5">
        <article
          v-for="item in funnelCards"
          :key="item.label"
          class="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 px-4 py-4"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {{ item.label }}
          </p>
          <p class="mt-2 text-2xl font-black text-slate-900">
            {{ item.value }}
          </p>
          <p class="mt-2 text-xs text-slate-500">
            {{ item.detail }}
          </p>
        </article>
      </div>
    </OrganizationSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import DatePicker from '@/components/ui/DatePicker.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationMetricCard from '@/components/organization/OrganizationMetricCard.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useAnalyticsStore } from '@/store/modules/analytics'
import { useOrganizationStore } from '@/store/modules/organization'
import { useMessageStore } from '@/store/modules/messages'
import { adminApi } from '@/api/admin'
import { useOrganizationContext } from '@/composables/useOrganizationContext'
import { CalendarRangeIcon } from 'lucide-vue-next'

const analyticsStore = useAnalyticsStore()
const organizationStore = useOrganizationStore()
const messageStore = useMessageStore()
const { ensureOrganizationId } = useOrganizationContext()

const funnel = computed(() => analyticsStore.funnel)
const dashboard = computed(() => analyticsStore.dashboard)
const selectedReportPeriod = ref<'last_7_days' | 'last_30_days' | 'custom'>('last_30_days')
const customStart = ref('')
const customEnd = ref('')
const reportPeriodOptions = [
  { value: 'last_7_days', label: '近 7 天', description: '适合近期复盘' },
  { value: 'last_30_days', label: '近 30 天', description: '默认统计口径' },
  { value: 'custom', label: '自定义区间', description: '按需拉取统计与导出报表' }
] as const

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
  { label: '组织 ID', value: `${organizationStore.activeOrganizationId ?? '-'}`, detail: '当前统计范围' },
  { label: '统计区间', value: `${resolvedRange.value.start} ~ ${resolvedRange.value.end}`, detail: '查询与导出共用时间范围' }
])

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

const metrics = computed(() => [
  { label: '报名总数', value: `${dashboard.value?.signupCount ?? 0}`, detail: '统计区间内活动报名', tone: 'orange' as const },
  { label: '通过报名', value: `${dashboard.value?.approvedSignupCount ?? 0}`, detail: '已审核通过', tone: 'blue' as const },
  { label: '到场人数', value: `${dashboard.value?.attendanceCount ?? 0}`, detail: `到场率 ${Math.round(dashboard.value?.attendanceRate ?? 0)}%`, tone: 'green' as const },
  { label: '发放工时', value: `${dashboard.value?.grantedWorkHours ?? 0}h`, detail: '已结算服务时长', tone: 'slate' as const }
])

const funnelCards = computed(() => [
  { label: '注册', value: `${funnel.value?.registrationCount ?? 0}`, detail: '进入平台注册用户' },
  { label: '成员', value: `${funnel.value?.membershipCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.registrationToMembershipRate ?? 0)}%` },
  { label: '报名', value: `${funnel.value?.signupCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.membershipToSignupRate ?? 0)}%` },
  { label: '到场', value: `${funnel.value?.attendanceCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.signupToAttendanceRate ?? 0)}%` },
  { label: '工时', value: `${funnel.value?.workhourCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.attendanceToWorkhourRate ?? 0)}%` }
])

const loadAnalytics = async () => {
  const orgId = await ensureOrganizationId()
  if (!orgId) {
    messageStore.error('当前没有可用的组织 ID，暂时无法加载统计')
    return
  }

  try {
    await analyticsStore.fetchOrganizationAnalytics({
      orgId,
      start: resolvedRange.value.start,
      end: resolvedRange.value.end
    })
  } catch (error: any) {
    console.error('加载统计失败:', error)
    messageStore.error(error.message || '加载统计失败，请稍后重试')
  }
}

const exportOpsReport = async () => {
  const orgId = await ensureOrganizationId()
  if (!orgId) {
    messageStore.error('当前没有可用的组织 ID，暂时无法导出运营报表')
    return
  }

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
  }
}

onMounted(() => {
  void loadAnalytics()
})

watch([selectedReportPeriod, customStart, customEnd], () => {
  if (selectedReportPeriod.value === 'custom' && (!customStart.value || !customEnd.value)) {
    return
  }
  void loadAnalytics()
})
</script>
