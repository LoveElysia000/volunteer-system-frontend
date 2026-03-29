<template>
  <section
    class="volunteer-page-header overflow-visible border bg-white/95"
    :class="headerModeClass"
  >
    <div
      class="grid gap-5"
      :class="layout === 'operations'
        ? '2xl:grid-cols-[minmax(0,0.92fr)_minmax(340px,1.08fr)] 2xl:items-stretch'
        : (mode === 'hero' ? 'lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.96fr)] lg:items-end' : 'lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-start')"
    >
      <div
        class="min-w-0"
        :class="layout === 'operations' ? 'flex flex-col justify-between gap-5' : 'space-y-4'"
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
              :class="mode === 'hero' ? 'text-3xl lg:text-[2.2rem]' : 'text-2xl lg:text-[1.9rem]'"
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
          class="volunteer-page-header-actions flex h-full min-w-0 flex-col gap-4"
          :class="layout === 'operations'
            ? 'rounded-[1.75rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(236,253,245,0.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.86),0_22px_54px_-42px_rgba(5,150,105,0.38)] lg:p-5'
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
            :class="layout === 'operations' ? 'sm:grid-cols-2' : (mode === 'hero' ? 'sm:grid-cols-2 lg:max-w-xl' : 'sm:grid-cols-2 lg:max-w-lg')"
          >
            <div
              v-for="item in metaItems"
              :key="item.label"
              class="rounded-2xl px-4 py-3"
              :class="layout === 'operations'
                ? 'border border-emerald-100/80 bg-white/92 shadow-[0_14px_34px_-28px_rgba(5,150,105,0.24)]'
                : (mode === 'hero' ? 'border border-slate-100 bg-slate-50/80' : 'border border-slate-200/80 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]')"
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
  description?: string
  metaItems?: MetaItem[]
  mode?: 'hero' | 'compact'
  layout?: 'default' | 'operations'
}>(), {
  eyebrow: '',
  description: '',
  metaItems: () => [],
  mode: 'hero',
  layout: 'default'
})

const headerModeClass = computed(() => {
  return props.mode === 'hero'
    ? 'rounded-[2rem] border-emerald-100 p-6 shadow-[0_20px_60px_-48px_rgba(22,101,52,0.55)] lg:p-8'
    : 'rounded-[1.6rem] border-slate-200/80 p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.22)] lg:p-6'
})
</script>
