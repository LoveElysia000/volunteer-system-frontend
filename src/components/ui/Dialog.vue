<template>
  <Teleport to="body">
    <Transition name="dialog-mask">
      <div
        v-if="modelValue"
        class="dialog-mask"
        :style="dialogStyle"
        @click="handleMaskClick"
      >
        <Transition name="dialog-content">
          <div
            v-if="modelValue"
            ref="dialogRef"
            class="dialog"
            :class="dialogClass"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            :aria-labelledby="title && !hasCustomHeader ? titleId : undefined"
            :aria-label="hasCustomHeader ? ariaLabel || title || undefined : (!title ? ariaLabel || undefined : undefined)"
            @click.stop
          >
            <!-- 头部 -->
            <div
              v-if="title || $slots.header"
              class="dialog-header"
            >
              <slot name="header">
                <h3
                  :id="title ? titleId : undefined"
                  class="dialog-title"
                >
                  {{ title }}
                </h3>
                <button
                  v-if="showClose"
                  type="button"
                  class="dialog-close"
                  :aria-label="closeLabel"
                  @click="close"
                >
                  <XIcon class="h-5 w-5" />
                </button>
              </slot>
            </div>

            <!-- 内容 -->
            <div class="dialog-body">
              <slot>{{ content }}</slot>
            </div>

            <!-- 底部 -->
            <div
              v-if="$slots.footer || showFooter"
              class="dialog-footer"
            >
              <slot name="footer">
                <Button
                  v-if="showCancel"
                  variant="ghost"
                  @click="handleCancel"
                >
                  {{ cancelText }}
                </Button>
                <Button
                  :variant="confirmVariant"
                  :loading="confirmLoading"
                  @click="handleConfirm"
                >
                  {{ confirmText }}
                </Button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onBeforeUnmount, useSlots } from 'vue'
import { XIcon } from 'lucide-vue-next'
import Button from './Button.vue'
import { lockBodyScroll, unlockBodyScroll } from './bodyScrollLock'
import { getOverlayZIndex, getTopOverlayElement, hasOpenOverlays, isTopOverlay, registerOverlay, setOverlayElement, unregisterOverlay } from './overlayStack'
import { captureFocusedElement, focusInitialElement, restoreFocusIfAllowed, trapTabWithinOverlay } from './overlayFocus'

interface Props {
  modelValue?: boolean
  title?: string
  content?: string
  width?: string
  showClose?: boolean
  showFooter?: boolean
  showCancel?: boolean
  cancelText?: string
  confirmText?: string
  confirmVariant?: 'primary' | 'danger'
  confirmLoading?: boolean
  dialogClass?: string
  ariaLabel?: string
  maskClosable?: boolean
  closeOnEsc?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  content: '',
  width: '420px',
  showClose: true,
  showFooter: true,
  showCancel: true,
  cancelText: '取消',
  confirmText: '确定',
  confirmVariant: 'primary',
  confirmLoading: false,
  dialogClass: '',
  ariaLabel: '',
  maskClosable: true,
  closeOnEsc: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  cancel: []
  confirm: []
}>()

const dialogRef = ref<HTMLElement>()
const overlayId = ref<number | null>(null)
const previouslyFocusedElement = ref<HTMLElement | null>(null)
const titleId = computed(() => overlayId.value !== null ? `dialog-title-${overlayId.value}` : undefined)
const slots = useSlots()
const hasCustomHeader = computed(() => Boolean(slots.header))
const dialogStyle = computed(() => ({ zIndex: getOverlayZIndex(overlayId.value) }))
const closeLabel = computed(() => props.title ? `关闭 ${props.title}` : '关闭对话框')

const openOverlay = () => {
  if (overlayId.value === null) {
    previouslyFocusedElement.value = captureFocusedElement()
    overlayId.value = registerOverlay()
  }
}

const closeOverlay = () => {
  if (overlayId.value !== null) {
    unregisterOverlay(overlayId.value)
    overlayId.value = null
  }

  const topOverlayElement = getTopOverlayElement()
  restoreFocusIfAllowed(previouslyFocusedElement.value, topOverlayElement, hasOpenOverlays())
  previouslyFocusedElement.value = null
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleMaskClick = () => {
  if (props.maskClosable) {
    close()
  }
}

const handleOverlayKeydown = (event: KeyboardEvent) => {
  if (!props.modelValue || !isTopOverlay(overlayId.value)) {
    return
  }

  if (dialogRef.value && trapTabWithinOverlay(event, dialogRef.value)) {
    return
  }

  handleKeydown(event)
}

const handleCancel = () => {
  emit('cancel')
  close()
}

const handleConfirm = () => {
  emit('confirm')
}

// ESC 关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape' || !props.modelValue || !props.closeOnEsc || e.defaultPrevented || !isTopOverlay(overlayId.value)) {
    return
  }

  e.preventDefault()
  close()
}

// 滚动锁定
watch(() => props.modelValue, (val) => {
  if (val) {
    openOverlay()
    lockBodyScroll()
    document.addEventListener('keydown', handleOverlayKeydown)
    nextTick(() => {
      if (dialogRef.value) {
        if (overlayId.value !== null) {
          setOverlayElement(overlayId.value, dialogRef.value)
        }
        focusInitialElement(dialogRef.value)
      }
    })
  } else {
    closeOverlay()
    unlockBodyScroll()
    document.removeEventListener('keydown', handleOverlayKeydown)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (props.modelValue) {
    closeOverlay()
    unlockBodyScroll()
  }
  document.removeEventListener('keydown', handleOverlayKeydown)
})
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  padding: 16px;
}

.dialog {
  background: white;
  border-radius: 16px;
  width: v-bind(width);
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  overflow: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0;
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.dialog-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #6b7280;
  transition: all 0.2s;
}

.dialog-close:hover {
  background: #f3f4f6;
  color: #111827;
}

.dialog-body {
  padding: 20px;
  font-size: 0.9375rem;
  color: #4b5563;
  line-height: 1.6;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 20px 20px;
}

/* 动画 */
.dialog-mask-enter-active,
.dialog-mask-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-mask-enter-from,
.dialog-mask-leave-to {
  opacity: 0;
}

.dialog-content-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-content-leave-active {
  transition: all 0.2s ease;
}

.dialog-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.dialog-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
