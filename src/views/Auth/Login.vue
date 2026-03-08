<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
    <!-- 背景动画 -->
    <EcoParticles
      intensity="low"
      :enable-mouse-follow="true"
      :enable-click-ripple="true"
      :leaf-count="15"
    />

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Logo和标题 -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
          <LeafIcon class="h-6 w-6 text-white" />
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          登录环保志愿者平台
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          还没有账号？
          <router-link
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            立即注册
          </router-link>
        </p>
      </div>

      <!-- 登录表单 -->
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleLogin"
      >
        <!-- 身份选择区域 -->
        <div>
          <label
            for="role"
            class="block text-sm font-medium text-gray-700"
          >
            登录身份
          </label>
          <div class="mt-1">
            <Select
              id="role"
              v-model="loginState.role"
              placeholder="请选择登录身份"
              :options="[
                { value: 'volunteer', label: '志愿者' },
                { value: 'organization', label: '组织管理者' }
              ]"
            />
          </div>
        </div>


        <!-- 动态输入框区域 -->
        <div class="space-y-4">
          <!-- 邮箱模式 -->
          <div v-if="loginState.mode === LoginMode.EMAIL">
            <label class="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <div class="mt-1">
              <Input
                v-model="loginState.form.email"
                type="email"
                placeholder="请输入邮箱地址"
                required
                :error="loginState.errors.email"
                :icon="MailIcon"
                @blur="() => handleBlur('email')"
              />
            </div>
          </div>

          <!-- 手机号模式 -->
          <div v-else-if="loginState.mode === LoginMode.PHONE">
            <label class="block text-sm font-medium text-gray-700">
              手机号
            </label>
            <div class="mt-1">
              <Input
                v-model="loginState.form.phone"
                type="tel"
                placeholder="请输入手机号"
                required
                :error="loginState.errors.phone"
                :icon="PhoneIcon"
                @blur="() => handleBlur('phone')"
              />
            </div>
          </div>

          <!-- 密码输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              密码
            </label>
            <div class="mt-1">
              <PasswordInput
                v-model="loginState.form.password"
                placeholder="请输入密码"
                required
                :error="loginState.errors.password"
                @blur="() => handleBlur('password')"
              />
            </div>
          </div>
        </div>

        <!-- 记住我和忘记密码 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="loginState.form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-900"
            >
              记住我
            </label>
          </div>

          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              忘记密码？
            </a>
          </div>
        </div>

        <!-- 登录按钮 -->
        <div>
          <Button
            type="submit"
            size="lg"
            block
            :loading="loading"
            loading-text="登录中..."
          >
            登录
          </Button>
        </div>

        <!-- 第三方登录分割线 -->
        <div class="flex items-center my-6">
          <div class="flex-1 border-t border-gray-300" />
          <div class="px-4 text-sm text-gray-500">
            或者使用以下方式登录
          </div>
          <div class="flex-1 border-t border-gray-300" />
        </div>

        <!-- 第三方登录按钮 -->
        <div class="grid grid-cols-1 gap-3">
          <!-- 手机号登录按钮 - 模式切换 -->
          <button
            v-if="loginState.mode !== LoginMode.PHONE"
            class="btn bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 flex items-center justify-center gap-3 py-3 px-4 w-full"
            @click="handleOAuthLogin('phone')"
          >
            <svg
              aria-label="Phone icon"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
              />
            </svg>
            使用手机号登录
          </button>

          <!-- 返回邮箱登录按钮 -->
          <button
            v-else
            class="btn bg-gray-100 text-gray-600 border border-gray-300 hover:border-gray-400 flex items-center justify-center gap-3 py-3 px-4 w-full"
            @click="switchToEmailMode"
          >
            <svg
              aria-label="Back icon"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m15 18-6-6 6-6"
              />
            </svg>
            返回邮箱登录
          </button>
        </div>
      </form>
    </div>

    <!-- 回到主页浮动按钮 -->
    <FloatButton
      :icon="HomeIcon"
      tooltip="回到主页"
      to="/"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { useMessageStore } from '@/store/modules/messages'
