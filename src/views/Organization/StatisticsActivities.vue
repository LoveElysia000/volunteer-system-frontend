<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="活动统计"
      title="活动统计"
      description="聚焦报名、通过、到场和工时发放四个活动执行指标。"
      :meta-items="headerMeta"
      mode="compact"
    />

    <OrganizationSectionCard
      title="活动执行指标"
    >
      <div class="mb-4 rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <p class="font-semibold text-slate-900">
          统计口径
        </p>
        <p class="mt-1">
          {{ funnel.value?.start || '待确认' }} ~ {{ funnel.value?.end || '待确认' }}
        </p>
      </div>
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

const funnel = computed(() => analyticsStore.funnel)
const headerMeta = computed(() => [
  { label: '报名总数', value: `${funnel.value?.signupCount ?? 0}`, detail: '转化漏斗中的报名阶段' },
  { label: '到场转化', value: `${Math.round(funnel.value?.signupToAttendanceRate ?? 0)}%`, detail: '报名到到场的转化率' },
  { label: '工时转化', value: `${Math.round(funnel.value?.attendanceToWorkhourRate ?? 0)}%`, detail: '到场到工时发放的转化率' }
])

const activityMetrics = computed(() => [
  { label: '注册人数', value: `${funnel.value?.registrationCount ?? 0}`, detail: '进入平台注册的总人数' },
  { label: '成员人数', value: `${funnel.value?.membershipCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.registrationToMembershipRate ?? 0)}%` },
  { label: '报名人数', value: `${funnel.value?.signupCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.membershipToSignupRate ?? 0)}%` },
  { label: '到场人数', value: `${funnel.value?.attendanceCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.signupToAttendanceRate ?? 0)}%` },
  { label: '工时发放', value: `${funnel.value?.workhourCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.attendanceToWorkhourRate ?? 0)}%` }
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
