<template>
  <div :class="['data-list-density-' + density]">
    <div v-if="loading">
      <slot name="loading">
        <div class="space-y-3">
          <div
            v-for="index in loadingRows"
            :key="`loading-${index}`"
            class="data-list-row rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4"
          >
            <div class="space-y-3">
              <Skeleton
                width="56%"
                height="16px"
              />
              <Skeleton
                width="78%"
                height="12px"
              />
              <Skeleton
                width="44%"
                height="12px"
              />
            </div>
          </div>
        </div>
      </slot>
    </div>

    <div v-else-if="items.length">
      <article
        v-for="(item, index) in items"
        :key="getRowKey(item, index)"
        class="data-list-row rounded-[1.25rem] border border-slate-200 bg-white"
        :class="{
          'data-list-clickable-row': interactive,
          'data-list-row-selected': isSelected(item, index)
        }"
        :tabindex="interactive ? 0 : undefined"
        :role="interactive ? 'button' : undefined"
        :aria-pressed="interactive ? String(isSelected(item, index)) : undefined"
        @click="handleRowClickEvent($event, item, index)"
        @keydown.enter.prevent="handleRowKeydown(item, index)"
        @keydown.space.prevent="handleRowKeydown(item, index)"
      >
        <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0 flex-1 space-y-2">
            <slot
              :item="item"
              :index="index"
              :selected="isSelected(item, index)"
            />

            <div v-if="$slots.extra">
              <slot
                name="extra"
                :item="item"
                :index="index"
                :selected="isSelected(item, index)"
              />
            </div>
          </div>
        </div>

        <div
          v-if="interactive || $slots.actions"
          class="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-4 py-4 sm:px-5"
        >
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

          <div
            v-if="$slots.actions"
            class="shrink-0"
            @click.stop
          >
            <slot
              name="actions"
              :item="item"
              :index="index"
              :selected="isSelected(item, index)"
            />
          </div>
        </div>
      </article>
    </div>

    <div v-else>
      <slot name="empty">
        <div class="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
          <p class="text-sm font-semibold text-slate-700">
            {{ emptyTitle }}
          </p>
          <p class="mt-2 text-sm leading-6 text-slate-500">
            {{ emptyDescription }}
          </p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { shouldIgnoreRowActivation } from './rowInteraction'

interface Props {
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
  loadingRows: 4,
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

const getRowKey = (item: Record<string, any>, index: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }

  return item?.[props.rowKey] ?? item?.id ?? index
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
