<template>
  <WorkbenchPage>
    <WorkbenchHeroPanel tone="organization-amber">
      <div class="grid gap-5 2xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] 2xl:items-start">
        <div class="space-y-5">
          <div class="space-y-3">
            <span class="inline-flex items-center rounded-full bg-[#fff1ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#ec5b13]">
              活动统计
            </span>
            <div class="space-y-2">
              <h1 class="text-3xl font-black tracking-tight text-slate-900 lg:text-[2.2rem]">
                活动统计
              </h1>
              <p class="max-w-2xl text-sm leading-6 text-slate-600">
                查看活动维度报表，评估执行质量、报名转化与工时产出。
              </p>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            <div
              v-for="item in headerHighlights"
              :key="item.label"
              class="rounded-2xl border px-4 py-3 shadow-[0_14px_32px_-28px_rgba(120,53,15,0.32)]"
              :class="item.tone === 'accent'
                ? 'border-[#ffd7bf] bg-[#fff7f1]'
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
            </div>
          </div>
        </div>

        <div class="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,247,242,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_22px_52px_-42px_rgba(120,53,15,0.45)] lg:p-5">
          <div class="grid gap-3 sm:grid-cols-2">
            <article
              v-for="item in headerMeta"
              :key="item.label"
              class="rounded-2xl border border-[#ffd8c2] bg-[#fff8f4] px-4 py-4"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {{ item.label }}
              </p>
              <p class="mt-2 text-2xl font-black text-slate-900">
                {{ item.value }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{ item.detail }}
              </p>
            </article>
          </div>

          <div class="mt-4 rounded-[1.35rem] border border-slate-200 bg-white/90 px-4 py-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  统计口径
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ funnel.value?.start || '待确认' }} ~ {{ funnel.value?.end || '待确认' }}
                </p>
              </div>
              <div class="rounded-full border border-[#ffe0cc] bg-[#fff5ee] px-3 py-2 text-xs font-semibold text-[#b45309]">
                {{ analyticsStore.loading ? '统计刷新中' : '最近 30 天' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkbenchHeroPanel>

    <OrganizationSectionCard
      title="活动执行指标"
      description="从注册到工时发放，观察每个阶段的漏斗表现。"
    >
      <div class="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div class="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
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

        <article
          class="rounded-[1.4rem] border border-[#ffd8c2] bg-[linear-gradient(180deg,rgba(255,248,244,0.98),rgba(255,255,255,0.95))] px-5 py-5"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#ec5b13]">
            转化摘要
          </p>
          <div class="mt-4 space-y-4">
            <div
              v-for="item in conversionHighlights"
              :key="item.label"
              class="rounded-2xl border border-white/80 bg-white/90 px-4 py-4 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.18)]"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-slate-500">
                  {{ item.label }}
                </p>
                <span class="text-lg font-black text-slate-900">{{ item.value }}</span>
              </div>
              <p class="mt-2 text-xs text-slate-500">
                {{ item.detail }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </OrganizationSectionCard>
  </WorkbenchPage>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import WorkbenchHeroPanel from '@/components/workbench/WorkbenchHeroPanel.vue'
import WorkbenchPage from '@/components/workbench/WorkbenchPage.vue'
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
  { label: '工时转化', value: `${Math.round(funnel.value?.attendanceToWorkhourRate ?? 0)}%`, detail: '到场到工时发放的转化率' },
  { label: '成员沉淀', value: `${Math.round(funnel.value?.registrationToMembershipRate ?? 0)}%`, detail: '注册到成为成员的沉淀效率' }
])
const headerHighlights = computed(() => [
  { label: '注册人数', value: `${funnel.value?.registrationCount ?? 0}`, detail: '进入平台的潜在线索', tone: 'accent' },
  { label: '成员人数', value: `${funnel.value?.membershipCount ?? 0}`, detail: '完成沉淀并进入组织池', tone: 'neutral' },
  { label: '到场人数', value: `${funnel.value?.attendanceCount ?? 0}`, detail: '真正参与活动执行的人数', tone: 'neutral' }
])

const activityMetrics = computed(() => [
  { label: '注册人数', value: `${funnel.value?.registrationCount ?? 0}`, detail: '进入平台注册的总人数' },
  { label: '成员人数', value: `${funnel.value?.membershipCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.registrationToMembershipRate ?? 0)}%` },
  { label: '报名人数', value: `${funnel.value?.signupCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.membershipToSignupRate ?? 0)}%` },
  { label: '到场人数', value: `${funnel.value?.attendanceCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.signupToAttendanceRate ?? 0)}%` },
  { label: '工时发放', value: `${funnel.value?.workhourCount ?? 0}`, detail: `转化率 ${Math.round(funnel.value?.attendanceToWorkhourRate ?? 0)}%` }
])
const conversionHighlights = computed(() => [
  {
    label: '成员转报名',
    value: `${Math.round(funnel.value?.membershipToSignupRate ?? 0)}%`,
    detail: '观察成员被活动激活后的报名意愿'
  },
  {
    label: '报名转到场',
    value: `${Math.round(funnel.value?.signupToAttendanceRate ?? 0)}%`,
    detail: '衡量报名后的履约情况与现场执行质量'
  },
  {
    label: '到场转工时',
    value: `${Math.round(funnel.value?.attendanceToWorkhourRate ?? 0)}%`,
    detail: '查看到场人员是否顺利完成工时发放结算'
  }
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
