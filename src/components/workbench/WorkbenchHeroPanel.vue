<template>
  <section class="min-w-0">
    <div
      v-if="surfaceClass"
      :class="surfaceClass"
    >
      <slot />
    </div>
    <slot v-else />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  tone?: 'plain' | 'organization-amber' | 'organization-emerald'
}>(), {
  tone: 'plain'
})

const surfaceClass = computed(() => {
  if (props.tone === 'organization-amber') {
    return 'overflow-hidden rounded-[2rem] border border-[#ffd8c2] bg-[radial-gradient(circle_at_top_left,rgba(255,244,236,0.98),rgba(255,255,255,0.97)_45%,rgba(255,248,243,0.98)_100%)] p-6 shadow-[0_28px_70px_-54px_rgba(120,53,15,0.42)] lg:p-8'
  }

  if (props.tone === 'organization-emerald') {
    return 'overflow-hidden rounded-[2rem] border border-[#d5e8df] bg-[radial-gradient(circle_at_top_left,rgba(239,251,245,0.98),rgba(255,255,255,0.97)_45%,rgba(247,252,249,0.98)_100%)] p-6 shadow-[0_28px_70px_-54px_rgba(21,128,61,0.28)] lg:p-8'
  }

  return ''
})
</script>
