<template>
  <DataListPage>
    <template #header>
      <VolunteerPageHeader
        eyebrow="工时记录"
        title="我的服务工时"
        description="核对工时发放、作废与重算记录，确认每次服务结算是否准确。"
        :meta-items="headerMeta"
        layout="operations"
      >
        <template #summary>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            活动范围 / {{ activitySummary }}
          </span>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            类型筛选 / {{ operationSummary }}
          </span>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            最近记录 / {{ latestRecordTime }}
          </span>
        </template>
        <template #actions>
          <div class="grid w-full gap-3 2xl:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              v-model="activityIdInput"
              type="number"
              placeholder="输入活动 ID 筛选工时流水"
              theme="emerald"
            />
            <RouterLink
              to="/volunteer/activities/my-registrations"
              class="volunteer-toolbar-button volunteer-toolbar-button--soft min-h-[48px] w-full 2xl:w-auto"
            >
              查看我的报名
            </RouterLink>
          </div>
        </template>
      </VolunteerPageHeader>
    </template>

    <template #toolbar>
      <VolunteerSectionCard
        title="工时概览"
        description="支持多选工时类型，不选默认展示全部记录。"
        tone="soft"
      >
        <div class="space-y-5">
          <div class="grid gap-4 md:grid-cols-3">
            <VolunteerSummaryCard
              label="累计服务时长"
              :value="`${totalHours}h`"
              detail="以当前账号的累计服务时长为准"
              tone="green"
            />
            <VolunteerSummaryCard
              label="筛选结果"
              :value="String(total)"
              detail="符合当前条件的工时流水条数"
              tone="blue"
            />
            <VolunteerSummaryCard
              label="本页工时净变动"
              :value="pageDeltaText"
              detail="当前页内工时增减合计"
              tone="amber"
            />
          </div>

          <DataToolbar>
            <template #filters>
              <div class="space-y-3">
                <div class="data-list-filter-stack">
                  <button
                    type="button"
                    class="data-list-chip"
                    :class="selectedOperationTypes.length === 0 ? 'data-list-chip-active-green' : 'data-list-chip-neutral'"
                    @click="clearOperationTypes"
                  >
                    全部类型
                  </button>
                  <button
                    v-for="option in operationFilterOptions"
                    :key="option.key"
                    type="button"
                    class="data-list-chip"
                    :class="selectedOperationTypes.includes(option.value) ? 'data-list-chip-active-green' : 'data-list-chip-neutral'"
                    :aria-pressed="selectedOperationTypes.includes(option.value)"
                    @click="toggleOperationType(option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
                <p class="text-xs text-slate-500">
                  工时类型支持多选，不选默认展示全部。
                </p>
              </div>
            </template>

            <template #summary>
              <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>第 {{ page }} / {{ totalPages }} 页</span>
                <span>当前页 {{ logs.length }} 条记录</span>
              </div>
            </template>

            <template #actions>
              <div class="grid gap-3 2xl:grid-cols-[220px_160px]">
                <FilterSelect
                  v-model="pageSize"
                  title="每页条数"
                  :options="pageSizeOptions"
                  theme="emerald"
                />
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
              </div>
            </template>
          </DataToolbar>
        </div>
      </VolunteerSectionCard>
    </template>

    <template #body>
      <VolunteerSectionCard
        title="工时流水"
        description="点击一条记录，在右侧查看本次工时变动的完整说明。"
      >
        <DataTable
          :columns="columns"
          :items="logs"
          :loading="loading"
          row-key="id"
          :selected-key="selectedLogId"
          interactive
          open-text="查看"
          open-style="text"
          density="compact"
          empty-title="当前没有可展示的工时流水"
          empty-description="调整活动 ID 或工时类型后再试。"
          @row-click="openLogDrawer"
        >
          <template #cell-createdAt="{ item }">
            <div class="min-w-0 space-y-1">
              <p class="text-sm font-semibold text-slate-900">
                {{ item.createdAt }}
              </p>
              <p class="text-xs text-slate-500">
                流水 #{{ item.id }}
              </p>
            </div>
          </template>

          <template #cell-operationType="{ item }">
            <div class="space-y-2">
              <StatusBadge
                :label="operationShortText(item.operationType)"
                :tone="operationTone(item.operationType)"
              />
              <div class="text-xs text-slate-500">
                <p>活动 #{{ item.activityId }}</p>
                <p>报名 #{{ item.signupId }}</p>
              </div>
            </div>
          </template>

          <template #cell-hoursDelta="{ item }">
            <span
              class="text-sm font-semibold"
              :class="item.hoursDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'"
            >
              {{ formatHoursDelta(item.hoursDelta) }}
            </span>
          </template>

          <template #cell-beforeTotalHours="{ item }">
            {{ item.beforeTotalHours }}h
          </template>

          <template #cell-afterTotalHours="{ item }">
            {{ item.afterTotalHours }}h
          </template>

          <template #cell-reason="{ item }">
            <span class="line-clamp-2 text-sm text-slate-600">
              {{ item.reason || '-' }}
            </span>
          </template>
        </DataTable>
      </VolunteerSectionCard>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="560px"
        :aria-label="selectedLog ? `工时流水 ${selectedLog.id} 的详情` : '工时流水详情'"
        @close="closeLogDrawer"
      >
        <template #header>
          <div
            v-if="selectedLog"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                工时详情
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                流水 #{{ selectedLog.id }}
              </h2>
              <p class="text-sm text-slate-500">
                活动 #{{ selectedLog.activityId }} / 报名 #{{ selectedLog.signupId }}
              </p>
            </div>

            <StatusBadge
              :label="operationLabel(selectedLog.operationType)"
              :tone="operationTone(selectedLog.operationType)"
            />
          </div>
        </template>

        <div
          v-if="selectedLog"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  工时变动
                </p>
                <p
                  class="mt-1 text-sm font-semibold"
                  :class="selectedLog.hoursDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'"
                >
                  {{ formatHoursDelta(selectedLog.hoursDelta) }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  变动时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedLog.createdAt }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  变更前总工时
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedLog.beforeTotalHours }}h
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  变更后总工时
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedLog.afterTotalHours }}h
                </p>
              </div>
            </div>
          </section>

          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              原因说明
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ selectedLog.reason || '-' }}
            </p>
          </section>
        </div>

        <WorkbenchEmptyPanel v-else>
          点击流水记录查看详情。
        </WorkbenchEmptyPanel>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <RouterLink
              v-if="selectedLog"
              :to="`/volunteer/activities/${selectedLog.activityId}`"
              class="volunteer-toolbar-button volunteer-toolbar-button--soft justify-center"
            >
              查看活动详情
            </RouterLink>
          </div>
        </template>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import Input from '@/components/ui/Input.vue'
