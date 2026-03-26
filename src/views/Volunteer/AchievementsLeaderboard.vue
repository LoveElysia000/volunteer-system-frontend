<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="排行榜"
      title="看看你在活跃志愿者中的位置"
      description="排行榜用积分、时长和连续服务综合评估，不只是单次冲量。"
      :meta-items="headerMeta"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
      <VolunteerSectionCard
        class="volunteer-leaderboard-rhythm"
        title="本周排名"
        description="越稳定参与，越容易在综合榜单中持续靠前。"
      >
        <transition-group
          name="volunteer-list-rise"
          tag="div"
          class="space-y-3"
        >
          <article
            v-for="(item, index) in leaderboard"
            :key="item.id"
            class="volunteer-surface-lift flex items-center gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4"
          >
            <div
              class="flex h-11 w-11 items-center justify-center rounded-full font-black"
              :class="index < 3 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'"
            >
              {{ index + 1 }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-3">
                <p class="font-bold text-slate-900">
                  {{ item.name }}
                </p>
                <VolunteerStatusBadge
                  :label="item.streak"
                  :tone="item.name === '你' ? 'blue' : 'slate'"
                />
              </div>
              <p class="mt-1 text-sm text-slate-500">
                {{ item.hours }} 小时服务时长 · {{ item.score }} 综合积分
              </p>
            </div>
          </article>
        </transition-group>

        <div
          v-if="leaderboard.length === 0"
          class="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500"
        >
          暂无排行数据，接入真实接口后这里会按现有样式展示。
        </div>
      </VolunteerSectionCard>

      <VolunteerSectionCard
        title="冲刺看板"
        description="聚焦你与前列的差距，并给出可执行冲刺方向。"
        tone="soft"
      >
        <div class="space-y-3">
          <article
            v-for="item in leaderboardSpotlight"
            :key="item.label"
            class="volunteer-surface-lift rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-4"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {{ item.label }}
            </p>
            <p class="mt-2 text-xl font-bold text-slate-900">
              {{ item.value }}
            </p>
            <p class="mt-1 text-xs text-slate-500">
              {{ item.detail }}
            </p>
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
import { leaderboard } from '@/data/volunteerCenter'

const myRank = computed(() => leaderboard.findIndex(item => item.name === '你') + 1)
const topScore = computed(() => leaderboard[0]?.score || 0)
const myScore = computed(() => leaderboard.find(item => item.name === '你')?.score || 0)
const scoreGap = computed(() => Math.max(topScore.value - myScore.value, 0))

const headerMeta = computed(() => [
  { label: '当前排名', value: `#${myRank.value || '-'}`, detail: leaderboard.length > 0 ? `与第一名差 ${scoreGap.value} 分` : '等待接口返回' },
  { label: '当前积分', value: `${myScore.value}`, detail: '保持稳定出勤可继续上升' }
])

const leaderboardSpotlight = computed(() => [
  { label: '冲刺目标', value: leaderboard.length > 0 ? `缩小 ${scoreGap.value} 分差距` : '等待数据', detail: '优先参加高积分活动并保持连续服务。' },
  { label: '稳定优势', value: `连续服务 ${leaderboard.find(item => item.name === '你')?.streak || '-'}`, detail: '连续周数是排名的重要加权项。' },
  { label: '建议节奏', value: '每周 2 场', detail: '一场高时长 + 一场高积分更均衡。' }
])
</script>
