<template>
  <div class="space-y-1">
    <!-- 主菜单项 -->
    <div
      v-for="item in menuItems"
      :key="item.key"
    >
      <template v-if="!item.disabled">
        <router-link
          :to="item.to || { name: item.routeName }"
          class="flex min-w-0 items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium transition-colors duration-200"
          :class="[
            isActive(item)
              ? 'text-primary-600 bg-primary-50'
              : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
          ]"
          @click="(event) => { handleMenuItemClick(item, event); $emit('close') }"
        >
          <component
            :is="item.icon"
            class="h-5 w-5 shrink-0"
            :class="isActive(item) ? 'text-primary-600' : 'text-gray-400'"
          />
          <span class="min-w-0 break-words leading-5">{{ t(item.labelKey) }}</span>
        </router-link>
      </template>
      <template v-else>
        <span
          class="flex min-w-0 items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-gray-400 opacity-50"
        >
          <component
            :is="item.icon"
            class="h-5 w-5 shrink-0 text-gray-400"
          />
          <span class="min-w-0 break-words leading-5">{{ t(item.labelKey) }}</span>
        </span>
      </template>
    </div>

    <!-- 子菜单项 -->
    <div
      v-for="group in subMenuItems"
      :key="group.key"
      class="border-t border-gray-200 pt-2"
    >
      <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {{ t(group.labelKey) }}
      </div>
      <div class="space-y-1">
        <div
          v-for="item in group.children"
          :key="item.key"
        >
          <template v-if="!item.disabled">
            <router-link
              :to="item.to || { name: item.routeName }"
              class="flex min-w-0 items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
              @click="(event) => { handleMenuItemClick(item, event); $emit('close') }"
            >
              <component
                :is="item.icon"
                v-if="item.icon"
                class="h-4 w-4 text-gray-400"
              />
              <span class="min-w-0 break-words leading-5">{{ t(item.labelKey) }}</span>
            </router-link>
          </template>
          <template v-else>
            <span
              class="flex min-w-0 items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-400 opacity-50"
            >
              <component
                :is="item.icon"
                v-if="item.icon"
                class="h-4 w-4 text-gray-400"
              />
              <span class="min-w-0 break-words leading-5">{{ t(item.labelKey) }}</span>
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- 外部链接 -->
    <div class="border-t border-gray-200 pt-2">
      <a
        v-for="item in externalItems"
        :key="item.key"
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex min-w-0 items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
        @click="$emit('close')"
      >
        <ExternalLinkIcon class="h-4 w-4 text-gray-400" />
        <span class="min-w-0 break-words leading-5">{{ t(item.labelKey) }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/modules/auth'
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  ExternalLinkIcon,
  InfoIcon,
  UsersIcon,
  BuildingIcon
} from 'lucide-vue-next'

interface MenuItem {
  key: string
  labelKey: string
  icon?: any
  to?: string
  routeName?: string
  disabled?: boolean
  group?: string
  children?: MenuItem[]
  href?: string
  requiresAuth?: boolean
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

// 认证状态
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

// 菜单项配置
const menuItems = computed<MenuItem[]>(() => [
  {
    key: 'home',
    labelKey: 'nav.home',
    icon: HomeIcon,
    routeName: 'home'
  },
  {
    key: 'activities',
    labelKey: 'nav.activities',
    icon: CalendarIcon,
    routeName: 'activities'
  },
  {
    key: 'about',
    labelKey: 'nav.about',
    icon: InfoIcon,
    routeName: 'about'
  }
])

// 子菜单配置
const subMenuItems = computed<MenuItem[]>(() => [
  {
    key: 'permission-centers',
    labelKey: 'nav.permissionCenter',
    children: [
      {
        key: 'volunteer-center',
        labelKey: 'nav.volunteerCenter',
        icon: UsersIcon,
        routeName: 'volunteer',
        disabled: isAuthenticated.value && user.value?.role !== 'volunteer',
        requiresAuth: true
      },
      {
        key: 'organization-center',
        labelKey: 'nav.organizationCenter',
        icon: BuildingIcon,
        routeName: 'organization',
        disabled: isAuthenticated.value && user.value?.role !== 'organization',
        requiresAuth: true
      }
    ]
  },
  {
    key: 'settings',
    labelKey: 'nav.settings',
    children: [
      {
        key: 'profile',
        labelKey: 'nav.profile',
        icon: UserIcon,
        routeName: 'profile'
      }
    ]
  }
])

// 外部链接
const externalItems = computed<MenuItem[]>(() => [
  {
    key: 'antd',
    labelKey: 'nav.designGuideline',
    icon: ExternalLinkIcon,
    href: 'https://ant.design'
  }
])


// 检查菜单项是否激活
const isActive = (item: MenuItem): boolean => {
  if (item.routeName) {
    return route.name === item.routeName
  }
  return false
}

// 处理菜单项点击
const handleMenuItemClick = (item: MenuItem, event: Event) => {
  // 如果菜单项被禁用，阻止默认行为
  if (item.disabled) {
    event.preventDefault()
    return
  }

  // 如果菜单项需要认证但用户未登录
  if (item.requiresAuth && !isAuthenticated.value) {
    event.preventDefault()
    // 显示提示信息
    alert(t('nav.loginRequired'))
    // 跳转到登录页面
    router.push('/login')
    return
  }

  // 如果当前已经在目标页面，且不是刷新操作，则阻止默认跳转
  if (item.routeName && route.name === item.routeName) {
    event.preventDefault()
    return
  }

  // 其他情况由默认路由处理
}

defineEmits<{
  close: []
}>()
</script>
