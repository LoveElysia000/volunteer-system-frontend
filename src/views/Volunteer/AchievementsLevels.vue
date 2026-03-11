<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="等级进度"
      title="规划下一阶段成长目标"
      description="等级不仅反映服务时长，也反映你是否保持持续和稳定的参与。"
      :meta-items="headerMeta"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
      <VolunteerSectionCard
        class="volunteer-level-runway"
        title="升级跑道"
        description="把当前等级、目标差距和阶段建议放在同一视图中。"
      >
        <div class="mb-5 grid gap-4 md:grid-cols-3">
          <VolunteerSummaryCard
            label="当前等级"
            :value="`Lv.${volunteerLevel}`"
            detail="环保新星阶段"
            tone="green"
            class="volunteer-surface-lift"
          />
          <VolunteerSummaryCard
            label="当前时长"
            :value="`${totalHours}h`"
            detail="继续积累可稳定升级"
            tone="blue"
            class="volunteer-surface-lift"
          />
          <VolunteerSummaryCard
            label="下一级目标"
            :value="`${remainingHours}h`"
            detail="还需新增服务时长"
            tone="amber"
            class="volunteer-surface-lift"
          />
        </div>

        <div class="space-y-4">
          <article
            v-for="step in levelProgressMatrix"
            :key="step.level"
            class="volunteer-surface-lift flex gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold"
              :class="step.unlocked ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500'"
            >
              {{ step.level }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-3">
                <p class="font-bold text-slate-900">
                  {{ step.title }}
                </p>
                <VolunteerStatusBadge
                  :label="step.unlocked ? '已达成' : '冲刺中'"
                  :tone="step.unlocked ? 'green' : 'amber'"
                />
              </div>
              <p class="mt-1 text-sm text-slate-500">
                {{ step.description }}
              </p>
            </div>
          </article>
        </div>
      </VolunteerSectionCard>

      <VolunteerSectionCard
        title="冲刺建议"
        description="按你当前阶段给出更容易执行的成长策略。"
        tone="soft"
      >
        <ul class="space-y-3 text-sm leading-6 text-slate-600">
          <li>优先安排固定时间段参与，保持每周至少一次稳定出勤。</li>
          <li>可将“高积分短时活动”和“高时长活动”搭配，平衡成长效率。</li>
          <li>在已熟悉主题中承担一次协作角色，更容易进入下一等级。</li>
        </ul>
      </VolunteerSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVolunteerMetrics } from '@/composables/useVolunteerMetrics'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'

const { totalHours, volunteerLevel } = useVolunteerMetrics()

const remainingHours = computed(() => Math.max(10 - (totalHours.value % 10), 0))
const currentLevel = computed(() => volunteerLevel.value)

const headerMeta = computed(() => [
  { label: '当前进度', value: `${totalHours.value % 10}/10h`, detail: '下一级解锁中' },
  { label: '成长节奏', value: '稳定', detail: '连续 4 周有记录' }
])

const levelProgressMatrix = computed(() => {
  const steps = [
    { level: 1, title: 'Lv.1 环保新星', description: '完成首场活动并熟悉平台流程。' },
    { level: 2, title: 'Lv.2 协作实践者', description: '开始稳定参与，建立可靠出勤记录。' },
    { level: 3, title: 'Lv.3 社区连接者', description: '能在活动中承担引导和协作角色。' },
    { level: 4, title: 'Lv.4 自然守护者', description: '具备持续参与和主题贡献能力。' }
  ]

  return steps.map((step) => ({
    ...step,
    unlocked: currentLevel.value >= step.level
  }))
})
</script>
