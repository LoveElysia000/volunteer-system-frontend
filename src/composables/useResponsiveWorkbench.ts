import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { WORKBENCH_BREAKPOINTS } from '@/constants/workbench'

export type WorkbenchMode = 'expanded' | 'compact' | 'mobile'

export const useResponsiveWorkbench = () => {
  const viewportWidth = ref(
    typeof window === 'undefined' ? WORKBENCH_BREAKPOINTS.compactMax + 1 : window.innerWidth
  )

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
    if (viewportWidth.value <= WORKBENCH_BREAKPOINTS.mobileMax) return 'mobile'
    if (viewportWidth.value <= WORKBENCH_BREAKPOINTS.compactMax) return 'compact'
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
