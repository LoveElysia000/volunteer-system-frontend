<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Analytics"
      title="数据统计"
      description="组织总览统计直接来自文档中的组织分析接口。"
      :meta-items="headerMeta"
    >
      <template #actions>
        <button
          class="org-toolbar-button org-toolbar-button--soft"
          @click="exportOpsReport"
        >
          导出运营报表
        </button>
        <button
          class="org-toolbar-button"
          :disabled="loading"
          @click="loadAnalytics"
        >
          {{ loading ? '加载中...' : '刷新统计' }}
        </button>
      </template>
    </OrganizationPageHeader>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
      description="注册、成员、报名、到场、工时五个环节的真实统计值。"
    >
      <div class="grid gap-4 md:grid-cols-5">
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
import { computed, onMounted } from 'vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationMetricCard from '@/components/organization/OrganizationMetricCard.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useAnalyticsStore } from '@/store/modules/analytics'
import { useOrganizationStore } from '@/store/modules/organization'
import { useMessageStore } from '@/store/modules/messages'
import { adminApi } from '@/api/admin'
import { useOrganizationContext } from '@/composables/useOrganizationContext'

const analyticsStore = useAnalyticsStore()
const organizationStore = useOrganizationStore()
const messageStore = useMessageStore()
const { ensureOrganizationId } = useOrganizationContext()

const loading = computed(() => analyticsStore.loading)
const funnel = computed(() => analyticsStore.funnel)
const dashboard = computed(() => analyticsStore.dashboard)

const headerMeta = computed(() => [
  { label: '组织 ID', value: `${organizationStore.activeOrganizationId ?? '-'}`, detail: '当前统计范围' },
  { label: '统计区间', value: dashboard.value?.start ? `${dashboard.value.start} ~ ${dashboard.value.end}` : '最近 30 天', detail: '接口返回时间范围' }
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

  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - 30)

  const formatDate = (value: Date) => value.toISOString().slice(0, 10)

  try {
    await analyticsStore.fetchOrganizationAnalytics({
      orgId,
      start: formatDate(startDate),
      end: formatDate(endDate)
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

  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - 30)
  const formatDate = (value: Date) => value.toISOString().slice(0, 10)

  try {
    const response = await adminApi.exportOpsReport({
      periodType: 'custom',
      orgId,
      start: formatDate(startDate),
      end: formatDate(endDate)
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
</script>
