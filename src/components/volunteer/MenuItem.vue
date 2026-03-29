<template>
  <div
    class="menu-item relative w-full overflow-visible"
    :class="isCompactSidebar && isExpanded ? 'z-[90]' : ''"
  >
    <button
      ref="triggerRef"
      type="button"
      class="menu-item-main relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200"
      :class="[mainClass, isCompactSidebar ? 'justify-center px-3' : '']"
      :disabled="item.disabled"
      :aria-current="!hasChildren && isActive ? 'page' : undefined"
      :aria-expanded="hasChildren ? String(isExpanded) : undefined"
      :aria-disabled="item.disabled ? 'true' : undefined"
      :title="item.label"
      @click="handleClick"
    >
      <span
        class="absolute inset-y-2 left-2 w-1 rounded-full transition-all duration-200"
        :class="isActive ? 'bg-emerald-500 opacity-100' : 'bg-transparent opacity-0'"
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

      <div
        v-if="!isCompactSidebar"
        class="min-w-0 flex-1"
      >
        <p
          class="font-semibold leading-5"
          :class="'truncate whitespace-nowrap'"
        >
          {{ item.label }}
        </p>
      </div>

      <span
        v-if="item.badge && !isCompactSidebar"
        class="menu-item-badge shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold"
        :class="item.badgeClass || 'bg-emerald-100 text-emerald-700'"
      >
        {{ item.badge }}
      </span>

      <ChevronRightIcon
        v-if="hasChildren && !isCompactSidebar"
        class="h-4 w-4 shrink-0 transition-transform duration-200"
        :class="isExpanded ? 'rotate-90 text-emerald-700' : 'text-slate-400'"
      />
    </button>

    <SubMenu
      v-if="hasChildren && (!isCompactSidebar || isExpanded)"
      :items="item.children"
      :anchor-el="triggerRef"
      :is-compact-sidebar="isCompactSidebar"
      :expanded="isExpanded"
      :level="level + 1"
      @item-click="$emit('item-click', $event)"
      @toggle-expand="$emit('toggle-expand', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
  isCompactSidebar?: boolean
}>(), {
  expanded: false,
  level: 0,
  isCompactSidebar: false
})

const emit = defineEmits<{
  'item-click': [item: MenuItem]
  'toggle-expand': [key: string]
}>()

const route = useRoute()
const triggerRef = ref<HTMLElement | null>(null)
const hasChildren = computed(() => Boolean(props.item.children?.length))
const isExpanded = computed(() => props.expanded)
const isActive = computed(() => isMenuActive(props.item.to, route.path, hasChildren.value, props.item.children))

const mainClass = computed(() => {
  if (props.item.disabled) {
    return 'cursor-not-allowed bg-slate-50 text-slate-300'
  }

  if (isActive.value) {
    return 'cursor-pointer bg-[linear-gradient(180deg,rgba(236,253,245,0.98),rgba(255,255,255,0.96))] pl-6 text-emerald-800 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.18),0_12px_24px_-24px_rgba(5,150,105,0.24)]'
  }

  return 'cursor-pointer text-slate-600 hover:bg-white hover:pl-5 hover:text-slate-900 hover:shadow-[0_10px_22px_-22px_rgba(15,23,42,0.16)]'
})

const iconWrapClass = computed(() => {
  if (isActive.value) {
    return 'bg-emerald-100/90 text-emerald-700 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.08)]'
  }

  return 'bg-slate-100/90 text-slate-500'
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
