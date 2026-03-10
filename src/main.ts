import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './store/modules/auth'
import { useLocaleStore } from './store/modules/locale'
import { i18n } from './i18n'
import vScrollFade from './directives/vScrollFade'
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
app.use(i18n)

const localeStore = useLocaleStore()
localeStore.restoreLocale()
watch(
  () => localeStore.locale,
  (nextLocale) => {
    i18n.global.locale.value = nextLocale
  },
  { immediate: true }
)

app.use(router)

// 注册全局自定义指令
app.directive('scroll-fade', vScrollFade)

// 恢复认证状态（必须在路由初始化后调用）
const authStore = useAuthStore()
authStore.restoreAuthState()

app.mount('#app')
