<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Volunteers"
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
        <button
          class="org-toolbar-button"
          :disabled="importing"
          @click="triggerImport"
        >
          {{ importing ? '导入中...' : '导入志愿者' }}
        </button>
        <button
          class="org-toolbar-button org-toolbar-button--soft"
          :disabled="exporting"
          @click="exportVolunteers"
        >
          {{ exporting ? '导出中...' : '导出志愿者' }}
        </button>
      </template>
    </OrganizationPageHeader>

    <OrganizationSectionCard
      title="筛选"
      description="支持关键词检索真实志愿者列表。"
      tone="soft"
    >
      <div class="flex flex-wrap gap-3">
        <input
          v-model.trim="keyword"
          type="text"
          class="input max-w-sm"
          placeholder="搜索志愿者姓名"
        >
        <button
          class="org-toolbar-button"
          :disabled="loading"
          @click="loadVolunteers"
        >
          {{ loading ? '加载中...' : '刷新列表' }}
        </button>
      </div>
    </OrganizationSectionCard>

    <OrganizationSectionCard
      title="志愿者列表"
      description="服务时长、场次和状态基于真实志愿者列表接口。"
    >
      <div
        v-if="loading"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
      >
        正在加载志愿者...
      </div>

      <div
        v-else-if="!volunteers.length"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
      >
        当前没有可展示的志愿者数据。
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <article
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          class="organization-surface-lift rounded-[1.3rem] border border-slate-200 bg-white px-5 py-4"
        >
          <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f08b53] to-[#ec5b13] text-lg font-bold text-white">
                {{ volunteer.realName?.charAt(0) || '志' }}
              </div>
              <div>
                <h2 class="text-base font-bold text-slate-900">
                  {{ volunteer.realName || '未实名' }}
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                  志愿者 ID: {{ volunteer.id }} · 审核状态 {{ auditText(volunteer.auditStatus) }}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span>{{ volunteer.totalHours }}h</span>
              <span>{{ volunteer.serviceCount }} 场活动</span>
              <span>信用 {{ volunteer.creditScore }}</span>
              <span
                class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="statusClass(volunteer.status)"
              >
                {{ statusText(volunteer.status) }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </OrganizationSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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

const headerMeta = computed(() => {
  const activeCount = volunteers.value.filter((item) => item.status === VolunteerStatus.ACTIVE).length
  const totalHours = volunteers.value.reduce((sum, item) => sum + item.totalHours, 0)
  return [
    { label: '总志愿者', value: `${total.value}`, detail: '来自真实列表接口' },
    { label: '活跃志愿者', value: `${activeCount}`, detail: '状态=活跃' },
    { label: '总服务时长', value: `${totalHours}h`, detail: '当前页统计' }
  ]
})

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

const statusClass = (status: VolunteerStatus) => ({
  [VolunteerStatus.ACTIVE]: 'bg-emerald-100 text-emerald-700',
  [VolunteerStatus.INACTIVE]: 'bg-amber-100 text-amber-700',
  [VolunteerStatus.OTHER]: 'bg-slate-100 text-slate-600'
}[status] || 'bg-slate-100 text-slate-600')

const auditText = (status: VolunteerAuditStatus) => ({
  [VolunteerAuditStatus.UNVERIFIED]: '未认证',
  [VolunteerAuditStatus.PENDING]: '审核中',
  [VolunteerAuditStatus.APPROVED]: '已通过',
  [VolunteerAuditStatus.REJECTED]: '已驳回'
}[status] || '未知')

onMounted(() => {
  void loadVolunteers()
})
</script>
