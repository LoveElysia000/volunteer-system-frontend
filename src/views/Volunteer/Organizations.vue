<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="组织管理"
      title="连接你参与的环保组织"
      description="在这里集中查看已加入组织、处理加入申请，并快速找到新的长期协作团队。"
      :meta-items="headerMeta"
    />

    <div class="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <div class="space-y-6">
        <VolunteerSectionCard
          title="我的组织概览"
          description="先确认当前组织关系，再决定是否加入新组织或退出现有组织。"
          tone="accent"
        >
          <div class="grid gap-4 md:grid-cols-3">
            <article
              v-for="item in summaryCards"
              :key="item.label"
              class="rounded-[1.35rem] border border-white/15 bg-white/10 px-4 py-4 text-white"
            >
              <p class="text-xs uppercase tracking-[0.2em] text-emerald-100/80">
                {{ item.label }}
              </p>
              <p class="mt-2 text-2xl font-black">
                {{ item.value }}
              </p>
              <p class="mt-1 text-xs text-emerald-100/80">
                {{ item.detail }}
              </p>
            </article>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="我加入的组织"
          description="已加入、待审核、已驳回的组织关系都统一放在这里。"
          tone="soft"
        >
          <div
            v-if="membershipsStore.myOrganizationsLoading"
            class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
          >
            正在加载组织关系...
          </div>

          <div
            v-else-if="!membershipsStore.myOrganizations.length"
            class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
          >
            你暂时还没有加入任何组织，可以直接从右侧发起申请。
          </div>

          <div
            v-else
            class="space-y-3"
          >
            <article
              v-for="item in membershipsStore.myOrganizations"
              :key="item.membershipId"
              class="volunteer-surface-lift rounded-[1.35rem] border border-white/80 bg-white/90 px-4 py-4"
            >
              <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-base font-bold text-slate-900">
                      {{ item.organizationName }}
                    </h3>
                    <VolunteerStatusBadge
                      :label="membershipStatusText(item.status)"
                      :tone="membershipStatusTone(item.status)"
                    />
                  </div>
                  <p class="text-sm text-slate-500">
                    组织编码：{{ item.organizationCode || '待补充' }}
                  </p>
                  <p class="text-sm text-slate-500">
                    当前角色：{{ membershipRoleText(item.role) }}
                  </p>
                  <p class="text-sm text-slate-500">
                    加入时间：{{ item.joinDate || item.createdAt || '待同步' }}
                  </p>
                  <p
                    v-if="item.reviewComment"
                    class="text-sm text-slate-500"
                  >
                    审核备注：{{ item.reviewComment }}
                  </p>
                </div>

                <button
                  class="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="organizationActionLoading || Number(item.status) !== MembershipStatus.ACTIVE"
                  @click="leaveOrganization(item.membershipId)"
                >
                  {{ Number(item.status) === MembershipStatus.ACTIVE ? '退出组织' : '当前不可退出' }}
                </button>
              </div>
            </article>
          </div>
        </VolunteerSectionCard>
      </div>

      <div class="space-y-6">
        <VolunteerSectionCard
          title="查找组织"
          description="通过关键词筛选活跃组织，找到适合你长期参与的协作方向。"
        >
          <div class="space-y-5">
            <div class="flex flex-col gap-3 md:flex-row">
              <div class="relative flex-1">
                <SearchIcon class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索组织名称、地区或组织类型"
                  class="input h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 shadow-none"
                  @keyup.enter="loadOrganizations"
                >
              </div>
              <button
                class="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                :disabled="organizationsLoading"
                @click="loadOrganizations"
              >
                {{ organizationsLoading ? '搜索中...' : '搜索组织' }}
              </button>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <div
                v-for="metric in discoveryMetrics"
                :key="metric.label"
                class="rounded-[1.25rem] border border-slate-100 bg-slate-50/85 px-4 py-4"
              >
                <p class="text-sm font-semibold text-slate-500">
                  {{ metric.label }}
                </p>
                <p class="mt-2 text-2xl font-black text-slate-900">
                  {{ metric.value }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ metric.detail }}
                </p>
              </div>
            </div>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="可加入组织"
          description="已加入或待审核的组织会直接标记，避免重复申请。"
          tone="soft"
        >
          <div
            v-if="organizationsLoading"
            class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
          >
            正在加载组织列表...
          </div>

          <div
            v-else-if="!organizations.length"
            class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
          >
            没有找到匹配的组织，换个关键词再试试。
          </div>

          <div
            v-else
            class="space-y-4"
          >
            <article
              v-for="organization in organizations"
              :key="organization.id"
              class="volunteer-surface-lift rounded-[1.4rem] border border-white/80 bg-white/92 px-5 py-5"
            >
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0 flex-1 space-y-3">
                  <div class="flex flex-wrap items-center gap-3">
                    <h3 class="text-lg font-bold tracking-tight text-slate-900">
                      {{ organization.name }}
                    </h3>
                    <VolunteerStatusBadge
                      :label="organization.status === OrganizationStatus.ACTIVE ? '活跃组织' : '已停用'"
                      :tone="organization.status === OrganizationStatus.ACTIVE ? 'green' : 'slate'"
                    />
                    <VolunteerStatusBadge
                      v-if="getMembershipByOrganizationId(organization.id)"
                      :label="membershipStatusText(getMembershipByOrganizationId(organization.id)?.status)"
                      :tone="membershipStatusTone(getMembershipByOrganizationId(organization.id)?.status)"
                    />
                  </div>

                  <div class="grid gap-2 text-sm text-slate-500 md:grid-cols-2">
                    <p>组织编码：{{ organization.organizationCode || '待补充' }}</p>
                    <p>组织类型：{{ organization.organizationType || '待补充' }}</p>
                    <p>所在地区：{{ organization.region || '待补充' }}</p>
                    <p>联系人：{{ organization.contactPerson || organization.contactPhone || '待补充' }}</p>
                  </div>

                  <p class="text-sm leading-6 text-slate-600">
                    {{ organization.description || '当前暂无组织简介，建议先加入后通过活动记录进一步了解团队协作方向。' }}
                  </p>
                </div>

                <div class="flex shrink-0 flex-col gap-2">
                  <button
                    v-if="canJoinOrganization(organization.id)"
                    class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                    :disabled="organizationActionLoading"
                    @click="joinOrganization(organization.id)"
                  >
                    申请加入
                  </button>
                  <button
                    v-else-if="canLeaveOrganization(organization.id)"
                    class="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="organizationActionLoading"
                    @click="leaveOrganization(getMembershipByOrganizationId(organization.id)?.membershipId)"
                  >
                    退出组织
                  </button>
                  <div
                    v-else
                    class="rounded-full bg-slate-100 px-4 py-2 text-center text-sm font-semibold text-slate-500"
                  >
                    {{ actionLabel(organization.id) }}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </VolunteerSectionCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SearchIcon } from 'lucide-vue-next'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import { organizationsApi } from '@/api/organizations'
