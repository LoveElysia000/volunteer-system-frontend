<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="志愿者统计"
      title="志愿者统计"
      description="通过漏斗接口查看注册、成员、报名和到场的转化关系。"
      :meta-items="headerMeta"
      mode="compact"
    />

    <OrganizationSectionCard
      title="志愿者转化指标"
    >
      <div class="mb-4 rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <p class="font-semibold text-slate-900">
          统计口径
        </p>
        <p class="mt-1">
          {{ dashboard.value?.start || '待确认' }} ~ {{ dashboard.value?.end || '待确认' }}
        </p>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="item in volunteerMetrics"
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
  { label: '报名总数', value: `${dashboard.value?.signupCount ?? 0}`, detail: '复用组织看板汇总接口' },
  { label: '到场率', value: `${Math.round(dashboard.value?.attendanceRate ?? 0)}%`, detail: '反映志愿者参与活跃度' }
])

const volunteerMetrics = computed(() => [
  { label: '报名人数', value: `${dashboard.value?.signupCount ?? 0}`, detail: '当前统计区间内累计报名' },
  { label: '通过报名', value: `${dashboard.value?.approvedSignupCount ?? 0}`, detail: '已审核通过的报名人数' },
  { label: '到场人数', value: `${dashboard.value?.attendanceCount ?? 0}`, detail: `到场率 ${Math.round(dashboard.value?.attendanceRate ?? 0)}%` },
  { label: '发放工时', value: `${dashboard.value?.grantedWorkHours ?? 0}h`, detail: '当前统计区间内已结算工时' }
])

const loadAnalytics = async () => {
  const orgId = await ensureOrganizationId()
  if (!orgId) {
    messageStore.error('当前没有可用的组织 ID，暂时无法加载志愿者统计')
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
    console.error('加载志愿者统计失败:', error)
    messageStore.error(error.message || '加载志愿者统计失败，请稍后重试')
  }
}

onMounted(() => {
  void loadAnalytics()
})
</script>
