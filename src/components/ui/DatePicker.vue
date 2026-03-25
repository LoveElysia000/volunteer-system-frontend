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
    :ui="{
      input: 'dp-input',
      menu: 'dp-menu',
      calendar: 'dp-calendar',
      cell: 'dp-cell',
      cellInner: 'dp-cell-inner'
    }"
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
import '@vuepic/vue-datepicker/dist/main.css'

type DateValue = Date | Date[] | [Date, Date] | null

interface Props {
  modelValue?: DateValue
  locale?: string
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
  filters?: { months?: number[]; years?: number[]; times?: { hours?: number[]; minutes?: number[]; seconds?: number[] } }
  disabledDates?: Date[] | ((date: Date) => boolean)
  highlight?: Date[] | ((date: Date) => boolean)
  autoApply?: boolean
  closeOnAutoApply?: boolean
  error?: string
  theme?: 'orange' | 'emerald'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  locale: 'zh-CN',
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

.dp-input {
  width: 100%;
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #0f172a;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
  box-shadow: 0 10px 30px -26px rgba(15, 23, 42, 0.38);
  transition: all 0.2s ease;
}

.dp-input:hover {
  border-color: #cbd5e1;
  box-shadow: 0 18px 42px -34px rgba(15, 23, 42, 0.26);
}

.date-picker--orange .dp-input:focus {
  outline: none;
  border-color: #ec5b13;
  box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.15);
}

.date-picker--emerald .dp-input:focus {
  outline: none;
  border-color: #059669;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
}

.dp-menu {
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
.date-picker-error .dp-input {
  border-color: #ef4444;
}

.date-picker-error .dp-input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.date-picker-error-text {
  margin-top: 6px;
  font-size: 13px;
  color: #ef4444;
}
</style>
