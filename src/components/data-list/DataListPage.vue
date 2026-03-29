<template>
  <WorkbenchPage class="data-list-page">
    <template
      v-if="$slots.header"
      #header
    >
      <slot name="header" />
    </template>

    <template
      v-if="$slots.toolbar"
      #toolbar
    >
      <slot name="toolbar" />
    </template>

    <slot name="body">
      <slot />
    </slot>

    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>

    <template
      v-if="$slots.drawer"
      #overlay
    >
      <slot name="drawer" />
    </template>
  </WorkbenchPage>
</template>

<script setup lang="ts">
import WorkbenchPage from '@/components/workbench/WorkbenchPage.vue'
</script>
