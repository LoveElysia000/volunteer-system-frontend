<template>
  <div
    class="carousel-container"
    :style="{ height, width }"
    tabindex="0"
    role="region"
    :aria-label="ariaLabel"
    aria-roledescription="carousel"
    @keydown="handleKeydown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- 轮播轨道 -->
    <div
      ref="trackRef"
      class="carousel-track"
      :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }"
      aria-live="polite"
    >
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="carousel-slide"
        :aria-hidden="index !== currentSlideIndex"
        :aria-label="`幻灯片 ${index + 1} 共 ${slides?.length || 0}`"
      >
        <!-- 图片类型内容 -->
        <img
          v-if="slide.type === 'image'"
          :src="slide.content"
          :alt="slide.alt || '轮播图片'"
          class="w-full h-full object-cover"
        >

        <!-- 文本类型内容 -->
        <div
          v-else-if="slide.type === 'text'"
          class="w-full h-full flex items-center justify-center p-8"
          v-html="slide.content"
        />

        <!-- 组件类型内容 -->
        <component
          :is="slide.content"
          v-else-if="slide.type === 'component'"
        />

        <!-- 混合类型内容（默认） -->
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center p-8"
        >
          <div class="text-center text-gray-800">
            <div class="text-4xl mb-4">
              🌱
            </div>
            <h3 class="text-2xl font-bold mb-2">
              {{ slide.content?.title || '环保活动' }}
            </h3>
            <p class="text-lg mb-2">
              {{ slide.content?.description || '参与环保，共建美好家园' }}
            </p>
            <div class="flex justify-center gap-4 text-sm text-gray-600">
              <span v-if="slide.content?.date">📅 {{ slide.content.date }}</span>
              <span v-if="slide.content?.location">📍 {{ slide.content.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 左侧箭头 -->
    <button
      v-if="showArrows && slides && slides.length > 1"
      class="carousel-arrow left-4"
      :disabled="!loop && currentSlideIndex === 0"
      aria-label="上一张幻灯片"
      :style="{ opacity: (!loop && currentSlideIndex === 0) ? 0.5 : 1 }"
      @click="goToPrev"
    >
      <ChevronLeftIcon class="h-6 w-6 text-gray-700" />
    </button>

    <!-- 右侧箭头 -->
    <button
      v-if="showArrows && slides && slides.length > 1"
      class="carousel-arrow right-4"
      :disabled="!loop && currentSlideIndex === (slides.length - 1)"
      aria-label="下一张幻灯片"
      :style="{ opacity: (!loop && currentSlideIndex === (slides.length - 1)) ? 0.5 : 1 }"
      @click="goToNext"
    >
      <ChevronRightIcon class="h-6 w-6 text-gray-700" />
    </button>

    <!-- 指示点 - 已集成到进度条中 -->

    <!-- 进度条和播放控制 - Ant Design 风格 -->
    <div
      v-if="autoplay && slides && slides.length > 1"
      class="carousel-progress-wrapper"
    >
      <button
        class="carousel-play-pause"
        :aria-label="isAutoplayActive ? '暂停自动播放' : '开始自动播放'"
        @click="toggleAutoplay"
      >
        <PauseIcon v-if="isAutoplayActive" class="h-3.5 w-3.5" />
        <PlayIcon v-else class="h-3.5 w-3.5" />
      </button>
      <div
        class="carousel-progress-container"
        role="tablist"
        aria-label="幻灯片进度条和指示点"
      >
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="carousel-progress-item"
          :aria-label="`跳转到幻灯片 ${index + 1}`"
          :aria-selected="index === currentSlideIndex"
          role="tab"
          @click="goTo(index)"
        >
          <div
            class="carousel-progress-fill"
            :style="{
              width: index === currentSlideIndex ? `${progressPercentage}%` : '0%',
              opacity: index === currentSlideIndex ? 1 : 0.3
            }"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from 'lucide-vue-next'

interface CarouselSlide {
  id: string | number
  content: any
  type?: 'image' | 'text' | 'component' | 'mixed'
  alt?: string
}

interface Props {
  slides?: CarouselSlide[]
  autoplay?: boolean
  autoplayInterval?: number
  showArrows?: boolean
  showDots?: boolean
  loop?: boolean
  transitionDuration?: number
  height?: string
  width?: string
  pauseOnHover?: boolean
  initialSlide?: number
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  slides: () => [],
  autoplay: false,
  autoplayInterval: 5000,
  showArrows: true,
  showDots: true,
  loop: true,
  transitionDuration: 300,
  height: 'h-64',
  width: 'w-full',
  pauseOnHover: true,
  initialSlide: 0,
  ariaLabel: '轮播图'
})

