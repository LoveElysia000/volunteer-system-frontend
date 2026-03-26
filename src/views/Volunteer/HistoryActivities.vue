<template>
  <DataListPage>
    <template #header>
      <VolunteerPageHeader
        eyebrow="历史活动"
        title="沉淀你的长期贡献轨迹"
        description="回看已完成项目、参与类型和高频服务区域，帮助你判断下一阶段的投入重点。"
        :meta-items="headerMeta"
      />
    </template>

    <template #toolbar>
      <VolunteerSectionCard
        class="volunteer-history-timeline"
        title="完成时间轴"
        description="按活动主题和关键词查看你的历史参与轨迹，点击一行可在右侧打开复盘详情。"
      >
        <div class="space-y-5">
          <div class="grid gap-4 md:grid-cols-3">
            <VolunteerSummaryCard
              label="已完成场次"
              :value="`${historyActivities.length} 场`"
              detail="等待接口同步"
              tone="blue"
              class="volunteer-surface-lift"
            />
            <VolunteerSummaryCard
              label="累计时长"
              :value="`${totalHistoryHours}h`"
              detail="后端返回后自动更新"
              tone="green"
              class="volunteer-surface-lift"
            />
            <VolunteerSummaryCard
              label="累计积分"
              :value="`${totalHistoryPoints}`"
              detail="由已完成活动自动累积"
              tone="amber"
              class="volunteer-surface-lift"
            />
          </div>

          <DataToolbar>
            <template #filters>
              <div class="data-list-filter-stack">
                <button
                  v-for="tab in tagFilters"
                  :key="tab"
                  class="data-list-chip"
                  :class="tab === activeTag ? 'data-list-chip-active-green' : 'data-list-chip-neutral'"
                  @click="activeTag = tab"
                >
                  {{ tab === 'all' ? '全部类型' : tab }}
                </button>
              </div>
            </template>

            <template #actions>
              <div class="data-list-search lg:min-w-[280px]">
                <SearchIcon class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索活动名称、地点或复盘关键词"
                  class="data-list-search-input"
                >
              </div>
            </template>
          </DataToolbar>
        </div>
      </VolunteerSectionCard>
    </template>

    <template #body>
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
        <VolunteerSectionCard
          title="历史列表"
          description="把完成过的活动沉淀成统一的时间序列，方便回看和提炼经验。"
        >
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              当前共显示
              <span class="font-semibold text-slate-800">{{ filteredHistoryActivities.length }}</span>
              场活动
            </p>
            <p>排序逻辑：最近完成优先</p>
          </div>

          <DataList
            :items="filteredHistoryActivities"
            row-key="id"
            :selected-key="selectedActivityId"
            interactive
            open-text="查看复盘"
            open-style="text"
            empty-title="当前没有历史活动数据"
            empty-description="待后端返回历史活动后，这里会自动展示。"
            @row-click="openActivityDrawer"
          >
            <template #default="{ item }">
              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="text-lg font-bold tracking-tight text-slate-900">
                    {{ item.title }}
                  </h3>
                  <VolunteerStatusBadge
                    label="已完成"
                    tone="slate"
                  />
                  <span
                    v-if="item.tag"
                    class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                  >
                    {{ item.tag }}
                  </span>
                </div>

                <p class="text-sm leading-6 text-slate-600">
                  {{ item.description }}
                </p>

                <div class="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>{{ item.date }}</span>
                  <span>{{ item.location }}</span>
                  <span>{{ item.duration }} 小时</span>
                  <span class="font-semibold text-emerald-700">+{{ item.points }} 积分</span>
                </div>
              </div>
            </template>
          </DataList>
        </VolunteerSectionCard>

        <div class="space-y-6">
          <VolunteerSectionCard
            title="历史亮点"
            description="从服务分布中识别你的稳定强项。"
            tone="soft"
          >
            <div class="space-y-3">
              <article
                v-for="item in historyHighlights"
                :key="item.label"
                class="volunteer-surface-lift rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-4"
              >
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {{ item.label }}
                </p>
                <p class="mt-2 text-xl font-bold text-slate-900">
                  {{ item.value }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ item.detail }}
                </p>
              </article>
            </div>
          </VolunteerSectionCard>

          <VolunteerSectionCard
            title="复盘建议"
            description="基于近期记录给出的下一步建议。"
          >
            <ul class="space-y-3 text-sm leading-6 text-slate-600">
              <li>历史活动数据接入后，这里会生成更贴近实际参与轨迹的建议。</li>
              <li>完成记录、积分分布和高频主题将按后端返回结果自动更新。</li>
              <li>当前不再展示本地模拟内容，避免误导后续判断。</li>
            </ul>
          </VolunteerSectionCard>
        </div>
      </div>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="560px"
        :aria-label="selectedActivity ? `${selectedActivity.title} 的历史详情` : '历史活动详情'"
        @close="closeActivityDrawer"
      >
        <template #header>
          <div
            v-if="selectedActivity"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                历史活动
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                {{ selectedActivity.title }}
              </h2>
              <p class="text-sm text-slate-500">
                {{ selectedActivity.location }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <VolunteerStatusBadge
                label="已完成"
                tone="slate"
              />
              <span
                v-if="selectedActivity.tag"
                class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
              >
                {{ selectedActivity.tag }}
              </span>
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
                  完成时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedActivity.date }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  服务地点
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
                  获得积分
                </p>
                <p class="mt-1 text-sm font-semibold text-emerald-700">
                  +{{ selectedActivity.points }}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              活动复盘
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ selectedActivity.description }}
            </p>
          </section>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击历史活动查看完成时间、收获积分和复盘内容。
        </div>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SearchIcon } from 'lucide-vue-next'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataList from '@/components/data-list/DataList.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import { historyActivities } from '@/data/volunteerCenter'

