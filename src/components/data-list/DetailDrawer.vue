<template>
  <Teleport to="body">
    <Transition name="detail-drawer-mask">
      <div
        v-if="modelValue"
        class="detail-drawer-overlay"
        :style="drawerStyle"
        @click="handleMaskClick"
      >
        <Transition name="detail-drawer-panel">
          <aside
            v-if="modelValue"
            ref="drawerRef"
            class="data-drawer-surface detail-drawer-panel"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title && !hasCustomHeader ? titleId : undefined"
            :aria-label="hasCustomHeader ? ariaLabel || title || undefined : (!title ? ariaLabel || undefined : undefined)"
            tabindex="-1"
            @click.stop
          >
            <header
              v-if="$slots.header || title || subtitle || metaList.length"
              class="detail-drawer-header"
            >
              <slot name="header">
                <div class="min-w-0 space-y-2">
                  <p
                    v-if="metaList.length"
                    class="flex flex-wrap gap-2"
                  >
                    <span
                      v-for="item in metaList"
                      :key="item"
                      class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                    >
                      {{ item }}
                    </span>
                  </p>

                  <div class="min-w-0 space-y-1">
                    <h2
                      v-if="title"
                      :id="title ? titleId : undefined"
                      class="text-lg font-bold tracking-tight text-slate-900"
                    >
                      {{ title }}
                    </h2>
                    <p
                      v-if="subtitle"
                      class="text-sm leading-6 text-slate-500"
                    >
                      {{ subtitle }}
                    </p>
                  </div>
                </div>
              </slot>

              <button
                type="button"
                class="detail-drawer-close"
                :aria-label="closeLabel"
                @click="close"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </header>

            <div class="detail-drawer-body">
              <slot />
            </div>

            <footer
              v-if="$slots.footer"
              class="detail-drawer-footer"
            >
              <slot name="footer" />
            </footer>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, useSlots } from 'vue'
import { XIcon } from 'lucide-vue-next'
import { lockBodyScroll, unlockBodyScroll } from '@/components/ui/bodyScrollLock'
import { getOverlayZIndex, getTopOverlayElement, hasOpenOverlays, isTopOverlay, registerOverlay, setOverlayElement, unregisterOverlay } from '@/components/ui/overlayStack'
import { captureFocusedElement, focusInitialElement, restoreFocusIfAllowed, trapTabWithinOverlay } from '@/components/ui/overlayFocus'

interface Props {
  modelValue?: boolean
  title?: string
  subtitle?: string
  meta?: string | string[]
  width?: string
  ariaLabel?: string
  maskClosable?: boolean
  closeOnEsc?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  subtitle: '',
  meta: () => [],
  width: '480px',
  ariaLabel: '',
  maskClosable: true,
  closeOnEsc: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const drawerRef = ref<HTMLElement>()
const overlayId = ref<number | null>(null)
const previouslyFocusedElement = ref<HTMLElement | null>(null)
const titleId = computed(() => overlayId.value !== null ? `detail-drawer-title-${overlayId.value}` : undefined)
const slots = useSlots()
const hasCustomHeader = computed(() => Boolean(slots.header))
const metaList = computed(() => (Array.isArray(props.meta) ? props.meta : props.meta ? [props.meta] : []))
const closeLabel = computed(() => props.title ? `关闭 ${props.title}` : '关闭抽屉')
const drawerStyle = computed(() => ({
  '--detail-drawer-width': props.width,
  zIndex: getOverlayZIndex(overlayId.value)
}))

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

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !props.modelValue || !props.closeOnEsc || event.defaultPrevented || !isTopOverlay(overlayId.value)) {
    return
  }

  event.preventDefault()
  close()
}

const handleOverlayKeydown = (event: KeyboardEvent) => {
  if (!props.modelValue || !isTopOverlay(overlayId.value)) {
    return
  }

  if (drawerRef.value && trapTabWithinOverlay(event, drawerRef.value)) {
    return
  }

  handleKeydown(event)
}

watch(() => props.modelValue, (value) => {
  if (value) {
    openOverlay()
    lockBodyScroll()
    document.addEventListener('keydown', handleOverlayKeydown)
    nextTick(() => {
      if (drawerRef.value) {
        if (overlayId.value !== null) {
          setOverlayElement(overlayId.value, drawerRef.value)
        }
        focusInitialElement(drawerRef.value)
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
.detail-drawer-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
}

.detail-drawer-panel {
  display: flex;
  flex-direction: column;
  width: min(100vw, var(--detail-drawer-width));
  height: 100vh;
  max-height: 100vh;
  border-radius: 0;
  transform-origin: right center;
}

.detail-drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 20px 0;
}

.detail-drawer-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 9999px;
  color: #64748b;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.detail-drawer-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.detail-drawer-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 20px;
}

.detail-drawer-footer {
  flex: none;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.96);
  padding: 16px 20px calc(16px + env(safe-area-inset-bottom));
}

@media (min-width: 1024px) {
  .detail-drawer-overlay {
    padding: 16px;
  }

  .detail-drawer-panel {
    width: min(calc(100vw - 32px), var(--detail-drawer-width));
    height: calc(100vh - 32px);
    max-height: calc(100vh - 32px);
    border-radius: 24px;
    box-shadow: 0 28px 70px -34px rgba(15, 23, 42, 0.4);
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .detail-drawer-panel {
    width: min(calc(100vw - 32px), 480px);
  }
}

.detail-drawer-mask-enter-active,
.detail-drawer-mask-leave-active {
  transition: opacity 0.22s ease;
}

.detail-drawer-mask-enter-from,
.detail-drawer-mask-leave-to {
  opacity: 0;
}

.detail-drawer-panel-enter-active,
.detail-drawer-panel-leave-active {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease;
}

.detail-drawer-panel-enter-from,
.detail-drawer-panel-leave-to {
  opacity: 0;
  transform: translateX(18px);
}

@media (prefers-reduced-motion: reduce) {
  .detail-drawer-mask-enter-active,
  .detail-drawer-mask-leave-active,
  .detail-drawer-panel-enter-active,
  .detail-drawer-panel-leave-active {
    transition-duration: 0.01ms !important;
  }
}
</style>
