import { defineStore } from 'pinia'
import { ref } from 'vue'
import { organizationsApi } from '@/api/organizations'
import { getApiMessage, isApiSuccess } from '@/api/types'
import type {
  CreateOrganizationRequest,
  OrganizationActionRequest,
  OrganizationBatchActionRequest,
  OrganizationBulkDeleteRequest,
  OrganizationAccountInfo,
  OrganizationCertificationInfo,
  OrganizationInfo,
  OrganizationListRequest,
  OrganizationSearchRequest,
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

  const fetchOrganizations = async (params: OrganizationListRequest | OrganizationSearchRequest) => {
    loading.value = true
    try {
      const response = (params.startDate || params.endDate)
        ? await organizationsApi.search(params)
        : await organizationsApi.list(params)
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

  const createOrganization = async (data: CreateOrganizationRequest) => {
    const response = await organizationsApi.create(data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '创建组织失败')
    }
    await fetchOrganizations({ page: 1, pageSize: 10 })
    if (response.data.id) {
      await fetchOrganization(response.data.id)
    }
    return response.data
  }

  const fetchOrganization = async (organizationId: number) => {
    loading.value = true
    try {
      const response = await organizationsApi.detail(organizationId)
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

  const updateOrganization = async (organizationId: number, data: UpdateOrganizationRequest) => {
    const response = await organizationsApi.update(organizationId, data)
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
      item.id === organizationId
        ? { ...item, ...data }
        : item
    ))
    return response.data
  }

  const removeOrganization = async (organizationId: number) => {
    const response = await organizationsApi.remove(organizationId)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '删除组织失败')
    }
    organizations.value = organizations.value.filter((item) => item.id !== organizationId)
    total.value = Math.max(total.value - 1, 0)
    if (currentOrganization.value?.id === organizationId) {
      currentOrganization.value = null
      accountInfo.value = null
      organizationCertification.value = null
      activeOrganizationId.value = organizations.value[0]?.id ?? null
    }
    return response.data
  }

  const disableOrganization = async (organizationId: number, data: OrganizationActionRequest) => {
    const response = await organizationsApi.disable(organizationId, data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '停用组织失败')
    }
    organizations.value = organizations.value.map((item) => (
      item.id === organizationId ? { ...item, status: 0 } : item
    ))
    if (currentOrganization.value?.id === organizationId) {
      currentOrganization.value = { ...currentOrganization.value, status: 0 }
    }
    return response.data
  }

  const enableOrganization = async (organizationId: number, data: OrganizationActionRequest) => {
    const response = await organizationsApi.enable(organizationId, data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '启用组织失败')
    }
    organizations.value = organizations.value.map((item) => (
      item.id === organizationId ? { ...item, status: 1 } : item
    ))
    if (currentOrganization.value?.id === organizationId) {
      currentOrganization.value = { ...currentOrganization.value, status: 1 }
    }
    return response.data
  }

  const bulkDeleteOrganizations = async (data: OrganizationBulkDeleteRequest) => {
    const response = await organizationsApi.bulkDelete(data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '批量删除组织失败')
    }
    const idSet = new Set(data.ids)
    organizations.value = organizations.value.filter((item) => !idSet.has(item.id))
    total.value = Math.max(total.value - (response.data.successCount || 0), 0)
    if (currentOrganization.value && idSet.has(currentOrganization.value.id)) {
      currentOrganization.value = null
      accountInfo.value = null
      organizationCertification.value = null
      activeOrganizationId.value = organizations.value[0]?.id ?? null
    }
    return response.data
  }

  const batchDisableOrganizations = async (data: OrganizationBatchActionRequest) => {
    const response = await organizationsApi.batchDisable(data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '批量停用组织失败')
    }
    const failedIds = new Set(response.data.failedIds || [])
    organizations.value = organizations.value.map((item) => (
      data.ids.includes(item.id) && !failedIds.has(item.id)
        ? { ...item, status: 0 }
        : item
    ))
    if (currentOrganization.value && data.ids.includes(currentOrganization.value.id) && !failedIds.has(currentOrganization.value.id)) {
      currentOrganization.value = { ...currentOrganization.value, status: 0 }
    }
    return response.data
  }

  const batchEnableOrganizations = async (data: OrganizationBatchActionRequest) => {
    const response = await organizationsApi.batchEnable(data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '批量启用组织失败')
    }
    const failedIds = new Set(response.data.failedIds || [])
    organizations.value = organizations.value.map((item) => (
      data.ids.includes(item.id) && !failedIds.has(item.id)
        ? { ...item, status: 1 }
        : item
    ))
    if (currentOrganization.value && data.ids.includes(currentOrganization.value.id) && !failedIds.has(currentOrganization.value.id)) {
      currentOrganization.value = { ...currentOrganization.value, status: 1 }
    }
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
    createOrganization,
    updateAccount,
    updateOrganization,
    removeOrganization,
    disableOrganization,
    enableOrganization,
    bulkDeleteOrganizations,
    batchDisableOrganizations,
    batchEnableOrganizations,
    setActiveOrganization
  }
})