// 响应式状态
const currentSlideIndex = ref(props.initialSlide)
const isAutoplayActive = ref(props.autoplay)
const isHovering = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)
const trackRef = ref<HTMLElement>()
const progressStartTime = ref<number>(Date.now())
const progressElapsed = ref<number>(0)

// 自动播放计时器
let progressTimer: number | null = null

// 计算属性
const totalSlides = computed(() => props.slides?.length || 0)
const isFirstSlide = computed(() => currentSlideIndex.value === 0)
const isLastSlide = computed(() => currentSlideIndex.value === totalSlides.value - 1)
const progressPercentage = computed(() => {
  if (!props.autoplay || !isAutoplayActive.value) return 0
  const elapsed = progressElapsed.value
  const interval = props.autoplayInterval
  return Math.min((elapsed / interval) * 100, 100)
})

// 切换幻灯片
const goTo = (index: number) => {
  if (index >= 0 && index < totalSlides.value) {
    currentSlideIndex.value = index
    resetAutoplay()
  }
}

const goToNext = () => {
  if (props.loop || !isLastSlide.value) {
    currentSlideIndex.value = (currentSlideIndex.value + 1) % totalSlides.value
    resetAutoplay()
  }
}

const goToPrev = () => {
  if (props.loop || !isFirstSlide.value) {
    currentSlideIndex.value = currentSlideIndex.value > 0
      ? currentSlideIndex.value - 1
      : totalSlides.value - 1
    resetAutoplay()
  }
}

// 进度条更新
const updateProgress = () => {
  if (props.autoplay && isAutoplayActive.value) {
    const now = Date.now()
    const elapsed = now - progressStartTime.value
    progressElapsed.value = elapsed

    // 如果进度条到达100%，立即切换到下一张幻灯片
    if (elapsed >= props.autoplayInterval) {
      goToNext()
    }
  }
}

// 自动播放控制
const startAutoplay = () => {
  if (props.autoplay && totalSlides.value > 1) {
    isAutoplayActive.value = true
    progressStartTime.value = Date.now()
    progressElapsed.value = 0

    // 启动进度条更新（负责进度显示和切换）
    progressTimer = window.setInterval(updateProgress, 50)
  }
}

const stopAutoplay = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
  isAutoplayActive.value = false
  progressElapsed.value = 0
}

const resetAutoplay = () => {
  if (props.autoplay) {
    stopAutoplay()
    startAutoplay()
  }
}

// 鼠标事件处理
const handleMouseEnter = () => {
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
}

// 触摸事件处理
const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
}

const handleTouchMove = (event: TouchEvent) => {
  touchEndX.value = event.touches[0].clientX
}

const handleTouchEnd = () => {
  const diff = touchStartX.value - touchEndX.value
  const swipeThreshold = 50

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      goToNext()
    } else {
      goToPrev()
    }
  }
}

// 键盘导航
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      goToPrev()
      break
    case 'ArrowRight':
      event.preventDefault()
      goToNext()
      break
    case 'Home':
      event.preventDefault()
      goTo(0)
      break
    case 'End':
      event.preventDefault()
      goTo(totalSlides.value - 1)
      break
    case ' ':
    case 'Spacebar':
      event.preventDefault()
      toggleAutoplay()
      break
  }
}

// 切换自动播放
const toggleAutoplay = () => {
  if (isAutoplayActive.value) {
    stopAutoplay()
  } else {
    startAutoplay()
  }
}

// 生命周期
onMounted(() => {
  if (props.autoplay) {
    // 立即启动自动播放，不需要等待用户交互
    startAutoplay()
  }
})

onUnmounted(() => {
  stopAutoplay()
})

// 监听属性变化
watch(() => props.autoplay, (newValue) => {
  if (newValue) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
})

watch(() => props.autoplayInterval, () => {
  if (props.autoplay) {
    resetAutoplay()
  }
})

watch(() => props.initialSlide, (newValue) => {
  currentSlideIndex.value = newValue
})
</script>