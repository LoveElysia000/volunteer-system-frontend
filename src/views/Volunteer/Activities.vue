<template>
  <DataListPage>
    <template #header>
      <VolunteerPageHeader
        eyebrow="活动列表"
        title="发现并安排本周任务"
        description="把筛选、报名和优先事项集中在一个视图内，减少页面切换和遗漏。"
        :meta-items="summaryMeta"
        layout="operations"
      >
        <template #summary>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            当前视图 / {{ activeTabLabel }}
          </span>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            关键词 / {{ searchSummaryLabel }}
          </span>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            时间范围 / {{ dateRangeSummary }}
          </span>
        </template>
        <template #actions>
          <div class="grid w-full gap-3 2xl:grid-cols-[minmax(0,1fr)_auto_auto]">
            <Input
              v-model="searchQuery"
              placeholder="搜索活动名称、地点或描述"
              :icon="SearchIcon"
              allow-clear
              theme="emerald"
              class="min-w-0 2xl:min-w-[240px]"
            />
            <Button
              variant="outline"
              rounded
              class="min-h-[48px] w-full 2xl:w-auto"
              @click="clearFilters"
            >
              重置筛选
            </Button>
            <RouterLink
              to="/volunteer/activities/my-registrations"
              class="volunteer-toolbar-button volunteer-toolbar-button--soft min-h-[48px] w-full 2xl:w-auto"
            >
              我的报名
            </RouterLink>
          </div>
        </template>
      </VolunteerPageHeader>
    </template>

    <template #toolbar>
      <VolunteerSectionCard
        class="volunteer-activity-command-board"
        title="任务指挥台"
        description="先选状态，再按关键词筛选，再通过右侧抽屉完成报名和查看。"
      >
        <div class="space-y-5">
          <div class="grid gap-4 md:grid-cols-3">
            <VolunteerSummaryCard
              v-for="card in activityPulseCards"
              :key="card.label"
              :label="card.label"
              :value="card.value"
              :detail="card.detail"
              :tone="card.tone"
              class="volunteer-surface-lift"
            />
          </div>

          <DataToolbar>
            <template #filters>
              <div class="data-list-filter-stack">
                <button
                  v-for="tab in filterTabs"
                  :key="tab.id"
                  class="data-list-chip"
                  :class="tab.id === activeTab ? 'data-list-chip-active-green' : 'data-list-chip-neutral'"
                  @click="setActiveTab(tab.id)"
                >
                  {{ tab.label }}
                </button>
              </div>
            </template>

            <template #actions>
              <div class="grid gap-3 2xl:grid-cols-[200px_200px_220px]">
                <DatePicker
                  v-model="startFrom"
                  placeholder="开始日期"
                  mode="date"
                  theme="emerald"
                />
                <DatePicker
                  v-model="endTo"
                  placeholder="结束日期"
                  mode="date"
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
          </DataToolbar>
        </div>
      </VolunteerSectionCard>
    </template>

    <template #body>
      <div class="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
        <VolunteerSectionCard
          title="活动列表"
          description="浏览当前筛选结果，点击一行在右侧查看详情并完成报名或取消。"
        >
          <div class="data-list-inline-bar">
            <p>
              当前共找到
              <span class="font-semibold text-slate-800">{{ filteredActivities.length }}</span>
              个匹配活动
            </p>
            <div class="data-list-inline-actions">
              <span class="data-list-pagination">第 {{ page }} / {{ totalPages }} 页</span>
              <Button
                variant="outline"
                rounded
                :disabled="loading || page <= 1"
                @click="goToPreviousPage"
              >
                上一页
              </Button>
              <Button
                variant="outline"
                rounded
                :disabled="loading || page >= totalPages"
                @click="goToNextPage"
              >
                下一页
              </Button>
            </div>
          </div>

          <DataList
            :items="filteredActivities"
            :loading="loading"
            row-key="id"
            :selected-key="selectedActivityId"
            interactive
            open-text="查看详情"
            empty-title="当前没有匹配结果"
            empty-description="可以尝试切换筛选条件，或清空关键词后重新查看。"
            @row-click="openActivityDrawer"
          >
            <template #default="{ item }">
              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                  <StatusBadge
                    :label="getStatusText(item.activityStatus)"
                    :tone="getStatusTone(item.activityStatus)"
                  />
                  <StatusBadge
                    :label="item.userRegistrationStatus === 'registered' ? '已报名' : '待报名'"
                    :tone="item.userRegistrationStatus === 'registered' ? 'blue' : 'amber'"
                  />
                  <span
                    v-if="item.tag"
                    class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                  >
                    {{ item.tag }}
                  </span>
                </div>

                <div>
                  <h3 class="text-lg font-bold tracking-tight text-slate-900">
                    {{ item.title }}
                  </h3>
                  <p class="mt-2 text-sm leading-6 text-slate-600">
                    {{ item.description }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>{{ item.timeRange }}</span>
                  <span>{{ item.location }}</span>
                  <span>{{ item.duration }} 小时</span>
                  <span>{{ item.participants }}/{{ item.capacity }} 名额</span>
                  <span class="font-semibold text-emerald-700">{{ item.orgName || item.tag || '活动任务' }}</span>
                </div>
              </div>
            </template>
          </DataList>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="优先处理"
          description="按名额压力与参与状态排序，优先处理最紧急任务。"
          tone="soft"
        >
          <div class="volunteer-aside-stack">
            <article
              v-for="item in activityPriorityQueue"
              :key="item.id"
              class="volunteer-surface-lift rounded-[1.25rem] border border-white/70 bg-white/90 px-4 py-4 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.45)]"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="line-clamp-1 text-sm font-bold text-slate-900">
                  {{ item.title }}
                </p>
                <span
                  class="rounded-full px-2 py-1 text-[11px] font-semibold"
                  :class="item.userRegistrationStatus === 'registered' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ item.userRegistrationStatus === 'registered' ? '已报名' : '待报名' }}
                </span>
              </div>
              <p class="mt-2 text-xs text-slate-500">
                {{ item.timeRange }} · {{ item.location }}
              </p>
              <div class="mt-3 flex items-center justify-between text-xs">
                <span class="font-semibold text-slate-500">
                  余量 {{ item.remainingSeats }} / {{ item.capacity }}
                </span>
                <span class="font-semibold text-emerald-700">
                  {{ item.orgName || item.tag || '活动任务' }}
                </span>
              </div>
            </article>
          </div>
        </VolunteerSectionCard>
      </div>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="560px"
        :aria-label="selectedActivity ? `${selectedActivity.title} 的活动详情` : '活动详情'"
        @close="closeActivityDrawer"
      >
        <template #header>
          <div
            v-if="selectedActivity"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                活动详情
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                {{ selectedActivity.title }}
              </h2>
              <p class="text-sm text-slate-500">
                {{ selectedActivity.orgName || selectedActivity.tag || '活动任务' }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <StatusBadge
                :label="getStatusText(selectedActivity.activityStatus)"
                :tone="getStatusTone(selectedActivity.activityStatus)"
              />
              <StatusBadge
                :label="selectedActivity.userRegistrationStatus === 'registered' ? '已报名' : '待报名'"
                :tone="selectedActivity.userRegistrationStatus === 'registered' ? 'blue' : 'amber'"
              />
            </div>
          </div>
        </template>

        <div
          v-if="selectedActivity"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  活动时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedActivity.timeRange }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  活动地点
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedActivity.location }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  服务时长
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedActivity.duration }} 小时
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  名额情况
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedActivity.participants }}/{{ selectedActivity.capacity }}
                </p>
              </div>
            </div>
          </section>

          <section class="space-y-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                活动说明
              </p>
              <p class="mt-1 text-sm leading-6 text-slate-700">
                {{ selectedActivity.description }}
              </p>
            </div>

            <div
              v-if="selectedActivity.auditReason"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                审核备注
              </p>
              <p class="mt-1 text-sm leading-6 text-slate-700">
                {{ selectedActivity.auditReason }}
              </p>
            </div>
          </section>
        </div>

        <WorkbenchEmptyPanel v-else>
          点击活动行查看详情，并在抽屉中完成报名或取消操作。
        </WorkbenchEmptyPanel>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              v-if="canRegisterSelected"
              variant="success"
              rounded
              :loading="isSelectedActivityLoading"
              @click="handleRegister(selectedActivity!.id)"
            >
              立即报名
            </Button>
            <Button
              v-if="canCancelSelected"
              variant="outline"
              rounded
              :loading="isSelectedActivityLoading"
              @click="handleCancel(selectedActivity!.id)"
            >
              取消报名
            </Button>
            <Button
              v-if="selectedActivity"
              variant="ghost"
              rounded
              @click="handleViewDetails(selectedActivity.id)"
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
import { computed, onActivated, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { SearchIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import DatePicker from '@/components/ui/DatePicker.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import WorkbenchEmptyPanel from '@/components/workbench/WorkbenchEmptyPanel.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DataList from '@/components/data-list/DataList.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import { activitiesApi, mapActivityItemToVolunteerView } from '@/api/activities'
import { useMessageStore } from '@/store/modules/messages'
import { usePageStateStore } from '@/store/modules/pageState'
import type { VolunteerActivityViewItem } from '@/types/activity'
import {
  buildVolunteerActivityListRequest,
  buildVolunteerActivityRouteQuery,
  normalizeVolunteerActivityRoute,
  type ActivityTab
} from './activityFeed'
import { planVolunteerActivityRouteSync } from './activityPageState'
import { BACKEND_ACTIVITY_STATUS } from '@/constants/activityEnums'
import { shouldRefreshOnKeepAliveActivated } from '@/utils/keepAliveRefresh'

type VolunteerTone = 'green' | 'blue' | 'amber' | 'rose'

interface FilterTab {
  id: ActivityTab
  label: string
}

interface ActivityPulseCard {
  label: string
  value: string
  detail: string
  tone: VolunteerTone
}

interface ActivityPriorityItem extends VolunteerActivityViewItem {
  remainingSeats: number
  priorityScore: number
}

const route = useRoute()
const router = useRouter()
const messageStore = useMessageStore()
const pageStateStore = usePageStateStore()
const activeTab = ref<ActivityTab>(pageStateStore.state.volunteerActivities.activeTab as ActivityTab || 'all')
const searchQuery = ref(pageStateStore.state.volunteerActivities.searchQuery || '')
const startFrom = ref('')
const endTo = ref('')
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const actionActivityId = ref<number | null>(null)
const activityRows = ref<VolunteerActivityViewItem[]>([])
const total = ref(0)
const selectedActivityId = ref<number | null>(null)
const selectedActivitySnapshot = ref<VolunteerActivityViewItem | null>(null)
const drawerOpen = ref(false)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const pageSizeOptions = [
  { key: 'activities-page-10', value: 10, label: '每页 10 条', description: '适合快速浏览' },
  { key: 'activities-page-20', value: 20, label: '每页 20 条', description: '默认密度' },
  { key: 'activities-page-50', value: 50, label: '每页 50 条', description: '适合批量查看' }
] as const
const hasLoadedOnce = ref(false)
const hasActivatedOnce = ref(false)
const isApplyingRouteState = ref(false)
const isSyncingRouteFromLocalState = ref(false)

const filterTabs: FilterTab[] = [
  { id: 'all', label: '全部活动' },
  { id: 'recruiting', label: '招募中' },
  { id: 'finished', label: '已结束' },
  { id: 'canceled', label: '已取消' }
]

function applyRouteState(nextRouteState: ReturnType<typeof normalizeVolunteerActivityRoute>) {
  activeTab.value = nextRouteState.tab
  searchQuery.value = nextRouteState.search
  startFrom.value = nextRouteState.startFrom
  endTo.value = nextRouteState.endTo
}

function currentRouteState() {
  return {
    tab: activeTab.value,
    search: searchQuery.value,
    startFrom: startFrom.value,
    endTo: endTo.value,
    activityId: selectedActivityId.value
  }
}

function openActivityFromQuery() {
  const { activityId } = normalizeVolunteerActivityRoute(route.query)
  if (activityId === null) {
    return
  }

  const target = activityRows.value.find((item) => item.id === activityId)
  if (target) {
    openActivityDrawer(target)
  }
}

watch(() => [route.name, route.query] as const, async ([routeName, query], previousValue) => {
  const plan = planVolunteerActivityRouteSync({
    routeName: String(routeName || ''),
    previousRouteName: previousValue?.[0] ? String(previousValue[0]) : undefined,
    query,
    hasLoadedOnce: hasLoadedOnce.value,
    currentState: currentRouteState()
  })

  isApplyingRouteState.value = true
  applyRouteState(plan.nextState)
  selectedActivityId.value = plan.nextState.activityId
  if (plan.nextState.activityId === null) {
    drawerOpen.value = false
    selectedActivitySnapshot.value = null
  }
  isApplyingRouteState.value = false

  if (plan.shouldResetPage) {
    page.value = 1
  }

  if (plan.shouldRefresh && !isSyncingRouteFromLocalState.value) {
    await refreshActivities()
  }

  if (plan.shouldOpenFromQuery) {
    openActivityFromQuery()
  }
}, { immediate: true, deep: true })

onActivated(async () => {
  if (!hasActivatedOnce.value) {
    hasActivatedOnce.value = true
    return
  }

  if (!shouldRefreshOnKeepAliveActivated({
    currentRouteName: String(route.name || ''),
    expectedRouteName: 'volunteer-activities',
    hasLoadedOnce: hasLoadedOnce.value,
    hasActivatedOnce: hasActivatedOnce.value
  })) {
    return
  }

  await refreshActivities()
  openActivityFromQuery()
})

watch([activeTab, searchQuery, startFrom, endTo, drawerOpen, selectedActivityId], ([tab, search, from, to, isDrawerOpen, selectedId]) => {
  if (isApplyingRouteState.value) {
    return
  }

  const query = buildVolunteerActivityRouteQuery({
    tab,
    search,
    startFrom: from,
    endTo: to,
    activityId: isDrawerOpen ? selectedId : null
  })
  const currentQuery = buildVolunteerActivityRouteQuery(normalizeVolunteerActivityRoute(route.query))

  if (JSON.stringify(query) !== JSON.stringify(currentQuery)) {
    isSyncingRouteFromLocalState.value = true
    void router.replace({ query }).finally(() => {
      isSyncingRouteFromLocalState.value = false
    })
  }

  pageStateStore.updateVolunteerActivitiesState({ activeTab: tab, searchQuery: search })
})

const filteredActivities = computed(() => activityRows.value.filter((activity) => {
  const keyword = searchQuery.value.trim().toLowerCase()
  const searchMatch = !keyword || [activity.title, activity.description, activity.location].some((field) => field.toLowerCase().includes(keyword))
  return searchMatch
}))

const selectedActivity = computed(() => {
  if (selectedActivityId.value === null) {
    return null
  }

  return filteredActivities.value.find((item) => item.id === selectedActivityId.value)
    ?? activityRows.value.find((item) => item.id === selectedActivityId.value)
    ?? selectedActivitySnapshot.value
})

const isSelectedActivityLoading = computed(() => {
  return selectedActivity.value !== null && actionActivityId.value === selectedActivity.value.id
})

const canRegisterSelected = computed(() => {
  return selectedActivity.value?.userRegistrationStatus !== 'registered'
    && selectedActivity.value?.status === 'upcoming'
})

const canCancelSelected = computed(() => {
  return selectedActivity.value?.userRegistrationStatus === 'registered'
})

const recruitingCount = computed(() => activityRows.value.filter(item => item.status !== 'completed').length)
const registeredCount = computed(() => activityRows.value.filter(item => item.userRegistrationStatus === 'registered').length)
const completedCount = computed(() => activityRows.value.filter(item => item.status === 'completed').length)

const activityPulseCards = computed<ActivityPulseCard[]>(() => [
  {
    label: '招募中活动',
    value: String(recruitingCount.value),
    detail: '当前仍可参与报名的活动',
    tone: 'green'
  },
  {
    label: '已报名活动',
    value: String(registeredCount.value),
    detail: '关注时间提醒和签到',
    tone: 'blue'
  },
  {
    label: '历史完成',
    value: String(completedCount.value),
    detail: '沉淀稳定服务记录',
    tone: 'amber'
  }
])

const activityPriorityQueue = computed<ActivityPriorityItem[]>(() => {
  return activityRows.value
    .filter((item) => item.status !== 'completed')
    .map((item) => {
      const remainingSeats = Math.max(item.capacity - item.participants, 0)
      const baseScore = item.userRegistrationStatus === 'registered' ? 30 : 0
      const pressureScore = remainingSeats <= 5 ? 50 : remainingSeats <= 10 ? 35 : 15
      return {
        ...item,
        remainingSeats,
        priorityScore: baseScore + pressureScore
      }
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 4)
})

const summaryMeta = computed(() => [
  { label: '招募中', value: `${recruitingCount.value} 场`, detail: '当前仍在招募' },
  { label: '已报名', value: `${registeredCount.value} 场`, detail: '注意签到提醒' },
  { label: '分页进度', value: `${page.value}/${totalPages.value}`, detail: `共 ${total.value} 场活动` }
])

const activeTabLabel = computed(() => (
  filterTabs.find((tab) => tab.id === activeTab.value)?.label || '全部'
))

const searchSummaryLabel = computed(() => (
  searchQuery.value.trim() ? `“${searchQuery.value.trim()}”` : '未设置'
))

const dateRangeSummary = computed(() => {
  if (startFrom.value && endTo.value) return `${startFrom.value} 至 ${endTo.value}`
  if (startFrom.value) return `${startFrom.value} 起`
  if (endTo.value) return `截止 ${endTo.value}`
  return '全部时间'
})

const setActiveTab = (tab: ActivityTab) => {
  activeTab.value = tab
}

function syncSelectedActivity() {
  if (selectedActivityId.value === null) {
    return
  }

  const refreshedActivity = activityRows.value.find((item) => item.id === selectedActivityId.value)
  if (refreshedActivity) {
    selectedActivitySnapshot.value = refreshedActivity
  }
}

async function loadActivities() {
  loading.value = true

  try {
    const request = buildVolunteerActivityListRequest({
      tab: activeTab.value,
      page: page.value,
      pageSize: pageSize.value,
      searchQuery: searchQuery.value,
      startFrom: startFrom.value,
      endTo: endTo.value
    })
    const response = await activitiesApi.list(request)

    if (response.code !== 200) {
      throw new Error(response.msg || '获取活动列表失败')
    }

    activityRows.value = (response.data.list || []).map((item) => mapActivityItemToVolunteerView(item))
    total.value = response.data.total || 0
    syncSelectedActivity()
  } catch (error: any) {
    console.error('加载志愿者活动失败:', error)
    messageStore.error(error.message || '加载活动失败，请稍后重试')
    activityRows.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function refreshActivities() {
  await loadActivities()
  hasLoadedOnce.value = true
}

const clearFilters = () => {
  activeTab.value = 'all'
  searchQuery.value = ''
  startFrom.value = ''
  endTo.value = ''
  page.value = 1
  pageStateStore.resetVolunteerActivitiesState()
}

const goToPreviousPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await loadActivities()
}

const goToNextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await loadActivities()
}

const getStatusText = (status: VolunteerActivityViewItem['activityStatus']) => ({
  [BACKEND_ACTIVITY_STATUS.RECRUITING]: '招募中',
  [BACKEND_ACTIVITY_STATUS.FINISHED]: '已结束',
  [BACKEND_ACTIVITY_STATUS.CANCELED]: '已取消'
}[status] || String(status))
const getStatusTone = (status: VolunteerActivityViewItem['activityStatus']) => ({
  [BACKEND_ACTIVITY_STATUS.RECRUITING]: 'green',
  [BACKEND_ACTIVITY_STATUS.FINISHED]: 'slate',
  [BACKEND_ACTIVITY_STATUS.CANCELED]: 'rose'
}[status] || 'slate') as 'green' | 'blue' | 'slate' | 'rose'

const openActivityDrawer = (activity: Record<string, any>) => {
  const selected = activity as VolunteerActivityViewItem

  selectedActivityId.value = selected.id
  selectedActivitySnapshot.value = selected
  drawerOpen.value = true
}

const closeActivityDrawer = () => {
  drawerOpen.value = false
  selectedActivityId.value = null
  selectedActivitySnapshot.value = null
}

const handleRegister = async (id: number) => {
  actionActivityId.value = id

  try {
    const response = await activitiesApi.signup(id)
    if (response.code !== 200 || response.data.success === false) {
      throw new Error(response.msg || '报名失败')
    }
    messageStore.success('报名成功')
    await refreshActivities()
    syncSelectedActivity()
  } catch (error: any) {
    console.error('报名活动失败:', error)
    messageStore.error(error.message || '报名失败，请稍后重试')
  } finally {
    actionActivityId.value = null
  }
}

const handleViewDetails = async (id: number) => {
  await router.push(`/volunteer/activities/${id}`)
}

const handleCancel = async (id: number) => {
  actionActivityId.value = id

  try {
    const response = await activitiesApi.cancel(id)
    if (response.code !== 200 || response.data.success === false) {
      throw new Error(response.msg || '取消报名失败')
    }
    messageStore.success('已取消报名')
    await refreshActivities()
    syncSelectedActivity()
  } catch (error: any) {
    console.error('取消报名失败:', error)
    messageStore.error(error.message || '取消报名失败，请稍后重试')
  } finally {
    actionActivityId.value = null
  }
}

watch(activityRows, () => {
  syncSelectedActivity()
})

watch([activeTab, searchQuery, startFrom, endTo], () => {
  if (!hasLoadedOnce.value || isApplyingRouteState.value) {
    return
  }

  page.value = 1
  void refreshActivities()
})

watch(pageSize, () => {
  if (!hasLoadedOnce.value || isApplyingRouteState.value) {
    return
  }

  page.value = 1
  void refreshActivities()
})
</script>
