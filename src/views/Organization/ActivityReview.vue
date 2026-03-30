<template>
  <DataListPage>
    <template #header>
      <OrganizationPageHeader
        eyebrow="审核队列"
        title="审核中心"
        description="集中处理实名认证、组织资料、活动等各类待办审批。"
        layout="operations"
        :meta-items="headerMeta"
      >
        <template #summary>
          <div
            v-for="item in headerHighlights"
            :key="item.label"
            class="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold shadow-[0_12px_26px_-22px_rgba(15,23,42,0.25)]"
            :class="item.tone === 'danger'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-slate-200 bg-white/90 text-slate-600'"
          >
            <span class="text-xs uppercase tracking-[0.18em] text-slate-400">{{ item.label }}</span>
            <span class="text-slate-900">{{ item.value }}</span>
          </div>
        </template>
        <template #actions>
          <Input
            v-model.trim="searchQuery"
            placeholder="搜索标题、说明或审核单号"
            :icon="SearchIcon"
            allow-clear
            class="w-full 2xl:max-w-sm"
          />
          <Button
            variant="success"
            class="w-full 2xl:w-auto"
            :loading="actionLoading"
            :disabled="!actionableItems.length"
            @click="batchApproveFiltered"
          >
            批量通过
          </Button>
          <Button
            variant="danger"
            class="w-full 2xl:w-auto"
            :loading="actionLoading"
            :disabled="!actionableItems.length"
            @click="batchRejectFiltered"
          >
            批量驳回
          </Button>
        </template>
      </OrganizationPageHeader>
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="data-list-filter-grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <FilterSelect
              v-model="targetTypeFilter"
              title="审核类型"
              :icon="FoldersIcon"
              :options="targetTypeOptions"
            />
            <FilterSelect
              v-model="auditStatusFilter"
              title="审核状态"
              :icon="TimerResetIcon"
              :options="auditStatusOptions"
            />
            <DatePicker
              v-model="createdFrom"
              placeholder="开始日期"
              mode="date"
            />
            <DatePicker
              v-model="createdTo"
              placeholder="结束日期"
              mode="date"
            />
            <Input
              v-model.number="slaHours"
              type="number"
              min="1"
              placeholder="SLA 小时数"
            />
            <FilterSelect
              v-model="pageSize"
              title="每页条数"
              :options="pageSizeOptions"
            />
          </div>
        </template>

        <template #summary>
          <div class="data-list-summary-stack">
            <span class="data-list-pagination">第 {{ page }} / {{ totalPages }} 页</span>
            <span>接口返回 <strong>{{ auditsStore.total }}</strong> 条审核记录</span>
            <span>当前列表 <strong>{{ filteredItems.length }}</strong> 条</span>
          </div>
        </template>

        <template #actions>
          <div class="data-list-action-stack">
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
      <OrganizationSectionCard
        title="待审核列表"
        description="点击任意记录，在右侧完成查看和审批。"
      >
        <DataTable
          :columns="columns"
          :items="filteredItems"
          :loading="loading"
          row-key="id"
          :selected-key="selectedAuditId"
          interactive
          open-text="查看"
          open-style="text"
          density="compact"
          empty-title="当前没有待审核记录"
          empty-description="切换筛选条件后再试。"
          @row-click="openAuditDrawer"
        >
          <template #cell-identity="{ item }">
            <div class="min-w-0 space-y-1">
              <p class="truncate text-sm font-semibold text-slate-900">
                {{ item.title }}
              </p>
              <p class="truncate text-xs text-slate-500">
                {{ item.subTitle || '无补充说明' }}
              </p>
            </div>
          </template>

          <template #cell-createdAt="{ item }">
            {{ item.createdAt }}
          </template>

          <template #cell-queue="{ item }">
            <StatusBadge
              :label="auditStatusText(item.status)"
              :tone="auditStatusTone(item.status)"
            />
          </template>

          <template #cell-target="{ item }">
            {{ targetTypeText(item.targetType) }}
          </template>
        </DataTable>
      </OrganizationSectionCard>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="560px"
        :aria-label="selectedAudit ? `${selectedAudit.title} 的审核详情` : '审核详情'"
        @close="closeAuditDrawer"
      >
        <template #header>
          <div
            v-if="selectedAudit"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                审核详情
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                {{ selectedAudit.title }}
              </h2>
              <p class="text-sm text-slate-500">
                审核单号 #{{ selectedAudit.id }} · {{ selectedAudit.createdAt }}
              </p>
            </div>

            <StatusBadge
              :label="auditStatusText(selectedAudit.status)"
              :tone="auditStatusTone(selectedAudit.status)"
            />
          </div>
        </template>

        <WorkbenchEmptyPanel v-if="detailLoading">
          正在加载审核详情...
        </WorkbenchEmptyPanel>

        <div
          v-else-if="detail"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  审核对象
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ targetTypeText(detail.targetType) }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  对象 ID
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ detail.targetId }}
                </p>
              </div>
            </div>
          </section>

          <section class="space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                变更前
              </p>
              <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {{ detail.oldContent || '无' }}
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                变更后
              </p>
              <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {{ detail.newContent || '无' }}
              </p>
            </div>
          </section>

          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              审核说明
            </p>
            <Textarea
              v-model="auditReason"
              placeholder="选填：填写审核说明"
              class="mt-2"
              :min-rows="2"
              :max-rows="5"
              allow-clear
              show-word-limit
              :max-length="{ length: 120, errorOnly: true }"
            />
          </section>
        </div>

        <WorkbenchEmptyPanel v-else>
          点击审核记录查看变更内容并完成审批。
        </WorkbenchEmptyPanel>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              v-if="selectedAuditId && selectedAudit?.status === AuditStatus.PENDING"
              variant="success"
              :loading="actionLoading"
              @click="approveCurrentAudit"
            >
              审核通过
            </Button>
            <Button
              v-if="selectedAuditId && selectedAudit?.status === AuditStatus.PENDING"
              variant="danger"
              :loading="actionLoading"
              @click="rejectCurrentAudit"
            >
              审核驳回
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
import DatePicker from '@/components/ui/DatePicker.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import WorkbenchEmptyPanel from '@/components/workbench/WorkbenchEmptyPanel.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DataTable, { type DataTableColumn } from '@/components/data-list/DataTable.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useAuditsStore } from '@/store/modules/audits'
import { useMessageStore } from '@/store/modules/messages'
import { AuditDecisionAction, AuditStatus, AuditTargetType } from '@/types/audit'
import {
  getAuditStatusFilterText,
  getAuditStatusRequest,
  type ActivityReviewStatusFilter
} from './activityReviewStatus'
import { FoldersIcon, SearchIcon, TimerResetIcon } from 'lucide-vue-next'

