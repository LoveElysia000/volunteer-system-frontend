<template>
  <div
    ref="container"
    class="fixed inset-0 -z-100 overflow-hidden"
    :class="{ 'pointer-events-none': !enableMouseFollow && !enableClickRipple }"
    @mousemove="handleMouseMove"
    @click="handleClick"
  >
    <!-- 主要粒子层 -->
    <div class="absolute inset-0">
      <!-- 绿叶粒子（替换圆形粒子） -->
      <div
        v-for="particle in brandParticles"
        :key="particle.id"
        class="absolute transition-all duration-500"
        :style="{
          top: particle.top + '%',
          left: particle.left + '%',
          animation: `leafFloat-c23563bd ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
          transform: `translate3d(${particle.mouseOffsetX}px, ${particle.mouseOffsetY}px, 0) rotate(${particle.rotation}deg)`
        }"
      >
        <svg
          :width="24"
          :height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            :d="particle.shape"
            :fill="particle.color"
            fill-opacity="0.8"
          />
        </svg>
      </div>

      <!-- 绿叶粒子（替换自然色粒子） -->
      <div
        v-for="particle in natureParticles"
        :key="particle.id"
        class="absolute transition-all duration-500"
        :style="{
          top: particle.top + '%',
          left: particle.left + '%',
          animation: `leafFloat-c23563bd ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
          transform: `translate3d(${particle.mouseOffsetX}px, ${particle.mouseOffsetY}px, 0) rotate(${particle.rotation}deg)`
        }"
      >
        <svg
          :width="20"
          :height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            :d="particle.shape"
            :fill="particle.color"
            fill-opacity="0.7"
          />
        </svg>
      </div>

      <!-- 绿叶粒子 -->
      <div
        v-for="leaf in leafParticles"
        :key="leaf.id"
        class="absolute transition-all duration-500"
        :style="{
          top: leaf.top + '%',
          left: leaf.left + '%',
          animation: `leafFloat-c23563bd ${leaf.duration}s ease-in-out infinite ${leaf.delay}s`,
          transform: `translate3d(${leaf.mouseOffsetX}px, ${leaf.mouseOffsetY}px, 0) rotate(${leaf.rotation}deg)`
        }"
      >
        <svg
          :width="leaf.size"
          :height="leaf.size"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            :d="leaf.shape"
            :fill="leaf.color"
            fill-opacity="0.9"
          />
        </svg>
      </div>
    </div>

    <!-- 涟漪效果层 -->
    <div
      v-for="ripple in ripples"
      :key="ripple.id"
      class="absolute rounded-full bg-gradient-to-r from-primary-400/20 to-green-400/20"
      :style="{
        top: ripple.top + 'px',
        left: ripple.left + 'px',
        width: '100px',
        height: '100px',
        transform: 'translate(-50%, -50%)',
        animation: `ripple-c23563bd ${ripple.duration}ms ease-out forwards`
      }"
    />

    <!-- 渐变遮罩层 -->
    <!-- <div class="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-gray-100/20"></div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  id: number
  top: number
  left: number
  shape: string
  color: string
  duration: number
  delay: number
  rotation: number
  mouseOffsetX: number
  mouseOffsetY: number
}

interface LeafParticle {
  id: number
  top: number
  left: number
  shape: string
  color: string
  size: number
  duration: number
  delay: number
  rotation: number
  mouseOffsetX: number
  mouseOffsetY: number
}

interface Ripple {
  id: number
  top: number
  left: number
  size: number
  duration: number
}

// Props
interface Props {
  particleCount?: number
  leafCount?: number
  enableMouseFollow?: boolean
  enableClickRipple?: boolean
  intensity?: 'low' | 'medium' | 'high'
}

const props = withDefaults(defineProps<Props>(), {
  particleCount: 15,
  leafCount: 20,
  enableMouseFollow: true,
  enableClickRipple: true,
  intensity: 'medium'
})

// Reactive data
const container = ref<HTMLElement>()
const mousePosition = ref({ x: 0, y: 0 })
const brandParticles = ref<Particle[]>([])
const natureParticles = ref<Particle[]>([])
const leafParticles = ref<LeafParticle[]>([])
const ripples = ref<Ripple[]>([])
let rippleId = 0