import { getApiMessage, isApiSuccess } from '@/api/types'
import { useAuthStore } from '@/store/modules/auth'
import { useMembershipsStore } from '@/store/modules/memberships'
import { useMessageStore } from '@/store/modules/messages'
import { useVolunteerStore } from '@/store/modules/volunteer'
import { MembershipRole, MembershipStatus, type OrganizationMemberInfo } from '@/types/membership'
import { OrganizationStatus, type OrganizationInfo } from '@/types/organization'

defineOptions({
  name: 'VolunteerOrganizations'
})

const authStore = useAuthStore()
const volunteerStore = useVolunteerStore()
const membershipsStore = useMembershipsStore()
const messageStore = useMessageStore()

const searchQuery = ref('')
const organizations = ref<OrganizationInfo[]>([])
const organizationsTotal = ref(0)
const organizationsLoading = ref(false)
const organizationActionLoading = ref(false)

const volunteerId = computed(() => volunteerStore.profile?.id || null)

const membershipByOrganizationId = computed<Record<number, OrganizationMemberInfo>>(() => (
  membershipsStore.myOrganizations.reduce<Record<number, OrganizationMemberInfo>>((acc, item) => {
    acc[Number(item.organizationId)] = item
    return acc
  }, {})
))

const normalizeNumber = (value: string | number | null | undefined) => {
  const normalized = Number(value)
  return Number.isFinite(normalized) ? normalized : NaN
}

const getMembershipByOrganizationId = (organizationId: string | number) => {
  const normalizedId = normalizeNumber(organizationId)
  if (!Number.isFinite(normalizedId)) return undefined
  return membershipByOrganizationId.value[normalizedId]
}

const activeMembershipCount = computed(() => (
  membershipsStore.myOrganizations.filter(item => normalizeNumber(item.status) === MembershipStatus.ACTIVE).length
))

const pendingMembershipCount = computed(() => (
  membershipsStore.myOrganizations.filter(item => normalizeNumber(item.status) === MembershipStatus.PENDING).length
))

const headerMeta = computed(() => [
  { label: '已加入组织', value: `${activeMembershipCount.value} 个`, detail: '活跃协作关系' },
  { label: '待审核申请', value: `${pendingMembershipCount.value} 个`, detail: '等待组织侧处理' }
])

const summaryCards = computed(() => [
  { label: '组织关系总数', value: `${membershipsStore.myOrganizationsTotal}`, detail: '含待审核与历史状态' },
  { label: '当前已加入', value: `${activeMembershipCount.value}`, detail: '可直接参与组织协作' },
  { label: '待审核申请', value: `${pendingMembershipCount.value}`, detail: '通过后会自动转为已加入' }
])

const discoveryMetrics = computed(() => [
  { label: '搜索结果', value: `${organizations.value.length}`, detail: '当前页组织卡片数' },
  { label: '接口总量', value: `${organizationsTotal.value}`, detail: '组织列表接口返回总数' },
  { label: '可直接申请', value: `${organizations.value.filter(item => canJoinOrganization(item.id)).length}`, detail: '尚未建立关系的组织' }
])

