<template>
  <div class="textarea-wrapper">
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :maxlength="maxlength"
      :class="[
        'textarea',
        {
          'textarea-error': error,
          'textarea-resize': resize,
          'opacity-50 cursor-not-allowed': disabled
        }
      ]"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 底部信息栏 -->
    <div class="textarea-footer">
      <!-- 错误提示 -->
      <p
        v-if="error"
        class="textarea-error-text"
      >
        {{ error }}
      </p>

      <!-- 帮助文本 -->
      <p
        v-else-if="helpText"
        class="textarea-help-text"
      >
        {{ helpText }}
      </p>

      <!-- 字数统计 -->
      <span
        v-if="showCount"
        class="textarea-count"
        :class="{ 'textarea-count-limit': isNearLimit }"
      >
        {{ currentLength }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id?: string
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  maxlength?: number
  error?: string
  helpText?: string
  resize?: boolean
  showCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  required: false,
  rows: 4,
  resize: true,
  showCount: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  input: [value: string]
}>()

const currentLength = computed(() => props.modelValue?.length || 0)

const isNearLimit = computed(() => {
  if (!props.maxlength) return false
  return currentLength.value / props.maxlength > 0.8
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<style scoped>
.textarea-wrapper {
  width: 100%;
}

.textarea {
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #111827;
  background: white;
  transition: all 0.2s ease;
  resize: none;
}

.textarea-resize {
  resize: vertical;
}

.textarea::placeholder {
  color: #9ca3af;
}

.textarea:hover {
  border-color: #d1d5db;
}

.textarea:focus {
  outline: none;
  border-color: var(--tw-colors-primary-500, #10b981);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.textarea-error {
  border-color: #ef4444;
}

.textarea-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.textarea-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  min-height: 20px;
}

.textarea-error-text {
  font-size: 13px;
  color: #ef4444;
}

.textarea-help-text {
  font-size: 13px;
  color: #6b7280;
}

.textarea-count {
  font-size: 12px;
  color: #9ca3af;
  margin-left: auto;
}

.textarea-count-limit {
  color: #f59e0b;
}

.textarea:disabled {
  background: #f9fafb;
  color: #9ca3af;
}
</style>
