<template>
  <DataListPage>
    <template #header>
      <OrganizationPageHeader
        eyebrow="工时管理"
        title="工时流水"
        description="查看工时变动，并对指定报名执行作废或重算。"
        layout="operations"
        :meta-items="headerMeta"
      >
        <template #summary>
          <div
            v-for="item in headerHighlights"
            :key="item.label"
            class="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold shadow-[0_12px_26px_-22px_rgba(15,23,42,0.25)]"
            :class="item.tone === 'accent'
              ? 'border-amber-200 bg-amber-50 text-amber-700'
              : 'border-slate-200 bg-white/90 text-slate-600'"
          >
            <span class="text-xs uppercase tracking-[0.18em] text-slate-400">{{ item.label }}</span>
            <span class="text-slate-900">{{ item.value }}</span>
          </div>
        </template>
        <template #actions>
          <div class="grid w-full gap-3 sm:grid-cols-2 xl:max-w-lg">
            <Input
              v-model="activityIdInput"
              type="number"
              placeholder="活动 ID"
            />
            <Input
              v-model="signupIdInput"
              type="number"
              placeholder="报名 ID"
            />
          </div>
        </template>
      </OrganizationPageHeader>
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
            <FilterSelect
              v-model="operationType"
              title="操作类型"
              :icon="HistoryIcon"
              :options="operationTypeOptions"
            />
            <FilterSelect
              v-model="pageSize"
              title="每页条数"
              :icon="HistoryIcon"
              :options="pageSizeOptions"
            />
          </div>
        </template>

        <template #summary>
          <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>第 {{ page }} / {{ totalPages }} 页</span>
            <span>共 {{ total }} 条流水</span>
          </div>
        </template>

        <template #actions>
          <div class="flex flex-wrap gap-2">
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
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <OrganizationSectionCard
          title="流水列表"
          description="点击一行查看详情，也可在右侧直接处理指定报名。"
        >
          <DataTable
            :columns="columns"
            :items="logs"
            :loading="loading"
            row-key="id"
            :selected-key="selectedLogId"
            interactive
            open-text="处理"
            open-style="text"
            density="compact"
            empty-title="当前没有可展示的工时流水"
            empty-description="调整活动、报名或操作类型筛选后再试。"
            @row-click="openLogDrawer"
          >
            <template #cell-operation="{ item }">
              <div class="flex flex-wrap items-center gap-2">
                <StatusBadge
                  :label="operationText(item.operationType)"
                  :tone="operationTone(item.operationType)"
                />
                <span class="text-sm font-semibold text-slate-900">
                  报名 {{ item.signupId }} / 活动 {{ item.activityId }}
                </span>
              </div>
            </template>

            <template #cell-hours="{ item }">
              变更 {{ item.hoursDelta }}h
            </template>

            <template #cell-total="{ item }">
              前 {{ item.beforeTotalHours }}h / 后 {{ item.afterTotalHours }}h
            </template>

            <template #cell-createdAt="{ item }">
              {{ item.createdAt }}
            </template>
          </DataTable>
        </OrganizationSectionCard>

        <OrganizationSectionCard
          title="快速处理"
          description="无需选中流水，也可以按报名 ID 直接处理。"
          tone="soft"
        >
          <div class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <label class="text-sm font-medium text-slate-600">
                报名 ID
                <Input
                  v-model="actionFormSignupIdInput"
                  class="mt-2"
                  type="number"
                  placeholder="请输入报名 ID"
                />
              </label>
              <label class="text-sm font-medium text-slate-600">
                重算工时
                <Input
                  v-model="actionFormHoursInput"
                  class="mt-2"
                  type="number"
                  placeholder="仅重算时填写"
                />
              </label>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-600">原因</label>
              <Textarea
                v-model="actionForm.reason"
                placeholder="请输入处理原因"
                :min-rows="2"
                :max-rows="5"
                allow-clear
                show-word-limit
                :max-length="{ length: 120, errorOnly: true }"
              />
            </div>

            <div
              v-if="selectedLog || lastActionResult"
              class="space-y-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-4 text-sm text-slate-600"
            >
              <div v-if="selectedLog">
                <p class="font-semibold text-slate-900">
                  当前引用流水 #{{ selectedLog.id }}
                </p>
                <p class="mt-2">
                  原因：{{ selectedLog.reason || '无' }}
                </p>
              </div>
              <div
                v-if="lastActionResult"
                class="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-3"
              >
                <p class="font-semibold text-emerald-900">
                  最新处理结果
                </p>
                <p class="mt-1">
                  {{ lastActionResult.actionLabel }} 已提交，生成流水 #{{ lastActionResult.workHourLogId }}
                </p>
                <p class="mt-1 break-all text-xs text-emerald-800">
                  本次请求幂等键：{{ lastActionResult.idempotencyKey }}
                </p>
                <p
                  v-if="lastActionResult.grantedHours !== undefined"
                  class="mt-1"
                >
                  发放工时：{{ lastActionResult.grantedHours }}h
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="danger"
                :loading="acting"
                @click="voidWorkHour"
              >
                作废工时
              </Button>
              <Button
                variant="success"
                :loading="acting"
                @click="recalculateWorkHour"
              >
                重算工时
              </Button>
            </div>
          </div>
        </OrganizationSectionCard>
      </div>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="620px"
        :aria-label="selectedLog ? `工时流水 ${selectedLog.id} 的处理详情` : '工时处理详情'"
        @close="closeLogDrawer"
      >
        <template #header>
          <div
            v-if="selectedLog"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                工时处理
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                流水 #{{ selectedLog.id }}
              </h2>
              <p class="text-sm text-slate-500">
                报名 {{ selectedLog.signupId }} / 活动 {{ selectedLog.activityId }}
              </p>
            </div>

            <StatusBadge
              :label="operationText(selectedLog.operationType)"
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
                  变更工时
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedLog.hoursDelta }}h
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  总工时变化
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedLog.beforeTotalHours }}h -> {{ selectedLog.afterTotalHours }}h
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  服务次数变化
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedLog.serviceCountDelta > 0 ? '+' : '' }}{{ selectedLog.serviceCountDelta }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  操作时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedLog.createdAt }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  幂等键
                </p>
                <p class="mt-1 break-all text-sm font-semibold text-slate-900">
                  {{ selectedLog.idempotencyKey || '-' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  操作人 ID
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedLog.operatorId || '-' }}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              当前流水原因
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ selectedLog.reason || '无' }}
            </p>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
            <div>
              <p class="text-sm font-semibold text-slate-900">
                执行作废 / 重算
              </p>
              <p class="text-xs text-slate-500">
                可直接基于当前记录处理对应报名的工时。
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <label class="text-sm font-medium text-slate-600">
                报名 ID
                <Input
                  v-model="actionFormSignupIdInput"
                  class="mt-2"
                  type="number"
                  placeholder="报名 ID"
                />
              </label>
              <label class="text-sm font-medium text-slate-600">
                重算工时
                <Input
                  v-model="actionFormHoursInput"
                  class="mt-2"
                  type="number"
                  placeholder="仅重算使用"
                />
              </label>
              <div class="md:col-span-2">
                <label class="mb-1 block text-sm font-medium text-slate-600">原因</label>
                <Textarea
                  v-model="actionForm.reason"
                  placeholder="请输入原因"
                  :min-rows="2"
                  :max-rows="5"
                  allow-clear
                  show-word-limit
                  :max-length="{ length: 120, errorOnly: true }"
                />
              </div>
            </div>

            <div
              v-if="lastActionResult"
              class="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-4 text-sm text-emerald-900"
            >
              <p class="font-semibold">
                最新处理结果
              </p>
              <p class="mt-1">
                {{ lastActionResult.actionLabel }} 已返回流水 #{{ lastActionResult.workHourLogId }}
              </p>
              <p class="mt-1 break-all text-xs text-emerald-800">
                本次请求幂等键：{{ lastActionResult.idempotencyKey }}
              </p>
            </div>
          </section>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击流水记录查看详情并执行处理。
        </div>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              v-if="selectedLog"
              variant="danger"
              :loading="acting"
              @click="voidWorkHour"
            >
              作废工时
            </Button>
            <Button
              v-if="selectedLog"
              variant="success"
              :loading="acting"
              @click="recalculateWorkHour"
            >
              重算工时
            </Button>
          </div>
        </template>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DataTable, { type DataTableColumn } from '@/components/data-list/DataTable.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { workHoursApi } from '@/api/work-hours'
