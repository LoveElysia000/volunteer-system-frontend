<template>
  <DataListPage>
    <template #header>
      <OrganizationPageHeader
        eyebrow="活动"
        title="活动管理"
        description="统一管理活动状态、执行安排和关键操作。"
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
            rounded
            :loading="importing"
            @click="triggerImport"
          >
            导入活动
          </Button>
          <Button
            variant="outline"
            rounded
            :loading="exporting"
            @click="exportActivities"
          >
            导出活动
          </Button>
          <RouterLink
            to="/organization/activities/create"
            class="org-toolbar-button org-toolbar-button--soft"
          >
            <PlusIcon class="h-4 w-4" />
            新建活动
          </RouterLink>
        </template>
      </OrganizationPageHeader>
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="grid gap-3 lg:grid-cols-[minmax(220px,320px)_180px_180px_180px_160px]">
            <Input
              v-model="search"
              placeholder="搜索活动标题或地点"
              allow-clear
            />
            <FilterSelect
              v-model="filter"
              title="状态筛选"
              :icon="SlidersHorizontalIcon"
              :options="filterOptions"
            />
            <DatePicker
              v-model="startFrom"
              placeholder="开始日期"
              mode="date"
            />
            <DatePicker
              v-model="endTo"
              placeholder="结束日期"
              mode="date"
            />
            <FilterSelect
              v-model="pageSize"
              title="每页条数"
              :icon="SlidersHorizontalIcon"
              :options="pageSizeOptions"
            />
          </div>
        </template>

        <template #summary>
          <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>第 {{ page }} / {{ totalPages }} 页</span>
            <span>当前 {{ activities.length }} 条</span>
          </div>
        </template>

        <template #actions>
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
        </template>
      </DataToolbar>
    </template>

    <template #body>
      <OrganizationSectionCard
        title="活动列表"
        description="按关键字和状态筛选活动，点击一行查看详情与执行操作。"
      >
        <DataTable
          :columns="columns"
          :items="activities"
          :loading="loading"
          row-key="id"
          :selected-key="selectedActivityId"
          interactive
          open-text="查看"
          open-style="text"
          density="compact"
          empty-title="当前没有可展示的活动"
          empty-description="调整筛选条件后再试，或新建活动。"
          @row-click="openActivityDrawer"
        >
          <template #cell-identity="{ item }">
            <div class="min-w-0 space-y-1">
              <p class="truncate text-sm font-semibold text-slate-900">
                {{ item.title }}
              </p>
              <p class="truncate text-xs text-slate-500">
                {{ item.description }}
              </p>
            </div>
          </template>

          <template #cell-status="{ item }">
            <StatusBadge
              :label="item.status"
              :tone="statusTone(item.statusClass)"
            />
          </template>

          <template #cell-schedule="{ item }">
            <div class="space-y-1 text-sm text-slate-600">
              <p>{{ item.date }}</p>
              <p class="text-xs text-slate-500">
                {{ item.duration }} 小时
              </p>
            </div>
          </template>

          <template #cell-location="{ item }">
            {{ item.location }}
          </template>

          <template #cell-capacity="{ item }">
            {{ item.participants }}/{{ item.maxPeople }}
          </template>
        </DataTable>
      </OrganizationSectionCard>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="760px"
        :aria-label="selectedActivity ? `${selectedActivity.title} 的活动详情与执行` : '活动详情与执行'"
        @close="closeActivityDrawer"
      >
        <template #header>
          <div
            v-if="selectedActivity"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                活动详情与执行
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                #{{ selectedActivity.id }} · {{ selectedActivity.title }}
              </h2>
              <p class="text-sm text-slate-500">
                {{ selectedActivity.location }} · {{ selectedActivity.date }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <StatusBadge
                :label="selectedActivity.status"
                :tone="statusTone(selectedActivity.statusClass)"
              />
              <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {{ selectedActivity.participants }}/{{ selectedActivity.maxPeople }} 人
              </span>
            </div>
          </div>
        </template>

        <div
          v-if="selectedActivity"
          class="space-y-6"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  活动日期
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
                  时长
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedActivity.duration }} 小时
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  当前人数
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedActivity.participants }}/{{ selectedActivity.maxPeople }}
                </p>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-900">
                  活动信息编辑
                </p>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="mb-1 block text-sm font-medium text-slate-600">活动标题</label>
                <Input
                  v-model="editForm.title"
                  placeholder="请输入活动标题"
                />
              </div>
              <div class="md:col-span-2">
                <label class="mb-1 block text-sm font-medium text-slate-600">活动描述</label>
                <Textarea
                  v-model="editForm.description"
                  :min-rows="3"
                  :max-rows="6"
                  allow-clear
                  show-word-limit
                  :max-length="500"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">活动地点</label>
                <Input
                  v-model="editForm.location"
                  placeholder="请输入活动地点"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">详细地址</label>
                <Input
                  v-model="editForm.address"
                  placeholder="请输入详细地址"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">开始时间</label>
                <DatePicker
                  v-model="editStartTime"
                  placeholder="请选择开始时间"
                  mode="datetime"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">结束时间</label>
                <DatePicker
                  v-model="editEndTime"
                  placeholder="请选择结束时间"
                  mode="datetime"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">活动时长（小时）</label>
                <Input
                  v-model="editDurationInput"
                  type="number"
                  placeholder="请输入活动时长"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">人数上限</label>
                <Input
                  v-model="editMaxPeopleInput"
                  type="number"
                  placeholder="请输入人数上限"
                />
              </div>
            </div>
          </section>

          <div class="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <section class="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-slate-900">
                    签到码管理
                  </p>
                  <p class="text-xs text-slate-500">
                    控制签到码有效期并查看当前版本。
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  :loading="attendanceLoading"
                  @click="loadAttendanceCodes"
                >
                  刷新
                </Button>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <label class="text-sm font-medium text-slate-600">
                  签到码有效期（分钟）
                  <Input
                    v-model="checkInValidMinutesInput"
                    class="mt-2"
                    type="number"
                  />
                </label>
                <label class="text-sm font-medium text-slate-600">
                  签退码有效期（分钟）
                  <Input
                    v-model="checkOutValidMinutesInput"
                    class="mt-2"
                    type="number"
                  />
                </label>
              </div>

              <div class="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  :loading="attendanceLoading"
                  @click="generateAttendanceCodes"
                >
                  生成签到码
                </Button>
                <Button
                  variant="outline"
                  :loading="attendanceLoading"
                  @click="resetAttendanceCode(AttendanceCodeType.CHECK_IN)"
                >
                  重置签到码
                </Button>
                <Button
                  variant="outline"
                  :loading="attendanceLoading"
                  @click="resetAttendanceCode(AttendanceCodeType.CHECK_OUT)"
                >
                  重置签退码
                </Button>
              </div>

              <div class="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 space-y-2">
                <p>签到码：<span class="font-semibold text-slate-900">{{ attendanceCodeInfo.checkInCode || '未生成' }}</span></p>
                <p>签退码：<span class="font-semibold text-slate-900">{{ attendanceCodeInfo.checkOutCode || '未生成' }}</span></p>
                <p>版本号：<span class="font-semibold text-slate-900">{{ attendanceCodeInfo.attendanceCodeVersion || '-' }}</span></p>
                <p>更新时间：<span class="font-semibold text-slate-900">{{ attendanceCodeInfo.attendanceCodeUpdatedAt || '-' }}</span></p>
                <p>签到过期：<span class="font-semibold text-slate-900">{{ attendanceCodeInfo.checkInExpireAt || '-' }}</span></p>
                <p>签退过期：<span class="font-semibold text-slate-900">{{ attendanceCodeInfo.checkOutExpireAt || '-' }}</span></p>
              </div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <div>
                <p class="text-sm font-semibold text-slate-900">
                  补录考勤
                </p>
                <p class="text-xs text-slate-500">
                  在抽屉中补齐单个志愿者的签到签退记录。
                </p>
              </div>

              <label class="text-sm font-medium text-slate-600">
                志愿者 ID
                <Input
                  v-model="supplementVolunteerIdInput"
                  class="mt-2"
                  type="number"
                  placeholder="请输入志愿者 ID"
                />
              </label>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">签到时间</label>
                <DatePicker
                  v-model="supplementCheckInTime"
                  placeholder="请选择签到时间"
                  mode="datetime"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">签退时间</label>
                <DatePicker
                  v-model="supplementCheckOutTime"
                  placeholder="请选择签退时间"
                  mode="datetime"
                />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">补录原因</label>
                <Textarea
                  v-model="supplementForm.reason"
                  placeholder="请输入补录原因"
                  :min-rows="2"
                  :max-rows="5"
                  allow-clear
                  show-word-limit
                  :max-length="200"
                />
              </div>
              <div class="flex justify-end">
                <Button
                  variant="primary"
                  :loading="supplementing"
                  @click="submitSupplementAttendance"
                >
                  提交补录
                </Button>
              </div>
            </section>
          </div>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <p class="text-sm font-semibold text-slate-900">
                状态变更与风险操作
              </p>
              <p class="text-xs text-slate-500">
                保存编辑、完结、取消和删除均会直接影响当前活动。
              </p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-600">取消原因</label>
                <Textarea
                  v-model="cancelReason"
                  placeholder="请输入取消活动的原因"
                  :min-rows="2"
                  :max-rows="5"
                  allow-clear
                  show-word-limit
                  :max-length="120"
                />
              </div>
            </div>
          </section>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击活动行打开右侧执行面板。
        </div>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button
              v-if="selectedActivity"
              variant="primary"
              :loading="updating"
              @click="saveActivity"
            >
              保存活动信息
            </Button>
            <Button
              v-if="selectedActivity"
              variant="outline"
              :loading="finishing"
              @click="finishActivity"
            >
              标记已完结
            </Button>
            <Button
              v-if="selectedActivity"
              variant="outline"
              :loading="cancelling"
              @click="cancelActivity"
            >
              取消活动
            </Button>
            <Button
              v-if="selectedActivity"
              variant="danger"
              :loading="deleting"
              @click="deleteActivity"
            >
              删除活动
            </Button>
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
import DatePicker from '@/components/ui/DatePicker.vue'
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
import { PlusIcon, SlidersHorizontalIcon } from 'lucide-vue-next'

