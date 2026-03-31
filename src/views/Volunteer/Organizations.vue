<template>
  <WorkbenchPage>
    <VolunteerPageHeader
      eyebrow="组织管理"
      title="连接你参与的环保组织"
      description="在这里集中查看已加入组织、处理加入申请，并快速找到新的长期协作团队。"
      :meta-items="headerMeta"
      layout="operations"
    >
      <template #summary>
        <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
          关系状态 / {{ membershipFilterSummary }}
        </span>
        <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
          查找关键词 / {{ organizationKeywordSummary }}
        </span>
        <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
          组织范围 / {{ organizationRegionSummary }}
        </span>
      </template>
      <template #actions>
        <div class="grid w-full gap-3 2xl:grid-cols-[minmax(0,1fr)_auto_auto]">
          <Input
            v-model="searchQuery"
            placeholder="搜索组织名称、地区或类型"
            :icon="SearchIcon"
            allow-clear
            theme="emerald"
            @keyup.enter="reloadOrganizationsFromFirstPage"
          />
          <button
            class="volunteer-toolbar-button volunteer-toolbar-button--ghost min-h-[48px] w-full 2xl:w-auto"
            :disabled="organizationsLoading"
            @click="refreshMemberships"
          >
            刷新关系
          </button>
          <button
            class="volunteer-toolbar-button volunteer-toolbar-button--soft min-h-[48px] w-full 2xl:w-auto"
            :disabled="organizationsLoading"
            @click="reloadOrganizationsFromFirstPage"
          >
            {{ organizationsLoading ? '搜索中...' : '查找组织' }}
          </button>
        </div>
      </template>
    </VolunteerPageHeader>

    <WorkbenchSplitLayout variant="studio">
      <template #main>
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
            <div class="mb-4 grid gap-3 md:grid-cols-3">
              <FilterSelect
                v-model="membershipStatusFilter"
                title="关系状态"
                :options="membershipStatusOptions"
                theme="emerald"
              />
              <FilterSelect
                v-model="membershipsPageSize"
                title="每页条数"
                :options="membershipsPageSizeOptions"
                theme="emerald"
              />
              <div class="flex items-center justify-end gap-2 text-sm text-slate-500">
                <span>第 {{ membershipsPage }} / {{ membershipsTotalPages }} 页</span>
              </div>
            </div>

            <WorkbenchEmptyPanel v-if="membershipsStore.myOrganizationsLoading">
              正在加载组织关系...
            </WorkbenchEmptyPanel>

            <WorkbenchEmptyPanel v-else-if="!membershipsStore.myOrganizations.length">
              你暂时还没有加入任何组织，可以直接从右侧发起申请。
            </WorkbenchEmptyPanel>

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

              <div class="flex justify-end gap-2">
                <button
                  class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="membershipsStore.myOrganizationsLoading || membershipsPage <= 1"
                  @click="goToPreviousMembershipsPage"
                >
                  上一页
                </button>
                <button
                  class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="membershipsStore.myOrganizationsLoading || membershipsPage >= membershipsTotalPages"
                  @click="goToNextMembershipsPage"
                >
                  下一页
                </button>
              </div>
            </div>
          </VolunteerSectionCard>
        </div>
      </template>

      <template #aside>
        <div class="space-y-6">
          <VolunteerSectionCard
            title="查找组织"
            description="通过关键词筛选活跃组织，找到适合你长期参与的协作方向。"
          >
            <div class="space-y-5">
              <div class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                <Input
                  v-model="organizationTypeFilter"
                  placeholder="组织类型"
                  theme="emerald"
                  @keyup.enter="loadOrganizations"
                />
                <Input
                  v-model="regionFilter"
                  placeholder="地区"
                  theme="emerald"
                  @keyup.enter="loadOrganizations"
                />
                <FilterSelect
                  v-model="organizationsPageSize"
                  title="每页条数"
                  :options="organizationsPageSizeOptions"
                  theme="emerald"
                />
              </div>
              <div class="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                <button
                  class="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  :disabled="organizationsLoading"
                  @click="reloadOrganizationsFromFirstPage"
                >
                  {{ organizationsLoading ? '搜索中...' : '搜索组织' }}
                </button>
                <div class="flex items-center gap-2 text-sm text-slate-500">
                  <span>第 {{ organizationsPage }} / {{ organizationsTotalPages }} 页</span>
                  <button
                    class="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="organizationsLoading || organizationsPage <= 1"
                    @click="goToPreviousOrganizationsPage"
                  >
                    上一页
                  </button>
                  <button
                    class="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="organizationsLoading || organizationsPage >= organizationsTotalPages"
                    @click="goToNextOrganizationsPage"
                  >
                    下一页
                  </button>
                </div>
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
            <WorkbenchEmptyPanel v-if="organizationsLoading">
              正在加载组织列表...
            </WorkbenchEmptyPanel>

            <WorkbenchEmptyPanel v-else-if="!organizations.length">
              没有找到匹配的组织，换个关键词再试试。
            </WorkbenchEmptyPanel>

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
                      <p>联系人：{{ organization.contactPerson || '暂不公开' }}</p>
                    </div>

                    <p class="text-sm leading-6 text-slate-600">
                      {{ organization.description || '当前暂无组织简介，建议先加入后通过活动记录进一步了解团队协作方向。' }}
                    </p>
                  </div>

                <div class="flex shrink-0 flex-col gap-2">
                  <button
                    class="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="detailLoading && selectedOrganizationId === normalizeNumber(organization.id)"
                    @click="selectOrganization(organization.id)"
                  >
                    {{ selectedOrganizationId === normalizeNumber(organization.id) && drawerOpen ? (detailLoading ? '加载详情中...' : '查看中') : '查看详情' }}
                  </button>
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
      </template>
    </WorkbenchSplitLayout>

    <DetailDrawer
      v-model="drawerOpen"
      width="560px"
      :aria-label="detailOrganization?.name ? `${detailOrganization.name} 的组织详情` : '组织详情'"
      @close="closeOrganizationDrawer"
    >
      <template #header>
        <div
          v-if="selectedOrganizationId"
          class="space-y-3"
        >
          <div class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              组织详情
            </p>
            <h2 class="text-lg font-bold tracking-tight text-slate-900">
              {{ detailOrganization?.name || selectedOrganizationSummary?.name || '组织详情' }}
            </h2>
            <p class="text-sm text-slate-500">
              组织编码：{{ detailOrganization?.organizationCode || detailCertification?.organizationCode || '待补充' }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <VolunteerStatusBadge
              :label="detailOrganization?.status === OrganizationStatus.ACTIVE ? '活跃组织' : '已停用'"
              :tone="detailOrganization?.status === OrganizationStatus.ACTIVE ? 'green' : 'slate'"
            />
            <VolunteerStatusBadge
              v-if="selectedOrganizationMembership"
              :label="membershipStatusText(selectedOrganizationMembership.status)"
              :tone="membershipStatusTone(selectedOrganizationMembership.status)"
            />
          </div>
        </div>
      </template>

      <WorkbenchEmptyPanel v-if="detailLoading">
        正在加载组织详情...
      </WorkbenchEmptyPanel>

      <WorkbenchEmptyPanel v-else-if="detailErrorMessage">
        {{ detailErrorMessage }}
      </WorkbenchEmptyPanel>

      <WorkbenchEmptyPanel v-else-if="!selectedOrganizationId">
        点击组织卡片的“查看详情”后，这里会展示公开组织资料。
      </WorkbenchEmptyPanel>

      <div
        v-else
        class="space-y-4"
      >
        <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                组织类型
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ detailOrganization?.organizationType || '待补充' }}
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                所在地区
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ detailOrganization?.region || '待补充' }}
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                联系人
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ detailProfile?.contactPerson || detailOrganization?.contactPerson || selectedOrganizationSummary?.contactPerson || '暂不公开' }}
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                联系电话
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ detailProfile?.contactPhone || detailOrganization?.contactPhone || '暂不公开' }}
              </p>
            </div>
          </div>
        </section>

        <section class="space-y-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              组织简介
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ detailProfile?.description || detailOrganization?.description || '当前暂无公开简介，可以先查看近期活动与组织资料后再决定是否加入。' }}
            </p>
          </div>
        </section>

        <div class="grid gap-4 md:grid-cols-2">
          <article class="rounded-[1.25rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              联系信息
            </p>
            <div class="mt-3 space-y-2 text-sm text-slate-600">
              <p>联系地址：{{ detailProfile?.address || detailOrganization?.address || '待补充' }}</p>
              <p>官网地址：{{ detailOrganization?.websiteUrl || '暂未公开' }}</p>
            </div>
          </article>

          <article class="rounded-[1.25rem] border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              公开资料
            </p>
            <div class="mt-3 space-y-2 text-sm text-slate-600">
              <p>资质编码：{{ detailCertification?.organizationCode || detailOrganization?.organizationCode || '待补充' }}</p>
              <p>创建时间：{{ detailOrganization?.createdAt || '待同步' }}</p>
              <p>最近更新：{{ detailOrganization?.updatedAt || '待同步' }}</p>
            </div>
          </article>
        </div>

        <article
          v-if="detailProfile?.logoUrl || detailOrganization?.logoUrl"
          class="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white"
        >
          <img
            :src="detailProfile?.logoUrl || detailOrganization?.logoUrl"
            :alt="`${detailOrganization?.name || selectedOrganizationSummary?.name || '组织'}标识`"
            class="h-48 w-full object-contain bg-slate-50 p-6"
          >
        </article>
      </div>

      <template #footer>
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            v-if="selectedOrganizationSummary && canJoinOrganization(selectedOrganizationSummary.id)"
            class="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            :disabled="organizationActionLoading"
            @click="joinOrganization(selectedOrganizationSummary.id)"
          >
            申请加入
          </button>
          <button
            v-else-if="selectedOrganizationMembership"
            class="rounded-full border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="organizationActionLoading || normalizeNumber(selectedOrganizationMembership.status) !== MembershipStatus.ACTIVE"
            @click="leaveOrganization(selectedOrganizationMembership.membershipId)"
          >
            {{ normalizeNumber(selectedOrganizationMembership.status) === MembershipStatus.ACTIVE ? '退出组织' : membershipStatusText(selectedOrganizationMembership.status) }}
          </button>
        </div>
      </template>
    </DetailDrawer>
  </WorkbenchPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { SearchIcon } from 'lucide-vue-next'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import Input from '@/components/ui/Input.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import WorkbenchEmptyPanel from '@/components/workbench/WorkbenchEmptyPanel.vue'
