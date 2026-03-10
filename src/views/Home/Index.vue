<template>
  <div class="relative">
    <!-- Hero 区域 -->
    <section class="min-h-screen flex items-center relative">
      <!-- 动态背景粒子 -->
      <EcoParticles
        intensity="medium"
        :enable-mouse-follow="true"
        :enable-click-ripple="true"
        :leaf-count="20"
      />

      <!-- 英雄区域 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-16">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- 左侧内容 -->
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight hero-fade-up">
                {{ homeText.hero.titlePrefix }}
                <span class="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  {{ homeText.hero.titleHighlight }}
                </span>
              </h1>
              <p class="text-xl text-gray-600 leading-relaxed hero-fade-up delay-100">
                {{ homeText.hero.description }}
              </p>
            </div>

            <!-- 统计数据 -->
            <div class="grid grid-cols-3 gap-6 py-4 hero-fade-up delay-200">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">
                  {{ volunteerCount }}+
                </div>
                <div class="text-sm text-gray-500">
                  {{ homeText.hero.volunteerLabel }}
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">
                  {{ activityCount }}+
                </div>
                <div class="text-sm text-gray-500">
                  {{ homeText.hero.activityLabel }}
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">
                  {{ orgCount }}+
                </div>
                <div class="text-sm text-gray-500">
                  {{ homeText.hero.organizationLabel }}
                </div>
              </div>
            </div>

            <!-- CTA 按钮 -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4 hero-fade-up delay-300">
              <router-link
                to="/register"
                class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {{ homeText.hero.joinNow }}
                <ArrowRightIcon class="ml-2 h-5 w-5" />
              </router-link>
              <router-link
                to="/activities"
                class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
              >
                {{ homeText.hero.browseActivities }}
              </router-link>
            </div>
          </div>

          <!-- 右侧卡片 - 有机形状简约设计 -->
          <div class="relative hero-fade-up delay-400">
            <div class="bg-sage rounded-3xl p-6 shadow-xl border border-sage-light relative">
              <!-- 主卡片 - 有机形状 -->
              <div class="organic-card-1 organic-morph aspect-[4/5] relative overflow-hidden shadow-2xl border-8 border-white animate-gentle-float group cursor-pointer">
                <!-- 背景图片 - 森林主题 -->
                <img
                  src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80"
                  :alt="homeText.hero.cardImageAlt"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  @error="$event.target.style.display='none'"
                >
                <!-- 渐变遮罩 - 从透明到深色，确保文字可读 -->
                <div class="absolute inset-0 bg-gradient-to-t from-[rgba(26,60,38,0.85)] via-[rgba(26,60,38,0.3)] to-transparent" />

                <!-- 内容 -->
                <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <!-- 主图标 -->
                  <div class="h-14 w-14 bg-accent/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-accent/50 mb-4 animate-float-slow group-hover:scale-110 transition-transform duration-500">
                    <LeafIcon
                      class="h-7 w-7 text-accent"
                      stroke-width="1.5"
                    />
                  </div>

                  <!-- 标题 -->
                  <h3 class="text-white text-xl font-bold mb-1">
                    {{ homeText.hero.cardTitle }}
                  </h3>
                  <p class="text-white/60 text-xs mb-4">
                    {{ homeText.hero.cardSubtitle }}
                  </p>

                  <!-- 简洁指示器 -->
                  <div class="flex gap-1.5">
                    <span class="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                    <span class="w-1.5 h-1.5 bg-accent/50 rounded-full" />
                    <span class="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>

              <!-- 浮动小卡片 - 放在内部右下角 -->
              <div class="absolute bottom-4 right-4 bg-white p-3 rounded-2xl shadow-lg border border-sage-light backdrop-blur-sm hover:scale-105 transition-transform">
                <div class="flex items-center gap-2">
                  <HeartIcon
                    class="h-4 w-4 text-primary"
                    stroke-width="1.5"
                  />
                  <span class="text-sm font-bold text-forest-deep">{{ volunteerCount }}+</span>
                </div>
              </div>

              <!-- Growing 标签 -->
              <div class="absolute top-2 left-2 bg-accent text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg">
                {{ homeText.hero.growingTag }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心价值 - 大数字统计卡片（参考 EcoHub 风格） -->
    <section class="px-4 sm:px-6 lg:px-8 py-16">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 统计卡片 1 -->
          <div class="bg-white p-8 lg:p-10 rounded-2xl border border-sage shadow-sm hover:shadow-md transition-shadow group">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-earth text-xs font-bold uppercase tracking-widest mb-2">
                  {{ homeText.statsCard.volunteerTitle }}
                </p>
                <h3 class="text-forest-deep text-4xl lg:text-5xl font-black">
                  {{ volunteerCount }}<span class="text-lg font-medium text-primary ml-1">+</span>
                </h3>
              </div>
              <div class="bg-sage p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <UsersIcon
                  class="w-7 h-7"
                  stroke-width="1.5"
                />
              </div>
            </div>
            <div class="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
              <span class="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <span>{{ homeText.statsCard.volunteerTrend }}</span>
            </div>
          </div>
          <!-- 统计卡片 2 -->
          <div class="bg-white p-8 lg:p-10 rounded-2xl border border-sage shadow-sm hover:shadow-md transition-shadow group">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-earth text-xs font-bold uppercase tracking-widest mb-2">
                  {{ homeText.statsCard.activityTitle }}
                </p>
                <h3 class="text-forest-deep text-4xl lg:text-5xl font-black">
                  {{ activityCount }}<span class="text-lg font-medium text-primary ml-1">+</span>
                </h3>
              </div>
              <div class="bg-sage p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <CalendarIcon
                  class="w-7 h-7"
                  stroke-width="1.5"
                />
              </div>
            </div>
            <div class="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
              <span class="material-symbols-outlined text-accent text-lg">bolt</span>
              <span>{{ homeText.statsCard.activityTrend }}</span>
            </div>
          </div>
          <!-- 统计卡片 3 -->
          <div class="bg-white p-8 lg:p-10 rounded-2xl border border-sage shadow-sm hover:shadow-md transition-shadow group">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-earth text-xs font-bold uppercase tracking-widest mb-2">
                  {{ homeText.statsCard.engagementTitle }}
                </p>
                <h3 class="text-forest-deep text-4xl lg:text-5xl font-black">
                  98<span class="text-lg font-medium text-primary ml-1">%</span>
                </h3>
              </div>
              <div class="bg-sage p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <HeartIcon
                  class="w-7 h-7"
                  stroke-width="1.5"
                />
              </div>
            </div>
            <div class="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
              <span class="w-1.5 h-1.5 bg-accent rounded-full" />
              <span>{{ homeText.statsCard.engagementTrend }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 活动预览 -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">
              {{ homeText.activityPreview.title }}
            </h2>
            <p class="mt-2 text-gray-600">
              {{ homeText.activityPreview.subtitle }}
            </p>
          </div>
          <router-link
            to="/activities"
            class="text-primary-600 font-medium hover:text-primary-700 flex items-center transition-colors"
          >
            {{ homeText.activityPreview.viewAll }}
            <ArrowRightIcon class="ml-1 h-4 w-4" />
          </router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div
            v-for="(activity, index) in featuredActivities"
            :key="activity.id"
            class="group cursor-pointer"
          >
            <div class="flex flex-col">
              <!-- 有机形状图片容器 -->
              <div
                :class="[
                  'relative overflow-hidden aspect-square bg-forest-deep border-8 border-sage-light shadow-xl hover:shadow-2xl transition-all duration-500 mb-6',
                  index % 3 === 0 ? 'organic-card-1' : index % 3 === 1 ? 'organic-card-2' : 'organic-card-3'
                ]"
              >
                <!-- 背景图片容器 -->
                <div
                  class="absolute inset-0 overflow-hidden"
                  :class="[
                    index % 3 === 0 ? 'bg-gradient-to-br from-emerald-700 via-green-800 to-teal-900' :
                    index % 3 === 1 ? 'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800' :
                    'bg-gradient-to-br from-lime-600 via-emerald-700 to-green-800'
                  ]"
                >
                  <!-- 实际图片 -->
                  <img
                    v-if="activity.image"
                    :src="activity.image"
                    :alt="activity.title"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    @error="$event.target.style.display='none'"
                  >
                  <!-- 主题图标备用 -->
                  <div
                    v-else
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <component
                      :is="index % 3 === 0 ? SproutIcon : index % 3 === 1 ? WavesIcon : RecycleIcon"
                      class="w-24 h-24 text-white/30"
                    />
                  </div>
                  <!-- 渐变遮罩 -->
                  <div class="absolute inset-0 bg-gradient-to-t from-[rgba(26,60,38,0.85)] via-[rgba(26,60,38,0.4)] to-transparent" />
                </div>
                <!-- 地理位置标签 -->
                <div class="absolute bottom-6 left-6 right-6">
                  <div class="flex items-center gap-2 text-white/90 text-sm font-bold">
                    <MapPinIcon
                      class="text-accent"
                      stroke-width="2"
                    />
                    <span>{{ activity.location }}</span>
                  </div>
                </div>
              </div>
              <!-- 内容区域 -->
              <div class="px-4">
                <h4 class="text-forest-deep text-2xl font-black mb-3 group-hover:text-primary-600 transition-colors">
                  {{ activity.title }}
                </h4>
                <p class="text-earth-light leading-relaxed mb-4 line-clamp-3">
                  {{ activity.description }}
                </p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="size-8 rounded-full bg-sage flex items-center justify-center text-primary overflow-hidden">
                      <UsersIcon class="h-4 w-4" />
                    </div>
                    <span class="text-sm font-bold text-forest-deep">{{ activity.joined }} {{ homeText.activityPreview.joinedSuffix }}</span>
                  </div>
                  <button class="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    {{ homeText.activityPreview.readMore }} <ArrowRightIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 参与流程 -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ homeText.process.title }}
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            {{ homeText.process.subtitle }}
          </p>
        </div>
        <div class="relative">
          <!-- 连接线 -->
          <div class="hidden md:block absolute top-20 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-0.5 bg-gradient-to-r from-primary-200 via-green-200 to-primary-200" />
          <div class="grid md:grid-cols-3 gap-8 relative">
            <div
              v-for="step in homeText.process.steps"
              :key="step.number"
              class="text-center"
            >
              <div
                class="inline-flex items-center justify-center w-20 h-20 rounded-full font-bold text-2xl mb-6 relative z-10"
                :class="step.badgeClass"
              >
                {{ step.number }}
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                {{ step.title }}
              </h3>
              <p class="text-gray-600">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 区域 - 参考 EcoHub 深色纹理风格 -->
    <section class="px-4 sm:px-6 lg:px-8 py-20">
      <div class="leaf-pattern bg-forest-deep rounded-3xl p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/10 shadow-2xl relative overflow-hidden">
        <!-- 背景光晕 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div class="absolute inset-0 bg-forest-deep/10" />

        <div class="text-center lg:text-left space-y-6 relative z-10 max-w-xl">
          <h2 class="text-white text-3xl lg:text-5xl font-black tracking-tight leading-tight">
            {{ homeText.bottomCta.titleLine1 }}<br class="hidden lg:block">{{ homeText.bottomCta.titleLine2 }}
          </h2>
          <p class="text-white/80 font-medium text-lg">
            {{ homeText.bottomCta.descriptionPrefix }} {{ volunteerCount }}+ {{ homeText.bottomCta.descriptionSuffix }}
          </p>
        </div>

        <router-link
          to="/register"
          class="bg-accent text-forest-deep px-10 py-5 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-3 relative z-10 group"
        >
          <span>{{ homeText.bottomCta.button }}</span>
          <ArrowRightIcon
            class="w-6 h-6 group-hover:translate-x-1 transition-transform"
            stroke-width="2"
          />
        </router-link>
      </div>
    </section>

    <!-- 返回顶部按钮 -->
    <button
      class="back-to-top"
      :class="{ visible: showBackToTop }"
      :aria-label="homeText.backToTop"
      @click="scrollToTop"
    >
      <ArrowRightIcon
        class="w-6 h-6 rotate-[-90deg]"
        stroke-width="2"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  LeafIcon,
  ArrowRightIcon,
  SproutIcon,
  UsersIcon,
  HeartIcon,
  CalendarIcon,
  MapPinIcon,
  WavesIcon,
  RecycleIcon
} from 'lucide-vue-next'
import EcoParticles from '@/components/background/EcoParticles.vue'
import { useCountUp } from '@/composables/useCountUp'

