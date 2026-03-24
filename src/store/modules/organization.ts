import { defineStore } from 'pinia'
import { ref } from 'vue'
import { organizationsApi } from '@/api/organizations'
import { getApiMessage, isApiSuccess } from '@/api/types'
import type {
  OrganizationAccountInfo,
  OrganizationCertificationInfo,
  OrganizationInfo,
  OrganizationListRequest,
  UpdateOrganizationAccountRequest,
  UpdateOrganizationRequest
} from '@/types/organization'

export const useOrganizationStore = defineStore('organization', () => {
  const currentOrganization = ref<OrganizationInfo | null>(null)
  const accountInfo = ref<OrganizationAccountInfo | null>(null)
  const organizationCertification = ref<OrganizationCertificationInfo | null>(null)
  const organizations = ref<OrganizationInfo[]>([])
  const total = ref(0)
  const loading = ref(false)
  const activeOrganizationId = ref<number | null>(null)

  const fetchOrganizations = async (params: OrganizationListRequest) => {
    loading.value = true
    try {
      const response = await organizationsApi.list(params)
      if (!isApiSuccess(response.code)) {
        throw new Error(getApiMessage(response) || '获取组织列表失败')
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

  const fetchOrganization = async (id: number) => {
    loading.value = true
    try {
      const response = await organizationsApi.detail(id)
      if (!isApiSuccess(response.code)) {
        throw new Error(getApiMessage(response) || '获取组织信息失败')
      }
      currentOrganization.value = {
        ...response.data.organization,
        ...response.data.organizationProfile,
        organizationCode: response.data.organizationCertification?.organizationCode || response.data.organization.organizationCode
      }
      accountInfo.value = response.data.accountInfo
      organizationCertification.value = response.data.organizationCertification
      activeOrganizationId.value = response.data.organization.id
      return currentOrganization.value
    } finally {
      loading.value = false
    }
  }

  const updateAccount = async (data: UpdateOrganizationAccountRequest) => {
    const response = await organizationsApi.updateAccount(data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '更新账户信息失败')
    }
    if (accountInfo.value) {
      accountInfo.value = { ...accountInfo.value, ...data }
    }
    return response.data
  }

  const updateOrganization = async (id: number, data: UpdateOrganizationRequest) => {
    const response = await organizationsApi.update(id, data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '更新组织信息失败')
    }
    if (currentOrganization.value) {
      currentOrganization.value = { ...currentOrganization.value, ...data }
    }
    if (organizationCertification.value && data.organizationCode) {
      organizationCertification.value = { ...organizationCertification.value, organizationCode: data.organizationCode }
    }
    organizations.value = organizations.value.map((item) => (
      item.id === id
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
    accountInfo,
    organizationCertification,
    organizations,
    total,
    loading,
    activeOrganizationId,
    fetchOrganizations,
    fetchOrganization,
    updateAccount,
    updateOrganization,
    setActiveOrganization
  }
})
