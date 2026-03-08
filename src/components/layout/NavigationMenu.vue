<template>
  <nav class="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-center items-center h-16">
        <!-- 主导航菜单 -->
        <div class="flex items-center space-x-1">
          <!-- 使用条件渲染，禁用状态显示为普通span，非禁用状态显示为router-link -->
          <div
            v-for="item in menuItems"
            :key="item.key"
          >
            <template v-if="!item.disabled">
              <router-link
                :to="item.to || { name: item.routeName }"
                class="group relative flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                :class="[
                  isActive(item)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                ]"
                @click="(event) => handleMenuItemClick(item, event)"
              >
                <component
                  :is="item.icon"
                  class="h-4 w-4 shrink-0"
                  :class="isActive(item) ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'"
                />
                <span>{{ item.label }}</span>

                <!-- 活动指示器 -->
                <span
                  v-if="isActive(item)"
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                />
              </router-link>
            </template>
            <template v-else>
              <span
                class="group relative flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg opacity-50 cursor-not-allowed text-gray-400"
              >
                <component
                  :is="item.icon"
                  class="h-4 w-4 shrink-0 text-gray-400"
                />
                <span>{{ item.label }}</span>
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import {
  HomeIcon,
  CalendarIcon,
  InfoIcon,
  UsersIcon,
  BuildingIcon
} from 'lucide-vue-next'

interface MenuItem {
  key: string
  label: string
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
const authStore = useAuthStore()
const router = useRouter()

// 获取from路由信息（用于判断是否来自其他页面）
const from = ref()
router.afterEach((to, fromRoute) => {
  from.value = fromRoute
})

// 认证状态
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

// 菜单项配置
const menuItems = computed<MenuItem[]>(() => {
  const baseItems = [
    {
      key: 'home',
      label: '首页',
      icon: HomeIcon,
      routeName: 'home'
    },
    {
      key: 'popular-activities',
      label: '热门活动',
      icon: CalendarIcon,
      routeName: 'activities'
    }
  ]

  // 平台介绍菜单项
  const aboutItem = {
    key: 'about',
    label: '平台介绍',
    icon: InfoIcon,
    routeName: 'about'
  }

  // 权限控制菜单项
  const permissionItems = [
    {
      key: 'volunteer-center',
      label: '志愿者中心',
      icon: UsersIcon,
      routeName: 'volunteer',
      disabled: isAuthenticated.value && user.value?.role !== 'volunteer',
      requiresAuth: true
    },
    {
      key: 'organization-center',
      label: '组织管理者中心',
      icon: BuildingIcon,
      routeName: 'organization',
      disabled: isAuthenticated.value && user.value?.role !== 'organization',
      requiresAuth: true
    }
  ]

  return [...baseItems, ...permissionItems, aboutItem]
})

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
    alert('请先登录访问该功能')
    // 跳转到登录页面
    router.push('/login')
    return
  }

  // 如果当前已经在目标页面，且不是刷新操作，则阻止默认跳转
  if (item.routeName && route.name === item.routeName && from.value?.name) {
    event.preventDefault()
    return
  }

  // 其他情况由默认路由处理
}

</script>

<style scoped>
/* 自定义样式可以通过Tailwind类实现，这里可以添加一些微调 */
.group:hover .submenu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
</style>