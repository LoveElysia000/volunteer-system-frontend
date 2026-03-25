<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="组织资料"
      title="组织信息管理"
      description="查看组织主体信息，并在需要时进入编辑模式。"
      :meta-items="headerMeta"
      mode="compact"
    >
      <template #actions>
        <button
          class="rounded-full border border-[#ffd7c2] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#ffb78d] hover:text-[#ec5b13]"
          :disabled="organizationStore.loading"
          @click="loadOrganizations"
        >
          {{ organizationStore.loading ? '刷新中...' : '刷新列表' }}
        </button>
      </template>
    </OrganizationPageHeader>

    <OrganizationSectionCard
      title="组织列表"
      description="点击一条组织记录，在右侧查看完整信息。"
      tone="soft"
    >
      <div class="space-y-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="relative w-full md:max-w-md">
            <SearchIcon class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="listFilters.keyword"
              type="text"
              class="input !rounded-[1rem] !border-white/90 !bg-white pl-11"
              placeholder="搜索组织名称或联系人"
            >
          </div>

          <div class="flex items-center gap-2 text-xs text-slate-400">
            <span>{{ organizationStore.total }} 条记录</span>
            <span class="text-slate-300">/</span>
            <span>点击任一行打开详情</span>
          </div>
        </div>

        <div
          v-if="organizationStore.organizations.length"
          class="overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white"
        >
          <div class="hidden grid-cols-[minmax(0,1.45fr)_minmax(110px,0.75fr)_minmax(140px,0.9fr)_100px_110px_120px] gap-4 border-b border-slate-200 bg-slate-50/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 lg:grid">
            <span>组织信息</span>
            <span>联系人</span>
            <span>联系电话</span>
            <span>组织编码</span>
            <span>更新时间</span>
            <span class="text-right">操作</span>
          </div>

          <button
            v-for="item in organizationStore.organizations"
            :key="item.id"
            class="group grid w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 hover:bg-[#fffaf7] lg:grid-cols-[minmax(0,1.45fr)_minmax(110px,0.75fr)_minmax(140px,0.9fr)_100px_110px_120px] lg:items-center lg:gap-4"
            :class="organizationStore.activeOrganizationId === item.id && drawerOpen ? 'bg-[#fff8f3]' : 'bg-white'"
            @click="openOrganizationDetail(item.id)"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <p class="truncate text-sm font-bold text-slate-900">
                  {{ item.name }}
                </p>
                <span
                  v-if="organizationStore.activeOrganizationId === item.id && drawerOpen"
                  class="rounded-full bg-[#fff1ea] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ec5b13]"
                >
                  查看中
                </span>
              </div>
              <p class="mt-1 text-xs text-slate-500">
                {{ item.address || item.region || '暂无地址信息' }}
              </p>
            </div>

            <div class="text-sm text-slate-600">
              {{ item.contactPerson || '待补充' }}
            </div>

            <div class="text-sm text-slate-600">
              {{ item.contactPhone || '待补充' }}
            </div>

            <div class="text-sm font-semibold text-slate-700">
              {{ item.organizationCode || '待补充' }}
            </div>

            <div class="hidden text-sm text-slate-500 lg:block">
              {{ formatDate(item.updatedAt || item.createdAt) }}
            </div>

            <div class="flex items-center justify-between gap-3 lg:justify-end">
              <span class="text-xs text-slate-400 lg:hidden">
                {{ formatDate(item.updatedAt || item.createdAt) }}
              </span>
              <span class="inline-flex items-center gap-1 text-sm font-semibold text-[#ec5b13] transition group-hover:translate-x-0.5">
                查看详情
                <ChevronRightIcon class="h-4 w-4" />
              </span>
            </div>
          </button>
        </div>

        <div
          v-else
          class="rounded-[1.2rem] border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500"
        >
          暂无可管理组织数据
        </div>
      </div>
    </OrganizationSectionCard>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="drawerOpen"
          class="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-[2px]"
          @click.self="closeDrawer"
        >
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="translate-x-full opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-x-0 opacity-100"
            leave-to-class="translate-x-full opacity-0"
          >
            <aside
              v-if="drawerOpen"
              class="absolute right-0 top-0 flex h-full w-full max-w-[760px] flex-col overflow-hidden border-l border-[#ffd8c2] bg-[#fffdfa] shadow-[-24px_0_80px_-42px_rgba(15,23,42,0.42)]"
            >
              <div class="border-b border-[#ffe4d3] bg-[linear-gradient(135deg,#fffaf7_0%,#fff3eb_52%,#ffffff_100%)] px-6 py-5">
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#ec5b13]">
                      组织详情
                    </p>
                    <h2 class="mt-2 truncate text-2xl font-black tracking-tight text-slate-900">
                      {{ drawerOrganizationName }}
                    </h2>
                    <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span class="rounded-full bg-white/90 px-2.5 py-1">
                        编码 {{ activeOrganizationCode }}
                      </span>
                      <span class="rounded-full bg-white/90 px-2.5 py-1">
                        {{ currentOrganization?.organizationType || '组织类型待补充' }}
                      </span>
                      <span class="rounded-full bg-white/90 px-2.5 py-1">
                        {{ formatDate(currentOrganization?.updatedAt || currentOrganization?.createdAt) }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      v-if="drawerMode === 'view'"
                      class="rounded-full border border-[#ffd7c2] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#ffb78d] hover:text-[#ec5b13]"
                      :disabled="drawerLoading || !currentOrganization"
                      @click="drawerMode = 'edit'"
                    >
                      编辑
                    </button>
                    <button
                      v-else
                      class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                      @click="cancelEdit"
                    >
                      取消
                    </button>
                    <button
                      class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                      @click="closeDrawer"
                    >
                      <XIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex-1 overflow-y-auto px-6 py-6">
                <div
                  v-if="drawerLoading"
                  class="rounded-[1.2rem] border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500"
                >
                  正在加载组织详情...
                </div>

                <div
                  v-else-if="!currentOrganization"
                  class="rounded-[1.2rem] border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500"
                >
                  暂无详情数据
                </div>

                <div
                  v-else
                  class="space-y-5"
                >
                  <section class="rounded-[1.35rem] border border-[#ffe4d3] bg-white p-5">
                    <div class="mb-4 flex items-center gap-2">
                      <Building2Icon class="h-4 w-4 text-[#ec5b13]" />
                      <h3 class="text-sm font-bold text-slate-900">
                        基础信息
                      </h3>
                    </div>

                    <template v-if="drawerMode === 'view'">
                      <div class="grid gap-4 md:grid-cols-2">
                        <div class="drawer-field">
                          <span class="drawer-label">组织名称</span>
                          <span class="drawer-value">{{ currentOrganization.name || '待补充' }}</span>
                        </div>
                        <div class="drawer-field">
                          <span class="drawer-label">组织编码</span>
                          <span class="drawer-value">{{ activeOrganizationCode }}</span>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="grid gap-4 md:grid-cols-2">
                        <label class="drawer-edit-label">
                          组织名称
                          <input
                            v-model="organizationForm.name"
                            type="text"
                            class="input mt-2"
                          >
                        </label>
                        <label class="drawer-edit-label">
                          组织编码
                          <input
                            v-model="organizationForm.organizationCode"
                            type="text"
                            class="input mt-2"
                          >
                        </label>
                      </div>
                    </template>
                  </section>

                  <section class="rounded-[1.35rem] border border-slate-200 bg-white p-5">
                    <div class="mb-4 flex items-center gap-2">
                      <UsersIcon class="h-4 w-4 text-sky-600" />
                      <h3 class="text-sm font-bold text-slate-900">
                        联系信息
                      </h3>
                    </div>

                    <template v-if="drawerMode === 'view'">
                      <div class="grid gap-4 md:grid-cols-2">
                        <div class="drawer-field">
                          <span class="drawer-label">联系人</span>
                          <span class="drawer-value">{{ currentOrganization.contactPerson || '待补充' }}</span>
                        </div>
                        <div class="drawer-field">
                          <span class="drawer-label">联系电话</span>
                          <span class="drawer-value">{{ currentOrganization.contactPhone || '待补充' }}</span>
                        </div>
                        <div class="drawer-field md:col-span-2">
                          <span class="drawer-label">地址</span>
                          <span class="drawer-value">{{ currentOrganization.address || '待补充' }}</span>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="grid gap-4 md:grid-cols-2">
                        <label class="drawer-edit-label">
                          联系人
                          <input
                            v-model="organizationForm.contactPerson"
                            type="text"
                            class="input mt-2"
                          >
                        </label>
                        <label class="drawer-edit-label">
                          联系电话
                          <input
                            v-model="organizationForm.contactPhone"
                            type="tel"
                            class="input mt-2"
                          >
                        </label>
                        <label class="drawer-edit-label md:col-span-2">
                          地址
                          <input
                            v-model="organizationForm.address"
                            type="text"
                            class="input mt-2"
                          >
                        </label>
                      </div>
                    </template>
                  </section>

                  <section class="rounded-[1.35rem] border border-slate-200 bg-white p-5">
                    <div class="mb-4 flex items-center gap-2">
                      <FileTextIcon class="h-4 w-4 text-emerald-600" />
                      <h3 class="text-sm font-bold text-slate-900">
                        展示信息
                      </h3>
                    </div>

                    <template v-if="drawerMode === 'view'">
                      <div class="grid gap-4">
                        <div class="drawer-field">
                          <span class="drawer-label">组织介绍</span>
                          <span class="drawer-value whitespace-pre-line">{{ currentOrganization.description || '待补充' }}</span>
                        </div>
                        <div class="drawer-field">
                          <span class="drawer-label">Logo 地址</span>
                          <span class="drawer-value break-all">{{ currentOrganization.logoUrl || '待补充' }}</span>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="grid gap-4">
                        <label class="drawer-edit-label">
                          组织介绍
                          <textarea
                            v-model="organizationForm.description"
                            class="textarea mt-2"
                            rows="4"
                          />
                        </label>
                        <label class="drawer-edit-label">
                          Logo 地址
                          <input
                            v-model="organizationForm.logoUrl"
                            type="text"
                            class="input mt-2"
                          >
                        </label>
                      </div>
                    </template>
                  </section>

                  <section class="rounded-[1.35rem] border border-slate-200 bg-white p-5">
                    <div class="mb-4 flex items-center gap-2">
                      <ShieldCheckIcon class="h-4 w-4 text-violet-600" />
                      <h3 class="text-sm font-bold text-slate-900">
                        账户信息
                      </h3>
                    </div>

                    <template v-if="drawerMode === 'view'">
                      <div class="grid gap-4 md:grid-cols-2">
                        <div class="drawer-field">
                          <span class="drawer-label">用户名</span>
                          <span class="drawer-value">{{ organizationStore.accountInfo?.userName || authStore.user?.username || '待补充' }}</span>
                        </div>
                        <div class="drawer-field">
                          <span class="drawer-label">邮箱</span>
                          <span class="drawer-value">{{ organizationStore.accountInfo?.email || authStore.user?.email || '待补充' }}</span>
                        </div>
                        <div class="drawer-field md:col-span-2">
                          <span class="drawer-label">手机号</span>
                          <span class="drawer-value">{{ organizationStore.accountInfo?.phone || authStore.user?.phone || '待补充' }}</span>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="grid gap-4 md:grid-cols-2">
                        <label class="drawer-edit-label">
                          用户名
                          <input
                            v-model="accountForm.userName"
                            type="text"
                            class="input mt-2"
                          >
                        </label>
                        <label class="drawer-edit-label">
                          邮箱
                          <input
                            v-model="accountForm.email"
                            type="email"
                            class="input mt-2"
                          >
                        </label>
                        <label class="drawer-edit-label md:col-span-2">
                          手机号
                          <input
                            v-model="accountForm.phone"
                            type="tel"
                            class="input mt-2"
                          >
                        </label>
                      </div>
                    </template>
                  </section>
                </div>
              </div>

              <div
                v-if="drawerMode === 'edit' && currentOrganization"
                class="border-t border-slate-200 bg-white/95 px-6 py-4"
              >
                <div class="flex flex-wrap items-center justify-end gap-3">
                  <button
                    class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                    @click="cancelEdit"
                  >
                    取消
                  </button>
                  <button
                    class="rounded-full border border-[#ffd7c2] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#ffb78d] hover:text-[#ec5b13]"
                    :disabled="accountSaving"
                    @click="saveAccountChanges"
                  >
                    {{ accountSaving ? '保存账户中...' : '保存账户信息' }}
                  </button>
                  <button
                    class="rounded-full bg-[#ec5b13] px-5 py-2 text-sm font-semibold text-white shadow-[0_16px_30px_-18px_rgba(236,91,19,0.7)] transition hover:bg-[#d04f14]"
                    :disabled="organizationSaving"
                    @click="saveOrganizationChanges"
                  >
                    {{ organizationSaving ? '保存组织中...' : '保存组织资料' }}
                  </button>
                </div>
              </div>
            </aside>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useMessageStore } from '@/store/modules/messages'
