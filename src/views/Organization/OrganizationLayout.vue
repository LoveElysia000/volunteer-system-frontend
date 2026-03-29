<template>
  <div class="org-shell">
    <div class="org-shell-main flex h-screen">
      <aside
        v-if="!isMobile"
        class="org-nav-surface shrink-0 overflow-y-auto"
        :class="'org-nav-surface--expanded'"
        :style="desktopSidebarStyle"
      >
        <div class="flex min-h-full flex-col gap-6 px-5 py-6">
          <div class="org-shell-panel rounded-[1.9rem] border border-[#ffd9c4] bg-[linear-gradient(135deg,rgba(236,91,19,0.10),rgba(255,255,255,0.96))] p-5">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ec5b13] to-[#c9470c] text-white shadow-lg">
                <Building2Icon class="h-6 w-6" />
              </div>
              <div>
                <p class="text-lg font-black tracking-tight text-slate-900">
                  组织管理中心
                </p>
                <p class="mt-1 text-[11px] font-medium tracking-[0.24em] text-[#ec5b13]">
                  Organization Hub
                </p>
              </div>
            </div>
          </div>

          <div class="org-shell-panel p-5">
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f08b53] to-[#ec5b13] text-xl font-black text-white">
                {{ userInitials }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-base font-bold text-slate-900">
                  {{ user?.realName || '组织管理者' }}
                </p>
                <p class="text-sm text-slate-500">
                  组织管理员
                </p>
                <p class="mt-0.5 text-[11px] font-medium tracking-[0.18em] text-slate-400">
                  Organization Admin
                </p>
                <div class="mt-3 flex items-center gap-3">
                  <div class="h-2 flex-1 rounded-full bg-[#ffe7d8]">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-[#ec5b13] to-[#f08b53]"
                      :style="{ width: '86%' }"
                    />
                  </div>
                  <span class="text-xs font-semibold text-slate-500">已认证</span>
                </div>
              </div>
            </div>
          </div>

          <OrganizationSidebar
            :enable-compact="false"
          />

          <div class="mt-auto org-shell-panel p-4">
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
        v-if="!isMobile"
        class="organization-resize-handle"
        aria-label="调整组织导航宽度"
        aria-orientation="vertical"
        :aria-valuemax="ORGANIZATION_SIDEBAR.maxWidth"
        :aria-valuemin="ORGANIZATION_SIDEBAR.minWidth"
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
        <div
          v-if="isMobile"
          class="border-b border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(249,250,251,0.82))] px-4 py-3 backdrop-blur"
        >
          <div class="flex items-center justify-between">
            <button
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600"
              @click="isMobileSidebarOpen = true"
            >
              <MenuIcon class="h-5 w-5" />
              <span class="text-sm font-semibold">菜单</span>
            </button>
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f08b53] to-[#ec5b13] font-bold text-white">
                {{ userInitials }}
              </div>
              <p class="text-sm font-semibold text-slate-700">
                {{ currentPage.title }}
              </p>
            </div>
          </div>
        </div>

        <main class="min-w-0 flex-1 overflow-y-auto">
          <div class="org-content-grid">
            <section class="org-context-strip">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  组织工作台
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
                  <span class="hidden h-1.5 w-1.5 rounded-full bg-[#ec5b13]/60 sm:block" />
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
                  to="/organization/activities/create"
                  class="org-toolbar-button org-toolbar-button--soft"
                >
                  新建活动
                </RouterLink>
              </div>
            </section>

            <router-view v-slot="{ Component }">
              <transition
                mode="out-in"
                name="organization-page-fade"
              >
                <keep-alive :include="cachedComponents">
                  <component
                    :is="Component"
                    class="organization-page-stage"
                  />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </main>
      </div>
    </div>

    <transition name="organization-mobile-drawer">
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm"
        @click="isMobileSidebarOpen = false"
      />
    </transition>

    <transition name="organization-mobile-drawer">
      <aside
        v-if="isMobileSidebarOpen"
        class="organization-mobile-drawer-panel fixed inset-y-0 left-0 z-50 max-w-[85vw] overflow-y-auto bg-white/95 px-5 py-6 backdrop-blur"
        :style="mobileSidebarStyle"
      >
        <div class="flex min-h-full flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ec5b13] to-[#c9470c] text-white">
                <Building2Icon class="h-5 w-5" />
              </div>
              <div>
                <p class="text-base font-black text-slate-900">
                  组织管理中心
                </p>
                <p class="mt-1 text-[11px] tracking-[0.2em] text-[#ec5b13]">
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

          <div class="org-shell-panel p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f08b53] to-[#ec5b13] text-lg font-bold text-white">
                {{ userInitials }}
              </div>
              <div>
                <p class="font-bold text-slate-900">
                  {{ user?.realName || '组织管理者' }}
                </p>
                <p class="text-sm text-slate-500">
                  组织管理员
                </p>
                <p class="mt-0.5 text-[11px] font-medium tracking-[0.18em] text-slate-400">
                  Organization Admin
                </p>
              </div>
            </div>
          </div>

          <OrganizationSidebar @close="isMobileSidebarOpen = false" />

          <button
            class="mt-auto flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
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
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { Building2Icon, LogOutIcon, MenuIcon, XIcon } from 'lucide-vue-next'
import OrganizationSidebar from '@/components/organization/OrganizationSidebar.vue'
import { useResponsiveWorkbench } from '@/composables/useResponsiveWorkbench'
import { ORGANIZATION_SIDEBAR } from '@/constants/workbench'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isMobileSidebarOpen = ref(false)
const { isMobile } = useResponsiveWorkbench()

const getInitialSidebarWidth = () => {
  if (typeof window === 'undefined') return ORGANIZATION_SIDEBAR.defaultWidth
  const raw = window.localStorage.getItem(ORGANIZATION_SIDEBAR.storageKey)
  const value = Number(raw)
  if (!Number.isFinite(value)) return ORGANIZATION_SIDEBAR.defaultWidth
  return Math.min(ORGANIZATION_SIDEBAR.maxWidth, Math.max(ORGANIZATION_SIDEBAR.minWidth, value))
}

const sidebarWidth = ref(getInitialSidebarWidth())
const isResizingSidebar = ref(false)
let dragStartX = 0
let dragStartWidth = sidebarWidth.value

const desktopSidebarStyle = computed<Record<string, string>>(() => ({
  '--organization-sidebar-width': `${sidebarWidth.value}px`
}))

const mobileSidebarStyle = computed<Record<string, string>>(() => ({
  width: `${ORGANIZATION_SIDEBAR.mobileDrawerWidth}px`
}))

const clampSidebarWidth = (value: number) => Math.min(ORGANIZATION_SIDEBAR.maxWidth, Math.max(ORGANIZATION_SIDEBAR.minWidth, value))

const persistSidebarWidth = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ORGANIZATION_SIDEBAR.storageKey, String(sidebarWidth.value))
  } catch (error) {
    console.warn('无法持久化组织侧栏宽度', error)
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
  document.body.classList.remove('organization-resizing-sidebar')
  persistSidebarWidth()
}

const startSidebarResize = (event: MouseEvent) => {
  if (event.button !== 0) return
  isResizingSidebar.value = true
  dragStartX = event.clientX
  dragStartWidth = sidebarWidth.value
  document.body.classList.add('organization-resizing-sidebar')
  window.addEventListener('mousemove', onSidebarResize)
  window.addEventListener('mouseup', stopSidebarResize)
  event.preventDefault()
}

const resetSidebarWidth = () => {
  sidebarWidth.value = ORGANIZATION_SIDEBAR.defaultWidth
  persistSidebarWidth()
}

const resizeSidebarBy = (delta: number) => {
  sidebarWidth.value = clampSidebarWidth(sidebarWidth.value + delta)
  persistSidebarWidth()
}

const shrinkSidebar = () => {
  resizeSidebarBy(-ORGANIZATION_SIDEBAR.keyboardStep)
}

const expandSidebar = () => {
  resizeSidebarBy(ORGANIZATION_SIDEBAR.keyboardStep)
}

const setSidebarToMin = () => {
  sidebarWidth.value = ORGANIZATION_SIDEBAR.minWidth
  persistSidebarWidth()
}

const setSidebarToMax = () => {
  sidebarWidth.value = ORGANIZATION_SIDEBAR.maxWidth
  persistSidebarWidth()
}

const cachedComponents = [
  'Dashboard',
  'ActivityManagement',
  'VolunteerManagement',
  'Statistics'
]

const pageDescriptions: Record<string, string> = {
  'organization-dashboard': '查看组织关键指标、核心任务优先级和高表现项目进展。',
  'organization-info': '管理组织资质、简介和对外展示信息，保障资料完整可信。',
  'organization-activities': '统一管理活动创建、执行和复盘，提升项目运营效率。',
  'organization-volunteers': '维护志愿者档案、活跃度状态与参与表现。',
  'organization-statistics': '从活动、志愿者与财务维度洞察整体运营表现。',
  'organization-notifications': '集中处理平台消息、审核提醒和系统通知。',
  'organization-members': '维护组织成员身份、分工与协作权限。',
  'organization-activities-create': '创建新活动并配置流程、地点与参与要求。',
  'organization-activities-review': '审核活动申请与关键节点，降低运营风险。',
  'organization-statistics-activities': '查看活动维度报表，评估执行质量与投入产出。',
  'organization-statistics-volunteers': '查看志愿者结构、活跃人群和增长状态。',
  'organization-statistics-financial': '查看工时发放、作废和重算流水，处理异常记录。',
  'organization-assistant': '使用 AI 助手生成活动草案、整理运营内容并查看对话历史。'
}

const pageCaptions: Record<string, string> = {
  'organization-dashboard': 'Organization Overview',
  'organization-info': 'Organization Profile',
  'organization-activities': 'Activity Operations',
  'organization-volunteers': 'Volunteer Operations',
  'organization-statistics': 'Data Reports',
  'organization-notifications': 'Notification Center',
  'organization-members': 'Member Management',
  'organization-activities-create': 'Create Activity',
  'organization-activities-review': 'Activity Review',
  'organization-statistics-activities': 'Activity Analytics',
  'organization-statistics-volunteers': 'Volunteer Reports',
  'organization-statistics-financial': 'Work Hour Logs',
  'organization-assistant': 'AI Assistant'
}

const currentPage = computed(() => {
  const routeName = String(route.name || 'organization-dashboard')
  return {
    title: String(route.meta.title || '组织管理中心'),
    caption: pageCaptions[routeName] || 'Organization Center',
    description: pageDescriptions[routeName] || '统一管理组织运营、成员协作和关键决策信息。'
  }
})

const userInitials = computed(() => (user.value?.realName || '组织管理者').charAt(0))

const headerMeta = computed(() => [
  { label: '当前身份', value: '组织管理员' },
  {
    label: '今日日期',
    value: new Date().toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    })
  }
])

const handleLogout = async () => {
  await authStore.logout()
  router.replace('/')
  isMobileSidebarOpen.value = false
}

onBeforeUnmount(() => {
  stopSidebarResize()
})

watch(isMobile, (value) => {
  if (!value) {
    isMobileSidebarOpen.value = false
  }
})
</script>
