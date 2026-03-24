import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auditsApi } from '@/api/audits'
import type {
  AuditDecisionRequest,
  AuditRecordDetail,
  PendingAuditItem,
  PendingAuditsRequest
} from '@/types/audit'

export const useAuditsStore = defineStore('audits', () => {
  const items = ref<PendingAuditItem[]>([])
  const total = ref(0)
  const currentRecord = ref<AuditRecordDetail | null>(null)
  const loading = ref(false)

  const fetchPending = async (params: PendingAuditsRequest) => {
    loading.value = true
    try {
      const response = await auditsApi.getPending(params)
      if (response.code !== 200) {
        throw new Error(response.msg || '获取待审核列表失败')
      }
      items.value = response.data.list || []
      total.value = response.data.total || 0
      return response.data
    } finally {
      loading.value = false
    }
  }

  const fetchDetail = async (id: number) => {
    const response = await auditsApi.getDetail(id)
    if (response.code !== 200) {
      throw new Error(response.msg || '获取审核详情失败')
    }
    currentRecord.value = response.data.record
    return response.data.record
  }

  const approve = async (data: AuditDecisionRequest) => {
    const response = await auditsApi.approve(data)
    if (response.code !== 200) {
      throw new Error(response.msg || '审核通过失败')
    }
    items.value = items.value.filter((item) => item.id !== data.id)
    total.value = Math.max(total.value - 1, 0)
    return response.data
  }

  const reject = async (data: AuditDecisionRequest) => {
    const response = await auditsApi.reject(data)
    if (response.code !== 200) {
      throw new Error(response.msg || '审核驳回失败')
    }
    items.value = items.value.filter((item) => item.id !== data.id)
    total.value = Math.max(total.value - 1, 0)
    return response.data
  }

  return {
    items,
    total,
    currentRecord,
    loading,
    fetchPending,
    fetchDetail,
    approve,
    reject
  }
})
