<template>
  <header class="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo和品牌区域 -->
        <div class="flex min-w-0 items-center space-x-6">
          <router-link
            to="/"
            class="flex items-center space-x-3 group transition-all duration-200"
          >
            <div class="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <LeafIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {{ t('header.brandName') }}
              </span>
              <p class="text-xs text-gray-500 font-medium -mt-1">
                {{ t('header.brandSubtitle') }}
              </p>
            </div>
          </router-link>

          <!-- 主导航菜单 -->
          <NavigationMenu class="hidden min-w-0 lg:block" />
        </div>

        <!-- 用户操作区域 -->
        <div class="flex items-center space-x-3">
          <button
            type="button"
            class="hidden sm:inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-primary-300 hover:text-primary-700"
            :aria-label="t('header.switchLanguage')"
            @click="switchLanguage"
          >
            {{ languageToggleLabel }}
          </button>

          <!-- 登录/注册按钮 -->
          <template v-if="!isAuthenticated">
            <router-link
              to="/login"
              class="text-gray-600 hover:text-primary-600 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-50"
            >
              {{ t('header.login') }}
            </router-link>
            <router-link
              to="/register"
              class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              {{ t('header.register') }}
            </router-link>
          </template>

          <!-- 用户已登录 -->
          <template v-else>
            <Dropdown
              :items="userMenuItems"
              class="hidden sm:block"
              @select="handleUserMenuSelect"
            >
              <template #trigger>
                <button class="flex items-center space-x-3 text-gray-600 hover:text-primary-600 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-50">
                  <div class="h-8 w-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                    {{ userInitials }}
                  </div>
                  <span>{{ user?.realName || t('header.myAccount') }}</span>
                </button>
              </template>
            </Dropdown>
          </template>

          <!-- 移动端菜单按钮 -->
          <button
            class="lg:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50"
            :aria-label="t('header.mobileMenu')"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <MenuIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- 移动端菜单 - 添加动画效果 -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="isMobileMenuOpen"
            class="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg"
          >
            <div class="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <!-- 移动端导航菜单 -->
              <NavigationMenuMobile @close="isMobileMenuOpen = false" />

              <!-- 移动端用户操作 -->
              <div class="border-t border-gray-200 pt-3 mt-3">
                <button
                  type="button"
                  class="mb-2 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-left text-sm font-semibold text-gray-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  @click="switchLanguage"
                >
                  {{ t('header.switchLanguage') }} · {{ languageToggleLabel }}
                </button>

                <template v-if="!isAuthenticated">
                  <router-link
                    to="/login"
                    class="block px-3 py-2.5 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    @click="isMobileMenuOpen = false"
                  >
                    {{ t('header.login') }}
                  </router-link>
                  <router-link
                    to="/register"
                    class="block px-3 py-2.5 text-base font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-all duration-200 mt-2"
                    @click="isMobileMenuOpen = false"
                  >
                    {{ t('header.register') }}
                  </router-link>
                </template>
                <template v-else>
                  <router-link
                    to="/profile"
                    class="block px-3 py-2.5 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    @click="isMobileMenuOpen = false"
                  >
                    {{ t('header.profile') }}
                  </router-link>
                  <button
                    class="w-full text-left px-3 py-2.5 text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    @click="handleLogout"
                  >
                    {{ t('header.logout') }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LeafIcon, MenuIcon, LogOutIcon, UserIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/store/modules/auth'
import { useLocaleStore } from '@/store/modules/locale'
import NavigationMenu from './NavigationMenu.vue'
import NavigationMenuMobile from './NavigationMenuMobile.vue'
import Dropdown from '@/components/ui/Dropdown.vue'

// 移动端菜单状态
const isMobileMenuOpen = ref(false)
const localeStore = useLocaleStore()
const { t } = useI18n()

// 从store获取认证状态和路由
const authStore = useAuthStore()
const router = useRouter()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const languageToggleLabel = computed(() => (localeStore.locale === 'zh-CN'
  ? t('header.switchToEnglish')
  : t('header.switchToChinese')))
const userMenuItems = computed(() => [
  {
    key: 'profile',
    label: t('header.profile'),
    icon: UserIcon
  },
  {
    key: 'logout',
    label: t('header.logout'),
    icon: LogOutIcon,
    divided: true,
    danger: true
  }
])

// 计算用户名首字母
const userInitials = computed(() => {
  const name = user.value?.realName || t('header.myAccount')
  return name.charAt(0)
})

const switchLanguage = () => {
  localeStore.toggleLocale()
}

const handleUserMenuSelect = (item: { key?: string }) => {
  if (item.key === 'profile') {
    router.push('/profile')
    return
  }

  if (item.key === 'logout') {
    handleLogout()
  }
}

const handleLogout = () => {
  // 处理退出登录逻辑
  authStore.logout()
  isMobileMenuOpen.value = false

  // 退出登录后跳转到登录页面，使用replace避免用户点击后退按钮返回已退出的页面
  router.replace('/login')
}
</script>
