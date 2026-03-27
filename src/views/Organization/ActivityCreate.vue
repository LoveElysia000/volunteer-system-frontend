<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">
      创建活动
    </h1>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">活动标题</label>
          <input
            v-model="form.title"
            type="text"
            class="input"
            placeholder="请输入活动标题"
          >
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
          <Textarea
            v-model="form.description"
            placeholder="请输入活动描述"
            :min-rows="3"
            :max-rows="6"
            allow-clear
            show-word-limit
            :max-length="500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
          <DatePicker
            v-model="startTimeValue"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择开始时间"
            enable-time-picker
            :minutes-increment="1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
          <DatePicker
            v-model="endTimeValue"
            format="yyyy-MM-dd HH:mm"
            placeholder="请选择结束时间"
            enable-time-picker
            :minutes-increment="1"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">活动地点</label>
          <input
            v-model="form.location"
            type="text"
            class="input"
            placeholder="请输入活动地点"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
          <input
            v-model="form.address"
            type="text"
            class="input"
            placeholder="请输入详细地址"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">活动时长（小时）</label>
          <input
            v-model.number="form.duration"
            type="number"
            min="1"
            class="input"
            placeholder="请输入活动时长"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">人数上限</label>
          <input
            v-model.number="form.maxPeople"
            type="number"
            min="1"
            class="input"
            placeholder="请输入人数上限"
          >
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">封面地址</label>
          <input
            v-model="form.coverUrl"
            type="text"
            class="input"
            placeholder="可选，填写活动封面 URL"
          >
        </div>
        <div
          v-if="form.coverUrl.trim()"
          class="md:col-span-2"
        >
          <p class="mb-2 text-sm font-medium text-gray-700">
            活动封面预览
          </p>
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-slate-50">
            <img
              :src="form.coverUrl.trim()"
              alt="活动封面预览"
              class="h-56 w-full object-cover"
            >
          </div>
        </div>
      </div>

      <div
        v-if="recentCreatedActivityId"
        class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        最近创建 ID：#{{ recentCreatedActivityId }}
      </div>

      <div class="flex justify-end">
        <button
          class="btn btn-primary"
          :disabled="submitting"
          @click="submitActivity"
        >
          {{ submitting ? '创建中...' : '创建活动' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { activitiesApi } from '@/api/activities'
import DatePicker from '@/components/ui/DatePicker.vue'
import Textarea from '@/components/ui/Textarea.vue'
import { useMessageStore } from '@/store/modules/messages'
import { useOrganizationStore } from '@/store/modules/organization'
import type { CreateOrganizationActivityRequest } from '@/types/activity'

const router = useRouter()
const messageStore = useMessageStore()
const organizationStore = useOrganizationStore()
const submitting = ref(false)
const recentCreatedActivityId = ref<number | null>(null)
const organizationId = computed(() => organizationStore.activeOrganizationId ?? organizationStore.currentOrganization?.id ?? 0)

const form = reactive<CreateOrganizationActivityRequest>({
  orgId: 0,
  title: '',
  description: '',
  coverUrl: '',
  startTime: '',
  endTime: '',
  location: '',
  address: '',
  duration: 2,
  maxPeople: 30
})

const toDateValue = (value: string) => {
  if (!value) return null
  const parsed = new Date(value.replace(' ', 'T'))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const fromDateValue = (value: Date | null) => {
  if (!value) return ''
  const pad = (part: number) => `${part}`.padStart(2, '0')
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:00`
}

const startTimeValue = computed<Date | null>({
  get: () => toDateValue(form.startTime),
  set: (value) => {
    form.startTime = fromDateValue(value)
  }
})

const endTimeValue = computed<Date | null>({
  get: () => toDateValue(form.endTime),
  set: (value) => {
    form.endTime = fromDateValue(value)
  }
})

const submitActivity = async () => {
  if (!organizationId.value) {
    messageStore.error('当前账号缺少组织标识，暂时无法创建活动')
    return
  }
  if (!form.title.trim() || !form.description.trim() || !form.startTime || !form.endTime || !form.location.trim()) {
    messageStore.error('请先填写完整的活动基础信息')
    return
  }
  if (new Date(form.endTime).getTime() <= new Date(form.startTime).getTime()) {
    messageStore.error('结束时间必须晚于开始时间')
    return
  }
  if (form.duration <= 0 || form.maxPeople <= 0) {
    messageStore.error('活动时长和人数上限都必须大于 0')
    return
  }
  submitting.value = true
  try {
    form.orgId = organizationId.value
    const payload: CreateOrganizationActivityRequest = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      coverUrl: form.coverUrl.trim() || undefined,
      location: form.location.trim(),
      address: form.address.trim() || undefined,
      startTime: form.startTime,
      endTime: form.endTime
    }
    const response = await activitiesApi.create(payload)

    if (response.code !== 200) {
      throw new Error(response.msg || '创建活动失败')
    }

    recentCreatedActivityId.value = response.data.id
    messageStore.success(response.data.message || `活动创建成功，ID #${response.data.id}`)
    router.push('/organization/activities')
  } catch (error: any) {
    console.error('创建活动失败:', error)
    messageStore.error(error.message || '创建活动失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!organizationStore.activeOrganizationId && !organizationStore.currentOrganization) {
    try {
      await organizationStore.fetchOrganizations({ page: 1, pageSize: 10 })
      if (organizationStore.activeOrganizationId) {
        await organizationStore.fetchOrganization(organizationStore.activeOrganizationId)
      }
    } catch (error) {
      console.error('加载组织信息失败:', error)
    }
  }
})
</script>
