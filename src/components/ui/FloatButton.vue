<template>
  <button
    class="float-button"
    :title="tooltip"
    @click="handleClick"
  >
    <component
      :is="icon"
      class="h-5 w-5"
    />
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  icon?: any
  tooltip?: string
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  tooltip: '回到主页',
  to: '/'
})

const router = useRouter()

const handleClick = () => {
  if (props.to) {
    router.push(props.to)
  }
}
</script>

<style scoped>
.float-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #38a169 0%, #2a8550 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(56, 161, 105, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.float-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(56, 161, 105, 0.4);
  background: linear-gradient(135deg, #2a8550 0%, #236a41 100%);
}

.float-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(56, 161, 105, 0.3);
}
</style>