const messageStore = useMessageStore()

const importInputRef = ref<HTMLInputElement | null>(null)
const search = ref('')
const startFrom = ref('')
const endTo = ref('')
const page = ref(1)
const pageSize = ref(20)
const filter = ref<'all' | 'open' | 'ended' | 'cancelled'>('all')
const pageSizeOptions = [
  { value: 10, label: '10 条', description: '适合逐条查看活动' },
  { value: 20, label: '20 条', description: '默认查看密度' },
  { value: 50, label: '50 条', description: '适合批量浏览活动' }
] as const
const filterOptions = [
  { value: 'all', label: '全部状态', description: '查看所有活动' },
  { value: 'open', label: '进行中', description: '仅显示正在开放或执行中的活动' },
  { value: 'ended', label: '已结束', description: '查看已经完结的活动' },
  { value: 'cancelled', label: '已取消', description: '查看被取消的活动' }
] as const
const loading = ref(false)
const importing = ref(false)
const exporting = ref(false)
const updating = ref(false)
const finishing = ref(false)
const deleting = ref(false)
const cancelling = ref(false)
const attendanceLoading = ref(false)
const supplementing = ref(false)
const drawerOpen = ref(false)

const columns: DataTableColumn[] = [
  {
    key: 'identity',
    label: '活动',
    width: '360px',
    cellClass: 'align-top'
  },
  {
    key: 'status',
    label: '状态',
    width: '120px',
    align: 'center',
    cellClass: 'whitespace-nowrap'
  },
  {
    key: 'schedule',
    label: '排期',
    width: '150px'
  },
  {
    key: 'location',
    label: '地点',
    width: '180px'
  },
  {
    key: 'capacity',
    label: '人数',
    width: '110px',
    align: 'center'
  }
]

