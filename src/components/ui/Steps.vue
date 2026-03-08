<template>
  <div :class="['steps', { 'steps-vertical': vertical }]">
    <div
      v-for="(step, index) in items"
      :key="index"
      :class="[
        'step',
        {
          'step-current': index === current,
          'step-completed': index < current,
          'step-upcoming': index > current
        }
      ]"
      @click="handleStepClick(index)"
    >
      <!-- 步骤序号圆点 -->
      <div class="step-dot">
        <span
          v-if="index < current"
          class="step-check"
        >✓</span>
        <span v-else>{{ index + 1 }}</span>
      </div>

      <!-- 步骤标题 -->
      <div class="step-content">
        <div class="step-title">
          {{ step.title }}
        </div>
        <div
          v-if="step.description"
          class="step-description"
        >
          {{ step.description }}
        </div>
      </div>

      <!-- 连接线 -->
      <div
        v-if="!vertical && index !== items.length - 1"
        class="step-connector"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

interface StepItem {
  title: string
  description?: string
  content?: any
}

interface Props {
  current?: number
  vertical?: boolean
  items?: StepItem[]
}

const props = withDefaults(defineProps<Props>(), {
  current: 0,
  vertical: false,
  items: () => []
})

const emit = defineEmits<{
  change: [value: number]
}>()

const handleStepClick = (index: number) => {
  emit('change', index)
}
</script>

<style scoped>
.steps {
  @apply flex w-full;
}

.steps-vertical {
  @apply flex-col;
}

.step {
  @apply relative flex items-center flex-1;
}

.steps-vertical .step {
  @apply flex-col items-start pb-6;
}

.step-dot {
  @apply flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 text-sm font-medium bg-white transition-all duration-200;
}

.step-current .step-dot {
  @apply border-primary-500 text-primary-500 bg-primary-50;
}

.step-completed .step-dot {
  @apply border-primary-500 bg-primary-500 text-white;
}

.step-upcoming .step-dot {
  @apply border-gray-300 text-gray-400;
}

.step-content {
  @apply ml-4;
}

.steps-vertical .step-content {
  @apply ml-0 mt-2;
}

.step-title {
  @apply text-sm font-medium;
}

.step-current .step-title {
  @apply text-primary-600;
}

.step-completed .step-title {
  @apply text-gray-900;
}

.step-upcoming .step-title {
  @apply text-gray-500;
}

.step-description {
  @apply text-xs text-gray-500 mt-1;
}

.step-connector {
  @apply flex-1 h-0.5 bg-gray-200 ml-4 mr-2;
}

.steps-vertical .step-connector {
  @apply w-0.5 h-6 ml-3 mt-2 -mb-2;
}

.step-completed + .step .step-connector {
  @apply bg-primary-500;
}
</style>