interface FeaturedActivity {
  id: number
  title: string
  type: string
  date: string
  location: string
  joined: number
  spots: number
  description: string
  image: string
}

interface HomeText {
  hero: {
    titlePrefix: string
    titleHighlight: string
    description: string
    volunteerLabel: string
    activityLabel: string
    organizationLabel: string
    joinNow: string
    browseActivities: string
    cardTitle: string
    cardSubtitle: string
    cardImageAlt: string
    growingTag: string
  }
  statsCard: {
    volunteerTitle: string
    volunteerTrend: string
    activityTitle: string
    activityTrend: string
    engagementTitle: string
    engagementTrend: string
  }
  activityPreview: {
    title: string
    subtitle: string
    viewAll: string
    joinedSuffix: string
    readMore: string
  }
  process: {
    title: string
    subtitle: string
    steps: Array<{
      number: number
      title: string
      description: string
      badgeClass: string
    }>
  }
  bottomCta: {
    titleLine1: string
    titleLine2: string
    descriptionPrefix: string
    descriptionSuffix: string
    button: string
  }
  backToTop: string
}

const { tm } = useI18n()

// 统计数据
const { current: volunteerCount } = useCountUp(500)
const { current: activityCount } = useCountUp(100)
const { current: orgCount } = useCountUp(50)

const homeText = computed(() => tm('home') as unknown as HomeText)

// 返回顶部逻辑
const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const featuredActivities = computed(() => tm('home.featuredActivities') as unknown as FeaturedActivity[])
</script>

<style scoped>
/* 组件级样式 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