import WorkbenchPage from '@/components/workbench/WorkbenchPage.vue'
import WorkbenchSplitLayout from '@/components/workbench/WorkbenchSplitLayout.vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import { organizationsApi } from '@/api/organizations'
import { getApiMessage, isApiSuccess } from '@/api/types'
import { useMembershipsStore } from '@/store/modules/memberships'
import { useMessageStore } from '@/store/modules/messages'
import { useVolunteerStore } from '@/store/modules/volunteer'
import { MembershipRole, MembershipStatus, type OrganizationMemberInfo } from '@/types/membership'
import { OrganizationStatus, type OrganizationInfo, type PublicOrganizationDetailData } from '@/types/organization'

defineOptions({
  name: 'VolunteerOrganizations'
})

const volunteerStore = useVolunteerStore()
const membershipsStore = useMembershipsStore()
const messageStore = useMessageStore()

const searchQuery = ref('')
const organizationTypeFilter = ref('')
const regionFilter = ref('')
const organizations = ref<OrganizationInfo[]>([])
const organizationsTotal = ref(0)
const organizationsLoading = ref(false)
const organizationActionLoading = ref(false)
const drawerOpen = ref(false)
const selectedOrganizationId = ref<number | null>(null)
const selectedOrganizationDetail = ref<PublicOrganizationDetailData | null>(null)
const detailLoading = ref(false)
const detailErrorMessage = ref('')
const detailRequestToken = ref(0)
const organizationsPage = ref(1)
const organizationsPageSize = ref(24)
const membershipsPage = ref(1)
const membershipsPageSize = ref(20)
const membershipStatusFilter = ref(0)
const membershipStatusOptions = [
  { key: 'membership-status-all', value: 0, label: '全部关系状态', description: '查看全部组织关系' },
  { key: 'membership-status-pending', value: MembershipStatus.PENDING, label: '待审核', description: '等待组织侧处理' },
  { key: 'membership-status-active', value: MembershipStatus.ACTIVE, label: '已加入', description: '当前可参与协作' },
  { key: 'membership-status-rejected', value: MembershipStatus.REJECTED, label: '已驳回', description: '可重新选择组织' },
  { key: 'membership-status-left', value: MembershipStatus.LEFT, label: '已退出', description: '历史协作关系' }
] as const
const membershipsPageSizeOptions = [
  { key: 'membership-page-10', value: 10, label: '每页 10 条', description: '紧凑列表' },
  { key: 'membership-page-20', value: 20, label: '每页 20 条', description: '默认密度' },
  { key: 'membership-page-50', value: 50, label: '每页 50 条', description: '适合集中查看' }
] as const
const organizationsPageSizeOptions = [
  { key: 'organization-page-12', value: 12, label: '每页 12 条', description: '适合卡片浏览' },
  { key: 'organization-page-24', value: 24, label: '每页 24 条', description: '默认密度' },
  { key: 'organization-page-48', value: 48, label: '每页 48 条', description: '适合批量筛选' }
] as const

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
  { label: '待审核申请', value: `${pendingMembershipCount.value} 个`, detail: '等待组织侧处理' },
  { label: '公开组织', value: `${organizationsTotal.value} 个`, detail: '当前筛选条件下的公开组织总量' }
])

