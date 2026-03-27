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
        path: 'organizations',
        name: 'volunteer-organizations',
        component: () => import('@/views/Volunteer/Organizations.vue'),
        meta: { title: '组织管理' }
      },
      {
        path: 'profile',
        name: 'volunteer-profile',
        component: () => import('@/views/Volunteer/Profile.vue'),
        meta: { title: '个人信息' }
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
        meta: { title: '通知中心' }
      },
      {
        path: 'assistant',
        name: 'organization-assistant',
        component: () => import('@/views/Organization/AIAssistant.vue'),
        meta: { title: 'AI 助手' }
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
        meta: { title: '审核中心' }
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
