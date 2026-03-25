<template>
  <div class="space-y-1.5">
    <div
      :class="[
        'group rounded-2xl border bg-white transition-all duration-200',
        error
          ? 'border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
          : 'border-slate-200 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.38)] hover:border-slate-300',
        isFocused && !error ? focusClassName : ''
      ]"
    >
      <div class="relative">
        <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <LockIcon :class="iconClassName" />
        </div>

        <input
          :id="id"
          :type="passwordVisible ? 'text' : 'password'"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          class="block min-h-[44px] w-full rounded-2xl bg-transparent px-4 py-3 pl-11 pr-20 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          @input="handleInput"
          @blur="handleBlur"
          @focus="handleFocus"
        >

        <div class="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <button
            v-if="allowClear && modelValue !== '' && modelValue !== undefined && modelValue !== null"
            type="button"
            :class="actionButtonClassName"
            aria-label="清空输入"
            @click="clearValue"
          >
            <XIcon class="h-4 w-4" />
          </button>

          <button
            type="button"
            :class="actionButtonClassName"
            aria-label="切换密码显示状态"
            @click="togglePasswordVisibility"
          >
            <component
              :is="passwordVisible ? EyeIcon : EyeOffIcon"
              class="h-4 w-4"
            />
          </button>
        </div>
      </div>
    </div>

    <p
      v-if="error"
      class="px-1 text-sm font-medium text-red-600"
    >
      {{ error }}
    </p>

    <p
      v-else-if="helpText"
      class="px-1 text-sm text-slate-500"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { EyeIcon, EyeOffIcon, LockIcon, XIcon } from 'lucide-vue-next'

interface Props {
  id?: string
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  helpText?: string
  allowClear?: boolean
  theme?: 'orange' | 'emerald'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  allowClear: false,
  theme: 'orange'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const passwordVisible = ref(false)
const isFocused = ref(false)

const focusClassName = computed(() => (
  props.theme === 'emerald'
    ? 'border-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]'
    : 'border-[#ec5b13] shadow-[0_0_0_4px_rgba(251,146,60,0.15)]'
))

const iconClassName = computed(() => (
  `h-4 w-4 transition-colors duration-200 ${isFocused.value ? (props.theme === 'emerald' ? 'text-emerald-600' : 'text-[#ec5b13]') : 'text-slate-400'}`
))

const actionButtonClassName = computed(() => (
  props.theme === 'emerald'
    ? 'inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100'
    : 'inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-orange-50 hover:text-[#ec5b13] focus:outline-none focus:ring-2 focus:ring-orange-100'
))

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

const clearValue = () => {
  emit('update:modelValue', '')
}
</script>
