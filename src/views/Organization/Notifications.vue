<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Inbox"
      title="通知管理"
      description="集中查看系统消息、审核提醒和活动相关通知。"
      :meta-items="headerMeta"
      mode="compact"
    >
      <template #actions>
        <button
          class="org-toolbar-button disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="markingRead || !unreadIds.length"
          @click="markAllAsRead"
        >
          {{ markingRead ? '处理中...' : '全部标记已读' }}
        </button>
      </template>
    </OrganizationPageHeader>

    <OrganizationSectionCard
      title="消息列表"
      description="以下内容来自真实通知接口，保留当前组织端页面风格。"
    >
      <template #header>
        <label class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
          <input
            v-model="unreadOnly"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-[#ec5b13] focus:ring-[#ec5b13]"
          >
          仅看未读
        </label>
      </template>

      <div
        v-if="loading"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
      >
        正在加载通知...
      </div>

      <div
        v-else-if="!notifications.length"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
      >
        当前没有可展示的通知。
      </div>

      <div
        v-else
        class="space-y-4"
      >
        <article
          v-for="item in notifications"
          :key="item.inboxId"
          class="organization-surface-lift rounded-[1.3rem] border px-5 py-4"
          :class="item.readStatus === 1 ? 'border-slate-200 bg-white' : 'border-[#ffd8c2] bg-[#fff8f3]'"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  :class="item.readStatus === 1 ? 'bg-slate-100 text-slate-500' : 'bg-[#ffe1d0] text-[#ec5b13]'"
                >
                  {{ item.readStatus === 1 ? '已读' : '未读' }}
                </span>
                <span
                  v-if="item.bizType"
                  class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500"
                >
                  {{ item.bizType }}
                </span>
              </div>

              <h2 class="mt-3 text-base font-bold text-slate-900">
                {{ item.title }}
              </h2>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                {{ item.content }}
              </p>
              <p class="mt-3 text-xs text-slate-400">
                {{ formatDate(item.createdAt) }}
              </p>
            </div>

            <button
              v-if="item.readStatus !== 1"
              class="rounded-full border border-[#ffd3be] bg-white px-4 py-2 text-sm font-semibold text-[#ec5b13] transition hover:border-[#ec5b13] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="markingRead"
              @click="markSingleAsRead(item.inboxId)"
            >
              标记已读
            </button>
          </div>
        </article>
      </div>
    </OrganizationSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useNotificationsStore } from '@/store/modules/notifications'
import { useMessageStore } from '@/store/modules/messages'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'

const notificationsStore = useNotificationsStore()
const messageStore = useMessageStore()
const unreadOnly = ref(false)
const markingRead = ref(false)

const notifications = computed(() => notificationsStore.items)
const loading = computed(() => notificationsStore.loading)
const unreadIds = computed(() => notifications.value.filter(item => item.readStatus !== 1).map(item => item.inboxId))
const unreadCount = computed(() => unreadIds.value.length)

const headerMeta = computed(() => [
  { label: '消息总数', value: `${notificationsStore.total}`, detail: '来自通知中心接口' },
  { label: '未读消息', value: `${unreadCount.value}`, detail: unreadOnly.value ? '当前仅展示未读' : '可批量标记已读' }
])

const loadNotifications = async () => {
  try {
    await notificationsStore.fetchNotifications({
      page: 1,
      pageSize: 20,
      unreadOnly: unreadOnly.value || undefined
    })
  } catch (error: any) {
    console.error('加载通知失败:', error)
    messageStore.error(error.message || '加载通知失败，请稍后重试')
  }
}

const markSingleAsRead = async (id: number) => {
  markingRead.value = true
  try {
    await notificationsStore.markNotificationsAsRead([id])
    messageStore.success('通知已标记为已读')
  } catch (error: any) {
    console.error('标记通知已读失败:', error)
    messageStore.error(error.message || '标记通知已读失败，请稍后重试')
  } finally {
    markingRead.value = false
  }
}

const markAllAsRead = async () => {
  markingRead.value = true
  try {
    await notificationsStore.markNotificationsAsRead(unreadIds.value)
    messageStore.success('未读通知已全部标记为已读')
  } catch (error: any) {
    console.error('批量标记通知已读失败:', error)
    messageStore.error(error.message || '批量标记通知已读失败，请稍后重试')
  } finally {
    markingRead.value = false
  }
}

const formatDate = (value?: string) => {
  if (!value) {
    return '时间待更新'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(unreadOnly, () => {
  loadNotifications()
})

onMounted(() => {
  loadNotifications()
})
</script>
