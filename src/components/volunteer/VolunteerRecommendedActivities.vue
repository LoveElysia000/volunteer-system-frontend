<template>
  <DataList
    :items="recommendedActivities"
    :loading="loading"
    row-key="id"
    open-text="查看详情"
    empty-title="当前没有推荐活动"
    empty-description="系统会根据你的近期参与偏好继续推荐合适任务。"
  >
    <template #default="{ item }">
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
          <VolunteerStatusBadge
            :label="item.tag"
            tone="green"
          />
          <span
            v-if="item.orgName"
            class="text-sm font-semibold text-emerald-700"
          >
            {{ item.orgName }}
          </span>
        </div>

        <div>
          <h3 class="text-lg font-bold tracking-tight text-slate-900">
            {{ item.title }}
          </h3>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            {{ item.description }}
          </p>
        </div>

        <div class="flex flex-wrap gap-4 text-sm text-slate-500">
          <span>{{ item.date }}</span>
          <span>{{ item.location }}</span>
          <span>{{ item.participants }}/{{ item.capacity }} 名额</span>
        </div>
      </div>
    </template>

    <template #actions="{ item }">
      <RouterLink
        :to="`/volunteer/activities?id=${item.id}`"
        class="volunteer-toolbar-button volunteer-toolbar-button--soft"
      >
        去查看详情
      </RouterLink>
    </template>
  </DataList>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import DataList from '@/components/data-list/DataList.vue'
import { activitiesApi } from '@/api/activities'
import { shouldRefreshOnKeepAliveActivated } from '@/utils/keepAliveRefresh'
import VolunteerStatusBadge from './VolunteerStatusBadge.vue'
import { buildVolunteerRecommendedActivities, type VolunteerRecommendedCardItem } from '@/views/Volunteer/dashboardFeeds'
import { getVolunteerRecommendedActivitiesRequest } from '@/views/Volunteer/dashboardState'

const route = useRoute()
const hasLoadedOnce = ref(false)
const hasActivatedOnce = ref(false)
const loading = ref(false)
const recommendedActivities = ref<VolunteerRecommendedCardItem[]>([])

const loadRecommendedActivities = async () => {
  loading.value = true
  try {
    const response = await activitiesApi.list(getVolunteerRecommendedActivitiesRequest())

    if (response.code !== 200) {
      throw new Error(response.msg || '获取推荐活动失败')
    }

    recommendedActivities.value = buildVolunteerRecommendedActivities(response.data.list || [])
  } catch (error) {
    console.error('加载推荐活动失败:', error)
    recommendedActivities.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadRecommendedActivities()
  hasLoadedOnce.value = true
})

onActivated(async () => {
  if (shouldRefreshOnKeepAliveActivated({
    currentRouteName: String(route.name || ''),
    expectedRouteName: 'volunteer-dashboard',
    hasLoadedOnce: hasLoadedOnce.value,
    hasActivatedOnce: hasActivatedOnce.value
  })) {
    await loadRecommendedActivities()
  }

  hasActivatedOnce.value = true
})
</script>