const membershipStatusText = (status: string | number | null | undefined) => ({
  [MembershipStatus.PENDING]: '待审核',
  [MembershipStatus.ACTIVE]: '已加入',
  [MembershipStatus.REJECTED]: '已驳回',
  [MembershipStatus.LEFT]: '已退出'
}[normalizeNumber(status)] || '未知状态')

const membershipStatusTone = (status: string | number | null | undefined) => ({
  [MembershipStatus.PENDING]: 'amber',
  [MembershipStatus.ACTIVE]: 'green',
  [MembershipStatus.REJECTED]: 'rose',
  [MembershipStatus.LEFT]: 'slate'
}[normalizeNumber(status)] || 'slate') as 'green' | 'amber' | 'rose' | 'slate'

const membershipRoleText = (role: string | number | null | undefined) => ({
  [MembershipRole.MEMBER]: '普通成员',
  [MembershipRole.ADMIN]: '管理员',
  [MembershipRole.OWNER]: '负责人'
}[normalizeNumber(role)] || '未分配')

const canJoinOrganization = (organizationId: string | number) => {
  const membership = getMembershipByOrganizationId(organizationId)
  const status = normalizeNumber(membership?.status)
  return !membership || status === MembershipStatus.LEFT || status === MembershipStatus.REJECTED
}

const canLeaveOrganization = (organizationId: string | number) => {
  const membership = getMembershipByOrganizationId(organizationId)
  return normalizeNumber(membership?.status) === MembershipStatus.ACTIVE
}

const actionLabel = (organizationId: string | number) => {
  const membership = getMembershipByOrganizationId(organizationId)
  if (!membership) return '不可操作'
  return membershipStatusText(membership.status)
}

const loadOrganizations = async () => {
  organizationsLoading.value = true
  try {
    const keyword = searchQuery.value.trim()
    const response = keyword
      ? await organizationsApi.search({
        keyword,
        status: [OrganizationStatus.ACTIVE],
        page: 1,
        pageSize: 24
      })
      : await organizationsApi.list({
        status: [OrganizationStatus.ACTIVE],
        page: 1,
        pageSize: 24
      })

    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '加载组织列表失败')
    }

    organizations.value = response.data.list || []
    organizationsTotal.value = response.data.total || 0
  } catch (error: any) {
    console.error('加载组织列表失败:', error)
    messageStore.error(error.message || '加载组织列表失败，请稍后重试')
  } finally {
    organizationsLoading.value = false
  }
}

const refreshMemberships = async () => {
  if (!volunteerId.value) return
  await membershipsStore.fetchMyOrganizations(volunteerId.value)
}

const joinOrganization = async (organizationId: string | number) => {
  const normalizedOrganizationId = normalizeNumber(organizationId)
  if (!volunteerId.value) {
    messageStore.error('当前账号缺少志愿者标识')
    return
  }
  if (!Number.isInteger(normalizedOrganizationId) || normalizedOrganizationId <= 0) {
    messageStore.error('组织 ID 无效，暂时无法加入')
    return
  }

  organizationActionLoading.value = true
  try {
    const response = await membershipsStore.joinOrganization(volunteerId.value, normalizedOrganizationId)
    messageStore.success(response.message || '加入申请已提交')
    await Promise.all([
      refreshMemberships(),
      loadOrganizations()
    ])
  } catch (error: any) {
    console.error('申请加入组织失败:', error)
    messageStore.error(error.message || '申请加入组织失败，请稍后重试')
  } finally {
    organizationActionLoading.value = false
  }
}

const leaveOrganization = async (membershipId: string | number | null | undefined) => {
  const normalizedMembershipId = normalizeNumber(membershipId)
  if (!volunteerId.value) {
    messageStore.error('当前账号缺少志愿者标识')
    return
  }
  if (!Number.isInteger(normalizedMembershipId) || normalizedMembershipId <= 0) {
    messageStore.error('组织关系标识无效，暂时无法退出')
    return
  }

  organizationActionLoading.value = true
  try {
    const response = await membershipsStore.leaveOrganization(volunteerId.value, normalizedMembershipId, '志愿者主动退出')
    messageStore.success(response.message || '已退出组织')
    await Promise.all([
      refreshMemberships(),
      loadOrganizations()
    ])
  } catch (error: any) {
    console.error('退出组织失败:', error)
    messageStore.error(error.message || '退出组织失败，请稍后重试')
  } finally {
    organizationActionLoading.value = false
  }
}

onMounted(async () => {
  let profileReady = false

  try {
    const authUserId = normalizeNumber(authStore.user?.id)
    if (Number.isInteger(authUserId) && authUserId > 0 && !volunteerStore.profile) {
      await volunteerStore.fetchMyProfile(authUserId)
    }
    profileReady = true
  } catch (error) {
    console.error('加载志愿者资料失败:', error)
    messageStore.error('加载志愿者资料失败，暂时无法读取我的组织关系')
  }

  try {
    await loadOrganizations()
  } catch (error) {
    console.error('加载组织列表失败:', error)
  }

  if (!profileReady && !volunteerStore.profile) return

  try {
    await refreshMemberships()
  } catch (error) {
    console.error('加载组织关系失败:', error)
    messageStore.error('加载组织关系失败，请稍后重试')
  }
})
</script>
