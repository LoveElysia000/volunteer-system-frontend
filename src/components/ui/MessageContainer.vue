<template>
  <div
    :class="[
      'message-container',
      `message-container-${position}`
    ]"
  >
    <TransitionGroup
      name="message"
      tag="div"
      class="message-stack"
    >
      <Message
        v-for="message in visibleMessages"
        :key="message.id"
        :type="message.type"
        :title="message.title"
        :message="message.message"
        :duration="message.duration"
        :dismissible="message.dismissible"
        @close="() => removeMessage(message.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMessageStore } from '@/store/modules/messages'
import Message from './Message.vue'

interface Props {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-right'
})

const messageStore = useMessageStore()

// 获取可见消息
const visibleMessages = computed(() => messageStore.visibleMessages)

// 移除消息
const removeMessage = (id: string) => {
  messageStore.removeMessage(id)
}
</script>