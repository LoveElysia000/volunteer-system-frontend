<template>
  <div class="w-full overflow-x-hidden">
    <main class="w-full">
      <section class="w-full bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        <div
          ref="heroSection"
          class="mx-auto max-w-6xl px-6 py-20 md:px-12 lg:px-20 lg:py-24"
          :class="{ 'animate-in': heroInView }"
        >
          <div class="max-w-3xl">
            <span class="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-200">
              {{ aboutText.heroBadge }}
            </span>
            <h1 class="mt-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              {{ aboutText.heroTitle }}
            </h1>
            <p class="mt-6 text-lg leading-relaxed text-slate-200 md:text-xl">
              {{ aboutText.heroDescription }}
            </p>
            <div class="mt-10 flex flex-wrap items-center gap-4">
              <button
                class="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-400"
                @click="scrollToSection('what-we-do')"
              >
                {{ aboutText.heroPrimaryAction }}
                <ArrowRightIcon class="h-4 w-4" />
              </button>
              <button
                class="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20"
                @click="scrollToSection('faq')"
              >
                {{ aboutText.heroSecondaryAction }}
              </button>
            </div>
          </div>

          <div
            class="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4"
            :class="{ 'animate-in': statsInView }"
          >
            <article
              v-for="(stat, index) in impactStats"
              :key="stat.label"
              class="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
              :style="{ animationDelay: statsInView ? `${index * 90}ms` : '0ms' }"
            >
              <p class="text-2xl font-bold text-white md:text-3xl">
                {{ stat.value }}
              </p>
              <p class="mt-1 text-sm text-slate-300">
                {{ stat.label }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="what-we-do"
        ref="whatWeDoSection"
        class="w-full scroll-mt-24 bg-white"
      >
        <div class="mx-auto max-w-6xl px-6 py-16 md:px-12 lg:px-20">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {{ aboutText.whatWeDoTitle }}
            </h2>
            <p class="mt-3 text-gray-600">
              {{ aboutText.whatWeDoDescription }}
            </p>
          </div>

          <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <article
              v-for="(item, index) in whatWeDoItems"
              :key="item.title"
              class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-md"
              :class="{ 'animate-in': whatWeDoInView }"
              :style="{ animationDelay: whatWeDoInView ? `${index * 100}ms` : '0ms' }"
            >
              <div class="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <component
                  :is="item.icon"
                  class="h-5 w-5"
                />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ item.title }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-600">
                {{ item.description }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="strategy"
        ref="strategySection"
        class="w-full scroll-mt-24 bg-primary-50/40"
      >
        <div class="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:px-12 lg:grid-cols-2 lg:px-20">
          <div :class="{ 'animate-in': strategyInView }">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {{ aboutText.strategyTitle }}
            </h2>
            <p class="mt-4 leading-relaxed text-gray-700">
              {{ aboutText.strategyDescription }}
            </p>

            <ul class="mt-8 space-y-4">
              <li
                v-for="point in strategyPoints"
                :key="point"
                class="flex items-start gap-3"
              >
                <span class="mt-2 h-2 w-2 rounded-full bg-primary-500" />
                <p class="text-gray-700">
                  {{ point }}
                </p>
              </li>
            </ul>
          </div>

          <article
            class="rounded-3xl border border-primary-100 bg-white p-7 shadow-sm md:p-8"
            :class="{ 'animate-in': strategyInView }"
            style="animation-delay: 120ms;"
          >
            <h3 class="text-xl font-semibold text-gray-900">
              {{ aboutText.frameworkTitle }}
            </h3>
            <div class="mt-6 space-y-5">
              <div
                v-for="pillar in trustPillars"
                :key="pillar.title"
                class="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <div
                  class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary-700"
                  :class="pillar.iconBg"
                >
                  <component
                    :is="pillar.icon"
                    class="h-5 w-5"
                  />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">
                    {{ pillar.title }}
                  </h4>
                  <p class="mt-1 text-sm text-gray-600">
                    {{ pillar.description }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section
        id="partners"
        ref="partnersSection"
        class="w-full scroll-mt-24 bg-slate-50"
      >
        <div class="mx-auto max-w-6xl px-6 py-16 md:px-12 lg:px-20">
          <div class="mx-auto max-w-3xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {{ aboutText.partnersTitle }}
            </h2>
            <p class="mt-3 text-gray-600">
              {{ aboutText.partnersDescription }}
            </p>
          </div>

          <div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <article
              v-for="(partner, index) in partners"
              :key="partner.name"
              class="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm"
              :class="{ 'animate-in': partnersInView }"
              :style="{ animationDelay: partnersInView ? `${index * 90}ms` : '0ms' }"
            >
              <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                {{ partner.short }}
              </div>
              <p class="mt-3 text-sm font-semibold text-gray-800">
                {{ partner.name }}
              </p>
            </article>
          </div>

          <div class="mt-10 flex flex-wrap justify-center gap-3">
            <span
              v-for="tag in domainTags"
              :key="tag"
              class="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm text-primary-800"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </section>

      <section
        id="faq"
        ref="faqSection"
        class="w-full scroll-mt-24 bg-white"
      >
        <div class="mx-auto max-w-4xl px-6 py-16 md:px-12 lg:px-20">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {{ aboutText.faqTitle }}
            </h2>
            <p class="mt-3 text-gray-600">
              {{ aboutText.faqDescription }}
            </p>
          </div>

          <div class="mt-10 space-y-4">
            <article
              v-for="(faq, index) in faqs"
              :key="faq.question"
              class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              :class="{ 'animate-in': faqInView }"
              :style="{ animationDelay: faqInView ? `${index * 90}ms` : '0ms' }"
            >
              <button
                class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                @click="toggleFaq(index)"
              >
                <span class="font-semibold text-gray-900">{{ faq.question }}</span>
                <span
                  class="text-xl font-medium text-primary-700 transition-transform"
                  :class="{ 'rotate-45': activeFaq === index }"
                >
                  +
                </span>
              </button>
              <div
                class="faq-answer grid transition-[grid-template-rows,opacity] duration-300"
                :class="activeFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
              >
                <p class="overflow-hidden px-6 pb-6 text-sm leading-relaxed text-gray-600">
                  {{ faq.answer }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        ref="ctaSection"
        class="w-full bg-slate-900"
      >
        <div class="mx-auto max-w-6xl px-6 py-16 md:px-12 lg:px-20">
          <div
            class="mx-auto max-w-3xl text-center"
            :class="{ 'animate-in': ctaInView }"
          >
            <h2 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {{ aboutText.ctaTitle }}
            </h2>
            <p class="mt-3 text-slate-300">
              {{ aboutText.ctaDescription }}
            </p>
          </div>

          <div class="mt-12 grid gap-6 md:grid-cols-2">
            <article
              class="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
              :class="{ 'animate-in': ctaInView }"
            >
              <div class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/20 text-primary-300">
                <LeafIcon class="h-5 w-5" />
              </div>
              <h3 class="mt-4 text-xl font-semibold text-white">
                {{ aboutText.volunteerCtaTitle }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-300">
                {{ aboutText.volunteerCtaDescription }}
              </p>
              <router-link
                to="/register"
                class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 transition-colors hover:text-primary-200"
              >
                {{ aboutText.volunteerCtaAction }}
                <ArrowRightIcon class="h-4 w-4" />
              </router-link>
            </article>

            <article
              class="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
              :class="{ 'animate-in': ctaInView }"
              style="animation-delay: 100ms;"
            >
              <div class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/20 text-primary-300">
                <UsersIcon class="h-5 w-5" />
              </div>
              <h3 class="mt-4 text-xl font-semibold text-white">
                {{ aboutText.organizationCtaTitle }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-300">
                {{ aboutText.organizationCtaDescription }}
              </p>
              <ul class="mt-5 space-y-2 text-sm text-slate-300">
                <li class="flex items-center gap-2">
                  <MailIcon class="h-4 w-4 text-primary-300" />
                  support@volunteer-platform.com
                </li>
                <li class="flex items-center gap-2">
                  <PhoneIcon class="h-4 w-4 text-primary-300" />
                  400-123-4567
                </li>
                <li class="flex items-center gap-2">
                  <ClockIcon class="h-4 w-4 text-primary-300" />
                  {{ aboutText.contactHours }}
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ActivityIcon,
  ArrowRightIcon,
  BarChartIcon,
  CalendarIcon,
  ClockIcon,
  LeafIcon,
  MailIcon,
  PhoneIcon,
  UsersIcon
} from 'lucide-vue-next'

interface AboutText {
  heroBadge: string
  heroTitle: string
  heroDescription: string
  heroPrimaryAction: string
  heroSecondaryAction: string
  whatWeDoTitle: string
  whatWeDoDescription: string
  strategyTitle: string
  strategyDescription: string
  frameworkTitle: string
  partnersTitle: string
  partnersDescription: string
  faqTitle: string
  faqDescription: string
  ctaTitle: string
  ctaDescription: string
  volunteerCtaTitle: string
  volunteerCtaDescription: string
  volunteerCtaAction: string
  organizationCtaTitle: string
  organizationCtaDescription: string
  contactHours: string
}

interface AboutStat {
  value: string
  label: string
}

interface AboutItem {
  title: string
  description: string
}

interface AboutPartner {
  short: string
  name: string
}

interface AboutFaq {
  question: string
  answer: string
}

const { tm } = useI18n()

const heroSection = ref<HTMLElement>()
const whatWeDoSection = ref<HTMLElement>()
const strategySection = ref<HTMLElement>()
const partnersSection = ref<HTMLElement>()
const faqSection = ref<HTMLElement>()
const ctaSection = ref<HTMLElement>()

const heroInView = ref(false)
const statsInView = ref(false)
const whatWeDoInView = ref(false)
const strategyInView = ref(false)
const partnersInView = ref(false)
const faqInView = ref(false)
const ctaInView = ref(false)

const activeFaq = ref<number | null>(0)

const aboutText = computed(() => tm('about') as unknown as AboutText)
const impactStats = computed(() => tm('about.impactStats') as unknown as AboutStat[])

const whatWeDoIcons = [ActivityIcon, UsersIcon, BarChartIcon, CalendarIcon]
const whatWeDoContent = computed(() => tm('about.whatWeDoItems') as unknown as AboutItem[])
const whatWeDoItems = computed(() => {
  return whatWeDoContent.value.map((item, index) => ({
    ...item,
    icon: whatWeDoIcons[index] ?? ActivityIcon
  }))
})

const strategyPoints = computed(() => tm('about.strategyPoints') as unknown as string[])

const trustPillarMeta = [
  { icon: ActivityIcon, iconBg: 'bg-primary-100' },
  { icon: BarChartIcon, iconBg: 'bg-emerald-100' },
  { icon: UsersIcon, iconBg: 'bg-sky-100' }
]
const trustPillarContent = computed(() => tm('about.trustPillars') as unknown as AboutItem[])
const trustPillars = computed(() => {
  return trustPillarContent.value.map((item, index) => ({
    ...item,
    icon: trustPillarMeta[index]?.icon ?? ActivityIcon,
    iconBg: trustPillarMeta[index]?.iconBg ?? 'bg-primary-100'
  }))
})

const partners = computed(() => tm('about.partners') as unknown as AboutPartner[])
const domainTags = computed(() => tm('about.domainTags') as unknown as string[])
const faqs = computed(() => tm('about.faqs') as unknown as AboutFaq[])

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const scrollToSection = (id: string) => {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  setTimeout(() => {
    heroInView.value = true
  }, 80)

  setTimeout(() => {
    statsInView.value = true
  }, 220)

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement
      const visible = entry.isIntersecting || entry.intersectionRatio > 0

      if (target === whatWeDoSection.value) whatWeDoInView.value = visible
      if (target === strategySection.value) strategyInView.value = visible
      if (target === partnersSection.value) partnersInView.value = visible
      if (target === faqSection.value) faqInView.value = visible
      if (target === ctaSection.value) ctaInView.value = visible
    })
  }, {
    threshold: 0.12,
    rootMargin: '-40px 0px'
  })

  const sections = [whatWeDoSection, strategySection, partnersSection, faqSection, ctaSection]
  sections.forEach((section) => {
    if (section.value && observer) observer.observe(section.value)
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeUp 0.6s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-in {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .faq-answer {
    transition: none !important;
  }
}
</style>
