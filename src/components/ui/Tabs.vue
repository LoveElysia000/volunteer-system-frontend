<template>
  <div class="tabs">
    <!-- 标签栏 -->
    <div
      class="tabs-header"
      :class="{
        'tabs-header-vertical': vertical,
        'tabs-header-underline': type === 'underline',
        'tabs-header-pills': type === 'pills'
      }"
    >
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{
          'tab-active': modelValue === tab.value,
          'tab-disabled': tab.disabled
        }"
        @click="selectTab(tab)"
      >
        <slot
          name="tab"
          :tab="tab"
        >
          <span class="tab-label">{{ tab.label }}</span>
        </slot>
      </div>

      <!-- 下划线指示器（仅 underline 类型） -->
      <div
        v-if="type === 'underline'"
        class="tab-indicator"
        :style="indicatorStyle"
      />
    </div>

    <!-- 内容区 -->
    <div class="tabs-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

interface Tab {
  label: string
  value: string
  disabled?: boolean
}

interface Props {
  modelValue: string
  tabs: Tab[]
  type?: 'underline' | 'pills'
  vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'underline',
  vertical: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const activeIndex = computed(() => {
  return props.tabs.findIndex(tab => tab.value === props.modelValue)
})

const indicatorStyle = computed(() => {
  if (props.vertical) {
    return {
      top: `${activeIndex.value * 40}px`,
      height: '40px',
      width: '2px',
      left: 0
    }
  }
  return {
    left: `${activeIndex.value * (100 / props.tabs.length)}%`,
    width: `${100 / props.tabs.length}%`,
    height: '2px',
    bottom: 0
  }
})

const selectTab = (tab: Tab) => {
  if (tab.disabled) return
  emit('update:modelValue', tab.value)
  emit('change', tab.value)
}

// Provide for TabPane
const tabsValue = computed(() => props.modelValue)
provide('tabsValue', tabsValue)
</script>

<script lang="ts">
import { h, computed as vueComputed, inject as vueInject } from 'vue'

// TabPane 子组件
export const TabPane = {
  name: 'TabPane',
  props: {
    value: String,
    label: String
  },
  setup(props: { value?: string, label?: string }, { slots }: any) {
    const tabsValue = vueInject<ReturnType<typeof vueComputed<string>>>('tabsValue')
    const isActive = vueComputed(() => tabsValue?.value === props.value)

    return () => {
      if (!isActive.value) return null
      return h('div', { class: 'tab-pane' }, slots.default?.())
    }
  }
}
</script>

<style scoped>
.tabs {
  width: 100%;
}

.tabs-header {
  position: relative;
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.tabs-header-vertical {
  flex-direction: column;
  border-bottom: none;
  border-right: 1px solid #e5e7eb;
}

.tab {
  position: relative;
  flex: 1;
  padding: 12px 16px;
  cursor: pointer;
  text-align: center;
  font-size: 0.9375rem;
  color: #6b7280;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab:hover:not(.tab-disabled) {
  color: #111827;
}

.tab-active {
  color: var(--tw-colors-primary-600, #059669);
  font-weight: 500;
}

.tab-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Pills style */
.tabs-header-pills {
  gap: 4px;
  padding: 4px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
}

.tabs-header-pills .tab {
  flex: none;
  padding: 8px 16px;
  border-radius: 6px;
}

.tabs-header-pills .tab-active {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Indicator */
.tab-indicator {
  position: absolute;
  background: var(--tw-colors-primary-500, #10b981);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tabs-header-vertical .tab-indicator {
  left: 0;
  right: auto;
}

/* Content */
.tabs-content {
  padding: 16px 0;
}

.tab-pane {
  animation: tabPaneEnter 0.3s ease;
}

@keyframes tabPaneEnter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
