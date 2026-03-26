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

export interface OrganizationAccountInfo {
  userName: string
  email: string
  phone: string
}

export interface OrganizationProfileInfo {
  name: string
  contactPerson: string
  contactPhone: string
  address: string
  description: string
  logoUrl: string
}

export interface OrganizationCertificationInfo {
  organizationCode: string
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

export interface OrganizationSearchRequest extends OrganizationListRequest {
  startDate?: string
  endDate?: string
}

export interface CreateOrganizationRequest {
  name: string
  organizationCode: string
  contactPerson: string
  contactPhone: string
  email: string
  address: string
  organizationType: string
  region: string
  description?: string
  websiteUrl?: string
  logoUrl?: string
}

export interface CreateOrganizationData {
  id: number
  message: string
}

export interface OrganizationDetailData {
  organization: OrganizationInfo
  accountInfo: OrganizationAccountInfo
  organizationProfile: OrganizationProfileInfo
  organizationCertification: OrganizationCertificationInfo
}

export interface UpdateOrganizationData {
  message: string
}

export interface UpdateOrganizationRequest {
  name?: string
  organizationCode?: string
  contactPerson?: string
  contactPhone?: string
  organizationType?: string
  region?: string
  address?: string
  description?: string
  websiteUrl?: string
  logoUrl?: string
}

export interface UpdateOrganizationAccountRequest {
  userName?: string
  email?: string
  phone?: string
}

export interface OrganizationActionRequest {
  reason?: string
}

export interface OrganizationActionData {
  message: string
}

export interface OrganizationBulkDeleteRequest {
  ids: number[]
}

export interface OrganizationBulkDeleteData {
  successCount: number
  failedCount: number
  message: string
}

export interface OrganizationBatchActionRequest {
  ids: number[]
  reason?: string
}

export interface OrganizationBatchActionData {
  successCount: number
  failedIds: number[]
  message: string
}
