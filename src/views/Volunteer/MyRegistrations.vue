<template>
  <DataListPage>
    <template #header>
      <VolunteerPageHeader
        eyebrow="我的报名"
        title="确认本周已预约任务"
        description="在同一页面里完成行前核对、优先排序和准备动作，避免临近活动时手忙脚乱。"
        :meta-items="headerMeta"
      >
        <template #actions>
          <RouterLink
            to="/volunteer/activities"
            class="volunteer-toolbar-button volunteer-toolbar-button--soft"
          >
            继续报名活动
          </RouterLink>
        </template>
      </VolunteerPageHeader>
    </template>

    <template #body>
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
        <VolunteerSectionCard
          class="volunteer-registration-ops"
          title="行前运营面板"
          description="按时间优先级处理最接近开始的活动，减少漏签到风险。"
        >
          <div class="space-y-5">
            <div class="grid gap-4 md:grid-cols-3">
              <VolunteerSummaryCard
                label="已报名活动"
                :value="String(registeredActivities.length)"
                detail="当前在排期中"
                tone="blue"
                class="volunteer-surface-lift"
              />
              <VolunteerSummaryCard
                label="本周待参与"
                :value="String(soonCount)"
                detail="优先查看时间提醒"
                tone="green"
                class="volunteer-surface-lift"
              />
              <VolunteerSummaryCard
                label="平均服务时长"
                :value="`${averageDuration}h`"
                detail="按活动排班估算"
                tone="amber"
                class="volunteer-surface-lift"
              />
            </div>

            <DataList
              :items="sortedRegistrations"
              :loading="loading"
              row-key="id"
              :selected-key="selectedRegistrationId"
              interactive
              open-text="查看详情"
              open-style="text"
              empty-title="当前没有已报名活动"
              empty-description="去活动列表挑选合适的任务后，这里会显示你的预约记录。"
              @row-click="openRegistrationDrawer"
            >
              <template #default="{ item }">
                <div class="space-y-3">
                  <div class="flex flex-wrap items-center gap-3">
                    <h3 class="text-lg font-bold text-slate-900">
                      {{ item.title }}
                    </h3>
                    <VolunteerStatusBadge
                      :label="item.userRegistrationStatus === 'registered' ? '已报名' : '未报名'"
                      tone="blue"
                    />
                  </div>
                  <p class="text-sm leading-6 text-slate-600">
                    {{ item.description }}
                  </p>
                  <div class="grid gap-2 text-sm text-slate-500 sm:grid-cols-2 xl:grid-cols-4">
                    <p>时间：{{ item.date }}</p>
                    <p>地点：{{ item.location }}</p>
                    <p>预计服务：{{ item.duration }} 小时</p>
                    <p class="font-semibold text-emerald-700">
                      {{ item.orgName || '所属组织待确认' }}
                    </p>
                  </div>
                </div>
              </template>
            </DataList>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="报名检查清单"
          description="活动开始前逐项确认，可以明显降低迟到和缺席情况。"
          tone="soft"
        >
          <ul class="volunteer-aside-stack">
            <li
              v-for="item in registrationChecklist"
              :key="item.label"
              class="volunteer-surface-lift rounded-[1.25rem] border border-white/80 bg-white/90 px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-slate-900">
                  {{ item.label }}
                </p>
                <span
                  class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  :class="item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ item.done ? '已完成' : '待处理' }}
                </span>
              </div>
              <p class="mt-2 text-xs leading-5 text-slate-500">
                {{ item.detail }}
              </p>
            </li>
          </ul>
        </VolunteerSectionCard>
      </div>
    </template>

    <template #drawer>
      <DetailDrawer
        v-model="drawerOpen"
        width="560px"
        :aria-label="selectedRegistration ? `${selectedRegistration.title} 的报名详情` : '报名详情'"
        @close="closeRegistrationDrawer"
      >
        <template #header>
          <div
            v-if="selectedRegistration"
            class="space-y-3"
          >
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                报名详情
              </p>
              <h2 class="text-lg font-bold tracking-tight text-slate-900">
                {{ selectedRegistration.title }}
              </h2>
              <p class="text-sm text-slate-500">
                {{ selectedRegistration.orgName || '所属组织待确认' }}
              </p>
            </div>

            <VolunteerStatusBadge
              :label="selectedRegistration.userRegistrationStatus === 'registered' ? '已报名' : '未报名'"
              tone="blue"
            />
          </div>
        </template>

        <div
          v-if="selectedRegistration"
          class="space-y-5"
        >
          <section class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  活动时间
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRegistration.date }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  活动地点
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRegistration.location }}
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  预计服务时长
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedRegistration.duration }} 小时
                </p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  活动状态
                </p>
                <p class="mt-1 text-sm font-semibold text-slate-900">
                  {{ registrationStatusText(selectedRegistration.status) }}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              活动说明
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-700">
              {{ selectedRegistration.description }}
            </p>
          </section>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          点击报名记录查看详情和后续提醒。
        </div>

        <template #footer>
          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              v-if="selectedRegistration"
              variant="ghost"
              rounded
              @click="handleViewDetails(selectedRegistration.id)"
            >
              查看完整页面
            </Button>
          </div>
        </template>
      </DetailDrawer>
    </template>
  </DataListPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import DataListPage from '@/components/data-list/DataListPage.vue'