const activities = ref<OrganizationManagementActivityItem[]>([])
const total = ref(0)
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
  attendanceCodeVersion: 0,
  attendanceCodeUpdatedAt: '',
  checkInExpireAt: '',
  checkOutExpireAt: ''
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
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const currentFilterOption = computed(() => (
  filterOptions.find((option) => option.value === filter.value) ?? filterOptions[0]
))

const headerMeta = computed(() => [
  { label: '活动总数', value: `${total.value}`, detail: '来自活动列表接口' },
  { label: '当前筛选', value: currentFilterOption.value.label, detail: '可按状态切换' },
  { label: '分页进度', value: `${page.value}/${totalPages.value}`, detail: `每页 ${pageSize.value} 条` }
])

const statusTone = (statusClass: string) => {
  if (statusClass.includes('red')) return 'rose'
  if (statusClass.includes('amber') || statusClass.includes('yellow')) return 'amber'
  if (statusClass.includes('green') || statusClass.includes('emerald')) return 'green'
  return 'slate'
}

const stripSeconds = (value?: string) => {
  if (!value) return null
  const match = value.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/)
  return match?.[1] || value.slice(0, 16) || null
}

const withZeroSeconds = (value: string | null) => {
  if (!value) return ''
  return `${value}:00`
}

const editStartTime = computed<string | null>({
  get: () => stripSeconds(editForm.value.startTime),
  set: (value) => {
    editForm.value.startTime = withZeroSeconds(value)
  }
})

