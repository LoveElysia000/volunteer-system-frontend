<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
  >
    <!-- 头部导航 -->
    <Header v-if="showHeader" />

    <!-- 主要内容区域 -->
    <main class="flex-1 min-h-[calc(100vh-4rem)]">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 xl:max-w-[1800px] 2xl:max-w-[2000px]">
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
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 xl:max-w-[1800px] 2xl:max-w-[2000px]">
        <div class="text-center text-gray-600 text-sm">
          <p>© 2026 环保志愿者平台. 致力于环境保护和志愿服务</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { usePageStateStore } from '@/store/modules/pageState'
import { useMessageStore } from '@/store/modules/messages'
import Header from '@/components/layout/Header.vue'
import MessageContainer from '@/components/ui/MessageContainer.vue'

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
</script>

<style scoped>
/* 布局样式已通过Tailwind类实现 */
</style>