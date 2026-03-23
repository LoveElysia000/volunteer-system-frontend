export enum OrganizationStatus {
  DISABLED = 0,
  ACTIVE = 1
}

export interface OrganizationInfo {
  id: number
  accountId: number
  name: string
  organizationCode: string
  contactPerson: string
  contactPhone: string
  email: string
  address: string
  status: OrganizationStatus
  organizationType: string
  region: string
  description: string
  websiteUrl: string
  logoUrl: string
  createdAt: string
  updatedAt: string
}

export interface OrganizationListRequest {
  keyword?: string
  status?: OrganizationStatus[]
  organizationType?: string
  region?: string
  page: number
  pageSize: number
}

export interface OrganizationListData {
  total: number
  list: OrganizationInfo[]
}

export interface OrganizationDetailData {
  organization: OrganizationInfo
}

export interface UpdateOrganizationData {
  message: string
}

export interface UpdateOrganizationRequest {
  name?: string
  organizationCode?: string
  contactPerson?: string
  contactPhone?: string
  email?: string
  address?: string
  organizationType?: string
  region?: string
  description?: string
  websiteUrl?: string
  logoUrl?: string
}
