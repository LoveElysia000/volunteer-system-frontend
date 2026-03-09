<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :class="[
      'switch',
      {
        'switch-checked': modelValue,
        'switch-disabled': disabled,
        'switch-sm': size === 'sm',
        'switch-lg': size === 'lg'
      }
    ]"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="switch-thumb" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const toggle = () => {
  if (props.disabled) return
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 44px;
  height: 24px;
  padding: 2px;
  background: #e5e7eb;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: none;
  outline: none;
}

.switch:hover:not(:disabled) {
  background: #d1d5db;
}

.switch-checked {
  background: var(--tw-colors-primary-500, #10b981);
}

.switch-checked:hover:not(:disabled) {
  background: var(--tw-colors-primary-600, #059669);
}

.switch-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-thumb {
  display: block;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateX(0);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.switch-checked .switch-thumb {
  transform: translateX(20px);
}

/* Small size */
.switch-sm {
  width: 36px;
  height: 20px;
}

.switch-sm .switch-thumb {
  width: 16px;
  height: 16px;
}

.switch-sm.switch-checked .switch-thumb {
  transform: translateX(16px);
}

/* Large size */
.switch-lg {
  width: 52px;
  height: 28px;
}

.switch-lg .switch-thumb {
  width: 24px;
  height: 24px;
}

.switch-lg.switch-checked .switch-thumb {
  transform: translateX(24px);
}

/* Focus ring */
.switch:focus-visible {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}
</style>
