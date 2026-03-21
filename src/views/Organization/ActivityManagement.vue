<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        活动管理
      </h1>
      <router-link
        to="/organization/activities/create"
        class="btn btn-primary"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        创建活动
      </router-link>
    </div>

    <!-- 活动列表 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            活动列表
          </h2>
          <div class="flex space-x-2">
            <input
              v-model="search"
              type="text"
              class="input input-sm"
              placeholder="搜索活动..."
            >
            <select
              v-model="filter"
              class="select select-sm"
            >
              <option value="all">
                全部状态
              </option>
              <option value="进行中">
                进行中
              </option>
              <option value="已结束">
                已结束
              </option>
              <option value="待审核">
                待审核
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="divide-y divide-gray-200">
        <!-- 活动项 -->
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="p-6 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarIcon class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">
                  {{ activity.title }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ activity.date }} | {{ activity.location }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="`px-2 py-1 rounded-full text-xs font-medium ${activity.statusClass}`">
                {{ activity.status }}
              </span>
              <button
                class="btn btn-sm btn-outline"
                @click="selectActivity(activity)"
              >
                编辑
              </button>
              <button
                class="btn btn-sm btn-outline"
                @click="inspectActivity(activity)"
              >
                执行操作
              </button>
            </div>
          </div>
          <div class="mt-3 flex items-center text-sm text-gray-500">
            <UsersIcon class="h-4 w-4 mr-1" />
            <span class="mr-4">{{ activity.participants }} 人报名</span>
            <ClockIcon class="h-4 w-4 mr-1" />
            <span>{{ activity.duration }} 小时</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            活动执行操作台
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            列表用于展示，真实联调操作请填写下方真实活动 ID 后再执行。
          </p>
        </div>
        <span class="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
          当前真实活动 ID: {{ targetActivityId || '-' }}
        </span>
      </div>

      <div
        v-if="selectedActivity"
        class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <div class="space-y-6">
          <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">真实活动 ID</label>
            <input
              v-model.number="targetActivityId"
              type="number"
              min="1"
              class="input bg-white"
              placeholder="请输入后端真实活动 ID"
            >
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">活动标题</label>
              <input
                v-model="editForm.title"
                type="text"
                class="input"
                placeholder="请输入活动标题"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
              <textarea
                v-model="editForm.description"
                rows="4"
                class="textarea"
                placeholder="请输入活动描述"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">活动地点</label>
              <input
                v-model="editForm.location"
                type="text"
                class="input"
                placeholder="请输入活动地点"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
              <input
                v-model="editForm.address"
                type="text"
                class="input"
                placeholder="请输入详细地址"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
              <input
                v-model="editForm.startTime"
                type="datetime-local"
                class="input"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
              <input
                v-model="editForm.endTime"
                type="datetime-local"
                class="input"
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

          <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">取消原因</label>
              <textarea
                v-model="cancelReason"
                rows="3"
                class="textarea bg-white"
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
          <div class="rounded-xl border border-gray-200 p-4 space-y-4">
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
                @click="resetAttendanceCode('checkin')"
              >
                重置签到码
              </button>
              <button
                class="btn btn-outline"
                :disabled="attendanceLoading"
                @click="resetAttendanceCode('checkout')"
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

          <div class="rounded-xl border border-gray-200 p-4 space-y-4">
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
                v-model="supplementForm.checkInTime"
                type="datetime-local"
                class="input"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">签退时间</label>
              <input
                v-model="supplementForm.checkOutTime"
                type="datetime-local"
                class="input"
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
        请先从上方活动列表选择一个活动，再进行联调操作。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageStateStore } from '@/store/modules/pageState'
import { useMessageStore } from '@/store/modules/messages'
import { activitiesApi } from '@/api/activities'
import { CalendarIcon, UsersIcon, ClockIcon, PlusIcon } from 'lucide-vue-next'

// 路由和状态管理
const route = useRoute()
const router = useRouter()
const pageStateStore = usePageStateStore()
const messageStore = useMessageStore()

// 使用store中的状态
const filter = ref(pageStateStore.state.organizationActivities.filter)
const search = ref(pageStateStore.state.organizationActivities.search)