const membershipFilterSummary = computed(() => (
  membershipStatusOptions.find((option) => option.value === membershipStatusFilter.value)?.label || '全部关系状态'
))

const organizationKeywordSummary = computed(() => (
  searchQuery.value.trim() ? `“${searchQuery.value.trim()}”` : '未设置'
))

const organizationRegionSummary = computed(() => {
  if (organizationTypeFilter.value.trim() && regionFilter.value.trim()) {
    return `${organizationTypeFilter.value.trim()} / ${regionFilter.value.trim()}`
  }
  if (regionFilter.value.trim()) return regionFilter.value.trim()
  if (organizationTypeFilter.value.trim()) return organizationTypeFilter.value.trim()
  return '全部公开组织'
})

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
const organizationsTotalPages = computed(() => Math.max(1, Math.ceil(organizationsTotal.value / organizationsPageSize.value)))
const membershipsTotalPages = computed(() => Math.max(1, Math.ceil(membershipsStore.myOrganizationsTotal / membershipsPageSize.value)))
const selectedOrganizationSummary = computed(() => {
  if (selectedOrganizationId.value == null) return null
  return organizations.value.find(item => normalizeNumber(item.id) === selectedOrganizationId.value) || null
})
const selectedOrganizationMembership = computed(() => (
  selectedOrganizationId.value == null ? undefined : getMembershipByOrganizationId(selectedOrganizationId.value)
))
const detailOrganization = computed(() => (
  selectedOrganizationDetail.value?.organization || selectedOrganizationSummary.value || null
))
const detailProfile = computed(() => (
  selectedOrganizationDetail.value?.organizationProfile || null
))
const detailCertification = computed(() => (
  selectedOrganizationDetail.value?.organizationCertification || null
))

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

