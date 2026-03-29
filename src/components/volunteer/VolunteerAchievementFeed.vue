<template>
  <div class="space-y-4">
    <div
      v-for="item in achievementFeed"
      :key="item.id"
      class="flex items-start gap-4 rounded-[1.4rem] border border-slate-100 bg-slate-50/80 p-4"
    >
      <div
        class="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl"
        :class="avatarClass(item.tone)"
      >
        {{ item.title.slice(0, 1) }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-bold leading-6 text-slate-900">
          {{ item.title }}
        </p>
        <p class="mt-1 text-sm leading-6 text-slate-700">
          {{ item.content }}
        </p>
        <p class="mt-2 text-xs text-slate-500">
          {{ formatContext(item.context) }}
        </p>
      </div>
      <VolunteerStatusBadge
        :label="badgeText(item.tone)"
        :tone="item.tone"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { notificationApi } from '@/api/notifications'
import { shouldRefreshOnKeepAliveActivated } from '@/utils/keepAliveRefresh'
import VolunteerStatusBadge from './VolunteerStatusBadge.vue'
import { type VolunteerFeedTone, buildVolunteerAchievementFeed, type VolunteerAchievementFeedItem } from '@/views/Volunteer/dashboardFeeds'
import { getVolunteerAchievementFeedRequest } from '@/views/Volunteer/dashboardState'

const route = useRoute()
const hasLoadedOnce = ref(false)
const hasActivatedOnce = ref(false)
const achievementFeed = ref<VolunteerAchievementFeedItem[]>([])

const avatarClass = (tone: VolunteerFeedTone) => ({
  green: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-sky-100 text-sky-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-200 text-slate-700',
  rose: 'bg-rose-100 text-rose-700'
}[tone])

const badgeText = (tone: VolunteerFeedTone) => ({
  green: '已完成',
  blue: '团队动态',
  amber: '新任务',
  slate: '提醒',
  rose: '关注'
}[tone])

const formatContext = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadAchievementFeed = async () => {
  try {
    const response = await notificationApi.getNotifications(getVolunteerAchievementFeedRequest())

    if (response.code !== 200) {
      throw new Error(response.msg || '获取近期动态失败')
    }

    achievementFeed.value = buildVolunteerAchievementFeed(response.data.list || [])
  } catch (error) {
    console.error('加载近期成就动态失败:', error)
    achievementFeed.value = []
  }
}

onMounted(async () => {
  await loadAchievementFeed()
  hasLoadedOnce.value = true
})

onActivated(async () => {
  if (shouldRefreshOnKeepAliveActivated({
    currentRouteName: String(route.name || ''),
    expectedRouteName: 'volunteer-dashboard',
    hasLoadedOnce: hasLoadedOnce.value,
    hasActivatedOnce: hasActivatedOnce.value
  })) {
    await loadAchievementFeed()
  }

  hasActivatedOnce.value = true
})
</script>
