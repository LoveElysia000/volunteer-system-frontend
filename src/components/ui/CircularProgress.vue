<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- 背景圆环 -->
    <svg
      class="absolute inset-0 transform -rotate-90"
      :width="size"
      :height="size"
    >
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
        fill="none"
        class="transition-all duration-300"
      />
      <!-- 进度圆环 -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        :stroke-linecap="strokeLinecap"
        class="transition-all duration-1000 ease-out"
      />
    </svg>

    <!-- 中间内容 -->
    <div class="relative z-10 text-center">
      <slot>
        <span v-if="showPercentage" class="text-lg font-bold" :class="textColorClass">
          {{ Math.round(percentage) }}%
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  percentage?: number        // 进度百分比 0-100
  current?: number           // 当前值（与max配合使用）
  max?: number               // 最大值
  size?: number              // 整体尺寸
  strokeWidth?: number       // 圆环宽度
  trackColor?: string        // 轨道颜色
  progressColor?: string     // 进度颜色
  strokeLinecap?: 'round' | 'butt' | 'square'
  showPercentage?: boolean    // 是否显示百分比文字
  textColorClass?: string     // 文字颜色类
  animate?: boolean          // 是否开启动画
}

const props = withDefaults(defineProps<Props>(), {
  percentage: 0,
  current: 0,
  max: 100,
  size: 60,
  strokeWidth: 4,
  trackColor: '#e5e7eb',
  progressColor: '#10b981',
  strokeLinecap: 'round',
  showPercentage: true,
  textColorClass: 'text-gray-700',
  animate: true
})

// 计算实际百分比
const actualPercentage = computed(() => {
  if (props.percentage > 0) return Math.min(props.percentage, 100)
  return props.max > 0 ? Math.min((props.current / props.max) * 100, 100) : 0
})

// 动画进度
const animatedPercentage = ref(0)

// 圆环计算
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() =>
  circumference.value - (animatedPercentage.value / 100) * circumference.value
)

// 动画效果
onMounted(() => {
  if (props.animate) {
    // 延迟开始动画，让用户看到变化
    setTimeout(() => {
      const duration = 1000
      const start = performance.now()
      const animate = (currentTime: number) => {
        const elapsed = currentTime - start
        const progress = Math.min(elapsed / duration, 1)
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        animatedPercentage.value = actualPercentage.value * ease
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }, 300)
  } else {
    animatedPercentage.value = actualPercentage.value
  }
})
</script>