import { LoginType, UserIdentity } from '@/types/auth'
import { LeafIcon, MailIcon, PhoneIcon, HomeIcon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import Select from '@/components/ui/Select.vue'
import FloatButton from '@/components/ui/FloatButton.vue'
import EcoParticles from '@/components/background/EcoParticles.vue'

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()

// 登录模式枚举
enum LoginMode {
  EMAIL = 'email',          // 邮箱模式（默认）
  PHONE = 'phone'           // 手机号模式
}

// 表单状态
const loginState = reactive({
  mode: LoginMode.EMAIL,    // 默认邮箱登录
  role: UserIdentity.VOLUNTEER,
  form: {
    email: '',              // 邮箱字段
    phone: '',              // 手机号字段
    password: '',
    rememberMe: false
  },
  errors: {
    email: '',              // 邮箱错误
    phone: '',              // 手机号错误
    password: ''
  },
  touched: {
    email: false,           // 邮箱触摸状态
    phone: false,           // 手机号触摸状态
    password: false
  }
})

const loading = ref(false)

// 字段验证
const validateField = (field: string, value: string) => {
  switch (field) {
    case 'email':
      if (!value.trim()) return '*邮箱地址必须填写'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '*请输入有效的邮箱地址'
      return ''

    case 'phone':
      if (!value.trim()) return '*手机号必须填写'
      if (!/^1[3-9]\d{9}$/.test(value)) return '*请输入有效的手机号'
      return ''

    case 'password':
      if (!value) return '*密码必须填写'
      if (value.length < 6) return '*密码至少6个字符'
      return ''

    default:
      return ''
  }
}

// 实时验证
const validateForm = () => {
  Object.keys(loginState.errors).forEach(field => {
    if (loginState.touched[field as keyof typeof loginState.touched]) {
      const value = loginState.form[field as keyof typeof loginState.form] as string
      loginState.errors[field as keyof typeof loginState.errors] = validateField(field, value || '')
    }
  })
}

// 字段失焦时标记为已触摸
const handleBlur = (field: keyof typeof loginState.touched) => {
  loginState.touched[field] = true
  const value = loginState.form[field as keyof typeof loginState.form] as string
  loginState.errors[field as keyof typeof loginState.errors] = validateField(field, value || '')
}

// 监听表单变化进行实时验证
watch(loginState.form, validateForm, { deep: true })

// 表单提交
const handleLogin = async () => {
  // 提交前标记所有相关字段为已触摸
  if (loginState.mode === LoginMode.EMAIL) {
    loginState.touched.email = true
    loginState.touched.password = true
  } else if (loginState.mode === LoginMode.PHONE) {
    loginState.touched.phone = true
    loginState.touched.password = true
  }

  validateForm()

  // 检查是否有错误
  const hasErrors = Object.values(loginState.errors).some(error => error)
  if (hasErrors) {
    return
  }

  loading.value = true

  try {
    // 调用认证store的登录方法，传递符合后端API格式的参数
    await authStore.login({
      loginType: loginState.mode === LoginMode.EMAIL ? LoginType.EMAIL : LoginType.PHONE,
      identifier: loginState.mode === LoginMode.EMAIL ? loginState.form.email :
                  loginState.form.phone,
      password: loginState.form.password,
      identity: loginState.role
    })

    loading.value = false

    // 根据用户角色跳转到不同页面
    if (authStore.user?.role === UserIdentity.VOLUNTEER) {
      // 志愿者用户跳转到志愿者中心
      router.push('/volunteer')
    } else if (authStore.user?.role === UserIdentity.ORGANIZATION) {
      // 组织管理者跳转到组织管理中心
      router.push('/organization')
    } else {
      // 其他用户跳转到首页
      router.push('/')
    }
  } catch (error: any) {
    loading.value = false
    console.error('登录失败:', error)
    // 显示错误提示
    messageStore.error(error.message || '登录失败，请检查用户名和密码')
  }
}

// 第三方登录处理
const handleOAuthLogin = (provider: string) => {
  // 邮箱登录：切换模式，不跳转
  if (provider === 'email') {
    loginState.mode = LoginMode.EMAIL
    // 清空手机号相关状态
    loginState.form.phone = ''
    loginState.errors.phone = ''
    loginState.touched.phone = false
    return
  }

  // 手机号登录：切换模式，不跳转
  if (provider === 'phone') {
    loginState.mode = LoginMode.PHONE
    // 清空邮箱相关状态
    loginState.form.email = ''
    loginState.errors.email = ''
    loginState.touched.email = false
    return
  }

  // 其他第三方登录：直接跳转
  loading.value = true
  setTimeout(() => {
    loading.value = false
    // 这里可以添加实际的第三方登录逻辑
    console.log(`使用 ${provider} 登录`)

    // 模拟第三方登录成功，设置用户角色为当前选择的角色
    authStore.token = 'mock-oauth-token'
    authStore.user = {
      id: '2',
      username: 'oauth_user',
      email: 'oauth@example.com',
      realName: '第三方用户',
      role: loginState.role, // 使用当前选择的角色
      points: 50,
      totalHours: 15
    }

    // 根据用户角色跳转到不同页面
    if (authStore.user?.role === UserIdentity.VOLUNTEER) {
      router.push('/volunteer')
    } else if (authStore.user?.role === UserIdentity.ORGANIZATION) {
      router.push('/organization')
    } else {
      router.push('/')
    }
  }, 1000)
}

// 切换到邮箱登录
const switchToEmailMode = () => {
  loginState.mode = LoginMode.EMAIL
  // 清空手机号相关状态
  loginState.form.phone = ''
  loginState.errors.phone = ''
  loginState.touched.phone = false
}
</script>