<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="活动管理"
      title="发现并安排本周任务"
      description="把筛选、报名和优先事项集中在一个视图内，减少页面切换和遗漏。"
      :meta-items="summaryMeta"
    >
      <template #actions>
        <button
          class="volunteer-toolbar-button"
          @click="clearFilters"
        >
          重置筛选
        </button>
        <RouterLink
          to="/volunteer/activities/my-registrations"
          class="volunteer-toolbar-button volunteer-toolbar-button--soft"
        >
          我的报名
        </RouterLink>
      </template>
    </VolunteerPageHeader>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
      <VolunteerSectionCard
        class="volunteer-activity-command-board"
        title="任务指挥台"
        description="先选状态，再按关键词筛选，本页直接完成报名和管理动作。"
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

          <div class="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/85 p-4">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

              <div class="relative w-full lg:max-w-sm">
                <SearchIcon class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索活动名称、地点或描述"
                  class="input has-icon w-full rounded-full border-slate-200 bg-white pl-11 shadow-none"
                >
              </div>
            </div>
          </div>
        </div>
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
                +{{ item.points }} 积分
              </span>
            </div>
          </article>
        </div>
      </VolunteerSectionCard>
    </div>

    <VolunteerSectionCard
      title="活动列表"
      description="显示当前筛选结果，并保持报名、查看、取消操作在同一层级。"
    >
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <p>
          当前共找到
          <span class="font-semibold text-slate-800">{{ filteredActivities.length }}</span>
          个匹配活动
        </p>
        <p>排序逻辑：状态优先，时间靠前</p>
      </div>

      <transition-group
        name="volunteer-list-rise"
        tag="div"
        class="space-y-4"
      >
        <article
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="volunteer-surface-lift rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_-36px_rgba(15,23,42,0.38)]"
        >
          <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div class="min-w-0 flex-1 space-y-3">
              <div class="flex flex-wrap items-center gap-3">
                <VolunteerStatusBadge
                  :label="getStatusText(activity.status)"
                  :tone="getStatusTone(activity.status)"
                />
                <span
                  v-if="activity.tag"
                  class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                >{{ activity.tag }}</span>
              </div>
              <div>
                <h3 class="text-xl font-bold tracking-tight text-slate-900">
                  {{ activity.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  {{ activity.description }}
                </p>
              </div>
              <div class="flex flex-wrap gap-4 text-sm text-slate-500">
                <span>{{ activity.date }}</span>
                <span>{{ activity.location }}</span>
                <span>{{ activity.duration }} 小时</span>
                <span>{{ activity.participants }}/{{ activity.capacity }} 名额</span>
                <span class="font-semibold text-emerald-700">+{{ activity.points }} 积分</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 xl:justify-end">
              <button
                v-if="activity.userRegistrationStatus !== 'registered' && activity.status === 'upcoming'"
                class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                @click="handleRegister(activity.id)"
              >
                立即报名
              </button>
              <button
                v-else
                class="volunteer-toolbar-button"
                @click="handleViewDetails(activity.id)"
              >
                查看详情
              </button>
              <button
                v-if="activity.userRegistrationStatus === 'registered'"
                class="volunteer-toolbar-button text-rose-600 hover:border-rose-200 hover:text-rose-700"
                @click="handleCancel(activity.id)"
              >
                取消报名
              </button>
            </div>
          </div>
        </article>
      </transition-group>

      <div
        v-if="filteredActivities.length === 0"
        class="mt-4 rounded-[1.5rem] border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center"
      >
        <p class="text-base font-semibold text-slate-700">
          当前没有匹配结果
        </p>
        <p class="mt-2 text-sm text-slate-500">
          可以尝试切换筛选条件，或清空关键词后重新查看。
        </p>
      </div>
    </VolunteerSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { SearchIcon } from 'lucide-vue-next'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import { volunteerActivities } from '@/data/volunteerCenter'
import { usePageStateStore } from '@/store/modules/pageState'
import type { VolunteerActivityItem, VolunteerTone } from '@/data/volunteerCenter'

type ActivityTab = 'all' | VolunteerActivityItem['status']

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

interface ActivityPriorityItem extends VolunteerActivityItem {
  remainingSeats: number
  priorityScore: number
}

const route = useRoute()
const router = useRouter()
const pageStateStore = usePageStateStore()
const activeTab = ref<ActivityTab>(pageStateStore.state.volunteerActivities.activeTab as ActivityTab || 'all')
const searchQuery = ref(pageStateStore.state.volunteerActivities.searchQuery || '')

const filterTabs: FilterTab[] = [
  { id: 'all', label: '全部' },
  { id: 'upcoming', label: '可报名' },
  { id: 'registered', label: '已报名' },
  { id: 'completed', label: '已完成' }
]

const isActivityTab = (value: string): value is ActivityTab => {
  return filterTabs.some(tab => tab.id === value)
}

watch(() => route.query, (query) => {
  if (typeof query.tab === 'string' && isActivityTab(query.tab)) activeTab.value = query.tab
  else activeTab.value = 'all'
  if (typeof query.search === 'string') searchQuery.value = query.search
  else searchQuery.value = ''
}, { immediate: true })

watch([activeTab, searchQuery], ([tab, search]) => {
  const query: Record<string, string> = {}
  if (tab && tab !== 'all') query.tab = tab
  if (search) query.search = search
  router.replace({ query })
  pageStateStore.updateVolunteerActivitiesState({ activeTab: tab, searchQuery: search })
})

const filteredActivities = computed(() => volunteerActivities.filter((activity) => {
  const tabMatch = activeTab.value === 'all' || activity.status === activeTab.value
  const keyword = searchQuery.value.trim().toLowerCase()
  const searchMatch = !keyword || [activity.title, activity.description, activity.location].some((field) => field.toLowerCase().includes(keyword))
  return tabMatch && searchMatch
}))

const upcomingCount = computed(() => volunteerActivities.filter(item => item.status === 'upcoming').length)
const registeredCount = computed(() => volunteerActivities.filter(item => item.userRegistrationStatus === 'registered').length)
const completedCount = computed(() => volunteerActivities.filter(item => item.status === 'completed').length)

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
  return volunteerActivities
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

const clearFilters = () => {
  activeTab.value = 'all'
  searchQuery.value = ''
  pageStateStore.resetVolunteerActivitiesState()
}

const getStatusText = (status: VolunteerActivityItem['status']) => ({ upcoming: '可报名', registered: '已报名', completed: '已完成' }[status] || status)
const getStatusTone = (status: VolunteerActivityItem['status']) => ({ upcoming: 'green', registered: 'blue', completed: 'slate' }[status] || 'slate') as 'green' | 'blue' | 'slate'
const handleRegister = (id: number) => console.log('报名活动:', id)
const handleViewDetails = (id: number) => console.log('查看详情:', id)
const handleCancel = (id: number) => console.log('取消报名:', id)
</script>
