<template>
  <DataListPage>
    <template #header>
      <VolunteerPageHeader
        eyebrow="通知中心"
        title="跟进我的服务动态"
        description="统一查看报名结果、活动变更和工时结算。"
        :meta-items="headerMeta"
        layout="operations"
      >
        <template #summary>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            当前检索 / {{ keywordSummary }}
          </span>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            展示范围 / {{ unreadOnly ? '仅未读' : '全部通知' }}
          </span>
          <span class="rounded-full border border-emerald-100 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-600">
            列表规模 / {{ pageSize }} 条/页
          </span>
        </template>

        <template #actions>
          <div class="grid w-full gap-3 2xl:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              v-model.trim="searchQuery"
              placeholder="搜索标题、内容或业务类型"
              allow-clear
              theme="emerald"
            />
            <Button
              variant="outline"
              rounded
              :disabled="markingRead || !unreadInboxIds.length"
              @click="markAllAsRead"
            >
              {{ markingRead ? '处理中...' : '本页全部已读' }}
            </Button>
          </div>
        </template>
      </VolunteerPageHeader>
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="data-list-filter-grid lg:grid-cols-[auto_200px]">
            <label class="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm font-semibold text-slate-700">
              <input
                v-model="unreadOnly"
                type="checkbox"
                class="h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
              >
              <span>仅看未读提醒</span>
            </label>

            <FilterSelect
              v-model="pageSize"
              title="每页条数"
              :options="pageSizeOptions"
              theme="emerald"
            />
          </div>
        </template>

        <template #summary>
          <div class="data-list-summary-stack">
            <span class="data-list-pagination">第 {{ page }} / {{ totalPages }} 页</span>
            <span>当前页 <strong>{{ notifications.length }}</strong> 条</span>
            <span>未读 <strong>{{ unreadInboxIds.length }}</strong> 条</span>
          </div>
        </template>

        <template #actions>
          <div class="data-list-action-stack">
            <Button
              variant="outline"
              :disabled="loading || page <= 1"
              @click="goToPreviousPage"
            >
              上一页
            </Button>
            <Button
              variant="outline"
              :disabled="loading || page >= totalPages"
              @click="goToNextPage"
            >
              下一页
            </Button>
          </div>
        </template>
      </DataToolbar>
    </template>

    <template #body>
      <div class="grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
        <VolunteerSectionCard
          title="通知流"
          description="先处理未读，再核对报名、活动和工时变化。"
        >
          <div class="space-y-5">
            <div class="grid gap-4 md:grid-cols-3">
              <div
                v-for="metric in summaryMetrics"
                :key="metric.label"
                class="rounded-[1.4rem] border border-slate-100 bg-slate-50/80 px-4 py-4"
              >
                <p class="text-sm font-semibold text-slate-500">
                  {{ metric.label }}
                </p>
                <p class="mt-1 text-2xl font-black text-slate-900">
                  {{ metric.value }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ metric.detail }}
                </p>
              </div>
            </div>

            <DataList
              :items="notifications"
              :loading="loading"
              row-key="inboxId"
              :selected-key="selectedNotificationId"
              interactive
              open-text="查看详情"
              open-style="text"
              empty-title="当前没有可展示的通知"
              empty-description="调整筛选条件后再试。"
              @row-click="selectNotification"
            >
              <template #default="{ item }">
                <div class="space-y-3">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="truncate text-base font-bold text-slate-900">
                          {{ item.title }}
                        </h3>
                        <StatusBadge
                          :label="NOTIFICATION_READ_STATUS_LABELS[item.readStatus]"
                          :tone="item.readStatus === NotificationReadStatus.READ ? 'slate' : 'amber'"
                        />
                        <StatusBadge
                          :label="getNotificationEventLabel(item.eventType)"
                          :tone="eventTone(item.eventType)"
                        />
                      </div>
                      <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {{ item.content }}
                      </p>
                    </div>

                    <p class="text-xs font-medium text-slate-400">
                      {{ formatDate(item.createdAt) }}
                    </p>
                  </div>

                  <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span
                      v-if="item.bizType"
                      class="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold"
                    >
                      业务 / {{ item.bizType }}
                    </span>
                    <span
                      v-if="typeof item.bizId === 'number'"
                      class="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold"
                    >
                      业务 ID / {{ item.bizId }}
                    </span>
                  </div>
                </div>
              </template>

              <template #actions="{ item }">
                <Button
                  v-if="item.readStatus !== NotificationReadStatus.READ"
                  variant="outline"
                  size="sm"
                  :disabled="markingRead"
                  @click="markSingleAsRead(item.inboxId)"
                >
                  标记已读
                </Button>
              </template>
            </DataList>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="通知详情"
          description="确认内容后，再决定是否已读或继续跳转。"
          tone="soft"
        >
          <div
            v-if="selectedNotification"
            class="space-y-5"
          >
            <div class="space-y-3">
              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  当前通知
                </p>
                <h2 class="text-xl font-black tracking-tight text-slate-900">
                  {{ selectedNotification.title }}
                </h2>
                <p class="text-sm text-slate-500">
                  {{ formatDate(selectedNotification.createdAt) }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <StatusBadge
                  :label="NOTIFICATION_READ_STATUS_LABELS[selectedNotification.readStatus]"
                  :tone="selectedNotification.readStatus === NotificationReadStatus.READ ? 'slate' : 'amber'"
                />
                <StatusBadge
                  :label="getNotificationEventLabel(selectedNotification.eventType)"
                  :tone="eventTone(selectedNotification.eventType)"
                />
                <StatusBadge
                  v-if="selectedNotification.bizType"
                  :label="selectedNotification.bizType"
                  tone="blue"
                />
              </div>
            </div>

            <section class="rounded-[1.4rem] border border-white/80 bg-white/90 p-4">
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    事件类型
                  </p>
                  <p class="mt-1 text-sm font-semibold text-slate-900">
                    {{ getNotificationEventLabel(selectedNotification.eventType) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    阅读状态
                  </p>
                  <p class="mt-1 text-sm font-semibold text-slate-900">
                    {{ NOTIFICATION_READ_STATUS_LABELS[selectedNotification.readStatus] }}
                  </p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    已读时间
                  </p>
                  <p class="mt-1 text-sm font-semibold text-slate-900">
                    {{ selectedNotification.readAt ? formatDate(selectedNotification.readAt) : '尚未阅读' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    业务类型
                  </p>
                  <p class="mt-1 text-sm font-semibold text-slate-900">
                    {{ selectedNotification.bizType || '未标记' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    业务 ID
                  </p>
                  <p class="mt-1 text-sm font-semibold text-slate-900">
                    {{ typeof selectedNotification.bizId === 'number' ? selectedNotification.bizId : '-' }}
                  </p>
                </div>
              </div>
            </section>

            <section class="rounded-[1.4rem] border border-white/80 bg-white/90 p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                通知内容
              </p>
              <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {{ selectedNotification.content }}
              </p>
            </section>

            <div class="flex flex-col gap-3">
              <Button
                v-if="selectedNotification.readStatus !== NotificationReadStatus.READ"
                variant="primary"
                :loading="markingRead"
                @click="markSingleAsRead(selectedNotification.inboxId)"
              >
                标记已读
              </Button>
              <Button
                variant="outline"
                :disabled="!selectedTarget || selectedTarget.disabled"
                @click="goToRelatedPage"
              >
                {{ selectedTarget?.label || '前往相关页面' }}
              </Button>
              <p
                v-if="selectedTarget?.disabled"
                class="text-xs leading-5 text-slate-500"
              >
                这类通知暂时没有配置更精确的目标页面，你可以先保留在通知中心统一查看。
              </p>
              <p
                v-else-if="selectedTarget"
                class="text-xs leading-5 text-slate-500"
              >
                会跳到这条提醒最相关的页面。
              </p>
            </div>
          </div>

          <div
            v-else
            class="rounded-[1.4rem] border border-dashed border-emerald-200 bg-white/80 px-4 py-10 text-center"
          >
            <p class="text-sm font-semibold text-slate-700">
              还没有选中通知
            </p>
            <p class="mt-2 text-sm leading-6 text-slate-500">
              先从左侧选一条通知开始。
            </p>
            <div class="mt-5 grid gap-3 text-left sm:grid-cols-3">
              <div class="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  先看未读
                </p>
                <p class="mt-1 text-xs leading-5 text-slate-600">
                  先确认报名结果、活动变化和工时更新。
                </p>
              </div>
              <div class="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  再做处理
                </p>
                <p class="mt-1 text-xs leading-5 text-slate-600">
                  显式点击按钮再标记已读。
                </p>
              </div>
              <div class="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  最后跳转
                </p>
                <p class="mt-1 text-xs leading-5 text-slate-600">
                  有精确落点时再继续查看详情。
                </p>
              </div>
            </div>
          </div>
        </VolunteerSectionCard>
      </div>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import DataList from '@/components/data-list/DataList.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import { NOTIFICATION_READ_STATUS_LABELS } from '@/constants/status'
import { useMessageStore } from '@/store/modules/messages'
import {
  getNotificationEventLabel,
  useNotificationsStore
} from '@/store/modules/notifications'
import { NotificationReadStatus } from '@/types/notification'
import { shouldRefreshOnKeepAliveActivated } from '@/utils/keepAliveRefresh'
import { resolveNotificationTarget } from '@/utils/notificationNavigation'

const route = useRoute()
const router = useRouter()
const notificationsStore = useNotificationsStore()
const messageStore = useMessageStore()

const searchQuery = ref('')
const unreadOnly = ref(false)
const page = ref(1)
const pageSize = ref(10)
const selectedNotificationId = ref<number | null>(null)
const markingRead = ref(false)
const hasLoadedOnce = ref(false)
const hasActivatedOnce = ref(false)

const pageSizeOptions = [
  { value: 10, label: '10 条', description: '适合逐条确认提醒内容' },
  { value: 20, label: '20 条', description: '平衡浏览效率和阅读密度' },
  { value: 50, label: '50 条', description: '适合快速批量检查通知' }
] as const

const notifications = computed(() => notificationsStore.items)
const loading = computed(() => notificationsStore.loading)
const totalPages = computed(() => Math.max(1, Math.ceil(notificationsStore.total / pageSize.value)))
const unreadInboxIds = computed(() => notifications.value
  .filter((item) => item.readStatus !== NotificationReadStatus.READ)
  .map((item) => item.inboxId))

const selectedNotification = computed(() => (
  notifications.value.find((item) => item.inboxId === selectedNotificationId.value) || null
))

const selectedTarget = computed(() => (
  selectedNotification.value
    ? resolveNotificationTarget(selectedNotification.value, 'volunteer')
    : null
))

const keywordSummary = computed(() => searchQuery.value || '全部内容')

const headerMeta = computed(() => [
  { label: '消息总数', value: `${notificationsStore.total}`, detail: '当前账号的通知收件箱' },
  { label: '本页未读', value: `${unreadInboxIds.value.length}`, detail: unreadOnly.value ? '已切换为仅看未读' : '可批量处理当前页提醒' },
  { label: '分页进度', value: `${page.value}/${totalPages.value}`, detail: `每页 ${pageSize.value} 条` }
])

const summaryMetrics = computed(() => [
  { label: '当前页通知', value: `${notifications.value.length}`, detail: '按当前筛选条件返回' },
  { label: '待处理提醒', value: `${unreadInboxIds.value.length}`, detail: '优先确认未读消息' },
  { label: '检索结果总数', value: `${notificationsStore.total}`, detail: '来自服务端搜索与分页' }
])

const loadNotifications = async () => {
  try {
    await notificationsStore.fetchNotifications({
      page: page.value,
      pageSize: pageSize.value,
      unreadOnly: unreadOnly.value || undefined,
      keyword: searchQuery.value || undefined
    })
  } catch (error: any) {
    console.error('加载志愿者通知失败:', error)
    messageStore.error(error.message || '加载通知失败，请稍后重试')
  }
}

const selectNotification = (item: Record<string, any>) => {
  selectedNotificationId.value = Number(item.inboxId)
}

const markSingleAsRead = async (inboxId: number) => {
  markingRead.value = true
  try {
    await notificationsStore.markNotificationsAsRead([inboxId])
    messageStore.success('通知已标记为已读')
  } catch (error: any) {
    console.error('标记志愿者通知已读失败:', error)
    messageStore.error(error.message || '标记通知已读失败，请稍后重试')
  } finally {
    markingRead.value = false
  }
}

const markAllAsRead = async () => {
  markingRead.value = true
  try {
    await notificationsStore.markNotificationsAsRead(unreadInboxIds.value)
    messageStore.success('当前页通知已标记为已读')
  } catch (error: any) {
    console.error('批量标记志愿者通知已读失败:', error)
    messageStore.error(error.message || '批量标记通知已读失败，请稍后重试')
  } finally {
    markingRead.value = false
  }
}

const goToPreviousPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await loadNotifications()
}

const goToNextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await loadNotifications()
}

const goToRelatedPage = async () => {
  if (!selectedTarget.value) return
  if (selectedTarget.value.disabled) {
    messageStore.info('暂未配置对应页面')
    return
  }

  await router.push(selectedTarget.value.to)
}

const eventTone = (eventType?: string) => {
  if (!eventType) return 'slate'
  if (eventType.startsWith('work_hour_')) return 'green'
  if (eventType.startsWith('signup_')) return 'blue'
  if (eventType === 'activity_canceled') return 'rose'
  if (eventType.startsWith('activity_') || eventType === 'member_join') return 'amber'
  return 'slate'
}

const formatDate = (value?: string) => {
  if (!value) return '时间待更新'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(notifications, (items) => {
  if (!items.length) {
    selectedNotificationId.value = null
    return
  }

  const hasSelected = items.some((item) => item.inboxId === selectedNotificationId.value)
  if (!hasSelected) {
    selectedNotificationId.value = items[0].inboxId
  }
}, { immediate: true })

watch(unreadOnly, () => {
  page.value = 1
  void loadNotifications()
})

watch(pageSize, () => {
  page.value = 1
  void loadNotifications()
})

watch(searchQuery, () => {
  page.value = 1
  void loadNotifications()
})

onMounted(() => {
  hasLoadedOnce.value = true
  void loadNotifications()
})

onActivated(() => {
  if (!hasActivatedOnce.value) {
    hasActivatedOnce.value = true
    return
  }

  if (!shouldRefreshOnKeepAliveActivated({
    currentRouteName: String(route.name || ''),
    expectedRouteName: 'volunteer-notifications',
    hasLoadedOnce: hasLoadedOnce.value,
    hasActivatedOnce: hasActivatedOnce.value
  })) {
    return
  }

  void loadNotifications()
})
</script>
