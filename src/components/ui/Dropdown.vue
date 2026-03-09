<template>
  <div
    ref="dropdownRef"
    class="dropdown"
    @click.stop
  >
    <!-- 触发元素 -->
    <div
      ref="triggerRef"
      class="dropdown-trigger"
      @click="toggle"
    >
      <slot name="trigger" />
    </div>

    <!-- 下拉菜单 -->
    <Teleport to="body">
      <Transition name="dropdown">
        <div
          v-if="visible"
          ref="menuRef"
          class="dropdown-menu"
          :class="[
            `dropdown-placement-${placement}`,
            { 'dropdown-menu-dark': theme === 'dark' }
          ]"
          :style="menuStyle"
        >
          <div class="dropdown-content">
            <slot>
              <DropdownItem
                v-for="item in items"
                :key="item.key || item.label"
                :item="item"
                @select="handleSelect"
              />
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import DropdownItem from './DropdownItem.vue'

interface DropdownItemData {
  key?: string
  label: string
  icon?: string
  disabled?: boolean
  divided?: boolean
  danger?: boolean
}

interface Props {
  items?: DropdownItemData[]
  placement?: 'top' | 'bottom' | 'left' | 'right'
  theme?: 'light' | 'dark'
  trigger?: 'click' | 'hover'
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  placement: 'bottom',
  theme: 'light',
  trigger: 'click'
})

const emit = defineEmits<{
  select: [item: DropdownItemData]
  open: []
  close: []
}>()

const visible = ref(false)
const dropdownRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const menuStyle = ref<Record<string, string>>({})

const toggle = async () => {
  visible.value = !visible.value
  if (visible.value) {
    emit('open')
    await nextTick()
    updatePosition()
    document.addEventListener('click', handleClickOutside)
  } else {
    emit('close')
    document.removeEventListener('click', handleClickOutside)
  }
}

const close = () => {
  if (!visible.value) return
  visible.value = false
  emit('close')
  document.removeEventListener('click', handleClickOutside)
}

const handleClickOutside = (e: MouseEvent) => {
  if (
    dropdownRef.value?.contains(e.target as Node) ||
    menuRef.value?.contains(e.target as Node)
  ) {
    return
  }
  close()
}

const updatePosition = () => {
  if (!triggerRef.value || !menuRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const menuRect = menuRef.value.getBoundingClientRect()
  const scrollX = window.scrollX
  const scrollY = window.scrollY

  let top = 0
  let left = 0

  switch (props.placement) {
    case 'bottom':
      top = triggerRect.bottom + scrollY + 4
      left = triggerRect.left + scrollX
      break
    case 'top':
      top = triggerRect.top + scrollY - menuRect.height - 4
      left = triggerRect.left + scrollX
      break
    case 'left':
      top = triggerRect.top + scrollY
      left = triggerRect.left + scrollX - menuRect.width - 4
      break
    case 'right':
      top = triggerRect.top + scrollY
      left = triggerRect.right + scrollX + 4
      break
  }

  // 边界检测
  const padding = 8
  if (left < padding) left = padding
  if (left + menuRect.width > window.innerWidth - padding) {
    left = window.innerWidth - menuRect.width - padding
  }
  if (top < padding) top = padding
  if (top + menuRect.height > window.innerHeight - padding) {
    // 如果底部放不下，改为顶部
    if (props.placement === 'bottom') {
      top = triggerRect.top + scrollY - menuRect.height - 4
    }
    // 如果顶部放不下（在顶部时），改为底部
    if (props.placement === 'top' && triggerRect.bottom + menuRect.height < window.innerHeight) {
      top = triggerRect.bottom + scrollY + 4
    }
  }

  menuStyle.value = {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '9999'
  }
}

const handleSelect = (item: DropdownItemData) => {
  emit('select', item)
  close()
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  cursor: pointer;
}

.dropdown-menu {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2);
  border: 1px solid #e5e7eb;
  min-width: 160px;
  padding: 4px 0;
}

.dropdown-menu-dark {
  background: #1f2937;
  border-color: #374151;
  color: white;
}

.dropdown-content {
  max-height: 300px;
  overflow-y: auto;
}

/* Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