import { useOrganizationStore } from '@/store/modules/organization'
import type { OrganizationInfo, UpdateOrganizationAccountRequest, UpdateOrganizationRequest } from '@/types/organization'
import { useAuthStore } from '@/store/modules/auth'
import {
  Building2Icon,
  ChevronRightIcon,
  FileTextIcon,
  SearchIcon,
  ShieldCheckIcon,
  UsersIcon,
  XIcon
} from 'lucide-vue-next'

const authStore = useAuthStore()
const messageStore = useMessageStore()
const organizationStore = useOrganizationStore()
const accountSaving = ref(false)
const organizationSaving = ref(false)
const drawerOpen = ref(false)
const drawerLoading = ref(false)
const drawerMode = ref<'view' | 'edit'>('view')
const listFilters = reactive({
  keyword: '',
  page: 1,
  pageSize: 10
})
let keywordSearchTimer: ReturnType<typeof setTimeout> | null = null

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

const currentOrganization = computed(() => organizationStore.currentOrganization)

const drawerOrganizationName = computed(() => currentOrganization.value?.name || '未选择组织')

const activeOrganizationCode = computed(() => {
  return organizationStore.organizationCertification?.organizationCode || organizationForm.organizationCode || currentOrganization.value?.organizationCode || '待补充'
})

