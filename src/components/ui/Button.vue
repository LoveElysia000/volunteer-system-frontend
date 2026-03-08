<template>
  <button
    :class="[
      'btn',
      variantClass,
      sizeClass,
      {
        'btn-disabled': disabled || loading,
        'w-full': block,
        'rounded-full': rounded
      }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <span
      v-if="loading"
      class="flex items-center justify-center"
    >
      <Loader2Icon class="h-4 w-4 animate-spin mr-2" />
      {{ loadingText }}
    </span>

    <!-- 正常状态 -->
    <span
      v-else
      class="flex items-center justify-center"
    >
      <!-- 前置图标 -->
      <component
        :is="icon"
        v-if="icon"
        :class="[
          'h-4 w-4',
          iconPosition === 'left' ? 'mr-2' : 'ml-2 order-2'
        ]"
      />

      <!-- 按钮文本 -->
      <span :class="{ 'order-1': icon && iconPosition === 'right' }">
        <slot />
      </span>

      <!-- 后置图标 -->
      <component
        :is="iconRight"
        v-if="iconRight"
        class="h-4 w-4 ml-2"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2Icon } from 'lucide-vue-next'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  icon?: any
  iconRight?: any
  iconPosition?: 'left' | 'right'
  block?: boolean
  rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  loadingText: '加载中...',
  iconPosition: 'left',
  block: false,
  rounded: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClass = computed(() => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'bg-green-500 text-white shadow-sm hover:bg-green-600 hover:shadow-md focus:ring-green-500'
  }
  return variants[props.variant]
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl'
  }
  return sizes[props.size]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>