import { useMessageStore } from '@/store/modules/messages'
import { WorkHourOperationType, type WorkHourLogItem } from '@/types/work-hour'
import { HistoryIcon } from 'lucide-vue-next'

const messageStore = useMessageStore()

const activityId = ref<number | undefined>()
const signupId = ref<number | undefined>()
const operationType = ref<WorkHourOperationType | undefined>()
const operationTypeOptions = [
  { key: 'all-operations', value: undefined, label: '全部操作', description: '查看所有工时变更类型' },
  { key: 'grant', value: WorkHourOperationType.GRANT, label: '发放', description: '查看正常发放的工时记录' },
  { key: 'void', value: WorkHourOperationType.VOID, label: '作废', description: '查看被作废的工时记录' },
  { key: 'recalculate', value: WorkHourOperationType.RECALCULATE, label: '重算', description: '查看重新计算的工时记录' }
] as const
const logs = ref<WorkHourLogItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const acting = ref(false)
const selectedLogId = ref<number | null>(null)
const drawerOpen = ref(false)
const pageSizeOptions = [
  { key: 'page-size-10', value: 10, label: '10 条', description: '适合逐条核对' },
  { key: 'page-size-20', value: 20, label: '20 条', description: '默认查看密度' },
  { key: 'page-size-50', value: 50, label: '50 条', description: '适合批量巡检' }
] as const

