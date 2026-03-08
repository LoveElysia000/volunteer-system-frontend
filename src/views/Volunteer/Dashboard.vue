<template>
  <div class="space-y-8">
    <!-- 欢迎区域 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div class="space-y-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            欢迎回来，{{ user?.realName || '志愿者' }}！
          </h1>
          <p class="mt-2 text-lg text-gray-600">
            感谢您为环保事业做出的贡献
          </p>
        </div>
        <div class="flex items-center text-sm text-gray-500">
          <CalendarIcon class="h-4 w-4 mr-2" />
          <span>今天是 {{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 md:p-5 lg:p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm md:text-base lg:text-lg font-semibold">
              报名活动
            </h3>
            <p class="text-green-100 text-xs md:text-sm mt-1">
              发现新的志愿者机会
            </p>
          </div>
          <PlusIcon class="h-6 md:h-7 lg:h-8 w-6 md:w-7 lg:w-8 text-green-200" />
        </div>
        <button class="mt-4 w-full bg-white text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-all duration-200 transform hover:scale-[1.02] shadow-sm text-sm md:text-base">
          浏览活动
        </button>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 md:p-5 lg:p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm md:text-base lg:text-lg font-semibold">
              查看记录
            </h3>
            <p class="text-blue-100 text-xs md:text-sm mt-1">
              累计贡献一目了然
            </p>
          </div>
          <BarChartIcon class="h-6 md:h-7 lg:h-8 w-6 md:w-7 lg:w-8 text-blue-200" />
        </div>
        <button class="mt-4 w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm md:text-base">
          查看详情
        </button>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 md:p-5 lg:p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm md:text-base lg:text-lg font-semibold">
              完善资料
            </h3>
            <p class="text-purple-100 text-xs md:text-sm mt-1">
              更新您的个人信息
            </p>
          </div>
          <UserIcon class="h-6 md:h-7 lg:h-8 w-6 md:w-7 lg:w-8 text-purple-200" />
        </div>
        <button class="mt-4 w-full bg-white text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-purple-50 transition-colors text-sm md:text-base">
          编辑资料
        </button>
      </div>
    </div>

    <!-- 数据概览 -->
    <StatsOverview />

    <!-- 即将开始的活动 -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">
          即将开始的活动
        </h2>
        <router-link
          to="/volunteer/activities"
          class="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          查看全部
          <ChevronRightIcon class="h-4 w-4 ml-1" />
        </router-link>
      </div>
      <UpcomingActivities />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import {
  CalendarIcon,
  ChevronRightIcon,
  PlusIcon,
  BarChartIcon,
  UserIcon
} from 'lucide-vue-next'
import StatsOverview from '@/components/volunteer/StatsOverview.vue'
import UpcomingActivities from '@/components/volunteer/UpcomingActivities.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// 计算用户名首字母
const userInitials = computed(() => {
  const name = user.value?.realName || '志愿者'
  return name.charAt(0)
})

// 计算当前日期
const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// 计算志愿者等级（模拟数据）
const volunteerLevel = computed(() => {
  const hours = user.value?.totalHours || 0
  return Math.floor(hours / 10) + 1
})

const volunteerLevelPercentage = computed(() => {
  const hours = user.value?.totalHours || 0
  return (hours % 10) * 10
})

// 模拟加载数据
onMounted(() => {
  console.log('志愿者数据总览已加载')
})
</script>

<style scoped>
/* 自定义样式已通过Tailwind类实现 */
</style>