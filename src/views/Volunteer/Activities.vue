<template>
  <div class="space-y-8">
    <!-- 页面标题和筛选 -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            活动管理
          </h1>
          <p class="mt-2 text-lg text-gray-600">
            管理您参与和关注的环保活动
          </p>
        </div>

        <!-- 筛选和搜索 -->
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            v-model="activeTab"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">
              所有活动
            </option>
            <option value="upcoming">
              可报名活动
            </option>
            <option value="registered">
              已报名活动
            </option>
            <option value="completed">
              历史活动
            </option>
          </select>

          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索活动..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
            >
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="mt-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in filterTabs"
            :key="tab.id"
            class="py-2 px-1 border-b-2 font-medium text-sm"
            :class="[
              tab.id === activeTab
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
            @click="setActiveTab(tab.id)"
          >
            {{ tab.label }}
            <span
              v-if="tab.badge"
              class="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100"
            >{{ tab.badge }}</span>
          </button>
        </nav>
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="space-y-6">
      <div
        v-for="activity in filteredActivities"
        :key="activity.id"
        class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <!-- 活动图片 -->
          <div class="w-full md:w-32 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
            <CalendarIcon class="h-8 w-8 text-green-600" />
          </div>

          <!-- 活动信息 -->
          <div class="flex-1 space-y-3">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ activity.title }}
                </h3>
                <div class="flex items-center space-x-3">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(activity.status)"
                  >
                    {{ getStatusText(activity.status) }}
                  </span>
                  <span class="text-sm text-gray-500">{{ activity.points }}积分</span>
                </div>
              </div>
              <p class="text-gray-600">
                {{ activity.description }}
              </p>
            </div>

            <!-- 活动详情 -->
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 text-sm">
              <div class="flex items-center gap-2">
                <CalendarIcon class="h-4 w-4 text-gray-400" />
                <span class="text-gray-600">{{ activity.date }}</span>
              </div>
              <div class="flex items-center gap-2">
                <MapPinIcon class="h-4 w-4 text-gray-400" />
                <span class="text-gray-600">{{ activity.location }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UsersIcon class="h-4 w-4 text-gray-400" />
                <span class="text-gray-600">{{ activity.participants }}/{{ activity.capacity }}</span>
              </div>
              <div class="flex items-center gap-2">
                <ClockIcon class="h-4 w-4 text-gray-400" />
                <span class="text-gray-600">{{ activity.duration }}小时</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-col gap-3">
            <button
              v-if="activity.status === 'registered'"
              class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 text-center font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              @click="handleViewDetails(activity.id)"
            >
              查看详情
            </button>
            <button
              v-else-if="activity.status === 'upcoming'"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-center font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              @click="handleRegister(activity.id)"
            >
              立即报名
            </button>
            <button
              v-else-if="activity.status === 'completed'"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-center font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              @click="handleViewDetails(activity.id)"
            >
              查看详情
            </button>

            <div class="flex space-x-2">
              <button
                class="flex-1 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center font-medium text-sm"
                @click="handleShare(activity.id)"
              >
                分享
              </button>
              <button
                v-if="activity.status === 'registered'"
                class="flex-1 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200 text-center font-medium text-sm"
                @click="handleCancel(activity.id)"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="filteredActivities.length === 0"
        class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center"
      >
        <div class="space-y-4">
          <CalendarIcon class="h-12 w-12 text-primary-400 mx-auto" />
          <p class="text-lg text-gray-700 font-medium">
            暂无相关活动
          </p>
          <p class="text-sm text-gray-600">
            当前筛选条件下没有找到匹配的活动
          </p>
          <button
            class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
            @click="clearFilters"
          >
            清除筛选
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageStateStore } from '@/store/modules/pageState'
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  SearchIcon
} from 'lucide-vue-next'

interface Activity {
  id: number
  title: string
  description: string
  date: string
  location: string
  participants: number
  capacity: number
  duration: number
  points: number
  status: 'upcoming' | 'registered' | 'completed'
}

// 路由和状态管理
const route = useRoute()
const router = useRouter()
const pageStateStore = usePageStateStore()

// 使用store中的状态
const activeTab = ref(pageStateStore.state.volunteerActivities.activeTab)
const searchQuery = ref(pageStateStore.state.volunteerActivities.searchQuery)

