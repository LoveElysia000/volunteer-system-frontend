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
        :is="item.icon"
        v-if="item.icon"
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
  gap: 10px;
  padding: 10px 12px;
  margin: 0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.dropdown-item:hover:not(.dropdown-item-disabled) {
  background: #f8fafc;
  color: #0f172a;
  transform: translateX(2px);
}

.dropdown-item-disabled {
  opacity: 0.48;
  cursor: not-allowed;
}

.dropdown-item-danger {
  color: #dc2626;
}

.dropdown-item-danger:hover:not(.dropdown-item-disabled) {
  background: #fff1f2;
  color: #dc2626;
}

.dropdown-item-divided {
  border-top: 1px solid #e2e8f0;
  margin-top: 6px;
  padding-top: 10px;
}

.dropdown-item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: currentColor;
  opacity: 0.8;
}

.dropdown-item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
