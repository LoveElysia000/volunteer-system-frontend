<template>
  <section
    class="volunteer-page-header overflow-hidden border bg-white/95"
    :class="headerModeClass"
  >
    <div
      class="flex flex-col gap-5"
      :class="mode === 'hero' ? 'lg:flex-row lg:items-end lg:justify-between' : 'lg:flex-row lg:items-start lg:justify-between'"
    >
      <div class="space-y-4">
        <span
          v-if="eyebrow"
          class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
          :class="mode === 'hero' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
        >
          {{ eyebrow }}
        </span>
        <div class="space-y-2">
          <h1
            class="font-black tracking-tight text-slate-900"
            :class="mode === 'hero' ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-[1.9rem]'"
          >
            {{ title }}
          </h1>
          <p
            v-if="description"
            class="max-w-2xl leading-6 text-slate-600"
            :class="mode === 'hero' ? 'text-sm lg:text-base' : 'text-sm'"
          >
            {{ description }}
          </p>
        </div>
      </div>

      <div
        v-if="$slots.actions || metaItems.length"
        class="flex w-full flex-col gap-3"
        :class="mode === 'hero' ? 'lg:max-w-xl lg:items-end' : 'lg:max-w-lg lg:items-end'"
      >
        <div
          v-if="$slots.actions"
          class="flex w-full flex-wrap gap-3 lg:justify-end"
        >
          <slot name="actions" />
        </div>

        <div
          v-if="metaItems.length"
          class="grid w-full gap-3"
          :class="mode === 'hero' ? 'sm:grid-cols-2 lg:max-w-xl' : 'sm:grid-cols-2 lg:max-w-lg'"
        >
          <div
            v-for="item in metaItems"
            :key="item.label"
            class="rounded-2xl px-4 py-3"
            :class="mode === 'hero' ? 'border border-slate-100 bg-slate-50/80' : 'border border-slate-200/80 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {{ item.label }}
            </p>
            <p class="mt-1 text-lg font-bold text-slate-900">
              {{ item.value }}
            </p>
            <p
              v-if="item.detail"
              class="mt-1 text-xs text-slate-500"
            >
              {{ item.detail }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface MetaItem {
  label: string
  value: string
  detail?: string
}

const props = withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
  metaItems?: MetaItem[]
  mode?: 'hero' | 'compact'
}>(), {
  eyebrow: '',
  description: '',
  metaItems: () => [],
  mode: 'hero'
})

const headerModeClass = computed(() => {
  return props.mode === 'hero'
    ? 'rounded-[2rem] border-emerald-100 p-6 shadow-[0_20px_60px_-48px_rgba(22,101,52,0.55)] lg:p-8'
    : 'rounded-[1.6rem] border-slate-200/80 p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.22)] lg:p-6'
})
</script>
