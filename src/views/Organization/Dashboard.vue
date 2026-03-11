<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Management Cockpit"
      title="System Overview"
      description="Good morning. Track organization momentum, critical approvals, and high-performing projects from one place."
      :meta-items="headerMeta"
    >
      <template #actions>
        <label class="hidden items-center gap-2 rounded-full border border-[#ffd9c4] bg-white px-4 py-2 text-sm text-slate-500 xl:flex">
          <SearchIcon class="h-4 w-4 text-slate-400" />
          <input
            v-model.trim="searchKeyword"
            type="text"
            class="w-56 border-none bg-transparent p-0 text-sm text-slate-700 outline-none"
            placeholder="Search project, volunteer..."
          >
        </label>

        <button
          class="org-toolbar-button disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isExporting"
          @click="handleExport"
        >
          <DownloadIcon class="h-4 w-4" />
          {{ isExporting ? 'Exporting...' : 'Export' }}
        </button>

        <RouterLink
          to="/organization/activities/create"
          class="org-toolbar-button org-toolbar-button--soft"
        >
          <PlusIcon class="h-4 w-4" />
          New Project
        </RouterLink>
      </template>
    </OrganizationPageHeader>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <OrganizationMetricCard
        v-for="metric in organizationKpiMetrics"
        :key="metric.key"
        :label="metric.label"
        :value="metric.value"
        :detail="metric.detail"
        :tone="metric.tone"
      >
        <template #icon>
          <component
            :is="metricIconMap[metric.key] || BarChart3Icon"
            class="h-6 w-6"
          />
        </template>

        <div
          class="mt-4 flex items-center text-xs font-semibold"
          :class="metricTrendClass(metric.trend)"
        >
          <TrendingUpIcon
            v-if="metric.trend.startsWith('+')"
            class="mr-1 h-3.5 w-3.5"
          />
          <MinusIcon
            v-else
            class="mr-1 h-3.5 w-3.5"
          />
          {{ metric.trend }} vs last period
        </div>
      </OrganizationMetricCard>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
      <OrganizationSectionCard
        class="organization-impact-trend"
        title="Environmental Impact Trends"
        description="Measured across all active projects"
      >
        <template #header>
          <label class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <span class="h-2 w-2 rounded-full bg-[#ec5b13]" />
            <select
              v-model="selectedTrendRange"
              class="border-none bg-transparent p-0 pr-5 text-xs font-semibold text-slate-600 focus:ring-0"
            >
              <option value="12m">
                Last 12 months
              </option>
              <option value="qtr">
                Last Quarter
              </option>
              <option value="ytd">
                Year to Date
              </option>
            </select>
          </label>
        </template>

        <div class="flex min-h-[280px] items-end gap-3 border-b border-slate-100 pb-5">
          <div
            v-for="row in trendRowsForView"
            :key="`${selectedTrendRange}-${row.month}`"
            class="group flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <div
              class="w-full rounded-t-xl transition-all duration-200"
              :class="row.highlight ? 'bg-[#ec5b13] shadow-[0_18px_36px_-30px_rgba(236,91,19,0.85)]' : 'bg-[#ffd7c1] group-hover:bg-[#f8b28a]'"
              :style="{ height: `${Math.max(row.value, 18)}%` }"
            />
            <span
              class="text-[10px] font-bold"
              :class="row.highlight ? 'text-[#ec5b13]' : 'text-slate-400'"
            >
              {{ row.month }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
          <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-[#ec5b13]" /> Current Period
          </div>
          <div class="flex items-center gap-2">
            <span class="h-3 w-3 rounded-full bg-slate-300" /> Last Period
          </div>
        </div>
      </OrganizationSectionCard>

      <OrganizationSectionCard
        class="organization-critical-tasks"
        title="Critical Tasks"
        description="Prioritize approvals and execution blockers"
        tone="soft"
      >
        <template #header>
          <RouterLink
            to="/organization/activities/review"
            class="text-xs font-bold text-[#ec5b13] hover:underline"
          >
            View all
          </RouterLink>
        </template>

        <transition-group
          name="organization-list-rise"
          tag="div"
          class="space-y-5"
        >
          <div
            v-for="task in filteredCriticalTaskRows"
            :key="task.key"
            class="rounded-2xl border border-white/70 bg-white/90 p-4"
          >
            <div class="mb-2 flex items-center justify-between gap-3">
              <p class="text-sm font-bold text-slate-800">
                {{ task.title }}
              </p>
              <span
                class="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                :class="taskStatusClass(task.tone)"
              >
                {{ task.status }}
              </span>
            </div>

            <div class="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                class="h-full rounded-full"
                :class="taskProgressClass(task.tone)"
                :style="{ width: `${task.progress}%` }"
              />
            </div>

            <p class="mt-2 text-xs text-slate-500">
              {{ task.detail }}
            </p>
          </div>
        </transition-group>
        <p
          v-if="!filteredCriticalTaskRows.length"
          class="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-500"
        >
          No critical tasks matched your search.
        </p>

        <RouterLink
          to="/organization/activities"
          class="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#ffd2ba] hover:text-[#ec5b13]"
        >
          Manage all tasks
          <ArrowRightIcon class="h-4 w-4" />
        </RouterLink>
      </OrganizationSectionCard>
    </div>

    <OrganizationSectionCard
      class="organization-top-projects"
      title="Top Performing Projects"
      description="Highlights from ongoing programs with the strongest execution rhythm"
    >
      <transition-group
        name="organization-list-rise"
        tag="div"
        class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="project in filteredTopProjectRows"
          :key="project.key"
          class="organization-surface-lift overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white"
        >
          <div
            class="relative h-36 bg-gradient-to-br"
            :class="project.imageClass"
          >
            <div class="absolute right-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-slate-700">
              ★ {{ project.rating.toFixed(1) }}
            </div>
            <div class="absolute left-3 top-3 rounded-full bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              {{ project.category }}
            </div>
          </div>

          <div class="space-y-4 p-5">
            <div>
              <h3 class="text-lg font-bold text-slate-900">
                {{ project.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                {{ project.summary }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Volunteers
                </p>
                <p class="font-bold text-slate-800">
                  {{ project.volunteers.toLocaleString('en-US') }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Completion
                </p>
                <p class="font-bold text-slate-800">
                  {{ project.completion }}%
                </p>
              </div>
            </div>

            <RouterLink
              to="/organization/activities"
              class="inline-flex items-center gap-1 text-sm font-bold text-[#ec5b13] hover:underline"
            >
              Details
              <ArrowRightIcon class="h-4 w-4" />
            </RouterLink>
          </div>
        </article>
      </transition-group>
      <p
        v-if="!filteredTopProjectRows.length"
        class="rounded-2xl border border-dashed border-slate-200 bg-white/75 px-4 py-7 text-center text-sm text-slate-500"
      >
        No top project matched your current search.
      </p>
    </OrganizationSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRightIcon,
  BarChart3Icon,
  CircleDollarSignIcon,
  DownloadIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  RocketIcon,
  SearchIcon,
  TrendingUpIcon,
  UsersIcon
} from 'lucide-vue-next'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import OrganizationMetricCard from '@/components/organization/OrganizationMetricCard.vue'
import { useOrganizationDashboardMetrics } from '@/composables/useOrganizationDashboardMetrics'

const {
  user,
  organizationKpiMetrics,
  organizationImpactTrendRows,
  criticalTaskRows,
  topProjectRows,
  currentDateLabel
} = useOrganizationDashboardMetrics()

const searchKeyword = ref('')
const selectedTrendRange = ref<'12m' | 'qtr' | 'ytd'>('12m')
const isExporting = ref(false)

const normalizeKeyword = (value: string) => value.trim().toLowerCase()

const trendRowsForView = computed(() => {
  if (selectedTrendRange.value === 'qtr') {
    return organizationImpactTrendRows.value.slice(-4)
  }
  if (selectedTrendRange.value === 'ytd') {
    return organizationImpactTrendRows.value.slice(0, 6)
  }
  return organizationImpactTrendRows.value
})

const filteredCriticalTaskRows = computed(() => {
  const keyword = normalizeKeyword(searchKeyword.value)
  if (!keyword) return criticalTaskRows.value

  return criticalTaskRows.value.filter(task => {
    return normalizeKeyword(`${task.title} ${task.detail} ${task.status}`).includes(keyword)
  })
})

const filteredTopProjectRows = computed(() => {
  const keyword = normalizeKeyword(searchKeyword.value)
  if (!keyword) return topProjectRows.value

  return topProjectRows.value.filter(project => {
    return normalizeKeyword(`${project.title} ${project.summary} ${project.category}`).includes(keyword)
  })
})

const headerMeta = computed(() => [
  { label: 'Admin', value: user.value?.realName || 'Organization Admin', detail: 'Online' },
  { label: 'Date', value: currentDateLabel.value, detail: 'Local workspace time' }
])

const metricIconMap: Record<string, any> = {
  'active-projects': RocketIcon,
  volunteers: UsersIcon,
  'co2-offset': LeafIcon,
  'funds-raised': CircleDollarSignIcon
}

const metricTrendClass = (trend: string) => {
  return trend.startsWith('+')
    ? 'text-emerald-600'
    : 'text-slate-500'
}

const taskStatusClass = (tone: 'green' | 'amber' | 'orange') => {
  if (tone === 'green') return 'bg-emerald-100 text-emerald-700'
  if (tone === 'amber') return 'bg-amber-100 text-amber-700'
  return 'bg-[#ffe6d7] text-[#c94f14]'
}

const taskProgressClass = (tone: 'green' | 'amber' | 'orange') => {
  if (tone === 'green') return 'bg-emerald-500'
  if (tone === 'amber') return 'bg-amber-500'
  return 'bg-[#ec5b13]'
}

const handleExport = async () => {
  if (isExporting.value) return
  isExporting.value = true
  await new Promise(resolve => setTimeout(resolve, 520))
  isExporting.value = false
}
</script>
