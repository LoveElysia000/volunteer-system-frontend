<template>
  <div class="workbench-page min-w-0 space-y-6">
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

    <main class="min-w-0">
      <slot />
    </main>

    <footer
      v-if="$slots.footer"
      class="min-w-0"
    >
      <slot name="footer" />
    </footer>

    <slot name="overlay" />
  </div>
</template>