const loadOrganizationDetail = async (organizationId: number) => {
  const requestToken = detailRequestToken.value + 1
  detailRequestToken.value = requestToken
  detailLoading.value = true
  detailErrorMessage.value = ''
  try {
    const response = await organizationsApi.publicDetail(organizationId)

    if (requestToken !== detailRequestToken.value || selectedOrganizationId.value !== organizationId) {
      return
    }

    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '加载组织详情失败')
    }

    selectedOrganizationDetail.value = response.data
  } catch (error: any) {
    if (requestToken !== detailRequestToken.value || selectedOrganizationId.value !== organizationId) {
      return
    }

    console.error('加载组织详情失败:', error)
    selectedOrganizationDetail.value = null
    detailErrorMessage.value = error.message || '加载组织详情失败，请稍后重试'
  } finally {
    if (requestToken === detailRequestToken.value && selectedOrganizationId.value === organizationId) {
      detailLoading.value = false
    }
  }
}

const selectOrganization = async (organizationId: string | number) => {
  const normalizedOrganizationId = normalizeNumber(organizationId)
  if (!Number.isInteger(normalizedOrganizationId) || normalizedOrganizationId <= 0) {
    messageStore.error('组织 ID 无效，暂时无法查看详情')
    return
  }

  selectedOrganizationId.value = normalizedOrganizationId
  selectedOrganizationDetail.value = null
  drawerOpen.value = true
  await loadOrganizationDetail(normalizedOrganizationId)
}

