<template>
  <div class="menu-item w-full">
    <button
      type="button"
      class="menu-item-main relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200"
      :class="mainClass"
      :disabled="item.disabled"
      :aria-current="!hasChildren && isActive ? 'page' : undefined"
      :aria-expanded="hasChildren ? String(isExpanded) : undefined"
      :aria-disabled="item.disabled ? 'true' : undefined"
      @click="handleClick"
    >
      <span
        class="absolute inset-y-2 left-2 w-1 rounded-full transition-all duration-200"
        :class="isActive ? 'bg-[#ec5b13] opacity-100' : 'bg-transparent opacity-0'"
      />

      <div
        class="menu-item-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        :class="iconWrapClass"
      >
        <component
          :is="item.icon"
          v-if="item.icon"
          class="h-4 w-4"
        />
      </div>

      <div class="min-w-0 flex-1">
        <p class="truncate font-semibold leading-5">
          {{ item.label }}
        </p>
      </div>

      <span
        v-if="item.badge"
        class="menu-item-badge shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold"
        :class="item.badgeClass || 'bg-[#fff1ea] text-[#ec5b13]'"
      >
        {{ item.badge }}
      </span>

      <ChevronRightIcon
        v-if="hasChildren"
        class="h-4 w-4 shrink-0 transition-transform duration-200"
        :class="isExpanded ? 'rotate-90 text-[#ec5b13]' : 'text-slate-400'"
      />
    </button>

    <SubMenu
      v-if="hasChildren"
      :items="item.children"
      :expanded="isExpanded"
      :level="level + 1"
      @item-click="$emit('item-click', $event)"
      @toggle-expand="$emit('toggle-expand', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronRightIcon } from 'lucide-vue-next'
import SubMenu from './SubMenu.vue'
import { isMenuActive } from '@/utils/pathMatcher'

interface MenuItem {
  key: string
  label: string
  icon?: any
  to?: string
  children?: MenuItem[]
  badge?: string
  badgeClass?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  item: MenuItem
  expanded?: boolean
  level?: number
}>(), {
  expanded: false,
  level: 0
})

const emit = defineEmits<{
  'item-click': [item: MenuItem]
  'toggle-expand': [key: string]
}>()

const route = useRoute()
const hasChildren = computed(() => Boolean(props.item.children?.length))
const isExpanded = computed(() => props.expanded)
const isActive = computed(() => isMenuActive(props.item.to || '', route.path, hasChildren.value, props.item.children))

const mainClass = computed(() => {
  if (props.item.disabled) {
    return 'cursor-not-allowed bg-slate-50 text-slate-300'
  }

  if (isActive.value) {
    return 'cursor-pointer bg-[#fff3ec] pl-6 text-[#8a3d14] shadow-[inset_0_0_0_1px_rgba(236,91,19,0.18)]'
  }

  return 'cursor-pointer text-slate-600 hover:bg-slate-50 hover:pl-5 hover:text-slate-900'
})

const iconWrapClass = computed(() => {
  if (isActive.value) {
    return 'bg-[#ffe8da] text-[#ec5b13]'
  }

  return 'bg-slate-100 text-slate-500'
})

const handleClick = () => {
  if (props.item.disabled) return

  if (hasChildren.value) {
    emit('toggle-expand', props.item.key)
    return
  }

  if (props.item.to) {
    emit('item-click', props.item)
  }
}
</script>
