<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
  >
    <!-- 头部导航 -->
    <Header v-if="showHeader" />

    <!-- 主要内容区域 -->
    <main class="flex-1 min-h-[calc(100vh-4rem)]">
      <router-view v-if="isFullWidthPage" />
      <div
        v-else
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <router-view />
      </div>
    </main>

    <!-- 消息容器 -->
    <MessageContainer position="top-right" />

    <!-- 页脚区域 -->
    <footer
      v-if="showHeader"
      class="bg-white border-t border-gray-200 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center text-gray-600 text-sm">
          <p>{{ t('app.footer.copyright') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/modules/auth'
import { usePageStateStore } from '@/store/modules/pageState'
import { useMessageStore } from '@/store/modules/messages'
import Header from '@/components/layout/Header.vue'
import MessageContainer from '@/components/ui/MessageContainer.vue'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const pageStateStore = usePageStateStore()
const messageStore = useMessageStore()

// 应用启动时恢复认证状态和页面状态
onMounted(() => {
  authStore.restoreAuthState()
  pageStateStore.restoreState()
  messageStore.restoreMessages()
})

// 在登录注册页面不显示头部导航
const showHeader = computed(() => {
  const routeName = route.name as string

  // 登录注册页面
  if (['login', 'register'].includes(routeName)) {
    return false
  }

  return true
})

// 防御性兜底：即使 route meta 被误改，about 仍按全宽页面渲染
const fullWidthRouteNames = new Set(['about'])

const isFullWidthPage = computed(() => {
  const routeName = typeof route.name === 'string' ? route.name : ''
  return Boolean(route.meta.fullWidth) || fullWidthRouteNames.has(routeName)
})
</script>

<style scoped>
/* 布局样式已通过Tailwind类实现 */
</style>