const editEndTime = computed<string | null>({
  get: () => stripSeconds(editForm.value.endTime),
  set: (value) => {
    editForm.value.endTime = withZeroSeconds(value)
  }
})

const supplementCheckInTime = computed<string | null>({
  get: () => stripSeconds(supplementForm.value.checkInTime),
  set: (value) => {
    supplementForm.value.checkInTime = withZeroSeconds(value)
  }
})

const supplementCheckOutTime = computed<string | null>({
  get: () => stripSeconds(supplementForm.value.checkOutTime),
  set: (value) => {
    supplementForm.value.checkOutTime = withZeroSeconds(value)
  }
})

const editDurationInput = computed({
  get: () => String(editForm.value.duration ?? ''),
  set: (value: string | number) => {
    const next = Number(value)
    editForm.value.duration = Number.isFinite(next) ? next : 0
  }
})

const editMaxPeopleInput = computed({
  get: () => String(editForm.value.maxPeople ?? ''),
  set: (value: string | number) => {
    const next = Number(value)
    editForm.value.maxPeople = Number.isFinite(next) ? next : 0
  }
})

const checkInValidMinutesInput = computed({
  get: () => String(attendanceForm.value.checkInValidMinutes ?? ''),
  set: (value: string | number) => {
    const next = Number(value)
    attendanceForm.value.checkInValidMinutes = Number.isFinite(next) ? next : 0
  }
})

const checkOutValidMinutesInput = computed({
  get: () => String(attendanceForm.value.checkOutValidMinutes ?? ''),
  set: (value: string | number) => {
    const next = Number(value)
    attendanceForm.value.checkOutValidMinutes = Number.isFinite(next) ? next : 0
  }
})

const supplementVolunteerIdInput = computed({
  get: () => supplementForm.value.volunteerId ? String(supplementForm.value.volunteerId) : '',
  set: (value: string | number) => {
    const next = Number(value)
    supplementForm.value.volunteerId = Number.isFinite(next) ? next : 0
  }
})

const selectedStatuses = computed<ActivityStatus[]>(() => {
  if (filter.value === 'open') return [ActivityStatus.OPEN]
  if (filter.value === 'ended') return [ActivityStatus.ENDED]
  if (filter.value === 'cancelled') return [ActivityStatus.CANCELLED]
  return [ActivityStatus.OPEN, ActivityStatus.ENDED, ActivityStatus.CANCELLED]
})

const selectedStatusForExport = computed<ActivityStatus | undefined>(() => {
  if (filter.value === 'open') return ActivityStatus.OPEN
  if (filter.value === 'ended') return ActivityStatus.ENDED
  if (filter.value === 'cancelled') return ActivityStatus.CANCELLED
  return undefined
})