// 根据强度设置粒子数量
const getParticleCountByIntensity = () => {
  const counts = {
    low: { particles: 10, leaves: 15 },
    medium: { particles: 15, leaves: 20 },
    high: { particles: 20, leaves: 30 }
  }
  return counts[props.intensity]
}

// 绿叶形状定义
const leafShapes = [
  // 枫叶
  'M12 2C8 6 4 8 2 12C4 16 8 18 12 22C16 18 20 16 22 12C20 8 16 6 12 2Z',
  // 橡树叶
  'M12 2C10 4 8 6 6 8C4 10 3 12 2 14C3 16 4 18 6 20C8 22 10 23 12 24C14 23 16 22 18 20C20 18 21 16 22 14C21 12 20 10 18 8C16 6 14 4 12 2Z',
  // 柳叶
  'M12 2C11 4 10 6 9 8C8 10 7 12 6 14C7 16 8 18 9 20C10 22 11 23 12 24C13 23 14 22 15 20C16 18 17 16 18 14C17 12 16 10 15 8C14 6 13 4 12 2Z',
  // 圆形叶片
  'M12 2C6 6 4 10 4 14C4 18 6 22 12 24C18 22 20 18 20 14C20 10 18 6 12 2Z'
]

// 绿叶颜色
const leafColors = [
  '#a7f3d0', // 浅绿
  '#6ee7b7', // 中等绿
  '#34d399', // 绿色
  '#10b981', // 深绿
  '#059669'  // 很深绿
]

// 生成圆形粒子
const generateParticles = () => {
  const { particles: particleCount } = getParticleCountByIntensity()

  // 品牌色粒子（环保主题色）- 现在使用绿叶
  for (let i = 0; i < Math.floor(particleCount / 2); i++) {
    brandParticles.value.push({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      shape: leafShapes[Math.floor(Math.random() * leafShapes.length)],
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 8,
      rotation: Math.random() * 360,
      mouseOffsetX: 0,
      mouseOffsetY: 0
    })
  }

  // 自然色系粒子
  for (let i = 0; i < Math.floor(particleCount / 2); i++) {
    natureParticles.value.push({
      id: i + particleCount / 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      shape: leafShapes[Math.floor(Math.random() * leafShapes.length)],
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      duration: 12 + Math.random() * 15,
      delay: Math.random() * 8,
      rotation: Math.random() * 360,
      mouseOffsetX: 0,
      mouseOffsetY: 0
    })
  }
}

// 生成绿叶粒子
const generateLeafParticles = () => {
  const { leaves: leafCount } = getParticleCountByIntensity()

  for (let i = 0; i < leafCount; i++) {
    leafParticles.value.push({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      shape: leafShapes[Math.floor(Math.random() * leafShapes.length)],
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      size: 16 + Math.random() * 8, // 16-24px
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 8,
      rotation: Math.random() * 360,
      mouseOffsetX: 0,
      mouseOffsetY: 0
    })
  }
}

// 鼠标移动事件处理
const handleMouseMove = (event: MouseEvent) => {
  if (!props.enableMouseFollow || !container.value) return

  const rect = container.value.getBoundingClientRect()
  mousePosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }

  // 更新所有粒子的鼠标偏移
  updateParticleMouseOffsets()
}

