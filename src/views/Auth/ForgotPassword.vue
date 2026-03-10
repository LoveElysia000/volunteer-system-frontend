<template>
  <div class="relative min-h-screen overflow-hidden bg-[#f3f8f6]">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,161,105,0.18),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.12),_transparent_32%)]" />

    <div class="relative flex min-h-screen w-full flex-col bg-white lg:flex-row">
      <section class="relative hidden overflow-hidden bg-slate-950 px-12 py-14 text-white lg:flex lg:w-1/2">
        <div class="absolute inset-0 bg-[linear-gradient(135deg,#123524_0%,#1f6d4a_45%,#0f766e_100%)]" />
        <div class="absolute inset-x-10 top-10 h-px bg-white/15" />
        <div class="absolute -right-16 top-24 h-64 w-64 rounded-full bg-emerald-200/10 blur-3xl" />
        <div class="absolute -bottom-10 left-0 h-80 w-80 rounded-full bg-teal-200/10 blur-3xl" />

        <div class="relative z-10 mx-auto flex w-full max-w-xl flex-col justify-between">
          <div>
            <div class="mb-10 flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-xl shadow-emerald-950/20">
                <LeafIcon class="h-6 w-6" />
              </div>
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
                  Account Recovery
                </p>
                <h1 class="text-3xl font-extrabold tracking-tight">
                  找回你的环保账户
                </h1>
              </div>
            </div>

            <div class="rounded-[28px] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur-sm">
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100/70">
                Recovery Guide
              </p>
              <h2 class="mt-4 text-4xl font-extrabold leading-tight">
                两步完成找回，<br>
                继续你的公益旅程。
              </h2>
              <div class="mt-8 space-y-5 text-white/80">
                <div class="flex gap-4">
                  <div class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p class="font-semibold text-white">
                      选择找回方式
                    </p>
                    <p class="mt-1 text-sm leading-6">
                      使用注册时绑定的邮箱或手机号提交身份信息。
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p class="font-semibold text-white">
                      完成后续验证
                    </p>
                    <p class="mt-1 text-sm leading-6">
                      当前页面先提供完整入口与反馈，后续可无缝接入真实短信或邮件重置流程。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p class="text-sm text-white/60">
                适用对象
              </p>
              <p class="mt-2 text-xl font-bold">
                志愿者 / 组织
              </p>
            </div>
            <div class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p class="text-sm text-white/60">
                支持方式
              </p>
              <p class="mt-2 text-xl font-bold">
                邮箱 / 手机
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="flex w-full bg-white px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
        <div class="mx-auto flex w-full max-w-xl flex-col">
          <div class="mb-10 flex items-center justify-between">
            <div class="flex items-center gap-3 lg:hidden">
              <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 shadow-sm">
                <LeafIcon class="h-5 w-5" />
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600/80">
                  Recovery
                </p>
                <h1 class="text-xl font-extrabold text-slate-900">
                  找回账户
                </h1>
              </div>
            </div>
            <router-link
              to="/login"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-300 hover:text-primary-600"
            >
              <ArrowLeftIcon class="h-4 w-4" />
              返回登录
            </router-link>
          </div>

          <div class="my-auto py-4">
            <div class="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] sm:p-8">
              <template v-if="submitted">
                <div class="flex flex-col items-center text-center">
                  <div class="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2Icon class="h-8 w-8" />
                  </div>
                  <p class="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700/80">
                    Request Received
                  </p>
                  <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                    找回申请已提交
                  </h2>
                  <p class="mt-4 max-w-md text-base leading-7 text-slate-500">
                    {{ successMessage }}
                  </p>
                  <div class="mt-8 grid w-full gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-600"
                      @click="resetForm"
                    >
                      继续找回其他账号
                    </button>
                    <router-link
                      to="/login"
                      class="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-primary-400"
                    >
                      返回登录
                      <ArrowRightIcon class="h-4 w-4" />
                    </router-link>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="mb-8">
                  <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary-600/80">
                    Forgot Password
                  </p>
                  <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    通过安全方式找回密码
                  </h2>
                  <p class="mt-3 text-base leading-7 text-slate-500">
                    提交你注册时使用的邮箱或手机号。当前版本会展示完整找回流程反馈，方便后续直接接入真实服务。
                  </p>
                </div>

                <form
                  class="space-y-6"
                  @submit.prevent="handleSubmit"
                >
                  <div>
                    <div class="mb-3 flex items-center justify-between">
                      <label class="text-sm font-semibold text-slate-700">找回方式</label>
                      <span class="text-xs text-slate-400">与登录方式保持一致</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-1.5">
                      <button
                        type="button"
                        :class="modeButtonClass(RecoveryMode.EMAIL)"
                        @click="switchMode(RecoveryMode.EMAIL)"
                      >
                        <MailIcon class="h-4 w-4" />
                        邮箱找回
                      </button>
                      <button
                        type="button"
                        :class="modeButtonClass(RecoveryMode.PHONE)"
                        @click="switchMode(RecoveryMode.PHONE)"
                      >
                        <PhoneIcon class="h-4 w-4" />
                        手机找回
                      </button>
                    </div>
                  </div>

                  <div class="floating-field relative">
                    <input
                      v-if="recoveryState.mode === RecoveryMode.EMAIL"
                      id="identifier"
                      v-model="recoveryState.form.email"
                      type="email"
                      placeholder=" "
                      class="peer recovery-input"
                      :class="{ 'recovery-input-error': currentIdentifierError }"
                      autocomplete="email"
                      @blur="() => handleBlur('email')"
                    >
                    <input
                      v-else
                      id="identifier"
                      v-model="recoveryState.form.phone"
                      type="tel"
                      placeholder=" "
                      class="peer recovery-input"
                      :class="{ 'recovery-input-error': currentIdentifierError }"
                      autocomplete="tel"
                      @blur="() => handleBlur('phone')"
                    >
                    <label
                      for="identifier"
                      class="recovery-label"
                    >
                      {{ recoveryState.mode === RecoveryMode.EMAIL ? '请输入注册邮箱' : '请输入绑定手机号' }}
                    </label>
                    <component
                      :is="recoveryState.mode === RecoveryMode.EMAIL ? MailIcon : PhoneIcon"
                      class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition peer-focus:text-primary-500"
                    />
                    <p
                      v-if="currentIdentifierError"
                      class="mt-2 text-sm font-medium text-rose-500"
                    >
                      {{ currentIdentifierError }}
                    </p>
                  </div>

                  <div class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                    当前为前端占位流程：提交后会展示“已受理”的反馈文案，后续接入邮件或短信接口时可直接复用本页面。
                  </div>

                  <button
                    type="submit"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-6 py-4 text-base font-bold text-slate-900 shadow-lg shadow-primary-500/20 transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-70"
                    :disabled="submitting"
                  >
                    <span
                      v-if="submitting"
                      class="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/25 border-t-slate-900"
                    />
                    <template v-else>
                      提交找回申请
                      <ArrowRightIcon class="h-5 w-5" />
                    </template>
                    <template v-if="submitting">
                      提交中...
                    </template>
                  </button>
                </form>

                <div class="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                  <router-link
                    to="/register"
                    class="font-semibold text-primary-600 transition hover:text-primary-500 hover:underline"
                  >
                    还没有账号？立即注册
                  </router-link>
                  <button
                    type="button"
                    class="font-semibold text-slate-500 transition hover:text-primary-600"
                    @click="showHelpMessage"
                  >
                    联系平台支持
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useMessageStore } from '@/store/modules/messages'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  LeafIcon,
  MailIcon,
  PhoneIcon
} from 'lucide-vue-next'

