<template>
  <div
    class="skeleton"
    :class="{
      'skeleton-pulse': animation === 'pulse',
      'skeleton-shimmer': animation === 'shimmer',
      'skeleton-circle': variant === 'circle',
      'skeleton-rounded': variant === 'rounded',
      'skeleton-rect': variant === 'rect'
    }"
    :style="{
      width: width,
      height: height,
      borderRadius: borderRadius
    }"
  />
</template>

<script setup lang="ts">
interface Props {
  variant?: 'text' | 'circle' | 'rounded' | 'rect'
  animation?: 'pulse' | 'shimmer' | 'none'
  width?: string
  height?: string
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  animation: 'pulse'
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.10) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  background-size: 400% 100%;
}

.skeleton-text {
  display: inline-block;
}

.skeleton-circle {
  border-radius: 50%;
}

.skeleton-rounded {
  border-radius: 0.75rem;
}

/* 脉动动画 */
.skeleton-pulse {
  animation: skeletonPulse 1.5s ease-in-out infinite;
}

@keyframes skeletonPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* 闪光动画 */
.skeleton-shimmer {
  animation: skeletonShimmer 1.5s ease-in-out infinite;
}

@keyframes skeletonShimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 禁用动画 */
.skeleton-none {
  animation: none;
}
</style>
