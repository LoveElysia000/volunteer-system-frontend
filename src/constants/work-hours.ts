import { WorkHourOperationType } from '@/types/work-hour'

export const WORK_HOUR_OPERATION_LABELS: Record<WorkHourOperationType, string> = {
  [WorkHourOperationType.GRANT]: '工时发放',
  [WorkHourOperationType.VOID]: '工时作废',
  [WorkHourOperationType.RECALCULATE]: '工时重算'
}

export const WORK_HOUR_OPERATION_SHORT_LABELS: Record<WorkHourOperationType, string> = {
  [WorkHourOperationType.GRANT]: '发放',
  [WorkHourOperationType.VOID]: '作废',
  [WorkHourOperationType.RECALCULATE]: '重算'
}

export const WORK_HOUR_OPERATION_TONES: Record<WorkHourOperationType, 'green' | 'rose' | 'amber'> = {
  [WorkHourOperationType.GRANT]: 'green',
  [WorkHourOperationType.VOID]: 'rose',
  [WorkHourOperationType.RECALCULATE]: 'amber'
}

export const VOLUNTEER_WORK_HOUR_OPERATION_FILTER_OPTIONS = [
  {
    key: 'grant',
    value: WorkHourOperationType.GRANT,
    label: '工时发放',
    description: '查看正常发放的工时记录'
  },
  {
    key: 'void',
    value: WorkHourOperationType.VOID,
    label: '工时作废',
    description: '查看被作废的工时记录'
  },
  {
    key: 'recalculate',
    value: WorkHourOperationType.RECALCULATE,
    label: '工时重算',
    description: '查看重算后的工时记录'
  }
] as const