// 更新粒子鼠标偏移
const updateParticleMouseOffsets = () => {
  if (!container.value) return

  const centerX = container.value.clientWidth / 2
  const centerY = container.value.clientHeight / 2

  // 计算所有圆形粒子的偏移
  brandParticles.value.forEach(particle => {
    const particleX = centerX + (particle.left / 100) * container.value!.clientWidth
    const particleY = centerY + (particle.top / 100) * container.value!.clientHeight

    const distanceX = mousePosition.value.x - particleX
    const distanceY = mousePosition.value.y - particleY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    // 距离越近，偏移越大（最大20px）
    const maxDistance = 200
    const strength = Math.max(0, 1 - distance / maxDistance)

    particle.mouseOffsetX = (distanceX / distance) * strength * 20
    particle.mouseOffsetY = (distanceY / distance) * strength * 20
  })

  natureParticles.value.forEach(particle => {
    const particleX = centerX + (particle.left / 100) * container.value!.clientWidth
    const particleY = centerY + (particle.top / 100) * container.value!.clientHeight

    const distanceX = mousePosition.value.x - particleX
    const distanceY = mousePosition.value.y - particleY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    const maxDistance = 200
    const strength = Math.max(0, 1 - distance / maxDistance)

    particle.mouseOffsetX = (distanceX / distance) * strength * 15
    particle.mouseOffsetY = (distanceY / distance) * strength * 15
  })

  // 计算绿叶粒子的偏移
  leafParticles.value.forEach(leaf => {
    const leafX = centerX + (leaf.left / 100) * container.value!.clientWidth
    const leafY = centerY + (leaf.top / 100) * container.value!.clientHeight

    const distanceX = mousePosition.value.x - leafX
    const distanceY = mousePosition.value.y - leafY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    const maxDistance = 300
    const strength = Math.max(0, 1 - distance / maxDistance)

    leaf.mouseOffsetX = (distanceX / distance) * strength * 25
    leaf.mouseOffsetY = (distanceY / distance) * strength * 25
  })
}

// 点击事件处理
const handleClick = (event: MouseEvent) => {
  if (!props.enableClickRipple || !container.value) return

  const rect = container.value.getBoundingClientRect()
  const ripple = {
    id: rippleId++,
    top: event.clientY - rect.top,
    left: event.clientX - rect.left,
    size: 0,
    duration: 1000
  }

  ripples.value.push(ripple)

  // 自动移除涟漪
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== ripple.id)
  }, ripple.duration)
}


// 响应式粒子数量调整
const handleResize = () => {
  // 在窗口大小变化时重新计算鼠标偏移
  if (props.enableMouseFollow) {
    updateParticleMouseOffsets()
  }
}

onMounted(() => {
  console.log('EcoParticles组件已挂载')
  generateParticles()
  generateLeafParticles()
  console.log('生成的粒子数量:', brandParticles.value.length + natureParticles.value.length + leafParticles.value.length)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 漂浮动画 */
@keyframes float1 {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-20px) translateX(10px) scale(1.2);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-10px) translateX(20px) scale(1.1);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-15px) translateX(-10px) scale(1.3);
    opacity: 0.7;
  }
}

@keyframes float2 {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.2;
  }
  33% {
    transform: translateY(15px) translateX(-15px) scale(1.1);
    opacity: 0.4;
  }
  66% {
    transform: translateY(-10px) translateX(15px) scale(0.9);
    opacity: 0.3;
  }
}

@keyframes float3 {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.25;
  }
  20% {
    transform: translateY(-25px) translateX(5px) scale(1.4);
    opacity: 0.6;
  }
  40% {
    transform: translateY(10px) translateX(-20px) scale(0.8);
    opacity: 0.2;
  }
  60% {
    transform: translateY(-5px) translateX(25px) scale(1.1);
    opacity: 0.4;
  }
  80% {
    transform: translateY(20px) translateX(-5px) scale(1.2);
    opacity: 0.5;
  }
}

/* 绿叶飘动动画 */
@keyframes leafFloat-c23563bd {
  0% {
    transform: translateY(-100px) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  20% {
    transform: translateY(-60px) translateX(20px) rotate(45deg) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(0px) translateX(-10px) rotate(120deg) scale(0.95);
    opacity: 0.6;
  }
  80% {
    transform: translateY(40px) translateX(-30px) rotate(180deg) scale(0.9);
    opacity: 0.4;
  }
  100% {
    transform: translateY(100px) translateX(-50px) rotate(360deg) scale(0.7);
    opacity: 0;
  }
}

/* 涟漪效果动画 */
@keyframes ripple-c23563bd {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

/* 性能优化 */
.transition-transform {
  will-change: transform;
}

.absolute > div {
  contain: layout style paint;
}
</style>