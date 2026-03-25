<template>
  <StatusBadge
    :label="label"
    :tone="tone"
  />
</template>

<script setup lang="ts">
import StatusBadge from '@/components/data-list/StatusBadge.vue'

withDefaults(defineProps<{
  label: string
  tone?: 'green' | 'blue' | 'amber' | 'slate' | 'rose'
}>(), {
  tone: 'slate'
})
</script>
