<template>
  <span
    class="data-list-status-badge inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none tracking-[0.02em]"
    :class="toneClass"
    :aria-label="label || undefined"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  tone?: 'green' | 'blue' | 'amber' | 'slate' | 'rose'
}>(), {
  label: '',
  tone: 'slate'
})

const toneClass = computed(() => ({
  green: 'border-emerald-200/80 bg-emerald-50/80 text-emerald-700',
  blue: 'border-sky-200/80 bg-sky-50/80 text-sky-700',
  amber: 'border-amber-200/80 bg-amber-50/80 text-amber-700',
  slate: 'border-slate-200/90 bg-slate-50/90 text-slate-600',
  rose: 'border-rose-200/80 bg-rose-50/80 text-rose-700'
}[props.tone]))
</script>
