<template>
  <DataListPage>
    <template #header>
      <OrganizationPageHeader
        eyebrow="志愿者"
        title="志愿者管理"
        description="集中管理志愿者档案、服务表现和导入导出。"
        layout="operations"
        :meta-items="headerMeta"
      >
        <template #summary>
          <div
            v-for="item in headerHighlights"
            :key="item.label"
            class="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold shadow-[0_12px_26px_-22px_rgba(15,23,42,0.25)]"
            :class="item.tone === 'accent'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-white/90 text-slate-600'"
          >
            <span class="text-xs uppercase tracking-[0.18em] text-slate-400">{{ item.label }}</span>
            <span class="text-slate-900">{{ item.value }}</span>
          </div>
        </template>
        <template #actions>
          <input
            ref="importInputRef"
            type="file"
            class="hidden"
            accept=".xlsx,.xls"
            @change="handleImport"
          >
          <div class="relative w-full 2xl:max-w-sm">
            <Input
              v-model.trim="keyword"
              placeholder="搜索志愿者姓名"
              :icon="SearchIcon"
              allow-clear
            />
          </div>
          <Button
            variant="primary"
            :loading="importing"
            @click="triggerImport"
          >
            {{ importing ? '导入中...' : '导入志愿者' }}
          </Button>
          <Button
            variant="outline"
            :loading="exporting"
            @click="exportVolunteers"
          >
            {{ exporting ? '导出中...' : '导出志愿者' }}
          </Button>
        </template>
      </OrganizationPageHeader>
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="data-list-filter-grid md:grid-cols-2 2xl:grid-cols-3">
            <FilterSelect
              v-model="auditStatusFilter"
              title="审核状态"
              :options="auditStatusOptions"
            />
            <FilterSelect
              v-model="statusFilter"
              title="账户状态"
              :options="statusOptions"
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
            <span>当前 <strong>{{ volunteers.length }}</strong> 条，共 <strong>{{ total }}</strong> 条</span>
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
        title="志愿者列表"
      >
        <DataTable
          :columns="columns"
          :items="filteredVolunteers"
          :loading="loading"
          row-key="id"
          :selected-key="selectedVolunteerId"
          interactive
          open-text="查看"
          open-style="text"
          density="compact"
          empty-title="当前没有可展示的志愿者数据"
          empty-description="调整关键词后重新尝试，或先导入志愿者信息。"
          @row-click="openVolunteerDrawer"
        >
          <template #cell-identity="{ item }">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f08b53] to-[#ec5b13] text-sm font-bold text-white">
                {{ item.realName?.charAt(0) || '志' }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900">
                  {{ item.realName || '未实名' }}
                </p>
                <p class="truncate text-xs text-slate-500">
                  志愿者 ID: {{ item.id }}
                </p>
              </div>
            </div>
          </template>

          <template #cell-auditStatus="{ item }">
            <StatusBadge
              :label="auditText(item.auditStatus)"
              :tone="auditTone(item.auditStatus)"
            />
          </template>

          <template #cell-status="{ item }">
            <StatusBadge
              :label="statusText(item.status)"
              :tone="statusTone(item.status)"
            />
          </template>

          <template #cell-totalHours="{ item }">
            {{ item.totalHours }}h
          </template>

          <template #cell-serviceCount="{ item }">
            {{ item.serviceCount }} 场
          </template>

          <template #cell-creditScore="{ item }">
            {{ item.creditScore }}
          </template>
        </DataTable>
      </OrganizationSectionCard>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="520px"
        :aria-label="selectedVolunteer ? `${selectedVolunteer.realName || '志愿者'} 的详情` : '志愿者详情'"
        @close="closeVolunteerDrawer"
      >
        <template #header>
          <div
            v-if="selectedVolunteer"
            class="space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  志愿者详情
                </p>
                <h2 class="text-lg font-bold tracking-tight text-slate-900">
                  {{ selectedVolunteer.realName || '未实名' }}
                </h2>
                <p class="text-sm text-slate-500">
                  志愿者 ID: {{ selectedVolunteer.id }}
                </p>
              </div>

              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4ec] text-base font-black text-[#ec5b13]">
                {{ selectedVolunteer.realName?.charAt(0) || '志' }}
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <StatusBadge
                :label="auditText(selectedVolunteer.auditStatus)"
                :tone="auditTone(selectedVolunteer.auditStatus)"
              />
              <StatusBadge
                :label="statusText(selectedVolunteer.status)"
                :tone="statusTone(selectedVolunteer.status)"
              />
            </div>
          </div>
        </template>

        <div
          v-if="selectedVolunteer"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  性别
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ genderText(selectedVolunteer.gender) }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  服务时长
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedVolunteer.totalHours }}h
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  服务场次
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedVolunteer.serviceCount }} 场
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  信用分
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedVolunteer.creditScore }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  最后更新时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedVolunteer.updatedAt || selectedVolunteer.createdAt || '待更新' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  注册时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedVolunteer.createdAt || '待更新' }}
                </p>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  生日
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedVolunteer.birthday || '待补充' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  个人简介
                </p>
                <p class="mt-1 text-sm leading-6 text-slate-700">
                  {{ selectedVolunteer.introduction || '暂未填写个人简介' }}
                </p>
              </div>
            </div>
          </section>
        </div>

        <WorkbenchEmptyPanel v-else>
          点击志愿者行查看详情。
        </WorkbenchEmptyPanel>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import WorkbenchEmptyPanel from '@/components/workbench/WorkbenchEmptyPanel.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DataTable, { type DataTableColumn } from '@/components/data-list/DataTable.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { volunteerApi } from '@/api/volunteer'
