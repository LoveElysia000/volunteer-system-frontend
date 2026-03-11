<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="评价记录"
      title="组织反馈与协作评价"
      description="正向反馈能帮助你理解自己的优势，也能为后续报名提供参考。"
      :meta-items="reviewSummaryMeta"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
      <VolunteerSectionCard
        class="volunteer-review-radar"
        title="反馈列表"
        description="近期评价会同步到你的志愿者档案，并影响后续推荐。"
      >
        <transition-group
          name="volunteer-list-rise"
          tag="div"
          class="space-y-4"
        >
          <article
            v-for="review in volunteerReviews"
            :key="review.id"
            class="volunteer-surface-lift rounded-[1.5rem] border border-slate-200 bg-white p-5"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="text-lg font-bold text-slate-900">
                    {{ review.activityName }}
                  </h3>
                  <VolunteerStatusBadge
                    :label="review.tag"
                    tone="green"
                  />
                </div>
                <p class="mt-2 text-sm text-slate-500">
                  {{ review.reviewer }} · {{ review.date }}
                </p>
              </div>
              <p class="text-sm font-semibold text-amber-600">
                {{ review.rating }} 星
              </p>
            </div>
            <p class="mt-4 text-sm leading-6 text-slate-600">
              {{ review.comment }}
            </p>
          </article>
        </transition-group>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import { volunteerReviews } from '@/data/volunteerCenter'

const averageRating = computed(() => {
  if (!volunteerReviews.length) return 0
  const total = volunteerReviews.reduce((sum, item) => sum + item.rating, 0)
  return Number((total / volunteerReviews.length).toFixed(1))
})

const reviewSummaryMeta = computed(() => [
  { label: '平均评分', value: `${averageRating.value} / 5`, detail: '近两次评价稳定' },
  { label: '累计反馈', value: `${volunteerReviews.length} 条`, detail: '可复盘协作表现' }
])

const reviewRadar = [
  { label: '沟通协作', score: '92%' },
  { label: '执行稳定性', score: '88%' },
  { label: '现场响应', score: '85%' }
]
</script>
