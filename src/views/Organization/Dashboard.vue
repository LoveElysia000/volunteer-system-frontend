<template>
  <div class="space-y-8">
    <!-- 欢迎区域 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div class="space-y-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            欢迎回来，{{ user?.realName || '组织管理者' }}！
          </h1>
          <p class="mt-2 text-lg text-gray-600">
            管理您的组织，创造更大的环保价值
          </p>
        </div>
        <div class="flex items-center text-sm text-gray-500">
          <CalendarIcon class="h-4 w-4 mr-2" />
          <span>今天是 {{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <!-- 创建活动 -->
      <router-link
        to="/organization/activities/create"
        class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 md:p-5 lg:p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm md:text-base lg:text-lg font-semibold">
              创建活动
            </h3>
            <p class="text-blue-100 text-xs md:text-sm mt-1">
              组织新的志愿者活动
            </p>
          </div>
          <PlusIcon class="h-6 md:h-7 lg:h-8 w-6 md:w-7 lg:w-8 text-blue-200" />
        </div>
        <div class="mt-4 text-xs md:text-sm">
          点击开始创建
        </div>
      </router-link>

      <!-- 管理志愿者 -->
      <router-link
        to="/organization/volunteers"
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 md:p-5 lg:p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm md:text-base lg:text-lg font-semibold">
              管理志愿者
            </h3>
            <p class="text-green-100 text-xs md:text-sm mt-1">
              查看和管理志愿者信息
            </p>
          </div>
          <UsersIcon class="h-6 md:h-7 lg:h-8 w-6 md:w-7 lg:w-8 text-green-200" />
        </div>
        <div class="mt-4 text-xs md:text-sm">
          查看志愿者列表
        </div>
      </router-link>

      <!-- 数据统计 -->
      <router-link
        to="/organization/statistics"
        class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 md:p-5 lg:p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm md:text-base lg:text-lg font-semibold">
              数据统计
            </h3>
            <p class="text-purple-100 text-xs md:text-sm mt-1">
              查看活动与志愿者统计
            </p>
          </div>
          <BarChartIcon class="h-6 md:h-7 lg:h-8 w-6 md:w-7 lg:w-8 text-purple-200" />
        </div>
        <div class="mt-4 text-xs md:text-sm">
          查看详细报告
        </div>
      </router-link>

      <!-- 组织信息 -->
      <router-link
        to="/organization/organization-info"
        class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 md:p-5 lg:p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm md:text-base lg:text-lg font-semibold">
              组织信息
            </h3>
            <p class="text-indigo-100 text-xs md:text-sm mt-1">
              完善组织基本信息
            </p>
          </div>
          <BuildingIcon class="h-6 md:h-7 lg:h-8 w-6 md:w-7 lg:w-8 text-indigo-200" />
        </div>
        <div class="mt-4 text-xs md:text-sm">
          更新组织资料
        </div>
      </router-link>
    </div>

    <!-- 数据概览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 活跃志愿者 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <UsersIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">
              活跃志愿者
            </p>
            <p class="text-2xl font-bold text-gray-900">
              158
            </p>
            <p class="text-xs text-green-600 mt-1">
              <TrendingUpIcon class="h-3 w-3 inline mr-1" />
              较上月增长 12%
            </p>
          </div>
        </div>
      </div>

      <!-- 近期活动 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <CalendarIcon class="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">
              近期活动
            </p>
            <p class="text-2xl font-bold text-gray-900">
              8
            </p>
            <p class="text-xs text-gray-500 mt-1">
              本月开展
            </p>
          </div>
        </div>
      </div>

      <!-- 服务总时长 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
            <ClockIcon class="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">
              服务总时长
            </p>
            <p class="text-2xl font-bold text-gray-900">
              245h
            </p>
            <p class="text-xs text-green-600 mt-1">
              <TrendingUpIcon class="h-3 w-3 inline mr-1" />
              累计贡献
            </p>
          </div>
        </div>
      </div>

      <!-- 待办事项 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
            <AlertCircleIcon class="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">
              待办事项
            </p>
            <p class="text-2xl font-bold text-gray-900">
              5
            </p>
            <p class="text-xs text-gray-500 mt-1">
              需要处理
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 待办事项提醒 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-900">
          待办事项
        </h2>
        <button class="text-blue-600 hover:text-blue-700 font-medium flex items-center">
          查看全部
          <ChevronRightIcon class="h-4 w-4 ml-1" />
        </button>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <div class="h-3 w-3 bg-red-500 rounded-full mr-3" />
            <span class="text-sm text-gray-700">3个活动申请等待审核</span>
          </div>
          <span class="text-xs text-gray-500">今天</span>
        </div>

        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <div class="h-3 w-3 bg-yellow-500 rounded-full mr-3" />
            <span class="text-sm text-gray-700">组织信息需要完善</span>
          </div>
          <span class="text-xs text-gray-500">2天前</span>
        </div>

        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <div class="h-3 w-3 bg-blue-500 rounded-full mr-3" />
            <span class="text-sm text-gray-700">7名新志愿者加入</span>
          </div>
          <span class="text-xs text-gray-500">3天前</span>
        </div>
      </div>
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
  UsersIcon,
  ClockIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  BuildingIcon
} from 'lucide-vue-next'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

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

// 模拟加载数据
onMounted(() => {
  console.log('组织管理者数据总览已加载')
})
</script>

<style scoped>
/* 自定义样式已通过Tailwind类实现 */
</style>