const columns: DataTableColumn[] = [
  { key: 'operation', label: '流水项', width: '320px', cellClass: 'align-top' },
  { key: 'hours', label: '工时变化', width: '120px' },
  { key: 'total', label: '总工时', width: '170px' },
  { key: 'createdAt', label: '时间', width: '180px' }
]

const actionForm = ref({
  signupId: 0,
  hours: 0,
  reason: ''
})
const activityIdInput = computed({
  get: () => activityId.value === undefined ? '' : String(activityId.value),
  set: (value: string | number) => {
    const next = Number(value)
    activityId.value = Number.isFinite(next) && next > 0 ? next : undefined
  }
})
const signupIdInput = computed({
  get: () => signupId.value === undefined ? '' : String(signupId.value),
  set: (value: string | number) => {
    const next = Number(value)
    signupId.value = Number.isFinite(next) && next > 0 ? next : undefined
  }
})
const actionFormSignupIdInput = computed({
  get: () => actionForm.value.signupId ? String(actionForm.value.signupId) : '',
  set: (value: string | number) => {
    const next = Number(value)
    actionForm.value.signupId = Number.isFinite(next) && next > 0 ? next : 0
  }
})
const actionFormHoursInput = computed({
  get: () => actionForm.value.hours ? String(actionForm.value.hours) : '',
  set: (value: string | number) => {
    const next = Number(value)
    actionForm.value.hours = Number.isFinite(next) && next >= 0 ? next : 0
  }
})
const lastActionResult = ref<{
  actionLabel: string
  workHourLogId: number
  idempotencyKey: string
  grantedHours?: number
} | null>(null)

const selectedLog = computed(() => logs.value.find((log) => log.id === selectedLogId.value) || null)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const headerMeta = computed(() => [
  { label: '流水总数', value: `${total.value}`, detail: '当前记录数量' },
  { label: '当前筛选', value: operationType.value ? operationText(operationType.value) : '全部操作', detail: '支持发放 / 作废 / 重算' },
  { label: '分页进度', value: `${page.value}/${totalPages.value}`, detail: `每页 ${pageSize.value} 条` }
])
const headerHighlights = computed(() => [
  {
    label: '活动范围',
    value: activityId.value ? `活动 #${activityId.value}` : '全部活动',
    tone: 'accent'
  },
  {
    label: '报名范围',
    value: signupId.value ? `报名 #${signupId.value}` : '全部报名',
    tone: 'neutral'
  },
  {
    label: '最近处理',
    value: lastActionResult.value ? `${lastActionResult.value.actionLabel} #${lastActionResult.value.workHourLogId}` : '暂无处理记录',
    tone: 'neutral'
  }
])

