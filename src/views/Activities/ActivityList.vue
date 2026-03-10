<template>
  <div class="space-y-10">
    <section class="hero-reveal relative overflow-hidden rounded-3xl">
      <div
        class="h-[420px] w-full bg-cover bg-center md:h-[460px]"
        style="background-image: linear-gradient(to right, rgba(16, 34, 22, 0.9), rgba(16, 34, 22, 0.25)), url('https://images.unsplash.com/photo-1618477462146-050d2767eac4?q=80&w=1800&auto=format&fit=crop');"
      >
        <div class="flex h-full max-w-3xl flex-col justify-center gap-6 px-6 md:px-12">
          <span class="inline-flex w-fit items-center rounded-full bg-primary-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            {{ t('activities.hero.badge') }}
          </span>
          <h1 class="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            {{ t('activities.hero.title') }}
          </h1>
          <p class="text-base leading-relaxed text-slate-200 md:text-xl">
            {{ t('activities.hero.description') }}
          </p>
          <div class="flex flex-wrap gap-3">
            <button
              class="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-600"
              @click="scrollToFilters"
            >
              {{ t('activities.hero.browse') }}
              <ArrowRightIcon class="h-4 w-4" />
            </button>
            <router-link
              to="/about"
              class="inline-flex items-center rounded-xl border border-white/35 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              {{ t('activities.hero.learnPlatform') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section
      id="activity-filters"
      class="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm scroll-mt-24 md:p-8"
    >
      <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900">
            {{ t('activities.filters.title') }}
          </h2>
          <span class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            {{ t('activities.filters.resultSummary', { matched: filteredActivities.length, displayed: visibleActivities.length }) }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.value"
            class="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
            :class="activeCategory === category.value
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-primary-200 bg-primary-50 text-primary-800 hover:border-primary-300 hover:bg-primary-100'"
            @click="activeCategory = category.value"
          >
            {{ category.label }}
          </button>
        </div>

        <div class="relative max-w-md">
          <SearchIcon class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            v-model.trim="searchQuery"
            type="text"
            :placeholder="t('activities.filters.searchPlaceholder')"
            :aria-label="t('activities.filters.searchAria')"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
          >
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-gray-900">
            {{ t('activities.section.title') }}
          </h2>
          <p class="mt-1 text-sm text-gray-600">
            {{ t('activities.section.subtitle') }}
          </p>
        </div>
      </div>

      <div
        v-if="visibleActivities.length"
        class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="activity in visibleActivities"
          :key="activity.id"
          class="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="relative h-52 overflow-hidden">
            <div
              class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              :style="{ backgroundImage: `url('${activity.image}')` }"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" />
            <span class="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-primary-700 backdrop-blur-sm">
              {{ activity.categoryLabel }}
            </span>
            <button
              class="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-gray-500 backdrop-blur-sm transition-colors hover:text-rose-500"
              :aria-label="isFavorite(activity.id) ? t('activities.card.favoriteRemove') : t('activities.card.favoriteAdd')"
              @click.prevent="toggleFavorite(activity.id)"
            >
              <HeartIcon
                class="h-4 w-4"
                :class="isFavorite(activity.id) ? 'fill-current text-rose-500' : ''"
              />
            </button>
            <span class="absolute bottom-4 left-4 rounded-lg bg-slate-900/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {{ activity.location }}
            </span>
          </div>

          <div class="flex flex-1 flex-col gap-4 p-5">
            <div class="space-y-2">
              <h3 class="line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-700">
                {{ activity.title }}
              </h3>
              <p class="line-clamp-2 text-sm leading-relaxed text-gray-600">
                {{ activity.description }}
              </p>
            </div>

            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <CalendarIcon class="h-4 w-4 text-primary-600" />
                <span>{{ activity.dateLabel }}</span>
              </div>
              <div class="flex items-center gap-2">
                <ClockIcon class="h-4 w-4 text-primary-600" />
                <span>{{ activity.time }} · {{ activity.durationLabel }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UsersIcon class="h-4 w-4 text-primary-600" />
                <span>{{ t('activities.card.enrolled', { current: activity.currentParticipants, max: activity.maxParticipants }) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <MapPinIcon class="h-4 w-4 text-primary-600" />
                <span>{{ activity.location }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
                <span>{{ t('activities.card.progress', { percent: getProgressPercent(activity) }) }}</span>
                <span>{{ activity.currentParticipants }}/{{ activity.maxParticipants }}</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getProgressPercent(activity) >= 90 ? 'bg-orange-500' : 'bg-primary-500'"
                  :style="{ width: `${getProgressPercent(activity)}%` }"
                />
              </div>
            </div>

            <div class="mt-auto grid grid-cols-2 gap-2">
              <router-link
                to="/login"
                class="rounded-xl bg-primary-500 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                {{ t('activities.card.joinNow') }}
              </router-link>
              <router-link
                :to="`/activities/${activity.id}`"
                class="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-center text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
              >
                {{ t('activities.card.viewDetail') }}
              </router-link>
            </div>
          </div>
        </article>
      </div>

      <div
        v-else
        class="rounded-3xl border border-dashed border-primary-200 bg-primary-50/50 p-10 text-center"
      >
        <h3 class="text-lg font-semibold text-gray-900">
          {{ t('activities.empty.title') }}
        </h3>
        <p class="mt-2 text-sm text-gray-600">
          {{ t('activities.empty.description') }}
        </p>
      </div>
    </section>

    <section class="rounded-[2rem] border border-primary-100 bg-primary-50/60 p-8 md:p-12">
      <div class="mx-auto mb-10 max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900">
          {{ t('activities.impact.title') }}
        </h2>
        <p class="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
          {{ t('activities.impact.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <article
          v-for="item in impactStats"
          :key="item.key"
          class="rounded-2xl border border-primary-200 bg-white p-6 text-center shadow-sm"
        >
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100">
            <LeafIcon class="h-7 w-7 text-primary-700" />
          </div>
          <p class="text-3xl font-black text-gray-900">
            {{ item.value }}
          </p>
          <p class="mt-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            {{ item.label }}
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  LeafIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon
} from 'lucide-vue-next'
import { useLocaleStore } from '@/store/modules/locale'
import type { SupportedLocale } from '@/i18n'

type ActivityCategory = 'water' | 'waste' | 'wildlife' | 'forest'

type LocalizedText = Record<SupportedLocale, string>

interface ActivityCard {
  id: number
  title: LocalizedText
  description: LocalizedText
  category: ActivityCategory
  location: LocalizedText
  date: string
  time: string
  durationHours: number
  currentParticipants: number
  maxParticipants: number
  image: string
}

const { t } = useI18n()
const localeStore = useLocaleStore()
const activeCategory = ref<'all' | ActivityCategory>('all')
const searchQuery = ref('')
const favoriteIds = ref<number[]>([])

const currentLocale = computed(() => localeStore.locale)

const resolveLocalizedText = (value: LocalizedText) => value[currentLocale.value]

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split('-').map((item) => Number(item))
  if (!year || !month || !day) {
    return new Date(value)
  }

  // Avoid UTC parsing for YYYY-MM-DD so display does not shift across timezones.
  return new Date(year, month - 1, day)
}

const formatDate = (value: string) => {
  const localeName = currentLocale.value === 'zh-CN' ? 'zh-CN' : 'en-US'
  return new Intl.DateTimeFormat(localeName, {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  }).format(parseLocalDate(value))
}

const formatDuration = (hours: number) => {
  return currentLocale.value === 'zh-CN' ? `${hours}小时` : `${hours}h`
}

const categories = computed<Array<{ value: 'all' | ActivityCategory, label: string }>>(() => [
  { value: 'all', label: t('activities.categories.all') },
  { value: 'water', label: t('activities.categories.water') },
  { value: 'waste', label: t('activities.categories.waste') },
  { value: 'wildlife', label: t('activities.categories.wildlife') },
  { value: 'forest', label: t('activities.categories.forest') }
])

const activities = ref<ActivityCard[]>([
  {
    id: 1,
    title: {
      'zh-CN': '海岸净滩行动',
      'en-US': 'Coastal Cleanup Action'
    },
    description: {
      'zh-CN': '组织志愿者清理沿岸塑料垃圾，减少海洋生物误食风险并开展公众科普。',
      'en-US': 'Volunteers clean coastal plastic waste to reduce marine ingestion risks while supporting public education.'
    },
    category: 'waste',
    location: {
      'zh-CN': '青岛金沙滩',
      'en-US': 'Golden Beach, Qingdao'
    },
    date: '2026-03-16',
    time: '09:00',
    durationHours: 3,
    currentParticipants: 42,
    maxParticipants: 50,
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 2,
    title: {
      'zh-CN': '城市节水推广日',
      'en-US': 'Urban Water-Saving Campaign'
    },
    description: {
      'zh-CN': '在社区开展节水设施演示与家庭节水宣讲，推动居民形成可持续用水习惯。',
      'en-US': 'Community demos and household workshops that help residents build sustainable water-use habits.'
    },
    category: 'water',
    location: {
      'zh-CN': '杭州滨江社区',
      'en-US': 'Binjiang Community, Hangzhou'
    },
    date: '2026-03-18',
    time: '14:00',
    durationHours: 2,
    currentParticipants: 28,
    maxParticipants: 40,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 3,
    title: {
      'zh-CN': '湿地鸟类栖息地巡护',
      'en-US': 'Wetland Bird Habitat Patrol'
    },
    description: {
      'zh-CN': '协助巡护湿地环境，记录候鸟活动，配合专业团队进行基础生态数据采样。',
      'en-US': 'Assist wetland patrols, record migratory bird activity, and support baseline ecological sampling.'
    },
    category: 'wildlife',
    location: {
      'zh-CN': '崇明东滩湿地',
      'en-US': 'Dongtan Wetland, Chongming'
    },
    date: '2026-03-20',
    time: '07:30',
    durationHours: 4,
    currentParticipants: 17,
    maxParticipants: 20,
    image: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 4,
    title: {
      'zh-CN': '社区微森林共建',
      'en-US': 'Community Micro-Forest Build'
    },
    description: {
      'zh-CN': '在社区闲置地块进行本土树种种植，提升街区降温与雨水调蓄能力。',
      'en-US': 'Plant native trees on idle community plots to improve cooling and rainwater retention capacity.'
    },
    category: 'forest',
    location: {
      'zh-CN': '深圳南山街道',
      'en-US': 'Nanshan District, Shenzhen'
    },
    date: '2026-03-22',
    time: '10:00',
    durationHours: 3,
    currentParticipants: 35,
    maxParticipants: 60,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 5,
    title: {
      'zh-CN': '河道漂浮物拦截清理',
      'en-US': 'River Debris Interception'
    },
    description: {
      'zh-CN': '对重点河段进行漂浮垃圾打捞与分类，减少入海垃圾并提升河道景观质量。',
      'en-US': 'Intercept and sort floating waste in key river sections to reduce ocean-bound litter and improve river scenery.'
    },
    category: 'water',
    location: {
      'zh-CN': '苏州古运河',
      'en-US': 'Ancient Canal, Suzhou'
    },
    date: '2026-03-24',
    time: '08:30',
    durationHours: 3,
    currentParticipants: 31,
    maxParticipants: 45,
    image: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 6,
    title: {
      'zh-CN': '校园垃圾减量工作坊',
      'en-US': 'Campus Waste Reduction Workshop'
    },
    description: {
      'zh-CN': '面向高校社团开展垃圾减量实操课程，输出可复用的校园环保行动方案。',
      'en-US': 'Hands-on waste reduction training for university clubs with reusable action playbooks.'
    },
    category: 'waste',
    location: {
      'zh-CN': '武汉大学城',
      'en-US': 'University Town, Wuhan'
    },
    date: '2026-03-26',
    time: '15:00',
    durationHours: 2,
    currentParticipants: 19,
    maxParticipants: 35,
    image: 'https://images.unsplash.com/photo-1527847263472-aa5338d178b8?q=80&w=1200&auto=format&fit=crop'
  }
])

const localizedActivities = computed(() => {
  return activities.value.map((activity) => ({
    ...activity,
    title: resolveLocalizedText(activity.title),
    description: resolveLocalizedText(activity.description),
    location: resolveLocalizedText(activity.location),
    categoryLabel: t(`activities.categories.${activity.category}`),
    dateLabel: formatDate(activity.date),
    durationLabel: formatDuration(activity.durationHours)
  }))
})

const impactStats = computed(() => [
  { key: 'trees', value: '12,450+', label: t('activities.impact.trees') },
  { key: 'waste', value: currentLocale.value === 'zh-CN' ? '8.2 吨' : '8.2 Tons', label: t('activities.impact.waste') },
  { key: 'hours', value: '45,000+', label: t('activities.impact.hours') }
])

const filteredActivities = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return localizedActivities.value.filter((activity) => {
    const matchCategory = activeCategory.value === 'all' || activity.category === activeCategory.value
    const matchKeyword = !keyword || [activity.title, activity.location, activity.description, activity.categoryLabel]
      .some((value) => value.toLowerCase().includes(keyword))

    return matchCategory && matchKeyword
  })
})

const visibleActivities = computed(() => filteredActivities.value.slice(0, 6))

const getProgressPercent = (activity: { currentParticipants: number, maxParticipants: number }) => {
  if (activity.maxParticipants <= 0) return 0
  return Math.min(100, Math.round((activity.currentParticipants / activity.maxParticipants) * 100))
}

const isFavorite = (activityId: number) => favoriteIds.value.includes(activityId)

const toggleFavorite = (activityId: number) => {
  if (isFavorite(activityId)) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== activityId)
    return
  }

  favoriteIds.value = [...favoriteIds.value, activityId]
}

const scrollToFilters = () => {
  const target = document.getElementById('activity-filters')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-reveal {
  animation: fadeInUp 0.7s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .hero-reveal {
    animation: none;
  }
}
</style>
