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
    :is24="is24"
    :minutes-increment="minutesIncrement"
    :hours-increment="hoursIncrement"
    :start-time="startTime"
    :preset-dates="presetDates"
    :filters="filters"
    :disabled-dates="disabledDates"
    :highlight="highlight"
    :auto-apply="autoApply"
    :close-on-auto-apply="closeOnAutoApply"
    :teleport="true"
    :class="['date-picker', { 'date-picker-error': error }]"
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
import VueDatePicker from '@vuepic/vue-datepicker'
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
  is24?: boolean
  minutesIncrement?: number
  hoursIncrement?: number
  startTime?: { hours: number; minutes: number }
  presetDates?: Array<{ label: string; value: Date | [Date, Date] }>
  filters?: { months?: number[]; years?: number[]; times?: { hours?: number[]; minutes?: number[]; seconds?: number[] } }
  disabledDates?: Date[] | ((date: Date) => boolean)
  highlight?: Date[] | ((date: Date) => boolean)
  autoApply?: boolean
  closeOnAutoApply?: boolean
  error?: string
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
  is24: true,
  minutesIncrement: 1,
  hoursIncrement: 1,
  autoApply: true,
  closeOnAutoApply: true
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
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9375rem;
  color: #111827;
  background: white;
  transition: all 0.2s ease;
}

.dp-input:hover {
  border-color: #d1d5db;
}

.dp-input:focus {
  outline: none;
  border-color: var(--tw-colors-primary-500, #10b981);
  box-shadow: 0 0 0 3px rgba(var(--tw-colors-primary-rgb, 16, 185, 129), 0.1);
}

.dp-menu {
  border-radius: 12px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  border: 1px solid #e5e7eb;
}

/* 选中日期样式 - 使用主题绿色 */
.dp__cell_inner.dp__active_date,
.dp__range_start,
.dp__range_end {
  background: #10b981 !important;
}

.dp__range_between {
  background: rgba(16, 185, 129, 0.1) !important;
  color: #10b981 !important;
}

/* 悬浮样式 */
.dp__cell_inner:hover:not(.dp__active_date):not(.dp__range_start):not(.dp__range_end) {
  background: #f3f4f6;
}

/* 今日标记 */
.dp__today {
  border-color: #10b981 !important;
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
