<template>
  <div
    class="sub-menu overflow-hidden transition-all duration-300"
    :class="expanded ? 'max-h-[720px] opacity-100' : 'max-h-0 opacity-0'"
  >
    <div class="sub-menu-content ml-6 mt-2 space-y-2 border-l border-emerald-100 pl-3">
      <MenuItem
        v-for="childItem in items"
        :key="childItem.key"
        :item="childItem"
        :is-compact-sidebar="isCompactSidebar"
        :level="level"
        @item-click="$emit('item-click', $event)"
        @toggle-expand="$emit('toggle-expand', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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

withDefaults(defineProps<{
  items: SubMenuItemData[]
  expanded?: boolean
  level?: number
  isCompactSidebar?: boolean
}>(), {
  expanded: false,
  level: 1,
  isCompactSidebar: false
})

defineEmits<{
  'item-click': [item: SubMenuItemData]
  'toggle-expand': [key: string]
}>()
</script>
