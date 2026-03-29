import type { ActivityTab } from './activityFeed'

interface ActivityReloadDecisionInput {
  currentRouteName: string
  previousRouteName?: string
  hasLoadedOnce: boolean
  nextTab: ActivityTab
  currentTab: ActivityTab
  nextSearch: string
  currentSearch: string
}

export const shouldReloadVolunteerActivityList = ({
  currentRouteName,
  previousRouteName,
  hasLoadedOnce,
  nextTab,
  currentTab,
  nextSearch,
  currentSearch
}: ActivityReloadDecisionInput) => {
  if (currentRouteName !== 'volunteer-activities') {
    return false
  }

  if (previousRouteName !== 'volunteer-activities') {
    return true
  }

  return !hasLoadedOnce
    || nextTab !== currentTab
    || nextSearch !== currentSearch
}