const closeOrganizationDrawer = () => {
  drawerOpen.value = false
}

const loadOrganizations = async () => {
  organizationsLoading.value = true
  try {
    const keyword = searchQuery.value.trim()
    const response = await organizationsApi.publicList({
      keyword: keyword || undefined,
      organizationType: organizationTypeFilter.value || undefined,
      region: regionFilter.value || undefined,
      page: organizationsPage.value,
      pageSize: organizationsPageSize.value
    })

    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '加载组织列表失败')
    }

    organizations.value = response.data.list || []
    organizationsTotal.value = response.data.total || 0

    if (!organizations.value.some(item => normalizeNumber(item.id) === selectedOrganizationId.value)) {
      drawerOpen.value = false
      selectedOrganizationId.value = null
      selectedOrganizationDetail.value = null
      detailErrorMessage.value = ''
    }
  } catch (error: any) {
    console.error('加载组织列表失败:', error)
    messageStore.error(error.message || '加载组织列表失败，请稍后重试')
  } finally {
    organizationsLoading.value = false
  }
}

const refreshMemberships = async () => {
  await membershipsStore.fetchMyOrganizations({
    status: membershipStatusFilter.value || undefined,
    page: membershipsPage.value,
    pageSize: membershipsPageSize.value
  })
}

const reloadOrganizationsFromFirstPage = async () => {
  organizationsPage.value = 1
  await loadOrganizations()
}

const goToPreviousOrganizationsPage = async () => {
  if (organizationsPage.value <= 1) return
  organizationsPage.value -= 1
  await loadOrganizations()
}

const goToNextOrganizationsPage = async () => {
  if (organizationsPage.value >= organizationsTotalPages.value) return
  organizationsPage.value += 1
  await loadOrganizations()
}

const goToPreviousMembershipsPage = async () => {
  if (membershipsPage.value <= 1) return
  membershipsPage.value -= 1
  await refreshMemberships()
}

const goToNextMembershipsPage = async () => {
  if (membershipsPage.value >= membershipsTotalPages.value) return
  membershipsPage.value += 1
  await refreshMemberships()
}

const joinOrganization = async (organizationId: string | number) => {
  const normalizedOrganizationId = normalizeNumber(organizationId)
  if (!Number.isInteger(normalizedOrganizationId) || normalizedOrganizationId <= 0) {
    messageStore.error('组织 ID 无效，暂时无法加入')
    return
  }

  organizationActionLoading.value = true
  try {
    const response = await membershipsStore.joinOrganization(normalizedOrganizationId)
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
  if (!Number.isInteger(normalizedMembershipId) || normalizedMembershipId <= 0) {
    messageStore.error('组织关系标识无效，暂时无法退出')
    return
  }

  organizationActionLoading.value = true
  try {
    const response = await membershipsStore.leaveOrganization(normalizedMembershipId, '志愿者主动退出')
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
  try {
    if (!volunteerStore.profile) {
      await volunteerStore.fetchMyProfile()
    }
  } catch (error) {
    console.error('加载志愿者资料失败:', error)
  }

  try {
    await loadOrganizations()
  } catch (error) {
    console.error('加载组织列表失败:', error)
  }

  try {
    await refreshMemberships()
  } catch (error) {
    console.error('加载组织关系失败:', error)
    messageStore.error('加载组织关系失败，请稍后重试')
  }
})

watch([searchQuery, organizationTypeFilter, regionFilter, organizationsPageSize], () => {
  organizationsPage.value = 1
  void loadOrganizations()
})

watch([membershipStatusFilter, membershipsPageSize], () => {
  membershipsPage.value = 1
  void refreshMemberships()
})
</script>