const activities = ref([
  {
    id: 1,
    title: '城市公园清洁活动',
    description: '针对公共区域开展垃圾清理与环保宣传。',
    date: '2026-01-20',
    startTime: '2026-01-20T09:00',
    endTime: '2026-01-20T12:00',
    location: '中央公园',
    address: '中央公园东门集合',
    status: '进行中',
    statusClass: 'bg-green-100 text-green-800',
    participants: 25,
    duration: 3
  },
  {
    id: 2,
    title: '环保知识讲座',
    description: '面向社区居民开展垃圾分类与低碳生活分享。',
    date: '2026-01-25',
    startTime: '2026-01-25T14:00',
    endTime: '2026-01-25T16:00',
    location: '社区中心',
    address: '社区中心三楼多功能厅',
    status: '待审核',
    statusClass: 'bg-yellow-100 text-yellow-800',
    participants: 15,
    duration: 2
  },
  {
    id: 3,
    title: '河流清理志愿者活动',
    description: '组织志愿者完成河岸垃圾清运与巡查记录。',
    date: '2026-01-15',
    startTime: '2026-01-15T08:00',
    endTime: '2026-01-15T12:00',
    location: '城市河岸',
    address: '河岸步道服务站',
    status: '已结束',
    statusClass: 'bg-gray-100 text-gray-800',
    participants: 32,
    duration: 4
  }
])
const selectedActivityId = ref<number | null>(activities.value[0]?.id ?? null)
const updating = ref(false)
const finishing = ref(false)
const deleting = ref(false)
const cancelling = ref(false)
const attendanceLoading = ref(false)
const supplementing = ref(false)
const targetActivityId = ref<number | null>(null)
const cancelReason = ref('')
const editForm = ref({
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
const supplementForm = ref({
  volunteerId: undefined as number | undefined,
  checkInTime: '',
  checkOutTime: '',
  reason: ''
})

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  // 从路由参数恢复状态
  if (newQuery.filter) {
    filter.value = newQuery.filter as string
    pageStateStore.updateOrganizationActivitiesState({ filter: newQuery.filter as string })
  }
  if (newQuery.search) {
    search.value = newQuery.search as string
    pageStateStore.updateOrganizationActivitiesState({ search: newQuery.search as string })
  }
  // 重新加载数据
  loadActivities()
}, { immediate: true })

// 监听状态变化，同步到路由和store
watch([filter, search], ([newFilter, newSearch]) => {
  const query: any = {}
  if (newFilter && newFilter !== 'all') query.filter = newFilter
  if (newSearch) query.search = newSearch

  // 更新路由参数
  router.replace({ query })

  // 更新store状态
  pageStateStore.updateOrganizationActivitiesState({
    filter: newFilter,
    search: newSearch
  })
})

// 数据加载函数
const loadActivities = async () => {
  console.log('加载组织活动数据:', {
    filter: filter.value,
    search: search.value
  })
  // 这里可以调用API进行数据加载
  // 目前使用模拟数据
}

// 组件激活时恢复状态
onActivated(() => {
  console.log('组织活动管理页面激活，恢复状态')
  loadActivities()
})

// 过滤活动列表
const filteredActivities = computed(() => {
  let filtered = activities.value

  // 按状态过滤
  if (filter.value !== 'all') {
    filtered = filtered.filter(activity => activity.status === filter.value)
  }

  // 按搜索查询过滤
  if (search.value) {
    const query = search.value.toLowerCase()
    filtered = filtered.filter(activity =>
      activity.title.toLowerCase().includes(query) ||
      activity.location.toLowerCase().includes(query)
    )
  }

  return filtered
})

const selectedActivity = computed(() => (
  activities.value.find(activity => activity.id === selectedActivityId.value) || null
))

const selectActivity = (activity: typeof activities.value[number]) => {
  selectedActivityId.value = activity.id
  editForm.value = {
    title: activity.title,
    description: activity.description,
    location: activity.location,
    address: activity.address,
    startTime: activity.startTime,
    endTime: activity.endTime,
    duration: activity.duration,
    maxPeople: Math.max(activity.participants + 10, 30)
  }
}

const inspectActivity = async (activity: typeof activities.value[number]) => {
  selectActivity(activity)
}

const toApiDateTime = (value: string) => {
  if (!value) {
    return ''
  }
  return new Date(value).toISOString().slice(0, 19).replace('T', ' ')
}

const updateActivityLocalState = (patch: Partial<typeof activities.value[number]>) => {
  if (!selectedActivity.value) {
    return
  }
  activities.value = activities.value.map(activity => (
    activity.id === selectedActivity.value?.id
      ? { ...activity, ...patch, date: patch.startTime ? patch.startTime.slice(0, 10) : activity.date }
      : activity
  ))
}

const requireTargetActivityId = () => {
  if (!targetActivityId.value) {
    messageStore.error('请输入真实活动 ID 后再执行联调操作')
    return null
  }
  return targetActivityId.value
}

