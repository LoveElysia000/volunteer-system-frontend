<template>
  <div class="p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-center">消息组件演示</h2>

    <div class="space-y-4">
      <button
        class="btn btn-primary w-full"
        @click="showSuccess"
      >
        显示成功消息
      </button>

      <button
        class="btn btn-danger w-full"
        @click="showError"
      >
        显示错误消息
      </button>

      <button
        class="btn btn-warning w-full"
        @click="showWarning"
      >
        显示警告消息
      </button>

      <button
        class="btn btn-secondary w-full"
        @click="showInfo"
      >
        显示信息消息
      </button>

      <button
        class="btn btn-outline w-full"
        @click="showMultiple"
      >
        显示多条消息
      </button>

      <button
        class="btn btn-ghost w-full"
        @click="clearAll"
      >
        清除所有消息
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/store/modules/messages'

const messageStore = useMessageStore()

const showSuccess = () => {
  messageStore.success('操作成功完成！', {
    title: '成功'
  })
}

const showError = () => {
  messageStore.error('操作失败，请重试', {
    title: '错误',
    duration: 8000 // 8秒
  })
}

const showWarning = () => {
  messageStore.warning('请注意操作风险', {
    title: '警告'
  })
}

const showInfo = () => {
  messageStore.info('这是信息提示消息', {
    title: '信息'
  })
}

const showMultiple = () => {
  messageStore.success('第一条成功消息')
  setTimeout(() => {
    messageStore.error('第二条错误消息')
  }, 500)
  setTimeout(() => {
    messageStore.warning('第三条警告消息')
  }, 1000)
  setTimeout(() => {
    messageStore.info('第四条信息消息')
  }, 1500)
}

const clearAll = () => {
  messageStore.clearMessages()
}
</script>