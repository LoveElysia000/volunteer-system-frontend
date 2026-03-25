<template>
  <div class="data-list-toolbar">
    <div
      v-if="$slots.filters || $slots.bulk"
      class="data-list-toolbar-group"
    >
      <slot name="filters" />
      <slot name="bulk" />
    </div>

    <div
      v-if="$slots.summary || $slots.actions"
      class="data-list-toolbar-actions"
    >
      <slot name="summary" />
      <slot name="actions" />
    </div>
  </div>
</template>
