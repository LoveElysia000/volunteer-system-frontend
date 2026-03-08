import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/store/modules/auth'
import { tokenManager } from '@/utils/token'

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

  // 其他路由错误，重定向到404页面
  // 使用replace而不是push，避免在历史记录中添加额外的条目
  router.replace('/404')
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
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