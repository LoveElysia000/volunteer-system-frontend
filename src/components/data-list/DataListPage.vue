<template>
  <div class="data-list-page">
    <header v-if="$slots.header">
      <slot name="header" />
    </header>

    <section v-if="$slots.toolbar">
      <slot name="toolbar" />
    </section>

    <div v-if="$slots.body || $slots.default">
      <slot name="body">
        <slot />
      </slot>
    </div>

    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>

    <slot name="drawer" />
  </div>
</template>
