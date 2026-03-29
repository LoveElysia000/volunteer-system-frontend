<template>
  <div
    class="grid gap-6"
    :class="layoutClass"
  >
    <div class="min-w-0">
      <slot name="main" />
    </div>

    <aside
      v-if="$slots.aside"
      class="min-w-0"
    >
      <slot name="aside" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'dashboard' | 'dashboard-wide' | 'studio' | 'detail' | 'assistant' | 'form'
}>(), {
  variant: 'studio'
})

const layoutClass = computed(() => {
  if (props.variant === 'dashboard') {
    return '2xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]'
  }

  if (props.variant === 'dashboard-wide') {
    return '2xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]'
  }

  if (props.variant === 'detail') {
    return '2xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]'
  }

  if (props.variant === 'assistant') {
    return '2xl:grid-cols-[280px_minmax(0,1fr)]'
  }

  if (props.variant === 'form') {
    return '2xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]'
  }

  return '2xl:grid-cols-[minmax(0,0.92fr)_minmax(320px,1.08fr)]'
})
</script>
