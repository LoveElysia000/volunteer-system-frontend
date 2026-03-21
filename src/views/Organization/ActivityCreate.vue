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
          <textarea
            v-model="form.description"
            class="textarea"
            rows="4"
            placeholder="请输入活动描述"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
          <input
            v-model="form.startTime"
            type="datetime-local"
            class="input"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
          <input
            v-model="form.endTime"
            type="datetime-local"
            class="input"
          >
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
import { useMessageStore } from '@/store/modules/messages'
import { useOrganizationStore } from '@/store/modules/organization'

const router = useRouter()
const messageStore = useMessageStore()
const organizationStore = useOrganizationStore()
const submitting = ref(false)
const organizationId = computed(() => Number(organizationStore.activeOrganizationId || organizationStore.currentOrganization?.id || 0))

const form = reactive({
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

const toApiDateTime = (value: string) => {
  if (!value) {
    return ''
  }
  return new Date(value).toISOString().slice(0, 19).replace('T', ' ')
}

const submitActivity = async () => {
  if (!organizationId.value) {
    messageStore.error('当前账号缺少组织标识，暂时无法创建活动')
    return
  }
  if (!form.title.trim() || !form.description.trim() || !form.startTime || !form.endTime || !form.location.trim()) {
    messageStore.error('请先填写完整的活动基础信息')
    return
  }
  submitting.value = true
  try {
    const response = await activitiesApi.create({
      orgId: organizationId.value,
      title: form.title.trim(),
      description: form.description.trim(),
      coverUrl: form.coverUrl.trim() || undefined,
      startTime: toApiDateTime(form.startTime),
      endTime: toApiDateTime(form.endTime),
      location: form.location.trim(),
      address: form.address.trim() || undefined,
      duration: Number(form.duration),
      maxPeople: Number(form.maxPeople)
    })

    if (response.code !== 200) {
      throw new Error(response.msg || '创建活动失败')
    }

    messageStore.success(response.data.message || '活动创建成功')
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
