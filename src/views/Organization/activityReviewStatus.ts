export const AUDIT_STATUS_PENDING = 1 as const
export const AUDIT_STATUS_APPROVED = 2 as const
export const AUDIT_STATUS_REJECTED = 3 as const

export type ActivityReviewStatusFilter =
  | 'all'
  | typeof AUDIT_STATUS_PENDING
  | typeof AUDIT_STATUS_APPROVED
  | typeof AUDIT_STATUS_REJECTED

export const normalizeAuditStatus = (value: string | number | null | undefined) => {
  const normalized = Number(value)

  if (
    normalized === AUDIT_STATUS_PENDING
    || normalized === AUDIT_STATUS_APPROVED
    || normalized === AUDIT_STATUS_REJECTED
  ) {
    return normalized
  }

  return undefined
}

export const resolveSelectedAuditStatus = ({
  selectedAuditId,
  selectedAuditStatus,
  detailAuditId,
  detailAuditStatus
}: {
  selectedAuditId: number | null | undefined
  selectedAuditStatus: string | number | null | undefined
  detailAuditId: number | null | undefined
  detailAuditStatus: string | number | null | undefined
}) => {
  if (
    selectedAuditId != null
    && detailAuditId != null
    && Number(detailAuditId) === Number(selectedAuditId)
  ) {
    return normalizeAuditStatus(detailAuditStatus)
  }

  return normalizeAuditStatus(selectedAuditStatus)
}

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

export const getAuditStatusFilterText = (filter: ActivityReviewStatusFilter | string | number | null | undefined) => ({
  all: '全部状态',
  [AUDIT_STATUS_PENDING]: '待审核',
  [AUDIT_STATUS_APPROVED]: '审核通过',
  [AUDIT_STATUS_REJECTED]: '审核拒绝'
}[filter === 'all' ? filter : (normalizeAuditStatus(filter) ?? 'all')] || '全部状态')
