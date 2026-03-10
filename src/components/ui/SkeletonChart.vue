<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <!-- 标题区 -->
    <div class="flex items-center justify-between mb-6">
      <div class="space-y-2">
        <Skeleton
          width="120px"
          height="20px"
        />
        <Skeleton
          width="80px"
          height="14px"
        />
      </div>
      <Skeleton
        variant="circle"
        width="32px"
        height="32px"
      />
    </div>

    <!-- 模拟数据图形 -->
    <!-- 柱状图骨架 -->
    <div
      v-if="type === 'bar'"
      class="flex items-end gap-2 h-32"
    >
      <Skeleton
        v-for="i in bars"
        :key="i"
        variant="rounded"
        :width="barWidth"
        :height="`${Math.random() * 60 + 40}%`"
        class="flex-1"
      />
    </div>

    <!-- 圆环图骨架 -->
    <div
      v-else-if="type === 'circle'"
      class="flex items-center gap-6"
    >
      <Skeleton
        variant="circle"
        width="96px"
        height="96px"
      />
      <div class="flex-1 space-y-3">
        <Skeleton
          v-for="i in 4"
          :key="i"
          width="80%"
          height="12px"
        />
      </div>
    </div>

    <!-- 折线图骨架 -->
    <div
      v-else
      class="h-32 relative"
    >
      <div class="absolute inset-0 flex items-end gap-1">
        <Skeleton
          v-for="i in 12"
          :key="i"
          width="100%"
          :height="`${Math.random() * 30 + 20}%`"
          class="flex-1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from './Skeleton.vue'

interface Props {
  type?: 'bar' | 'circle' | 'line'
  bars?: number
  barWidth?: string
}

withDefaults(defineProps<Props>(), {
  type: 'bar',
  bars: 8,
  barWidth: '100%'
})
</script>
