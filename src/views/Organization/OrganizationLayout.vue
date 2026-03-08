<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex min-h-screen">
      <!-- 侧边栏 -->
      <div class="hidden lg:block w-64 xl:w-72 bg-white border-r border-gray-200 overflow-y-auto">
        <div class="min-h-full flex flex-col">
          <!-- Logo区域 -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <Building2Icon class="h-6 w-6 text-white" />
              </div>
              <div>
                <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  组织管理
                </span>
                <p class="text-xs text-gray-500 font-medium">
                  Organization Center
                </p>
              </div>
            </div>
          </div>

          <!-- 用户信息 -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center space-x-3">
              <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {{ userInitials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 truncate">
                  {{ user?.realName || '组织管理者' }}
                </p>
                <p class="text-sm text-gray-500 truncate">
                  组织管理者
                </p>
                <div class="flex items-center mt-1">
                  <div class="h-2 w-16 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-blue-500"
                      :style="{ width: '75%' }"
                    />
                  </div>
                  <span class="text-xs text-gray-500 ml-2">已认证</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 导航菜单 -->
          <div class="flex-1 p-4 overflow-y-auto">
            <OrganizationSidebar />
          </div>

          <!-- 退出登录 -->
          <div class="p-4 border-t border-gray-100">
            <button
              class="w-full flex items-center space-x-2 p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              @click="handleLogout"
            >
              <LogOutIcon class="h-4 w-4" />
              <span class="text-sm font-medium">退出登录</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 移动端头部 -->
        <div class="lg:hidden bg-white border-b border-gray-200 shadow-sm">
          <div class="px-4 py-3 flex items-center justify-between">
            <button
              class="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              @click="isMobileSidebarOpen = true"
            >
              <MenuIcon class="h-5 w-5" />
            </button>
            <div class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {{ userInitials }}
              </div>
              <span class="text-sm font-medium text-gray-700">{{ user?.realName || '组织管理者' }}</span>
            </div>
          </div>
        </div>

        <!-- 主要内容 -->
        <main class="flex-1 overflow-y-auto">
          <div class="p-4 lg:p-8 max-w-[calc(100vw-18rem)] xl:max-w-[calc(100vw-20rem)] 2xl:max-w-[1800px] mx-auto">
            <router-view v-slot="{ Component }">
              <keep-alive :include="cachedComponents">
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </div>
        </main>
      </div>
    </div>

    <!-- 移动端侧边栏遮罩 -->
    <div
      v-if="isMobileSidebarOpen"
      class="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
      @click="isMobileSidebarOpen = false"
    />

    <!-- 移动端侧边栏 -->
    <div
      v-if="isMobileSidebarOpen"
      class="lg:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300"
      :class="{ 'translate-x-0': isMobileSidebarOpen, '-translate-x-full': !isMobileSidebarOpen }"
    >
      <div class="h-full flex flex-col">
        <!-- 移动端头部 -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2Icon class="h-6 w-6 text-white" />
              </div>
              <span class="text-xl font-bold text-blue-600">组织管理中心</span>
            </div>
            <button
              class="p-2 rounded-lg text-gray-600 hover:text-blue-600"
              @click="isMobileSidebarOpen = false"
            >
              <XIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- 用户信息 -->
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {{ userInitials }}
            </div>
            <div>
              <p class="font-semibold text-gray-900">
                {{ user?.realName || '组织管理者' }}
              </p>
              <p class="text-sm text-gray-500">
                组织管理者
              </p>
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <div class="flex-1 p-4 overflow-y-auto">
          <OrganizationSidebar @close="isMobileSidebarOpen = false" />
        </div>

        <!-- 退出登录 -->
        <div class="p-4 border-t border-gray-100">
          <button
            class="w-full flex items-center space-x-2 p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            @click="handleLogout"
          >
            <LogOutIcon class="h-4 w-4" />
            <span class="text-sm font-medium">退出登录</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { Building2Icon, MenuIcon, XIcon, LogOutIcon } from 'lucide-vue-next'
import OrganizationSidebar from '@/components/organization/OrganizationSidebar.vue'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// 移动端侧边栏状态
const isMobileSidebarOpen = ref(false)

// 需要缓存的组件名称列表
const cachedComponents = ref([
  'OrganizationActivityManagement',
  'OrganizationVolunteerManagement',
  'OrganizationDataStatistics',
  'OrganizationSettings'
])

// 计算用户名首字母
const userInitials = computed(() => {
  const name = user.value?.realName || '组织管理者'
  return name.charAt(0)
})

// 处理退出登录
const handleLogout = () => {
  authStore.logout()
  // 使用replace而不是push，避免用户点击后退按钮返回已退出的页面
  router.replace('/')
  isMobileSidebarOpen.value = false
}
</script>

<style scoped>
/* 自定义样式已通过Tailwind类实现 */
</style>