const headerMeta = computed(() => [
  { label: '可管理组织', value: `${organizationStore.total}`, detail: '来自组织列表接口' },
  { label: '当前查看', value: drawerOpen.value ? drawerOrganizationName.value : '未打开详情', detail: '详情在右侧抽屉查看' }
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

const loadOrganization = async (id: number) => {
  drawerLoading.value = true
  try {
    await organizationStore.fetchOrganization(id)
    syncAccountForm()
    syncOrganizationForm()
  } catch (error: any) {
    console.error('加载组织信息失败:', error)
    messageStore.error(error.message || '加载组织信息失败，请稍后重试')
  } finally {
    drawerLoading.value = false
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

watch(
  () => listFilters.keyword,
  () => {
    if (keywordSearchTimer) {
      clearTimeout(keywordSearchTimer)
    }

    keywordSearchTimer = setTimeout(() => {
      listFilters.page = 1
      loadOrganizations()
    }, 250)
  }
)

const openOrganizationDetail = async (id: number) => {
  drawerOpen.value = true
  drawerMode.value = 'view'
  organizationStore.setActiveOrganization(id)
  await loadOrganization(id)
}

const closeDrawer = () => {
  drawerOpen.value = false
  drawerMode.value = 'view'
}

const cancelEdit = () => {
  drawerMode.value = 'view'
  syncAccountForm()
  syncOrganizationForm()
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
    drawerMode.value = 'view'
  } catch (error: any) {
    console.error('保存组织信息失败:', error)
    messageStore.error(error.message || '保存组织信息失败，请稍后重试')
  } finally {
    organizationSaving.value = false
  }
}

const formatDate = (value?: string) => {
  if (!value) return '暂无时间'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(() => {
  loadOrganizations()
})

onBeforeUnmount(() => {
  if (keywordSearchTimer) {
    clearTimeout(keywordSearchTimer)
  }
})
</script>

<style scoped>
.drawer-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.drawer-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #94a3b8;
}

.drawer-value {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #0f172a;
}

.drawer-edit-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
}
</style>
