<template>
  <DataListPage>
    <template #header>
      <OrganizationPageHeader
        eyebrow="成员"
        title="成员管理"
        description="查看组织成员结构、审批状态和角色分布。"
        layout="operations"
        :meta-items="headerMeta"
      >
        <template #summary>
          <div
            v-for="item in headerHighlights"
            :key="item.label"
            class="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold shadow-[0_12px_26px_-22px_rgba(15,23,42,0.25)]"
            :class="item.tone === 'accent'
              ? 'border-[#ffd5bd] bg-[#fff6f0] text-[#b45309]'
              : 'border-slate-200 bg-white/90 text-slate-600'"
          >
            <span class="text-xs uppercase tracking-[0.18em] text-slate-400">{{ item.label }}</span>
            <span class="text-slate-900">{{ item.value }}</span>
          </div>
        </template>
        <template #actions>
          <Input
            v-model.trim="keyword"
            placeholder="搜索成员姓名、编号"
            :icon="SearchIcon"
            allow-clear
            class="w-full 2xl:max-w-md"
          />
        </template>
      </OrganizationPageHeader>
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
            <FilterSelect
              v-model="statusFilter"
              title="成员状态"
              :icon="UserRoundSearchIcon"
              :options="statusFilterOptions"
            />

            <FilterSelect
              v-model="roleFilter"
              title="成员角色"
              :icon="ShieldCheckIcon"
              :options="roleFilterOptions"
            />
            <FilterSelect
              v-model="pageSize"
              title="每页条数"
              :icon="UserRoundSearchIcon"
              :options="pageSizeOptions"
            />
          </div>
        </template>

        <template #summary>
          <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>第 {{ page }} / {{ totalPages }} 页</span>
            <span>当前 {{ members.length }} 条，共 {{ membershipsStore.total }} 条</span>
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
      <DataTable
        :columns="columns"
        :items="members"
        :loading="loading"
        row-key="membershipId"
        :selected-key="selectedMembershipId"
        interactive
        open-text="查看"
        open-style="text"
        density="compact"
        empty-title="当前没有符合条件的成员"
        empty-description="调整关键词、状态或角色后再试。"
        @row-click="openMemberDrawer"
      >
        <template #cell-identity="{ item }">
          <div class="min-w-0 space-y-1">
            <p class="truncate text-sm font-semibold text-slate-900">
              {{ item.volunteerName }}
            </p>
            <p class="truncate text-xs text-slate-500">
              编号：{{ item.volunteerCode || '-' }}
            </p>
          </div>
        </template>

        <template #cell-role="{ item }">
          <StatusBadge
            :label="roleText(item.role)"
            :tone="roleTone(item.role)"
          />
        </template>

        <template #cell-status="{ item }">
          <StatusBadge
            :label="statusText(item.status)"
            :tone="statusTone(item.status)"
          />
        </template>

        <template #cell-position="{ item }">
          {{ item.position || '未填写' }}
        </template>

        <template #cell-joinDate="{ item }">
          {{ memberJoinDate(item) }}
        </template>

        <template #cell-expectedHours="{ item }">
          {{ item.expectedHours || '未填写' }}
        </template>
      </DataTable>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="520px"
        :aria-label="selectedMember ? `${selectedMember.volunteerName} 的成员详情` : '成员详情'"
        @close="closeMemberDrawer"
      >
        <template #header>
          <div class="min-w-0 space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  成员详情
                </p>
                <h2 class="truncate text-lg font-bold tracking-tight text-slate-900">
                  {{ selectedMember?.volunteerName || '未选择成员' }}
                </h2>
                <p class="text-sm text-slate-500">
                  编号：{{ selectedMember?.volunteerCode || '-' }}
                </p>
              </div>

              <div
                v-if="selectedMember"
                class="h-12 w-12 rounded-2xl bg-[#fff4ec] text-center text-sm font-black leading-[3rem] text-[#ec5b13]"
              >
                {{ selectedMember.volunteerName?.slice(0, 1) || '成' }}
              </div>
            </div>

            <div
              v-if="selectedMember"
              class="flex flex-wrap gap-2"
            >
              <StatusBadge
                :label="statusText(selectedMember.status)"
                :tone="statusTone(selectedMember.status)"
              />
              <StatusBadge
                :label="roleText(selectedMember.role)"
                :tone="roleTone(selectedMember.role)"
              />
            </div>
          </div>
        </template>

        <div
          v-if="selectedMember"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  组织名称
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedMember.organizationName || '-' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  职位
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedMember.position || '未填写' }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  加入时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ memberJoinDate(selectedMember) }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  期望时长
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedMember.expectedHours || '未填写' }}
                </p>
              </div>
            </div>
          </section>

          <section class="space-y-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                审核备注
              </p>
              <p class="mt-1 text-sm leading-6 text-slate-700">
                {{ selectedMember.reviewComment || '暂无审核备注。' }}
              </p>
            </div>
          </section>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击表格中的成员行查看详情和处理动作。
        </div>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              v-if="selectedMember?.status === MembershipStatus.PENDING"
              variant="success"
              :loading="isUpdatingSelectedMember"
              @click="updateSelectedMemberStatus(MembershipStatus.ACTIVE)"
            >
              通过
            </Button>
            <Button
              v-if="selectedMember?.status === MembershipStatus.PENDING"
              variant="danger"
              :loading="isUpdatingSelectedMember"
              @click="updateSelectedMemberStatus(MembershipStatus.REJECTED)"
            >
              驳回
            </Button>
            <Button
              v-if="selectedMember?.status === MembershipStatus.ACTIVE"
              variant="outline"
              :loading="isUpdatingSelectedMember"
              @click="updateSelectedMemberStatus(MembershipStatus.LEFT)"
            >
              标记退出
            </Button>
          </div>
        </template>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DataTable, { type DataTableColumn } from '@/components/data-list/DataTable.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import { useMembershipsStore } from '@/store/modules/memberships'
