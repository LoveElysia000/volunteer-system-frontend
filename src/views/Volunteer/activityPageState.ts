import {
  normalizeVolunteerActivityRoute,
  type VolunteerActivityRouteState
} from './activityFeed.ts'

interface VolunteerActivityRouteSyncInput {
  routeName: string
  previousRouteName?: string
  query: Record<string, unknown>
  hasLoadedOnce: boolean
  currentState: VolunteerActivityRouteState
}

interface VolunteerActivityRouteSyncPlan {
  nextState: VolunteerActivityRouteState
  shouldRefresh: boolean
  shouldResetPage: boolean
  shouldOpenFromQuery: boolean
}

const didListFiltersChange = (
  currentState: VolunteerActivityRouteState,
  nextState: VolunteerActivityRouteState
) => {
  return currentState.tab !== nextState.tab
    || currentState.search !== nextState.search
    || currentState.startFrom !== nextState.startFrom
    || currentState.endTo !== nextState.endTo
}

export const planVolunteerActivityRouteSync = ({
  routeName,
  previousRouteName,
  query,
  hasLoadedOnce,
  currentState
}: VolunteerActivityRouteSyncInput): VolunteerActivityRouteSyncPlan => {
  const nextState = normalizeVolunteerActivityRoute(query)

  if (routeName !== 'volunteer-activities') {
    return {
      nextState,
      shouldRefresh: false,
      shouldResetPage: false,
      shouldOpenFromQuery: false
    }
  }

  const enteredFromAnotherRoute = previousRouteName !== 'volunteer-activities'
  const filtersChanged = didListFiltersChange(currentState, nextState)
  const shouldRefresh = enteredFromAnotherRoute || !hasLoadedOnce || filtersChanged

  return {
    nextState,
    shouldRefresh,
    shouldResetPage: enteredFromAnotherRoute || filtersChanged,
    shouldOpenFromQuery: true
  }
}
