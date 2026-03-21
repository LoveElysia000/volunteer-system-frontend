import { defineStore } from 'pinia'
import { ref } from 'vue'
import { organizationsApi } from '@/api/organizations'
import type {
  OrganizationInfo,
  OrganizationListRequest,
  UpdateOrganizationRequest
} from '@/types/organization'

export const useOrganizationStore = defineStore('organization', () => {
  const currentOrganization = ref<OrganizationInfo | null>(null)
  const organizations = ref<OrganizationInfo[]>([])
  const total = ref(0)
  const loading = ref(false)
  const activeOrganizationId = ref<number | null>(null)

  const fetchOrganizations = async (params: OrganizationListRequest) => {
    loading.value = true
    try {
      const response = await organizationsApi.list(params)
      if (response.code !== 200) {
        throw new Error(response.msg || '获取组织列表失败')
      }
      organizations.value = response.data.list || []
      total.value = response.data.total || 0
      if (!activeOrganizationId.value && organizations.value.length) {
        activeOrganizationId.value = organizations.value[0].id
      }
      return response.data
    } finally {
      loading.value = false
    }
  }

  const fetchOrganization = async (id: number | string) => {
    loading.value = true
    try {
      const response = await organizationsApi.detail(id)
      if (response.code !== 200) {
        throw new Error(response.msg || '获取组织信息失败')
      }
      currentOrganization.value = response.data.organization
      activeOrganizationId.value = response.data.organization.id
      return response.data.organization
    } finally {
      loading.value = false
    }
  }

  const updateOrganization = async (id: number | string, data: UpdateOrganizationRequest) => {
    const response = await organizationsApi.update(id, data)
    if (response.code !== 200) {
      throw new Error(response.msg || '更新组织信息失败')
    }
    if (currentOrganization.value) {
      currentOrganization.value = { ...currentOrganization.value, ...data }
    }
    organizations.value = organizations.value.map((item) => (
      item.id === Number(id)
        ? { ...item, ...data }
        : item
    ))
    return response.data
  }

  const setActiveOrganization = (id: number) => {
    activeOrganizationId.value = id
  }

  return {
    currentOrganization,
    organizations,
    total,
    loading,
    activeOrganizationId,
    fetchOrganizations,
    fetchOrganization,
    updateOrganization,
    setActiveOrganization
  }
})
