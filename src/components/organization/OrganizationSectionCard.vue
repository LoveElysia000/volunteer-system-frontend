<template>
  <section
    class="organization-section-card rounded-[1.6rem] border p-5 shadow-[0_18px_58px_-46px_rgba(15,23,42,0.35)] lg:p-6"
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
    return 'border-[#ffe4d3] bg-[#fff8f3]'
  }
  if (props.tone === 'accent') {
    return 'border-[#edc1a4] bg-gradient-to-br from-[#fff5ee] to-[#ffe9da]'
  }
  return 'border-slate-200 bg-white'
})
</script>
