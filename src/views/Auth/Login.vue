<template>
  <div class="relative min-h-screen overflow-hidden bg-[#f3f8f6]">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(17,212,173,0.18),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_32%)]" />

    <div class="relative flex min-h-screen w-full flex-col bg-white lg:flex-row">
      <section class="relative hidden overflow-hidden bg-[#10221e] px-12 py-14 text-white lg:flex lg:w-[46%] xl:w-5/12">
        <div class="absolute inset-0 bg-gradient-to-br from-[#143129] via-[#174e42] to-[#0c1715]" />
        <div class="absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />
        <div class="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-emerald-200/10 blur-3xl" />

        <div class="relative z-10 mx-auto flex w-full max-w-xl flex-col justify-between">
          <div>
            <div class="mb-10 flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-400 text-slate-950 shadow-xl shadow-black/20">
                <LeafIcon class="h-6 w-6" />
              </div>
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.35em] text-white/65">
                  EcoVolunteer
                </p>
                <h1 class="text-3xl font-extrabold tracking-tight">
                  环保志愿者平台
                </h1>
              </div>
            </div>

            <div class="overflow-hidden rounded-[30px] border border-white/15 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-sm">
              <img
                class="h-[480px] w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNGOpQsaHfVO6d_5_CQ57c11qL95AxMzIEFkpK-FyB4EfWz9MlZuub8d-zPikUmpim6lY4DlYAIVbG3BrYt8RKIGThIvLZO0hfzrpKq3-yeu6d_kF5uU1uU0qiamSZJNHCfeejy8fjRRAFzPj92W3sBqfU4YMY-SvVqGTIt_sKxkOa58bkCjhX688HaKuVQhnAdhWMggntwC7T0LmwkM7l1o9AxmbPZUbTJegWYwDTixJ6d0xsegZoSMNY-DnPbqMjb89-Qao1AZjt"
                alt="环保志愿者活动展示图"
              >
            </div>
          </div>

          <div class="mt-12 space-y-8">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                绿色行动
              </p>
              <h2 class="mt-3 text-4xl font-extrabold leading-tight">
                守护自然环境，<br>
                连接每一份善意。
              </h2>
              <p class="mt-4 max-w-lg text-base leading-7 text-white/80">
                连接志愿者、公益组织与环保行动，用更清晰的流程记录服务时长、活动参与和成长成果。
              </p>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p class="text-2xl font-extrabold">
                  50k+
                </p>
                <p class="mt-1 text-sm text-white/70">
                  活跃志愿者
                </p>
              </div>
              <div class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p class="text-2xl font-extrabold">
                  1.2k
                </p>
                <p class="mt-1 text-sm text-white/70">
                  合作组织
                </p>
              </div>
              <div class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p class="text-2xl font-extrabold">
                  98%
                </p>
                <p class="mt-1 text-sm text-white/70">
                  活动到场率
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="flex w-full bg-[#f6f8f8] px-6 py-10 sm:px-10 lg:w-[54%] lg:px-14 xl:w-7/12 xl:px-20">
        <div class="mx-auto flex w-full max-w-3xl flex-col">
          <div class="mb-10 flex items-center justify-between lg:hidden">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-sm">
                <LeafIcon class="h-5 w-5" />
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700/80">
                  EcoVolunteer
                </p>
                <h1 class="text-xl font-extrabold text-slate-900">
                  环保志愿者平台
                </h1>
              </div>
            </div>
            <router-link
              to="/"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-300 hover:text-primary-700"
            >
              <HomeIcon class="h-4 w-4" />
              返回首页
            </router-link>
          </div>

          <div class="hidden justify-end lg:flex">
            <router-link
              to="/"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-300 hover:text-primary-700"
            >
              <HomeIcon class="h-4 w-4" />
              返回首页
            </router-link>
          </div>
          <div class="my-auto py-4">
            <div class="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
              <div class="h-2 w-full bg-slate-100">
                <div class="h-full w-2/3 rounded-r-full bg-primary-400" />
              </div>

              <div class="p-6 sm:p-8 lg:p-10">
                <div class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary-700/80">
                      Welcome Back
                    </p>
                    <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                      欢迎回到你的公益空间
                    </h2>
                    <p class="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                      登录页与注册页已统一为同一套认证视觉语言，但不会改动你当前的登录方式、字段和账号参数。
                    </p>
                  </div>

                  <div class="rounded-2xl bg-primary-50 px-4 py-3 text-right">
                    <p class="text-xs font-bold uppercase tracking-[0.3em] text-primary-700">
                      Secure access
                    </p>
                    <p class="mt-1 text-sm text-primary-900">
                      Choose your entry
                    </p>
                  </div>
                </div>

                <form
                  class="space-y-6"
                  @submit.prevent="handleLogin"
                >
                  <div>
                    <div class="mb-3 flex items-center justify-between">
                      <label class="text-sm font-semibold text-slate-700">登录身份</label>
                      <span class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        选择本次进入的身份
                      </span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        :class="roleButtonClass(UserIdentity.VOLUNTEER)"
                        @click="loginState.form.identity = UserIdentity.VOLUNTEER"
                      >
                        <UserIcon class="h-4 w-4" />
                        志愿者
                      </button>
                      <button
                        type="button"
                        :class="roleButtonClass(UserIdentity.ORGANIZATION)"
                        @click="loginState.form.identity = UserIdentity.ORGANIZATION"
                      >
                        <Building2Icon class="h-4 w-4" />
                        组织管理者
                      </button>
                    </div>
                  </div>

                  <div>
                    <div class="mb-3 flex items-center justify-between">
                      <label class="text-sm font-semibold text-slate-700">登录方式</label>
                      <span class="text-xs text-slate-400">两种方式都可直接使用</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-1.5">
                      <button
                        type="button"
                        :class="modeButtonClass(LoginType.EMAIL)"
                        @click="switchLoginType(LoginType.EMAIL)"
                      >
                        <MailIcon class="h-4 w-4" />
                        邮箱登录
                      </button>
                      <button
                        type="button"
                        :class="modeButtonClass(LoginType.PHONE)"
                        @click="switchLoginType(LoginType.PHONE)"
                      >
                        <PhoneIcon class="h-4 w-4" />
                        手机号登录
                      </button>
                    </div>
                  </div>

                  <div class="space-y-5">
                    <div class="floating-field">
                      <div class="relative">
                        <input
                          v-if="loginState.form.loginType === LoginType.EMAIL"
                          id="identifier"
                          v-model="loginState.form.identifier"
                          type="email"
                          placeholder=" "
                          class="peer login-input"
                          :class="{
                            'login-input-error': loginState.errors.identifier,
                            'login-input-raised': identifierFieldRaised
                          }"
                          autocomplete="email"
                          @focus="handleFocus('identifier')"
                          @blur="() => handleBlur('identifier')"
                        >
                        <input
                          v-else
                          id="identifier"
                          v-model="loginState.form.identifier"
                          type="tel"
                          placeholder=" "
                          class="peer login-input"
                          :class="{
                            'login-input-error': loginState.errors.identifier,
                            'login-input-raised': identifierFieldRaised
                          }"
                          autocomplete="tel"
                          @focus="handleFocus('identifier')"
                          @blur="() => handleBlur('identifier')"
                        >
                        <label
                          for="identifier"
                          class="login-label"
                          :class="{ 'login-label-raised': identifierFieldRaised }"
                        >
                          {{ loginState.form.loginType === LoginType.EMAIL ? '邮箱地址' : '手机号码' }}
                        </label>
                        <component
                          :is="loginState.form.loginType === LoginType.EMAIL ? MailIcon : PhoneIcon"
                          class="field-leading-icon pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition"
                          :class="{
                            'field-leading-icon-raised text-primary-500': identifierFieldRaised
                          }"
                        />
                      </div>
                      <p
                        v-if="currentIdentifierError"
                        class="mt-2 text-sm font-medium text-rose-500"
                      >
                        {{ currentIdentifierError }}
                      </p>
                    </div>

                    <div class="floating-field">
                      <div class="relative">
                        <input
                          id="password"
                          v-model="loginState.form.password"
                          :type="passwordVisible ? 'text' : 'password'"
                          placeholder=" "
                          class="peer login-input pr-12"
                          :class="{
                            'login-input-error': loginState.errors.password,
                            'login-input-raised': passwordFieldRaised
                          }"
                          autocomplete="current-password"
                          @focus="handleFocus('password')"
                          @blur="() => handleBlur('password')"
                        >
                        <label
                          for="password"
                          class="login-label"
                          :class="{ 'login-label-raised': passwordFieldRaised }"
                        >密码</label>
                        <button
                          type="button"
                          class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-primary-700"
                          @click="passwordVisible = !passwordVisible"
                        >
                          <component
                            :is="passwordVisible ? EyeOffIcon : EyeIcon"
                            class="h-5 w-5"
                          />
                        </button>
                        <LockIcon
                          class="field-leading-icon pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition"
                          :class="{ 'field-leading-icon-raised text-primary-400': passwordFieldRaised }"
                        />
                      </div>
                      <p
                        v-if="loginState.errors.password"
                        class="mt-2 text-sm font-medium text-rose-500"
                      >
                        {{ loginState.errors.password }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <label class="inline-flex items-center gap-3 text-sm text-slate-600">
                      <input
                        v-model="loginState.form.rememberMe"
                        type="checkbox"
                        class="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      >
                      记住我
                    </label>

                    <router-link
                      to="/forgot-password"
                      class="text-sm font-semibold text-primary-700 transition hover:text-primary-700 hover:underline"
                    >
                      忘记密码？
                    </router-link>
                  </div>

                  <button
                    type="submit"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-400 px-6 py-4 text-base font-bold text-slate-900 shadow-lg shadow-primary-400/20 transition hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-70"
                    :disabled="loading"
                  >
                    <span
                      v-if="loading"
                      class="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/25 border-t-slate-900"
                    />
                    <template v-else>
                      登录
                      <ArrowRightIcon class="h-5 w-5" />
                    </template>
                    <template v-if="loading">
                      登录中...
                    </template>
                  </button>
                </form>

                <div class="relative my-8">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-200" />
                  </div>
                  <div class="relative flex justify-center">
                    <span class="bg-white px-4 text-sm text-slate-400">快速操作</span>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    class="flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-slate-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
                    @click="switchLoginType(loginState.form.loginType === LoginType.EMAIL ? LoginType.PHONE : LoginType.EMAIL)"
                  >
                    <component
                      :is="loginState.form.loginType === LoginType.EMAIL ? PhoneIcon : MailIcon"
                      class="h-5 w-5"
                    />
                  </button>
                  <button
                    type="button"
                    class="flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-slate-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
                    @click="showHelpMessage"
                  >
                    <ShieldIcon class="h-5 w-5" />
                  </button>
                  <router-link
                    to="/"
                    class="flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-slate-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
                  >
                    <HomeIcon class="h-5 w-5" />
                  </router-link>
                </div>

                <div class="mt-8 text-center text-sm text-slate-500">
                  第一次使用平台？
                  <router-link
                    to="/register"
                    class="font-bold text-primary-700 transition hover:text-primary-600 hover:underline"
                  >
                    立即注册
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
            <a
              href="#"
              class="transition hover:text-primary-700"
            >隐私政策</a>
            <a
              href="#"
              class="transition hover:text-primary-700"
            >服务条款</a>
            <a
              href="#"
              class="transition hover:text-primary-700"
              @click.prevent="showHelpMessage"
            >帮助支持</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { useMessageStore } from '@/store/modules/messages'
import { LoginType, UserIdentity, type LoginRequest } from '@/types/auth'
import {
  ArrowRightIcon,
  Building2Icon,
  EyeIcon,
  EyeOffIcon,
  HomeIcon,
  LeafIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  ShieldIcon,
  UserIcon
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()

type LoginFormState = LoginRequest & {
  rememberMe: boolean
}

type LoginFormField = keyof Pick<LoginFormState, 'loginType' | 'identifier' | 'password' | 'identity'>
type LoginFormFieldValue = LoginFormState[LoginFormField]

const loginState = reactive<{
  form: LoginFormState
  errors: Record<LoginFormField, string>
  touched: Record<LoginFormField, boolean>
}>({
  form: {
    loginType: LoginType.EMAIL,
    identifier: '',
    password: '',
    identity: UserIdentity.VOLUNTEER,
    rememberMe: false
  },
  errors: {
    loginType: '',
    identifier: '',
    password: '',
    identity: ''
  },
  touched: {
    loginType: false,
    identifier: false,
    password: false,
    identity: false
  }
})

const loading = ref(false)
const passwordVisible = ref(false)
const focusedField = ref<LoginFormField | null>(null)

const currentIdentifierError = computed(() => {
  return loginState.errors.identifier
})

const identifierFieldRaised = computed(() => {
  return focusedField.value === 'identifier' || Boolean(loginState.form.identifier)
})

const passwordFieldRaised = computed(() => {
  return focusedField.value === 'password' || Boolean(loginState.form.password)
})

const validateField = (field: LoginFormField, value: LoginFormFieldValue) => {
  switch (field) {
    case 'loginType':
      if (!value) return '*登录方式必须选择'
      return ''
    case 'identity':
      if (!value) return '*登录身份必须选择'
      return ''
    case 'identifier':
      if (!value.trim()) {
        return loginState.form.loginType === LoginType.EMAIL ? '*邮箱地址必须填写' : '*手机号必须填写'
      }
      if (loginState.form.loginType === LoginType.EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return '*请输入有效的邮箱地址'
      }
      if (loginState.form.loginType === LoginType.PHONE && !/^1[3-9]\d{9}$/.test(value)) {
        return '*请输入有效的手机号'
      }
      return ''
    case 'password':
      if (!value) return '*密码必须填写'
      if (value.length < 6) return '*密码至少6个字符'
      return ''
    default:
      return ''
  }
}

const validateForm = () => {
  (Object.keys(loginState.errors) as LoginFormField[]).forEach(field => {
    if (loginState.touched[field]) {
      loginState.errors[field] = validateField(field, loginState.form[field])
    }
  })
}

const handleFocus = (field: LoginFormField) => {
  focusedField.value = field
}

const handleBlur = (field: LoginFormField) => {
  if (focusedField.value === field) {
    focusedField.value = null
  }
  loginState.touched[field] = true
  loginState.errors[field] = validateField(field, loginState.form[field])
}

watch(loginState.form, validateForm, { deep: true })

const switchLoginType = (loginType: LoginType) => {
  loginState.form.loginType = loginType
  loginState.form.identifier = ''
  loginState.errors.loginType = ''
  loginState.errors.identifier = ''
  loginState.touched.loginType = false
  loginState.touched.identifier = false
}

const roleButtonClass = (role: UserIdentity) => {
  const active = loginState.form.identity === role
  return [
    'inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition',
    active
      ? 'border-primary-400 bg-primary-50 text-primary-900 shadow-sm shadow-primary-200/60'
      : 'border-slate-200 bg-white text-slate-500 hover:border-primary-300 hover:text-primary-700'
  ]
}

const modeButtonClass = (mode: LoginType) => {
  const active = loginState.form.loginType === mode
  return [
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition',
    active
      ? 'bg-white text-slate-900 shadow-sm'
      : 'text-slate-500 hover:text-slate-700'
  ]
}

const showHelpMessage = () => {
  messageStore.info('如果你暂时无法登录，可以先尝试找回密码，或联系平台管理员协助处理。')
}

const handleLogin = async () => {
  loginState.touched.loginType = true
  loginState.touched.identifier = true
  loginState.touched.password = true
  loginState.touched.identity = true

  validateForm()

  const hasErrors = Object.values(loginState.errors).some(error => error)
  if (hasErrors) {
    return
  }

  loading.value = true

  try {
    await authStore.login({
      loginType: loginState.form.loginType,
      identifier: loginState.form.identifier.trim(),
      password: loginState.form.password,
      identity: loginState.form.identity
    })

    if (authStore.user?.role === UserIdentity.VOLUNTEER) {
      router.push('/volunteer')
    } else if (authStore.user?.role === UserIdentity.ORGANIZATION) {
      router.push('/organization')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    messageStore.error(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:global(body) {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.login-input {
  width: 100%;
  min-height: 3.75rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 1rem 1rem 1rem 2.8rem;
  line-height: 1.5rem;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
}

.login-input:focus {
  border-color: rgb(17 212 173 / 0.75);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgb(17 212 173 / 0.12);
}

.login-input-error {
  border-color: rgb(244 63 94 / 0.55);
  box-shadow: 0 0 0 4px rgb(244 63 94 / 0.08);
}

.floating-field .login-label {
  position: absolute;
  left: 2.8rem;
  top: 1rem;
  transform-origin: left top;
  color: #94a3b8;
  transition: all 0.2s ease;
  pointer-events: none;
}

.floating-field .login-label-raised {
  transform: translateY(-0.72rem) scale(0.84);
  color: #11d4ad;
}

.floating-field .login-input-raised {
  padding-top: 1.5rem;
  padding-bottom: 0.75rem;
}

.floating-field .field-leading-icon-raised {
  top: calc(50% + 0.3rem);
}

</style>
