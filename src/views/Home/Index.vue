<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center relative">
    <!-- 动态背景粒子 -->
    <EcoParticles
      intensity="medium"
      :enable-mouse-follow="true"
      :enable-click-ripple="true"
      :leaf-count="20"
    />
    <!-- 英雄区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- 左侧内容 -->
        <div class="space-y-8">
          <div class="space-y-4">
            <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight hero-fade-up">
              为地球
              <span class="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                贡献力量
              </span>
            </h1>
            <p class="text-xl text-gray-600 leading-relaxed hero-fade-up delay-100">
              加入环保志愿者平台，参与有意义的环保活动，
              与志同道合的人一起为保护地球环境贡献力量。
            </p>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-3 gap-6 py-4 hero-fade-up delay-200">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ volunteerCount }}+
              </div>
              <div class="text-sm text-gray-500">
                注册志愿者
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ activityCount }}+
              </div>
              <div class="text-sm text-gray-500">
                环保活动
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                {{ orgCount }}+
              </div>
              <div class="text-sm text-gray-500">
                合作组织
              </div>
            </div>
          </div>

          <!-- CTA 按钮 -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4 hero-fade-up delay-300">
            <router-link
              to="/register"
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              立即加入
              <ArrowRightIcon class="ml-2 h-5 w-5" />
            </router-link>
            <router-link
              to="/activities"
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
            >
              浏览活动
            </router-link>
          </div>
        </div>

        <!-- 右侧插图 - 简化设计 -->
        <div class="relative hero-fade-up delay-400">
          <div class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 shadow-xl border border-primary-100">
            <div class="aspect-square bg-white rounded-2xl shadow-sm flex items-center justify-center relative overflow-hidden">
              <!-- 简化背景装饰 -->
              <div class="absolute inset-0 opacity-5">
                <div class="absolute top-8 left-8 w-12 h-12 bg-primary-400 rounded-full" />
                <div class="absolute bottom-8 right-8 w-8 h-8 bg-green-400 rounded-full" />
              </div>

              <!-- 核心内容 -->
              <div class="text-center space-y-5 relative z-10">
                <!-- 图标 -->
                <div class="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto shadow-md">
                  <LeafIcon class="h-8 w-8 text-white" />
                </div>

                <!-- 文字 -->
                <div class="space-y-2">
                  <h3 class="text-xl font-bold text-primary-700">
                    环保志愿者平台
                  </h3>
                  <p class="text-base text-gray-600 leading-relaxed">
                    让环保成为一种
                    <span class="group relative inline-flex items-center gap-1 cursor-default">
                      <span class="relative font-semibold bg-gradient-to-r from-green-500 to-primary-600 bg-clip-text text-transparent transition-all duration-300 group-hover:-translate-y-0.5">
                        生活方式
                      </span>
                      <LeafIcon class="w-3 h-3 text-green-500 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:rotate-12 transition-all duration-300" />
                      <!-- 下划线动画 -->
                      <span class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-primary-400 rounded-full transition-all duration-500 group-hover:w-full" />
                    </span>
                  </p>
                </div>

                <!-- 简化标签 -->
                <div class="flex justify-center space-x-2">
                  <span class="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">可持续</span>
                  <span class="px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">社区</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeafIcon, ArrowRightIcon } from 'lucide-vue-next'
import EcoParticles from '@/components/background/EcoParticles.vue'
import { useCountUp } from '@/composables/useCountUp'

// 统计数据动画（自动在 onMounted 启动，在 onUnmounted 清理）
const { current: volunteerCount } = useCountUp(500)
const { current: activityCount } = useCountUp(100)
const { current: orgCount } = useCountUp(50)
</script>

