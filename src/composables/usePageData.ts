import { ref, onMounted, onActivated, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 统一的数据加载组合函数
 * 提供数据加载、错误处理、缓存和路由监听功能
 */
export function usePageData<T>(
  loader: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean
    cacheKey?: string
    enableRouteWatch?: boolean
  } = {}
) {
  const {
    immediate = true,
    cacheKey,
    enableRouteWatch = true
  } = options

  const data = ref<T>()
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const route = useRoute()

  // 缓存数据
  const cache = ref<Map<string, T>>(new Map())

  const loadData = async () => {
    loading.value = true
    error.value = null

    try {
      // 检查缓存
      if (cacheKey && cache.value.has(cacheKey)) {
        data.value = cache.value.get(cacheKey)
        loading.value = false
        return
      }

      // 调用加载函数
      const result = await loader()
      data.value = result

      // 缓存结果
      if (cacheKey) {
        cache.value.set(cacheKey, result)
      }
    } catch (err) {
      error.value = err as Error
      console.error('数据加载失败:', err)
    } finally {
      loading.value = false
    }
  }

  // 监听依赖变化重新加载数据
  if (dependencies.length > 0) {
    watch(dependencies, loadData, { immediate })
  } else if (immediate) {
    onMounted(loadData)
  }

  // 组件激活时重新加载数据
  onActivated(() => {
    if (!loading.value) {
      loadData()
    }
  })

  // 监听路由变化重新加载数据
  if (enableRouteWatch) {
    watch(() => route.fullPath, loadData)
  }

  // 清除缓存
  const clearCache = (key?: string) => {
    if (key) {
      cache.value.delete(key)
    } else {
      cache.value.clear()
    }
  }

  // 手动重新加载
  const reload = () => {
    if (cacheKey) {
      cache.value.delete(cacheKey)
    }
    return loadData()
  }

  return {
    data,
    loading,
    error,
    reload,
    clearCache
  }
}

/**
 * 简化的数据加载函数，适用于简单的数据获取场景
 */
export function useSimplePageData<T>(loader: () => Promise<T>) {
  return usePageData(loader, [], { immediate: true, enableRouteWatch: true })
}

/**
 * 带缓存的数据加载函数
 */
export function useCachedPageData<T>(loader: () => Promise<T>, cacheKey: string) {
  return usePageData(loader, [], { immediate: true, cacheKey, enableRouteWatch: false })
}