const auditsStore = useAuditsStore()
const messageStore = useMessageStore()

const selectedAuditId = ref<number | null>(null)
const auditReason = ref('')
const detailLoading = ref(false)
const actionLoading = ref(false)
const drawerOpen = ref(false)
const searchQuery = ref('')
const auditStatusFilter = ref<ActivityReviewStatusFilter>('all')
const targetTypeFilter = ref<'all' | AuditTargetType>('all')
const createdFrom = ref('')
const createdTo = ref('')
const slaHours = ref<number | undefined>()
const page = ref(1)
const pageSize = ref(20)
const pageSizeOptions = [
  { value: 10, label: '10 条', description: '适合逐条审核' },
  { value: 20, label: '20 条', description: '默认处理密度' },
  { value: 50, label: '50 条', description: '适合批量巡检' }
] as const
const auditStatusOptions = [
  { value: 'all', label: '全部状态', description: '查看所有审核状态的记录' },
  { value: AuditStatus.PENDING, label: '待审核', description: '查看等待处理的审核记录' },
  { value: AuditStatus.APPROVED, label: '审核通过', description: '查看已通过的审核记录' },
  { value: AuditStatus.REJECTED, label: '审核拒绝', description: '查看已拒绝的审核记录' }
] as const
const targetTypeOptions = [
  { value: 'all', label: '全部类型', description: '统一查看实名、组织、成员和活动审核' },
  { value: AuditTargetType.VOLUNTEER_REAL_NAME, label: '实名审核', description: '查看志愿者实名申请' },
  { value: AuditTargetType.ORGANIZATION, label: '组织审核', description: '查看组织资料和认证变更' },
  { value: AuditTargetType.MEMBERSHIP, label: '成员审核', description: '查看加入组织申请' },
  { value: AuditTargetType.ACTIVITY_SIGNUP, label: '活动报名', description: '查看活动报名审核' }
] as const

