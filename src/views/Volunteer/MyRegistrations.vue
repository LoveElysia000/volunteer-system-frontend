<template>
  <DataListPage>
    <template #header>
      <VolunteerPageHeader
        eyebrow="我的报名"
        title="确认本周已预约任务"
        description="在同一页面里完成行前核对、优先排序和准备动作，避免临近活动时手忙脚乱。"
        :meta-items="headerMeta"
        layout="operations"
      >
        <template #summary>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            当前状态 / {{ registrationStatusSummary }}
          </span>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            检索关键词 / {{ registrationKeywordSummary }}
          </span>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            列表规模 / {{ pageSize }} 条/页
          </span>
        </template>
        <template #actions>
          <div class="grid w-full gap-3 2xl:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              v-model.trim="keyword"
              placeholder="搜索报名记录或活动名称"
              allow-clear
              theme="emerald"
            />
            <RouterLink
              to="/volunteer/activities"
              class="volunteer-toolbar-button volunteer-toolbar-button--soft min-h-[48px] w-full 2xl:w-auto"
            >
              继续报名活动
            </RouterLink>
          </div>
        </template>
      </VolunteerPageHeader>
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-500">
              建议先筛出本周内活动，再按时间顺序检查路线、签到和物资准备。
            </div>
            <FilterSelect
              v-model="statusFilter"
              title="报名状态"
              :options="statusOptions"
              theme="emerald"
            />
            <FilterSelect
              v-model="pageSize"
              title="每页条数"
              :options="pageSizeOptions"
              theme="emerald"
            />
          </div>
        </template>

        <template #summary>
          <span class="text-sm text-slate-500">第 {{ page }} / {{ totalPages }} 页</span>
        </template>

        <template #actions>
          <div class="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              :disabled="loading || page <= 1"
              @click="goToPreviousPage"
            >
              上一页
            </Button>
            <Button
              variant="outline"
              :disabled="loading || page >= totalPages"
              @click="goToNextPage"
            >
              下一页
            </Button>
          </div>
        </template>
      </DataToolbar>
    </template>

    <template #body>
      <div class="grid gap-6 2xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
        <VolunteerSectionCard
          class="volunteer-registration-ops"
          title="行前运营面板"
          description="按时间优先级处理最接近开始的活动，减少漏签到风险。"
        >
          <div class="space-y-5">
            <div class="grid gap-4 md:grid-cols-3">
              <VolunteerSummaryCard
                label="报名记录"
                :value="String(registeredActivities.length)"
                detail="包含待审核、成功、驳回与取消"
                tone="blue"
                class="volunteer-surface-lift"
              />
              <VolunteerSummaryCard
                label="待参与记录"
                :value="String(soonCount)"
                detail="优先查看时间提醒"
                tone="green"
                class="volunteer-surface-lift"
              />
              <VolunteerSummaryCard
                label="平均服务时长"
                :value="`${averageDuration}h`"
                detail="按活动排班估算"
                tone="amber"
                class="volunteer-surface-lift"
              />
            </div>

            <DataList
              :items="sortedRegistrations"
              :loading="loading"
              row-key="id"
              :selected-key="selectedRegistrationId"
              interactive
              open-text="查看详情"
              open-style="text"
              empty-title="当前没有匹配的报名记录"
              empty-description="调整报名状态或关键词后再试，新的报名记录也会显示在这里。"
              @row-click="openRegistrationDrawer"
            >
              <template #default="{ item }">
                <div class="space-y-3">
                  <div class="flex flex-wrap items-center gap-3">
                    <h3 class="text-lg font-bold text-slate-900">
                      {{ item.title }}
                    </h3>
                    <VolunteerStatusBadge
                      :label="registrationBadgeLabel(item)"
                      :tone="registrationBadgeTone(item)"
                    />
                  </div>
                  <p class="text-sm leading-6 text-slate-600">
                    {{ item.description }}
                  </p>
                  <div class="grid gap-2 text-sm text-slate-500 sm:grid-cols-2 2xl:grid-cols-4">
                    <p>时间：{{ item.timeRange }}</p>
                    <p>地点：{{ item.location }}</p>
                    <p>报名进度：{{ registrationProgressText(item) }}</p>
                    <p>预计服务：{{ item.duration }} 小时</p>
                    <p class="font-semibold text-emerald-700 sm:col-span-2 2xl:col-span-1">
                      {{ item.orgName || '所属组织待确认' }}
                    </p>
                  </div>
                </div>
              </template>
            </DataList>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="报名检查清单"
          description="活动开始前逐项确认，可以明显降低迟到和缺席情况。"
          tone="soft"
        >
          <ul class="volunteer-aside-stack">
            <li
              v-for="item in registrationChecklist"
              :key="item.label"
              class="volunteer-surface-lift rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-slate-900">
                  {{ item.label }}
                </p>
                <span
                  class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  :class="item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ item.done ? '已完成' : '待处理' }}
                </span>
              </div>
              <p class="mt-2 text-xs leading-5 text-slate-500">
                {{ item.detail }}
              </p>
            </li>
          </ul>
        </VolunteerSectionCard>
      </div>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="560px"
        :aria-label="selectedRegistration ? `${selectedRegistration.title} 的报名详情` : '报名详情'"
        @close="closeRegistrationDrawer"
      >
        <template #header>
          <div
            v-if="selectedRegistration"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                报名详情
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                {{ selectedRegistration.title }}
              </h2>
              <p class="text-sm text-slate-500">
                {{ selectedRegistration.orgName || '所属组织待确认' }}
              </p>
            </div>

            <VolunteerStatusBadge
              :label="registrationBadgeLabel(selectedRegistration)"
              :tone="registrationBadgeTone(selectedRegistration)"
            />
          </div>
        </template>

        <div
          v-if="selectedRegistration"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  活动时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRegistration.timeRange }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  活动地点
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRegistration.location }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  预计服务时长
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRegistration.duration }} 小时
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  活动状态
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ registrationActivityStatusText(selectedRegistration.activityStatus) }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  报名进度
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ registrationProgressText(selectedRegistration) }}
                </p>
              </div>
              <div v-if="selectedRegistration.signupTime">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  报名时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ formatDateTime(selectedRegistration.signupTime) }}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              活动说明
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ selectedRegistration.description }}
            </p>

            <div
              v-if="selectedRegistration.auditReason"
              class="mt-4"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                审核备注
              </p>
              <p class="mt-1 text-sm leading-6 text-slate-700">
                {{ selectedRegistration.auditReason }}
              </p>
            </div>
          </section>
        </div>

        <WorkbenchEmptyPanel v-else>
          点击报名记录查看详情和后续提醒。
        </WorkbenchEmptyPanel>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              v-if="selectedRegistration"
              variant="ghost"
              rounded
              @click="handleViewDetails(selectedRegistration.id)"
            >
              查看完整页面
            </Button>
          </div>
        </template>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataList from '@/components/data-list/DataList.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import WorkbenchEmptyPanel from '@/components/workbench/WorkbenchEmptyPanel.vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import { activitiesApi, mapRegisteredActivityItemToVolunteerView } from '@/api/activities'
