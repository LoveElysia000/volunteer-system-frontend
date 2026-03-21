import { defineStore } from 'pinia'
import { ref } from 'vue'
import { volunteerApi } from '@/api/volunteer'
import type {
  VolunteerRealNameSubmitData,
  VolunteerRealNameSubmitRequest,
  UpdateVolunteerProfileRequest,
  VolunteerHomeSummaryData,
  VolunteerProfileData
} from '@/types/volunteer'

export const useVolunteerStore = defineStore('volunteer', () => {
  const summary = ref<VolunteerHomeSummaryData | null>(null)
  const profile = ref<VolunteerProfileData['volunteer'] | null>(null)
  const realNameAudit = ref<VolunteerRealNameSubmitData | null>(null)
  const summaryLoading = ref(false)
  const profileLoading = ref(false)

  const fetchHomeSummary = async () => {
    summaryLoading.value = true
    try {
      const response = await volunteerApi.getHomeSummary()
      if (response.code !== 200) {
        throw new Error(response.msg || '获取志愿者首页数据失败')
      }
      summary.value = response.data
      return response.data
    } finally {
      summaryLoading.value = false
    }
  }

  const fetchMyProfile = async (id: number | string) => {
    profileLoading.value = true
    try {
      const response = await volunteerApi.getMyProfile(id)
      if (response.code !== 200) {
        throw new Error(response.msg || '获取志愿者资料失败')
      }
      profile.value = response.data.volunteer
      return response.data.volunteer
    } finally {
      profileLoading.value = false
    }
  }

  const updateMyProfile = async (id: number | string, data: UpdateVolunteerProfileRequest) => {
    const response = await volunteerApi.updateProfile(id, data)
    if (response.code !== 200) {
      throw new Error(response.msg || '更新志愿者资料失败')
    }
    if (profile.value) {
      profile.value = { ...profile.value, ...data }
    }
    return response
  }

  const submitRealName = async (data: VolunteerRealNameSubmitRequest) => {
    const response = await volunteerApi.submitRealName(data)
    if (response.code !== 200) {
      throw new Error(response.msg || '提交实名认证失败')
    }
    realNameAudit.value = response.data
    if (profile.value) {
      profile.value = {
        ...profile.value,
        realName: data.realName,
        idCard: data.idCard,
        auditStatus: response.data.status
      }
    }
    return response.data
  }

  return {
    summary,
    profile,
    realNameAudit,
    summaryLoading,
    profileLoading,
    fetchHomeSummary,
    fetchMyProfile,
    updateMyProfile,
    submitRealName
  }
})
