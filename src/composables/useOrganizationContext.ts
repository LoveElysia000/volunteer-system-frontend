import { useOrganizationStore } from '@/store/modules/organization'

const DEFAULT_ORGANIZATION_QUERY = {
  page: 1,
  pageSize: 10
}

export const useOrganizationContext = () => {
  const organizationStore = useOrganizationStore()

  const ensureOrganizationId = async () => {
    const existingId = organizationStore.activeOrganizationId ?? organizationStore.currentOrganization?.id
    if (existingId) return existingId

    if (!organizationStore.organizations.length) {
      await organizationStore.fetchOrganizations(DEFAULT_ORGANIZATION_QUERY)
    }

    const fallbackId = organizationStore.activeOrganizationId ?? organizationStore.organizations[0]?.id ?? null
    if (fallbackId && !organizationStore.currentOrganization) {
      try {
        await organizationStore.fetchOrganization(fallbackId)
      } catch (error) {
        console.warn('加载组织上下文详情失败，继续使用活动组织 ID', error)
      }
    }

    return organizationStore.activeOrganizationId ?? organizationStore.currentOrganization?.id ?? organizationStore.organizations[0]?.id ?? null
  }

  return {
    ensureOrganizationId
  }
}