import { useMessageStore } from '@/store/modules/messages'
import {
  ActivitySignupStatus,
  type VolunteerActivityViewItem
} from '@/types/activity'
import { BACKEND_ACTIVITY_SIGNUP_STATUS, BACKEND_ACTIVITY_STATUS } from '@/constants/activityEnums'
import { shouldRefreshOnKeepAliveActivated } from '@/utils/keepAliveRefresh'
import { buildVolunteerMyRegistrationsRequest, countUpcomingParticipations } from './activityFeed'

const route = useRoute()
const router = useRouter()
const messageStore = useMessageStore()
const loading = ref(false)
const keyword = ref('')
const statusFilter = ref<ActivitySignupStatus | ''>('')
const page = ref(1)
const pageSize = ref(20)
const registeredActivities = ref<VolunteerActivityViewItem[]>([])
const total = ref(0)
const selectedRegistrationId = ref<number | null>(null)
const selectedRegistrationSnapshot = ref<VolunteerActivityViewItem | null>(null)
const drawerOpen = ref(false)
const hasLoadedOnce = ref(false)
const hasActivatedOnce = ref(false)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const statusOptions = [
  { key: 'registration-status-all', value: '', label: '全部报名状态', description: '查看所有报名记录' },
  { key: 'registration-status-pending', value: ActivitySignupStatus.PENDING, label: '待审核', description: '等待组织审核处理' },
  { key: 'registration-status-success', value: ActivitySignupStatus.SUCCESS, label: '报名成功', description: '报名已生效，可按活动安排参与' },
  { key: 'registration-status-rejected', value: ActivitySignupStatus.REJECTED, label: '已驳回', description: '审核未通过，可查看备注' },
  { key: 'registration-status-cancelled', value: ActivitySignupStatus.CANCELLED, label: '已取消', description: '报名已取消或已失效' }
] as const
const pageSizeOptions = [
  { key: 'registration-page-10', value: 10, label: '每页 10 条', description: '紧凑浏览' },
  { key: 'registration-page-20', value: 20, label: '每页 20 条', description: '默认密度' },
  { key: 'registration-page-50', value: 50, label: '每页 50 条', description: '适合集中处理' }
] as const
const loadRegisteredActivities = async () => {
  loading.value = true

  try {
    const response = await activitiesApi.listRegisteredActivities(
      buildVolunteerMyRegistrationsRequest({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value,
        statusFilter: statusFilter.value
      })
    )

    if (response.code !== 200) {
      throw new Error(response.msg || '获取我的报名失败')
    }

    registeredActivities.value = response.data.list
      .map(mapRegisteredActivityItemToVolunteerView)
    total.value = response.data.total || 0
  } catch (error: any) {
    console.error('加载我的报名失败:', error)
    messageStore.error(error.message || '加载我的报名失败，请稍后重试')
    registeredActivities.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  hasLoadedOnce.value = true
  void loadRegisteredActivities()
})

