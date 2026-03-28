import {
  BACKEND_ACTIVITY_SIGNUP_STATUS,
  BACKEND_ACTIVITY_STATUS
} from '../../constants/activityEnums.ts'
import type {
  ActivityListRequest,
  ActivitySignupStatus,
  VolunteerActivityViewItem
} from '../../types/activity.ts'

export type ActivityTab = 'all' | 'recruiting' | 'finished' | 'canceled'

export interface VolunteerActivityListParams {
  tab: ActivityTab
  page: number
  pageSize: number
  searchQuery: string
  startFrom: string
  endTo: string
}

export interface VolunteerActivityRouteState {
  tab: ActivityTab
  search: string
  activityId: number | null
}

export interface VolunteerMyRegistrationsParams {
  page: number
  pageSize: number
  keyword: string
  statusFilter: ActivitySignupStatus | ''
}

const activityTabs: ActivityTab[] = ['all', 'recruiting', 'finished', 'canceled']

const normalizeSearch = (value: string) => value.trim()

export const buildVolunteerActivityListRequest = ({
  tab,
  page,
  pageSize,
  searchQuery,
  startFrom,
  endTo
}: VolunteerActivityListParams): ActivityListRequest => {
  const request: ActivityListRequest = {
    page,
    pageSize,
    sortBy: 'start_time',
    sortOrder: 'asc'
  }
  const keyword = normalizeSearch(searchQuery)

  if (keyword) {
    request.keyword = keyword
  }

  if (startFrom) {
    request.startFrom = startFrom
  }

  if (endTo) {
    request.startTo = endTo
  }

  if (tab === 'all') {
    request.status = [
      BACKEND_ACTIVITY_STATUS.RECRUITING,
      BACKEND_ACTIVITY_STATUS.FINISHED,
      BACKEND_ACTIVITY_STATUS.CANCELED
    ]
  } else if (tab === 'recruiting') {
    request.status = [BACKEND_ACTIVITY_STATUS.RECRUITING]
  } else if (tab === 'finished') {
    request.status = [BACKEND_ACTIVITY_STATUS.FINISHED]
  } else {
    request.status = [BACKEND_ACTIVITY_STATUS.CANCELED]
  }

  return request
}

const getSingleQueryValue = (value: unknown) => {
  return typeof value === 'string' ? value : ''
}

export const isActivityTab = (value: string): value is ActivityTab => {
  return activityTabs.includes(value as ActivityTab)
}

export const normalizeVolunteerActivityRoute = (
  query: Record<string, unknown>
): VolunteerActivityRouteState => {
  const tabValue = getSingleQueryValue(query.tab)
  const search = getSingleQueryValue(query.search)
  const idValue = getSingleQueryValue(query.id)
  const parsedId = Number(idValue)

  return {
    tab: isActivityTab(tabValue) ? tabValue : 'all',
    search,
    activityId: Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null
  }
}

export const buildVolunteerActivityRouteQuery = (
  state: VolunteerActivityRouteState
): Record<string, string> => {
  const query: Record<string, string> = {}

  if (state.tab !== 'all') {
    query.tab = state.tab
  }

  if (state.search) {
    query.search = state.search
  }

  if (state.activityId !== null) {
    query.id = String(state.activityId)
  }

  return query
}

export const buildVolunteerMyRegistrationsRequest = ({
  page,
  pageSize,
  keyword,
  statusFilter
}: VolunteerMyRegistrationsParams): ActivityListRequest => {
  const request: ActivityListRequest = {
    page,
    pageSize
  }
  const normalizedKeyword = keyword.trim()

  if (normalizedKeyword) {
    request.keyword = normalizedKeyword
  }

  if (statusFilter === '') {
    request.status = [
      BACKEND_ACTIVITY_SIGNUP_STATUS.PENDING,
      BACKEND_ACTIVITY_SIGNUP_STATUS.SUCCESS,
      BACKEND_ACTIVITY_SIGNUP_STATUS.REJECTED,
      BACKEND_ACTIVITY_SIGNUP_STATUS.CANCELED
    ]
  } else {
    request.status = [statusFilter]
  }

  return request
}

export const countUpcomingParticipations = (items: VolunteerActivityViewItem[]) => {
  return items.filter((item) => (
    item.activityStatus === BACKEND_ACTIVITY_STATUS.RECRUITING
    && (
      item.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.SUCCESS
      || item.signupStatus === BACKEND_ACTIVITY_SIGNUP_STATUS.PENDING
    )
  )).length
}
