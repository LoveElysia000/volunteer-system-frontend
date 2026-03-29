import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export type WorkbenchMode = 'expanded' | 'compact' | 'mobile'

const MOBILE_MAX_WIDTH = 1023
const COMPACT_MAX_WIDTH = 1439

export const useResponsiveWorkbench = () => {
  const viewportWidth = ref(typeof window === 'undefined' ? COMPACT_MAX_WIDTH + 1 : window.innerWidth)

  const syncViewportWidth = () => {
    viewportWidth.value = window.innerWidth
  }

  onMounted(() => {
    syncViewportWidth()
    window.addEventListener('resize', syncViewportWidth, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', syncViewportWidth)
  })

  const mode = computed<WorkbenchMode>(() => {
    if (viewportWidth.value <= MOBILE_MAX_WIDTH) return 'mobile'
    if (viewportWidth.value <= COMPACT_MAX_WIDTH) return 'compact'
    return 'expanded'
  })

  return {
    viewportWidth,
    mode,
    isMobile: computed(() => mode.value === 'mobile'),
    isCompact: computed(() => mode.value === 'compact'),
    isExpanded: computed(() => mode.value === 'expanded')
  }
}
