<template>
  <div class="space-y-8">
    <!-- 轮播图区域 -->
    <div class="pt-8">
      <div class="relative w-full max-w-4xl mx-auto">
        <Carousel
          :slides="featuredActivities"
          :autoplay="true"
          :autoplay-interval="5000"
          :show-arrows="true"
          :show-dots="false"
          :loop="true"
          :pause-on-hover="true"
          height="h-64"
          class="rounded-2xl overflow-hidden"
          aria-label="热门活动轮播图"
        />
      </div>
    </div>

    <!-- 页面标题区域 -->
    <div>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div class="space-y-4">
          <div>
            <h1 class="text-4xl font-bold text-gray-900">
              热门活动
            </h1>
            <p class="mt-2 text-lg text-gray-600">
              发现并参与您感兴趣的环保活动
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="grid gap-6">
      <!-- 活动卡片 -->
      <div v-scroll-fade:1 class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 card-hover" style="transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <!-- 活动图片占位 -->
          <div class="w-full md:w-48 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
            <CalendarIcon class="h-8 w-8 text-green-600" />
          </div>

          <!-- 活动信息 -->
          <div class="flex-1 space-y-3">
            <div class="space-y-2">
              <h3 class="text-xl font-semibold text-gray-900">
                社区垃圾分类指导活动
              </h3>
              <p class="text-gray-600">
                帮助社区居民正确进行垃圾分类，推广环保理念
              </p>
            </div>

            <!-- 活动详情 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div class="flex items-center gap-2">
                <CalendarIcon class="h-4 w-4 text-gray-400" />
                <span class="text-gray-600">2024-01-15</span>
              </div>
              <div class="flex items-center gap-2">
                <MapPinIcon class="h-4 w-4 text-gray-400" />
                <span class="text-gray-600">朝阳社区</span>
              </div>
              <div class="flex items-center gap-2">
                <UsersIcon class="h-4 w-4 text-gray-400" />
                <span class="text-gray-600">已报名: 25/50</span>
              </div>
              <div class="flex items-center gap-2">
                <ClockIcon class="h-4 w-4 text-gray-400" />
                <span class="text-gray-600">3小时</span>
              </div>
            </div>
          </div>

          <!-- 报名按钮 -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 justify-end">
              <CircularProgress
                :current="25"
                :max="50"
                :size="44"
                :stroke-width="4"
                progress-color="#10b981"
                text-color-class="text-xs font-semibold text-gray-700"
                class="card-icon"
              />
              <span class="text-xs text-gray-500">25/50</span>
            </div>
            <router-link
              to="/login"
              class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-center font-medium btn-interactive btn-ripple"
            >
              立即报名
            </router-link>
            <router-link
              to="/activities/1"
              class="px-6 py-3 text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 text-center font-medium btn-interactive"
            >
              查看详情
            </router-link>
          </div>
        </div>
      </div>

      <!-- 占位说明 -->
      <div class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
        <div class="space-y-4">
          <p class="text-lg text-gray-700 font-medium">
            更多精彩活动即将上线...
          </p>
          <p class="text-sm text-gray-600">
            我们正在精心准备更多有意义的环保活动
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from 'lucide-vue-next'
import Carousel from '@/components/ui/Carousel.vue'
import CircularProgress from '@/components/ui/CircularProgress.vue'
import vScrollFade from '@/directives/vScrollFade'

// 特色活动数据
const featuredActivities = [
  {
    id: 1,
    type: 'mixed',
    content: {
      title: '社区垃圾分类指导活动',
      description: '帮助社区居民正确进行垃圾分类，推广环保理念',
      date: '2024-01-20',
      location: '朝阳社区'
    }
  },
  {
    id: 2,
    type: 'mixed',
    content: {
      title: '公园清洁志愿者活动',
      description: '共同维护城市公园的清洁环境，创造美好家园',
      date: '2024-01-25',
      location: '人民公园'
    }
  },
  {
    id: 3,
    type: 'mixed',
    content: {
      title: '环保知识讲座',
      description: '学习环保知识，提高环保意识，共建绿色家园',
      date: '2024-02-01',
      location: '环保中心'
    }
  },
  {
    id: 4,
    type: 'mixed',
    content: {
      title: '植树造林活动',
      description: '参与植树造林，为城市增添绿色，改善生态环境',
      date: '2024-02-10',
      location: '西山森林公园'
    }
  }
]
</script>