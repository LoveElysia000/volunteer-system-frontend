<template>
  <section
    class="volunteer-section-card rounded-[1.75rem] border p-5 shadow-[0_16px_50px_-42px_rgba(15,23,42,0.45)] lg:p-6"
    :class="toneClass"
  >
    <div
      v-if="title || description || $slots.header"
      class="mb-5 flex flex-col gap-3 border-b border-black/5 pb-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div>
        <h2
          v-if="title"
          class="text-lg font-bold text-slate-900"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="mt-1 text-sm leading-6 text-slate-500"
        >
          {{ description }}
        </p>
      </div>
      <slot name="header" />
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  tone?: 'default' | 'soft' | 'accent'
}>(), {
  title: '',
  description: '',
  tone: 'default'
})

const toneClass = computed(() => {
  if (props.tone === 'soft') {
    return 'border-emerald-100 bg-emerald-50/55'
  }
  if (props.tone === 'accent') {
    return 'border-slate-900/5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white'
  }
  return 'border-slate-200 bg-white'
})
</script>
