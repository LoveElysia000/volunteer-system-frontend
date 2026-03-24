<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Members"
      title="成员管理"
      description="查看组织成员结构、审批状态和角色分布，所有数据均来自真实成员接口。"
      :meta-items="headerMeta"
    >
      <template #actions>
        <input
          v-model.trim="keyword"
          type="text"
          class="input max-w-xs"
          placeholder="搜索成员姓名、编号"
        >
      </template>
    </OrganizationPageHeader>

    <OrganizationSectionCard
      title="筛选与统计"
      description="按审核状态和角色过滤成员列表。"
      tone="soft"
    >
      <div class="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        <select
          v-model="statusFilter"
          class="select"
        >
          <option :value="undefined">
            全部状态
          </option>
          <option :value="MembershipStatus.PENDING">
            待审核
          </option>
          <option :value="MembershipStatus.ACTIVE">
            正式成员
          </option>
          <option :value="MembershipStatus.REJECTED">
            已拒绝
          </option>
          <option :value="MembershipStatus.LEFT">
            已退出
          </option>
        </select>

        <select
          v-model="roleFilter"
          class="select"
        >
          <option :value="undefined">
            全部角色
          </option>
          <option :value="MembershipRole.MEMBER">
            普通成员
          </option>
          <option :value="MembershipRole.ADMIN">
            管理员
          </option>
          <option :value="MembershipRole.OWNER">
            负责人
          </option>
        </select>

        <button
          class="org-toolbar-button"
          :disabled="loading"
          @click="loadMembers"
        >
          {{ loading ? '加载中...' : '刷新成员列表' }}
        </button>
      </div>
    </OrganizationSectionCard>

    <OrganizationSectionCard
      title="成员列表"
      description="成员状态更新会调用文档中的成员状态接口。"
    >
      <div
        v-if="loading"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
      >
        正在加载成员列表...
      </div>

      <div
        v-else-if="!members.length"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
      >
        当前没有可展示的成员数据。
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <article
          v-for="member in members"
          :key="member.membershipId"
          class="organization-surface-lift rounded-[1.3rem] border border-slate-200 bg-white px-5 py-4"
        >
          <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div class="min-w-0 space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-base font-bold text-slate-900">
                  {{ member.volunteerName }}
                </h2>
                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {{ roleText(member.role) }}
                </span>
                <span
                  class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  :class="statusClass(member.status)"
                >
                  {{ statusText(member.status) }}
                </span>
              </div>

              <p class="text-sm text-slate-500">
                编号：{{ member.volunteerCode || '-' }} · 职位：{{ member.position || '未填写' }}
              </p>
              <p class="text-sm leading-6 text-slate-500">
                加入时间：{{ member.joinDate || member.createdAt || '待更新' }} · 期望时长：{{ member.expectedHours || '未填写' }}
              </p>
              <p
                v-if="member.reviewComment"
                class="text-sm text-slate-500"
              >
                审核备注：{{ member.reviewComment }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-if="member.status === MembershipStatus.PENDING"
                class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                :disabled="updatingMembershipId === member.membershipId"
                @click="updateMemberStatus(member.membershipId, MembershipStatus.ACTIVE)"
              >
                通过
              </button>
              <button
                v-if="member.status === MembershipStatus.PENDING"
                class="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 disabled:opacity-60"
                :disabled="updatingMembershipId === member.membershipId"
                @click="updateMemberStatus(member.membershipId, MembershipStatus.REJECTED)"
              >
                驳回
              </button>
              <button
                v-if="member.status === MembershipStatus.ACTIVE"
                class="org-toolbar-button"
                :disabled="updatingMembershipId === member.membershipId"
                @click="updateMemberStatus(member.membershipId, MembershipStatus.LEFT)"
              >
                标记退出
              </button>
            </div>
          </div>
        </article>
      </div>
    </OrganizationSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useMembershipsStore } from '@/store/modules/memberships'
import { useMessageStore } from '@/store/modules/messages'
import { MembershipRole, MembershipStatus } from '@/types/membership'
import { useOrganizationContext } from '@/composables/useOrganizationContext'

const membershipsStore = useMembershipsStore()
const messageStore = useMessageStore()
const { ensureOrganizationId } = useOrganizationContext()

const keyword = ref('')
const statusFilter = ref<MembershipStatus | undefined>()
const roleFilter = ref<MembershipRole | undefined>()
const updatingMembershipId = ref<number | null>(null)

const members = computed(() => membershipsStore.items)
const loading = computed(() => membershipsStore.loading)
const headerMeta = computed(() => [
  { label: '成员总数', value: `${membershipsStore.stats?.totalCount ?? 0}`, detail: '来自成员统计接口' },
  { label: '待审核', value: `${membershipsStore.stats?.pendingCount ?? 0}`, detail: '可直接在本页处理' },
  { label: '正式成员', value: `${membershipsStore.stats?.activeCount ?? 0}`, detail: '当前组织稳定成员' }
])

const loadMembers = async () => {
  const organizationId = await ensureOrganizationId()
  if (!organizationId) {
    messageStore.error('当前没有可用的组织 ID，暂时无法加载成员')
    return
  }

  try {
    await membershipsStore.fetchMembers({
      organizationId,
      keyword: keyword.value || undefined,
      status: statusFilter.value,
      role: roleFilter.value,
      page: 1,
      pageSize: 20
    })
  } catch (error: any) {
    console.error('加载成员失败:', error)
    messageStore.error(error.message || '加载成员失败，请稍后重试')
  }
}

const updateMemberStatus = async (membershipId: number, status: MembershipStatus) => {
  updatingMembershipId.value = membershipId
  try {
    await membershipsStore.updateStatus({
      membershipId,
      status,
      reviewComment: status === MembershipStatus.REJECTED ? '组织端驳回' : status === MembershipStatus.LEFT ? '组织端标记退出' : '组织端通过'
    })
    messageStore.success('成员状态已更新')
    await loadMembers()
  } catch (error: any) {
    console.error('更新成员状态失败:', error)
    messageStore.error(error.message || '更新成员状态失败，请稍后重试')
  } finally {
    updatingMembershipId.value = null
  }
}

const statusText = (status: MembershipStatus) => ({
  [MembershipStatus.PENDING]: '待审核',
  [MembershipStatus.ACTIVE]: '正式成员',
  [MembershipStatus.REJECTED]: '已拒绝',
  [MembershipStatus.LEFT]: '已退出'
}[status] || '状态未知')

const statusClass = (status: MembershipStatus) => ({
  [MembershipStatus.PENDING]: 'bg-amber-100 text-amber-700',
  [MembershipStatus.ACTIVE]: 'bg-emerald-100 text-emerald-700',
  [MembershipStatus.REJECTED]: 'bg-rose-100 text-rose-700',
  [MembershipStatus.LEFT]: 'bg-slate-100 text-slate-600'
}[status] || 'bg-slate-100 text-slate-600')

const roleText = (role: MembershipRole) => ({
  [MembershipRole.MEMBER]: '普通成员',
  [MembershipRole.ADMIN]: '管理员',
  [MembershipRole.OWNER]: '负责人'
}[role] || '未分配')

watch([keyword, statusFilter, roleFilter], () => {
  void loadMembers()
})

onMounted(() => {
  void loadMembers()
})
</script>
