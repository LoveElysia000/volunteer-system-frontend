<template>
  <DataListPage>
    <template #header>
      <OrganizationPageHeader
        eyebrow="志愿者"
        title="志愿者管理"
        description="志愿者列表来自真实接口，导入导出通过按钮直接调用后端文件接口。"
        :meta-items="headerMeta"
      >
        <template #actions>
          <input
            ref="importInputRef"
            type="file"
            class="hidden"
            accept=".xlsx,.xls"
            @change="handleImport"
          >
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
          <input
            v-model.trim="keyword"
            type="text"
            class="input max-w-sm"
            placeholder="搜索志愿者姓名"
          >
        </template>

        <template #actions>
          <Button
            variant="outline"
            :loading="loading"
            @click="loadVolunteers"
          >
            刷新列表
          </Button>
        </template>
      </DataToolbar>
    </template>

    <template #body>
      <OrganizationSectionCard
        title="志愿者列表"
        description="服务时长、场次和状态基于真实志愿者列表接口。"
      >
        <DataTable
          :columns="columns"
          :items="volunteers"
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
            </div>
          </section>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击志愿者行查看详情。
        </div>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
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
import { VolunteerAuditStatus, VolunteerStatus, type VolunteerListItem } from '@/types/volunteer'

const messageStore = useMessageStore()

const importInputRef = ref<HTMLInputElement | null>(null)
const keyword = ref('')
const volunteers = ref<VolunteerListItem[]>([])
const total = ref(0)
const loading = ref(false)
const importing = ref(false)
const exporting = ref(false)
const selectedVolunteerId = ref<number | null>(null)
const selectedVolunteerSnapshot = ref<VolunteerListItem | null>(null)
const drawerOpen = ref(false)

const columns: DataTableColumn[] = [
  { key: 'identity', label: '志愿者', width: '260px' },
  { key: 'auditStatus', label: '审核状态', width: '130px', align: 'center' },
  { key: 'status', label: '账户状态', width: '120px', align: 'center' },
  { key: 'totalHours', label: '服务时长', width: '120px', align: 'center' },
  { key: 'serviceCount', label: '服务场次', width: '120px', align: 'center' },
  { key: 'creditScore', label: '信用分', width: '110px', align: 'center' }
]

const headerMeta = computed(() => {
  const activeCount = volunteers.value.filter((item) => item.status === VolunteerStatus.ACTIVE).length
  const totalHours = volunteers.value.reduce((sum, item) => sum + item.totalHours, 0)
  return [
    { label: '总志愿者', value: `${total.value}`, detail: '来自真实列表接口' },
    { label: '活跃志愿者', value: `${activeCount}`, detail: '状态=活跃' },
    { label: '总服务时长', value: `${totalHours}h`, detail: '当前页统计' }
  ]
})

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
      page: 1,
      pageSize: 20
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

const triggerImport = () => {
  importInputRef.value?.click()
}

const openVolunteerDrawer = (volunteer: VolunteerListItem) => {
  selectedVolunteerId.value = volunteer.id
  selectedVolunteerSnapshot.value = volunteer
  drawerOpen.value = true
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
      auditStatus: undefined,
      status: undefined
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

onMounted(() => {
  void loadVolunteers()
})
</script>
