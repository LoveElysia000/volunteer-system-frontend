<template>
  <nav class="organization-sidebar bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="space-y-2 p-3">
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
  TrophyIcon,
  BuildingIcon,
  BellIcon,
  BookmarkIcon
} from 'lucide-vue-next'
import MenuItem from './MenuItem.vue'
import { hasChildActive } from '@/utils/pathMatcher'

interface MenuItem {
  key: string
  label: string
  icon?: any
  to?: string
  children?: MenuItem[]
  badge?: string
  badgeClass?: string
  disabled?: boolean
}

const route = useRoute()
const router = useRouter()

// 展开的菜单项keys
const expandedKeys = ref<string[]>([])

// 菜单项配置 - 多级嵌套结构
const menuItems = computed<MenuItem[]>(() => [
  {
    key: 'dashboard',
    label: '数据总览',
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
        badge: '需完善',
        badgeClass: 'bg-yellow-100 text-yellow-800'
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
    label: '活动管理',
    icon: CalendarIcon,
    children: [
      {
        key: 'create-activity',
        label: '创建活动',
        icon: CalendarIcon,
        to: '/organization/activities/create',
        badge: '新',
        badgeClass: 'bg-green-100 text-green-800'
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
        badgeClass: 'bg-blue-100 text-blue-800'
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
    label: '数据统计',
    icon: BarChartIcon,
    children: [
      {
        key: 'activity-statistics',
        label: '活动统计',
        icon: CalendarIcon,
        to: '/organization/statistics/activities'
      },
      {
        key: 'volunteer-statistics',
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
        icon: SettingsIcon,
        to: '/organization/settings/permissions'
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
const findMenuItem = (items: MenuItem[], key: string): MenuItem | null => {
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
const findSameLevelItems = (items: MenuItem[], targetItem: MenuItem): MenuItem[] => {
  // 查找目标项的父级
  const parent = findParentItem(items, targetItem.key)

  if (parent && parent.children) {
    return parent.children
  }

  return items
}

// 查找父级菜单项
const findParentItem = (items: MenuItem[], childKey: string): MenuItem | null => {
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
const handleMenuItemClick = (item: MenuItem) => {
  if (item.disabled) return

  // 如果有路由路径，则进行跳转
  if (item.to) {
    router.push(item.to)
  }

  console.log('点击菜单项:', item.key)

  // 触发关闭移动端侧边栏事件
  emit('close')
}

// 定义事件
const emit = defineEmits<{
  close: []
}>()
</script>

<style scoped>
.organization-sidebar {
  @apply w-full;
}
</style>