<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Organization Profile"
      title="组织信息管理"
      description="按文档中的新结构拆分为账户信息和组织主体资料两套保存流程。"
      :meta-items="headerMeta"
    />

    <OrganizationSectionCard
      title="可管理组织"
      description="先选择当前要维护的组织主体资料。"
      tone="soft"
    >
      <div class="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          v-model="listFilters.keyword"
          type="text"
          class="input"
          placeholder="搜索组织名称或联系人"
        >
        <button
          class="org-toolbar-button"
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
            编码 {{ item.organizationCode || '待补充' }}
          </p>
        </button>
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500"
      >
        暂无可管理组织数据
      </div>
    </OrganizationSectionCard>

    <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <OrganizationSectionCard
        title="账户信息"
        description="单独更新组织管理者本人的 userName / email / phone。"
      >
        <div class="grid gap-4">
          <label class="text-sm font-medium text-slate-600">
            用户名
            <input
              v-model="accountForm.userName"
              type="text"
              class="input mt-2"
            >
          </label>
          <label class="text-sm font-medium text-slate-600">
            邮箱
            <input
              v-model="accountForm.email"
              type="email"
              class="input mt-2"
            >
          </label>
          <label class="text-sm font-medium text-slate-600">
            手机号
            <input
              v-model="accountForm.phone"
              type="tel"
              class="input mt-2"
            >
          </label>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            class="org-toolbar-button"
            :disabled="accountSaving"
            @click="saveAccountChanges"
          >
            {{ accountSaving ? '保存中...' : '保存账户信息' }}
          </button>
        </div>
      </OrganizationSectionCard>

      <OrganizationSectionCard
        title="组织主体资料"
        description="组织名称、联系电话、地址、Logo 和组织编码等字段统一在这里维护。"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label class="text-sm font-medium text-slate-600">
            组织名称
            <input
              v-model="organizationForm.name"
              type="text"
              class="input mt-2"
            >
          </label>
          <label class="text-sm font-medium text-slate-600">
            组织编码
            <input
              v-model="organizationForm.organizationCode"
              type="text"
              class="input mt-2"
            >
          </label>
          <label class="text-sm font-medium text-slate-600">
            联系人
            <input
              v-model="organizationForm.contactPerson"
              type="text"
              class="input mt-2"
            >
          </label>
          <label class="text-sm font-medium text-slate-600">
            联系电话
            <input
              v-model="organizationForm.contactPhone"
              type="tel"
              class="input mt-2"
            >
          </label>
          <label class="text-sm font-medium text-slate-600 md:col-span-2">
            地址
            <input
              v-model="organizationForm.address"
              type="text"
              class="input mt-2"
            >
          </label>
          <label class="text-sm font-medium text-slate-600 md:col-span-2">
            组织介绍
            <textarea
              v-model="organizationForm.description"
              class="textarea mt-2"
              rows="4"
            />
          </label>
          <label class="text-sm font-medium text-slate-600 md:col-span-2">
            Logo 地址
            <input
              v-model="organizationForm.logoUrl"
              type="text"
              class="input mt-2"
            >
          </label>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            class="org-toolbar-button"
            :disabled="organizationSaving"
            @click="saveOrganizationChanges"
          >
            {{ organizationSaving ? '保存中...' : '保存组织资料' }}
          </button>
        </div>
      </OrganizationSectionCard>
    </div>

    <OrganizationSectionCard
      title="资质信息"
      description="当前文档已拆出 organizationCertification，但文件上传仍待后端补齐。"
      tone="soft"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            当前组织编码
          </p>
          <p class="mt-2 text-sm font-semibold text-slate-800">
            {{ organizationStore.organizationCertification?.organizationCode || organizationForm.organizationCode || '待补充' }}
          </p>
        </div>
        <div class="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-4 text-sm text-gray-500">
          组织资质文件上传能力待后端文件接口补充后再接入
        </div>
      </div>
    </OrganizationSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useMessageStore } from '@/store/modules/messages'
