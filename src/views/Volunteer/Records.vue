<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="个人记录"
      title="服务明细与贡献概览"
      description="把累计时长、积分和具体活动记录集中查看，方便后续导出或补充证明。"
      :meta-items="headerMeta"
    >
      <template #actions>
        <button class="volunteer-toolbar-button">
          导出记录
        </button>
      </template>
    </VolunteerPageHeader>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
      <VolunteerSectionCard
        class="volunteer-records-workbench"
        title="记录工作区"
        description="按状态和时间快速定位某条记录，保持明细可追踪。"
      >
        <div class="mb-5 grid gap-4 md:grid-cols-3">
          <VolunteerSummaryCard
            label="累计服务时长"
            :value="`${totalHours}h`"
            detail="其中 4 小时待确认"
            tone="green"
            class="volunteer-surface-lift"
          />
          <VolunteerSummaryCard
            label="累计积分"
            :value="String(totalPoints)"
            detail="本月增长速度稳定"
            tone="amber"
            class="volunteer-surface-lift"
          />
          <VolunteerSummaryCard
            label="服务场次"
            :value="String(volunteerRecords.length)"
            detail="形成完整服务履历"
            tone="blue"
            class="volunteer-surface-lift"
          />
        </div>

        <transition-group
          name="volunteer-list-rise"
          tag="div"
          class="space-y-3"
        >
          <div
            v-for="record in sortedRecords"
            :key="record.id"
            class="volunteer-surface-lift rounded-[1.4rem] border border-slate-100 bg-slate-50/80 p-4"
          >
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-3">
                  <h3 class="text-base font-bold text-slate-900">
                    {{ record.activityName }}
                  </h3>
                  <VolunteerStatusBadge
                    :label="statusText(record.status)"
                    :tone="statusTone(record.status)"
                  />
                </div>
                <p class="mt-2 text-sm text-slate-500">
                  {{ record.location }} · {{ record.date }}
                </p>
              </div>
              <div class="flex flex-wrap gap-4 text-sm text-slate-600">
                <span>{{ record.hours }} 小时</span>
                <span>+{{ record.points }} 积分</span>
                <span>{{ record.highlight }}</span>
              </div>
            </div>
          </div>
        </transition-group>
      </VolunteerSectionCard>

      <div class="space-y-6">
        <VolunteerSectionCard
          title="状态分布"
          description="记录状态能帮助你优先处理待确认项。"
          tone="soft"
        >
          <div class="space-y-3">
            <article
              v-for="item in recordStatusBreakdown"
              :key="item.label"
              class="volunteer-surface-lift rounded-[1.25rem] border border-white/75 bg-white/90 px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-slate-600">
                  {{ item.label }}
                </p>
                <p class="text-lg font-black text-slate-900">
                  {{ item.value }}
                </p>
              </div>
              <p class="mt-2 text-xs text-slate-500">
                {{ item.detail }}
              </p>
            </article>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="近期徽章"
          description="部分成长里程碑会自动写入你的服务记录。"
        >
          <div class="space-y-3">
            <article
              v-for="badge in volunteerBadges.slice(0, 3)"
              :key="badge.id"
              class="volunteer-surface-lift rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4"
            >
              <p class="text-base font-bold text-slate-900">
                {{ badge.name }}
              </p>
              <p class="mt-1 text-sm text-slate-500">
                {{ badge.description }}
              </p>
              <p class="mt-2 text-xs font-semibold text-emerald-700">
                {{ badge.progress }}
              </p>
            </article>
          </div>
        </VolunteerSectionCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import { volunteerBadges, volunteerRecords } from '@/data/volunteerCenter'

const totalHours = computed(() => volunteerRecords.reduce((sum, item) => sum + item.hours, 0))
const totalPoints = computed(() => volunteerRecords.reduce((sum, item) => sum + item.points, 0))

const sortedRecords = computed(() => {
  return [...volunteerRecords].sort((a, b) => (a.date < b.date ? 1 : -1))
})

const headerMeta = computed(() => [
  { label: '记录条数', value: `${volunteerRecords.length} 条`, detail: '可导出证明' },
  { label: '活跃状态', value: '稳定参与', detail: '连续 4 周有记录' }
])

const recordStatusBreakdown = computed(() => {
  const completed = volunteerRecords.filter(item => item.status === 'completed').length
  const pending = volunteerRecords.filter(item => item.status === 'pending').length
  const cancelled = volunteerRecords.filter(item => item.status === 'cancelled').length
  return [
    { label: '已完成', value: `${completed}`, detail: '可用于成长统计和证明导出' },
    { label: '待确认', value: `${pending}`, detail: '建议优先联系组织方补齐确认' },
    { label: '已取消', value: `${cancelled}`, detail: '保持低取消率有助于信用稳定' }
  ]
})

const statusText = (status: string) => ({ completed: '已完成', pending: '待确认', cancelled: '已取消' }[status] || status)
const statusTone = (status: string) => ({ completed: 'green', pending: 'amber', cancelled: 'slate' }[status] || 'slate') as 'green' | 'amber' | 'slate'
</script>
