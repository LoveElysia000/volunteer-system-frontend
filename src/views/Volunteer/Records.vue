<template>
  <DataListPage>
    <template #header>
      <VolunteerPageHeader
        eyebrow="个人记录"
        title="服务明细与贡献概览"
        description="把累计时长、积分和具体活动记录集中查看，方便后续导出或补充证明。"
        :meta-items="headerMeta"
      >
        <template #actions>
          <button class="volunteer-toolbar-button">
            导出记录
          </button>
        </template>
      </VolunteerPageHeader>
    </template>

    <template #toolbar>
      <VolunteerSectionCard
        class="volunteer-records-workbench"
        title="记录工作区"
        description="先筛状态，再按关键词定位具体记录，点击一行从右侧查看完整信息。"
      >
        <div class="space-y-5">
          <div class="grid gap-4 md:grid-cols-3">
            <VolunteerSummaryCard
              label="累计服务时长"
              :value="`${totalHours}h`"
              detail="其中 4 小时待确认"
              tone="green"
              class="volunteer-surface-lift"
            />
            <VolunteerSummaryCard
              label="累计积分"
              :value="String(totalPoints)"
              detail="本月增长速度稳定"
              tone="amber"
              class="volunteer-surface-lift"
            />
            <VolunteerSummaryCard
              label="服务场次"
              :value="String(volunteerRecords.length)"
              detail="形成完整服务履历"
              tone="blue"
              class="volunteer-surface-lift"
            />
          </div>

          <DataToolbar>
            <template #filters>
              <div class="data-list-filter-stack">
                <button
                  v-for="tab in recordFilters"
                  :key="tab.id"
                  class="data-list-chip"
                  :class="tab.id === activeStatus ? 'data-list-chip-active-green' : 'data-list-chip-neutral'"
                  @click="activeStatus = tab.id"
                >
                  {{ tab.label }}
                </button>
              </div>
            </template>

            <template #actions>
              <div class="data-list-search lg:min-w-[280px]">
                <SearchIcon class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索活动名称、地点或备注"
                  class="data-list-search-input"
                >
              </div>
            </template>
          </DataToolbar>
        </div>
      </VolunteerSectionCard>
    </template>

    <template #body>
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
        <VolunteerSectionCard
          title="记录列表"
          description="把每一条服务明细排成统一列表，方便连续浏览和补充证明。"
        >
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              当前显示
              <span class="font-semibold text-slate-800">{{ filteredRecords.length }}</span>
              条记录
            </p>
            <p>排序逻辑：最近记录优先</p>
          </div>

          <DataList
            :items="filteredRecords"
            row-key="id"
            :selected-key="selectedRecordId"
            interactive
            open-text="查看详情"
            open-style="text"
            empty-title="当前没有匹配记录"
            empty-description="可以切换状态或清空关键词后重新查看。"
            @row-click="openRecordDrawer"
          >
            <template #default="{ item }">
              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="text-lg font-bold tracking-tight text-slate-900">
                    {{ item.activityName }}
                  </h3>
                  <VolunteerStatusBadge
                    :label="statusText(item.status)"
                    :tone="statusTone(item.status)"
                  />
                </div>

                <div class="grid gap-2 text-sm text-slate-500 sm:grid-cols-2 xl:grid-cols-4">
                  <p>服务时间：{{ item.date }}</p>
                  <p>服务地点：{{ item.location }}</p>
                  <p>累计时长：{{ item.hours }} 小时</p>
                  <p class="font-semibold text-emerald-700">
                    +{{ item.points }} 积分
                  </p>
                </div>

                <p class="text-sm leading-6 text-slate-600">
                  {{ item.highlight || '当前暂无补充备注，已保留基础记录。' }}
                </p>
              </div>
            </template>
          </DataList>
        </VolunteerSectionCard>

        <div class="space-y-6">
          <VolunteerSectionCard
            title="状态分布"
            description="记录状态能帮助你优先处理待确认项。"
            tone="soft"
          >
            <div class="space-y-3">
              <article
                v-for="item in recordStatusBreakdown"
                :key="item.label"
                class="volunteer-surface-lift rounded-[1.25rem] border border-white/75 bg-white/90 px-4 py-4"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="text-sm font-semibold text-slate-600">
                    {{ item.label }}
                  </p>
                  <p class="text-lg font-black text-slate-900">
                    {{ item.value }}
                  </p>
                </div>
                <p class="mt-2 text-xs text-slate-500">
                  {{ item.detail }}
                </p>
              </article>
            </div>
          </VolunteerSectionCard>

          <VolunteerSectionCard
            title="近期徽章"
            description="部分成长里程碑会自动写入你的服务记录。"
          >
            <div class="space-y-3">
              <article
                v-for="badge in volunteerBadges.slice(0, 3)"
                :key="badge.id"
                class="volunteer-surface-lift rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4"
              >
                <p class="text-base font-bold text-slate-900">
                  {{ badge.name }}
                </p>
                <p class="mt-1 text-sm text-slate-500">
                  {{ badge.description }}
                </p>
                <p class="mt-2 text-xs font-semibold text-emerald-700">
                  {{ badge.progress }}
                </p>
              </article>
            </div>
          </VolunteerSectionCard>
        </div>
      </div>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="560px"
        :aria-label="selectedRecord ? `${selectedRecord.activityName} 的服务记录详情` : '服务记录详情'"
        @close="closeRecordDrawer"
      >
        <template #header>
          <div
            v-if="selectedRecord"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                服务记录
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                {{ selectedRecord.activityName }}
              </h2>
              <p class="text-sm text-slate-500">
                {{ selectedRecord.location }}
              </p>
            </div>

            <VolunteerStatusBadge
              :label="statusText(selectedRecord.status)"
              :tone="statusTone(selectedRecord.status)"
            />
          </div>
        </template>

        <div
          v-if="selectedRecord"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  完成日期
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.date }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  服务地点
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.location }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  认证时长
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRecord.hours }} 小时
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  获得积分
                </p>
                <p class="mt-1 text-sm font-semibold text-emerald-700">
                  +{{ selectedRecord.points }}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              备注说明
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ selectedRecord.highlight || '当前暂无补充说明，可在导出时附加证明。' }}
            </p>
          </section>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击任意记录查看详细时长、积分和备注。
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
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import { volunteerBadges, volunteerRecords } from '@/data/volunteerCenter'
import type { VolunteerRecordItem } from '@/data/volunteerCenter'

