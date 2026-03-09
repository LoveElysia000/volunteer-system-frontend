<template>
  <div
    class="dropdown-item"
    :class="{
      'dropdown-item-disabled': item.disabled,
      'dropdown-item-danger': item.danger,
      'dropdown-item-divided': item.divided
    }"
    @click="handleClick"
  >
    <!-- 图标 -->
    <slot name="icon">
      <component
        v-if="item.icon"
        :is="item.icon"
        class="dropdown-item-icon"
      />
    </slot>

    <!-- 标签 -->
    <span class="dropdown-item-label">{{ item.label }}</span>
  </div>
</template>

<script setup lang="ts">
interface DropdownItemData {
  key?: string
  label: string
  icon?: string
  disabled?: boolean
  divided?: boolean
  danger?: boolean
}

interface Props {
  item: DropdownItemData
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [item: DropdownItemData]
}>()

const handleClick = () => {
  if (props.item.disabled) return
  emit('select', props.item)
}
</script>

<style scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 0 4px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s ease;
}

.dropdown-item:hover:not(.dropdown-item-disabled) {
  background: #f3f4f6;
  color: #111827;
}

.dropdown-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-item-danger {
  color: #ef4444;
}

.dropdown-item-danger:hover:not(.dropdown-item-disabled) {
  background: #fef2f2;
  color: #dc2626;
}

.dropdown-item-divided {
  border-top: 1px solid #e5e7eb;
  margin-top: 4px;
  padding-top: 4px;
}

.dropdown-item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: currentColor;
  opacity: 0.7;
}

.dropdown-item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
