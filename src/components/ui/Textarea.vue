<template>
  <div class="space-y-1.5">
    <div
      :class="[
        'group rounded-2xl border bg-white transition-all duration-200',
        error
          ? 'border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
          : 'border-slate-200 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.38)] hover:border-slate-300',
        focused && !error ? focusClassName : ''
      ]"
    >
      <div class="relative">
        <textarea
          ref="textareaRef"
          :id="id"
          :value="displayValue"
          :rows="rows"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :maxlength="nativeMaxLength"
          :class="textareaClassName"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
        />

        <button
          v-if="allowClear && displayValue"
          type="button"
          :class="clearButtonClassName"
          aria-label="清空输入"
          @click="clearValue"
        >
          <XIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3 px-1 text-xs">
      <p v-if="error" class="text-red-500">
        {{ error }}
      </p>
      <p v-else-if="helpText" class="text-slate-400">
        {{ helpText }}
      </p>
      <span v-else />

      <p
        v-if="resolvedShowWordLimit"
        :class="wordLimitClassName"
      >
        {{ wordLimitText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { XIcon } from 'lucide-vue-next'

type MaxLengthConfig = number | { length: number; errorOnly?: boolean }

interface Props {
  id?: string
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  helpText?: string
  rows?: number
  minRows?: number
  maxRows?: number
  resize?: boolean
  allowClear?: boolean
  showWordLimit?: boolean
  maxLength?: MaxLengthConfig
  maxlength?: number
  showCount?: boolean
  theme?: 'orange' | 'emerald'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  required: false,
  error: '',
  helpText: '',
  rows: 3,
  minRows: 3,
  maxRows: 6,
  resize: true,
  allowClear: false,
  showWordLimit: false,
  maxLength: undefined,
  maxlength: undefined,
  showCount: false,
  theme: 'orange'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  input: [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const focused = ref(false)

const displayValue = computed(() => props.modelValue ?? '')
const currentLength = computed(() => [...displayValue.value].length)
const resolvedShowWordLimit = computed(() => props.showWordLimit || props.showCount)
const maxLengthValue = computed(() => (
  typeof props.maxLength === 'number'
    ? props.maxLength
    : props.maxLength?.length ?? props.maxlength
))
const maxLengthErrorOnly = computed(() => (
  typeof props.maxLength === 'object' ? !!props.maxLength.errorOnly : false
))
const nativeMaxLength = computed(() => (
  maxLengthValue.value && !maxLengthErrorOnly.value ? maxLengthValue.value : undefined
))
const exceedsLimit = computed(() => (
  !!maxLengthValue.value && currentLength.value > maxLengthValue.value
))
const wordLimitText = computed(() => (
  maxLengthValue.value ? `${currentLength.value}/${maxLengthValue.value}` : `${currentLength.value} 字`
))
const wordLimitClassName = computed(() => (
  exceedsLimit.value ? 'font-semibold text-red-500' : 'text-slate-400'
))
const focusClassName = computed(() => (
  props.theme === 'emerald'
    ? 'border-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]'
    : 'border-[#ec5b13] shadow-[0_0_0_4px_rgba(251,146,60,0.15)]'
))
const clearButtonClassName = computed(() => (
  props.theme === 'emerald'
    ? 'absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100'
    : 'absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-orange-50 hover:text-[#ec5b13] focus:outline-none focus:ring-2 focus:ring-orange-100'
))
const textareaClassName = computed(() => (
  [
    'block min-h-[108px] w-full rounded-2xl bg-transparent px-4 py-3 text-sm leading-6 text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
    props.resize ? 'resize-y' : 'resize-none'
  ].join(' ')
))

const resizeTextarea = async () => {
  await nextTick()
  if (!textareaRef.value) return

  const element = textareaRef.value
  const style = window.getComputedStyle(element)
  const lineHeight = Number.parseFloat(style.lineHeight) || 24
  const verticalPadding = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)
  const minHeight = props.minRows * lineHeight + verticalPadding
  const maxHeight = props.maxRows * lineHeight + verticalPadding

  element.style.height = 'auto'
  element.style.height = `${Math.min(Math.max(element.scrollHeight, minHeight), maxHeight)}px`
  element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden'
}

const normalizeValue = (value: string) => {
  if (!maxLengthValue.value || maxLengthErrorOnly.value) {
    return value
  }
  return [...value].slice(0, maxLengthValue.value).join('')
}

const handleInput = (event: Event) => {
  const nextValue = normalizeValue((event.target as HTMLTextAreaElement).value)
  emit('update:modelValue', nextValue)
  emit('input', nextValue)
}

const clearValue = () => {
  emit('update:modelValue', '')
  emit('input', '')
}

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
}

watch(() => props.modelValue, () => {
  void resizeTextarea()
})

onMounted(() => {
  void resizeTextarea()
})
</script>
