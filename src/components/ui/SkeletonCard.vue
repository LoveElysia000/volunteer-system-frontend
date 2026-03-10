<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
    <!-- 头部：图标 + 标题 -->
    <div class="flex items-center gap-4">
      <Skeleton
        variant="circle"
        width="48px"
        height="48px"
      />
      <div class="flex-1 space-y-2">
        <Skeleton
          width="60%"
          height="16px"
        />
        <Skeleton
          width="40%"
          height="12px"
        />
      </div>
    </div>

    <!-- 内容区 -->
    <div class="space-y-3 pt-2">
      <Skeleton
        width="100%"
        height="14px"
      />
      <Skeleton
        width="80%"
        height="14px"
      />
      <Skeleton
        width="60%"
        height="14px"
      />
    </div>

    <!-- 底部 -->
    <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
      <Skeleton
        width="80px"
        height="20px"
      />
      <Skeleton
        width="60px"
        height="20px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from './Skeleton.vue'
</script>