import { useOrganizationStore } from '@/store/modules/organization'
import type { UpdateOrganizationAccountRequest, UpdateOrganizationRequest } from '@/types/organization'
import { useAuthStore } from '@/store/modules/auth'

const authStore = useAuthStore()
const messageStore = useMessageStore()
const organizationStore = useOrganizationStore()
const accountSaving = ref(false)
const organizationSaving = ref(false)
const listFilters = reactive({
  keyword: '',
  page: 1,
  pageSize: 10
})

const accountForm = reactive<Required<UpdateOrganizationAccountRequest>>({
  userName: '',
  email: '',
  phone: ''
})

const organizationForm = reactive<Required<UpdateOrganizationRequest>>({
  name: '',
  organizationCode: '',
  contactPerson: '',
  contactPhone: '',
  address: '',
  description: '',
  logoUrl: ''
})

const headerMeta = computed(() => [
  { label: '可管理组织', value: `${organizationStore.total}`, detail: '来自组织列表接口' },
  { label: '当前组织', value: organizationForm.name || '未选择', detail: '组织主体资料单独保存' }
])

const syncAccountForm = () => {
  accountForm.userName = organizationStore.accountInfo?.userName || authStore.user?.username || ''
  accountForm.email = organizationStore.accountInfo?.email || authStore.user?.email || ''
  accountForm.phone = organizationStore.accountInfo?.phone || authStore.user?.phone || ''
}

const syncOrganizationForm = () => {
  const current = organizationStore.currentOrganization
  organizationForm.name = current?.name || ''
  organizationForm.organizationCode = organizationStore.organizationCertification?.organizationCode || current?.organizationCode || ''
  organizationForm.contactPerson = current?.contactPerson || ''
  organizationForm.contactPhone = current?.contactPhone || ''
  organizationForm.address = current?.address || ''
  organizationForm.description = current?.description || ''
  organizationForm.logoUrl = current?.logoUrl || ''
}

const loadOrganization = async () => {
  const targetId = organizationStore.activeOrganizationId
  if (!targetId) return

  try {
    await organizationStore.fetchOrganization(targetId)
    syncAccountForm()
    syncOrganizationForm()
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

const saveAccountChanges = async () => {
  accountSaving.value = true
  try {
    const payload: UpdateOrganizationAccountRequest = {
      userName: accountForm.userName.trim() || undefined,
      email: accountForm.email.trim() || undefined,
      phone: accountForm.phone.trim() || undefined
    }
    await organizationStore.updateAccount(payload)
    await authStore.updateProfile({
      username: payload.userName || authStore.user?.username,
      email: payload.email || authStore.user?.email,
      phone: payload.phone || authStore.user?.phone
    })
    messageStore.success('账户信息已更新')
  } catch (error: any) {
    console.error('保存账户信息失败:', error)
    messageStore.error(error.message || '保存账户信息失败，请稍后重试')
  } finally {
    accountSaving.value = false
  }
}

const saveOrganizationChanges = async () => {
  const targetId = organizationStore.activeOrganizationId
  if (!targetId) {
    messageStore.error('当前账号缺少组织标识，暂时无法保存')
    return
  }

  organizationSaving.value = true
  try {
    const payload: UpdateOrganizationRequest = {
      name: organizationForm.name.trim() || undefined,
      organizationCode: organizationForm.organizationCode.trim() || undefined,
      contactPerson: organizationForm.contactPerson.trim() || undefined,
      contactPhone: organizationForm.contactPhone.trim() || undefined,
      address: organizationForm.address.trim() || undefined,
      description: organizationForm.description.trim() || undefined,
      logoUrl: organizationForm.logoUrl.trim() || undefined
    }
    await organizationStore.updateOrganization(targetId, payload)
    messageStore.success('组织主体资料已更新')
  } catch (error: any) {
    console.error('保存组织信息失败:', error)
    messageStore.error(error.message || '保存组织信息失败，请稍后重试')
  } finally {
    organizationSaving.value = false
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
