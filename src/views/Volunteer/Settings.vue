<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      mode="compact"
      eyebrow="账户设置"
      title="管理账户与隐私偏好"
      description="把安全、隐私与平台使用习惯拆成独立分组，降低误操作成本。"
      :meta-items="[{ label: '账户状态', value: '正常', detail: '建议完成安全检查清单' }]"
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
                :class="item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ item.done ? '已完成' : '待处理' }}
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
  { title: '修改登录密码', detail: '提升账号安全强度，建议每月检查一次。', action: '立即修改' },
  { title: '检查登录设备', detail: '查看近期设备登录，及时移除未知设备。', action: '查看设备' },
  { title: '同步通知偏好', detail: '按渠道调整提醒密度，减少信息噪音。', action: '前往设置' }
]

const settingGroups = [
  {
    title: '账户安全',
    description: '优先处理会影响登录和敏感操作确认的选项。',
    items: [
      { label: '登录密码', description: '定期更新密码，避免复用其他平台的旧密码。', action: '修改', recommendation: '推荐本月更新', variant: 'soft' },
      { label: '登录设备', description: '查看最近登录记录，识别异常访问。', action: '查看', recommendation: '最近 2 台设备', variant: 'ghost' }
    ]
  },
  {
    title: '隐私展示',
    description: '控制个人资料在团队、排行榜和公开活动中的可见范围。',
    items: [
      { label: '资料可见范围', description: '决定你的头像、昵称和服务标签在哪些页面展示。', action: '调整', recommendation: '当前为团队可见', variant: 'soft' },
      { label: '排行榜展示', description: '控制是否在成长排行榜中展示个人名称。', action: '设置', recommendation: '已开启', variant: 'ghost' }
    ]
  }
]

const securityHighlights = [
  {
    label: '密码状态',
    value: '上次更新于 18 天前',
    tag: '状态稳定',
    tone: 'bg-emerald-100 text-emerald-700',
    detail: '还不需要立即修改，但建议在本月内完成一次更新。'
  },
  {
    label: '资料曝光',
    value: '团队内可见',
    tag: '可调整',
    tone: 'bg-amber-100 text-amber-700',
    detail: '如果你准备参与公开招募活动，可以单独放开展示信息。'
  },
  {
    label: '异常访问',
    value: '最近 30 天未发现',
    tag: '正常',
    tone: 'bg-slate-100 text-slate-600',
    detail: '当前没有可疑登录记录，维持现有设备管理策略即可。'
  }
]

const securityChecklist = [
  { label: '确认手机号可用', detail: '用于找回密码和异常登录验证。', done: true },
  { label: '开启提醒渠道兜底', detail: '建议系统通知与短信至少保留一个。', done: true },
  { label: '检查排行榜公开状态', detail: '避免不必要的个人信息曝光。', done: false }
]
</script>