const columns: DataTableColumn[] = [
  {
    key: 'identity',
    label: '审核项',
    width: '360px',
    cellClass: 'align-top'
  },
  {
    key: 'target',
    label: '对象类型',
    width: '150px'
  },
  {
    key: 'createdAt',
    label: '创建时间',
    width: '170px'
  },
  {
    key: 'queue',
    label: '审核状态',
    width: '130px',
    align: 'center',
    cellClass: 'whitespace-nowrap'
  }
]

const items = computed(() => auditsStore.items)
const detail = computed(() => auditsStore.currentRecord)
const loading = computed(() => auditsStore.loading)
const totalPages = computed(() => Math.max(1, Math.ceil(auditsStore.total / pageSize.value)))
const selectedAudit = computed(() => (
  items.value.find((item) => item.id === selectedAuditId.value) || null
))
const actionableItems = computed(() => (
  filteredItems.value.filter((item) => item.status === AuditStatus.PENDING)
))

const filteredItems = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return items.value.filter((item) => {
    if (!keyword) {
      return true
    }

    return [item.title, item.subTitle || '', String(item.id)]
      .some((field) => field.toLowerCase().includes(keyword))
  })
})

const targetTypes = computed(() => (
  targetTypeFilter.value === 'all'
    ? [
        AuditTargetType.VOLUNTEER_REAL_NAME,
        AuditTargetType.ORGANIZATION,
        AuditTargetType.MEMBERSHIP,
        AuditTargetType.ACTIVITY_SIGNUP
      ]
    : [targetTypeFilter.value]
))

const headerMeta = computed(() => [
  { label: '审核记录总数', value: `${auditsStore.total}`, detail: '来源于审核中心接口' },
  {
    label: '当前模块',
    value: targetTypeFilter.value === 'all' ? '综合审核' : targetTypeText(targetTypeFilter.value),
    detail: '覆盖实名、组织、成员与活动报名'
  },
  {
    label: '已超时',
    value: `${items.value.filter((item) => item.isOverdue).length}`,
    detail: '当前待办中的超时记录'
  },
  {
    label: '分页进度',
    value: `${page.value}/${totalPages.value}`,
    detail: `当前列表 ${filteredItems.value.length} 条`
  }
])
const headerHighlights = computed(() => [
  {
    label: '审核状态',
    value: getAuditStatusFilterText(auditStatusFilter.value),
    tone: auditStatusFilter.value === AuditStatus.REJECTED ? 'danger' : 'neutral'
  },
  {
    label: '处理范围',
    value: targetTypeFilter.value === 'all' ? '全部类型' : targetTypeText(targetTypeFilter.value),
    tone: 'neutral'
  },
  {
    label: '批量操作',
    value: actionableItems.value.length ? `${actionableItems.value.length} 条可处理` : '当前无可处理项',
    tone: 'neutral'
  }
])

const loadAudits = async () => {
  try {
    const data = await auditsStore.fetchPending({
      targetTypes: targetTypes.value,
      status: getAuditStatusRequest(auditStatusFilter.value) as AuditStatus[],
      keyword: searchQuery.value || undefined,
      page: page.value,
      pageSize: pageSize.value,
      createdFrom: createdFrom.value || undefined,
      createdTo: createdTo.value || undefined,
      slaHours: slaHours.value || undefined
    })

    if (!selectedAuditId.value && data.list.length) {
      await openAuditById(data.list[0].id)
    }
  } catch (error: any) {
    console.error('加载审核列表失败:', error)
    messageStore.error(error.message || '加载审核列表失败，请稍后重试')
  }
}

const goToPreviousPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await loadAudits()
}

const goToNextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await loadAudits()
}

const openAuditById = async (id: number) => {
  selectedAuditId.value = id
  drawerOpen.value = true
  detailLoading.value = true
  try {
    await auditsStore.fetchDetail(id)
  } catch (error: any) {
    console.error('加载审核详情失败:', error)
    messageStore.error(error.message || '加载审核详情失败，请稍后重试')
  } finally {
    detailLoading.value = false
  }
}

const openAuditDrawer = async (item: Record<string, any>) => {
  await openAuditById(item.id)
}

const closeAuditDrawer = () => {
  drawerOpen.value = false
}

const approveCurrentAudit = async () => {
  if (!selectedAuditId.value) return
  actionLoading.value = true
  try {
    await auditsStore.approve({ id: selectedAuditId.value, reason: auditReason.value || '审核通过' })
    messageStore.success('审核已通过')
    selectedAuditId.value = null
    auditReason.value = ''
    drawerOpen.value = false
    await loadAudits()
  } catch (error: any) {
    console.error('审核通过失败:', error)
    messageStore.error(error.message || '审核通过失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const rejectCurrentAudit = async () => {
  if (!selectedAuditId.value) return
  actionLoading.value = true
  try {
    await auditsStore.reject({ id: selectedAuditId.value, reason: auditReason.value || '审核驳回' })
    messageStore.success('审核已驳回')
    selectedAuditId.value = null
    auditReason.value = ''
    drawerOpen.value = false
    await loadAudits()
  } catch (error: any) {
    console.error('审核驳回失败:', error)
    messageStore.error(error.message || '审核驳回失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const runBatchDecision = async (action: AuditDecisionAction, successMessage: string) => {
  if (!actionableItems.value.length) return
  actionLoading.value = true
  try {
    const response = await auditsStore.batchDecision({
      ids: actionableItems.value.map((item) => item.id),
      action,
      reason: auditReason.value || undefined
    })
    messageStore.success(`${successMessage}，成功 ${response.successCount} 条`)
    selectedAuditId.value = null
    auditReason.value = ''
    drawerOpen.value = false
    await loadAudits()
  } catch (error: any) {
    console.error('批量审核失败:', error)
    messageStore.error(error.message || '批量审核失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const batchApproveFiltered = async () => {
  await runBatchDecision(AuditDecisionAction.APPROVE, '批量审核通过完成')
}

const batchRejectFiltered = async () => {
  await runBatchDecision(AuditDecisionAction.REJECT, '批量审核驳回完成')
}

const targetTypeText = (targetType: AuditTargetType) => ({
  [AuditTargetType.VOLUNTEER_REAL_NAME]: '志愿者实名',
  [AuditTargetType.ORGANIZATION]: '组织审核',
  [AuditTargetType.MEMBERSHIP]: '加入组织',
  [AuditTargetType.ACTIVITY_SIGNUP]: '活动报名'
}[targetType] || '未知类型')

const auditStatusText = (status: AuditStatus) => ({
  [AuditStatus.PENDING]: '待审核',
  [AuditStatus.APPROVED]: '审核通过',
  [AuditStatus.REJECTED]: '审核拒绝'
}[status] || '未知状态')

const auditStatusTone = (
  status: AuditStatus
): 'green' | 'blue' | 'amber' | 'slate' | 'rose' => {
  switch (status) {
    case AuditStatus.PENDING:
      return 'amber'
    case AuditStatus.APPROVED:
      return 'green'
    case AuditStatus.REJECTED:
      return 'rose'
    default:
      return 'slate'
  }
}

onMounted(() => {
  void loadAudits()
})

watch([searchQuery, auditStatusFilter, targetTypeFilter, createdFrom, createdTo, slaHours, pageSize], () => {
  page.value = 1
  void loadAudits()
})
</script>