import { useMessageStore } from '@/store/modules/messages'
import { useOrganizationContext } from '@/composables/useOrganizationContext'
import { MembershipRole, MembershipStatus, type MemberInfo } from '@/types/membership'
import { SearchIcon, ShieldCheckIcon, UserRoundSearchIcon } from 'lucide-vue-next'

const membershipsStore = useMembershipsStore()
const messageStore = useMessageStore()
const { ensureOrganizationId } = useOrganizationContext()

const keyword = ref('')
const statusFilter = ref<MembershipStatus | undefined>()
const roleFilter = ref<MembershipRole | undefined>()
const page = ref(1)
const pageSize = ref(20)
const statusFilterOptions = [
  { key: 'all-status', value: undefined, label: '全部状态', description: '查看所有成员审批状态' },
  { key: 'pending', value: MembershipStatus.PENDING, label: '待审核', description: '仅显示等待处理的申请' },
  { key: 'active', value: MembershipStatus.ACTIVE, label: '正式成员', description: '查看已通过审核的成员' },
  { key: 'rejected', value: MembershipStatus.REJECTED, label: '已拒绝', description: '查看被驳回的申请' },
  { key: 'left', value: MembershipStatus.LEFT, label: '已退出', description: '查看已离开组织的成员' }
] as const
const roleFilterOptions = [
  { key: 'all-role', value: undefined, label: '全部角色', description: '查看所有成员角色' },
  { key: 'member', value: MembershipRole.MEMBER, label: '普通成员', description: '组织中的基础成员角色' },
  { key: 'admin', value: MembershipRole.ADMIN, label: '管理员', description: '拥有部分管理权限的成员' },
  { key: 'owner', value: MembershipRole.OWNER, label: '负责人', description: '组织负责人或最高权限成员' }
] as const
const pageSizeOptions = [
  { key: 'member-page-size-10', value: 10, label: '10 条', description: '适合逐条核对' },
  { key: 'member-page-size-20', value: 20, label: '20 条', description: '默认查看密度' },
  { key: 'member-page-size-50', value: 50, label: '50 条', description: '适合批量浏览' }
] as const
const selectedMembershipId = ref<number | null>(null)
const selectedMembershipSnapshot = ref<MemberInfo | null>(null)
const drawerOpen = ref(false)
const updatingMembershipId = ref<number | null>(null)

const columns: DataTableColumn[] = [
  {
    key: 'identity',
    label: '成员',
    width: '260px',
    cellClass: 'align-top'
  },
  {
    key: 'role',
    label: '角色',
    width: '120px',
    align: 'center',
    cellClass: 'whitespace-nowrap'
  },
  {
    key: 'status',
    label: '状态',
    width: '120px',
    align: 'center',
    cellClass: 'whitespace-nowrap'
  },
  {
    key: 'position',
    label: '职位',
    width: '160px'
  },
  {
    key: 'joinDate',
    label: '加入时间',
    width: '160px'
  },
  {
    key: 'expectedHours',
    label: '期望时长',
    width: '120px',
    align: 'center'
  }
]

