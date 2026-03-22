import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/store/modules/auth'
import { tokenManager } from '@/utils/token'

const CHUNK_RELOAD_KEY = 'router-chunk-reload-once'

const isChunkLoadError = (error: unknown) => {
  const message = String((error as Error | undefined)?.message || error || '')

  return (
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('Failed to import') ||
    message.includes('Loading chunk')
  )
}

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由错误处理
router.onError((error, to) => {
  console.error('路由错误:', error)
  console.error('目标路由:', to)

  // 如果是导航被取消的错误，忽略它
  if (error.name === 'NavigationCancelled') {
    return
  }

  // 懒加载 chunk 失败通常是用户命中了旧缓存，刷新一次拿新入口文件即可。
  if (isChunkLoadError(error)) {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1') {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY)
      return
    }

    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
    window.location.reload()
    return
  }

  sessionStorage.removeItem(CHUNK_RELOAD_KEY)

  // 避免 404 页面本身出错时再次跳转，导致无限循环。
  if (to?.path === '/404' || to?.name === '404' || to?.name === 'not-found') {
    return
  }

  // 其他路由错误，重定向到404页面
  // 使用replace而不是push，避免在历史记录中添加额外的条目
  router.replace('/404')
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  // 对于404页面，直接放行，不进行认证检查
  if (to.name === 'not-found' || to.name === '404') {
    next()
    return
  }

  const authStore = useAuthStore()

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 检查token是否存在
    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    // 检查token是否过期
    if (tokenManager.isTokenExpired()) {
      // 尝试刷新token
      try {
        await authStore.refreshToken()
      } catch (error) {
        // 刷新失败，跳转登录
        return next('/login')
      }
    }
  }

  // 检查角色权限
  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    if (authStore.user?.role === 'volunteer') {
      return next('/volunteer')
    } else if (authStore.user?.role === 'organization') {
      return next('/organization')
    }
    return next('/')
  }

  next()
})

export default router
