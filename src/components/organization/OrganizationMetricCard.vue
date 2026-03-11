<template>
  <article class="organization-metric-card rounded-[1.4rem] border border-[#ffe2d1] bg-white p-5 shadow-[0_18px_40px_-34px_rgba(120,53,15,0.28)]">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-[0.2em]"
          :class="accentClass"
        >
          {{ label }}
        </p>
        <p class="mt-2 text-3xl font-black tracking-tight text-slate-900">
          {{ value }}
        </p>
        <p
          v-if="detail"
          class="mt-2 text-sm text-slate-500"
        >
          {{ detail }}
        </p>
      </div>
      <div
        class="rounded-2xl p-3"
        :class="iconWrapClass"
      >
        <slot name="icon" />
      </div>
    </div>

    <slot />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  value: string
  detail?: string
  tone?: 'orange' | 'blue' | 'green' | 'slate'
}>(), {
  detail: '',
  tone: 'orange'
})

const accentClass = computed(() => ({
  orange: 'text-[#ec5b13]',
  blue: 'text-sky-700',
  green: 'text-emerald-700',
  slate: 'text-slate-600'
}[props.tone]))

const iconWrapClass = computed(() => ({
  orange: 'bg-[#fff1ea] text-[#ec5b13]',
  blue: 'bg-sky-50 text-sky-600',
  green: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-700'
}[props.tone]))
</script>
