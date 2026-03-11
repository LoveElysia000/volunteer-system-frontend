<template>
  <section
    class="organization-page-header overflow-hidden border"
    :class="headerModeClass"
  >
    <div
      class="flex flex-col gap-5"
      :class="mode === 'hero' ? 'lg:flex-row lg:items-end lg:justify-between' : 'lg:flex-row lg:items-start lg:justify-between'"
    >
      <div class="space-y-3">
        <span
          v-if="eyebrow"
          class="inline-flex items-center rounded-full bg-[#fff1ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#ec5b13]"
        >
          {{ eyebrow }}
        </span>

        <div class="space-y-2">
          <h1
            class="font-black tracking-tight text-slate-900"
            :class="mode === 'hero' ? 'text-3xl lg:text-[2.1rem]' : 'text-2xl lg:text-[1.85rem]'"
          >
            {{ title }}
          </h1>
          <p
            v-if="description"
            class="max-w-2xl text-sm leading-6 text-slate-600"
          >
            {{ description }}
          </p>
        </div>
      </div>

      <div
        v-if="$slots.actions || metaItems.length"
        class="flex w-full flex-col gap-3 lg:max-w-xl lg:items-end"
      >
        <div
          v-if="$slots.actions"
          class="flex w-full flex-wrap gap-3 lg:justify-end"
        >
          <slot name="actions" />
        </div>

        <div
          v-if="metaItems.length"
          class="grid w-full gap-3 sm:grid-cols-2"
        >
          <div
            v-for="item in metaItems"
            :key="item.label"
            class="rounded-2xl border border-[#ffd8c2] bg-[#fff8f4] px-4 py-3"
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
    ? 'rounded-[2rem] border-[#ffd8c2] bg-white/95 p-6 shadow-[0_26px_70px_-54px_rgba(120,53,15,0.45)] lg:p-8'
    : 'rounded-[1.5rem] border-[#ffe3d3] bg-white/92 p-5 shadow-[0_18px_50px_-46px_rgba(120,53,15,0.35)] lg:p-6'
})
</script>