enum RecoveryMode {
  EMAIL = 'email',
  PHONE = 'phone'
}

const messageStore = useMessageStore()
const submitting = ref(false)
const submitted = ref(false)
const successMessage = ref('')

const recoveryState = reactive({
  mode: RecoveryMode.EMAIL,
  form: {
    email: '',
    phone: ''
  },
  errors: {
    email: '',
    phone: ''
  },
  touched: {
    email: false,
    phone: false
  }
})

const currentIdentifierError = computed(() => {
  return recoveryState.mode === RecoveryMode.EMAIL ? recoveryState.errors.email : recoveryState.errors.phone
})

const validateField = (field: 'email' | 'phone', value: string) => {
  if (field === 'email') {
    if (!value.trim()) return '*请输入注册邮箱'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '*请输入有效的邮箱地址'
    return ''
  }

  if (!value.trim()) return '*请输入绑定手机号'
  if (!/^1[3-9]\d{9}$/.test(value)) return '*请输入有效的手机号'
  return ''
}

const validateForm = () => {
  (['email', 'phone'] as const).forEach(field => {
    if (recoveryState.touched[field]) {
      recoveryState.errors[field] = validateField(field, recoveryState.form[field])
    }
  })
}

watch(recoveryState.form, validateForm, { deep: true })

