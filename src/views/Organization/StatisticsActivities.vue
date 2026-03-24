<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Activity Stats"
      title="活动统计"
      description="聚焦报名、通过、到场和工时发放四个活动执行指标。"
      :meta-items="headerMeta"
      mode="compact"
    />

    <OrganizationSectionCard
      title="活动执行指标"
      description="保留当前组织端视觉风格，但数据来自真实统计接口。"
    >
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="item in activityMetrics"
          :key="item.label"
          class="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 px-4 py-4"
        >
          <p class="text-sm font-semibold text-slate-500">
            {{ item.label }}
          </p>
          <p class="mt-2 text-3xl font-black text-slate-900">
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
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useAnalyticsStore } from '@/store/modules/analytics'
import { useMessageStore } from '@/store/modules/messages'
import { useOrganizationContext } from '@/composables/useOrganizationContext'

const analyticsStore = useAnalyticsStore()
const messageStore = useMessageStore()
const { ensureOrganizationId } = useOrganizationContext()

const dashboard = computed(() => analyticsStore.dashboard)
const headerMeta = computed(() => [
  { label: '报名总数', value: `${dashboard.value?.signupCount ?? 0}`, detail: '活动执行起点' },
  { label: '到场率', value: `${Math.round(dashboard.value?.attendanceRate ?? 0)}%`, detail: '真实接口结果' }
])

const activityMetrics = computed(() => [
  { label: '报名人数', value: `${dashboard.value?.signupCount ?? 0}`, detail: '统计区间内累计报名' },
  { label: '通过人数', value: `${dashboard.value?.approvedSignupCount ?? 0}`, detail: '审核通过后进入执行' },
  { label: '到场人数', value: `${dashboard.value?.attendanceCount ?? 0}`, detail: '实际完成签到' },
  { label: '发放工时', value: `${dashboard.value?.grantedWorkHours ?? 0}h`, detail: '签到签退后已结算' }
])

const loadAnalytics = async () => {
  const orgId = await ensureOrganizationId()
  if (!orgId) {
    messageStore.error('当前没有可用的组织 ID，暂时无法加载活动统计')
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
    console.error('加载活动统计失败:', error)
    messageStore.error(error.message || '加载活动统计失败，请稍后重试')
  }
}

onMounted(() => {
  void loadAnalytics()
})
</script>
