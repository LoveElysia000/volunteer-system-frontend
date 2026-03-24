<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Volunteer Stats"
      title="志愿者统计"
      description="通过漏斗接口查看注册、成员、报名和到场的转化关系。"
      :meta-items="headerMeta"
      mode="compact"
    />

    <OrganizationSectionCard
      title="志愿者转化指标"
      description="该页聚焦成员沉淀和报名转化。"
    >
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

const funnel = computed(() => analyticsStore.funnel)
const headerMeta = computed(() => [
  { label: '成员数', value: `${funnel.value?.membershipCount ?? 0}`, detail: '从注册沉淀而来' },
  { label: '成员转报名', value: `${Math.round(funnel.value?.membershipToSignupRate ?? 0)}%`, detail: '反映成员活跃度' }
])

const volunteerMetrics = computed(() => [
  { label: '注册人数', value: `${funnel.value?.registrationCount ?? 0}`, detail: '进入平台的总人数' },
  { label: '成员人数', value: `${funnel.value?.membershipCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.registrationToMembershipRate ?? 0)}%` },
  { label: '报名人数', value: `${funnel.value?.signupCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.membershipToSignupRate ?? 0)}%` },
  { label: '到场人数', value: `${funnel.value?.attendanceCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.signupToAttendanceRate ?? 0)}%` }
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
