<template>
  <DataListPage>
    <template #header>
      <OrganizationPageHeader
        eyebrow="通知中心"
        title="通知中心"
        description="集中查看当前账号收到的活动、成员和工时通知。"
        :meta-items="headerMeta"
        mode="compact"
      >
        <template #actions>
          <Button
            variant="outline"
            rounded
            :disabled="markingRead || !filteredUnreadIds.length"
            @click="markAllAsRead"
          >
            {{ markingRead ? '处理中...' : '当前列表全部已读' }}
          </Button>
        </template>
      </OrganizationPageHeader>
    </template>

    <template #toolbar>
      <DataToolbar>
        <template #filters>
          <div class="data-list-filter-grid sm:grid-cols-[auto_minmax(0,1fr)_180px] sm:items-center">
            <label class="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#ffcfb3] hover:text-[#ec5b13]">
              <input
                v-model="unreadOnly"
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-[#ec5b13] focus:ring-[#ec5b13]"
              >
              <span :class="unreadOnly ? 'text-[#ec5b13]' : ''">仅看未读</span>
            </label>

            <Input
              v-model.trim="searchQuery"
              placeholder="搜索通知标题、内容、事件或业务类型"
              allow-clear
              class="w-full min-w-0 sm:min-w-[240px] sm:flex-1"
            />
            <div class="w-full min-w-0 sm:w-auto sm:min-w-[180px]">
              <FilterSelect
                v-model="pageSize"
                title="每页条数"
                :options="pageSizeOptions"
              />
            </div>
          </div>
        </template>

        <template #summary>
          <div class="data-list-summary-stack">
            <span class="data-list-pagination">第 {{ page }} / {{ totalPages }} 页</span>
            <span>当前筛选 <strong>{{ filteredNotifications.length }}</strong> 条，共 <strong>{{ notificationsStore.total }}</strong> 条</span>
            <span>未读 <strong>{{ unreadCount }}</strong> 条</span>
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
      <OrganizationSectionCard
        title="消息列表"
        description="点击通知查看详情，必要时继续跳转到相关业务页。"
      >
        <DataTable
          :columns="columns"
          :items="filteredNotifications"
          :loading="loading"
          row-key="inboxId"
          :selected-key="selectedNotificationId"
          interactive
          open-text="查看"
          open-style="text"
          density="compact"
          empty-title="当前没有可展示的通知"
          empty-description="切换未读筛选或清空搜索后再试。"
          @row-click="openNotificationDrawer"
        >
          <template #cell-title="{ item }">
            <div class="min-w-0 space-y-1">
              <p class="truncate text-sm font-semibold text-slate-900">
                {{ item.title }}
              </p>
              <p class="line-clamp-2 text-xs leading-5 text-slate-500">
                {{ item.content }}
              </p>
            </div>
          </template>

          <template #cell-type="{ item }">
            <div class="space-y-1">
              <p class="text-sm font-semibold text-slate-900">
                {{ getNotificationEventLabel(item.eventType) }}
              </p>
              <p class="text-xs text-slate-500">
                {{ item.bizType || item.eventType || '-' }}
              </p>
            </div>
          </template>

          <template #cell-status="{ item }">
            <StatusBadge
              :label="NOTIFICATION_READ_STATUS_LABELS[item.readStatus]"
              :tone="item.readStatus === NotificationReadStatus.READ ? 'slate' : 'amber'"
            />
          </template>

          <template #cell-createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template #row-actions="{ item }">
            <button
              v-if="item.readStatus !== NotificationReadStatus.READ"
              type="button"
              class="table-text-action"
              @click.stop="markSingleAsRead(item.inboxId)"
            >
              标记已读
            </button>
          </template>
        </DataTable>
      </OrganizationSectionCard>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="560px"
        :aria-label="selectedNotification ? `${selectedNotification.title} 的通知详情` : '通知详情'"
        @close="closeNotificationDrawer"
      >
        <template #header>
          <div
            v-if="selectedNotification"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                通知详情
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
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
                tone="blue"
              />
              <StatusBadge
                v-if="selectedNotification.bizType"
                :label="selectedNotification.bizType"
                tone="blue"
              />
            </div>
          </div>
        </template>

        <div
          v-if="selectedNotification"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  事件类型
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ getNotificationEventLabel(selectedNotification.eventType) }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ selectedNotification.eventType || '未标记' }}
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
                  已读时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedNotification.readAt ? formatDate(selectedNotification.readAt) : '尚未阅读' }}
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

          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              通知内容
            </p>
            <p class="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {{ selectedNotification.content }}
            </p>
          </section>
        </div>

        <WorkbenchEmptyPanel v-else>
          点击通知查看详情和已读状态。
        </WorkbenchEmptyPanel>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              v-if="selectedNotificationTarget"
              variant="outline"
              :disabled="selectedNotificationTarget.disabled"
              @click="goToRelatedPage"
            >
              {{ selectedNotificationTarget.label }}
            </Button>
            <Button
              v-if="selectedNotification && selectedNotification.readStatus !== NotificationReadStatus.READ"
              variant="primary"
              :loading="markingRead"
              @click="markSingleAsRead(selectedNotification.inboxId)"
            >
              标记已读
            </Button>
          </div>
          <p
            v-if="selectedNotificationTarget?.disabled"
            class="text-xs leading-5 text-slate-500"
          >
            这类通知暂时没有更精确的落点，继续留在通知中心查看即可。
          </p>
        </template>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import WorkbenchEmptyPanel from '@/components/workbench/WorkbenchEmptyPanel.vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataToolbar from '@/components/data-list/DataToolbar.vue'
