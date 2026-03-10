<template>
  <nav class="volunteer-sidebar bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="space-y-1 p-2">
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
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  BarChartIcon,
  AwardIcon,
  SettingsIcon,
  ClockIcon,
  StarIcon,
  UsersIcon,
  TrophyIcon
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

const route = useRoute()
const router = useRouter()

// 展开的菜单项keys
const expandedKeys = ref<string[]>([])

// 菜单项配置 - 多级嵌套结构
const menuItems = computed<SidebarMenuItem[]>(() => [
  {
    key: 'dashboard',
    label: '数据总览',
    icon: HomeIcon,
    to: '/volunteer'
  },
  {
    key: 'activities',
    label: '活动管理',
    icon: CalendarIcon,
    children: [
      {
        key: 'activities-list',
        label: '活动列表',
        icon: CalendarIcon,
        to: '/volunteer/activities',
        badge: '3',
        badgeClass: 'bg-green-100 text-green-800'
      },
      {
        key: 'my-registrations',
        label: '我的报名',
        icon: UsersIcon,
        to: '/volunteer/activities/my-registrations'
      },
      {
        key: 'history-activities',
        label: '历史活动',
        icon: ClockIcon,
        to: '/volunteer/activities/history'
      }
    ]
  },
  {
    key: 'records',
    label: '个人记录',
    icon: BarChartIcon,
    children: [
      {
        key: 'service-records',
        label: '服务记录',
        icon: BarChartIcon,
        to: '/volunteer/records'
      },
      {
        key: 'time-statistics',
        label: '时长统计',
        icon: ClockIcon,
        to: '/volunteer/records/statistics'
      },
      {
        key: 'review-records',
        label: '评价记录',
        icon: StarIcon,
        to: '/volunteer/records/reviews'
      }
    ]
  },
  {
    key: 'achievements',
    label: '成就系统',
    icon: AwardIcon,
    children: [
      {
        key: 'badge-wall',
        label: '徽章墙',
        icon: AwardIcon,
        to: '/volunteer/achievements'
      },
      {
        key: 'level-progress',
        label: '等级进度',
        icon: TrophyIcon,
        to: '/volunteer/achievements/levels'
      },
      {
        key: 'leaderboard',
        label: '排行榜',
        icon: UsersIcon,
        to: '/volunteer/achievements/leaderboard'
      }
    ]
  },
  {
    key: 'profile',
    label: '个人中心',
    icon: UserIcon,
    children: [
      {
        key: 'personal-info',
        label: '个人信息',
        icon: UserIcon,
        to: '/volunteer/profile'
      },
      {
        key: 'account-settings',
        label: '账户设置',
        icon: SettingsIcon,
        to: '/volunteer/settings'
      },
      {
        key: 'notification-preferences',
        label: '通知偏好',
        icon: SettingsIcon,
        to: '/volunteer/settings/notifications'
      }
    ]
  }
])

// 获取所有父级菜单项
const parentMenuItems = computed(() => {
  return menuItems.value.filter(item => item.children && item.children.length > 0)
})

// 根据当前路由自动展开对应的父级菜单
watch(route, (newRoute) => {
  const currentPath = newRoute.path

  // 查找当前路由对应的父级菜单
  parentMenuItems.value.forEach(parentItem => {
    if (parentItem.children) {
      const isChildActive = hasChildActive(parentItem.children, currentPath)

      if (isChildActive && !expandedKeys.value.includes(parentItem.key)) {
        toggleMenuItemExpand(parentItem.key)
      }
    }
  })
}, { immediate: true })

// 切换菜单项展开状态
const toggleMenuItemExpand = (key: string) => {
  const index = expandedKeys.value.indexOf(key)

  if (index > -1) {
    // 如果已经展开，则关闭
    expandedKeys.value.splice(index, 1)
  } else {
    // 如果未展开，则先关闭同级别的其他菜单，再展开当前菜单
    const targetItem = findMenuItem(menuItems.value, key)
    if (targetItem) {
      // 关闭同一级别的其他菜单
      const sameLevelItems = findSameLevelItems(menuItems.value, targetItem)
      sameLevelItems.forEach(item => {
        const itemIndex = expandedKeys.value.indexOf(item.key)
        if (itemIndex > -1) {
          expandedKeys.value.splice(itemIndex, 1)
        }
      })

      // 展开当前菜单
      expandedKeys.value.push(key)
    }
  }
}

// 查找菜单项
const findMenuItem = (items: SidebarMenuItem[], key: string): SidebarMenuItem | null => {
  for (const item of items) {
    if (item.key === key) return item
    if (item.children) {
      const found = findMenuItem(item.children, key)
      if (found) return found
    }
  }
  return null
}

// 查找同一级别的菜单项
const findSameLevelItems = (items: SidebarMenuItem[], targetItem: SidebarMenuItem): SidebarMenuItem[] => {
  // 查找目标项的父级
  const parent = findParentItem(items, targetItem.key)

  if (parent && parent.children) {
    return parent.children
  }

  return items
}

// 查找父级菜单项
const findParentItem = (items: SidebarMenuItem[], childKey: string): SidebarMenuItem | null => {
  for (const item of items) {
    if (item.children) {
      if (item.children.some(child => child.key === childKey)) {
        return item
      }
      const found = findParentItem(item.children, childKey)
      if (found) return found
    }
  }
  return null
}

// 处理菜单项点击
const handleMenuItemClick = (item: SidebarMenuItem) => {
  if (item.disabled) return

  // 如果有路由路径，则进行跳转
  if (item.to) {
    router.push(item.to)
  }

  console.log('点击菜单项:', item.key)
}
</script>

<style scoped>
.volunteer-sidebar {
  @apply w-full;
}
</style>