import DataList from '@/components/data-list/DataList.vue'
import DetailDrawer from '@/components/data-list/DetailDrawer.vue'
import Button from '@/components/ui/Button.vue'
import { RouterLink, useRouter } from 'vue-router'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge.vue'
import VolunteerSummaryCard from '@/components/volunteer/VolunteerSummaryCard.vue'
import { activitiesApi, mapRegisteredActivityItemToVolunteerView } from '@/api/activities'
import { useMessageStore } from '@/store/modules/messages'
import type { VolunteerActivityViewItem } from '@/types/activity'

const router = useRouter()
const messageStore = useMessageStore()
const loading = ref(false)
const registeredActivities = ref<VolunteerActivityViewItem[]>([])
const selectedRegistrationId = ref<number | null>(null)
const selectedRegistrationSnapshot = ref<VolunteerActivityViewItem | null>(null)
const drawerOpen = ref(false)

const loadRegisteredActivities = async () => {
  loading.value = true

  try {
    const response = await activitiesApi.listRegisteredActivities({
      page: 1,
      pageSize: 100
    })

    if (response.code !== 200) {
      throw new Error(response.msg || '获取我的报名失败')
    }

    registeredActivities.value = response.data.list
      .map(mapRegisteredActivityItemToVolunteerView)
      .filter(item => item.userRegistrationStatus === 'registered')
  } catch (error: any) {
    console.error('加载我的报名失败:', error)
    messageStore.error(error.message || '加载我的报名失败，请稍后重试')
    registeredActivities.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadRegisteredActivities()
})

const sortedRegistrations = computed<VolunteerActivityViewItem[]>(() => {
  return [...registeredActivities.value].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
})

const selectedRegistration = computed(() => {
  if (selectedRegistrationId.value === null) {
    return null
  }

  return sortedRegistrations.value.find((item) => item.id === selectedRegistrationId.value) ?? selectedRegistrationSnapshot.value
})

const soonCount = computed(() => sortedRegistrations.value.slice(0, 2).length)
const averageDuration = computed(() => {
  if (!registeredActivities.value.length) return 0
  const totalDuration = registeredActivities.value.reduce((sum, item) => sum + item.duration, 0)
  return Number((totalDuration / registeredActivities.value.length).toFixed(1))
})

const headerMeta = computed(() => [
  { label: '已报名', value: `${registeredActivities.value.length} 场`, detail: '保持到场率' },
  { label: '近期优先', value: `${soonCount.value} 场`, detail: '建议提前确认路线' }
])

const registrationChecklist = [
  { label: '确认签到时间', detail: '建议活动开始前 20 分钟到场，预留物资领取时间。', done: true },
  { label: '查看路线与交通', detail: '高峰时段活动建议提前规划到场路线。', done: false },
  { label: '准备个人物资', detail: '水杯、手套、帽子和雨具会提升现场协作效率。', done: false }
]

const syncSelectedRegistration = () => {
  if (selectedRegistrationId.value === null) {
    return
  }

  const refreshedActivity = registeredActivities.value.find((item) => item.id === selectedRegistrationId.value)
  if (refreshedActivity) {
    selectedRegistrationSnapshot.value = refreshedActivity
  }
}

const openRegistrationDrawer = (activity: Record<string, any>, _index: number) => {
  const registration = activity as VolunteerActivityViewItem

  selectedRegistrationId.value = registration.id
  selectedRegistrationSnapshot.value = registration
  drawerOpen.value = true
}

const closeRegistrationDrawer = () => {
  drawerOpen.value = false
  selectedRegistrationId.value = null
  selectedRegistrationSnapshot.value = null
}

const registrationStatusText = (status: VolunteerActivityViewItem['status']) => ({
  upcoming: '待参加',
  registered: '已报名',
  completed: '已完成'
}[status] || status)

const handleViewDetails = async (id: number) => {
  await router.push(`/volunteer/activities/${id}`)
}

watch(registeredActivities, () => {
  syncSelectedRegistration()
})
</script>
