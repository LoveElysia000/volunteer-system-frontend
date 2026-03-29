export const WORKBENCH_PAGE_TYPES = {
  'volunteer-dashboard': 'dashboard',
  'volunteer-activities': 'list',
  'volunteer-my-registrations': 'list',
  'volunteer-work-hours': 'list',
  'volunteer-notifications': 'list',
  'volunteer-activity-detail': 'detail',
  'volunteer-organizations': 'studio',
  'volunteer-profile': 'studio',
  'organization-dashboard': 'dashboard',
  'organization-info': 'studio',
  'organization-activities': 'list',
  'organization-volunteers': 'list',
  'organization-statistics': 'dashboard',
  'organization-notifications': 'list',
  'organization-members': 'list',
  'organization-activities-create': 'studio',
  'organization-activities-review': 'list',
  'organization-statistics-activities': 'dashboard',
  'organization-statistics-volunteers': 'dashboard',
  'organization-statistics-financial': 'list',
  'organization-assistant': 'studio'
} as const

export type WorkbenchPageType = typeof WORKBENCH_PAGE_TYPES[keyof typeof WORKBENCH_PAGE_TYPES]
