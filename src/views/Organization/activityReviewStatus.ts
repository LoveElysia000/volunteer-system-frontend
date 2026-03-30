export const AUDIT_STATUS_PENDING = 1 as const
export const AUDIT_STATUS_APPROVED = 2 as const
export const AUDIT_STATUS_REJECTED = 3 as const

export type ActivityReviewStatusFilter =
  | 'all'
  | typeof AUDIT_STATUS_PENDING
  | typeof AUDIT_STATUS_APPROVED
  | typeof AUDIT_STATUS_REJECTED

export const getAuditStatusRequest = (filter: ActivityReviewStatusFilter): number[] => {
  if (filter === 'all') {
    return [
      AUDIT_STATUS_PENDING,
      AUDIT_STATUS_APPROVED,
      AUDIT_STATUS_REJECTED
    ]
  }

  return [filter]
}

export const getAuditStatusFilterText = (filter: ActivityReviewStatusFilter) => ({
  all: '全部状态',
  [AUDIT_STATUS_PENDING]: '待审核',
  [AUDIT_STATUS_APPROVED]: '审核通过',
  [AUDIT_STATUS_REJECTED]: '审核拒绝'
}[filter] || '全部状态')
