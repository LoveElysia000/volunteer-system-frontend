<template>
  <div
    ref="triggerRef"
    class="inline-flex tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
    @focus="show"
    @blur="hide"
  >
    <!-- 触发元素 -->
    <slot />

    <!-- 提示内容 -->
    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-if="visible"
          ref="contentRef"
          class="tooltip"
          :class="[`tooltip-${placement}`, tooltipClass]"
          :style="tooltipStyle"
        >
          <!-- 箭头 -->
          <div class="tooltip-arrow" :class="`tooltip-arrow-${placement}`" />

          <!-- 内容 -->
          <div class="tooltip-content">
            <slot name="content">
              {{ content }}
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

interface Props {
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
  tooltipClass?: string
  offset?: number
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  delay: 200,
  disabled: false,
  offset: 8
})

const visible = ref(false)
const triggerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const tooltipStyle = ref<Record<string, string>>({})

let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null
let rafId: number | null = null

// 使用 requestAnimationFrame 节流位置更新
const throttledUpdatePosition = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    updatePosition()
    rafId = null
  })
}

const show = () => {
  if (props.disabled) return

  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  showTimer = setTimeout(() => {
    visible.value = true
    nextTick(updatePosition)
  }, props.delay)
}

const hide = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }

  hideTimer = setTimeout(() => {
    visible.value = false
  }, 100)
}

const updatePosition = () => {
  if (!triggerRef.value || !contentRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  const scrollX = window.scrollX || window.pageXOffset
  const scrollY = window.scrollY || window.pageYOffset

  let top = 0
  let left = 0

  switch (props.placement) {
    case 'top':
      top = triggerRect.top + scrollY - contentRect.height - props.offset
      left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2
      break
    case 'bottom':
      top = triggerRect.bottom + scrollY + props.offset
      left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2
      break
    case 'left':
      top = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2
      left = triggerRect.left + scrollX - contentRect.width - props.offset
      break
    case 'right':
      top = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2
      left = triggerRect.right + scrollX + props.offset
      break
  }

  // 边界检测（简单版）
  const padding = 8
  if (left < padding) left = padding
  if (left + contentRect.width > window.innerWidth - padding) {
    left = window.innerWidth - contentRect.width - padding
  }

  tooltipStyle.value = {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '9999'
  }
}

// 窗口变化时更新位置
watch(visible, (val) => {
  if (val) {
    window.addEventListener('scroll', throttledUpdatePosition, true)
    window.addEventListener('resize', throttledUpdatePosition)
  } else {
    window.removeEventListener('scroll', throttledUpdatePosition, true)
    window.removeEventListener('resize', throttledUpdatePosition)
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
})
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
}

.tooltip {
  background: rgba(17, 24, 39, 0.95);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

.tooltip-content {
  position: relative;
  z-index: 1;
}

/* 箭头 */
.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.tooltip-arrow-top {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 4px 4px 0 4px;
  border-color: rgba(17, 24, 39, 0.95) transparent transparent transparent;
}

.tooltip-arrow-bottom {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 4px 4px 4px;
  border-color: transparent transparent rgba(17, 24, 39, 0.95) transparent;
}

.tooltip-arrow-left {
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 4px 0 4px 4px;
  border-color: transparent transparent transparent rgba(17, 24, 39, 0.95);
}

.tooltip-arrow-right {
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 4px 4px 4px 0;
  border-color: transparent rgba(17, 24, 39, 0.95) transparent transparent;
}

/* 动画 */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
