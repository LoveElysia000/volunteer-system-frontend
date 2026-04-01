const allAuditStatuses = [
  0,
  1,
  2,
  3
] as const

const allVolunteerStatuses = [
  1,
  2,
  3
] as const

type VolunteerFilterSelection = {
  keyword?: string
  auditStatus?: number
  status?: number
}

export const buildVolunteerListFilters = ({
  keyword,
  auditStatus,
  status
}: VolunteerFilterSelection): {
  keyword?: string
  auditStatuses: number[]
  status: number[]
} => {
  const request: {
    keyword?: string
    auditStatuses: number[]
    status: number[]
  } = {
    auditStatuses: auditStatus === undefined ? [...allAuditStatuses] : [auditStatus],
    status: status === undefined ? [...allVolunteerStatuses] : [status]
  }

  const normalizedKeyword = keyword?.trim()
  if (normalizedKeyword) {
    request.keyword = normalizedKeyword
  }

  return request
}

export const buildVolunteerExportFilters = ({
  keyword,
  auditStatus,
  status
}: VolunteerFilterSelection): {
  keyword?: string
  auditStatus: number[]
  status: number[]
} => {
  const request: {
    keyword?: string
    auditStatus: number[]
    status: number[]
  } = {
    auditStatus: auditStatus === undefined ? [...allAuditStatuses] : [auditStatus],
    status: status === undefined ? [...allVolunteerStatuses] : [status]
  }

  const normalizedKeyword = keyword?.trim()
  if (normalizedKeyword) {
    request.keyword = normalizedKeyword
  }

  return request
}
