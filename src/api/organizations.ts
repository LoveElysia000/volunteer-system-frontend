import { http } from './request'
import { createOrganizationsApi } from './organizations-client'
import type { ApiResponse } from './types'
import type {
  CreateOrganizationData,
  CreateOrganizationRequest,
  OrganizationActionData,
  OrganizationActionRequest,
  OrganizationBatchActionData,
  OrganizationBatchActionRequest,
  OrganizationBulkDeleteData,
  OrganizationBulkDeleteRequest,
  OrganizationDetailData,
  OrganizationListData,
  OrganizationListRequest,
  OrganizationSearchRequest,
  UpdateOrganizationAccountRequest,
  UpdateOrganizationData,
  UpdateOrganizationRequest
} from '@/types/organization'

const organizationsClient = createOrganizationsApi(http)

export const organizationsApi = {
  list: (data: OrganizationListRequest): Promise<ApiResponse<OrganizationListData>> => organizationsClient.list<ApiResponse<OrganizationListData>>(data),

  publicList: (data: OrganizationListRequest): Promise<ApiResponse<OrganizationListData>> => organizationsClient.publicList<ApiResponse<OrganizationListData>>(data),

  search: (data: OrganizationSearchRequest): Promise<ApiResponse<OrganizationListData>> => organizationsClient.search<ApiResponse<OrganizationListData>>(data),

  detail: (id: number): Promise<ApiResponse<OrganizationDetailData>> => organizationsClient.detail<ApiResponse<OrganizationDetailData>>(id),

  create: (data: CreateOrganizationRequest): Promise<ApiResponse<CreateOrganizationData>> => organizationsClient.create<ApiResponse<CreateOrganizationData>>(data),

  updateAccount: (data: UpdateOrganizationAccountRequest): Promise<ApiResponse<Record<string, never>>> => organizationsClient.updateAccount<ApiResponse<Record<string, never>>>(data),

  update: (id: number, data: UpdateOrganizationRequest): Promise<ApiResponse<UpdateOrganizationData>> => organizationsClient.update<ApiResponse<UpdateOrganizationData>>(id, data),

  remove: (id: number): Promise<ApiResponse<OrganizationActionData>> => organizationsClient.remove<ApiResponse<OrganizationActionData>>(id),

  disable: (id: number, data: OrganizationActionRequest): Promise<ApiResponse<OrganizationActionData>> => organizationsClient.disable<ApiResponse<OrganizationActionData>>(id, data),

  enable: (id: number, data: OrganizationActionRequest): Promise<ApiResponse<OrganizationActionData>> => organizationsClient.enable<ApiResponse<OrganizationActionData>>(id, data),

  bulkDelete: (data: OrganizationBulkDeleteRequest): Promise<ApiResponse<OrganizationBulkDeleteData>> => organizationsClient.bulkDelete<ApiResponse<OrganizationBulkDeleteData>>(data),

  batchDisable: (data: OrganizationBatchActionRequest): Promise<ApiResponse<OrganizationBatchActionData>> => organizationsClient.batchDisable<ApiResponse<OrganizationBatchActionData>>(data),

  batchEnable: (data: OrganizationBatchActionRequest): Promise<ApiResponse<OrganizationBatchActionData>> => organizationsClient.batchEnable<ApiResponse<OrganizationBatchActionData>>(data)
}
