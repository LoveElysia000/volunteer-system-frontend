<template>
  <div class="space-y-4">
    <!-- 活动列表 -->
    <div
      v-for="activity in upcomingActivities"
      :key="activity.id"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div class="flex flex-col md:flex-row md:items-center gap-6">
        <!-- 活动图片 -->
        <div class="w-full md:w-32 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
          <CalendarIcon class="h-8 w-8 text-green-600" />
        </div>

        <!-- 活动信息 -->
        <div class="flex-1 space-y-3">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ activity.title }}
              </h3>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(activity.status)"
              >
                {{ getStatusText(activity.status) }}
              </span>
            </div>
            <p class="text-gray-600">
              {{ activity.description }}
            </p>
          </div>

          <!-- 活动详情 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div class="flex items-center gap-2">
              <CalendarIcon class="h-4 w-4 text-gray-400" />
              <span class="text-gray-600">{{ activity.date }}</span>
            </div>
            <div class="flex items-center gap-2">
              <MapPinIcon class="h-4 w-4 text-gray-400" />
              <span class="text-gray-600">{{ activity.location }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UsersIcon class="h-4 w-4 text-gray-400" />
              <span class="text-gray-600">{{ activity.participants }}/{{ activity.capacity }}</span>
            </div>
            <div class="flex items-center gap-2">
              <ClockIcon class="h-4 w-4 text-gray-400" />
              <span class="text-gray-600">{{ activity.duration }}小时</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex flex-col gap-3">
          <button
            v-if="activity.status === 'registered'"
            class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 text-center font-medium"
            @click="handleViewDetails(activity.id)"
          >
            查看详情
          </button>
          <button
            v-else-if="activity.status === 'upcoming'"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-center font-medium"
            @click="handleRegister(activity.id)"
          >
            立即报名
          </button>
          <button
            v-else
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center font-medium"
            @click="handleViewDetails(activity.id)"
          >
            查看详情
          </button>

          <button
            class="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center font-medium"
            @click="handleShare(activity.id)"
          >
            分享活动
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-if="upcomingActivities.length === 0"
      class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center"
    >
      <div class="space-y-4">
        <CalendarIcon class="h-12 w-12 text-primary-400 mx-auto" />
        <p class="text-lg text-gray-700 font-medium">
          暂无即将开始的活动
        </p>
        <p class="text-sm text-gray-600">
          您可以浏览活动列表发现更多志愿者机会
        </p>
        <button class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium">
          浏览活动
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon
} from 'lucide-vue-next'

interface Activity {
  id: number
  title: string
  description: string
  date: string
  location: string
  participants: number
  capacity: number
  duration: number
  status: 'upcoming' | 'registered' | 'completed'
}

// 模拟数据
const upcomingActivities = ref<Activity[]>([
  {
    id: 1,
    title: '社区垃圾分类指导活动',
    description: '帮助社区居民正确进行垃圾分类，推广环保理念',
    date: '2024-01-20 09:00',
    location: '朝阳社区中心',
    participants: 15,
    capacity: 30,
    duration: 3,
    status: 'registered'
  },
  {
    id: 2,
    title: '公园清洁志愿者活动',
    description: '共同维护城市公园的清洁环境，创造美好家园',
    date: '2024-01-22 14:00',
    location: '人民公园',
    participants: 8,
    capacity: 20,
    duration: 2,
    status: 'upcoming'
  },
  {
    id: 3,
    title: '环保知识宣传讲座',
    description: '向社区居民普及环保知识，提高环保意识',
    date: '2024-01-25 10:00',
    location: '环保教育中心',
    participants: 12,
    capacity: 50,
    duration: 2,
    status: 'upcoming'
  }
])

// 获取状态显示文本
const getStatusText = (status: string) => {
  const statusMap = {
    upcoming: '可报名',
    registered: '已报名',
    completed: '已完成'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap = {
    upcoming: 'bg-green-100 text-green-800',
    registered: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800'
  }
  return classMap[status as keyof typeof classMap] || 'bg-gray-100 text-gray-800'
}

// 报名活动
const handleRegister = (activityId: number) => {
  console.log('报名活动:', activityId)
  // 这里可以调用API进行报名
}

// 查看详情
const handleViewDetails = (activityId: number) => {
  console.log('查看活动详情:', activityId)
  // 这里可以跳转到活动详情页面
}

// 分享活动
const handleShare = (activityId: number) => {
  console.log('分享活动:', activityId)
  // 这里可以实现分享功能
}
</script>

<style scoped>
/* 自定义样式已通过Tailwind类实现 */
</style>