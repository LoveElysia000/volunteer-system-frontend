<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    <!-- 积分统计 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">
            当前积分
          </p>
          <p class="text-3xl font-bold text-gray-900 mt-1">
            {{ user?.points || 0 }}
          </p>
          <p class="text-xs text-green-600 mt-1 flex items-center">
            <TrendingUpIcon class="h-3 w-3 mr-1" />
            本月 +25
          </p>
        </div>
        <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
          <StarIcon class="h-6 w-6 text-green-600" />
        </div>
      </div>
    </div>

    <!-- 服务时长 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">
            服务时长
          </p>
          <p class="text-3xl font-bold text-gray-900 mt-1">
            {{ user?.totalHours || 0 }}<span class="text-lg text-gray-500">小时</span>
          </p>
          <p class="text-xs text-blue-600 mt-1 flex items-center">
            <ClockIcon class="h-3 w-3 mr-1" />
            本月 +3小时
          </p>
        </div>
        <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
          <ClockIcon class="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>

    <!-- 参与活动 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">
            参与活动
          </p>
          <p class="text-3xl font-bold text-gray-900 mt-1">
            8
          </p>
          <p class="text-xs text-purple-600 mt-1 flex items-center">
            <CalendarIcon class="h-3 w-3 mr-1" />
            本月 2个活动
          </p>
        </div>
        <div class="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
          <CalendarIcon class="h-6 w-6 text-purple-600" />
        </div>
      </div>
    </div>

    <!-- 志愿者等级 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">
            志愿者等级
          </p>
          <p class="text-3xl font-bold text-gray-900 mt-1">
            Lv.{{ volunteerLevel }}
          </p>
          <p class="text-xs text-orange-600 mt-1 flex items-center">
            <AwardIcon class="h-3 w-3 mr-1" />
            还需 {{ hoursToNextLevel }} 小时升级
          </p>
        </div>
        <div class="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
          <AwardIcon class="h-6 w-6 text-orange-600" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import {
  StarIcon,
  ClockIcon,
  CalendarIcon,
  AwardIcon,
  TrendingUpIcon
} from 'lucide-vue-next'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// 计算志愿者等级
const volunteerLevel = computed(() => {
  const hours = user.value?.totalHours || 0
  return Math.floor(hours / 10) + 1
})

// 计算升级所需小时数
const hoursToNextLevel = computed(() => {
  const hours = user.value?.totalHours || 0
  const nextLevelHours = volunteerLevel.value * 10
  return nextLevelHours - hours
})
</script>

<style scoped>
/* 自定义样式已通过Tailwind类实现 */
</style>