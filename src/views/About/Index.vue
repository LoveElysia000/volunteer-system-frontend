<template>
  <div class="space-y-8">
    <!-- 页面标题区域 -->
    <div
      ref="titleSection"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-up"
      :class="{ 'animate-in': titleInView }"
    >
      <div class="text-center space-y-6">
        <div class="inline-flex items-center justify-center space-x-3">
          <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <span class="text-xl text-primary-600">🌱</span>
          </div>
          <h1 class="text-4xl font-bold text-gray-900">
            平台介绍
          </h1>
        </div>
        <p class="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          了解环保志愿者平台的使命、特色功能和使用指南
        </p>

        <!-- 特色标签 -->
        <div class="flex flex-wrap justify-center gap-3 mt-4">
          <span class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            智能管理
          </span>
          <span class="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            数据分析
          </span>
          <span class="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            安全保障
          </span>
          <span class="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            <span class="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            成就系统
          </span>
        </div>
      </div>
    </div>

    <!-- 平台概述 -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 使命 -->
      <div
        ref="missionCard"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover-lift animate-fade-up"
        :class="[inViewCards.mission ? 'animate-in' : '', inViewCards.mission ? 'delay-100' : '']"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            <span class="text-xl">🎯</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">
            平台使命
          </h2>
        </div>
        <p class="text-gray-600 leading-relaxed">
          通过技术创新连接环保组织和志愿者，简化活动管理流程，
          促进更多人参与到环境保护活动中来。
        </p>
      </div>

      <!-- 愿景 -->
      <div
        ref="visionCard"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover-lift animate-fade-up"
        :class="[inViewCards.vision ? 'animate-in' : '', inViewCards.vision ? 'delay-200' : '']"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <span class="text-xl">🌟</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">
            平台愿景
          </h2>
        </div>
        <p class="text-gray-600 leading-relaxed">
          打造国内领先的环保志愿者服务平台，
          成为连接环保行动者与环保需求的重要桥梁。
        </p>
      </div>

      <!-- 价值观 -->
      <div
        ref="valuesCard"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover-lift animate-fade-up"
        :class="[inViewCards.values ? 'animate-in' : '', inViewCards.values ? 'delay-300' : '']"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <span class="text-xl">❤️</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">
            核心价值观
          </h2>
        </div>
        <p class="text-gray-600 leading-relaxed">
          环保优先、用户体验、技术驱动、社会责任、开放合作
        </p>
      </div>
    </div>

    <!-- 特色功能 -->
    <div
      ref="featuresSection"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      :class="{ 'animate-in': featuresInView }"
    >
      <h2 class="text-2xl font-bold text-gray-900 mb-6 animate-fade-up">
        特色功能
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="feature-card group space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover-lift"
          :class="[featuresInView ? 'animate-in' : '', featuresInView ? `delay-${(index + 1) * 100}` : '']"
          :style="{ 'animation-delay': featuresInView ? `${(index + 1) * 100}ms` : '0ms' }"
        >
          <div class="w-14 h-14 bg-gradient-to-br rounded-xl flex items-center justify-center hover-scale relative overflow-hidden">
            <span class="text-2xl z-10">{{ feature.icon }}</span>
            <div class="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300" :class="feature.gradient"></div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-primary-600">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- 使用指南 -->
    <div
      ref="guideSection"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      :class="{ 'animate-in': guideInView }"
    >
      <h2 class="text-2xl font-bold text-gray-900 mb-8 animate-fade-up">
        使用指南
      </h2>
      <div class="grid md:grid-cols-2 gap-8">
        <!-- 志愿者使用流程 -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 animate-slide-in-left"
              :class="{ 'animate-in': guideInView }"
          >
            志愿者使用流程
          </h3>
          <div class="space-y-4 relative step-card-container">

            <div
              v-for="(step, index) in volunteerSteps"
              :key="index"
              class="step-card relative z-10"
              :class="[guideInView ? 'animate-in' : '', guideInView ? `delay-${(index + 1) * 100}` : '']"
              :style="{ 'animation-delay': guideInView ? `${(index + 1) * 100}ms` : '0ms' }"
            >
              <div class="step-number-container">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <h4 class="step-title">步骤 {{ index + 1 }}</h4>
                  <p class="step-description">{{ step }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 组织使用流程 -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 animate-slide-in-right"
              :class="{ 'animate-in': guideInView }"
          >
            组织使用流程
          </h3>
          <div class="space-y-4 relative step-card-container">

            <div
              v-for="(step, index) in organizationSteps"
              :key="index"
              class="step-card relative z-10"
              :class="[guideInView ? 'animate-in' : '', guideInView ? `delay-${(index + 1) * 100}` : '']"
              :style="{ 'animation-delay': guideInView ? `${(index + 1) * 100}ms` : '0ms' }"
            >
              <div class="step-number-container">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <h4 class="step-title">步骤 {{ index + 1 }}</h4>
                  <p class="step-description">{{ step }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 常见问题 -->
    <div
      ref="faqSection"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      :class="{ 'animate-in': faqInView }"
    >
      <h2 class="text-2xl font-bold text-gray-900 mb-6 animate-fade-up">
        常见问题
      </h2>
      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="faq-item group animate-fade-up p-6 rounded-xl border border-gray-200 bg-white hover-lift"
          :class="[faqInView ? 'animate-in' : '', faqInView ? `delay-${(index + 1) * 100}` : '']"
          :style="{ 'animation-delay': faqInView ? `${(index + 1) * 100}ms` : '0ms' }"
        >
          <div class="flex items-start space-x-4">
            <div class="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1 flex-shrink-0">
              Q
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                {{ faq.question }}
              </h3>
              <div class="mt-3 pl-4 border-l-2 border-primary-200 group-hover:border-primary-400 transition-colors duration-300">
                <p class="text-gray-600 leading-relaxed">
                  {{ faq.answer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系我们 -->
    <div
      ref="contactSection"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      :class="{ 'animate-in': contactInView }"
    >
      <h2 class="text-2xl font-bold text-gray-900 mb-6 animate-fade-up">
        联系我们
      </h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div
          class="animate-slide-in-left"
          :class="{ 'animate-in': contactInView }"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            客服支持
          </h3>
          <div class="space-y-2 text-gray-600">
            <p class="flex items-center space-x-2 hover-pulse">
              <span class="icon-float">📧</span>
              <span>邮箱：support@volunteer-platform.com</span>
            </p>
            <p class="flex items-center space-x-2 hover-pulse">
              <span class="icon-float">📞</span>
              <span>电话：400-123-4567</span>
            </p>
            <p class="flex items-center space-x-2 hover-pulse">
              <span class="icon-float">🕒</span>
              <span>工作时间：工作日 9:00-18:00</span>
            </p>
          </div>
        </div>
        <div
          class="animate-slide-in-right"
          :class="{ 'animate-in': contactInView }"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            技术反馈
          </h3>
          <div class="space-y-2 text-gray-600">
            <p class="flex items-center space-x-2 hover-pulse">
              <span class="icon-float">🐛</span>
              <span>问题反馈：GitHub Issues</span>
            </p>
            <p class="flex items-center space-x-2 hover-pulse">
              <span class="icon-float">💡</span>
              <span>功能建议：意见反馈页面</span>
            </p>
            <p class="flex items-center space-x-2 hover-pulse">
              <span class="icon-float">📚</span>
              <span>文档中心：帮助文档页面</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// 页面元素引用
const titleSection = ref<HTMLElement>()
const missionCard = ref<HTMLElement>()
const visionCard = ref<HTMLElement>()
const valuesCard = ref<HTMLElement>()
const featuresSection = ref<HTMLElement>()
const guideSection = ref<HTMLElement>()
const faqSection = ref<HTMLElement>()
const contactSection = ref<HTMLElement>()

// 视口可见状态
const titleInView = ref(false)
const inViewCards = reactive({
  mission: false,
  vision: false,
  values: false
})
const featuresInView = ref(false)
const guideInView = ref(false)
const faqInView = ref(false)
const contactInView = ref(false)

// 数据
const features = [
  {
    icon: '📱',
    title: '智能活动管理',
    description: '便捷的活动创建、发布和管理功能',
    gradient: 'from-teal-100 to-teal-200'
  },
  {
    icon: '👥',
    title: '志愿者管理',
    description: '完善的志愿者信息管理和服务记录',
    gradient: 'from-orange-100 to-orange-200'
  },
  {
    icon: '📊',
    title: '数据分析',
    description: '多维度数据统计和可视化分析',
    gradient: 'from-red-100 to-red-200'
  },
  {
    icon: '🏆',
    title: '成就系统',
    description: '激励机制和荣誉徽章奖励体系',
    gradient: 'from-blue-100 to-blue-200'
  },
  {
    icon: '🔔',
    title: '智能通知',
    description: '个性化消息推送和提醒服务',
    gradient: 'from-purple-100 to-purple-200'
  },
  {
    icon: '🛡️',
    title: '安全保障',
    description: '数据加密和隐私保护机制',
    gradient: 'from-green-100 to-green-200'
  }
]

const volunteerSteps = [
  '注册账号并完善个人信息',
  '浏览热门活动并报名参与',
  '参加活动并获取服务时长',
  '查看个人成就和统计数据'
]

const organizationSteps = [
  '注册组织账号并提交认证',
  '创建和发布环保活动',
  '管理活动报名和志愿者',
  '查看组织数据统计报告'
]

const faqs = [
  {
    question: 'Q: 如何注册成为志愿者？',
    answer: 'A: 点击首页的注册按钮，填写基本信息并验证邮箱即可完成注册。'
  },
  {
    question: 'Q: 如何发布活动？',
    answer: 'A: 需要先注册组织账号并通过认证，然后在组织管理中心创建活动。'
  },
  {
    question: 'Q: 如何获取服务时长证明？',
    answer: 'A: 活动结束后，组织方会为参与者确认服务时长，系统自动记录并生成证明。'
  }
]

// 滚动观察器实例
let observer: IntersectionObserver | null = null

onMounted(() => {
  // 初始化所有动画为可见状态
  titleInView.value = true

  // 创建Intersection Observer实例
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const targetId = (entry.target as HTMLElement).id
      const isInView = entry.isIntersecting || entry.intersectionRatio > 0

      if (targetId === 'mission-card') inViewCards.mission = isInView
      else if (targetId === 'vision-card') inViewCards.vision = isInView
      else if (targetId === 'values-card') inViewCards.values = isInView
      else if (targetId === 'features-section') featuresInView.value = isInView
      else if (targetId === 'guide-section') guideInView.value = isInView
      else if (targetId === 'faq-section') faqInView.value = isInView
      else if (targetId === 'contact-section') contactInView.value = isInView
    })
  }, {
    threshold: 0.1,
    rootMargin: '-50px 0px'
  })

  // 为元素设置ID并开始观察
  if (missionCard.value) {
    missionCard.value.id = 'mission-card'
    observer.observe(missionCard.value)
  }
  if (visionCard.value) {
    visionCard.value.id = 'vision-card'
    observer.observe(visionCard.value)
  }
  if (valuesCard.value) {
    valuesCard.value.id = 'values-card'
    observer.observe(valuesCard.value)
  }
  if (featuresSection.value) {
    featuresSection.value.id = 'features-section'
    observer.observe(featuresSection.value)
  }
  if (guideSection.value) {
    guideSection.value.id = 'guide-section'
    observer.observe(guideSection.value)
  }
  if (faqSection.value) {
    faqSection.value.id = 'faq-section'
    observer.observe(faqSection.value)
  }
  if (contactSection.value) {
    contactSection.value.id = 'contact-section'
    observer.observe(contactSection.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* 动画入场状态 */
.animate-in {
  opacity: 1 !important;
  transform: none !important;
  animation: none;
}

/* 延迟类 */
.delay-100 {
  animation-delay: 0.1s !important;
}
.delay-200 {
  animation-delay: 0.2s !important;
}
.delay-300 {
  animation-delay: 0.3s !important;
}
.delay-400 {
  animation-delay: 0.4s !important;
}
.delay-500 {
  animation-delay: 0.5s !important;
}
.delay-600 {
  animation-delay: 0.6s !important;
}

/* 动态设置图标容器的渐变颜色 */
.w-12.h-12.bg-gradient-to-br {
  @apply from-teal-100 to-teal-200;
}

/* 使用Vue的v-for循环，需要通过父级选择器来设置 */
.grid.md\:grid-cols-2.lg\:grid-cols-3.gap-6 > div:nth-child(1) .w-12.h-12.bg-gradient-to-br {
  @apply from-teal-100 to-teal-200;
}

.grid.md\:grid-cols-2.lg\:grid-cols-3.gap-6 > div:nth-child(2) .w-12.h-12.bg-gradient-to-br {
  @apply from-orange-100 to-orange-200;
}

.grid.md\:grid-cols-2.lg\:grid-cols-3.gap-6 > div:nth-child(3) .w-12.h-12.bg-gradient-to-br {
  @apply from-red-100 to-red-200;
}

.grid.md\:grid-cols-2.lg\:grid-cols-3.gap-6 > div:nth-child(4) .w-12.h-12.bg-gradient-to-br {
  @apply from-blue-100 to-blue-200;
}

.grid.md\:grid-cols-2.lg\:grid-cols-3.gap-6 > div:nth-child(5) .w-12.h-12.bg-gradient-to-br {
  @apply from-purple-100 to-purple-200;
}

.grid.md\:grid-cols-2.lg\:grid-cols-3.gap-6 > div:nth-child(6) .w-12.h-12.bg-gradient-to-br {
  @apply from-green-100 to-green-200;
}

/* 响应式动画支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-up,
  .animate-fade-in,
  .animate-scale-in,
  .animate-slide-in-left,
  .animate-slide-in-right {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>