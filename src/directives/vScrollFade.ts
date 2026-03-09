import type { DirectiveBinding, ObjectDirective } from 'vue'

interface ScrollFadeElement extends HTMLElement {
  _scrollObserver?: IntersectionObserver
  _onScroll?: () => void
}

const vScrollFade: ObjectDirective<ScrollFadeElement> = {
  mounted(el: ScrollFadeElement, binding: DirectiveBinding) {
    // 初始状态
    el.classList.add('scroll-fade-in')

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 添加延迟动效
          const delay = binding.arg ? parseInt(binding.arg) * 100 : 0
          setTimeout(() => {
            el.classList.add('visible')
          }, delay)

          // 如果只需要触发一次，取消观察
          if (binding.modifiers?.once && el._scrollObserver) {
            el._scrollObserver.unobserve(el)
          }
        } else if (!binding.modifiers?.once) {
          // 非 once 模式下，移出视口时重置（可选）
          // el.classList.remove('visible')
        }
      })
    }

    el._scrollObserver = new IntersectionObserver(callback, options)
    el._scrollObserver.observe(el)
  },

  unmounted(el: ScrollFadeElement) {
    if (el._scrollObserver) {
      el._scrollObserver.disconnect()
      delete el._scrollObserver
    }
  }
}

export default vScrollFade