const saveActivity = async () => {
  if (!selectedActivity.value) return
  const activityId = requireTargetActivityId()
  if (!activityId) return
  updating.value = true
  try {
    const response = await activitiesApi.update(activityId, {
      title: editForm.value.title.trim(),
      description: editForm.value.description.trim(),
      location: editForm.value.location.trim(),
      address: editForm.value.address.trim() || undefined,
      startTime: toApiDateTime(editForm.value.startTime),
      endTime: toApiDateTime(editForm.value.endTime),
      duration: Number(editForm.value.duration),
      maxPeople: Number(editForm.value.maxPeople)
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '更新活动失败')
    }
    updateActivityLocalState({
      title: editForm.value.title.trim(),
      description: editForm.value.description.trim(),
      location: editForm.value.location.trim(),
      address: editForm.value.address.trim(),
      startTime: editForm.value.startTime,
      endTime: editForm.value.endTime,
      duration: Number(editForm.value.duration)
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
  if (!selectedActivity.value) return
  const activityId = requireTargetActivityId()
  if (!activityId) return
  finishing.value = true
  try {
    const response = await activitiesApi.finishByOrganization(activityId)
    if (response.code !== 200) {
      throw new Error(response.msg || '完结活动失败')
    }
    updateActivityLocalState({
      status: '已结束',
      statusClass: 'bg-gray-100 text-gray-800'
    })
    messageStore.success(response.data.message || '活动已标记为完结')
  } catch (error: any) {
    console.error('完结活动失败:', error)
    messageStore.error(error.message || '完结活动失败，请稍后重试')
  } finally {
    finishing.value = false
  }
}

const cancelActivity = async () => {
  if (!selectedActivity.value) return
  const activityId = requireTargetActivityId()
  if (!activityId) return
  if (!cancelReason.value.trim()) {
    messageStore.error('请输入取消原因')
    return
  }
  cancelling.value = true
  try {
    const response = await activitiesApi.cancelByOrganization(activityId, {
      reason: cancelReason.value.trim()
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '取消活动失败')
    }
    updateActivityLocalState({
      status: '已取消',
      statusClass: 'bg-red-100 text-red-700'
    })
    messageStore.success(response.data.message || '活动已取消')
  } catch (error: any) {
    console.error('取消活动失败:', error)
    messageStore.error(error.message || '取消活动失败，请稍后重试')
  } finally {
    cancelling.value = false
  }
}

const deleteActivity = async () => {
  if (!selectedActivity.value) return
  const activityId = requireTargetActivityId()
  if (!activityId) return
  deleting.value = true
  try {
    const response = await activitiesApi.remove(activityId)
    if (response.code !== 200) {
      throw new Error(response.msg || '删除活动失败')
    }
    targetActivityId.value = null
    attendanceCodeInfo.value = {
      checkInCode: '',
      checkOutCode: '',
      attendanceCodeVersion: 0
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
  if (!selectedActivity.value) return
  const activityId = requireTargetActivityId()
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
  if (!selectedActivity.value) return
  const activityId = requireTargetActivityId()
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

const resetAttendanceCode = async (codeType: 'checkin' | 'checkout') => {
  if (!selectedActivity.value) return
  const activityId = requireTargetActivityId()
  if (!activityId) return
  attendanceLoading.value = true
  try {
    const validMinutes = codeType === 'checkin'
      ? attendanceForm.value.checkInValidMinutes
      : attendanceForm.value.checkOutValidMinutes
    const response = await activitiesApi.resetAttendanceCode(activityId, {
      codeType,
      validMinutes
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '重置签到码失败')
    }
    attendanceCodeInfo.value = {
      ...attendanceCodeInfo.value,
      checkInCode: codeType === 'checkin' ? (response.data.code || attendanceCodeInfo.value.checkInCode) : attendanceCodeInfo.value.checkInCode,
      checkOutCode: codeType === 'checkout' ? (response.data.code || attendanceCodeInfo.value.checkOutCode) : attendanceCodeInfo.value.checkOutCode,
      attendanceCodeVersion: response.data.attendanceCodeVersion || attendanceCodeInfo.value.attendanceCodeVersion
    }
    messageStore.success(codeType === 'checkin' ? '签到码已重置' : '签退码已重置')
  } catch (error: any) {
    console.error('重置签到码失败:', error)
    messageStore.error(error.message || '重置签到码失败，请稍后重试')
  } finally {
    attendanceLoading.value = false
  }
}

const submitSupplementAttendance = async () => {
  if (!selectedActivity.value) return
  const activityId = requireTargetActivityId()
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
      checkInTime: toApiDateTime(supplementForm.value.checkInTime),
      checkOutTime: toApiDateTime(supplementForm.value.checkOutTime),
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

// 组件挂载时加载数据
onMounted(() => {
  console.log('组织活动管理页面挂载')
  if (activities.value[0]) {
    selectActivity(activities.value[0])
  }
  loadActivities()
})
</script>
