import { defineStore } from 'pinia'
import { ref } from 'vue'

interface VolunteerActivitiesState {
  activeTab: string
  searchQuery: string
  page: number
  pageSize: number
}

interface OrganizationActivitiesState {
  filter: string
  search: string
  page: number
  pageSize: number
}

interface PageState {
  volunteerActivities: VolunteerActivitiesState
  organizationActivities: OrganizationActivitiesState
}

export const usePageStateStore = defineStore('pageState', () => {
  // 默认状态
  const defaultState: PageState = {
    volunteerActivities: {
      activeTab: 'all',
      searchQuery: '',
      page: 1,
      pageSize: 10
    },
    organizationActivities: {
      filter: 'all',
      search: '',
      page: 1,
      pageSize: 10
    }
  }

  // 当前状态
  const state = ref<PageState>({ ...defaultState })

  // 保存状态到localStorage
  const saveState = () => {
    try {
      localStorage.setItem('pageState', JSON.stringify(state.value))
    } catch (error) {
      console.error('保存页面状态失败:', error)
    }
  }

  // 从localStorage恢复状态
  const restoreState = () => {
    try {
      const stored = localStorage.getItem('pageState')
      if (stored) {
        const parsedState = JSON.parse(stored)
        // 合并存储的状态和默认状态，确保新字段有默认值
        state.value = { ...defaultState, ...parsedState }
      }
    } catch (error) {
      console.error('恢复页面状态失败:', error)
      // 恢复失败时使用默认状态
      state.value = { ...defaultState }
    }
  }

  // 更新志愿者活动状态
  const updateVolunteerActivitiesState = (newState: Partial<VolunteerActivitiesState>) => {
    state.value.volunteerActivities = {
      ...state.value.volunteerActivities,
      ...newState
    }
    saveState()
  }

  // 更新组织活动状态
  const updateOrganizationActivitiesState = (newState: Partial<OrganizationActivitiesState>) => {
    state.value.organizationActivities = {
      ...state.value.organizationActivities,
      ...newState
    }
    saveState()
  }

  // 重置特定页面状态
  const resetVolunteerActivitiesState = () => {
    state.value.volunteerActivities = { ...defaultState.volunteerActivities }
    saveState()
  }

  const resetOrganizationActivitiesState = () => {
    state.value.organizationActivities = { ...defaultState.organizationActivities }
    saveState()
  }

  // 重置所有状态
  const resetAllState = () => {
    state.value = { ...defaultState }
    saveState()
  }

  return {
    state,
    restoreState,
    updateVolunteerActivitiesState,
    updateOrganizationActivitiesState,
    resetVolunteerActivitiesState,
    resetOrganizationActivitiesState,
    resetAllState
  }
})