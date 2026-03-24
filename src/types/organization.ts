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
  address?: string
  description?: string
  logoUrl?: string
}

export interface UpdateOrganizationAccountRequest {
  userName?: string
  email?: string
  phone?: string
}
