<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      mode="compact"
      eyebrow="账户设置"
      title="管理账户与隐私偏好"
      description="把安全、隐私与平台使用习惯拆成独立分组，降低误操作成本。"
      :meta-items="[{ label: '账户状态', value: '等待接口', detail: '当前不展示本地默认数据' }]"
    />

    <VolunteerSectionCard
      class="volunteer-settings-orbit"
      title="快捷操作"
      description="高频操作前置，减少在多组设置之间来回跳转。"
    >
      <div class="grid gap-3 md:grid-cols-3">
        <article
          v-for="item in settingQuickActions"
          :key="item.title"
          class="volunteer-surface-lift rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4"
        >
          <p class="text-sm font-bold text-slate-900">
            {{ item.title }}
          </p>
          <p class="mt-2 text-xs leading-5 text-slate-500">
            {{ item.detail }}
          </p>
          <button class="mt-4 volunteer-toolbar-button volunteer-toolbar-button--ghost">
            {{ item.action }}
          </button>
        </article>
      </div>
    </VolunteerSectionCard>

    <div class="volunteer-settings-orbit grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <div class="space-y-6">
        <VolunteerSectionCard
          v-for="group in settingGroups"
          :key="group.title"
          :title="group.title"
          :description="group.description"
        >
          <div class="space-y-4">
            <transition-group
              name="volunteer-list-rise"
              tag="div"
              class="space-y-4"
            >
              <div
                v-for="item in group.items"
                :key="`${group.title}-${item.label}`"
                class="volunteer-surface-lift flex flex-col gap-4 rounded-[1.4rem] border border-slate-100 bg-slate-50/80 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="font-semibold text-slate-900">
                      {{ item.label }}
                    </p>
                    <span
                      v-if="item.recommendation"
                      class="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700"
                    >
                      {{ item.recommendation }}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-slate-500">
                    {{ item.description }}
                  </p>
                </div>
                <button
                  class="volunteer-toolbar-button shrink-0"
                  :class="item.variant === 'ghost' ? 'volunteer-toolbar-button--ghost' : 'volunteer-toolbar-button--soft'"
                >
                  {{ item.action }}
                </button>
              </div>
            </transition-group>
          </div>

        </VolunteerSectionCard>
      </div>

      <div class="space-y-6">
        <VolunteerSectionCard
          title="安全状态摘要"
          description="优先处理会影响登录和资料曝光的关键项。"
          tone="soft"
        >
          <div class="space-y-4">
            <div
              v-for="item in securityHighlights"
              :key="item.label"
              class="volunteer-surface-lift rounded-[1.4rem] border border-white/70 bg-white/90 px-4 py-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold text-slate-500">
                    {{ item.label }}
                  </p>
                  <p class="mt-1 text-lg font-bold text-slate-900">
                    {{ item.value }}
                  </p>
                </div>
                <span
                  class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  :class="item.tone"
                >
                  {{ item.tag }}
                </span>
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                {{ item.detail }}
              </p>
            </div>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="安全检查清单"
          description="完成这些动作后，账户风险会明显降低。"
        >
          <ul class="space-y-3">
            <li
              v-for="item in securityChecklist"
              :key="item.label"
              class="volunteer-surface-lift flex items-start justify-between gap-3 rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3"
            >
              <div>
                <p class="text-sm font-semibold text-slate-900">
                  {{ item.label }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ item.detail }}
                </p>
              </div>
              <span
                class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
              >
                {{ item.done ? '已接入' : '待接入' }}
              </span>
            </li>
          </ul>
        </VolunteerSectionCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'

const settingQuickActions = [
  { title: '修改登录密码', detail: '入口保留，具体配置依赖后端能力。', action: '待接入' },
  { title: '检查登录设备', detail: '近期设备信息将由真实接口返回。', action: '待接入' },
  { title: '同步通知偏好', detail: '通知设置将与后端配置保持一致。', action: '待接入' }
]
const settingGroups: Array<{
  title: string
  description: string
  items: Array<{ label: string, description: string, action: string, recommendation?: string, variant: 'ghost' | 'soft' }>
}> = [
  {
    title: '账户安全',
    description: '优先处理会影响登录和敏感操作确认的选项。',
    items: [
      { label: '登录密码', description: '密码状态将由后端安全接口返回。', action: '待接入', recommendation: '接口接入后更新', variant: 'soft' },
      { label: '登录设备', description: '设备列表和异常访问记录不再展示假数据。', action: '待接入', variant: 'ghost' }
    ]
  },
  {
    title: '隐私展示',
    description: '控制个人资料在团队、排行榜和公开活动中的可见范围。',
    items: [
      { label: '资料可见范围', description: '展示策略将以真实配置为准。', action: '待接入', variant: 'soft' },
      { label: '排行榜展示', description: '展示开关将在后端配置接入后同步。', action: '待接入', variant: 'ghost' }
    ]
  }
]
const securityHighlights = [
  {
    label: '密码状态',
    value: '待接入',
    tag: '待同步',
    tone: 'bg-slate-100 text-slate-600',
    detail: '当前不再展示本地推断的密码状态。'
  },
  {
    label: '资料曝光',
    value: '待接入',
    tag: '待同步',
    tone: 'bg-slate-100 text-slate-600',
    detail: '资料可见范围以真实配置返回结果为准。'
  },
  {
    label: '异常访问',
    value: '待接入',
    tag: '待同步',
    tone: 'bg-slate-100 text-slate-600',
    detail: '异常登录状态将在安全接口接入后展示。'
  }
]
const securityChecklist = [
  { label: '确认手机号可用', detail: '将根据账户资料接口返回状态判断。', done: false },
  { label: '开启提醒渠道兜底', detail: '通知渠道接入后再展示真实状态。', done: false },
  { label: '检查排行榜公开状态', detail: '避免不必要的个人信息曝光。', done: false }
]
</script>
