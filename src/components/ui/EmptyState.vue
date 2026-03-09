<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <!-- 图标区域 -->
    <div
      class="h-20 w-20 rounded-2xl flex items-center justify-center mb-6"
      :class="iconBgClass"
    >
      <component
        :is="icon"
        v-if="icon"
        class="h-10 w-10"
        :class="iconColorClass"
      />
      <InboxIcon
        v-else
        class="h-10 w-10 text-gray-400"
      />
    </div>

    <!-- 标题 -->
    <h3
      v-if="title"
      class="text-lg font-semibold text-gray-900 mb-2"
    >
      {{ title }}
    </h3>
    <h3
      v-else
      class="text-lg font-semibold text-gray-900 mb-2"
    >
      暂无数据
    </h3>

    <!-- 描述 -->
    <p
      v-if="description"
      class="text-sm text-gray-500 max-w-sm mb-6"
    >
      {{ description }}
    </p>
    <p
      v-else
      class="text-sm text-gray-500 max-w-sm mb-6"
    >
      当前没有可显示的内容
    </p>

    <!-- 操作按钮 -->
    <div v-if="$slots.action || actionText">
      <slot name="action">
        <button
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          @click="$emit('action')"
        >
          {{ actionText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { InboxIcon } from 'lucide-vue-next'

interface Props {
  /** 图标组件 */
  icon?: Component
  /** 标题文本 */
  title?: string
  /** 描述文本 */
  description?: string
  /** 操作按钮文本 */
  actionText?: string
  /** 图标背景样式：primary | secondary | success | warning | error | gray */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gray'
})

defineEmits<{
  /** 点击操作按钮时触发 */
  (e: 'action'): void
}>()

// 根据变体计算图标背景类
const iconBgClass = computed(() => {
  const classes = {
    primary: 'bg-primary-100',
    secondary: 'bg-secondary-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    gray: 'bg-gray-100'
  }
  return classes[props.variant]
})

// 根据变体计算图标颜色类
const iconColorClass = computed(() => {
  const classes = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    gray: 'text-gray-400'
  }
  return classes[props.variant]
})
</script>

<style scoped>
/* EmptyState 组件样式 */
</style>
