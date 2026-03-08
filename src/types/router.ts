// 路由相关类型定义

// 后端API返回的路由接口类型
export interface ApiRoute {
  path: string
  name: string
  title?: string
  requiresAuth?: boolean
  role?: string
  children?: ApiRoute[]
}

// 前端路由配置类型
export interface FrontendRoute {
  path: string
  name: string
  component: any
  meta: {
    title: string
    requiresAuth?: boolean
    role?: string
  }
  children?: FrontendRoute[]
}

// 路由转换配置
export interface RouteMappingConfig {
  // 组件名称到实际组件的映射
  componentMap: Record<string, any>
  // 默认路由配置
  defaultRoutes: FrontendRoute[]
  // 开发环境路由配置
  devRoutes?: FrontendRoute[]
}

// 路由状态类型
export interface RouteState {
  // 当前路由信息
  currentRoute: FrontendRoute | null
  // 已注册的路由列表
  registeredRoutes: FrontendRoute[]
  // 路由加载状态
  isLoading: boolean
  // 错误信息
  error: string | null
}

// 路由守卫配置
export interface RouteGuardConfig {
  // 是否需要认证
  requiresAuth?: boolean
  // 需要的角色
  requiredRole?: string
  // 重定向路径
  redirectTo?: string
  // 自定义守卫函数
  guard?: (to: any, from: any) => boolean | string
}

// 路由缓存配置
export interface RouteCacheConfig {
  // 是否启用缓存
  enabled: boolean
  // 缓存过期时间（毫秒）
  ttl: number
  // 缓存键前缀
  prefix: string
}