import { adminApi } from '@/api/admin'
import { useMessageStore } from '@/store/modules/messages'
import { VolunteerAuditStatus, VolunteerStatus, type VolunteerListItem, type VolunteerProfileInfo } from '@/types/volunteer'
import { SearchIcon } from 'lucide-vue-next'
import { shouldRefreshOnKeepAliveActivated } from '@/utils/keepAliveRefresh'

const route = useRoute()
const messageStore = useMessageStore()

const importInputRef = ref<HTMLInputElement | null>(null)
const keyword = ref('')
const auditStatusFilter = ref<VolunteerAuditStatus | undefined>(undefined)
const statusFilter = ref<VolunteerStatus | undefined>(undefined)
const page = ref(1)
const pageSize = ref(20)
const auditStatusOptions = [
  { value: undefined, label: '全部审核状态', description: '查看所有认证流程状态' },
  { value: VolunteerAuditStatus.UNVERIFIED, label: '未认证', description: '还未进入认证流程的志愿者' },
  { value: VolunteerAuditStatus.PENDING, label: '审核中', description: '正在等待处理的认证申请' },
  { value: VolunteerAuditStatus.APPROVED, label: '已通过', description: '已完成认证的志愿者' },
  { value: VolunteerAuditStatus.REJECTED, label: '已驳回', description: '认证未通过的志愿者' }
] as const
const statusOptions = [
  { value: undefined, label: '全部账户状态', description: '查看所有账户状态' },
  { value: VolunteerStatus.ACTIVE, label: '活跃', description: '当前可正常参与活动' },
  { value: VolunteerStatus.INACTIVE, label: '非活跃', description: '最近未活跃或暂停参与' },
  { value: VolunteerStatus.OTHER, label: '其他', description: '其他待归类状态' }
] as const
const pageSizeOptions = [
  { value: 10, label: '10 条', description: '适合逐条核对' },
  { value: 20, label: '20 条', description: '默认查看密度' },
  { value: 50, label: '50 条', description: '适合批量浏览' }
] as const
const volunteers = ref<VolunteerListItem[]>([])
const total = ref(0)
const loading = ref(false)
const importing = ref(false)
const exporting = ref(false)
const selectedVolunteerId = ref<number | null>(null)
const selectedVolunteerSnapshot = ref<(VolunteerListItem & Partial<VolunteerProfileInfo>) | null>(null)
const drawerOpen = ref(false)
const hasLoadedOnce = ref(false)
const hasActivatedOnce = ref(false)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

