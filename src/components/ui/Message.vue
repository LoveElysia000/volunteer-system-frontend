<template>
  <div
    :class="[
      'message',
      `message-${type}`,
      {
        'message-dismissible': dismissible
      }
    ]"
    role="alert"
    aria-live="polite"
  >
    <!-- 消息图标 -->
    <div class="message-icon">
      <component
        :is="iconComponent"
        class="h-5 w-5"
      />
    </div>

    <!-- 消息内容 -->
    <div class="message-content">
      <!-- 标题 -->
      <h4
        v-if="title"
        class="message-title"
      >
        {{ title }}
      </h4>

      <!-- 消息文本 -->
      <p class="message-text">
        {{ message }}
      </p>
    </div>

    <!-- 关闭按钮 -->
    <button
      v-if="dismissible"
      class="message-close"
      aria-label="关闭消息"
      @click="handleClose"
    >
      <XIcon class="h-4 w-4" />
    </button>

    <!-- 进度指示器 -->
    <div
      v-if="duration > 0"
      class="message-progress"
    >
      <div
        class="message-progress-bar"
        :style="{ animationDuration: `${duration}ms` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  XIcon
} from 'lucide-vue-next'
import type { MessageType } from '@/types/messages'

interface Props {
  type?: MessageType
  title?: string
  message: string
  duration?: number
  dismissible?: boolean
  onClose?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  dismissible: true
})

const emit = defineEmits<{
  close: []
}>()

// 根据类型选择图标
const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: AlertTriangleIcon,
    info: InfoIcon
  }
  return icons[props.type]
})

// 处理关闭
const handleClose = () => {
  emit('close')
  if (props.onClose) {
    props.onClose()
  }
}
</script>