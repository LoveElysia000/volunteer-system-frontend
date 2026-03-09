import { ref, onMounted, onUnmounted } from 'vue'

export function useCountUp(target: number, duration: number = 2000, delay: number = 300) {
  const current = ref(0)
  let rafId: number | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const animate = (currentTime: number, startTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    // easeOutExpo easing
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    current.value = Math.floor(easeProgress * target)

    if (progress < 1) {
      rafId = requestAnimationFrame((time) => animate(time, startTime))
    }
  }

  const start = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame((time) => animate(time, time))
  }

  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  onMounted(() => {
    if (delay > 0) {
      timeoutId = setTimeout(start, delay)
    } else {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    current,
    start,
    stop
  }
}

export default useCountUp
