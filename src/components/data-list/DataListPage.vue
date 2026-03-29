<template>
  <div class="data-list-page min-w-0">
    <header
      v-if="$slots.header"
      class="min-w-0"
    >
      <slot name="header" />
    </header>

    <section
      v-if="$slots.toolbar"
      class="min-w-0"
    >
      <slot name="toolbar" />
    </section>

    <div
      v-if="$slots.body || $slots.default"
      class="min-w-0"
    >
      <slot name="body">
        <slot />
      </slot>
    </div>

    <footer
      v-if="$slots.footer"
      class="min-w-0"
    >
      <slot name="footer" />
    </footer>

    <slot name="drawer" />
  </div>
</template>
