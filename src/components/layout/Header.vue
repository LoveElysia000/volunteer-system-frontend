<template>
  <header class="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-0 z-50">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo和品牌区域 -->
        <div class="flex items-center space-x-8">
          <router-link
            to="/"
            class="flex items-center space-x-3 group transition-all duration-200"
          >
            <div class="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <LeafIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                环保志愿者
              </span>
              <p class="text-xs text-gray-500 font-medium -mt-1">
                Eco Volunteer Platform
              </p>
            </div>
          </router-link>

          <!-- 主导航菜单 -->
          <NavigationMenu class="hidden lg:block" />
        </div>

        <!-- 用户操作区域 -->
        <div class="flex items-center space-x-3">
          <!-- 登录/注册按钮 -->
          <template v-if="!isAuthenticated">
            <router-link
              to="/login"
              class="text-gray-600 hover:text-primary-600 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-50"
            >
              登录
            </router-link>
            <router-link
              to="/register"
              class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              注册
            </router-link>
          </template>

          <!-- 用户已登录 -->
          <template v-else>
            <div class="relative group">
              <button class="flex items-center space-x-3 text-gray-600 hover:text-primary-600 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-50">
                <div class="h-8 w-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                  {{ userInitials }}
                </div>
                <span>{{ user?.realName || '我的账户' }}</span>
              </button>
              <div class="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <router-link
                  to="/profile"
                  class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  个人中心
                </router-link>
                <button
                  class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  @click="handleLogout"
                >
                  退出登录
                </button>
              </div>
            </div>
          </template>

          <!-- 移动端菜单按钮 -->
          <button
            class="lg:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <MenuIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- 移动端菜单 -->
        <div
          v-if="isMobileMenuOpen"
          class="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
        >
          <div class="px-4 py-2 space-y-1">
            <!-- 移动端导航菜单 -->
            <NavigationMenuMobile @close="isMobileMenuOpen = false" />

            <!-- 移动端用户操作 -->
            <div class="border-t border-gray-200 pt-2">
              <template v-if="!isAuthenticated">
                <router-link
                  to="/login"
                  class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  @click="isMobileMenuOpen = false"
                >
                  登录
                </router-link>
                <router-link
                  to="/register"
                  class="block px-3 py-2 text-base font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors duration-200"
                  @click="isMobileMenuOpen = false"
                >
                  注册
                </router-link>
              </template>
              <template v-else>
                <router-link
                  to="/profile"
                  class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  @click="isMobileMenuOpen = false"
                >
                  个人中心
                </router-link>
                <button
                  class="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  @click="handleLogout"
                >
                  退出登录
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LeafIcon, MenuIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/store/modules/auth'
import NavigationMenu from './NavigationMenu.vue'
import NavigationMenuMobile from './NavigationMenuMobile.vue'

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 从store获取认证状态和路由
const authStore = useAuthStore()
const router = useRouter()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

// 计算用户名首字母
const userInitials = computed(() => {
  const name = user.value?.realName || '用户'
  return name.charAt(0)
})

const handleLogout = () => {
  // 处理退出登录逻辑
  authStore.logout()
  isMobileMenuOpen.value = false

  // 退出登录后跳转到登录页面，使用replace避免用户点击后退按钮返回已退出的页面
  router.replace('/login')
}
</script>