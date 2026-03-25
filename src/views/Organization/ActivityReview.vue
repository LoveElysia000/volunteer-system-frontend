<template>
  <DataListPage>
    <template #header>
      <OrganizationPageHeader
        eyebrow="审核队列"
        title="活动审核"
        description="集中处理活动申请与待办审批。"
        :meta-items="headerMeta"
      />
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="grid gap-3 lg:grid-cols-[minmax(220px,320px)_180px]">
            <input
              v-model.trim="searchQuery"
              type="text"
              class="input"
              placeholder="搜索标题、说明或审核单号"
            >
            <FilterSelect
              v-model="queueFilter"
              title="审核队列"
              :icon="TimerResetIcon"
              :options="queueFilterOptions"
            />
          </div>
        </template>

        <template #actions>
          <Button
            variant="outline"
            :loading="loading"
            @click="loadAudits"
          >
            刷新审核队列
          </Button>
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
          empty-description="切换筛选条件后再试，或刷新审核队列。"
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
              :label="item.isOverdue ? '已超时' : '待处理'"
              :tone="item.isOverdue ? 'rose' : 'amber'"
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
              :label="selectedAudit.isOverdue ? '已超时' : '待处理'"
              :tone="selectedAudit.isOverdue ? 'rose' : 'amber'"
            />
          </div>
        </template>

        <div
          v-if="detailLoading"
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          正在加载审核详情...
        </div>

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

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击审核记录查看变更内容并完成审批。
        </div>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              v-if="selectedAuditId"
              variant="success"
              :loading="actionLoading"
              @click="approveCurrentAudit"
            >
              审核通过
            </Button>
            <Button
              v-if="selectedAuditId"
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
import { computed, onMounted, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import Textarea from '@/components/ui/Textarea.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DataTable, { type DataTableColumn } from '@/components/data-list/DataTable.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useAuditsStore } from '@/store/modules/audits'
import { useMessageStore } from '@/store/modules/messages'
import { AuditTargetType } from '@/types/audit'
import { TimerResetIcon } from 'lucide-vue-next'

const auditsStore = useAuditsStore()
const messageStore = useMessageStore()

const selectedAuditId = ref<number | null>(null)
const auditReason = ref('')
const detailLoading = ref(false)
const actionLoading = ref(false)
const drawerOpen = ref(false)
const searchQuery = ref('')
const queueFilter = ref<'all' | 'overdue' | 'pending'>('all')
const queueFilterOptions = [
  { value: 'all', label: '全部队列', description: '查看所有待审核记录' },
  { value: 'overdue', label: '已超时', description: '优先处理超过时限的审核单' },
  { value: 'pending', label: '正常待处理', description: '查看仍在正常处理时限内的记录' }
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
    label: '队列状态',
    width: '130px',
    align: 'center',
    cellClass: 'whitespace-nowrap'
  }
]

const items = computed(() => auditsStore.items)
const detail = computed(() => auditsStore.currentRecord)
const loading = computed(() => auditsStore.loading)
const selectedAudit = computed(() => (
  items.value.find((item) => item.id === selectedAuditId.value) || null
))

const filteredItems = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return items.value.filter((item) => {
    const queueMatched = queueFilter.value === 'all'
      || (queueFilter.value === 'overdue' && item.isOverdue)
      || (queueFilter.value === 'pending' && !item.isOverdue)

    if (!queueMatched) {
      return false
    }

    if (!keyword) {
      return true
    }

    return [item.title, item.subTitle || '', String(item.id)]
      .some((field) => field.toLowerCase().includes(keyword))
  })
})

const headerMeta = computed(() => [
  { label: '待审核总数', value: `${auditsStore.total}`, detail: '来源于审核中心接口' },
  { label: '当前模块', value: '活动报名审核', detail: '筛选 targetType=4' }
])

const loadAudits = async () => {
  try {
    const data = await auditsStore.fetchPending({
      targetTypes: [AuditTargetType.ACTIVITY_SIGNUP],
      page: 1,
      pageSize: 20
    })

    if (!selectedAuditId.value && data.list.length) {
      await openAuditById(data.list[0].id)
    }
  } catch (error: any) {
    console.error('加载审核列表失败:', error)
    messageStore.error(error.message || '加载审核列表失败，请稍后重试')
  }
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

const targetTypeText = (targetType: AuditTargetType) => ({
  [AuditTargetType.VOLUNTEER_REAL_NAME]: '志愿者实名',
  [AuditTargetType.ORGANIZATION]: '组织审核',
  [AuditTargetType.MEMBERSHIP]: '加入组织',
  [AuditTargetType.ACTIVITY_SIGNUP]: '活动报名'
}[targetType] || '未知类型')

onMounted(() => {
  void loadAudits()
})
</script>
