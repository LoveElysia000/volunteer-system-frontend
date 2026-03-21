<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        组织信息管理
      </h1>
      <button
        class="btn btn-primary"
        :disabled="saving"
        @click="saveChanges"
      >
        保存更改
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">
          可管理组织
        </h2>
        <span class="text-sm text-gray-500">
          共 {{ organizationStore.total }} 个
        </span>
      </div>
      <div class="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          v-model="listFilters.keyword"
          type="text"
          class="input"
          placeholder="搜索组织名称或联系人"
        >
        <button
          class="btn btn-outline"
          :disabled="organizationStore.loading"
          @click="loadOrganizations"
        >
          刷新列表
        </button>
      </div>
      <div
        v-if="organizationStore.organizations.length"
        class="grid gap-3 md:grid-cols-2"
      >
        <button
          v-for="item in organizationStore.organizations"
          :key="item.id"
          class="rounded-xl border px-4 py-4 text-left transition"
          :class="organizationStore.activeOrganizationId === item.id ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/40'"
          @click="switchOrganization(item.id)"
        >
          <p class="font-semibold text-gray-900">
            {{ item.name }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            {{ item.contactPerson || '联系人待补充' }} / {{ item.contactPhone || '联系电话待补充' }}
          </p>
          <p class="mt-2 text-xs text-gray-400">
            {{ item.region || '区域待补充' }} · {{ item.organizationType || '类型待补充' }}
          </p>
        </button>
      </div>
      <div
        v-else
        class="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500"
      >
        暂无可管理组织数据
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold mb-4">
        基本信息
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">组织名称</label>
          <input
            v-model="form.name"
            type="text"
            class="input"
            placeholder="请输入组织名称"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">组织类型</label>
          <select
            v-model="form.organizationType"
            class="select"
          >
            <option value="">
              请选择组织类型
            </option>
            <option>公益组织</option>
            <option>学校组织</option>
            <option>企业组织</option>
            <option>社区组织</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">统一社会信用代码</label>
          <input
            v-model="form.organizationCode"
            type="text"
            class="input"
            placeholder="请输入统一社会信用代码"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">所属地区</label>
          <input
            v-model="form.region"
            type="text"
            class="input"
            placeholder="请输入所属地区"
          >
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">组织描述</label>
          <textarea
            v-model="form.description"
            class="textarea"
            rows="3"
            placeholder="请描述您的组织"
          />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold mb-4">
        联系信息
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
          <input
            v-model="form.contactPhone"
            type="tel"
            class="input"
            placeholder="请输入联系电话"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">联系邮箱</label>
          <input
            v-model="form.email"
            type="email"
            class="input"
            placeholder="请输入联系邮箱"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">联系人</label>
          <input
            v-model="form.contactPerson"
            type="text"
            class="input"
            placeholder="请输入联系人"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">官网地址</label>
          <input
            v-model="form.websiteUrl"
            type="text"
            class="input"
            placeholder="请输入官网地址"
          >
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">组织地址</label>
          <input
            v-model="form.address"
            type="text"
            class="input"
            placeholder="请输入详细地址"
          >
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold mb-4">
        资质认证
      </h2>
      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-600 mb-2">
            组织证件照片
          </p>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <CameraIcon class="h-12 w-12 text-gray-400 mx-auto" />
            <p class="mt-2 text-sm text-gray-500">
              资质上传能力待后端文件接口补充后再接入
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useMessageStore } from '@/store/modules/messages'
import { useOrganizationStore } from '@/store/modules/organization'
import { CameraIcon } from 'lucide-vue-next'

const messageStore = useMessageStore()
const organizationStore = useOrganizationStore()
const saving = ref(false)
const listFilters = reactive({
  keyword: '',
  page: 1,
  pageSize: 10
})

const form = reactive({
  name: '',
  organizationCode: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
  organizationType: '',
  region: '',
  description: '',
  websiteUrl: ''
})

const syncForm = () => {
  const current = organizationStore.currentOrganization
  form.name = current?.name || ''
  form.organizationCode = current?.organizationCode || ''
  form.contactPerson = current?.contactPerson || ''
  form.contactPhone = current?.contactPhone || ''
  form.email = current?.email || ''
  form.address = current?.address || ''
  form.organizationType = current?.organizationType || ''
  form.region = current?.region || ''
  form.description = current?.description || ''
  form.websiteUrl = current?.websiteUrl || ''
}

const loadOrganization = async () => {
  const targetId = organizationStore.activeOrganizationId
  if (!targetId) {
    return
  }
  try {
    await organizationStore.fetchOrganization(targetId)
    syncForm()
  } catch (error: any) {
    console.error('加载组织信息失败:', error)
    messageStore.error(error.message || '加载组织信息失败，请稍后重试')
  }
}

const loadOrganizations = async () => {
  try {
    await organizationStore.fetchOrganizations({
      keyword: listFilters.keyword.trim() || undefined,
      page: listFilters.page,
      pageSize: listFilters.pageSize
    })
  } catch (error: any) {
    console.error('加载组织列表失败:', error)
    messageStore.error(error.message || '加载组织列表失败，请稍后重试')
  }
}

const switchOrganization = async (id: number) => {
  organizationStore.setActiveOrganization(id)
  await loadOrganization()
}

const saveChanges = async () => {
  const targetId = organizationStore.activeOrganizationId
  if (!targetId) {
    messageStore.error('当前账号缺少组织标识，暂时无法保存')
    return
  }
  saving.value = true
  try {
    await organizationStore.updateOrganization(targetId, {
      name: form.name,
      organizationCode: form.organizationCode,
      contactPerson: form.contactPerson,
      contactPhone: form.contactPhone,
      email: form.email,
      address: form.address,
      organizationType: form.organizationType,
      region: form.region,
      description: form.description,
      websiteUrl: form.websiteUrl
    })
    messageStore.success('组织信息已更新')
  } catch (error: any) {
    console.error('保存组织信息失败:', error)
    messageStore.error(error.message || '保存组织信息失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadOrganizations().then(async () => {
    if (!organizationStore.activeOrganizationId && organizationStore.organizations.length) {
      organizationStore.setActiveOrganization(organizationStore.organizations[0].id)
    }
    await loadOrganization()
  })
})
</script>
