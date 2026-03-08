<template>
  <div class="menu-item">
    <!-- 菜单项主体 -->
    <div
      class="menu-item-main"
      :class="{
        'menu-item-active': isActive,
        'menu-item-has-children': hasChildren,
        'menu-item-expanded': isExpanded
      }"
      @click="handleClick"
    >
      <!-- 左侧图标 -->
      <div class="menu-item-icon">
        <component
          :is="item.icon"
          v-if="item.icon"
          class="h-4 w-4"
          :class="isActive ? 'text-blue-600' : 'text-gray-400'"
        />
      </div>

      <!-- 菜单标签 -->
      <span class="menu-item-label flex-1 truncate">{{ item.label }}</span>

      <!-- 右侧内容 -->
      <div class="menu-item-right">
        <!-- 徽章 -->
        <span
          v-if="item.badge"
          class="menu-item-badge"
          :class="item.badgeClass || 'bg-gray-100 text-gray-600'"
        >
          {{ item.badge }}
        </span>

        <!-- 展开箭头（有子菜单时显示） -->
        <ChevronRightIcon
          v-if="hasChildren"
          class="menu-item-arrow h-3 w-3 transition-transform duration-200"
          :class="isExpanded ? 'rotate-90' : ''"
        />
      </div>
    </div>

    <!-- 子菜单 -->
    <SubMenu
      v-if="hasChildren"
      :items="item.children"
      :expanded="isExpanded"
      :level="level + 1"
      @item-click="$emit('item-click', $event)"
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

interface Props {
  item: MenuItem
  expanded?: boolean
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
  level: 0
})

const emit = defineEmits<{
  'item-click': [item: MenuItem]
  'toggle-expand': [key: string]
}>()

const route = useRoute()

// 计算属性
const hasChildren = computed(() => props.item.children && props.item.children.length > 0)
const isExpanded = computed(() => props.expanded)

// 检查是否激活
const isActive = computed(() => {
  // 使用新的路径匹配逻辑
  return isMenuActive(props.item.to, route.path, hasChildren.value, props.item.children)
})

// 处理点击事件
const handleClick = () => {
  if (props.item.disabled) return

  if (hasChildren.value) {
    // 有子菜单时切换展开状态
    emit('toggle-expand', props.item.key)
  } else if (props.item.to) {
    // 无子菜单时触发点击事件
    emit('item-click', props.item)
  }
}
</script>

<style scoped>
.menu-item {
  @apply w-full;
}

.menu-item-main {
  @apply flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer;
  @apply text-gray-600 hover:text-blue-600 hover:bg-gray-50;
}

.menu-item-main.menu-item-active {
  @apply bg-blue-50 text-blue-600 border-r-2 border-blue-600;
}

.menu-item-main.menu-item-has-children {
  @apply pr-2;
}

.menu-item-icon {
  @apply mr-3 flex-shrink-0;
}

.menu-item-label {
  @apply truncate;
}

.menu-item-right {
  @apply ml-auto flex items-center space-x-1;
}

.menu-item-badge {
  @apply px-1.5 py-0.5 text-xs font-medium rounded-full;
}

.menu-item-arrow {
  @apply text-gray-400 transition-transform duration-200;
}

.menu-item-main:hover .menu-item-arrow {
  @apply text-gray-600;
}

.menu-item-main.menu-item-active .menu-item-arrow {
  @apply text-blue-600;
}
</style>