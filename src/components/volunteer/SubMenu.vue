<template>
  <div
    class="sub-menu"
    :class="{
      'sub-menu-expanded': expanded,
      [`sub-menu-level-${level}`]: true
    }"
  >
    <div
      class="sub-menu-content"
      :style="computedStyle"
    >
      <MenuItem
        v-for="childItem in items"
        :key="childItem.key"
        :item="childItem"
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

interface Props {
  items: SubMenuItemData[]
  expanded?: boolean
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
  level: 1
})

const emit = defineEmits<{
  'item-click': [item: SubMenuItemData]
  'toggle-expand': [key: string]
}>()

// 计算样式
const computedStyle = computed(() => {
  if (props.expanded) {
    return {
      maxHeight: `${props.items.length * 40}px`, // 每个菜单项约40px高度
      opacity: '1',
      transform: 'translateY(0)',
      visibility: 'visible'
    }
  }

  return {
    maxHeight: '0px',
    opacity: '0',
    transform: 'translateY(-10px)',
    visibility: 'hidden'
  }
})
</script>

<style scoped>
.sub-menu {
  @apply overflow-hidden transition-all duration-300 ease-in-out;
}

.sub-menu-content {
  @apply pl-6 transition-all duration-300 ease-in-out;
}

/* 不同级别的缩进 */
.sub-menu-level-1 .sub-menu-content {
  @apply pl-6;
}

.sub-menu-level-2 .sub-menu-content {
  @apply pl-8;
}

.sub-menu-level-3 .sub-menu-content {
  @apply pl-10;
}

/* 展开动画 */
.sub-menu-expanded .sub-menu-content {
  @apply opacity-100 translate-y-0;
}

:not(.sub-menu-expanded) .sub-menu-content {
  @apply opacity-0 -translate-y-2;
}
</style>
