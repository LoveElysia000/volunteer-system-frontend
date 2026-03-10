<template>
  <Teleport to="body">
    <Transition name="dialog-mask">
      <div
        v-if="modelValue"
        class="dialog-mask"
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
          >
            <!-- 头部 -->
            <div
              v-if="title || $slots.header"
              class="dialog-header"
            >
              <slot name="header">
                <h3 class="dialog-title">
                  {{ title }}
                </h3>
                <button
                  v-if="showClose"
                  class="dialog-close"
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
import { ref, watch, nextTick } from 'vue'
import { XIcon } from 'lucide-vue-next'
import Button from './Button.vue'

// 全局滚动锁定计数器（模块级别）
let globalScrollLockCount = 0

const lockBodyScroll = () => {
  globalScrollLockCount++
  if (globalScrollLockCount === 1) {
    document.body.style.overflow = 'hidden'
  }
}

const unlockBodyScroll = () => {
  globalScrollLockCount = Math.max(0, globalScrollLockCount - 1)
  if (globalScrollLockCount === 0) {
    document.body.style.overflow = ''
  }
}

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

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleMaskClick = () => {
  if (props.maskClosable) {
    close()
  }
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
  if (e.key === 'Escape' && props.modelValue && props.closeOnEsc) {
    close()
  }
}

// 滚动锁定
watch(() => props.modelValue, (val) => {
  if (val) {
    lockBodyScroll()
    document.addEventListener('keydown', handleKeydown)
    nextTick(() => {
      dialogRef.value?.focus()
    })
  } else {
    unlockBodyScroll()
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 50;
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