const searchQuery = ref('')
const activeTag = ref('all')
const selectedActivityId = ref<number | null>(null)
const drawerOpen = ref(false)

const totalHistoryHours = computed(() => historyActivities.reduce((sum, item) => sum + item.duration, 0))
const totalHistoryPoints = computed(() => historyActivities.reduce((sum, item) => sum + item.points, 0))

const headerMeta = computed(() => [
  { label: '已完成', value: `${historyActivities.length} 场`, detail: '等待接口同步' },
  { label: '累计时长', value: `${totalHistoryHours.value}h`, detail: '后端返回后自动更新' }
])

const tagFilters = computed(() => ['all', ...new Set(historyActivities.map((item) => item.tag).filter(Boolean) as string[])])

const filteredHistoryActivities = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return [...historyActivities]
    .filter((item) => activeTag.value === 'all' || item.tag === activeTag.value)
    .filter((item) => {
      if (!keyword) return true
      return [item.title, item.description, item.location, item.tag || '']
        .some((field) => field.toLowerCase().includes(keyword))
    })
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())
})

const selectedActivity = computed(() => {
  return filteredHistoryActivities.value.find((item) => item.id === selectedActivityId.value)
    || historyActivities.find((item) => item.id === selectedActivityId.value)
    || null
})

const historyHighlights = computed(() => [
  { label: '累计积分', value: `${totalHistoryPoints.value}`, detail: '由已完成活动自动累积' },
  { label: '最近完成', value: filteredHistoryActivities.value[0]?.title || '暂无', detail: filteredHistoryActivities.value[0]?.location || '等待后端数据' },
  { label: '平均单场时长', value: historyActivities.length ? `${(totalHistoryHours.value / historyActivities.length).toFixed(1)}h` : '0h', detail: '接口接入后展示实际统计' }
])

const openActivityDrawer = (activity: Record<string, any>) => {
  selectedActivityId.value = activity.id
  drawerOpen.value = true
}

const closeActivityDrawer = () => {
  drawerOpen.value = false
}
</script>
