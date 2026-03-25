<template>
  <DataListPage>
    <template #header>
      <VolunteerPageHeader
        eyebrow="活动列表"
        title="发现并安排本周任务"
        description="把筛选、报名和优先事项集中在一个视图内，减少页面切换和遗漏。"
        :meta-items="summaryMeta"
      >
        <template #actions>
          <Button
            variant="outline"
            rounded
            @click="clearFilters"
          >
            重置筛选
          </Button>
          <RouterLink
            to="/volunteer/activities/my-registrations"
            class="volunteer-toolbar-button volunteer-toolbar-button--soft"
          >
            我的报名
          </RouterLink>
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
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tab in filterTabs"
                  :key="tab.id"
                  class="rounded-full px-4 py-2 text-sm font-semibold transition"
                  :class="tab.id === activeTab ? 'bg-emerald-600 text-white shadow-[0_10px_24px_-16px_rgba(5,150,105,0.9)]' : 'bg-white text-slate-600 hover:bg-slate-100'"
                  @click="setActiveTab(tab.id)"
                >
                  {{ tab.label }}
                </button>
              </div>
            </template>

            <template #actions>
              <div class="relative w-full lg:min-w-[300px]">
                <SearchIcon class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索活动名称、地点或描述"
                  class="input has-icon w-full rounded-full border-slate-200 bg-white pl-11 shadow-none"
                >
              </div>
            </template>
          </DataToolbar>
        </div>
      </VolunteerSectionCard>
    </template>

    <template #body>
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
        <VolunteerSectionCard
          title="活动列表"
          description="浏览当前筛选结果，点击一行在右侧查看详情并完成报名或取消。"
        >
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              当前共找到
              <span class="font-semibold text-slate-800">{{ filteredActivities.length }}</span>
              个匹配活动
            </p>
            <p>排序逻辑：状态优先，时间靠前</p>
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
                    :label="getStatusText(item.status)"
                    :tone="getStatusTone(item.status)"
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
                  <span>{{ item.date }}</span>
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
                {{ item.date }} · {{ item.location }}
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
                :label="getStatusText(selectedActivity.status)"
                :tone="getStatusTone(selectedActivity.status)"
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
                  {{ selectedActivity.date }}
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

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击活动行查看详情，并在抽屉中完成报名或取消操作。
        </div>

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
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { SearchIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DataList from '@/components/data-list/DataList.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import { activitiesApi, mapActivityItemToVolunteerView, mapMyActivityItemToVolunteerView } from '@/api/activities'
import { useMessageStore } from '@/store/modules/messages'
import { usePageStateStore } from '@/store/modules/pageState'
import type { VolunteerTone } from '@/data/volunteerCenter'
import type { VolunteerActivityViewItem } from '@/types/activity'

type ActivityTab = 'all' | VolunteerActivityViewItem['status']

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
const loading = ref(false)
const actionActivityId = ref<number | null>(null)
const activityRows = ref<VolunteerActivityViewItem[]>([])
const selectedActivityId = ref<number | null>(null)
const selectedActivitySnapshot = ref<VolunteerActivityViewItem | null>(null)
const drawerOpen = ref(false)

const filterTabs: FilterTab[] = [
  { id: 'all', label: '全部' },
  { id: 'upcoming', label: '可报名' },
  { id: 'registered', label: '已报名' },
  { id: 'completed', label: '已完成' }
]

const isActivityTab = (value: string): value is ActivityTab => {
  return filterTabs.some(tab => tab.id === value)
}

const getQueryActivityId = (value: unknown) => {
  if (typeof value !== 'string') {
    return null
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

const openActivityFromQuery = () => {
  const queryActivityId = getQueryActivityId(route.query.id)
  if (queryActivityId === null) {
    return
  }

  const target = activityRows.value.find((item) => item.id === queryActivityId)
  if (target) {
    openActivityDrawer(target)
  }
}

watch(() => route.query, async (query) => {
  if (typeof query.tab === 'string' && isActivityTab(query.tab)) activeTab.value = query.tab
  else activeTab.value = 'all'
  if (typeof query.search === 'string') searchQuery.value = query.search
  else searchQuery.value = ''
  await loadActivities()
  openActivityFromQuery()
}, { immediate: true })

watch([activeTab, searchQuery, drawerOpen, selectedActivityId], ([tab, search, isDrawerOpen, selectedId]) => {
  const query: Record<string, string> = {}
  if (tab && tab !== 'all') query.tab = tab
  if (search) query.search = search
  if (isDrawerOpen && selectedId !== null) query.id = String(selectedId)
  router.replace({ query })
  pageStateStore.updateVolunteerActivitiesState({ activeTab: tab, searchQuery: search })
})

const filteredActivities = computed(() => activityRows.value.filter((activity) => {
  const tabMatch = activeTab.value === 'all' || activity.status === activeTab.value
  const keyword = searchQuery.value.trim().toLowerCase()
  const searchMatch = !keyword || [activity.title, activity.description, activity.location].some((field) => field.toLowerCase().includes(keyword))
  return tabMatch && searchMatch
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

const upcomingCount = computed(() => activityRows.value.filter(item => item.status === 'upcoming').length)
const registeredCount = computed(() => activityRows.value.filter(item => item.userRegistrationStatus === 'registered').length)
const completedCount = computed(() => activityRows.value.filter(item => item.status === 'completed').length)

const activityPulseCards = computed<ActivityPulseCard[]>(() => [
  {
    label: '可报名活动',
    value: String(upcomingCount.value),
    detail: '优先查看名额紧张项目',
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
  { label: '推荐任务', value: `${upcomingCount.value} 场`, detail: '本周优先可参加' },
  { label: '已报名', value: `${registeredCount.value} 场`, detail: '注意签到提醒' }
])

const setActiveTab = (tab: ActivityTab) => {
  activeTab.value = tab
}

const syncSelectedActivity = () => {
  if (selectedActivityId.value === null) {
    return
  }

  const refreshedActivity = activityRows.value.find((item) => item.id === selectedActivityId.value)
  if (refreshedActivity) {
    selectedActivitySnapshot.value = refreshedActivity
  }
}

const loadActivities = async () => {
  loading.value = true

  try {
    const [activitiesResponse, myActivitiesResponse] = await Promise.all([
      activitiesApi.list({
        page: 1,
        pageSize: 100,
        keyword: searchQuery.value.trim() || undefined,
        sortBy: 'start_time',
        sortOrder: 'asc'
      }),
      activitiesApi.myActivities({
        page: 1,
        pageSize: 100
      })
    ])

    if (activitiesResponse.code !== 200) {
      throw new Error(activitiesResponse.msg || '获取活动列表失败')
    }

    if (myActivitiesResponse.code !== 200) {
      throw new Error(myActivitiesResponse.msg || '获取我的活动失败')
    }

    const myActivityMap = new Map(myActivitiesResponse.data.list.map(item => [item.id, item]))
    const mergedRows = activitiesResponse.data.list.map(item =>
      mapActivityItemToVolunteerView(item, myActivityMap.get(item.id))
    )

    const missingMyRows = myActivitiesResponse.data.list
      .filter(item => !activitiesResponse.data.list.some(activity => activity.id === item.id))
      .map(mapMyActivityItemToVolunteerView)

    activityRows.value = [...mergedRows, ...missingMyRows]
    syncSelectedActivity()
  } catch (error: any) {
    console.error('加载志愿者活动失败:', error)
    messageStore.error(error.message || '加载活动失败，请稍后重试')
    activityRows.value = []
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  activeTab.value = 'all'
  searchQuery.value = ''
  pageStateStore.resetVolunteerActivitiesState()
}

const getStatusText = (status: VolunteerActivityViewItem['status']) => ({ upcoming: '可报名', registered: '已报名', completed: '已完成' }[status] || status)
const getStatusTone = (status: VolunteerActivityViewItem['status']) => ({ upcoming: 'green', registered: 'blue', completed: 'slate' }[status] || 'slate') as 'green' | 'blue' | 'slate'

const openActivityDrawer = (activity: VolunteerActivityViewItem) => {
  selectedActivityId.value = activity.id
  selectedActivitySnapshot.value = activity
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
    await loadActivities()
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
    await loadActivities()
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
</script>
