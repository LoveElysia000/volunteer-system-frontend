<template>
  <div>
    <!-- 输入框和图标容器 -->
    <div class="input-with-icon">
      <!-- 左侧锁图标 -->
      <div class="input-icon">
        <LockIcon
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
        :type="passwordVisible ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'input',
          {
            'has-icon': true,
            'pr-10': true,
            'input-error': error,
            'opacity-50 cursor-not-allowed': disabled
          }
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      >

      <!-- 右侧密码可见性切换按钮 -->
      <button
        type="button"
        class="absolute top-1/2 right-0 pr-3 transform -translate-y-1/2 flex items-center text-gray-400 hover:text-primary-500 transition-colors duration-200"
        @click="togglePasswordVisibility"
      >
        <component
          :is="passwordVisible ? EyeIcon : EyeOffIcon"
          class="h-5 w-5"
        />
      </button>
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
import { ref } from 'vue'
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-vue-next'

interface Props {
  id?: string
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const passwordVisible = ref(false)
const isFocused = ref(false)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

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