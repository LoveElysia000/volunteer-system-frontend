<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    <!-- 积分统计 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 card-hover">
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
        <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center card-icon">
          <StarIcon class="h-6 w-6 text-green-600" />
        </div>
      </div>
      <!-- 积分进度条 -->
      <div class="mt-4">
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>等级 {{ volunteerLevel }}</span>
          <span>下一级 {{ volunteerLevel + 1 }}</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: levelProgressPercentage + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- 服务时长 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 card-hover">
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
        <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center card-icon">
          <ClockIcon class="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <!-- 年度目标进度 -->
      <div class="mt-4 flex items-center gap-3">
        <CircularProgress
          :percentage="yearProgressPercentage"
          :size="56"
          :stroke-width="4"
          progress-color="#3b82f6"
          text-color-class="text-xs font-semibold text-blue-600"
          class="card-icon"
        />
        <div class="flex-1">
          <p class="text-xs text-gray-500">
            年度目标
          </p>
          <p class="text-sm font-semibold text-gray-900">
            {{ user?.totalHours || 0 }}/100 小时
          </p>
        </div>
      </div>
    </div>

    <!-- 参与活动 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 card-hover">
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
        <div class="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center card-icon">
          <CalendarIcon class="h-6 w-6 text-purple-600" />
        </div>
      </div>
      <!-- 活动类型分布 -->
      <div class="mt-4 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500">社区服务</span>
          <div class="flex items-center gap-2">
            <div class="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-purple-500 rounded-full"
                style="width: 60%"
              />
            </div>
            <span class="text-gray-700 w-6">5</span>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500">环保宣传</span>
          <div class="flex items-center gap-2">
            <div class="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-green-500 rounded-full"
                style="width: 30%"
              />
            </div>
            <span class="text-gray-700 w-6">2</span>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500">其他</span>
          <div class="flex items-center gap-2">
            <div class="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-orange-500 rounded-full"
                style="width: 10%"
              />
            </div>
            <span class="text-gray-700 w-6">1</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 志愿者等级 - 使用CircularProgress -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 card-hover">
      <div class="flex items-center gap-4">
        <CircularProgress
          :current="currentLevelHours"
          :max="10"
          :size="72"
          :stroke-width="6"
          progress-color="url(#level-gradient)"
          text-color-class="text-lg font-bold text-gray-900"
          class="card-icon flex-shrink-0"
          :show-percentage="false"
        >
          <div class="text-center">
            <span class="text-2xl font-bold text-gray-900">{{ volunteerLevel }}</span>
            <span class="text-xs text-gray-500 block">级</span>
          </div>
        </CircularProgress>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-600">
            志愿者等级
          </p>
          <p class="text-xl font-bold text-gray-900 mt-1">
            Lv.{{ volunteerLevel }}
          </p>
          <p class="text-xs text-orange-600 mt-1">
            还需 {{ hoursToNextLevel }} 小时升级
          </p>
        </div>
      </div>
      <!-- 等级进度 -->
      <div class="mt-4 pt-4 border-t border-gray-100">
        <div class="flex justify-between text-xs text-gray-500">
          <span>当前进度</span>
          <span>{{ currentLevelHours }}/10 小时</span>
        </div>
        <div class="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
            :style="{ width: (currentLevelHours / 10 * 100) + '%' }"
          />
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
import CircularProgress from '@/components/ui/CircularProgress.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// 计算志愿者等级
const volunteerLevel = computed(() => {
  const hours = user.value?.totalHours || 0
  return Math.floor(hours / 10) + 1
})

// 计算当前等级已积累的小时数
const currentLevelHours = computed(() => {
  const hours = user.value?.totalHours || 0
  return hours % 10
})

// 计算升级所需小时数
const hoursToNextLevel = computed(() => {
  const hours = user.value?.totalHours || 0
  const nextLevelHours = volunteerLevel.value * 10
  return nextLevelHours - hours
})

// 等级进度百分比
const levelProgressPercentage = computed(() => {
  const hours = user.value?.totalHours || 0
  return ((hours % 10) / 10) * 100
})

// 年度目标进度
const yearProgressPercentage = computed(() => {
  const hours = user.value?.totalHours || 0
  return Math.min((hours / 100) * 100, 100)
})
</script>

<style scoped>
/* 使用 Tailwind classes */
</style>

