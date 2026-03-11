<template>
  <span
    class="volunteer-status-badge inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
    :class="toneClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  tone?: 'green' | 'blue' | 'amber' | 'slate' | 'rose'
}>(), {
  tone: 'slate'
})

const toneClass = computed(() => ({
  green: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-sky-100 text-sky-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-100 text-slate-700',
  rose: 'bg-rose-100 text-rose-700'
}[props.tone]))
</script>
