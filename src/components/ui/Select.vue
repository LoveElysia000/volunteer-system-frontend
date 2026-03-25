<template>
  <div>
    <!-- 下拉框和图标容器 -->
    <div class="relative">
      <!-- 左侧图标 -->
      <div
        v-if="hasIcon"
        class="absolute top-1/2 left-3 transform -translate-y-1/2 flex items-center pointer-events-none z-10"
      >
        <component
          :is="icon"
          class="h-5 w-5 text-gray-400"
        />
      </div>

      <!-- 下拉框 -->
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'select',
          {
            'pl-10': hasIcon,
            'pr-10': true,
            'border-red-300 focus:border-red-500 focus:ring-red-500': error,
            'opacity-50 cursor-not-allowed': disabled
          }
        ]"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <!-- 占位符选项 -->
        <option
          v-if="placeholder"
          value=""
          disabled
        >
          {{ placeholder }}
        </option>
        <!-- 选项列表 -->
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- 下拉箭头图标 -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg
          class="h-4 w-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- 错误提示 -->
    <p
      v-if="error"
      class="mt-1 text-sm text-red-600"
    >
      {{ error }}
    </p>

    <!-- 帮助文本 -->
    <p
      v-if="helpText && !error"
      class="mt-1 text-sm text-gray-500"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string | number
  label: string
}

interface Props {
  id?: string
  modelValue?: string | number
  placeholder?: string
  options?: Option[]
  disabled?: boolean
  required?: boolean
  error?: string
  helpText?: string
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  disabled: false,
  required: false
})

const hasIcon = computed(() => !!props.icon)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('change', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
