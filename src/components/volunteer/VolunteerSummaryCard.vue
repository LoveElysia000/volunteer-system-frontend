<template>
  <article class="volunteer-summary-card rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)]">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-[0.22em]"
          :class="accentClass"
        >
          {{ label }}
        </p>
        <p class="mt-3 text-3xl font-black tracking-tight text-slate-900">
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
  tone?: 'green' | 'blue' | 'amber' | 'slate' | 'rose'
}>(), {
  detail: '',
  tone: 'green'
})

const accentClass = computed(() => ({
  green: 'text-emerald-700',
  blue: 'text-sky-700',
  amber: 'text-amber-700',
  slate: 'text-slate-600',
  rose: 'text-rose-700'
}[props.tone]))

const iconWrapClass = computed(() => ({
  green: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-sky-50 text-sky-600',
  amber: 'bg-amber-50 text-amber-600',
  slate: 'bg-slate-100 text-slate-700',
  rose: 'bg-rose-50 text-rose-600'
}[props.tone]))
</script>
