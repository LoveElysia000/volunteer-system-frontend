<template>
  <div class="space-y-8">
    <!-- 页面标题 -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            个人记录
          </h1>
          <p class="mt-2 text-lg text-gray-600">
            查看您的志愿服务记录和成就
          </p>
        </div>

        <!-- 时间筛选 -->
        <div class="flex space-x-4">
          <select
            v-model="timeRange"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">
              全部时间
            </option>
            <option value="month">
              本月
            </option>
            <option value="quarter">
              本季度
            </option>
            <option value="year">
              本年
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 统计卡片 -->
      <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-primary-100">
              累计服务时长
            </p>
            <p class="text-3xl font-bold mt-1">
              {{ stats.totalHours }}<span class="text-xl">小时</span>
            </p>
            <p class="text-sm text-primary-200 mt-1">
              排名前 10%
            </p>
          </div>
          <ClockIcon class="h-8 w-8 text-primary-200 opacity-70" />
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-100">
              累计获得积分
            </p>
            <p class="text-3xl font-bold mt-1">
              {{ stats.totalPoints }}
            </p>
            <p class="text-sm text-green-200 mt-1">
              可兑换奖励
            </p>
          </div>
          <StarIcon class="h-8 w-8 text-green-200 opacity-70" />
        </div>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-100">
              参与活动数
            </p>
            <p class="text-3xl font-bold mt-1">
              {{ stats.totalActivities }}
            </p>
            <p class="text-sm text-blue-200 mt-1">
              影响人数 500+
            </p>
          </div>
          <UsersIcon class="h-8 w-8 text-blue-200 opacity-70" />
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 时长趋势图 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          服务时长趋势
        </h3>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <div class="text-center text-gray-500">
            <BarChartIcon class="h-12 w-12 mx-auto mb-2" />
            <p>时长趋势图表</p>
            <p class="text-sm">
              (图表示例)
            </p>
          </div>
        </div>
      </div>

      <!-- 活动类型分布 -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          活动类型分布
        </h3>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <div class="text-center text-gray-500">
            <PieChartIcon class="h-12 w-12 mx-auto mb-2" />
            <p>活动类型图表</p>
            <p class="text-sm">
              (图表示例)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细记录 -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-900">
          活动记录明细
        </h3>
        <button class="text-primary-600 hover:text-primary-700 font-medium">
          导出记录
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-900">
                活动名称
              </th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-900">
                日期
              </th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-900">
                时长
              </th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-900">
                积分
              </th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-900">
                状态
              </th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-900">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in activityRecords"
              :key="record.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-4 px-4">
                <div>
                  <p class="font-medium text-gray-900">
                    {{ record.activityName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ record.location }}
                  </p>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-gray-600">
                {{ record.date }}
              </td>
              <td class="py-4 px-4 text-sm text-gray-600">
                {{ record.hours }}小时
              </td>
              <td class="py-4 px-4 text-sm font-medium text-green-600">
                +{{ record.points }}
              </td>
              <td class="py-4 px-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(record.status)"
                >
                  {{ getStatusText(record.status) }}
                </span>
              </td>
              <td class="py-4 px-4">
                <button
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  @click="handleViewRecord(record.id)"
                >
                  查看详情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between mt-6">
        <p class="text-sm text-gray-600">
          显示第 1-{{ Math.min(activityRecords.length, 10) }} 条，共 {{ activityRecords.length }} 条记录
        </p>
        <div class="flex space-x-2">
          <button
            class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            disabled
          >
            上一页
          </button>
          <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 成就徽章 -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h3 class="text-xl font-semibold text-gray-900 mb-6">
        成就徽章
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div
          v-for="badge in badges"
          :key="badge.id"
          class="text-center"
        >
          <div
            class="h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-2"
            :class="badge.earned ? 'bg-yellow-100' : 'bg-gray-100'"
          >
            <AwardIcon
              class="h-8 w-8"
              :class="badge.earned ? 'text-yellow-600' : 'text-gray-400'"
            />
          </div>
          <p class="text-sm font-medium">
            {{ badge.name }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            {{ badge.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import {
  ClockIcon,
  StarIcon,
  UsersIcon,
  BarChartIcon,
  PieChartIcon,
  AwardIcon
} from 'lucide-vue-next'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// 状态管理
const timeRange = ref('all')

// 统计数据
const stats = computed(() => ({
  totalHours: user.value?.totalHours || 0,
  totalPoints: user.value?.points || 0,
  totalActivities: 8
}))

// 活动记录
interface ActivityRecord {
  id: number
  activityName: string
  location: string
  date: string
  hours: number
  points: number
  status: 'completed' | 'pending' | 'cancelled'
}

const activityRecords = ref<ActivityRecord[]>([
  {
    id: 1,
    activityName: '社区垃圾分类指导活动',
    location: '朝阳社区中心',
    date: '2024-01-15',
    hours: 3,
    points: 30,
    status: 'completed'
  },
  {
    id: 2,
    activityName: '公园清洁志愿者活动',
    location: '人民公园',
    date: '2024-01-10',
    hours: 2,
    points: 20,
    status: 'completed'
  },
  {
    id: 3,
    activityName: '环保知识宣传讲座',
    location: '环保教育中心',
    date: '2024-01-05',
    hours: 2,
    points: 15,
    status: 'completed'
  },
  {
    id: 4,
    activityName: '植树造林活动',
    location: '西山森林公园',
    date: '2023-12-28',
    hours: 4,
    points: 40,
    status: 'completed'
  },
  {
    id: 5,
    activityName: '河流清理活动',
    location: '城市河岸',
    date: '2023-12-20',
    hours: 3,
    points: 30,
    status: 'completed'
  }
])

// 成就徽章
interface Badge {
  id: number
  name: string
  description: string
  earned: boolean
}

const badges = ref<Badge[]>([
  {
    id: 1,
    name: '环保新星',
    description: '首次参与活动',
    earned: true
  },
  {
    id: 2,
    name: '热心志愿者',
    description: '参与5次活动',
    earned: true
  },
  {
    id: 3,
    name: '环保达人',
    description: '参与10次活动',
    earned: false
  },
  {
    id: 4,
    name: '时长冠军',
    description: '累计50小时服务',
    earned: false
  },
  {
    id: 5,
    name: '环保宣传员',
    description: '参与3次宣传活动',
    earned: true
  },
  {
    id: 6,
    name: '团队之星',
    description: '组织团队活动',
    earned: false
  }
])

// 获取状态显示文本
const getStatusText = (status: string) => {
  const statusMap = {
    completed: '已完成',
    pending: '待确认',
    cancelled: '已取消'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classMap[status as keyof typeof classMap] || 'bg-gray-100 text-gray-800'
}

// 查看记录详情
const handleViewRecord = (recordId: number) => {
  console.log('查看记录详情:', recordId)
  // 这里可以跳转到记录详情页面
}
</script>

<style scoped>
/* 自定义样式已通过Tailwind类实现 */
</style>