import { computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'

interface OrganizationKpiMetric {
  key: string
  label: string
  value: string
  detail: string
  trend: string
  tone: 'orange' | 'blue' | 'green' | 'slate'
}

interface OrganizationTrendRow {
  month: string
  value: number
  highlight?: boolean
}

interface CriticalTaskRow {
  key: string
  title: string
  progress: number
  detail: string
  status: string
  tone: 'green' | 'amber' | 'orange'
}

interface TopProjectRow {
  key: string
  title: string
  summary: string
  volunteers: number
  completion: number
  rating: number
  category: string
  imageClass: string
}

const fallbackMetrics = {
  activeProjects: 24,
  volunteers: 1842,
  co2Offset: 420.5,
  fundsRaised: 84200
}

const fallbackTrendRows: OrganizationTrendRow[] = [
  { month: 'JAN', value: 40 },
  { month: 'FEB', value: 55 },
  { month: 'MAR', value: 45 },
  { month: 'APR', value: 74, highlight: true },
  { month: 'MAY', value: 60 },
  { month: 'JUN', value: 86 },
  { month: 'JUL', value: 71 },
  { month: 'AUG', value: 95 }
]

const fallbackCriticalTasks: CriticalTaskRow[] = [
  {
    key: 'forest-q3',
    title: 'Reforestation Q3 Goal',
    progress: 78,
    detail: '7,800 / 10,000 trees planted',
    status: 'On Track',
    tone: 'green'
  },
  {
    key: 'urban-garden',
    title: 'Urban Garden Initiative',
    progress: 45,
    detail: '9 / 20 locations secured',
    status: 'Review',
    tone: 'amber'
  },
  {
    key: 'ocean-cleanup',
    title: 'Ocean Cleanup Campaign',
    progress: 15,
    detail: 'Permit approval pending',
    status: 'Urgent',
    tone: 'orange'
  }
]

const fallbackTopProjects: TopProjectRow[] = [
  {
    key: 'amazon-restoration',
    title: 'Amazon Basin Restoration',
    summary: 'Replant native tree species across degraded rainforest areas.',
    volunteers: 1240,
    completion: 85,
    rating: 4.9,
    category: 'Reforestation',
    imageClass: 'from-emerald-700 via-emerald-600 to-lime-500'
  },
  {
    key: 'rural-solar-grid',
    title: 'Rural Solar Grid',
    summary: 'Community-owned renewable micro-grid rollout in off-grid zones.',
    volunteers: 458,
    completion: 62,
    rating: 4.7,
    category: 'Energy Access',
    imageClass: 'from-sky-700 via-cyan-600 to-emerald-500'
  },
  {
    key: 'coastline-cleanup',
    title: 'Coastline Cleanup',
    summary: 'Remove marine plastic and deploy permanent recycling stations.',
    volunteers: 3120,
    completion: 92,
    rating: 4.9,
    category: 'Marine Protection',
    imageClass: 'from-orange-700 via-amber-600 to-yellow-400'
  }
]

export const useOrganizationDashboardMetrics = () => {
  const authStore = useAuthStore()
  const user = computed(() => authStore.user)

  const organizationKpiMetrics = computed<OrganizationKpiMetric[]>(() => [
    {
      key: 'active-projects',
      label: 'Active Projects',
      value: String(fallbackMetrics.activeProjects),
      detail: 'Across all regions',
      trend: '+12%',
      tone: 'orange'
    },
    {
      key: 'volunteers',
      label: 'Total Volunteers',
      value: fallbackMetrics.volunteers.toLocaleString('en-US'),
      detail: 'Current active roster',
      trend: '+5.2%',
      tone: 'blue'
    },
    {
      key: 'co2-offset',
      label: 'CO2 Offset (Tons)',
      value: fallbackMetrics.co2Offset.toLocaleString('en-US'),
      detail: 'Year-to-date impact',
      trend: '+18.7%',
      tone: 'green'
    },
    {
      key: 'funds-raised',
      label: 'Funds Raised',
      value: `$${fallbackMetrics.fundsRaised.toLocaleString('en-US')}`,
      detail: 'Campaigns and grants',
      trend: 'Stable',
      tone: 'slate'
    }
  ])

  const organizationImpactTrendRows = computed(() => fallbackTrendRows)
  const criticalTaskRows = computed(() => fallbackCriticalTasks)
  const topProjectRows = computed(() => fallbackTopProjects)

  const currentDateLabel = computed(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    })
  })

  return {
    user,
    organizationKpiMetrics,
    organizationImpactTrendRows,
    criticalTaskRows,
    topProjectRows,
    currentDateLabel
  }
}
