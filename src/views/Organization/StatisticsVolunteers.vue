<template>
  <WorkbenchPage>
    <WorkbenchHeroPanel tone="organization-emerald">
      <div class="grid gap-5 2xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] 2xl:items-start">
        <div class="space-y-5">
          <div class="space-y-3">
            <span class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              志愿者统计
            </span>
            <div class="space-y-2">
              <h1 class="text-3xl font-black tracking-tight text-slate-900 lg:text-[2.2rem]">
                志愿者统计
              </h1>
              <p class="max-w-2xl text-sm leading-6 text-slate-600">
                查看志愿者从报名、通过到到场与工时发放的行为转化，判断参与活跃度和留存质量。
              </p>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            <div
              v-for="item in headerHighlights"
              :key="item.label"
              class="rounded-2xl border px-4 py-3 shadow-[0_14px_32px_-28px_rgba(21,128,61,0.25)]"
              :class="item.tone === 'accent'
                ? 'border-emerald-200 bg-emerald-50/80'
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

        <div class="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,251,246,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_22px_52px_-42px_rgba(21,128,61,0.35)] lg:p-5">
          <div class="grid gap-3 sm:grid-cols-2">
            <article
              v-for="item in headerMeta"
              :key="item.label"
              class="rounded-2xl border border-[#d5e8df] bg-[#f5fbf7] px-4 py-4"
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
                  {{ dashboard.value?.start || '待确认' }} ~ {{ dashboard.value?.end || '待确认' }}
                </p>
              </div>
              <div class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                {{ analyticsStore.dashboardLoading ? '统计刷新中' : '最近 30 天' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkbenchHeroPanel>

    <OrganizationSectionCard
      title="志愿者转化指标"
      description="从报名参与到最终到场和工时结算，追踪志愿者活跃度。"
    >
      <div class="grid gap-4 2xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div class="grid gap-4 md:grid-cols-2 2xl:grid-cols-2">
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

        <article
          class="rounded-[1.4rem] border border-[#d5e8df] bg-[linear-gradient(180deg,rgba(244,251,246,0.98),rgba(255,255,255,0.95))] px-5 py-5"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            活跃摘要
          </p>
          <div class="mt-4 space-y-4">
            <div
              v-for="item in volunteerHighlights"
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

const dashboard = computed(() => analyticsStore.dashboard)
const headerMeta = computed(() => [
  { label: '报名总数', value: `${dashboard.value?.signupCount ?? 0}`, detail: '复用组织看板汇总接口' },
  { label: '通过报名', value: `${dashboard.value?.approvedSignupCount ?? 0}`, detail: '已审核通过的报名人数' },
  { label: '到场率', value: `${Math.round(dashboard.value?.attendanceRate ?? 0)}%`, detail: '反映志愿者参与活跃度' },
  { label: '发放工时', value: `${dashboard.value?.grantedWorkHours ?? 0}h`, detail: '当前区间已结算工时' }
])
const headerHighlights = computed(() => [
  { label: '当前报名', value: `${dashboard.value?.signupCount ?? 0}`, detail: '进入活动参与池的志愿者', tone: 'accent' },
  { label: '实际到场', value: `${dashboard.value?.attendanceCount ?? 0}`, detail: '真正完成到场签到的人数', tone: 'neutral' },
  { label: '服务完成', value: `${dashboard.value?.grantedWorkHours ?? 0}h`, detail: '已成功沉淀为服务时长', tone: 'neutral' }
])

const volunteerMetrics = computed(() => [
  { label: '报名人数', value: `${dashboard.value?.signupCount ?? 0}`, detail: '当前统计区间内累计报名' },
  { label: '通过报名', value: `${dashboard.value?.approvedSignupCount ?? 0}`, detail: '已审核通过的报名人数' },
  { label: '到场人数', value: `${dashboard.value?.attendanceCount ?? 0}`, detail: `到场率 ${Math.round(dashboard.value?.attendanceRate ?? 0)}%` },
  { label: '发放工时', value: `${dashboard.value?.grantedWorkHours ?? 0}h`, detail: '当前统计区间内已结算工时' }
])
const volunteerHighlights = computed(() => [
  {
    label: '报名通过率',
    value: `${approvedRate.value}%`,
    detail: '判断当前报名审核是否顺畅，避免积压影响参与'
  },
  {
    label: '到场率',
    value: `${Math.round(dashboard.value?.attendanceRate ?? 0)}%`,
    detail: '衡量志愿者报名后是否稳定到场，反映组织触达效果'
  },
  {
    label: '人均工时',
    value: `${averageHours.value}h`,
    detail: '观察实际到场后的人均服务投入强度'
  }
])
const approvedRate = computed(() => {
  const signupCount = dashboard.value?.signupCount ?? 0
  if (!signupCount) return 0
  return Math.round(((dashboard.value?.approvedSignupCount ?? 0) / signupCount) * 100)
})
const averageHours = computed(() => {
  const attendanceCount = dashboard.value?.attendanceCount ?? 0
  if (!attendanceCount) return '0.0'
  return ((dashboard.value?.grantedWorkHours ?? 0) / attendanceCount).toFixed(1)
})

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
    await analyticsStore.fetchOrganizationDashboard({
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
