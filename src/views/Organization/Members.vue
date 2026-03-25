<template>
  <DataListPage>
    <template #header>
      <OrganizationPageHeader
        eyebrow="成员"
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
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="grid gap-3 lg:grid-cols-2">
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
          </div>
        </template>

        <template #actions>
          <Button
            variant="outline"
            :loading="loading"
            @click="loadMembers"
          >
            刷新成员列表
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

const membershipsStore = useMembershipsStore()
const messageStore = useMessageStore()
const { ensureOrganizationId } = useOrganizationContext()

const keyword = ref('')
const statusFilter = ref<MembershipStatus | undefined>()
const roleFilter = ref<MembershipRole | undefined>()
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
const headerMeta = computed(() => [
  { label: '成员总数', value: `${membershipsStore.stats?.totalCount ?? 0}`, detail: '来自成员统计接口' },
  { label: '待审核', value: `${membershipsStore.stats?.pendingCount ?? 0}`, detail: '可直接在本页处理' },
  { label: '正式成员', value: `${membershipsStore.stats?.activeCount ?? 0}`, detail: '当前组织稳定成员' }
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
      page: 1,
      pageSize: 20
    })
    syncSelectedMember()
  } catch (error: any) {
    console.error('加载成员失败:', error)
    messageStore.error(error.message || '加载成员失败，请稍后重试')
  }
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

watch([keyword, statusFilter, roleFilter], () => {
  void loadMembers()
})

watch(members, () => {
  syncSelectedMember()
})

onMounted(() => {
  void loadMembers()
})
</script>
