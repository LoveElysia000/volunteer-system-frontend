import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './store/modules/auth'
import './assets/styles/main.css'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
}

// 全局未处理Promise拒绝处理
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  event.preventDefault()
})

const pinia = createPinia()
app.use(pinia)
app.use(router)

// 恢复认证状态（必须在路由初始化后调用）
const authStore = useAuthStore()
authStore.restoreAuthState()

app.mount('#app')