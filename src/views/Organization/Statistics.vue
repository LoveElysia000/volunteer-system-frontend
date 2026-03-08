<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        数据统计
      </h1>
      <div class="flex space-x-2">
        <select class="select select-sm">
          <option>本月</option>
          <option>本季度</option>
          <option>本年</option>
        </select>
        <button class="btn btn-sm btn-outline">
          导出报告
        </button>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="text-center">
          <div class="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ActivityIcon class="h-8 w-8 text-blue-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900">
            8
          </h3>
          <p class="text-sm text-gray-600">
            本月活动数量
          </p>
          <p class="text-xs text-green-600 mt-1">
            较上月增长 33%
          </p>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="text-center">
          <div class="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon class="h-8 w-8 text-green-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900">
            158
          </h3>
          <p class="text-sm text-gray-600">
            参与志愿者总数
          </p>
          <p class="text-xs text-green-600 mt-1">
            较上月增长 12%
          </p>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="text-center">
          <div class="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClockIcon class="h-8 w-8 text-orange-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900">
            245h
          </h3>
          <p class="text-sm text-gray-600">
            总服务时长
          </p>
          <p class="text-xs text-green-600 mt-1">
            贡献价值显著
          </p>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 活动趋势图 -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold mb-4">
          活动参与趋势
        </h3>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <BarChartIcon class="h-16 w-16 text-gray-300" />
          <span class="ml-2 text-gray-500">活动参与趋势图表</span>
        </div>
      </div>

      <!-- 志愿者活跃度 -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold mb-4">
          志愿者活跃度分布
        </h3>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <PieChartIcon class="h-16 w-16 text-gray-300" />
          <span class="ml-2 text-gray-500">活跃度分布图表</span>
        </div>
      </div>
    </div>

    <!-- 详细数据表格 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold">
          活动详细数据
        </h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                活动名称
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                日期
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                参与人数
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                服务时长
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                满意度
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="activity in activityStats"
              :key="activity.id"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ activity.name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ activity.date }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ activity.participants }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ activity.hours }}h
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ activity.rating }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ActivityIcon, UsersIcon, ClockIcon, BarChartIcon, PieChartIcon } from 'lucide-vue-next'

const activityStats = ref([
  {
    id: 1,
    name: '城市公园清洁活动',
    date: '2026-01-20',
    participants: 25,
    hours: 3,
    rating: '4.9'
  },
  {
    id: 2,
    name: '环保知识讲座',
    date: '2026-01-18',
    participants: 15,
    hours: 2,
    rating: '4.7'
  },
  {
    id: 3,
    name: '河流清理志愿者活动',
    date: '2026-01-15',
    participants: 32,
    hours: 4,
    rating: '4.8'
  }
])
</script>