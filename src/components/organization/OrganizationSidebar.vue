<template>
  <nav class="organization-sidebar organization-sidebar-shell rounded-[1.8rem] border border-[#ffd8c2]/70 bg-white/90 p-3 shadow-[0_22px_70px_-54px_rgba(120,53,15,0.4)] backdrop-blur">
    <div class="space-y-1.5 p-1">
      <MenuItem
        v-for="item in menuItems"
        :key="item.key"
        :item="item"
        :expanded="expandedKeys.includes(item.key)"
        @item-click="handleMenuItemClick"
        @toggle-expand="toggleMenuItemExpand"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  BarChartIcon,
  SettingsIcon,
  ClockIcon,
  StarIcon,
  UsersIcon,
  TrophyIcon,
  BuildingIcon,
  BellIcon,
  BookmarkIcon,
  FolderKanbanIcon
} from 'lucide-vue-next'
import MenuItem from './MenuItem.vue'
import { hasChildActive } from '@/utils/pathMatcher'

interface SidebarMenuItem {
  key: string
  label: string
  icon?: any
  to?: string
  children?: SidebarMenuItem[]
  badge?: string
  badgeClass?: string
  disabled?: boolean
}

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const router = useRouter()
const expandedKeys = ref<string[]>([])

const menuItems = computed<SidebarMenuItem[]>(() => [
  {
    key: 'dashboard',
    label: '总览中心',
    icon: HomeIcon,
    to: '/organization'
  },
  {
    key: 'organization',
    label: '组织管理',
    icon: BuildingIcon,
    children: [
      {
        key: 'organization-info',
        label: '组织信息',
        icon: BuildingIcon,
        to: '/organization/organization-info',
        badge: '待完善',
        badgeClass: 'bg-amber-100 text-amber-700'
      },
      {
        key: 'member-management',
        label: '成员管理',
        icon: UsersIcon,
        to: '/organization/members'
      }
    ]
  },
  {
    key: 'activities',
    label: '项目管理',
    icon: FolderKanbanIcon,
    children: [
      {
        key: 'create-activity',
        label: '创建活动',
        icon: CalendarIcon,
        to: '/organization/activities/create',
        badge: '新',
        badgeClass: 'bg-emerald-100 text-emerald-700'
      },
      {
        key: 'activities-list',
        label: '活动列表',
        icon: BookmarkIcon,
        to: '/organization/activities'
      },
      {
        key: 'activity-review',
        label: '活动审核',
        icon: StarIcon,
        to: '/organization/activities/review',
        badge: '3',
        badgeClass: 'bg-sky-100 text-sky-700'
      }
    ]
  },
  {
    key: 'volunteers',
    label: '志愿者管理',
    icon: UsersIcon,
    children: [
      {
        key: 'volunteer-list',
        label: '志愿者列表',
        icon: UsersIcon,
        to: '/organization/volunteers'
      },
      {
        key: 'volunteer-statistics',
        label: '志愿者统计',
        icon: BarChartIcon,
        to: '/organization/volunteers/statistics'
      },
      {
        key: 'evaluation-management',
        label: '评价管理',
        icon: StarIcon,
        to: '/organization/volunteers/evaluations'
      }
    ]
  },
  {
    key: 'statistics',
    label: '数据报告',
    icon: BarChartIcon,
    children: [
      {
        key: 'activity-statistics',
        label: '活动统计',
        icon: CalendarIcon,
        to: '/organization/statistics/activities'
      },
      {
        key: 'volunteer-statistics-report',
        label: '志愿者统计',
        icon: UsersIcon,
        to: '/organization/statistics/volunteers'
      },
      {
        key: 'financial-statistics',
        label: '财务统计',
        icon: TrophyIcon,
        to: '/organization/statistics/financial'
      }
    ]
  },
  {
    key: 'notifications',
    label: '通知中心',
    icon: BellIcon,
    children: [
      {
        key: 'message-center',
        label: '消息通知',
        icon: BellIcon,
        to: '/organization/notifications'
      },
      {
        key: 'announcement-management',
        label: '公告管理',
        icon: BookmarkIcon,
        to: '/organization/notifications/announcements'
      }
    ]
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: SettingsIcon,
    children: [
      {
        key: 'account-settings',
        label: '账户设置',
        icon: UserIcon,
        to: '/organization/settings'
      },
      {
        key: 'permission-management',
        label: '权限管理',
        icon: ClockIcon,
        to: '/organization/settings/permissions'
      }
    ]
  }
])

const parentMenuItems = computed(() => menuItems.value.filter(item => item.children?.length))

watch(route, (newRoute) => {
  const currentPath = newRoute.path

  parentMenuItems.value.forEach((parentItem) => {
    if (!parentItem.children) return
    const isChildActive = hasChildActive(parentItem.children, currentPath)

    if (isChildActive && !expandedKeys.value.includes(parentItem.key)) {
      expandedKeys.value.push(parentItem.key)
    }
  })
}, { immediate: true })

const toggleMenuItemExpand = (key: string) => {
  const index = expandedKeys.value.indexOf(key)

  if (index > -1) {
    expandedKeys.value.splice(index, 1)
    return
  }

  expandedKeys.value = [key]
}

const handleMenuItemClick = (item: SidebarMenuItem) => {
  if (item.disabled || !item.to) return

  router.push(item.to)
  emit('close')
}
</script>