const switchMode = (mode: RecoveryMode) => {
  recoveryState.mode = mode

  if (mode === RecoveryMode.EMAIL) {
    recoveryState.form.phone = ''
    recoveryState.errors.phone = ''
    recoveryState.touched.phone = false
  } else {
    recoveryState.form.email = ''
    recoveryState.errors.email = ''
    recoveryState.touched.email = false
  }
}

const handleBlur = (field: 'email' | 'phone') => {
  recoveryState.touched[field] = true
  recoveryState.errors[field] = validateField(field, recoveryState.form[field])
}

const modeButtonClass = (mode: RecoveryMode) => {
  const active = recoveryState.mode === mode
  return [
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition',
    active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
  ]
}

const resetForm = () => {
  submitted.value = false
  submitting.value = false
  recoveryState.form.email = ''
  recoveryState.form.phone = ''
  recoveryState.errors.email = ''
  recoveryState.errors.phone = ''
  recoveryState.touched.email = false
  recoveryState.touched.phone = false
  recoveryState.mode = RecoveryMode.EMAIL
}

const showHelpMessage = () => {
  messageStore.info('如果你暂时无法完成找回流程，请联系平台管理员或组织管理员获取人工协助。')
}

const handleSubmit = async () => {
  const activeField = recoveryState.mode === RecoveryMode.EMAIL ? 'email' : 'phone'
  recoveryState.touched[activeField] = true
  validateForm()

  if (currentIdentifierError.value) {
    return
  }

  submitting.value = true

  await new Promise(resolve => setTimeout(resolve, 700))

  successMessage.value = recoveryState.mode === RecoveryMode.EMAIL
    ? `我们已记录邮箱 ${recoveryState.form.email} 的找回申请。当前版本会先展示受理反馈，后续接入真实邮件服务后，这里将直接发送重置链接。`
    : `我们已记录手机号 ${recoveryState.form.phone} 的找回申请。当前版本会先展示受理反馈，后续接入真实短信服务后，这里将直接发送验证码或重置指引。`

  submitting.value = false
  submitted.value = true
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:global(body) {
  font-family: 'Plus Jakarta Sans', 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.recovery-input {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 1rem 3.25rem 1rem 1rem;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
}

.recovery-input:focus {
  border-color: rgb(56 161 105 / 0.6);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgb(56 161 105 / 0.12);
}

.recovery-input-error {
  border-color: rgb(244 63 94 / 0.55);
  box-shadow: 0 0 0 4px rgb(244 63 94 / 0.08);
}

.floating-field .recovery-label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  transform-origin: left top;
  color: #94a3b8;
  transition: all 0.2s ease;
  pointer-events: none;
}

.floating-field .peer:focus ~ .recovery-label,
.floating-field .peer:not(:placeholder-shown) ~ .recovery-label {
  transform: translateY(-0.72rem) scale(0.84);
  color: #38a169;
}

.floating-field .peer:focus,
.floating-field .peer:not(:placeholder-shown) {
  padding-top: 1.5rem;
  padding-bottom: 0.75rem;
}
</style>

