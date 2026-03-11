<template>
  <nav class="volunteer-sidebar rounded-[2rem] border border-white/70 bg-white/85 p-3 shadow-[0_20px_70px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
    <div class="space-y-1.5 p-1">
      <MenuItem
        v-for="item in menuItems"
        :key="item.key"
        :item="item"
        :is-compact-sidebar="isCompactSidebar"
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

const emit = defineEmits<{ close: [] }>()
const props = withDefaults(defineProps<{
  sidebarWidth?: number
  enableCompact?: boolean
}>(), {
  sidebarWidth: 296,
  enableCompact: true
})
const route = useRoute()
const router = useRouter()
const expandedKeys = ref<string[]>([])
const isCompactSidebar = computed(() => props.enableCompact && props.sidebarWidth <= 320)

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
        badge: '推荐',
        badgeClass: 'bg-emerald-100 text-emerald-700'
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
      { key: 'service-records', label: '服务记录', icon: BarChartIcon, to: '/volunteer/records' },
      { key: 'time-statistics', label: '时长统计', icon: ClockIcon, to: '/volunteer/records/statistics' },
      { key: 'review-records', label: '评价记录', icon: StarIcon, to: '/volunteer/records/reviews' }
    ]
  },
  {
    key: 'achievements',
    label: '成长体系',
    icon: AwardIcon,
    children: [
      { key: 'badge-wall', label: '徽章墙', icon: AwardIcon, to: '/volunteer/achievements' },
      { key: 'level-progress', label: '等级进度', icon: TrophyIcon, to: '/volunteer/achievements/levels' },
      { key: 'leaderboard', label: '排行榜', icon: UsersIcon, to: '/volunteer/achievements/leaderboard' }
    ]
  },
  {
    key: 'profile',
    label: '个人中心',
    icon: UserIcon,
    children: [
      { key: 'personal-info', label: '个人信息', icon: UserIcon, to: '/volunteer/profile' },
      { key: 'account-settings', label: '账户设置', icon: SettingsIcon, to: '/volunteer/settings' },
      { key: 'notification-preferences', label: '通知偏好', icon: SettingsIcon, to: '/volunteer/settings/notifications' }
    ]
  }
])

const parentMenuItems = computed(() => menuItems.value.filter(item => item.children?.length))

watch(route, (newRoute) => {
  const currentPath = newRoute.path
  parentMenuItems.value.forEach((parentItem) => {
    if (!parentItem.children) return
    const active = hasChildActive(parentItem.children, currentPath)
    if (active && !expandedKeys.value.includes(parentItem.key)) {
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
  if (!item.to) return
  router.push(item.to)
  emit('close')
}
</script>
