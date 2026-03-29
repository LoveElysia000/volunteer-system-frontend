<template>
  <nav
    class="volunteer-sidebar rounded-[1.75rem] border border-emerald-100/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,253,250,0.92))] p-3 shadow-[0_18px_44px_-38px_rgba(5,150,105,0.22)] backdrop-blur"
    :class="isCompactSidebar ? 'volunteer-sidebar--compact' : ''"
  >
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
  UsersIcon,
  Building2Icon
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
const isCompactSidebar = computed(() => props.enableCompact)

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
      }
    ]
  },
  {
    key: 'organizations',
    label: '组织管理',
    icon: Building2Icon,
    children: [
      {
        key: 'organizations-list',
        label: '我的组织',
        icon: Building2Icon,
        to: '/volunteer/organizations'
      }
    ]
  },
  {
    key: 'profile',
    label: '个人中心',
    icon: UserIcon,
    children: [
      { key: 'personal-info', label: '个人信息', icon: UserIcon, to: '/volunteer/profile' }
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
