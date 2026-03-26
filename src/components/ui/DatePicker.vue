<template>
  <VueDatePicker
    v-model="date"
    :locale="locale"
    :format="format"
    :placeholder="placeholder"
    :disabled="disabled"
    :min-date="minDate"
    :max-date="maxDate"
    :range="range"
    :multi-dates="multiDates"
    :week-start="weekStart"
    :enable-time-picker="enableTimePicker"
    :enable-seconds="enableSeconds"
    :is24="is24"
    :minutes-increment="minutesIncrement"
    :hours-increment="hoursIncrement"
    :seconds-increment="secondsIncrement"
    :start-time="startTime"
    :preset-dates="presetDates"
    :filters="filters"
    :disabled-dates="disabledDates"
    :highlight="highlight"
    :auto-apply="autoApply"
    :close-on-auto-apply="closeOnAutoApply"
    :teleport="true"
    :class="['date-picker', `date-picker--${theme}`, { 'date-picker-error': error }]"
    @update:model-value="handleUpdate"
    @open="$emit('open')"
    @closed="$emit('closed')"
  />

  <!-- 错误提示 -->
  <p
    v-if="error"
    class="date-picker-error-text"
  >
    {{ error }}
  </p>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type { FilterConfig, HighlightConfig, HighlightFn } from '@vuepic/vue-datepicker'
import type { Locale } from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'
import '@vuepic/vue-datepicker/dist/main.css'

type DateValue = Date | Date[] | [Date, Date] | null

interface Props {
  modelValue?: DateValue
  locale?: Locale
  format?: string
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  range?: boolean
  multiDates?: boolean
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  enableTimePicker?: boolean
  enableSeconds?: boolean
  is24?: boolean
  minutesIncrement?: number
  hoursIncrement?: number
  secondsIncrement?: number
  startTime?: { hours: number; minutes: number }
  presetDates?: Array<{ label: string; value: Date | [Date, Date] }>
  filters?: Partial<FilterConfig>
  disabledDates?: Date[] | ((date: Date) => boolean)
  highlight?: HighlightFn | Partial<HighlightConfig>
  autoApply?: boolean
  closeOnAutoApply?: boolean
  error?: string
  theme?: 'orange' | 'emerald'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  locale: () => zhCN,
  format: 'yyyy-MM-dd',
  placeholder: '请选择日期',
  disabled: false,
  range: false,
  multiDates: false,
  weekStart: 1,
  enableTimePicker: false,
  enableSeconds: false,
  is24: true,
  minutesIncrement: 1,
  hoursIncrement: 1,
  secondsIncrement: 1,
  autoApply: true,
  closeOnAutoApply: true,
  theme: 'orange'
})

const emit = defineEmits<{
  'update:modelValue': [value: DateValue]
  open: []
  closed: []
  change: [value: DateValue]
}>()

const date = ref<DateValue>(props.modelValue)

watch(() => props.modelValue, (val) => {
  date.value = val
})

const handleUpdate = (val: DateValue) => {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<style>
/* 覆盖默认样式以匹配项目主题 */
.date-picker {
  width: 100%;
}

.date-picker .dp__main,
.date-picker .dp__input_wrap {
  width: 100%;
}

.date-picker .dp__input {
  width: 100%;
  min-height: 44px;
  padding: 10px 14px 10px 42px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #0f172a;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
  box-shadow: 0 10px 30px -26px rgba(15, 23, 42, 0.38);
  transition: all 0.2s ease;
}

.date-picker .dp__input::placeholder {
  color: #94a3b8;
}

.date-picker .dp__input:hover {
  border-color: #cbd5e1;
  box-shadow: 0 18px 42px -34px rgba(15, 23, 42, 0.26);
}

.date-picker .dp__input_icon {
  inset-inline-start: 14px;
}

.date-picker .dp__input_icons {
  width: 1rem;
  height: 1rem;
  padding: 0;
}

.date-picker .dp--clear-btn {
  inset-inline-end: 14px;
}

.date-picker .dp__input_icon_pad {
  padding-inline-start: 42px;
}

.date-picker .dp__input_not_clearable {
  padding-inline-end: 14px !important;
}

.date-picker--orange .dp__input:focus,
.date-picker--orange .dp__input_focus {
  outline: none;
  border-color: #ec5b13;
  box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.15);
}

.date-picker--emerald .dp__input:focus,
.date-picker--emerald .dp__input_focus {
  outline: none;
  border-color: #059669;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
}

.date-picker .dp__menu {
  border-radius: 20px;
  box-shadow: 0 24px 48px -24px rgba(15, 23, 42, 0.35);
  border: 1px solid rgba(226, 232, 240, 0.9);
  overflow: hidden;
}

.date-picker--orange .dp__cell_inner.dp__active_date,
.date-picker--orange .dp__range_start,
.date-picker--orange .dp__range_end {
  background: #ec5b13 !important;
}

.date-picker--orange .dp__range_between {
  background: rgba(236, 91, 19, 0.1) !important;
  color: #ec5b13 !important;
}

.date-picker--emerald .dp__cell_inner.dp__active_date,
.date-picker--emerald .dp__range_start,
.date-picker--emerald .dp__range_end {
  background: #059669 !important;
}

.date-picker--emerald .dp__range_between {
  background: rgba(16, 185, 129, 0.1) !important;
  color: #059669 !important;
}

/* 悬浮样式 */
.date-picker--orange .dp__cell_inner:hover:not(.dp__active_date):not(.dp__range_start):not(.dp__range_end) {
  background: #fff7ed;
}

.date-picker--emerald .dp__cell_inner:hover:not(.dp__active_date):not(.dp__range_start):not(.dp__range_end) {
  background: #ecfdf5;
}

/* 今日标记 */
.date-picker--orange .dp__today {
  border-color: #ec5b13 !important;
}

.date-picker--emerald .dp__today {
  border-color: #059669 !important;
}

/* 错误状态 */
.date-picker-error .dp__input {
  border-color: #ef4444;
}

.date-picker-error .dp__input:focus,
.date-picker-error .dp__input_focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.date-picker-error-text {
  margin-top: 6px;
  font-size: 13px;
  color: #ef4444;
}
</style>