const hydrateEditForm = (activity: OrganizationManagementActivityItem) => {
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

const resetSupplementForm = () => {
  supplementForm.value = {
    volunteerId: 0,
    checkInTime: '',
    checkOutTime: '',
    reason: ''
  }
}

const selectActivity = (activity: OrganizationManagementActivityItem) => {
  selectedActivityId.value = activity.id
  hydrateEditForm(activity)
}

const openActivityDrawer = async (activity: Record<string, any>) => {
  selectActivity(activity as OrganizationManagementActivityItem)
  drawerOpen.value = true
  await loadAttendanceCodes()
}

const closeActivityDrawer = () => {
  drawerOpen.value = false
}

const loadActivities = async () => {
  loading.value = true
  try {
    const response = await activitiesApi.list({
      page: page.value,
      pageSize: pageSize.value,
      status: selectedStatuses.value,
      keyword: search.value || undefined,
      startFrom: startFrom.value || undefined,
      startTo: endTo.value || undefined,
      sortBy: 'start_time',
      sortOrder: 'asc'
    })

    if (response.code !== 200) {
      throw new Error(response.msg || '获取活动列表失败')
    }

    activities.value = (response.data.list || []).map(mapActivityItemToOrganizationManagementView)
    total.value = response.data.total || 0
    if (!selectedActivityId.value && activities.value.length) {
      selectActivity(activities.value[0])
    } else if (selectedActivityId.value) {
      const current = activities.value.find((item) => item.id === selectedActivityId.value)
      if (current) {
        selectActivity(current)
      } else {
        selectedActivityId.value = null
        drawerOpen.value = false
      }
    }
  } catch (error: any) {
    console.error('加载活动列表失败:', error)
    messageStore.error(error.message || '加载活动列表失败，请稍后重试')
    activities.value = []
    total.value = 0
    selectedActivityId.value = null
    drawerOpen.value = false
  } finally {
    loading.value = false
  }
}

const goToPreviousPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await loadActivities()
}

const goToNextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await loadActivities()
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
      status: selectedStatusForExport.value,
      startFrom: startFrom.value || undefined,
      startTo: endTo.value || undefined
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

const saveActivity = async () => {
  const activityId = requireSelectedActivityId()
  if (!activityId) return
  if (!editForm.value.title?.trim() || !editForm.value.description?.trim() || !editForm.value.location?.trim()) {
    messageStore.error('请先填写完整的活动基础信息')
    return
  }
  if (new Date(editForm.value.endTime).getTime() <= new Date(editForm.value.startTime).getTime()) {
    messageStore.error('结束时间必须晚于开始时间')
    return
  }
  if (editForm.value.duration <= 0 || editForm.value.maxPeople <= 0) {
    messageStore.error('活动时长和人数上限都必须大于 0')
    return
  }
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
    messageStore.success(response.data.message || '活动信息已更新')
    await loadActivities()
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
    messageStore.success(response.data.message || '活动已标记为完结')
    await loadActivities()
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
    messageStore.success(response.data.message || '活动已取消')
    await loadActivities()
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
    messageStore.success(response.data.message || '活动已删除')
    await loadActivities()
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
      attendanceCodeVersion: response.data.attendanceCodeVersion || 0,
      attendanceCodeUpdatedAt: response.data.attendanceCodeUpdatedAt || '',
      checkInExpireAt: response.data.checkInExpireAt || '',
      checkOutExpireAt: response.data.checkOutExpireAt || ''
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
      attendanceCodeVersion: response.data.attendanceCodeVersion || 0,
      attendanceCodeUpdatedAt: response.data.attendanceCodeUpdatedAt || '',
      checkInExpireAt: response.data.checkInExpireAt || '',
      checkOutExpireAt: response.data.checkOutExpireAt || ''
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
      attendanceCodeVersion: response.data.attendanceCodeVersion,
      attendanceCodeUpdatedAt: response.data.attendanceCodeUpdatedAt || '',
      checkInExpireAt: codeType === ATTENDANCE_CODE_TYPE.CHECK_IN ? response.data.expireAt || '' : attendanceCodeInfo.value.checkInExpireAt,
      checkOutExpireAt: codeType === ATTENDANCE_CODE_TYPE.CHECK_OUT ? response.data.expireAt || '' : attendanceCodeInfo.value.checkOutExpireAt
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
  if (new Date(supplementForm.value.checkOutTime).getTime() <= new Date(supplementForm.value.checkInTime).getTime()) {
    messageStore.error('签退时间必须晚于签到时间')
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
    resetSupplementForm()
  } catch (error: any) {
    console.error('补录考勤失败:', error)
    messageStore.error(error.message || '补录考勤失败，请稍后重试')
  } finally {
    supplementing.value = false
  }
}

watch([search, filter, startFrom, endTo], () => {
  page.value = 1
  void loadActivities()
})

watch(pageSize, () => {
  page.value = 1
  void loadActivities()
})

onMounted(() => {
  void loadActivities()
})
</script>
