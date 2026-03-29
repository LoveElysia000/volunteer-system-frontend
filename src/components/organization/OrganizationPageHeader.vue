<template>
  <section
    class="organization-page-header overflow-hidden border"
    :class="headerModeClass"
  >
    <div
      class="grid gap-5"
      :class="layout === 'operations'
        ? 'xl:grid-cols-[minmax(0,0.92fr)_minmax(340px,1.08fr)] xl:items-stretch'
        : (mode === 'hero' ? 'lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:items-end' : 'lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] lg:items-start')"
    >
      <div
        class="min-w-0"
        :class="layout === 'operations' ? 'flex flex-col justify-between gap-5' : 'space-y-3'"
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
              v-if="caption"
              class="text-xs font-medium tracking-[0.22em] text-slate-400"
            >
              {{ caption }}
            </p>
            <p
              v-if="description"
              class="max-w-2xl text-sm leading-6 text-slate-600"
            >
              {{ description }}
            </p>
          </div>
        </div>

        <div
          v-if="$slots.summary"
          class="flex flex-wrap gap-2.5"
        >
          <slot name="summary" />
        </div>
      </div>

      <div
        v-if="$slots.actions || metaItems.length"
        class="w-full min-w-0"
      >
        <div
          class="organization-page-header-actions flex h-full min-w-0 flex-col gap-4"
          :class="layout === 'operations'
            ? 'rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,247,242,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_22px_52px_-42px_rgba(120,53,15,0.45)] lg:p-5'
            : 'lg:items-end'"
        >
          <div
            v-if="$slots.actions"
            class="flex w-full min-w-0 flex-wrap gap-3"
            :class="layout === 'operations' ? 'items-center justify-between' : 'lg:justify-end'"
          >
            <slot name="actions" />
          </div>

          <div
            v-if="metaItems.length"
            class="grid w-full gap-3"
            :class="layout === 'operations' ? 'sm:grid-cols-2' : 'sm:grid-cols-2'"
          >
            <div
              v-for="item in metaItems"
              :key="item.label"
              class="rounded-2xl border px-4 py-3"
              :class="layout === 'operations'
                ? 'border-[#ffd8c2] bg-[#fff8f4] shadow-[0_14px_32px_-28px_rgba(120,53,15,0.32)]'
                : 'border-[#ffd8c2] bg-[#fff8f4]'"
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
  caption?: string
  description?: string
  metaItems?: MetaItem[]
  mode?: 'hero' | 'compact'
  layout?: 'default' | 'operations'
}>(), {
  eyebrow: '',
  caption: '',
  description: '',
  metaItems: () => [],
  mode: 'hero',
  layout: 'default'
})

const headerModeClass = computed(() => {
  return props.mode === 'hero'
    ? 'rounded-[2rem] border-[#ffd8c2] bg-[radial-gradient(circle_at_top_left,rgba(255,243,234,0.95),rgba(255,255,255,0.97)_42%,rgba(255,250,246,0.98)_100%)] p-6 shadow-[0_26px_70px_-54px_rgba(120,53,15,0.45)] lg:p-8'
    : 'rounded-[1.5rem] border-[#ffe3d3] bg-white/92 p-5 shadow-[0_18px_50px_-46px_rgba(120,53,15,0.35)] lg:p-6'
})
</script>