const columns: DataTableColumn[] = [
  { key: 'identity', label: '志愿者', width: '260px' },
  { key: 'auditStatus', label: '审核状态', width: '130px', align: 'center' },
  { key: 'status', label: '账户状态', width: '120px', align: 'center' },
  { key: 'totalHours', label: '服务时长', width: '120px', align: 'center' },
  { key: 'serviceCount', label: '服务场次', width: '120px', align: 'center' },
  { key: 'creditScore', label: '信用分', width: '110px', align: 'center' }
]

const headerMeta = computed(() => {
  const activeCount = filteredVolunteers.value.filter((item) => item.status === VolunteerStatus.ACTIVE).length
  const totalHours = filteredVolunteers.value.reduce((sum, item) => sum + item.totalHours, 0)
  return [
    { label: '总志愿者', value: `${total.value}`, detail: '当前列表规模' },
    { label: '活跃志愿者', value: `${activeCount}`, detail: '当前筛选结果中状态为活跃' },
    { label: '总服务时长', value: `${totalHours}h`, detail: '当前筛选结果统计' },
    { label: '分页进度', value: `${page.value}/${totalPages.value}`, detail: `每页 ${pageSize.value} 条` }
  ]
})
const headerHighlights = computed(() => [
  {
    label: '审核状态',
    value: auditStatusText(auditStatusFilter.value),
    tone: 'accent'
  },
  {
    label: '账户状态',
    value: statusFilterText(statusFilter.value),
    tone: 'neutral'
  },
  {
    label: '当前页',
    value: `${volunteers.value.length} / ${total.value}`,
    tone: 'neutral'
  }
])

const filteredVolunteers = computed(() => volunteers.value.filter((item) => {
  if (auditStatusFilter.value !== undefined && item.auditStatus !== auditStatusFilter.value) {
    return false
  }
  if (statusFilter.value !== undefined && item.status !== statusFilter.value) {
    return false
  }
  return true
}))

const selectedVolunteer = computed(() => {
  if (selectedVolunteerId.value === null) {
    return null
  }

  return volunteers.value.find((item) => item.id === selectedVolunteerId.value) ?? selectedVolunteerSnapshot.value
})

const syncSelectedVolunteer = () => {
  if (selectedVolunteerId.value === null) {
    return
  }

  const refreshedVolunteer = volunteers.value.find((item) => item.id === selectedVolunteerId.value)
  if (refreshedVolunteer) {
    selectedVolunteerSnapshot.value = refreshedVolunteer
  }
}

const loadVolunteers = async () => {
  loading.value = true
  try {
    const response = await volunteerApi.list({
      keyword: keyword.value || undefined,
      auditStatus: auditStatusFilter.value,
      status: statusFilter.value,
      page: page.value,
      pageSize: pageSize.value
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '获取志愿者列表失败')
    }
    volunteers.value = response.data.list || []
    total.value = response.data.total || 0
    syncSelectedVolunteer()
  } catch (error: any) {
    console.error('加载志愿者列表失败:', error)
    messageStore.error(error.message || '加载志愿者列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const goToPreviousPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await loadVolunteers()
}

const goToNextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await loadVolunteers()
}

const triggerImport = () => {
  importInputRef.value?.click()
}

const openVolunteerDrawer = async (volunteer: VolunteerListItem) => {
  selectedVolunteerId.value = volunteer.id
  selectedVolunteerSnapshot.value = volunteer
  drawerOpen.value = true
  try {
    const response = await volunteerApi.getDetail(volunteer.id)
    if (response.code !== 200) {
      throw new Error(response.msg || '获取志愿者详情失败')
    }
    selectedVolunteerSnapshot.value = {
      ...volunteer,
      ...response.data.volunteer
    }
  } catch (error: any) {
    console.error('加载志愿者详情失败:', error)
    messageStore.error(error.message || '加载志愿者详情失败，请稍后重试')
  }
}

const closeVolunteerDrawer = () => {
  drawerOpen.value = false
  selectedVolunteerId.value = null
  selectedVolunteerSnapshot.value = null
}

const handleImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  importing.value = true
  try {
    const response = await adminApi.importVolunteers(file)
    if (response.code !== 200) {
      throw new Error(response.msg || '导入志愿者失败')
    }
    messageStore.success(`导入完成：成功 ${response.data.successCount} 条，失败 ${response.data.failedCount} 条`)
    await loadVolunteers()
  } catch (error: any) {
    console.error('导入志愿者失败:', error)
    messageStore.error(error.message || '导入志愿者失败，请稍后重试')
  } finally {
    importing.value = false
    target.value = ''
  }
}

