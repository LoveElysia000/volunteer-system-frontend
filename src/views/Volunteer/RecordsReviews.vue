<template>
  <DataListPage>
    <template #header>
      <VolunteerPageHeader
        eyebrow="评价记录"
        title="组织反馈与协作评价"
        description="正向反馈能帮助你理解自己的优势，也能为后续报名提供参考。"
        :meta-items="reviewSummaryMeta"
      />
    </template>

    <template #toolbar>
      <VolunteerSectionCard
        class="volunteer-review-radar"
        title="反馈列表"
        description="按标签和关键词浏览近期评价，点击一条从右侧查看完整反馈内容。"
      >
        <div class="space-y-5">
          <div class="grid gap-4 md:grid-cols-3">
            <VolunteerSummaryCard
              label="平均评分"
              :value="`${averageRating} / 5`"
              detail="近两次评价稳定"
              tone="amber"
              class="volunteer-surface-lift"
            />
            <VolunteerSummaryCard
              label="累计反馈"
              :value="`${volunteerReviews.length} 条`"
              detail="可复盘协作表现"
              tone="green"
              class="volunteer-surface-lift"
            />
            <VolunteerSummaryCard
              label="高频标签"
              :value="topTag"
              detail="便于定位稳定优势"
              tone="blue"
              class="volunteer-surface-lift"
            />
          </div>

          <DataToolbar>
            <template #filters>
              <div class="data-list-filter-stack">
                <button
                  v-for="tab in reviewFilters"
                  :key="tab"
                  class="data-list-chip"
                  :class="tab === activeTag ? 'data-list-chip-active-green' : 'data-list-chip-neutral'"
                  @click="activeTag = tab"
                >
                  {{ tab === 'all' ? '全部反馈' : tab }}
                </button>
              </div>
            </template>

            <template #actions>
              <div class="data-list-search lg:min-w-[280px]">
                <SearchIcon class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索活动、评价人或评论内容"
                  class="data-list-search-input"
                >
              </div>
            </template>
          </DataToolbar>
        </div>
      </VolunteerSectionCard>
    </template>

    <template #body>
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
        <VolunteerSectionCard
          title="评价列表"
          description="让每一条反馈都能单独查看，便于你做阶段性复盘。"
        >
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              当前共显示
              <span class="font-semibold text-slate-800">{{ filteredReviews.length }}</span>
              条反馈
            </p>
            <p>排序逻辑：最近评价优先</p>
          </div>

          <DataList
            :items="filteredReviews"
            row-key="id"
            :selected-key="selectedReviewId"
            interactive
            open-text="查看详情"
            open-style="text"
            empty-title="当前没有匹配反馈"
            empty-description="可以切换标签，或清空搜索关键词重新查看。"
            @row-click="openReviewDrawer"
          >
            <template #default="{ item }">
              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="text-lg font-bold tracking-tight text-slate-900">
                    {{ item.activityName }}
                  </h3>
                  <VolunteerStatusBadge
                    :label="item.tag"
                    tone="green"
                  />
                </div>

                <div class="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>{{ item.reviewer }}</span>
                  <span>{{ item.date }}</span>
                  <span class="font-semibold text-amber-600">{{ item.rating }} 星</span>
                </div>

                <p class="text-sm leading-6 text-slate-600">
                  {{ item.comment }}
                </p>
              </div>
            </template>
          </DataList>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="评价雷达"
          description="按反馈重点拆解你当前最稳定的协作优势。"
          tone="soft"
        >
          <div class="space-y-3">
            <article
              v-for="item in reviewRadar"
              :key="item.label"
              class="volunteer-surface-lift rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-slate-600">
                  {{ item.label }}
                </p>
                <p class="text-sm font-bold text-slate-900">
                  {{ item.score }}
                </p>
              </div>
              <div class="mt-3 h-2 rounded-full bg-slate-200">
                <div
                  class="h-full rounded-full bg-emerald-500"
                  :style="{ width: item.score }"
                />
              </div>
            </article>
          </div>
        </VolunteerSectionCard>
      </div>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="560px"
        :aria-label="selectedReview ? `${selectedReview.activityName} 的评价详情` : '评价详情'"
        @close="closeReviewDrawer"
      >
        <template #header>
          <div
            v-if="selectedReview"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                评价详情
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                {{ selectedReview.activityName }}
              </h2>
              <p class="text-sm text-slate-500">
                {{ selectedReview.reviewer }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <VolunteerStatusBadge
                :label="selectedReview.tag"
                tone="green"
              />
              <span class="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                {{ selectedReview.rating }} 星评价
              </span>
            </div>
          </div>
        </template>

        <div
          v-if="selectedReview"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  评价日期
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedReview.date }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  评分
                </p>
                <p class="mt-1 text-sm font-semibold text-amber-700">
                  {{ selectedReview.rating }} / 5
                </p>
              </div>
            </div>
          </section>

          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              组织反馈
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ selectedReview.comment }}
            </p>
          </section>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击评价记录查看完整反馈和评分详情。
        </div>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SearchIcon } from 'lucide-vue-next'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataList from '@/components/data-list/DataList.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import { volunteerReviews } from '@/data/volunteerCenter'

const searchQuery = ref('')
const activeTag = ref('all')
const selectedReviewId = ref<number | null>(null)
const drawerOpen = ref(false)

const averageRating = computed(() => {
  if (!volunteerReviews.length) return 0
  const total = volunteerReviews.reduce((sum, item) => sum + item.rating, 0)
  return Number((total / volunteerReviews.length).toFixed(1))
})

const reviewSummaryMeta = computed(() => [
  { label: '平均评分', value: `${averageRating.value} / 5`, detail: '近两次评价稳定' },
  { label: '累计反馈', value: `${volunteerReviews.length} 条`, detail: '可复盘协作表现' }
])

const reviewFilters = computed(() => ['all', ...new Set(volunteerReviews.map((item) => item.tag))])

const filteredReviews = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  return [...volunteerReviews]
    .filter((item) => activeTag.value === 'all' || item.tag === activeTag.value)
    .filter((item) => {
      if (!keyword) return true
      return [item.activityName, item.reviewer, item.comment, item.tag]
        .some((field) => field.toLowerCase().includes(keyword))
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
})

const selectedReview = computed(() => {
  return filteredReviews.value.find((item) => item.id === selectedReviewId.value)
    || volunteerReviews.find((item) => item.id === selectedReviewId.value)
    || null
})

const topTag = computed(() => {
  const [first] = reviewFilters.value.filter((item) => item !== 'all')
  return first || '暂无'
})

const reviewRadar = [
  { label: '沟通协作', score: '92%' },
  { label: '执行稳定性', score: '88%' },
  { label: '现场响应', score: '85%' }
]

const openReviewDrawer = (review: Record<string, any>) => {
  selectedReviewId.value = review.id
  drawerOpen.value = true
}

const closeReviewDrawer = () => {
  drawerOpen.value = false
}
</script>
