<template>
  <div
    class="sub-menu transition-all duration-300"
    :class="submenuClass"
  >
    <div
      class="sub-menu-content ml-6 mt-2 space-y-2 border-l border-emerald-100/80 pl-3"
      :class="isCompactSidebar
        ? 'ml-0 space-y-1 rounded-[1.2rem] border-l-0 border border-emerald-100/80 bg-white/96 p-2 shadow-[0_18px_36px_-26px_rgba(15,23,42,0.24)] backdrop-blur'
        : ''"
    >
      <MenuItem
        v-for="childItem in items"
        :key="childItem.key"
        :item="childItem"
        :is-compact-sidebar="false"
        :level="level"
        @item-click="$emit('item-click', $event)"
        @toggle-expand="$emit('toggle-expand', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MenuItem from './MenuItem.vue'

interface SubMenuItemData {
  key: string
  label: string
  icon?: any
  to?: string
  children?: SubMenuItemData[]
  badge?: string
  badgeClass?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  items: SubMenuItemData[]
  expanded?: boolean
  level?: number
  isCompactSidebar?: boolean
}>(), {
  expanded: false,
  level: 1,
  isCompactSidebar: false
})

const submenuClass = computed(() => {
  if (props.isCompactSidebar) {
    return props.expanded
      ? 'absolute left-full top-0 z-50 ml-3 w-56 opacity-100'
      : 'pointer-events-none absolute left-full top-0 z-50 ml-3 w-56 opacity-0'
  }

  return props.expanded ? 'max-h-[720px] overflow-hidden opacity-100' : 'max-h-0 overflow-hidden opacity-0'
})

defineEmits<{
  'item-click': [item: SubMenuItemData]
  'toggle-expand': [key: string]
}>()
</script>
