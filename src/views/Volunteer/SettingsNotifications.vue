<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      mode="compact"
      eyebrow="通知偏好"
      title="设置活动与系统提醒方式"
      description="优先保留你真正需要的消息渠道，减少无效打扰。"
      :meta-items="headerMeta"
    />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
      <VolunteerSectionCard
        class="volunteer-notification-matrix"
        title="通知矩阵"
        description="各渠道承担不同场景，建议至少保留一个强提醒渠道。"
      >
        <div class="space-y-4">
          <article
            v-for="channel in channels"
            :key="channel.key"
            class="volunteer-surface-lift flex items-center justify-between rounded-[1.4rem] border border-slate-100 bg-slate-50/80 px-4 py-4"
          >
            <div class="pr-6">
              <p class="font-semibold text-slate-900">
                {{ channel.label }}
              </p>
              <p class="mt-1 text-sm text-slate-500">
                {{ channel.description }}
              </p>
            </div>
            <button
              class="relative inline-flex h-6 w-11 shrink-0 rounded-full transition"
              :class="channel.enabled ? 'bg-emerald-600' : 'bg-slate-300'"
              @click="channel.enabled = !channel.enabled"
            >
              <span
                class="inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white transition"
                :class="channel.enabled ? 'translate-x-5' : 'translate-x-0.5'"
              />
            </button>
          </article>
        </div>
      </VolunteerSectionCard>

      <VolunteerSectionCard
        title="优先队列"
        description="需要优先保持开启的通知类型。"
        tone="soft"
      >
        <div class="space-y-3">
          <article
            v-for="item in notificationPriorityQueue"
            :key="item.label"
            class="volunteer-surface-lift rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-4"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-slate-900">
                {{ item.label }}
              </p>
              <span
                class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="item.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ item.enabled ? '已开启' : '建议开启' }}
              </span>
            </div>
            <p class="mt-2 text-xs leading-5 text-slate-500">
              {{ item.detail }}
            </p>
          </article>
        </div>
      </VolunteerSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
const channels = reactive([
  { key: 'system', label: '系统更新', description: '账户安全、策略变更和重要公告。', enabled: false },
  { key: 'activity', label: '活动提醒', description: '报名成功、行前提醒和活动变更。', enabled: false },
  { key: 'community', label: '社区动态', description: '团队成就、排行榜变动和互动消息。', enabled: false },
  { key: 'sms', label: '短信通知', description: '仅发送临近活动和紧急调整。', enabled: false }
])
const enabledCount = computed(() => channels.filter(item => item.enabled).length)

const headerMeta = computed(() => [
  { label: '已开启渠道', value: `${enabledCount.value} 个`, detail: '等待后端返回' },
  { label: '通知覆盖', value: enabledCount.value >= 2 ? '充足' : '待配置', detail: '至少保留两个渠道更稳妥' }
])

const notificationPriorityQueue = computed(() => {
  const findEnabled = (key: string) => channels.find(item => item.key === key)?.enabled ?? false
  return [
    { label: '活动提醒', detail: '用于签到前、时间变更和活动取消通知。', enabled: findEnabled('activity') },
    { label: '系统更新', detail: '用于安全策略、账户状态和平台公告。', enabled: findEnabled('system') },
    { label: '短信通知', detail: '用于紧急调整和临近活动强提醒。', enabled: findEnabled('sms') }
  ]
})
</script>
