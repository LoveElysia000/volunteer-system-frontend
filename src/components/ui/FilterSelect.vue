<template>
  <Listbox
    :model-value="modelValue"
    as="div"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="relative">
      <ListboxButton :class="buttonClassName">
        <span class="flex min-w-0 items-center gap-3">
          <span
            v-if="icon"
            :class="iconShellClassName"
          >
            <component
              :is="icon"
              class="h-4 w-4"
            />
          </span>
          <span class="min-w-0">
            <span
              v-if="title"
              class="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400"
            >
              {{ title }}
            </span>
            <span :class="valueClassName">
              {{ selectedOption?.label ?? placeholder }}
            </span>
          </span>
        </span>
        <ChevronDownIcon :class="chevronClassName" />
      </ListboxButton>

      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="translate-y-1 scale-[0.98] opacity-0"
        enter-to-class="translate-y-0 scale-100 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 scale-100 opacity-100"
        leave-to-class="translate-y-1 scale-[0.98] opacity-0"
      >
        <ListboxOptions :class="panelClassName">
          <ListboxOption
            v-for="option in options"
            :key="option.key ?? option.label"
            v-slot="{ active, selected }"
            :value="option.value"
            as="template"
          >
            <li
              :class="[
                itemClassName,
                active ? activeItemClassName : 'text-slate-700',
                selected ? selectedItemClassName : ''
              ]"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">
                  {{ option.label }}
                </p>
                <p
                  v-if="option.description"
                  class="mt-0.5 truncate text-xs text-slate-500"
                >
                  {{ option.description }}
                </p>
              </div>
              <CheckIcon
                v-if="selected"
                :class="checkIconClassName"
              />
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon } from 'lucide-vue-next'

type FilterOptionValue = string | number | boolean | undefined | null

interface FilterOption {
  key?: string
  value: FilterOptionValue
  label: string
  description?: string
}

interface Props {
  modelValue?: FilterOptionValue
  options: readonly FilterOption[]
  title?: string
  placeholder?: string
  icon?: any
  compact?: boolean
  theme?: 'orange' | 'emerald'
  error?: string
  invalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  placeholder: '请选择',
  icon: undefined,
  compact: false,
  theme: 'orange',
  error: '',
  invalid: false
})

const emit = defineEmits<{
  'update:modelValue': [value: FilterOptionValue]
}>()

const selectedOption = computed(() => (
  props.options.find((option) => option.value === props.modelValue)
))

const hasError = computed(() => props.invalid || !!props.error)

const focusRingClassName = computed(() => (
  props.theme === 'emerald'
    ? 'focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-100'
    : 'focus-visible:border-[#ec5b13] focus-visible:ring-4 focus-visible:ring-orange-100'
))

const hoverBorderClassName = computed(() => (
  props.theme === 'emerald' ? 'hover:border-emerald-200' : 'hover:border-[#ffd2ba]'
))

const activeItemClassName = computed(() => (
  props.theme === 'emerald' ? 'bg-emerald-50 text-slate-900' : 'bg-orange-50 text-slate-900'
))

const selectedItemClassName = computed(() => (
  props.theme === 'emerald'
    ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white'
    : 'bg-gradient-to-r from-orange-50 via-amber-50 to-white'
))

const buttonClassName = computed(() => (
  props.compact
    ? `group flex min-h-[34px] items-center gap-2 rounded-full border bg-white/90 px-3 py-1.5 text-left shadow-sm transition-all duration-200 focus:outline-none ${hasError.value ? 'border-red-300 text-red-700 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]' : `border-slate-200 ${hoverBorderClassName.value} hover:shadow-md`} ${focusRingClassName.value}`
    : `group flex min-h-[44px] w-full items-center justify-between rounded-2xl border bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] px-4 py-2.5 text-left shadow-[0_10px_30px_-26px_rgba(15,23,42,0.38)] transition-all duration-200 focus:outline-none ${hasError.value ? 'border-red-300 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]' : 'border-slate-200 hover:border-slate-300 hover:shadow-[0_18px_42px_-34px_rgba(15,23,42,0.26)]'} ${focusRingClassName.value}`
))

const iconShellClassName = computed(() => (
  props.compact
    ? `flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${props.theme === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#fff4ec] text-[#ec5b13]'}`
    : `flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${props.theme === 'emerald' ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white text-emerald-600 ring-1 ring-emerald-100' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-white text-[#ec5b13] ring-1 ring-orange-100'}`
))

const valueClassName = computed(() => (
  props.compact
    ? 'block truncate text-xs font-semibold text-slate-700'
    : 'mt-0.5 block truncate text-sm font-semibold text-slate-800'
))

const panelClassName = computed(() => (
  props.compact
    ? 'absolute right-0 z-20 mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] backdrop-blur'
    : 'absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] backdrop-blur'
))

const itemClassName = computed(() => (
  props.compact
    ? 'flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition-colors duration-150'
    : 'flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors duration-150'
))

const chevronClassName = computed(() => (
  `h-4 w-4 shrink-0 text-slate-400 transition duration-200 group-data-[headlessui-state=open]:rotate-180 ${props.theme === 'emerald' ? 'group-data-[headlessui-state=open]:text-emerald-600' : 'group-data-[headlessui-state=open]:text-[#ec5b13]'}`
))

const checkIconClassName = computed(() => (
  `h-4 w-4 shrink-0 ${props.theme === 'emerald' ? 'text-emerald-600' : 'text-[#ec5b13]'}`
))
</script>