const searchQuery = ref('')
const activeStatus = ref<'all' | VolunteerRecordItem['status']>('all')
const selectedRecordId = ref<number | null>(null)
const drawerOpen = ref(false)

const totalHours = computed(() => volunteerRecords.reduce((sum, item) => sum + item.hours, 0))
const totalPoints = computed(() => volunteerRecords.reduce((sum, item) => sum + item.points, 0))

const headerMeta = computed(() => [
  { label: '记录条数', value: `${volunteerRecords.length} 条`, detail: '可导出证明' },
  { label: '活跃状态', value: '稳定参与', detail: '连续 4 周有记录' }
])

const recordStatusBreakdown = computed(() => {
  const completed = volunteerRecords.filter(item => item.status === 'completed').length
  const pending = volunteerRecords.filter(item => item.status === 'pending').length
  const cancelled = volunteerRecords.filter(item => item.status === 'cancelled').length
  return [
    { label: '已完成', value: `${completed}`, detail: '可用于成长统计和证明导出' },
    { label: '待确认', value: `${pending}`, detail: '建议优先联系组织方补齐确认' },
    { label: '已取消', value: `${cancelled}`, detail: '保持低取消率有助于信用稳定' }
  ]
})

const recordFilters = computed(() => [
  { id: 'all' as const, label: '全部记录' },
  { id: 'completed' as const, label: '已完成' },
  { id: 'pending' as const, label: '待确认' },
  { id: 'cancelled' as const, label: '已取消' }
])

const filteredRecords = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return [...volunteerRecords]
    .filter((item) => activeStatus.value === 'all' || item.status === activeStatus.value)
    .filter((item) => {
      if (!keyword) return true
      return [item.activityName, item.location, item.highlight || '']
        .some((field) => field.toLowerCase().includes(keyword))
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
})

const selectedRecord = computed(() => {
  return filteredRecords.value.find((item) => item.id === selectedRecordId.value)
    || volunteerRecords.find((item) => item.id === selectedRecordId.value)
    || null
})

const statusText = (status: VolunteerRecordItem['status']) => ({
  completed: '已完成',
  pending: '待确认',
  cancelled: '已取消'
}[status])

const statusTone = (status: VolunteerRecordItem['status']) => ({
  completed: 'green',
  pending: 'amber',
  cancelled: 'slate'
}[status]) as 'green' | 'amber' | 'slate'

const openRecordDrawer = (record: Record<string, any>) => {
  selectedRecordId.value = record.id
  drawerOpen.value = true
}

const closeRecordDrawer = () => {
  drawerOpen.value = false
}
</script>
