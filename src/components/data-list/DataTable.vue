<template>
  <div :class="['data-table-density-' + density]">
    <div class="overflow-x-auto">
      <table class="min-w-full border-separate border-spacing-0">
        <thead>
          <tr class="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="data-table-header-cell whitespace-nowrap border-b border-slate-200/80"
              :class="[alignClass(column.align), column.headerClass]"
              :style="column.width ? { width: column.width } : undefined"
            >
              {{ column.label }}
            </th>
            <th
              v-if="hasTrailingActions"
              scope="col"
              class="data-table-header-cell border-b border-slate-200/80 text-right"
            >
              <span class="sr-only">操作</span>
            </th>
          </tr>
        </thead>

        <tbody v-if="loading">
          <tr
            v-for="index in loadingRows"
            :key="`loading-${index}`"
            class="data-table-row data-list-row"
          >
            <td
              :colspan="tableColspan"
              class="border-b border-slate-100"
            >
              <div class="flex items-center gap-3">
                <Skeleton
                  v-for="column in Math.max(columns.length, 1)"
                  :key="`loading-cell-${index}-${column}`"
                  class="flex-1"
                  width="100%"
                  height="14px"
                />
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="items.length">
          <tr
            v-for="(item, index) in items"
            :key="getRowKey(item, index)"
            class="data-table-row data-list-row"
            :class="{
              'data-list-clickable-row': interactive,
              'data-list-row-selected': isSelected(item, index)
            }"
            :tabindex="interactive ? 0 : undefined"
            :aria-selected="interactive ? String(isSelected(item, index)) : undefined"
            @click="handleRowClickEvent($event, item, index)"
            @keydown.enter.prevent="handleRowKeydown(item, index)"
            @keydown.space.prevent="handleRowKeydown(item, index)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="data-table-cell border-b border-slate-100 text-slate-700"
              :class="[alignClass(column.align), column.cellClass]"
            >
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :column="column"
                :value="getCellValue(item, column.key)"
                :index="index"
                :selected="isSelected(item, index)"
              >
                {{ formatCellValue(getCellValue(item, column.key)) }}
              </slot>
            </td>

            <td
              v-if="hasTrailingActions"
              class="data-table-cell border-b border-slate-100 text-right"
            >
              <div class="flex items-center justify-end gap-2">
                <Button
                  v-if="interactive && openStyle === 'button'"
                  type="button"
                  variant="outline"
                  size="sm"
                  @click.stop="handleRowClick(item, index)"
                >
                  {{ openText }}
                </Button>
                <button
                  v-if="interactive && openStyle === 'text'"
                  type="button"
                  class="table-text-action"
                  @click.stop="handleRowClick(item, index)"
                >
                  {{ openText }}
                </button>
                <slot
                  name="row-actions"
                  :item="item"
                  :index="index"
                  :selected="isSelected(item, index)"
                />
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td
              :colspan="tableColspan"
              class="border-b border-slate-100 px-4 py-12"
            >
              <slot name="empty">
                <div class="flex flex-col items-center justify-center gap-2 text-center">
                  <p class="text-sm font-semibold text-slate-700">
                    {{ emptyTitle }}
                  </p>
                  <p class="max-w-md text-sm leading-6 text-slate-500">
                    {{ emptyDescription }}
                  </p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Button from '@/components/ui/Button.vue'
import { shouldIgnoreRowActivation } from './rowInteraction'

export interface DataTableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  headerClass?: string
  cellClass?: string
}

interface Props {
  columns: DataTableColumn[]
  items: Array<Record<string, any>>
  loading?: boolean
  loadingRows?: number
  emptyTitle?: string
  emptyDescription?: string
  rowKey?: string | ((item: Record<string, any>, index: number) => string | number)
  selectedKey?: string | number | null
  interactive?: boolean
  openText?: string
  openStyle?: 'button' | 'text'
  density?: 'comfortable' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingRows: 5,
  emptyTitle: '暂无数据',
  emptyDescription: '当前没有可显示的内容',
  rowKey: 'id',
  selectedKey: null,
  interactive: false,
  openText: '查看详情',
  openStyle: 'button',
  density: 'comfortable'
})

const emit = defineEmits<{
  'row-click': [item: Record<string, any>, index: number]
}>()

const slots = useSlots()
const hasTrailingActions = computed(() => props.interactive || Boolean(slots['row-actions']))
const tableColspan = computed(() => props.columns.length + (hasTrailingActions.value ? 1 : 0))

const alignClass = (align?: DataTableColumn['align']) => {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

const getRowKey = (item: Record<string, any>, index: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }

  return item?.[props.rowKey] ?? item?.id ?? index
}

const getCellValue = (item: Record<string, any>, key: string) => {
  return item?.[key]
}

const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return String(value)
}

const isSelected = (item: Record<string, any>, index: number) => {
  const key = getRowKey(item, index)
  return props.selectedKey !== null && props.selectedKey === key
}

const handleRowClick = (item: Record<string, any>, index: number) => {
  if (!props.interactive) {
    return
  }

  emit('row-click', item, index)
}

const handleRowClickEvent = (event: MouseEvent, item: Record<string, any>, index: number) => {
  if (!props.interactive || shouldIgnoreRowActivation(event)) {
    return
  }

  handleRowClick(item, index)
}

const handleRowKeydown = (item: Record<string, any>, index: number) => {
  handleRowClick(item, index)
}
</script>
