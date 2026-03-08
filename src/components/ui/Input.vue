<template>
  <div>
    <!-- 输入框和图标容器 -->
    <div class="input-with-icon">
      <!-- 左侧图标 -->
      <div
        v-if="hasIcon"
        class="input-icon"
      >
        <component
          :is="icon"
          :class="[
            'h-5 w-5',
            {
              'text-primary-500': isFocused,
              'text-gray-400': !isFocused
            }
          ]"
        />
      </div>

      <!-- 输入框 -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'input',
          {
            'has-icon': hasIcon,
            'input-error': error,
            'opacity-50 cursor-not-allowed': disabled
          }
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      >
    </div>

    <!-- 错误提示 -->
    <p
      v-if="error"
      class="mt-1 text-sm text-red-600 font-medium"
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
import { computed, ref } from 'vue'

interface Props {
  id?: string
  type?: string
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  helpText?: string
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const hasIcon = computed(() => !!props.icon)
const isFocused = ref(false)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}
</script>