<template>
  <Teleport
    to="body"
    :disabled="!isCompactSidebar"
  >
    <div
      v-if="isCompactSidebar ? expanded : true"
      ref="menuRef"
      class="sub-menu transition-all duration-300"
      :class="submenuClass"
      :style="submenuStyle"
    >
      <div
        class="sub-menu-content ml-6 mt-2 space-y-2 border-l border-emerald-100/80 pl-3"
        :class="isCompactSidebar
          ? 'ml-0 mt-0 space-y-1 rounded-[1.2rem] border-l-0 border border-emerald-100/80 bg-white/96 p-2 shadow-[0_18px_36px_-26px_rgba(15,23,42,0.24)] backdrop-blur'
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
          @request-close="$emit('request-close')"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
  anchorEl?: HTMLElement | null
  expanded?: boolean
  level?: number
  isCompactSidebar?: boolean
}>(), {
  expanded: false,
  level: 1,
  isCompactSidebar: false
})

const menuRef = ref<HTMLElement | null>(null)
const submenuStyle = ref<Record<string, string>>({})

const updateFloatingPosition = async () => {
  if (!props.isCompactSidebar || !props.expanded || !props.anchorEl) return

  await nextTick()

  const anchorRect = props.anchorEl.getBoundingClientRect()
  const menuRect = menuRef.value?.getBoundingClientRect()
  const menuWidth = menuRect?.width ?? 224
  const menuHeight = menuRect?.height ?? 0
  const viewportPadding = 12
  const gutter = 12

  let left = anchorRect.right + gutter
  if (left + menuWidth > window.innerWidth - viewportPadding) {
    left = Math.max(viewportPadding, anchorRect.left - menuWidth - gutter)
  }

  let top = anchorRect.top
  if (top + menuHeight > window.innerHeight - viewportPadding) {
    top = Math.max(viewportPadding, window.innerHeight - menuHeight - viewportPadding)
  }

  submenuStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${menuWidth}px`
  }
}

const submenuClass = computed(() => {
  if (props.isCompactSidebar) {
    return props.expanded
      ? 'pointer-events-auto fixed z-[120] translate-x-0 scale-100 opacity-100'
      : 'pointer-events-none fixed z-[120] -translate-x-2 scale-95 opacity-0'
  }

  return props.expanded ? 'max-h-[720px] overflow-hidden opacity-100' : 'max-h-0 overflow-hidden opacity-0'
})

const handleViewportChange = () => {
  void updateFloatingPosition()
}

const handleDocumentPointerDown = (event: PointerEvent) => {
  if (!props.isCompactSidebar || !props.expanded) {
    return
  }

  const target = event.target
  if (!(target instanceof Node)) {
    return
  }

  if (menuRef.value?.contains(target) || props.anchorEl?.contains(target)) {
    return
  }

  emit('request-close')
}

watch(
  () => [props.expanded, props.anchorEl],
  ([expanded]) => {
    if (!expanded) return
    void updateFloatingPosition()
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('resize', handleViewportChange)
  window.addEventListener('scroll', handleViewportChange, true)
  document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleViewportChange)
  window.removeEventListener('scroll', handleViewportChange, true)
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
})

const emit = defineEmits<{
  'item-click': [item: SubMenuItemData]
  'toggle-expand': [key: string]
  'request-close': []
}>()
</script>