const members = computed(() => membershipsStore.items)
const loading = computed(() => membershipsStore.loading)
const selectedMember = computed(() => {
  if (selectedMembershipId.value === null) {
    return null
  }

  return members.value.find((item) => item.membershipId === selectedMembershipId.value) ?? selectedMembershipSnapshot.value
})
const isUpdatingSelectedMember = computed(() => {
  return selectedMember.value !== null && updatingMembershipId.value === selectedMember.value.membershipId
})
const totalPages = computed(() => Math.max(1, Math.ceil((membershipsStore.total || 0) / pageSize.value)))
const headerMeta = computed(() => [
  { label: '成员总数', value: `${membershipsStore.stats?.totalCount ?? 0}`, detail: '来自成员统计接口' },
  { label: '待审核', value: `${membershipsStore.stats?.pendingCount ?? 0}`, detail: '可直接在本页处理' },
  { label: '正式成员', value: `${membershipsStore.stats?.activeCount ?? 0}`, detail: '当前组织稳定成员' },
  { label: '分页进度', value: `${page.value}/${totalPages.value}`, detail: `每页 ${pageSize.value} 条` }
])
const headerHighlights = computed(() => [
  {
    label: '当前筛选',
    value: optionLabel(statusFilterOptions, statusFilter.value, '全部状态'),
    tone: 'accent'
  },
  {
    label: '角色范围',
    value: optionLabel(roleFilterOptions, roleFilter.value, '全部角色'),
    tone: 'neutral'
  },
  {
    label: '待处理',
    value: `${membershipsStore.stats?.pendingCount ?? 0} 条申请`,
    tone: 'neutral'
  }
])

const syncSelectedMember = () => {
  if (selectedMembershipId.value === null) {
    return
  }

  const refreshedMember = members.value.find((item) => item.membershipId === selectedMembershipId.value)
  if (refreshedMember) {
    selectedMembershipSnapshot.value = refreshedMember
  }
}

const openMemberDrawer = (member: MemberInfo) => {
  selectedMembershipId.value = member.membershipId
  selectedMembershipSnapshot.value = member
  drawerOpen.value = true
}

const closeMemberDrawer = () => {
  drawerOpen.value = false
  selectedMembershipId.value = null
  selectedMembershipSnapshot.value = null
}

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
      page: page.value,
      pageSize: pageSize.value
    })
    syncSelectedMember()
  } catch (error: any) {
    console.error('加载成员失败:', error)
    messageStore.error(error.message || '加载成员失败，请稍后重试')
  }
}

const goToPreviousPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await loadMembers()
}

const goToNextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await loadMembers()
}

const updateSelectedMemberStatus = async (status: MembershipStatus) => {
  const currentMember = selectedMember.value
  if (!currentMember) {
    return
  }

  updatingMembershipId.value = currentMember.membershipId
  const reviewComment = buildReviewComment(status)

  try {
    await membershipsStore.updateStatus({
      membershipId: currentMember.membershipId,
      status,
      reviewComment
    })

    selectedMembershipSnapshot.value = {
      ...currentMember,
      status,
      reviewComment
    }

    messageStore.success('成员状态已更新')
    await loadMembers()
  } catch (error: any) {
    console.error('更新成员状态失败:', error)
    messageStore.error(error.message || '更新成员状态失败，请稍后重试')
  } finally {
    updatingMembershipId.value = null
  }
}

const buildReviewComment = (status: MembershipStatus) => {
  if (status === MembershipStatus.REJECTED) {
    return '组织端驳回'
  }

  if (status === MembershipStatus.LEFT) {
    return '组织端标记退出'
  }

  return '组织端通过'
}

const memberJoinDate = (member: MemberInfo) => {
  return member.joinDate || member.createdAt || '待更新'
}

const statusText = (status: MembershipStatus) => ({
  [MembershipStatus.PENDING]: '待审核',
  [MembershipStatus.ACTIVE]: '正式成员',
  [MembershipStatus.REJECTED]: '已拒绝',
  [MembershipStatus.LEFT]: '已退出'
}[status] || '状态未知')

const statusTone = (status: MembershipStatus) => ({
  [MembershipStatus.PENDING]: 'amber',
  [MembershipStatus.ACTIVE]: 'green',
  [MembershipStatus.REJECTED]: 'rose',
  [MembershipStatus.LEFT]: 'slate'
}[status] || 'slate')

const roleText = (role: MembershipRole) => ({
  [MembershipRole.MEMBER]: '普通成员',
  [MembershipRole.ADMIN]: '管理员',
  [MembershipRole.OWNER]: '负责人'
}[role] || '未分配')

const roleTone = (role: MembershipRole) => ({
  [MembershipRole.MEMBER]: 'slate',
  [MembershipRole.ADMIN]: 'blue',
  [MembershipRole.OWNER]: 'green'
}[role] || 'slate')

const optionLabel = <T,>(
  options: readonly { value: T | undefined, label: string }[],
  value: T | undefined,
  fallback: string
) => {
  return options.find((item) => item.value === value)?.label ?? fallback
}

watch([keyword, statusFilter, roleFilter], () => {
  page.value = 1
  void loadMembers()
})

watch(members, () => {
  syncSelectedMember()
})

onMounted(() => {
  void loadMembers()
})
</script>
