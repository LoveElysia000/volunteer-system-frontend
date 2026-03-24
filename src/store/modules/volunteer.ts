import { defineStore } from 'pinia'
import { ref } from 'vue'
import { volunteerApi } from '@/api/volunteer'
import { getApiMessage, isApiSuccess } from '@/api/types'
import type {
  VolunteerAccountInfo,
  VolunteerRealNameSubmitData,
  VolunteerRealNameSubmitRequest,
  UpdateVolunteerAccountRequest,
  UpdateVolunteerProfileRequest,
  VolunteerHomeSummaryData,
  VolunteerProfileData,
  VolunteerVerificationInfo
} from '@/types/volunteer'

export const useVolunteerStore = defineStore('volunteer', () => {
  const summary = ref<VolunteerHomeSummaryData | null>(null)
  const profile = ref<VolunteerProfileData['volunteer'] | null>(null)
  const accountInfo = ref<VolunteerAccountInfo | null>(null)
  const verification = ref<VolunteerVerificationInfo | null>(null)
  const realNameAudit = ref<VolunteerRealNameSubmitData | null>(null)
  const summaryLoading = ref(false)
  const profileLoading = ref(false)

  const fetchHomeSummary = async () => {
    summaryLoading.value = true
    try {
      const response = await volunteerApi.getHomeSummary()
      if (!isApiSuccess(response.code)) {
        throw new Error(getApiMessage(response) || '获取志愿者首页数据失败')
      }
      summary.value = response.data
      return response.data
    } finally {
      summaryLoading.value = false
    }
  }

  const fetchMyProfile = async (id: number) => {
    profileLoading.value = true
    try {
      const response = await volunteerApi.getMyProfile(id)
      if (!isApiSuccess(response.code)) {
        throw new Error(getApiMessage(response) || '获取志愿者资料失败')
      }
      profile.value = {
        ...response.data.volunteer,
        ...response.data.profile,
        auditStatus: response.data.verification?.auditStatus ?? response.data.volunteer.auditStatus
      }
      accountInfo.value = response.data.accountInfo
      verification.value = response.data.verification
      return response.data.volunteer
    } finally {
      profileLoading.value = false
    }
  }

  const updateMyAccount = async (data: UpdateVolunteerAccountRequest) => {
    const response = await volunteerApi.updateAccount(data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '更新账户信息失败')
    }
    if (accountInfo.value) {
      accountInfo.value = { ...accountInfo.value, ...data }
    }
    return response
  }

  const updateMyProfile = async (id: number, data: UpdateVolunteerProfileRequest) => {
    const response = await volunteerApi.updateProfile(id, data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '更新志愿者资料失败')
    }
    if (profile.value) {
      profile.value = { ...profile.value, ...data }
    }
    return response
  }

  const submitRealName = async (data: VolunteerRealNameSubmitRequest) => {
    const response = await volunteerApi.submitRealName(data)
    if (!isApiSuccess(response.code)) {
      throw new Error(getApiMessage(response) || '提交实名认证失败')
    }
    realNameAudit.value = response.data
    verification.value = {
      realName: data.realName,
      idCard: data.idCard,
      auditStatus: response.data.status
    }
    if (profile.value) {
      profile.value = { ...profile.value, auditStatus: response.data.status }
    }
    return response.data
  }

  return {
    summary,
    profile,
    accountInfo,
    verification,
    realNameAudit,
    summaryLoading,
    profileLoading,
    fetchHomeSummary,
    fetchMyProfile,
    updateMyAccount,
    updateMyProfile,
    submitRealName
  }
})
