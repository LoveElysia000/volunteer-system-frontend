import { computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { useAnalyticsStore } from '@/store/modules/analytics'

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

export const useOrganizationDashboardMetrics = () => {
  const authStore = useAuthStore()
  const analyticsStore = useAnalyticsStore()
  const user = computed(() => authStore.user)
  const funnel = computed(() => analyticsStore.funnel)
  const dashboard = computed(() => analyticsStore.dashboard)

  const organizationKpiMetrics = computed<OrganizationKpiMetric[]>(() => [
    {
      key: 'active-projects',
      label: '报名总数',
      value: String(dashboard.value?.signupCount ?? 0),
      detail: '统计周期内累计报名',
      trend: `${Math.round(funnel.value?.membershipToSignupRate ?? 0)}%`,
      tone: 'orange'
    },
    {
      key: 'volunteers',
      label: '成员转化',
      value: String(funnel.value?.membershipCount ?? 0),
      detail: '注册转成员的沉淀人数',
      trend: `${Math.round(funnel.value?.registrationToMembershipRate ?? 0)}%`,
      tone: 'blue'
    },
    {
      key: 'co2-offset',
      label: '到场人数',
      value: String(dashboard.value?.attendanceCount ?? 0),
      detail: '统计周期内完成签到',
      trend: `${Math.round(dashboard.value?.attendanceRate ?? 0)}%`,
      tone: 'green'
    },
    {
      key: 'funds-raised',
      label: '发放工时',
      value: `${dashboard.value?.grantedWorkHours ?? 0}h`,
      detail: '已结算服务工时',
      trend: `${Math.round(funnel.value?.attendanceToWorkhourRate ?? 0)}%`,
      tone: 'slate'
    }
  ])

  const organizationImpactTrendRows = computed<OrganizationTrendRow[]>(() => {
    const source = funnel.value
    if (!source) return []

    return [
      { month: '注册', value: source.registrationCount || 0 },
      { month: '成员', value: source.membershipCount || 0 },
      { month: '报名', value: source.signupCount || 0, highlight: true },
      { month: '到场', value: source.attendanceCount || 0 },
      { month: '工时', value: source.workhourCount || 0 }
    ]
  })

  const criticalTaskRows = computed<CriticalTaskRow[]>(() => {
    const source = dashboard.value
    if (!source) return []

    return [
      {
        key: 'signup-approval',
        title: '报名审核通过量',
        progress: source.signupCount ? Math.min(100, Math.round((source.approvedSignupCount / source.signupCount) * 100)) : 0,
        detail: `${source.approvedSignupCount} / ${source.signupCount} 已通过`,
        status: '审核',
        tone: 'amber'
      },
      {
        key: 'attendance-rate',
        title: '到场转化',
        progress: Math.round(source.attendanceRate || 0),
        detail: `${source.attendanceCount} 人完成签到`,
        status: '到场',
        tone: 'green'
      },
      {
        key: 'workhour-issue',
        title: '工时发放',
        progress: source.attendanceCount ? Math.min(100, Math.round(((funnel.value?.workhourCount ?? 0) / source.attendanceCount) * 100)) : 0,
        detail: `${source.grantedWorkHours} 小时已结算`,
        status: '工时',
        tone: 'orange'
      }
    ]
  })

  const topProjectRows = computed<TopProjectRow[]>(() => {
    const source = dashboard.value
    const funnelSource = funnel.value
    if (!source || !funnelSource) return []

    return [
      {
        key: 'conversion-overview',
        title: '组织转化概览',
        summary: '从注册到成员、报名、到场、工时的关键转化链路。',
        volunteers: funnelSource.signupCount,
        completion: Math.round(source.attendanceRate || 0),
        rating: Number((((funnelSource.attendanceToWorkhourRate || 0) + (source.attendanceRate || 0)) / 40).toFixed(1)),
        category: '转化',
        imageClass: 'from-orange-700 via-amber-600 to-orange-300'
      },
      {
        key: 'member-intake',
        title: '成员吸纳表现',
        summary: '跟踪注册用户到正式成员的转化表现。',
        volunteers: funnelSource.membershipCount,
        completion: Math.round(funnelSource.registrationToMembershipRate || 0),
        rating: Number(((funnelSource.registrationToMembershipRate || 0) / 20).toFixed(1)),
        category: '成员',
        imageClass: 'from-sky-700 via-cyan-600 to-blue-300'
      },
      {
        key: 'attendance-execution',
        title: '活动执行表现',
        summary: '对比报名、到场与工时发放的闭环完成度。',
        volunteers: source.attendanceCount,
        completion: Math.round(funnelSource.attendanceToWorkhourRate || 0),
        rating: Number(((funnelSource.attendanceToWorkhourRate || 0) / 20).toFixed(1)),
        category: '执行',
        imageClass: 'from-emerald-700 via-emerald-600 to-lime-400'
      }
    ]
  })

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
    funnel,
    dashboard,
    organizationKpiMetrics,
    organizationImpactTrendRows,
    criticalTaskRows,
    topProjectRows,
    currentDateLabel
  }
}
