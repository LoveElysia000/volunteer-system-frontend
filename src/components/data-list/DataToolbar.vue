<template>
  <div class="data-list-toolbar data-list-toolbar-surface">
    <div
      v-if="$slots.filters || $slots.bulk"
      class="data-list-toolbar-group data-list-toolbar-pane"
    >
      <slot name="filters" />
      <slot name="bulk" />
    </div>

    <div
      v-if="$slots.summary || $slots.actions"
      class="data-list-toolbar-actions data-list-toolbar-pane"
    >
      <slot name="summary" />
      <slot name="actions" />
    </div>
  </div>
</template>
