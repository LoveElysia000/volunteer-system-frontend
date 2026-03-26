export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/Index.vue'),
    meta: { title: '环保志愿者平台' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Auth/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/Auth/ForgotPassword.vue'),
    meta: { title: '找回密码' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Auth/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/activities',
    name: 'activities',
    component: () => import('@/views/Activities/ActivityList.vue'),
    meta: { title: '活动列表' }
  },
  {
    path: '/activities/:id',
    name: 'activity-detail',
    component: () => import('@/views/Activities/ActivityDetail.vue'),
    meta: { title: '活动详情' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About/Index.vue'),
    meta: { title: '平台介绍', fullWidth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Volunteer/Profile.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/volunteer',
    name: 'volunteer',
    component: () => import('@/views/Volunteer/VolunteerLayout.vue'),
    meta: { title: '志愿者中心', requiresAuth: true, role: 'volunteer', fullWidth: true, hideGlobalChrome: true },
    children: [
      {
        path: '',
        name: 'volunteer-dashboard',
        component: () => import('@/views/Volunteer/Dashboard.vue'),
        meta: { title: '志愿者中心' }
      },
      {
        path: 'activities',
        name: 'volunteer-activities',
        component: () => import('@/views/Volunteer/Activities.vue'),
        meta: { title: '活动管理' }
      },
      {
        path: 'activities/my-registrations',
        name: 'volunteer-my-registrations',
        component: () => import('@/views/Volunteer/MyRegistrations.vue'),
        meta: { title: '我的报名' }
      },
      {
        path: 'activities/:id',
        name: 'volunteer-activity-detail',
        component: () => import('@/views/Volunteer/ActivityDetail.vue'),
        meta: { title: '活动详情' }
      },
      {
        path: 'activities/history',
        name: 'volunteer-history-activities',
        component: () => import('@/views/Volunteer/HistoryActivities.vue'),
        meta: { title: '历史活动' }
      },
      {
        path: 'organizations',
        name: 'volunteer-organizations',
        component: () => import('@/views/Volunteer/Organizations.vue'),
        meta: { title: '组织管理' }
      },
      {
        path: 'records',
        name: 'volunteer-records',
        component: () => import('@/views/Volunteer/Records.vue'),
        meta: { title: '个人记录' }
      },
      {
        path: 'records/statistics',
        name: 'volunteer-records-statistics',
        component: () => import('@/views/Volunteer/RecordsStatistics.vue'),
        meta: { title: '时长统计' }
      },
      {
        path: 'records/reviews',
        name: 'volunteer-records-reviews',
        component: () => import('@/views/Volunteer/RecordsReviews.vue'),
        meta: { title: '评价记录' }
      },
      {
        path: 'achievements',
        name: 'volunteer-achievements',
        component: () => import('@/views/Volunteer/Achievements.vue'),
        meta: { title: '成就徽章' }
      },
      {
        path: 'achievements/levels',
        name: 'volunteer-achievements-levels',
        component: () => import('@/views/Volunteer/AchievementsLevels.vue'),
        meta: { title: '等级进度' }
      },
      {
        path: 'achievements/leaderboard',
        name: 'volunteer-achievements-leaderboard',
        component: () => import('@/views/Volunteer/AchievementsLeaderboard.vue'),
        meta: { title: '排行榜' }
      },
      {
        path: 'profile',
        name: 'volunteer-profile',
        component: () => import('@/views/Volunteer/Profile.vue'),
        meta: { title: '个人信息' }
      },
      {
        path: 'settings',
        name: 'volunteer-settings',
        component: () => import('@/views/Volunteer/Settings.vue'),
        meta: { title: '账户设置' }
      },
      {
        path: 'settings/notifications',
        name: 'volunteer-settings-notifications',
        component: () => import('@/views/Volunteer/SettingsNotifications.vue'),
        meta: { title: '通知偏好' }
      }
    ]
  },
  {
    path: '/organization',
    name: 'organization',
    component: () => import('@/views/Organization/OrganizationLayout.vue'),
    meta: { title: '组织管理中心', requiresAuth: true, role: 'organization', fullWidth: true, hideGlobalChrome: true },
    children: [
      {
        path: '',
        name: 'organization-dashboard',
        component: () => import('@/views/Organization/Dashboard.vue'),
        meta: { title: '组织管理总览' }
      },
      {
        path: 'organization-info',
        name: 'organization-info',
        component: () => import('@/views/Organization/OrganizationInfo.vue'),
        meta: { title: '组织信息管理' }
      },
      {
        path: 'activities',
        name: 'organization-activities',
        component: () => import('@/views/Organization/ActivityManagement.vue'),
        meta: { title: '活动管理' }
      },
      {
        path: 'volunteers',
        name: 'organization-volunteers',
        component: () => import('@/views/Organization/VolunteerManagement.vue'),
        meta: { title: '志愿者管理' }
      },
      {
        path: 'statistics',
        name: 'organization-statistics',
        component: () => import('@/views/Organization/Statistics.vue'),
        meta: { title: '数据统计' }
      },
      {
        path: 'notifications',
        name: 'organization-notifications',
        component: () => import('@/views/Organization/Notifications.vue'),
        meta: { title: '通知管理' }
      },
      {
        path: 'assistant',
        name: 'organization-assistant',
        component: () => import('@/views/Organization/AIAssistant.vue'),
        meta: { title: 'AI 助手' }
      },
      {
        path: 'settings',
        name: 'organization-settings',
        component: () => import('@/views/Organization/Settings.vue'),
        meta: { title: '设置' }
      },
      {
        path: 'members',
        name: 'organization-members',
        component: () => import('@/views/Organization/Members.vue'),
        meta: { title: '成员管理' }
      },
      {
        path: 'activities/create',
        name: 'organization-activities-create',
        component: () => import('@/views/Organization/ActivityCreate.vue'),
        meta: { title: '创建活动' }
      },
      {
        path: 'activities/review',
        name: 'organization-activities-review',
        component: () => import('@/views/Organization/ActivityReview.vue'),
        meta: { title: '活动审核' }
      },
      {
        path: 'volunteers/statistics',
        name: 'organization-volunteers-statistics',
        component: () => import('@/views/Organization/VolunteerStatistics.vue'),
        meta: { title: '志愿者统计' }
      },
      {
        path: 'volunteers/evaluations',
        name: 'organization-volunteers-evaluations',
        component: () => import('@/views/Organization/VolunteerEvaluations.vue'),
        meta: { title: '评价管理' }
      },
      {
        path: 'statistics/activities',
        name: 'organization-statistics-activities',
        component: () => import('@/views/Organization/StatisticsActivities.vue'),
        meta: { title: '活动统计' }
      },
      {
        path: 'statistics/volunteers',
        name: 'organization-statistics-volunteers',
        component: () => import('@/views/Organization/StatisticsVolunteers.vue'),
        meta: { title: '志愿者统计' }
      },
      {
        path: 'statistics/financial',
        name: 'organization-statistics-financial',
        component: () => import('@/views/Organization/WorkHours.vue'),
        meta: { title: '工时流水' }
      },
      {
        path: 'notifications/announcements',
        name: 'organization-notifications-announcements',
        component: () => import('@/views/Organization/NotificationsAnnouncements.vue'),
        meta: { title: '公告管理' }
      },
      {
        path: 'settings/permissions',
        name: 'organization-settings-permissions',
        component: () => import('@/views/Organization/SettingsPermissions.vue'),
        meta: { title: '权限管理' }
      }
    ]
  },
  {
    path: '/demo/messages',
    name: 'message-demo',
    component: () => import('@/components/demo/MessageDemo.vue'),
    meta: { title: '消息组件演示' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到', requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到', requiresAuth: false }
  }
]
