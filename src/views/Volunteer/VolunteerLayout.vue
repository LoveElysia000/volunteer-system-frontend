<template>
  <div class="volunteer-shell">
    <div class="volunteer-shell-main flex h-screen">
      <aside
        class="volunteer-nav-surface hidden shrink-0 overflow-y-auto xl:block"
        :style="desktopSidebarStyle"
      >
        <div class="flex min-h-full flex-col gap-6 px-5 py-6">
          <div class="volunteer-shell-panel rounded-[1.9rem] border border-emerald-100/80 bg-[linear-gradient(135deg,_rgba(16,185,129,0.10),_rgba(255,255,255,0.96))] p-5">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg">
                <LeafIcon class="h-6 w-6" />
              </div>
              <div>
                <p class="text-lg font-black tracking-tight text-slate-900">
                  环保志愿者
                </p>
                <p class="mt-1 text-[11px] font-medium uppercase tracking-[0.24em] text-emerald-700">
                  Volunteer Center
                </p>
              </div>
            </div>
          </div>

          <div class="volunteer-shell-panel p-5">
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-xl font-black text-white">
                {{ userInitials }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-base font-bold text-slate-900">
                  {{ user?.realName || '志愿者' }}
                </p>
                <p class="text-sm text-slate-500">
                  志愿者工作台在线
                </p>
                <p class="mt-0.5 text-[11px] font-medium tracking-[0.18em] text-slate-400">
                  Volunteer Workbench
                </p>
                <div class="mt-3 flex items-center gap-3">
                  <div class="h-2 flex-1 rounded-full bg-emerald-100">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700"
                      :style="{ width: `${levelProgressPercentage}%` }"
                    />
                  </div>
                  <span class="text-xs font-semibold text-slate-500">Lv.{{ volunteerLevel }}</span>
                </div>
              </div>
            </div>
          </div>

          <VolunteerSidebar
            :sidebar-width="sidebarWidth"
            :enable-compact="true"
          />

          <div class="mt-auto volunteer-shell-panel p-4">
            <button
              class="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              @click="handleLogout"
            >
              <LogOutIcon class="h-4 w-4" />
              退出登录
            </button>
          </div>
        </div>
      </aside>
      <div
        class="volunteer-resize-handle hidden xl:flex"
        aria-label="调整导航宽度"
        aria-orientation="vertical"
        aria-valuemax="420"
        aria-valuemin="256"
        :aria-valuenow="sidebarWidth"
        role="separator"
        tabindex="0"
        @keydown.left.prevent="shrinkSidebar"
        @keydown.right.prevent="expandSidebar"
        @keydown.home.prevent="setSidebarToMin"
        @keydown.end.prevent="setSidebarToMax"
        @mousedown="startSidebarResize"
        @dblclick="resetSidebarWidth"
      />

      <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div class="border-b border-white/70 bg-white/75 px-4 py-3 backdrop-blur xl:hidden">
          <div class="flex items-center justify-between">
            <button
              class="rounded-full border border-slate-200 bg-white p-2 text-slate-600"
              @click="isMobileSidebarOpen = true"
            >
              <MenuIcon class="h-5 w-5" />
            </button>
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 font-bold text-white">
                {{ userInitials }}
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-700">
                  {{ currentPage.title }}
                </p>
                <p class="text-[11px] font-medium tracking-[0.18em] text-slate-400">
                  Volunteer Center
                </p>
              </div>
            </div>
          </div>
        </div>

        <main class="min-w-0 flex-1 overflow-y-auto">
          <div class="volunteer-content-grid">
            <section class="volunteer-context-strip">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  志愿者中心
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-2.5">
                  <div class="space-y-1">
                    <h2 class="text-lg font-black tracking-tight text-slate-900 lg:text-[1.35rem]">
                      {{ currentPage.title }}
                    </h2>
                    <p class="text-[11px] font-medium tracking-[0.18em] text-slate-400">
                      {{ currentPage.caption }}
                    </p>
                  </div>
                  <span class="hidden h-1.5 w-1.5 rounded-full bg-emerald-500/60 sm:block" />
                  <p class="max-w-2xl text-sm text-slate-500">
                    {{ currentPage.description }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2.5">
                <div
                  v-for="item in headerMeta"
                  :key="item.label"
                  class="rounded-full border border-white/80 bg-white/92 px-3 py-2 text-xs text-slate-500 shadow-[0_10px_22px_-20px_rgba(15,23,42,0.18)]"
                >
                  <span class="font-semibold text-slate-700">{{ item.label }}</span>
                  <span class="mx-1 text-slate-300">/</span>
                  <span>{{ item.value }}</span>
                </div>
                <RouterLink
                  to="/volunteer/activities"
                  class="volunteer-toolbar-button volunteer-toolbar-button--soft"
                >
                  查看活动
                </RouterLink>
              </div>
            </section>

            <router-view v-slot="{ Component }">
              <transition
                mode="out-in"
                name="volunteer-page-fade"
              >
                <keep-alive :include="cachedComponents">
                  <component
                    :is="Component"
                    class="volunteer-page-stage"
                  />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </main>
      </div>
    </div>

    <transition name="volunteer-mobile-drawer">
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm xl:hidden"
        @click="isMobileSidebarOpen = false"
      />
    </transition>

    <transition name="volunteer-mobile-drawer">
      <aside
        v-if="isMobileSidebarOpen"
        class="volunteer-mobile-drawer-panel fixed inset-y-0 left-0 z-50 w-[302px] max-w-[85vw] overflow-y-auto bg-white/95 px-5 py-6 backdrop-blur xl:hidden"
      >
        <div class="flex min-h-full flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                <LeafIcon class="h-5 w-5" />
              </div>
              <div>
                <p class="text-base font-black text-slate-900">
                  志愿者中心
                </p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.2em] text-emerald-700">
                  Mobile Workbench
                </p>
              </div>
            </div>
            <button
              class="rounded-full border border-slate-200 bg-white p-2 text-slate-600"
              @click="isMobileSidebarOpen = false"
            >
              <XIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="volunteer-shell-panel p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-lg font-bold text-white">
                {{ userInitials }}
              </div>
              <div>
                <p class="font-bold text-slate-900">
                  {{ user?.realName || '志愿者' }}
                </p>
                <p class="text-sm text-slate-500">
                  Lv.{{ volunteerLevel }} 志愿者
                </p>
                <p class="mt-0.5 text-[11px] font-medium tracking-[0.18em] text-slate-400">
                  Volunteer Profile
                </p>
              </div>
            </div>
          </div>

          <VolunteerSidebar
            :sidebar-width="302"
            :enable-compact="false"
            @close="isMobileSidebarOpen = false"
          />

          <button
            class="mt-auto flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            @click="handleLogout"
          >
            <LogOutIcon class="h-4 w-4" />
            退出登录
          </button>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { useVolunteerStore } from '@/store/modules/volunteer'
import { useVolunteerMetrics } from '@/composables/useVolunteerMetrics'
import { LeafIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-vue-next'
import VolunteerSidebar from '@/components/volunteer/VolunteerSidebar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const volunteerStore = useVolunteerStore()
const { user, points, volunteerLevel, levelProgressPercentage } = useVolunteerMetrics()
const isMobileSidebarOpen = ref(false)
const SIDEBAR_STORAGE_KEY = 'volunteer_center_sidebar_width'
const SIDEBAR_DEFAULT_WIDTH = 296
const SIDEBAR_MIN_WIDTH = 256
const SIDEBAR_MAX_WIDTH = 420
const SIDEBAR_KEYBOARD_STEP = 16

const getInitialSidebarWidth = () => {
  if (typeof window === 'undefined') return SIDEBAR_DEFAULT_WIDTH
  const raw = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
  const value = Number(raw)
  if (!Number.isFinite(value)) return SIDEBAR_DEFAULT_WIDTH
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, value))
}

