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
            <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              为地球
              <span class="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                贡献力量
              </span>
            </h1>
            <p class="text-xl text-gray-600 leading-relaxed">
              加入环保志愿者平台，参与有意义的环保活动，
              与志同道合的人一起为保护地球环境贡献力量。
            </p>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-3 gap-6 py-4">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                500+
              </div>
              <div class="text-sm text-gray-500">
                注册志愿者
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                100+
              </div>
              <div class="text-sm text-gray-500">
                环保活动
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600">
                50+
              </div>
              <div class="text-sm text-gray-500">
                合作组织
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧插图 -->
        <div class="relative">
          <div class="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-2xl p-8 shadow-xl border border-white/20">
            <div class="aspect-square bg-gradient-to-br from-white/90 to-white/70 rounded-2xl shadow-inner flex items-center justify-center relative overflow-hidden">
              <!-- 背景装饰元素 -->
              <div class="absolute inset-0 opacity-10">
                <div class="absolute top-4 left-4 w-16 h-16 bg-primary-300 rounded-full" />
                <div class="absolute bottom-6 right-6 w-12 h-12 bg-green-300 rounded-full" />
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-200 rounded-full" />
              </div>

              <!-- 主要内容 -->
              <div class="text-center space-y-6 relative z-10">
                <!-- 图标容器 -->
                <div class="relative">
                  <div class="h-20 w-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform rotate-3">
                    <LeafIcon class="h-10 w-10 text-white" />
                  </div>
                  <div class="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">✓</span>
                  </div>
                </div>

                <!-- 文字内容 -->
                <div class="space-y-3">
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    环保志愿者平台
                  </h3>
                  <div class="relative">
                    <p class="text-lg font-medium text-gray-700 leading-relaxed">
                      让环保成为一种
                      <span class="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent font-semibold">
                        生活方式
                      </span>
                    </p>
                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-green-400 to-primary-400 rounded-full" />
                  </div>
                </div>

                <!-- 装饰性标签 -->
                <div class="flex justify-center space-x-2">
                  <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">可持续</span>
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">绿色</span>
                  <span class="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">社区</span>
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
import { LeafIcon } from 'lucide-vue-next'
import EcoParticles from '@/components/background/EcoParticles.vue'
</script>