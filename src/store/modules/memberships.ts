import { defineStore } from 'pinia'
import { ref } from 'vue'
import { membershipsApi } from '@/api/memberships'
import type {
  MemberInfo,
  MembershipStatsData,
  OrganizationMembersParams,
  OrganizationMemberInfo,
  UpdateMembershipStatusRequest
} from '@/types/membership'

export const useMembershipsStore = defineStore('memberships', () => {
  const items = ref<MemberInfo[]>([])
  const myOrganizations = ref<OrganizationMemberInfo[]>([])
  const myOrganizationsTotal = ref(0)
  const total = ref(0)
  const stats = ref<MembershipStatsData | null>(null)
  const loading = ref(false)
  const myOrganizationsLoading = ref(false)

  const fetchMembers = async (params: OrganizationMembersParams) => {
    loading.value = true
    try {
      const [membersResponse, statsResponse] = await Promise.all([
        membershipsApi.getOrganizationMembers(params),
        membershipsApi.getMembershipStats({ organizationId: params.organizationId })
      ])

      if (membersResponse.code !== 200) {
        throw new Error(membersResponse.msg || '获取成员列表失败')
      }
      if (statsResponse.code !== 200) {
        throw new Error(statsResponse.msg || '获取成员统计失败')
      }

      items.value = membersResponse.data.list || []
      total.value = membersResponse.data.total || 0
      stats.value = statsResponse.data
      return membersResponse.data
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (data: UpdateMembershipStatusRequest) => {
    const response = await membershipsApi.updateMembershipStatus(data)
    if (response.code !== 200) {
      throw new Error(response.msg || '更新成员状态失败')
    }
    items.value = items.value.map((item) => (
      item.membershipId === data.membershipId
        ? { ...item, status: data.status, reviewComment: data.reviewComment || item.reviewComment }
        : item
    ))
    return response.data
  }

  const fetchMyOrganizations = async (volunteerId: number) => {
    myOrganizationsLoading.value = true
    try {
      const response = await membershipsApi.getVolunteerOrganizations({
        volunteerId,
        page: 1,
        pageSize: 20
      })
      if (response.code !== 200) {
        throw new Error(response.msg || '获取已加入组织失败')
      }
      myOrganizations.value = response.data.list || []
      myOrganizationsTotal.value = response.data.total || 0
      return response.data
    } finally {
      myOrganizationsLoading.value = false
    }
  }

  const joinOrganization = async (volunteerId: number, organizationId: number) => {
    const response = await membershipsApi.join({ volunteerId, organizationId })
    if (response.code !== 200) {
      throw new Error(response.msg || '申请加入组织失败')
    }
    await fetchMyOrganizations(volunteerId)
    return response.data
  }

  const leaveOrganization = async (volunteerId: number, membershipId: number, reason?: string) => {
    const response = await membershipsApi.leave({ membershipId, reason })
    if (response.code !== 200) {
      throw new Error(response.msg || '退出组织失败')
    }
    await fetchMyOrganizations(volunteerId)
    return response.data
  }

  return {
    items,
    myOrganizations,
    myOrganizationsTotal,
    total,
    stats,
    loading,
    myOrganizationsLoading,
    fetchMembers,
    updateStatus
,
    fetchMyOrganizations,
    joinOrganization,
    leaveOrganization
  }
})