const sidebarWidth = ref(getInitialSidebarWidth())
const isResizingSidebar = ref(false)
let dragStartX = 0
let dragStartWidth = sidebarWidth.value

const desktopSidebarStyle = computed(() => ({
  width: `${sidebarWidth.value}px`
}))

const clampSidebarWidth = (value: number) => Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, value))

const persistSidebarWidth = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarWidth.value))
  } catch (error) {
    console.warn('无法持久化侧栏宽度', error)
  }
}

const onSidebarResize = (event: MouseEvent) => {
  if (!isResizingSidebar.value) return
  const deltaX = event.clientX - dragStartX
  sidebarWidth.value = clampSidebarWidth(dragStartWidth + deltaX)
}

const stopSidebarResize = () => {
  if (!isResizingSidebar.value) return
  isResizingSidebar.value = false
  window.removeEventListener('mousemove', onSidebarResize)
  window.removeEventListener('mouseup', stopSidebarResize)
  document.body.classList.remove('volunteer-resizing-sidebar')
  persistSidebarWidth()
}

const startSidebarResize = (event: MouseEvent) => {
  if (event.button !== 0) return
  isResizingSidebar.value = true
  dragStartX = event.clientX
  dragStartWidth = sidebarWidth.value
  document.body.classList.add('volunteer-resizing-sidebar')
  window.addEventListener('mousemove', onSidebarResize)
  window.addEventListener('mouseup', stopSidebarResize)
  event.preventDefault()
}