const openLogDrawer = (item: Record<string, any>) => {
  selectedLogId.value = item.id
  actionForm.value = {
    signupId: item.signupId,
    hours: Math.max(item.afterTotalHours - item.beforeTotalHours, 0),
    reason: item.reason || ''
  }
  drawerOpen.value = true
}

const closeLogDrawer = () => {
  drawerOpen.value = false
}

const loadLogs = async () => {
  loading.value = true
  try {
    const response = await workHoursApi.list({
      page: page.value,
      pageSize: pageSize.value,
      activityId: activityId.value,
      signupId: signupId.value,
      operationType: operationType.value
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '获取工时流水失败')
    }
    logs.value = response.data.list || []
    total.value = response.data.total || 0
    if (!logs.value.some((log) => log.id === selectedLogId.value)) {
      selectedLogId.value = logs.value[0]?.id ?? null
    }
  } catch (error: any) {
    console.error('加载工时流水失败:', error)
    messageStore.error(error.message || '加载工时流水失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const makeIdempotencyKey = (prefix: string, targetSignupId: number) => {
  const suffix = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `${prefix}-${targetSignupId}-${suffix}`
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

const voidWorkHour = async () => {
  if (!actionForm.value.signupId || !actionForm.value.reason) {
    messageStore.error('请先填写报名 ID 和原因')
    return
  }
  acting.value = true
  try {
    const idempotencyKey = makeIdempotencyKey('void', actionForm.value.signupId)
    const response = await workHoursApi.void({
      signupId: actionForm.value.signupId,
      reason: actionForm.value.reason,
      idempotencyKey
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '作废工时失败')
    }
    lastActionResult.value = {
      actionLabel: '作废工时',
      workHourLogId: response.data.workHourLogId,
      idempotencyKey
    }
    messageStore.success('工时已作废')
    await loadLogs()
  } catch (error: any) {
    console.error('作废工时失败:', error)
    messageStore.error(error.message || '作废工时失败，请稍后重试')
  } finally {
    acting.value = false
  }
}

const recalculateWorkHour = async () => {
  if (!actionForm.value.signupId || !actionForm.value.reason) {
    messageStore.error('请先填写报名 ID 和原因')
    return
  }
  acting.value = true
  try {
    const idempotencyKey = makeIdempotencyKey('recalculate', actionForm.value.signupId)
    const response = await workHoursApi.recalculate({
      signupId: actionForm.value.signupId,
      hours: actionForm.value.hours,
      reason: actionForm.value.reason,
      idempotencyKey
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '重算工时失败')
    }
    lastActionResult.value = {
      actionLabel: '重算工时',
      workHourLogId: response.data.workHourLogId,
      idempotencyKey,
      grantedHours: response.data.grantedHours
    }
    messageStore.success(`工时已重算，发放 ${response.data.grantedHours}h`)
    await loadLogs()
  } catch (error: any) {
    console.error('重算工时失败:', error)
    messageStore.error(error.message || '重算工时失败，请稍后重试')
  } finally {
    acting.value = false
  }
}

const operationText = (type: WorkHourOperationType) => ({
  [WorkHourOperationType.GRANT]: '发放',
  [WorkHourOperationType.VOID]: '作废',
  [WorkHourOperationType.RECALCULATE]: '重算'
}[type] || '未知')

const operationTone = (type: WorkHourOperationType) => ({
  [WorkHourOperationType.GRANT]: 'green',
  [WorkHourOperationType.VOID]: 'rose',
  [WorkHourOperationType.RECALCULATE]: 'amber'
}[type] || 'slate') as 'green' | 'rose' | 'amber' | 'slate'

onMounted(() => {
  void loadLogs()
})

watch([activityId, signupId, operationType, pageSize], () => {
  page.value = 1
  void loadLogs()
})
</script>
