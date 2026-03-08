<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        志愿者管理
      </h1>
    </div>

    <!-- 志愿者统计 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <UsersIcon class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">
              总志愿者
            </p>
            <p class="text-2xl font-bold">
              158
            </p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <ActivityIcon class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">
              活跃志愿者
            </p>
            <p class="text-2xl font-bold">
              89
            </p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
            <ClockIcon class="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">
              总服务时长
            </p>
            <p class="text-2xl font-bold">
              245h
            </p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <StarIcon class="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">
              平均评分
            </p>
            <p class="text-2xl font-bold">
              4.8
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 志愿者列表 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            志愿者列表
          </h2>
          <div class="flex space-x-2">
            <input
              type="text"
              class="input input-sm"
              placeholder="搜索志愿者..."
            >
            <select class="select select-sm">
              <option>全部志愿者</option>
              <option>活跃志愿者</option>
              <option>新加入</option>
            </select>
          </div>
        </div>
      </div>

      <div class="divide-y divide-gray-200">
        <div
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          class="p-6 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                {{ volunteer.initials }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">
                  {{ volunteer.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ volunteer.email }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">服务时长: {{ volunteer.hours }}h</span>
              <span class="text-sm text-gray-500">参与活动: {{ volunteer.activities }}</span>
              <span :class="`px-2 py-1 rounded-full text-xs font-medium ${volunteer.statusClass}`">
                {{ volunteer.status }}
              </span>
              <button class="btn btn-sm btn-outline">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UsersIcon, ActivityIcon, ClockIcon, StarIcon } from 'lucide-vue-next'

const volunteers = ref([
  {
    id: 1,
    name: '张三',
    initials: '张',
    email: 'zhangsan@example.com',
    hours: 25,
    activities: 8,
    status: '活跃',
    statusClass: 'bg-green-100 text-green-800'
  },
  {
    id: 2,
    name: '李四',
    initials: '李',
    email: 'lisi@example.com',
    hours: 18,
    activities: 5,
    status: '活跃',
    statusClass: 'bg-green-100 text-green-800'
  },
  {
    id: 3,
    name: '王五',
    initials: '王',
    email: 'wangwu@example.com',
    hours: 32,
    activities: 10,
    status: '非常活跃',
    statusClass: 'bg-blue-100 text-blue-800'
  }
])
</script>