const resetSidebarWidth = () => {
  sidebarWidth.value = SIDEBAR_DEFAULT_WIDTH
  persistSidebarWidth()
}

const resizeSidebarBy = (delta: number) => {
  sidebarWidth.value = clampSidebarWidth(sidebarWidth.value + delta)
  persistSidebarWidth()
}

const shrinkSidebar = () => {
  resizeSidebarBy(-SIDEBAR_KEYBOARD_STEP)
}

const expandSidebar = () => {
  resizeSidebarBy(SIDEBAR_KEYBOARD_STEP)
}

const setSidebarToMin = () => {
  sidebarWidth.value = SIDEBAR_MIN_WIDTH
  persistSidebarWidth()
}

const setSidebarToMax = () => {
  sidebarWidth.value = SIDEBAR_MAX_WIDTH
  persistSidebarWidth()
}

const cachedComponents = [
  'VolunteerActivities',
  'VolunteerMyRegistrations'
]

const pageDescriptions: Record<string, string> = {
  'volunteer-dashboard': '总览你的服务状态、成长进度和本周待完成任务。',
  'volunteer-activities': '浏览推荐项目、管理报名状态，并快速筛选适合你的环保活动。',
  'volunteer-activity-detail': '查看单个活动的时间、地点、报名状态和服务信息。',
  'volunteer-my-registrations': '查看已经预约的活动，关注时间、地点和行前提醒。',
  'volunteer-organizations': '查看你已加入的组织，并直接完成加入申请或退出操作。',
  'volunteer-profile': '维护个人资料、服务偏好和志愿者展示信息。',
}

const pageCaptions: Record<string, string> = {
  'volunteer-dashboard': 'Volunteer Dashboard',
  'volunteer-activities': 'Activity Explorer',
  'volunteer-activity-detail': 'Activity Detail',
  'volunteer-my-registrations': 'My Registrations',
  'volunteer-organizations': 'Organization Network',
  'volunteer-profile': 'Volunteer Profile'
}

const currentPage = computed(() => {
  const routeName = String(route.name || 'volunteer-dashboard')
  return {
    title: String(route.meta.title || '志愿者中心'),
    caption: pageCaptions[routeName] || 'Volunteer Center',
    description: pageDescriptions[routeName] || '统一管理你的志愿者任务、记录和成长信息。'
  }
})

const userInitials = computed(() => (user.value?.realName || '志愿者').charAt(0))

const headerMeta = computed(() => [
  { label: '当前身份', value: '环保志愿者', detail: '已登录工作台' },
  { label: '成长等级', value: `Lv.${volunteerLevel.value}`, detail: `${points.value} 当前积分` }
])
const shouldPrefetchRegisteredActivities = computed(() => {
  const routeName = String(route.name || '')
  return routeName === 'volunteer-dashboard'
})

const handleLogout = async () => {
  await authStore.logout()
  router.replace('/')
  isMobileSidebarOpen.value = false
}

onMounted(async () => {
  if (!user.value?.accountId) return

  try {
    await Promise.all([
      volunteerStore.fetchHomeSummary(),
      volunteerStore.fetchMyProfile(),
      ...(shouldPrefetchRegisteredActivities.value
        ? [volunteerStore.fetchRegisteredActivities()]
        : [])
    ])
  } catch (error) {
    console.error('加载志愿者工作台数据失败:', error)
  }
})

onBeforeUnmount(() => {
  stopSidebarResize()
})
</script>