// 过滤标签页
const filterTabs = [
  { id: 'all', label: '所有活动', badge: '15' },
  { id: 'upcoming', label: '可报名', badge: '8' },
  { id: 'registered', label: '已报名', badge: '3' },
  { id: 'completed', label: '历史活动', badge: '4' }
]

// 模拟数据
const activities = ref<Activity[]>([
  {
    id: 1,
    title: '社区垃圾分类指导活动',
    description: '帮助社区居民正确进行垃圾分类，推广环保理念',
    date: '2024-01-20 09:00',
    location: '朝阳社区中心',
    participants: 15,
    capacity: 30,
    duration: 3,
    points: 30,
    status: 'registered'
  },
  {
    id: 2,
    title: '公园清洁志愿者活动',
    description: '共同维护城市公园的清洁环境，创造美好家园',
    date: '2024-01-22 14:00',
    location: '人民公园',
    participants: 8,
    capacity: 20,
    duration: 2,
    points: 20,
    status: 'upcoming'
  },
  {
    id: 3,
    title: '环保知识宣传讲座',
    description: '向社区居民普及环保知识，提高环保意识',
    date: '2024-01-25 10:00',
    location: '环保教育中心',
    participants: 12,
    capacity: 50,
    duration: 2,
    points: 15,
    status: 'upcoming'
  },
  {
    id: 4,
    title: '植树造林活动',
    description: '参与植树造林，为城市增添绿色，改善生态环境',
    date: '2024-01-15 08:00',
    location: '西山森林公园',
    participants: 30,
    capacity: 30,
    duration: 4,
    points: 40,
    status: 'completed'
  }
])

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  // 从路由参数恢复状态
  if (newQuery.tab) {
    activeTab.value = newQuery.tab as string
    pageStateStore.updateVolunteerActivitiesState({ activeTab: newQuery.tab as string })
  }
  if (newQuery.search) {
    searchQuery.value = newQuery.search as string
    pageStateStore.updateVolunteerActivitiesState({ searchQuery: newQuery.search as string })
  }
  // 重新加载数据
  loadActivities()
}, { immediate: true })

// 监听状态变化，同步到路由和store
watch([activeTab, searchQuery], ([newTab, newSearch]) => {
  const query: any = {}
  if (newTab && newTab !== 'all') query.tab = newTab
  if (newSearch) query.search = newSearch

  // 更新路由参数
  router.replace({ query })

  // 更新store状态
  pageStateStore.updateVolunteerActivitiesState({
    activeTab: newTab,
    searchQuery: newSearch
  })
})

// 过滤活动列表
const filteredActivities = computed(() => {
  let filtered = activities.value

  // 按标签过滤
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(activity => activity.status === activeTab.value)
  }

  // 按搜索查询过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(activity =>
      activity.title.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      activity.location.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 设置活动标签
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
}

// 数据加载函数
const loadActivities = async () => {
  console.log('加载活动数据:', {
    activeTab: activeTab.value,
    searchQuery: searchQuery.value
  })
  // 这里可以调用API进行数据加载
  // 目前使用模拟数据
}

// 组件激活时恢复状态
onActivated(() => {
  console.log('活动管理页面激活，恢复状态')
  loadActivities()
})

// 组件挂载时加载数据
onMounted(() => {
  console.log('活动管理页面挂载')
  loadActivities()
})

// 获取状态显示文本
const getStatusText = (status: string) => {
  const statusMap = {
    upcoming: '可报名',
    registered: '已报名',
    completed: '已完成'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap = {
    upcoming: 'bg-green-100 text-green-800',
    registered: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800'
  }
  return classMap[status as keyof typeof classMap] || 'bg-gray-100 text-gray-800'
}

// 清除筛选条件
const clearFilters = () => {
  activeTab.value = 'all'
  searchQuery.value = ''
  // 重置store状态
  pageStateStore.resetVolunteerActivitiesState()
}

// 报名活动
const handleRegister = (activityId: number) => {
  console.log('报名活动:', activityId)
  // 这里可以调用API进行报名
}

// 查看详情
const handleViewDetails = (activityId: number) => {
  console.log('查看活动详情:', activityId)
  // 这里可以跳转到活动详情页面
}

// 取消报名
const handleCancel = (activityId: number) => {
  console.log('取消报名:', activityId)
  // 这里可以调用API取消报名
}

// 分享活动
const handleShare = (activityId: number) => {
  console.log('分享活动:', activityId)
  // 这里可以实现分享功能
}
</script>

<style scoped>
/* 自定义样式已通过Tailwind类实现 */
</style>