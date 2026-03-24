<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Projects"
      title="活动管理"
      description="活动列表、状态筛选和执行操作均已接入真实接口，不再依赖模拟数据。"
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
          {{ importing ? '导入中...' : '导入活动' }}
        </button>
        <button
          class="org-toolbar-button"
          :disabled="exporting"
          @click="exportActivities"
        >
          {{ exporting ? '导出中...' : '导出活动' }}
        </button>
        <RouterLink
          to="/organization/activities/create"
          class="org-toolbar-button org-toolbar-button--soft"
        >
          <PlusIcon class="h-4 w-4" />
          创建活动
        </RouterLink>
      </template>
    </OrganizationPageHeader>

    <OrganizationSectionCard
      title="活动列表"
      description="按关键字和状态过滤当前组织可访问的活动。"
    >
      <template #header>
        <div class="flex flex-wrap gap-3">
          <input
            v-model.trim="search"
            type="text"
            class="input max-w-xs"
            placeholder="搜索活动标题或地点"
          >
          <select
            v-model="filter"
            class="select"
          >
            <option value="all">
              全部状态
            </option>
            <option value="open">
              进行中
            </option>
            <option value="ended">
              已结束
            </option>
            <option value="cancelled">
              已取消
            </option>
          </select>
          <button
            class="org-toolbar-button"
            :disabled="loading"
            @click="loadActivities"
          >
            {{ loading ? '加载中...' : '刷新列表' }}
          </button>
        </div>
      </template>

      <div
        v-if="loading"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
      >
        正在加载活动列表...
      </div>

      <div
        v-else-if="!activities.length"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
      >
        当前没有可展示的活动。
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <article
          v-for="activity in activities"
          :key="activity.id"
          class="organization-surface-lift rounded-[1.3rem] border border-slate-200 bg-white px-5 py-4"
        >
          <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-base font-bold text-slate-900">
                  {{ activity.title }}
                </h2>
                <span
                  class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  :class="activity.statusClass"
                >
                  {{ activity.status }}
                </span>
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                {{ activity.description }}
              </p>
              <p class="mt-3 text-sm text-slate-500">
                {{ activity.date }} · {{ activity.location }} · {{ activity.participants }}/{{ activity.maxPeople }} 人 · {{ activity.duration }} 小时
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                class="org-toolbar-button"
                @click="selectActivity(activity)"
              >
                编辑与执行
              </button>
            </div>
          </div>
        </article>
      </div>
    </OrganizationSectionCard>

    <OrganizationSectionCard
      title="活动执行操作台"
      description="当前操作对象直接取自上方真实活动列表。"
      tone="soft"
    >
      <div
        v-if="selectedActivity"
        class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <div class="space-y-6">
          <div class="rounded-xl border border-white/70 bg-white/90 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              当前活动
            </p>
            <p class="mt-2 text-base font-bold text-slate-900">
              #{{ selectedActivity.id }} · {{ selectedActivity.title }}
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">活动标题</label>
              <input
                v-model="editForm.title"
                type="text"
                class="input"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
              <textarea
                v-model="editForm.description"
                rows="4"
                class="textarea"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">活动地点</label>
              <input
                v-model="editForm.location"
                type="text"
                class="input"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
              <input
                v-model="editForm.address"
                type="text"
                class="input"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
              <input
                :value="toDateTimeLocal(editForm.startTime)"
                type="datetime-local"
                class="input"
                @input="updateEditDateTime('startTime', $event)"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
              <input
                :value="toDateTimeLocal(editForm.endTime)"
                type="datetime-local"
                class="input"
                @input="updateEditDateTime('endTime', $event)"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">活动时长（小时）</label>
              <input
                v-model.number="editForm.duration"
                type="number"
                min="1"
                class="input"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">人数上限</label>
              <input
                v-model.number="editForm.maxPeople"
                type="number"
                min="1"
                class="input"
              >
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              class="btn btn-primary"
              :disabled="updating"
              @click="saveActivity"
            >
              {{ updating ? '保存中...' : '保存活动信息' }}
            </button>
            <button
              class="btn btn-outline"
              :disabled="finishing"
              @click="finishActivity"
            >
              {{ finishing ? '处理中...' : '标记已完结' }}
            </button>
            <button
              class="btn btn-outline"
              :disabled="deleting"
              @click="deleteActivity"
            >
              {{ deleting ? '删除中...' : '删除活动' }}
            </button>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">取消原因</label>
              <textarea
                v-model="cancelReason"
                rows="3"
                class="textarea"
                placeholder="请输入取消活动的原因"
              />
            </div>
            <div class="flex justify-end">
              <button
                class="btn btn-outline"
                :disabled="cancelling"
                @click="cancelActivity"
              >
                {{ cancelling ? '提交中...' : '取消活动' }}
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-900">
                签到码管理
              </h3>
              <button
                class="btn btn-sm btn-outline"
                :disabled="attendanceLoading"
                @click="loadAttendanceCodes"
              >
                刷新
              </button>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">签到码有效期（分钟）</label>
                <input
                  v-model.number="attendanceForm.checkInValidMinutes"
                  type="number"
                  min="1"
                  class="input"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">签退码有效期（分钟）</label>
                <input
                  v-model.number="attendanceForm.checkOutValidMinutes"
                  type="number"
                  min="1"
                  class="input"
                >
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                class="btn btn-primary"
                :disabled="attendanceLoading"
                @click="generateAttendanceCodes"
              >
                生成签到码
              </button>
              <button
                class="btn btn-outline"
                :disabled="attendanceLoading"
                @click="resetAttendanceCode(AttendanceCodeType.CHECK_IN)"
              >
                重置签到码
              </button>
              <button
                class="btn btn-outline"
                :disabled="attendanceLoading"
                @click="resetAttendanceCode(AttendanceCodeType.CHECK_OUT)"
              >
                重置签退码
              </button>
            </div>

            <div class="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 space-y-2">
              <p>签到码：<span class="font-semibold text-gray-900">{{ attendanceCodeInfo.checkInCode || '未生成' }}</span></p>
              <p>签退码：<span class="font-semibold text-gray-900">{{ attendanceCodeInfo.checkOutCode || '未生成' }}</span></p>
              <p>版本号：<span class="font-semibold text-gray-900">{{ attendanceCodeInfo.attendanceCodeVersion || '-' }}</span></p>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
            <h3 class="text-base font-semibold text-gray-900">
              补录考勤
            </h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">志愿者 ID</label>
              <input
                v-model.number="supplementForm.volunteerId"
                type="number"
                min="1"
                class="input"
                placeholder="请输入志愿者 ID"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">签到时间</label>
              <input
                :value="toDateTimeLocal(supplementForm.checkInTime)"
                type="datetime-local"
                class="input"
                @input="updateSupplementDateTime('checkInTime', $event)"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">签退时间</label>
              <input
                :value="toDateTimeLocal(supplementForm.checkOutTime)"
                type="datetime-local"
                class="input"
                @input="updateSupplementDateTime('checkOutTime', $event)"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">补录原因</label>
              <textarea
                v-model="supplementForm.reason"
                rows="3"
                class="textarea"
                placeholder="请输入补录原因"
              />
            </div>
            <div class="flex justify-end">
              <button
                class="btn btn-primary"
                :disabled="supplementing"
                @click="submitSupplementAttendance"
              >
                {{ supplementing ? '提交中...' : '提交补录' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500"
      >
        请先从上方真实活动列表选择一个活动，再进行执行操作。
      </div>
    </OrganizationSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { activitiesApi, ATTENDANCE_CODE_TYPE, mapActivityItemToOrganizationManagementView } from '@/api/activities'
import { adminApi } from '@/api/admin'
import {
  ActivityStatus,
  AttendanceCodeType,
  type OrganizationManagementActivityItem,
  type SupplementAttendanceRequest,
  type UpdateOrganizationActivityRequest
} from '@/types/activity'
import { useMessageStore } from '@/store/modules/messages'
import { PlusIcon } from 'lucide-vue-next'

const messageStore = useMessageStore()

const importInputRef = ref<HTMLInputElement | null>(null)
const search = ref('')
const filter = ref<'all' | 'open' | 'ended' | 'cancelled'>('all')
const loading = ref(false)
const importing = ref(false)
const exporting = ref(false)
const updating = ref(false)
const finishing = ref(false)
const deleting = ref(false)
const cancelling = ref(false)
const attendanceLoading = ref(false)
const supplementing = ref(false)

const activities = ref<OrganizationManagementActivityItem[]>([])
const selectedActivityId = ref<number | null>(null)
const cancelReason = ref('')
const editForm = ref<UpdateOrganizationActivityRequest>({
  title: '',
  description: '',
  location: '',
  address: '',
  startTime: '',
  endTime: '',
  duration: 2,
  maxPeople: 30
})
const attendanceForm = ref({
  checkInValidMinutes: 30,
  checkOutValidMinutes: 30
})
const attendanceCodeInfo = ref({
  checkInCode: '',
  checkOutCode: '',
  attendanceCodeVersion: 0
})
const supplementForm = ref<Omit<SupplementAttendanceRequest, 'activityId'>>({
  volunteerId: 0,
  checkInTime: '',
  checkOutTime: '',
  reason: ''
})

const selectedActivity = computed(() => (
  activities.value.find((activity) => activity.id === selectedActivityId.value) || null
))

const headerMeta = computed(() => [
  { label: '活动总数', value: `${activities.value.length}`, detail: '来自活动列表接口' },
  { label: '当前筛选', value: filter.value === 'all' ? '全部状态' : filter.value === 'open' ? '进行中' : filter.value === 'ended' ? '已结束' : '已取消', detail: '可按状态切换' }
])

const toApiDateTime = (value: string) => {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 19).replace('T', ' ')
}

const toDateTimeLocal = (value?: string) => {
  if (!value) return ''
  return value.replace(' ', 'T').slice(0, 16)
}

const updateEditDateTime = (field: 'startTime' | 'endTime', event: Event) => {
  editForm.value[field] = toApiDateTime((event.target as HTMLInputElement).value)
}

const updateSupplementDateTime = (field: 'checkInTime' | 'checkOutTime', event: Event) => {
  supplementForm.value[field] = toApiDateTime((event.target as HTMLInputElement).value)
}

const mapFilterToStatus = () => {
  if (filter.value === 'open') return ActivityStatus.OPEN
  if (filter.value === 'ended') return ActivityStatus.ENDED
  if (filter.value === 'cancelled') return ActivityStatus.CANCELLED
  return undefined
}

const selectActivity = (activity: OrganizationManagementActivityItem) => {
  selectedActivityId.value = activity.id
  editForm.value = {
    title: activity.title,
    description: activity.description,
    location: activity.location,
    address: activity.address,
    startTime: activity.startTime,
    endTime: activity.endTime,
    duration: activity.duration,
    maxPeople: activity.maxPeople
  }
}

const loadActivities = async () => {
  loading.value = true
  try {
    const response = await activitiesApi.list({
      page: 1,
      pageSize: 20,
      status: mapFilterToStatus(),
      keyword: search.value || undefined,
      sortBy: 'start_time',
      sortOrder: 'asc'
    })

    if (response.code !== 200) {
      throw new Error(response.msg || '获取活动列表失败')
    }

    activities.value = (response.data.list || []).map(mapActivityItemToOrganizationManagementView)
    if (!selectedActivityId.value && activities.value.length) {
      selectActivity(activities.value[0])
    } else if (selectedActivityId.value) {
      const current = activities.value.find((item) => item.id === selectedActivityId.value)
      if (current) {
        selectActivity(current)
      } else {
        selectedActivityId.value = null
      }
    }
  } catch (error: any) {
    console.error('加载活动列表失败:', error)
    messageStore.error(error.message || '加载活动列表失败，请稍后重试')
    activities.value = []
    selectedActivityId.value = null
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
    const response = await adminApi.importActivities(file)
    if (response.code !== 200) {
      throw new Error(response.msg || '导入活动失败')
    }
    messageStore.success(`导入完成：成功 ${response.data.successCount} 条，失败 ${response.data.failedCount} 条`)
    await loadActivities()
  } catch (error: any) {
    console.error('导入活动失败:', error)
    messageStore.error(error.message || '导入活动失败，请稍后重试')
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

const exportActivities = async () => {
  exporting.value = true
  try {
    const response = await adminApi.exportActivities({
      keyword: search.value || '',
      status: mapFilterToStatus(),
      startFrom: '',
      startTo: ''
    })
    downloadBlob(
      response.data,
      getDownloadFileName(response.headers['content-disposition'], 'activities.xlsx')
    )
    messageStore.success('活动导出已开始')
  } catch (error: any) {
    console.error('导出活动失败:', error)
    messageStore.error(error.message || '导出活动失败，请稍后重试')
  } finally {
    exporting.value = false
  }
}

const requireSelectedActivityId = () => {
  if (!selectedActivity.value?.id) {
    messageStore.error('请先选择活动')
    return null
  }
  return selectedActivity.value.id
}

const updateActivityLocalState = (patch: Partial<OrganizationManagementActivityItem>) => {
  const targetId = selectedActivity.value?.id
  if (!targetId) return
  activities.value = activities.value.map((activity) => (
    activity.id === targetId ? { ...activity, ...patch, date: patch.startTime ? patch.startTime.slice(0, 10) : activity.date } : activity
  ))
  const updated = activities.value.find((activity) => activity.id === targetId)
  if (updated) {
    selectActivity(updated)
  }
}

const saveActivity = async () => {
  const activityId = requireSelectedActivityId()
  if (!activityId) return
  updating.value = true
  try {
    const response = await activitiesApi.update(activityId, {
      title: editForm.value.title?.trim(),
      description: editForm.value.description?.trim(),
      location: editForm.value.location?.trim(),
      address: editForm.value.address?.trim() || undefined,
      startTime: editForm.value.startTime,
      endTime: editForm.value.endTime,
      duration: editForm.value.duration,
      maxPeople: editForm.value.maxPeople
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '更新活动失败')
    }
    updateActivityLocalState({
      title: editForm.value.title?.trim() || '',
      description: editForm.value.description?.trim() || '',
      location: editForm.value.location?.trim() || '',
      address: editForm.value.address?.trim() || '',
      startTime: editForm.value.startTime || '',
      endTime: editForm.value.endTime || '',
      duration: editForm.value.duration || 0,
      maxPeople: editForm.value.maxPeople || 0
    })
    messageStore.success(response.data.message || '活动信息已更新')
  } catch (error: any) {
    console.error('更新活动失败:', error)
    messageStore.error(error.message || '更新活动失败，请稍后重试')
  } finally {
    updating.value = false
  }
}

const finishActivity = async () => {
  const activityId = requireSelectedActivityId()
  if (!activityId) return
  finishing.value = true
  try {
    const response = await activitiesApi.finishByOrganization(activityId)
    if (response.code !== 200) {
      throw new Error(response.msg || '完结活动失败')
    }
    updateActivityLocalState({ status: '已结束', statusClass: 'bg-gray-100 text-gray-800' })
    messageStore.success(response.data.message || '活动已标记为完结')
  } catch (error: any) {
    console.error('完结活动失败:', error)
    messageStore.error(error.message || '完结活动失败，请稍后重试')
  } finally {
    finishing.value = false
  }
}

const cancelActivity = async () => {
  const activityId = requireSelectedActivityId()
  if (!activityId) return
  if (!cancelReason.value.trim()) {
    messageStore.error('请输入取消原因')
    return
  }
  cancelling.value = true
  try {
    const response = await activitiesApi.cancelByOrganization(activityId, { reason: cancelReason.value.trim() })
    if (response.code !== 200) {
      throw new Error(response.msg || '取消活动失败')
    }
    updateActivityLocalState({ status: '已取消', statusClass: 'bg-red-100 text-red-700' })
    messageStore.success(response.data.message || '活动已取消')
  } catch (error: any) {
    console.error('取消活动失败:', error)
    messageStore.error(error.message || '取消活动失败，请稍后重试')
  } finally {
    cancelling.value = false
  }
}

const deleteActivity = async () => {
  const activityId = requireSelectedActivityId()
  if (!activityId) return
  deleting.value = true
  try {
    const response = await activitiesApi.remove(activityId)
    if (response.code !== 200) {
      throw new Error(response.msg || '删除活动失败')
    }
    activities.value = activities.value.filter((activity) => activity.id !== activityId)
    selectedActivityId.value = activities.value[0]?.id ?? null
    if (activities.value[0]) {
      selectActivity(activities.value[0])
    }
    messageStore.success(response.data.message || '活动已删除')
  } catch (error: any) {
    console.error('删除活动失败:', error)
    messageStore.error(error.message || '删除活动失败，请稍后重试')
  } finally {
    deleting.value = false
  }
}

const loadAttendanceCodes = async () => {
  const activityId = requireSelectedActivityId()
  if (!activityId) return
  attendanceLoading.value = true
  try {
    const response = await activitiesApi.getAttendanceCodes(activityId)
    if (response.code !== 200) {
      throw new Error(response.msg || '获取签到码失败')
    }
    attendanceCodeInfo.value = {
      checkInCode: response.data.checkInCode || '',
      checkOutCode: response.data.checkOutCode || '',
      attendanceCodeVersion: response.data.attendanceCodeVersion || 0
    }
  } catch (error: any) {
    console.error('获取签到码失败:', error)
    messageStore.error(error.message || '获取签到码失败，请稍后重试')
  } finally {
    attendanceLoading.value = false
  }
}

const generateAttendanceCodes = async () => {
  const activityId = requireSelectedActivityId()
  if (!activityId) return
  attendanceLoading.value = true
  try {
    const response = await activitiesApi.generateAttendanceCodes(activityId, attendanceForm.value)
    if (response.code !== 200) {
      throw new Error(response.msg || '生成签到码失败')
    }
    attendanceCodeInfo.value = {
      checkInCode: response.data.checkInCode || '',
      checkOutCode: response.data.checkOutCode || '',
      attendanceCodeVersion: response.data.attendanceCodeVersion || 0
    }
    messageStore.success('签到码已生成')
  } catch (error: any) {
    console.error('生成签到码失败:', error)
    messageStore.error(error.message || '生成签到码失败，请稍后重试')
  } finally {
    attendanceLoading.value = false
  }
}

const resetAttendanceCode = async (codeType: AttendanceCodeType) => {
  const activityId = requireSelectedActivityId()
  if (!activityId) return
  attendanceLoading.value = true
  try {
    const validMinutes = codeType === ATTENDANCE_CODE_TYPE.CHECK_IN
      ? attendanceForm.value.checkInValidMinutes
      : attendanceForm.value.checkOutValidMinutes
    const response = await activitiesApi.resetAttendanceCode(activityId, { codeType, validMinutes })
    if (response.code !== 200) {
      throw new Error(response.msg || '重置签到码失败')
    }
    attendanceCodeInfo.value = {
      ...attendanceCodeInfo.value,
      checkInCode: codeType === ATTENDANCE_CODE_TYPE.CHECK_IN ? response.data.code : attendanceCodeInfo.value.checkInCode,
      checkOutCode: codeType === ATTENDANCE_CODE_TYPE.CHECK_OUT ? response.data.code : attendanceCodeInfo.value.checkOutCode,
      attendanceCodeVersion: response.data.attendanceCodeVersion
    }
    messageStore.success(codeType === ATTENDANCE_CODE_TYPE.CHECK_IN ? '签到码已重置' : '签退码已重置')
  } catch (error: any) {
    console.error('重置签到码失败:', error)
    messageStore.error(error.message || '重置签到码失败，请稍后重试')
  } finally {
    attendanceLoading.value = false
  }
}

const submitSupplementAttendance = async () => {
  const activityId = requireSelectedActivityId()
  if (!activityId) return
  if (!supplementForm.value.volunteerId || !supplementForm.value.checkInTime || !supplementForm.value.checkOutTime || !supplementForm.value.reason.trim()) {
    messageStore.error('请完整填写补录考勤信息')
    return
  }
  supplementing.value = true
  try {
    const response = await activitiesApi.supplementAttendance({
      activityId,
      volunteerId: supplementForm.value.volunteerId,
      checkInTime: supplementForm.value.checkInTime,
      checkOutTime: supplementForm.value.checkOutTime,
      reason: supplementForm.value.reason.trim()
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '补录考勤失败')
    }
    messageStore.success('补录考勤已提交')
  } catch (error: any) {
    console.error('补录考勤失败:', error)
    messageStore.error(error.message || '补录考勤失败，请稍后重试')
  } finally {
    supplementing.value = false
  }
}

watch([search, filter], () => {
  void loadActivities()
})

onMounted(() => {
  void loadActivities()
})
</script>