import DataTable, { type DataTableColumn } from '@/components/data-list/DataTable.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import StatusBadge from '@/components/data-list/StatusBadge.vue'
import { NOTIFICATION_READ_STATUS_LABELS } from '@/constants/status'
import { getNotificationEventLabel, useNotificationsStore } from '@/store/modules/notifications'
import { useMessageStore } from '@/store/modules/messages'
import { NotificationReadStatus } from '@/types/notification'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { resolveNotificationTarget } from '@/utils/notificationNavigation'

const router = useRouter()
const notificationsStore = useNotificationsStore()
const messageStore = useMessageStore()
const unreadOnly = ref(false)
const markingRead = ref(false)
const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(20)
const pageSizeOptions = [
  { value: 10, label: '10 条', description: '适合精读消息内容' },
  { value: 20, label: '20 条', description: '默认浏览密度' },
  { value: 50, label: '50 条', description: '适合快速批量处理' }
] as const
const selectedNotificationId = ref<number | null>(null)
const drawerOpen = ref(false)

const columns: DataTableColumn[] = [
  { key: 'title', label: '通知', width: '420px', cellClass: 'align-top' },
  { key: 'type', label: '类型', width: '160px' },
  { key: 'status', label: '状态', width: '120px', align: 'center', cellClass: 'whitespace-nowrap' },
  { key: 'createdAt', label: '时间', width: '180px' }
]

const notifications = computed(() => notificationsStore.items)
const loading = computed(() => notificationsStore.loading)
const unreadIds = computed(() => notifications.value
  .filter(item => item.readStatus !== NotificationReadStatus.READ)
  .map(item => item.inboxId))
const totalPages = computed(() => Math.max(1, Math.ceil(notificationsStore.total / pageSize.value)))
const unreadCount = computed(() => unreadIds.value.length)

const filteredNotifications = computed(() => {
  return notifications.value
})
const filteredUnreadIds = computed(() => filteredNotifications.value
  .filter(item => item.readStatus !== NotificationReadStatus.READ)
  .map(item => item.inboxId))

const selectedNotification = computed(() => (
  filteredNotifications.value.find((item) => item.inboxId === selectedNotificationId.value)
  || notifications.value.find((item) => item.inboxId === selectedNotificationId.value)
  || null
))
const selectedNotificationTarget = computed(() => (
  selectedNotification.value
    ? resolveNotificationTarget(selectedNotification.value, 'organization')
    : null
))

const headerMeta = computed(() => [
  { label: '消息总数', value: `${notificationsStore.total}`, detail: '来自通知中心接口' },
  { label: '未读消息', value: `${unreadCount.value}`, detail: unreadOnly.value ? '当前仅展示未读' : '可批量标记已读' },
  { label: '分页进度', value: `${page.value}/${totalPages.value}`, detail: `每页 ${pageSize.value} 条` }
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
    console.error('加载通知失败:', error)
    messageStore.error(error.message || '加载通知失败，请稍后重试')
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

const openNotificationDrawer = (item: Record<string, any>) => {
  selectedNotificationId.value = item.inboxId
  drawerOpen.value = true
}

const closeNotificationDrawer = () => {
  drawerOpen.value = false
}

const goToRelatedPage = async () => {
  if (!selectedNotificationTarget.value) return
  if (selectedNotificationTarget.value.disabled) {
    messageStore.info('暂未配置对应页面')
    return
  }

  await router.push(selectedNotificationTarget.value.to)
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
    await notificationsStore.markNotificationsAsRead(filteredUnreadIds.value)
    messageStore.success('未读通知已全部标记为已读')
  } catch (error: any) {
    console.error('批量标记通知已读失败:', error)
    messageStore.error(error.message || '批量标记通知已读失败，请稍后重试')
  } finally {
    markingRead.value = false
  }
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

watch(notifications, (items) => {
  if (!items.length) {
    selectedNotificationId.value = null
    drawerOpen.value = false
    return
  }

  const hasSelected = items.some((item) => item.inboxId === selectedNotificationId.value)
  if (!hasSelected) {
    selectedNotificationId.value = items[0].inboxId
  }
}, { immediate: true })

onMounted(() => {
  void loadNotifications()
})
</script>