onActivated(() => {
  if (!hasActivatedOnce.value) {
    hasActivatedOnce.value = true
    return
  }

  if (!shouldRefreshOnKeepAliveActivated({
    currentRouteName: String(route.name || ''),
    expectedRouteName: 'volunteer-my-registrations',
    hasLoadedOnce: hasLoadedOnce.value,
    hasActivatedOnce: hasActivatedOnce.value
  })) {
    return
  }

  void loadRegisteredActivities()
})

const sortedRegistrations = computed<VolunteerActivityViewItem[]>(() => {
  return [...registeredActivities.value].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
})

const selectedRegistration = computed(() => {
  if (selectedRegistrationId.value === null) {
    return null
  }

  return sortedRegistrations.value.find((item) => item.id === selectedRegistrationId.value) ?? selectedRegistrationSnapshot.value
})

const soonCount = computed(() => countUpcomingParticipations(sortedRegistrations.value))
const averageDuration = computed(() => {
  if (!registeredActivities.value.length) return 0
  const totalDuration = registeredActivities.value.reduce((sum, item) => sum + item.duration, 0)
  return Number((totalDuration / registeredActivities.value.length).toFixed(1))
})

const headerMeta = computed(() => [
  { label: '报名记录', value: `${registeredActivities.value.length} 条`, detail: '覆盖不同报名状态' },
  { label: '近期优先', value: `${soonCount.value} 场`, detail: '建议提前确认路线' },
  { label: '分页进度', value: `${page.value}/${totalPages.value}`, detail: `共 ${total.value} 条报名记录` }
])

const registrationStatusSummary = computed(() => (
  statusOptions.find((option) => option.value === statusFilter.value)?.label || '全部报名状态'
))

const registrationKeywordSummary = computed(() => (
  keyword.value.trim() ? `“${keyword.value.trim()}”` : '未设置'
))

const registrationChecklist = [
  { label: '确认签到时间', detail: '建议活动开始前 20 分钟到场，预留物资领取时间。', done: true },
  { label: '查看路线与交通', detail: '高峰时段活动建议提前规划到场路线。', done: false },
  { label: '准备个人物资', detail: '水杯、手套、帽子和雨具会提升现场协作效率。', done: false }
]

const syncSelectedRegistration = () => {
  if (selectedRegistrationId.value === null) {
    return
  }

  const refreshedActivity = registeredActivities.value.find((item) => item.id === selectedRegistrationId.value)
  if (refreshedActivity) {
    selectedRegistrationSnapshot.value = refreshedActivity
  }
}

const openRegistrationDrawer = (activity: Record<string, any>) => {
  const registration = activity as VolunteerActivityViewItem

  selectedRegistrationId.value = registration.id
  selectedRegistrationSnapshot.value = registration
  drawerOpen.value = true
}

const closeRegistrationDrawer = () => {
  drawerOpen.value = false
  selectedRegistrationId.value = null
  selectedRegistrationSnapshot.value = null
}

const registrationBadgeLabel = (item: VolunteerActivityViewItem | Record<string, any>) => {
  const registration = item as VolunteerActivityViewItem
  if (registration.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.PENDING) return '待审核'
  if (registration.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.REJECTED) return '已驳回'
  if (registration.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.CANCELED) return '已取消报名'
  return registration.userRegistrationStatus === 'registered' ? '报名成功' : '未生效'
}

const registrationBadgeTone = (item: VolunteerActivityViewItem | Record<string, any>) => {
  const registration = item as VolunteerActivityViewItem
  if (registration.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.PENDING) return 'amber'
  if (registration.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.REJECTED) return 'rose'
  if (registration.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.CANCELED) return 'slate'
  return 'blue'
}

const registrationProgressText = (item: VolunteerActivityViewItem | Record<string, any>) => {
  const registration = item as VolunteerActivityViewItem
  if (registration.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.PENDING) return '等待组织审核'
  if (registration.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.REJECTED) return '审核未通过'
  if (registration.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.CANCELED) return '已取消报名'
  return '报名已生效'
}

const registrationActivityStatusText = (status: VolunteerActivityViewItem['activityStatus']) => ({
  [BACKEND_ACTIVITY_STATUS.RECRUITING]: '招募中',
  [BACKEND_ACTIVITY_STATUS.FINISHED]: '已结束',
  [BACKEND_ACTIVITY_STATUS.CANCELED]: '已取消'
}[status] || String(status))

const formatDateTime = (value?: string) => {
  if (!value) return '待确认'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const handleViewDetails = async (id: number) => {
  await router.push(`/volunteer/activities/${id}`)
}

const goToPreviousPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await loadRegisteredActivities()
}

const goToNextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await loadRegisteredActivities()
}

watch(registeredActivities, () => {
  syncSelectedRegistration()
})

watch([keyword, statusFilter, pageSize], () => {
  page.value = 1
  void loadRegisteredActivities()
})
</script>
