<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        活动管理
      </h1>
      <router-link
        to="/organization/activities/create"
        class="btn btn-primary"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        创建活动
      </router-link>
    </div>

    <!-- 活动列表 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            活动列表
          </h2>
          <div class="flex space-x-2">
            <input
              v-model="search"
              type="text"
              class="input input-sm"
              placeholder="搜索活动..."
            >
            <select
              v-model="filter"
              class="select select-sm"
            >
              <option value="all">
                全部状态
              </option>
              <option value="进行中">
                进行中
              </option>
              <option value="已结束">
                已结束
              </option>
              <option value="待审核">
                待审核
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="divide-y divide-gray-200">
        <!-- 活动项 -->
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="p-6 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarIcon class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">
                  {{ activity.title }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ activity.date }} | {{ activity.location }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="`px-2 py-1 rounded-full text-xs font-medium ${activity.statusClass}`">
                {{ activity.status }}
              </span>
              <button class="btn btn-sm btn-outline">
                编辑
              </button>
              <button class="btn btn-sm btn-outline">
                查看详情
              </button>
            </div>
          </div>
          <div class="mt-3 flex items-center text-sm text-gray-500">
            <UsersIcon class="h-4 w-4 mr-1" />
            <span class="mr-4">{{ activity.participants }} 人报名</span>
            <ClockIcon class="h-4 w-4 mr-1" />
            <span>{{ activity.duration }} 小时</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageStateStore } from '@/store/modules/pageState'
import { CalendarIcon, UsersIcon, ClockIcon, PlusIcon } from 'lucide-vue-next'

// 路由和状态管理
const route = useRoute()
const router = useRouter()
const pageStateStore = usePageStateStore()

// 使用store中的状态
const filter = ref(pageStateStore.state.organizationActivities.filter)
const search = ref(pageStateStore.state.organizationActivities.search)

const activities = ref([
  {
    id: 1,
    title: '城市公园清洁活动',
    date: '2026-01-20',
    location: '中央公园',
    status: '进行中',
    statusClass: 'bg-green-100 text-green-800',
    participants: 25,
    duration: 3
  },
  {
    id: 2,
    title: '环保知识讲座',
    date: '2026-01-25',
    location: '社区中心',
    status: '待审核',
    statusClass: 'bg-yellow-100 text-yellow-800',
    participants: 15,
    duration: 2
  },
  {
    id: 3,
    title: '河流清理志愿者活动',
    date: '2026-01-15',
    location: '城市河岸',
    status: '已结束',
    statusClass: 'bg-gray-100 text-gray-800',
    participants: 32,
    duration: 4
  }
])

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  // 从路由参数恢复状态
  if (newQuery.filter) {
    filter.value = newQuery.filter as string
    pageStateStore.updateOrganizationActivitiesState({ filter: newQuery.filter as string })
  }
  if (newQuery.search) {
    search.value = newQuery.search as string
    pageStateStore.updateOrganizationActivitiesState({ search: newQuery.search as string })
  }
  // 重新加载数据
  loadActivities()
}, { immediate: true })

// 监听状态变化，同步到路由和store
watch([filter, search], ([newFilter, newSearch]) => {
  const query: any = {}
  if (newFilter && newFilter !== 'all') query.filter = newFilter
  if (newSearch) query.search = newSearch

  // 更新路由参数
  router.replace({ query })

  // 更新store状态
  pageStateStore.updateOrganizationActivitiesState({
    filter: newFilter,
    search: newSearch
  })
})

// 数据加载函数
const loadActivities = async () => {
  console.log('加载组织活动数据:', {
    filter: filter.value,
    search: search.value
  })
  // 这里可以调用API进行数据加载
  // 目前使用模拟数据
}

// 组件激活时恢复状态
onActivated(() => {
  console.log('组织活动管理页面激活，恢复状态')
  loadActivities()
})

// 过滤活动列表
const filteredActivities = computed(() => {
  let filtered = activities.value

  // 按状态过滤
  if (filter.value !== 'all') {
    filtered = filtered.filter(activity => activity.status === filter.value)
  }

  // 按搜索查询过滤
  if (search.value) {
    const query = search.value.toLowerCase()
    filtered = filtered.filter(activity =>
      activity.title.toLowerCase().includes(query) ||
      activity.location.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 组件挂载时加载数据
onMounted(() => {
  console.log('组织活动管理页面挂载')
  loadActivities()
})
</script>