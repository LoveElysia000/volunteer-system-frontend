<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="活动详情"
      :title="detailTitle"
      description="查看活动时间、地点、组织信息与当前报名状态。"
      :meta-items="headerMeta"
    >
      <template #actions>
        <RouterLink
          to="/volunteer/activities"
          class="volunteer-toolbar-button volunteer-toolbar-button--soft"
        >
          返回活动列表
        </RouterLink>
      </template>
    </VolunteerPageHeader>

    <VolunteerSectionCard
      title="活动信息"
      description="当前页展示后端真实返回的活动详情字段。"
    >
      <div
        v-if="loading"
        class="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500"
      >
        正在加载活动详情...
      </div>

      <div
        v-else-if="detail"
        class="space-y-5"
      >
        <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
          <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-3">
                <VolunteerStatusBadge
                  :label="statusText"
                  :tone="statusTone"
                />
                <span class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {{ detail.orgName || '所属组织待确认' }}
                </span>
              </div>
              <p class="text-sm leading-7 text-slate-600">
                {{ detail.description || '暂无活动描述' }}
              </p>
            </div>

            <div class="flex flex-wrap gap-3 xl:justify-end">
              <button
                v-if="!detail.isRegistered && detail.status === ActivityStatus.OPEN"
                class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="actionLoading"
                @click="handleSignup"
              >
                {{ actionLoading ? '处理中...' : '立即报名' }}
              </button>
              <button
                v-else-if="detail.isRegistered"
                class="volunteer-toolbar-button text-rose-600 hover:border-rose-200 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="actionLoading"
                @click="handleCancel"
              >
                {{ actionLoading ? '处理中...' : '取消报名' }}
              </button>
            </div>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-[1.35rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              开始时间
            </p>
            <p class="mt-2 text-sm font-semibold text-slate-800">
              {{ formatDateTime(detail.startTime) }}
            </p>
          </div>
          <div class="rounded-[1.35rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              结束时间
            </p>
            <p class="mt-2 text-sm font-semibold text-slate-800">
              {{ formatDateTime(detail.endTime) }}
            </p>
          </div>
          <div class="rounded-[1.35rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              活动地点
            </p>
            <p class="mt-2 text-sm font-semibold text-slate-800">
              {{ detail.location }}
            </p>
          </div>
          <div class="rounded-[1.35rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              名额情况
            </p>
            <p class="mt-2 text-sm font-semibold text-slate-800">
              {{ detail.currentPeople }}/{{ detail.maxPeople }}
            </p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-[1.35rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              地址
            </p>
            <p class="mt-2 text-sm leading-6 text-slate-700">
              {{ detail.address || '暂无详细地址' }}
            </p>
          </div>
          <div class="rounded-[1.35rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              服务记录
            </p>
            <div class="mt-2 space-y-1 text-sm text-slate-700">
              <p>签到状态：{{ ATTENDANCE_STATUS_LABELS[detail.checkInStatus ?? AttendanceStatus.NOT_CHECKED] }}</p>
              <p>签退状态：{{ CHECK_OUT_STATUS_LABELS[detail.checkOutStatus ?? AttendanceStatus.NOT_CHECKED] }}</p>
              <p>已发工时：{{ detail.grantedHours ?? 0 }}</p>
            </div>
          </div>
        </div>

        <div
          v-if="detail.isRegistered && detail.status === ActivityStatus.OPEN"
          class="grid gap-4 md:grid-cols-2"
        >
          <div class="rounded-[1.35rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              签到
            </p>
            <div class="mt-3 flex flex-col gap-3">
              <input
                v-model.trim="checkInCode"
                type="text"
                class="input"
                placeholder="请输入签到码"
              >
              <button
                class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="actionLoading || !checkInCode || detail.checkInStatus === AttendanceStatus.CHECKED"
                @click="handleCheckIn"
              >
                {{ detail.checkInStatus === AttendanceStatus.CHECKED ? ATTENDANCE_STATUS_LABELS[AttendanceStatus.CHECKED] : actionLoading ? '处理中...' : '提交签到' }}
              </button>
              <p
                v-if="detail.checkInTime"
                class="text-xs text-slate-500"
              >
                签到时间：{{ formatDateTime(detail.checkInTime) }}
              </p>
            </div>
          </div>

          <div class="rounded-[1.35rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              签退
            </p>
            <div class="mt-3 flex flex-col gap-3">
              <input
                v-model.trim="checkOutCode"
                type="text"
                class="input"
                placeholder="请输入签退码"
              >
              <button
                class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="actionLoading || !checkOutCode || detail.checkOutStatus === AttendanceStatus.CHECKED"
                @click="handleCheckOut"
              >
                {{ detail.checkOutStatus === AttendanceStatus.CHECKED ? CHECK_OUT_STATUS_LABELS[AttendanceStatus.CHECKED] : actionLoading ? '处理中...' : '提交签退' }}
              </button>
              <p
                v-if="detail.checkOutTime"
                class="text-xs text-slate-500"
              >
                签退时间：{{ formatDateTime(detail.checkOutTime) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500"
      >
        暂未获取到活动详情
      </div>
    </VolunteerSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { activitiesApi } from '@/api/activities'
import {
  ACTIVITY_STATUS_LABELS,
  ATTENDANCE_STATUS_LABELS,
  CHECK_OUT_STATUS_LABELS
} from '@/constants/status'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import { useMessageStore } from '@/store/modules/messages'
import {
  ActivityStatus,
  AttendanceStatus,
  type ActivityDetailData
} from '@/types/activity'

const route = useRoute()
const messageStore = useMessageStore()
const loading = ref(false)
const actionLoading = ref(false)
const detail = ref<ActivityDetailData['activity'] | null>(null)
const checkInCode = ref('')
const checkOutCode = ref('')

const activityId = computed(() => Number(route.params.id))

const detailTitle = computed(() => detail.value?.title || '活动详情')
const headerMeta = computed(() => [
  { label: '活动状态', value: statusText.value, detail: '实时取自接口' },
  { label: '服务时长', value: `${detail.value?.duration ?? 0} 小时`, detail: '当前活动安排' }
])

const statusText = computed(() => {
  const status = detail.value?.status
  if (status === ActivityStatus.OPEN) return detail.value?.isRegistered ? '已报名' : '可报名'
  if (status === ActivityStatus.ENDED || status === ActivityStatus.CANCELLED) {
    return ACTIVITY_STATUS_LABELS[status]
  }
  return '状态待确认'
})

const statusTone = computed(() => {
  const status = detail.value?.status
  if (status === ActivityStatus.OPEN && detail.value?.isRegistered) return 'blue'
  if (status === ActivityStatus.OPEN) return 'green'
  return 'slate'
})

const formatDateTime = (value?: string) => {
  if (!value) return '待确认'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const loadDetail = async () => {
  if (!activityId.value) {
    messageStore.error('活动ID无效')
    return
  }

  loading.value = true

  try {
    const response = await activitiesApi.detail(activityId.value)
    if (response.code !== 200) {
      throw new Error(response.msg || '获取活动详情失败')
    }
    detail.value = response.data.activity
  } catch (error: any) {
    console.error('加载活动详情失败:', error)
    messageStore.error(error.message || '加载活动详情失败，请稍后重试')
    detail.value = null
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  if (!detail.value) return
  actionLoading.value = true
  try {
    const response = await activitiesApi.signup(detail.value.id)
    if (response.code !== 200 || response.data.success === false) {
      throw new Error(response.msg || '报名失败')
    }
    messageStore.success('报名成功')
    await loadDetail()
  } catch (error: any) {
    console.error('报名失败:', error)
    messageStore.error(error.message || '报名失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const handleCancel = async () => {
  if (!detail.value) return
  actionLoading.value = true
  try {
    const response = await activitiesApi.cancel(detail.value.id)
    if (response.code !== 200 || response.data.success === false) {
      throw new Error(response.msg || '取消报名失败')
    }
    messageStore.success('已取消报名')
    await loadDetail()
  } catch (error: any) {
    console.error('取消报名失败:', error)
    messageStore.error(error.message || '取消报名失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const handleCheckIn = async () => {
  if (!detail.value || !checkInCode.value) return
  actionLoading.value = true
  try {
    const response = await activitiesApi.checkIn({
      activityId: detail.value.id,
      checkInCode: checkInCode.value
    })
    if (response.code !== 200 || response.data.success === false) {
      throw new Error(response.msg || '签到失败')
    }
    messageStore.success('签到成功')
    checkInCode.value = ''
    await loadDetail()
  } catch (error: any) {
    console.error('签到失败:', error)
    messageStore.error(error.message || '签到失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const handleCheckOut = async () => {
  if (!detail.value || !checkOutCode.value) return
  actionLoading.value = true
  try {
    const response = await activitiesApi.checkOut({
      activityId: detail.value.id,
      checkOutCode: checkOutCode.value
    })
    if (response.code !== 200 || response.data.success === false) {
      throw new Error(response.msg || '签退失败')
    }
    messageStore.success('签退成功')
    checkOutCode.value = ''
    await loadDetail()
  } catch (error: any) {
    console.error('签退失败:', error)
    messageStore.error(error.message || '签退失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  void loadDetail()
})
</script>