const getDownloadFileName = (contentDisposition?: string | null, fallback = 'export.xlsx') => {
  const match = contentDisposition?.match(/filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/)
  return decodeURIComponent(match?.[1] || match?.[2] || fallback)
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const exportVolunteers = async () => {
  exporting.value = true
  try {
    const response = await adminApi.exportVolunteers({
      keyword: keyword.value || '',
      auditStatus: auditStatusFilter.value,
      status: statusFilter.value
    })
    downloadBlob(
      response.data,
      getDownloadFileName(response.headers['content-disposition'], 'volunteers.xlsx')
    )
    messageStore.success('志愿者导出已开始')
  } catch (error: any) {
    console.error('导出志愿者失败:', error)
    messageStore.error(error.message || '导出志愿者失败，请稍后重试')
  } finally {
    exporting.value = false
  }
}

const statusText = (status: VolunteerStatus) => ({
  [VolunteerStatus.ACTIVE]: '活跃',
  [VolunteerStatus.INACTIVE]: '非活跃',
  [VolunteerStatus.OTHER]: '其他'
}[status] || '未知')

const statusTone = (status: VolunteerStatus) => ({
  [VolunteerStatus.ACTIVE]: 'green',
  [VolunteerStatus.INACTIVE]: 'amber',
  [VolunteerStatus.OTHER]: 'slate'
}[status] || 'slate')

const auditText = (status: VolunteerAuditStatus) => ({
  [VolunteerAuditStatus.UNVERIFIED]: '未认证',
  [VolunteerAuditStatus.PENDING]: '审核中',
  [VolunteerAuditStatus.APPROVED]: '已通过',
  [VolunteerAuditStatus.REJECTED]: '已驳回'
}[status] || '未知')

const auditTone = (status: VolunteerAuditStatus) => ({
  [VolunteerAuditStatus.UNVERIFIED]: 'slate',
  [VolunteerAuditStatus.PENDING]: 'amber',
  [VolunteerAuditStatus.APPROVED]: 'green',
  [VolunteerAuditStatus.REJECTED]: 'rose'
}[status] || 'slate')

const auditStatusText = (status?: VolunteerAuditStatus) => {
  if (status === undefined) return '全部审核状态'
  return auditText(status)
}

const statusFilterText = (status?: VolunteerStatus) => {
  if (status === undefined) return '全部账户状态'
  return statusText(status)
}

const genderText = (gender?: number) => {
  if (gender === 1) return '男'
  if (gender === 2) return '女'
  return '未知'
}

onMounted(() => {
  hasLoadedOnce.value = true
  void loadVolunteers()
})

onActivated(() => {
  if (!hasActivatedOnce.value) {
    hasActivatedOnce.value = true
    return
  }

  if (!shouldRefreshOnKeepAliveActivated({
    currentRouteName: String(route.name || ''),
    expectedRouteName: 'organization-volunteers',
    hasLoadedOnce: hasLoadedOnce.value,
    hasActivatedOnce: hasActivatedOnce.value
  })) {
    return
  }

  void loadVolunteers()
})

watch([keyword, auditStatusFilter, statusFilter, pageSize], () => {
  page.value = 1
  void loadVolunteers()
})
</script>