import WorkbenchEmptyPanel from '@/components/workbench/WorkbenchEmptyPanel.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DataTable, { type DataTableColumn } from '@/components/data-list/DataTable.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import { volunteerWorkHoursApi } from '@/api/volunteer-work-hours'
import {
  VOLUNTEER_WORK_HOUR_OPERATION_FILTER_OPTIONS,
  WORK_HOUR_OPERATION_LABELS,
  WORK_HOUR_OPERATION_SHORT_LABELS,
  WORK_HOUR_OPERATION_TONES
} from '@/constants/work-hours'
import { useVolunteerMetrics } from '@/composables/useVolunteerMetrics'
import { useMessageStore } from '@/store/modules/messages'
import { WorkHourOperationType, type VolunteerWorkHourItem } from '@/types/work-hour'

const messageStore = useMessageStore()
const { totalHours } = useVolunteerMetrics()

const activityId = ref<number | undefined>()
const selectedOperationTypes = ref<WorkHourOperationType[]>([])
const logs = ref<VolunteerWorkHourItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const selectedLogId = ref<number | null>(null)
const drawerOpen = ref(false)

const columns: DataTableColumn[] = [
  { key: 'createdAt', label: '时间', width: '180px' },
  { key: 'operationType', label: '类型', width: '180px' },
  { key: 'hoursDelta', label: '工时变动', width: '120px' },
  { key: 'beforeTotalHours', label: '变更前总工时', width: '140px' },
  { key: 'afterTotalHours', label: '变更后总工时', width: '140px' },
  { key: 'reason', label: '原因', cellClass: 'align-top' }
]

