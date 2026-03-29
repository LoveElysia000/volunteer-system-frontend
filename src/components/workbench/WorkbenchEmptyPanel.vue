<template>
  <section :class="panelClass">
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  tone?: 'subtle' | 'muted' | 'plain'
  size?: 'md' | 'lg'
  rounded?: 'default' | 'soft'
}>(), {
  tone: 'subtle',
  size: 'md',
  rounded: 'default'
})

const panelClass = computed(() => {
  const toneClass = props.tone === 'plain'
    ? 'bg-white'
    : props.tone === 'muted'
      ? 'bg-slate-50/80'
      : 'bg-slate-50'
  const sizeClass = props.size === 'lg' ? 'px-5 py-10' : 'px-4 py-8'
  const roundedClass = props.rounded === 'soft' ? 'rounded-[1.2rem]' : 'rounded-2xl'

  return `${roundedClass} border border-dashed border-slate-200 ${toneClass} ${sizeClass} text-center text-sm text-slate-500`
})
</script>
