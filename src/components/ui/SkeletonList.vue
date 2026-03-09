<template>
  <div class="space-y-4">
    <div
      v-for="i in rows"
      :key="i"
      class="flex items-center gap-4"
    >
      <Skeleton variant="circle" width="40px" height="40px" />
      <div class="flex-1 space-y-2">
        <Skeleton width="70%" height="16px" />
        <Skeleton width="40%" height="12px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from './Skeleton.vue'

interface Props {
  rows?: number
}

withDefaults(defineProps<Props>(), {
  rows: 5
})
</script>