const pageSizeOptions = [
  { key: 'page-size-10', value: 10, label: '每页 10 条', description: '紧凑浏览' },
  { key: 'page-size-20', value: 20, label: '每页 20 条', description: '默认密度' },
  { key: 'page-size-50', value: 50, label: '每页 50 条', description: '适合集中查看' }
] as const

const operationFilterOptions = VOLUNTEER_WORK_HOUR_OPERATION_FILTER_OPTIONS
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const selectedLog = computed(() => logs.value.find((log) => log.id === selectedLogId.value) || null)
const latestRecordTime = computed(() => logs.value[0]?.createdAt || '暂无记录')
const activitySummary = computed(() => activityId.value ? `活动 #${activityId.value}` : '全部活动')
const operationSummary = computed(() => {
  if (!selectedOperationTypes.value.length) return '全部类型'
  return selectedOperationTypes.value.map(type => WORK_HOUR_OPERATION_SHORT_LABELS[type]).join(' / ')
})
const pageDelta = computed(() => (
  logs.value.reduce((sum, item) => sum + item.hoursDelta, 0)
))
const pageDeltaText = computed(() => formatHoursDelta(pageDelta.value))

const headerMeta = computed(() => [
  { label: '累计工时', value: `${totalHours.value}h`, detail: '当前账号累计服务时长' },
  { label: '筛选结果', value: `${total.value} 条`, detail: '当前条件下的流水总数' },
  { label: '分页进度', value: `${page.value}/${totalPages.value}`, detail: `每页 ${pageSize.value} 条` }
])

const activityIdInput = computed({
  get: () => activityId.value === undefined ? '' : String(activityId.value),
  set: (value: string | number) => {
    const next = Number(value)
    activityId.value = Number.isFinite(next) && next > 0 ? next : undefined
  }
})

const formatHoursDelta = (value: number) => {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value}h`
}

const operationLabel = (type: WorkHourOperationType) => WORK_HOUR_OPERATION_LABELS[type] || '未知类型'
const operationShortText = (type: WorkHourOperationType) => WORK_HOUR_OPERATION_SHORT_LABELS[type] || '未知'
const operationTone = (type: WorkHourOperationType) => WORK_HOUR_OPERATION_TONES[type] || 'slate'

const toggleOperationType = (type: WorkHourOperationType) => {
  if (selectedOperationTypes.value.includes(type)) {
    selectedOperationTypes.value = selectedOperationTypes.value.filter(item => item !== type)
    return
  }
  selectedOperationTypes.value = [...selectedOperationTypes.value, type].sort((a, b) => a - b)
}

const clearOperationTypes = () => {
  selectedOperationTypes.value = []
}

const openLogDrawer = (item: Record<string, any>) => {
  selectedLogId.value = item.id
  drawerOpen.value = true
}

const closeLogDrawer = () => {
  drawerOpen.value = false
}

const loadLogs = async () => {
  loading.value = true
  try {
    const response = await volunteerWorkHoursApi.list({
      page: page.value,
      pageSize: pageSize.value,
      activityId: activityId.value,
      ...(selectedOperationTypes.value.length ? { operationTypes: selectedOperationTypes.value } : {})
    })

    if (response.code !== 200) {
      throw new Error(response.msg || '获取我的工时流水失败')
    }

    logs.value = response.data.list || []
    total.value = response.data.total || 0
    if (!logs.value.some((item) => item.id === selectedLogId.value)) {
      selectedLogId.value = logs.value[0]?.id ?? null
    }
  } catch (error: any) {
    console.error('加载志愿者工时流水失败:', error)
    messageStore.error(error.message || '加载我的工时流水失败，请稍后重试')
    logs.value = []
    total.value = 0
    selectedLogId.value = null
  } finally {
    loading.value = false
  }
}

const goToPreviousPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await loadLogs()
}

const goToNextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await loadLogs()
}

onMounted(() => {
  void loadLogs()
})

watch([activityId, selectedOperationTypes, pageSize], () => {
  page.value = 1
  void loadLogs()
}, { deep: true })
</script>
