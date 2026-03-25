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

            <div class="space-y-4">
              <span class="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-primary-200">
                Join the movement
              </span>
              <h2 class="max-w-lg text-5xl font-extrabold leading-[1.08] tracking-tight">
                一起成长，
                一起守护更好的绿色世界。
              </h2>
              <p class="max-w-lg text-base leading-7 text-white/75">
                连接志愿者、组织与环保行动。你只需要完成一次注册，就能开始参与活动、积累服务时长并建立个人公益档案。
              </p>
            </div>

            <div class="relative mt-10 overflow-hidden rounded-[30px] border border-white/15 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-sm">
              <div class="absolute inset-0 bg-gradient-to-tr from-primary-300/15 via-transparent to-white/5" />
              <img
                class="h-[460px] w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLdFe2K23O0jPUxblVCuUTrew-OH8Zew8BZaaiIwa5C-Wwj0fyyMujfIkD7dHpL0I_XBLTbEf7MaYaXhls69U5GPZxZ4ojxaY0aeUJP4FDqx_YQVJaTT0qeyFblCZOxW5LPSZFv9uO3t-QenJbPbNucBb6Z9zcd3cWDTHztA04B9sG0tb4oOXGEPQ4VFSOpZFeROr6WM1VaW87E7jUTrU_icNvRJxmv3GRkVDkCS425cPpHAcwyFwvSoGr-IDg4pEpdznOqpwgBZzp"
                alt="环保志愿者种植树苗"
              >

              <div class="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-white/90 p-4 text-slate-900 shadow-lg shadow-black/10 backdrop-blur">
                <div class="flex items-center gap-3">
                  <div class="flex -space-x-2">
                    <div class="h-9 w-9 rounded-full border-2 border-white bg-slate-200" />
                    <div class="h-9 w-9 rounded-full border-2 border-white bg-primary-400" />
                    <div class="h-9 w-9 rounded-full border-2 border-white bg-slate-400" />
                  </div>
                  <p class="text-sm font-semibold leading-6 text-slate-700">
                    今天已有 12 位志愿者在你附近参与环保行动。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-12 grid grid-cols-3 gap-4">
            <div class="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p class="text-2xl font-extrabold">
                50k+
              </p>
              <p class="mt-1 text-sm text-white/70">
                注册志愿者
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
                <div class="h-full w-3/4 rounded-r-full bg-primary-400" />
              </div>

              <div class="p-6 sm:p-8 lg:p-10">
                <div class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-primary-700/80">
                      Create Account
                    </p>
                    <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                      开始你的绿色行动旅程
                    </h2>
                    <p class="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                      页面按你给出的模板重构，但不会改动当前项目的注册字段与接口参数。只需要填写一次，就可以完成账号创建。
                    </p>
                  </div>

                  <div class="rounded-2xl bg-primary-50 px-4 py-3 text-right">
                    <p class="text-xs font-bold uppercase tracking-[0.3em] text-primary-700">
                      Step 1 of 1
                    </p>
                    <p class="mt-1 text-sm text-primary-900">
                      Almost there!
                    </p>
                  </div>
                </div>

                <form
                  class="space-y-8"
                  @submit.prevent="handleRegister"
                >
                  <section class="space-y-4">
                    <div class="flex items-center justify-between gap-4">
                      <div>
                        <h3 class="text-lg font-bold text-slate-900">
                          注册身份
                        </h3>
                        <p class="mt-1 text-sm text-slate-500">
                          身份会影响下方需要补充的字段与提交参数。
                        </p>
                      </div>
                      <span class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        必填项保留不变
                      </span>
                    </div>

                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        :class="roleCardClass(UserIdentity.VOLUNTEER)"
                        @click="selectRole(UserIdentity.VOLUNTEER)"
                      >
                        <UserRoundIcon class="h-5 w-5" />
                        <div class="text-left">
                          <p class="font-bold">
                            志愿者
                          </p>
                          <p class="mt-1 text-xs text-current/70">
                            用于个人报名活动、记录服务与成长。
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        :class="roleCardClass(UserIdentity.ORGANIZATION)"
                        @click="selectRole(UserIdentity.ORGANIZATION)"
                      >
                        <Building2Icon class="h-5 w-5" />
                        <div class="text-left">
                          <p class="font-bold">
                            组织管理者
                          </p>
                          <p class="mt-1 text-xs text-current/70">
                            用于发布活动、管理成员与组织信息。
                          </p>
                        </div>
                      </button>
                    </div>

                    <p
                      v-if="errors.role"
                      class="text-sm font-medium text-rose-500"
                    >
                      {{ errors.role }}
                    </p>
                  </section>

                  <section class="space-y-5">
                    <div class="flex items-center justify-between gap-4">
                      <div>
                        <h3 class="text-lg font-bold text-slate-900">
                          账号信息
                        </h3>
                        <p class="mt-1 text-sm text-slate-500">
                          用于登录和联系，请保持真实有效。
                        </p>
                      </div>
                      <span class="section-chip">Account</span>
                    </div>

                    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div class="field-shell">
                        <label
                          for="username"
                          class="field-label"
                        >用户名</label>
                        <div
                          class="input-shell"
                          :class="{ 'input-shell-error': errors.username }"
                        >
                          <UserRoundIcon class="field-icon" />
                          <input
                            id="username"
                            v-model="form.username"
                            type="text"
                            class="field-input"
                            placeholder="请输入用户名"
                            @blur="() => handleBlur('username')"
                          >
                        </div>
                        <p
                          v-if="errors.username"
                          class="field-error"
                        >
                          {{ errors.username }}
                        </p>
                      </div>

                      <div class="field-shell">
                        <label
                          for="realName"
                          class="field-label"
                        >真实姓名</label>
                        <div
                          class="input-shell"
                          :class="{ 'input-shell-error': errors.name }"
                        >
                          <BadgeCheckIcon class="field-icon" />
                          <input
                            id="realName"
                            v-model="form.name"
                            type="text"
                            class="field-input"
                            placeholder="请输入真实姓名"
                            @blur="() => handleBlur('name')"
                          >
                        </div>
                        <p
                          v-if="errors.name"
                          class="field-error"
                        >
                          {{ errors.name }}
                        </p>
                      </div>

                      <div class="field-shell">
                        <label
                          for="email"
                          class="field-label"
                        >邮箱地址</label>
                        <div
                          class="input-shell"
                          :class="{ 'input-shell-error': errors.email }"
                        >
                          <MailIcon class="field-icon" />
                          <input
                            id="email"
                            v-model="form.email"
                            type="email"
                            class="field-input"
                            placeholder="请输入邮箱地址"
                            @blur="() => handleBlur('email')"
                          >
                        </div>
                        <p
                          v-if="errors.email"
                          class="field-error"
                        >
                          {{ errors.email }}
                        </p>
                      </div>

                      <div class="field-shell">
                        <label
                          for="phone"
                          class="field-label"
                        >手机号</label>
                        <div
                          class="input-shell"
                          :class="{ 'input-shell-error': errors.phone }"
                        >
                          <PhoneIcon class="field-icon" />
                          <input
                            id="phone"
                            v-model="form.phone"
                            type="tel"
                            class="field-input"
                            placeholder="请输入手机号"
                            @blur="() => handleBlur('phone')"
                          >
                        </div>
                        <p
                          v-if="errors.phone"
                          class="field-error"
                        >
                          {{ errors.phone }}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-5">
                    <div class="flex items-center justify-between gap-4">
                      <div>
                        <h3 class="text-lg font-bold text-slate-900">
                          安全设置
                        </h3>
                        <p class="mt-1 text-sm text-slate-500">
                          请设置登录密码，当前规则与原页面保持一致。
                        </p>
                      </div>
                      <span class="section-chip">Security</span>
                    </div>

                    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div class="field-shell">
                        <label
                          for="password"
                          class="field-label"
                        >密码</label>
                        <div
                          class="input-shell"
                          :class="{ 'input-shell-error': errors.password }"
                        >
                          <LockIcon class="field-icon" />
                          <input
                            id="password"
                            v-model="form.password"
                            :type="passwordVisible ? 'text' : 'password'"
                            class="field-input pr-14"
                            placeholder="请输入密码"
                            @blur="() => handleBlur('password')"
                          >
                          <button
                            type="button"
                            class="toggle-button"
                            @click="passwordVisible = !passwordVisible"
                          >
                            <component
                              :is="passwordVisible ? EyeOffIcon : EyeIcon"
                              class="h-5 w-5"
                            />
                          </button>
                        </div>
                        <p class="field-helper">
                          至少 6 位字符。
                        </p>
                        <p
                          v-if="errors.password"
                          class="field-error"
                        >
                          {{ errors.password }}
                        </p>
                      </div>

                      <div class="field-shell">
                        <label
                          for="confirmPassword"
                          class="field-label"
                        >确认密码</label>
                        <div
                          class="input-shell"
                          :class="{ 'input-shell-error': errors.confirmPassword }"
                        >
                          <ShieldCheckIcon class="field-icon" />
                          <input
                            id="confirmPassword"
                            v-model="form.confirmPassword"
                            :type="confirmPasswordVisible ? 'text' : 'password'"
                            class="field-input pr-14"
                            placeholder="请再次输入密码"
                            @blur="() => handleBlur('confirmPassword')"
                          >
                          <button
                            type="button"
                            class="toggle-button"
                            @click="confirmPasswordVisible = !confirmPasswordVisible"
                          >
                            <component
                              :is="confirmPasswordVisible ? EyeOffIcon : EyeIcon"
                              class="h-5 w-5"
                            />
                          </button>
                        </div>
                        <p
                          v-if="errors.confirmPassword"
                          class="field-error"
                        >
                          {{ errors.confirmPassword }}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-5">
                    <div class="flex items-center justify-between gap-4">
                      <div>
                        <h3 class="text-lg font-bold text-slate-900">
                          补充资料
                        </h3>
                        <p class="mt-1 text-sm text-slate-500">
                          {{ isVolunteer ? '志愿者需要补充年龄和性别。' : '组织管理者需要补充组织名称。' }}
                        </p>
                      </div>
                      <span class="section-chip">Profile</span>
                    </div>

                    <div
                      v-if="isVolunteer"
                      class="grid grid-cols-1 gap-5 md:grid-cols-2"
                    >
                      <div class="field-shell">
                        <label
                          for="age"
                          class="field-label"
                        >年龄</label>
                        <div
                          class="input-shell"
                          :class="{ 'input-shell-error': errors.age }"
                        >
                          <CalendarIcon class="field-icon" />
                          <input
                            id="age"
                            v-model.number="form.age"
                            type="number"
                            class="field-input"
                            placeholder="请输入年龄"
                            @blur="() => handleBlur('age')"
                          >
                        </div>
                        <p
                          v-if="errors.age"
                          class="field-error"
                        >
                          {{ errors.age }}
                        </p>
                      </div>

                      <div class="field-shell">
                        <label
                          for="gender"
                          class="field-label"
                        >性别</label>
                        <div class="mt-2">
                          <FilterSelect
                            :model-value="form.gender"
                            :icon="UsersIcon"
                            :options="genderOptions"
                            placeholder="请选择性别"
                            theme="emerald"
                            :error="errors.gender"
                            @update:model-value="updateGender"
                          />
                        </div>
                        <p
                          v-if="errors.gender"
                          class="field-error"
                        >
                          {{ errors.gender }}
                        </p>
                      </div>
                    </div>

                    <div
                      v-else
                      class="grid grid-cols-1 gap-5 md:grid-cols-2"
                    >
                      <div class="field-shell">
                        <label
                          for="organization"
                          class="field-label"
                        >组织名称</label>
                        <div
                          class="input-shell"
                          :class="{ 'input-shell-error': errors.organizationName }"
                        >
                          <Building2Icon class="field-icon" />
                          <input
                            id="organization"
                            v-model="form.organizationName"
                            type="text"
                            class="field-input"
                            placeholder="请输入组织名称"
                            @blur="() => handleBlur('organizationName')"
                          >
                        </div>
                        <p
                          v-if="errors.organizationName"
                          class="field-error"
                        >
                          {{ errors.organizationName }}
                        </p>
                      </div>

                      <div class="field-shell">
                        <label
                          for="organizationCode"
                          class="field-label"
                        >统一社会信用代码</label>
                        <div
                          class="input-shell"
                          :class="{ 'input-shell-error': errors.code }"
                        >
                          <BadgeCheckIcon class="field-icon" />
                          <input
                            id="organizationCode"
                            v-model="form.code"
                            type="text"
                            class="field-input"
                            placeholder="请输入统一社会信用代码"
                            @blur="() => handleBlur('code')"
                          >
                        </div>
                        <p
                          v-if="errors.code"
                          class="field-error"
                        >
                          {{ errors.code }}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section class="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                    <div class="flex items-start gap-3">
                      <input
                        id="agreement"
                        v-model="form.agreement"
                        type="checkbox"
                        class="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        @blur="() => handleBlur('agreement')"
                      >
                      <label
                        for="agreement"
                        class="text-sm leading-6 text-slate-600"
                      >
                        我已阅读并同意
                        <a
                          href="#"
                          class="font-semibold text-primary-700 transition hover:text-primary-600 hover:underline"
                        >用户协议</a>
                        和
                        <a
                          href="#"
                          class="font-semibold text-primary-700 transition hover:text-primary-600 hover:underline"
                        >隐私政策</a>
                      </label>
                    </div>
                    <p
                      v-if="errors.agreement"
                      class="field-error"
                    >
                      {{ errors.agreement }}
                    </p>
                  </section>

                  <div class="space-y-5 pt-2">
                    <button
                      type="submit"
                      class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-400 px-6 py-4 text-base font-bold text-slate-900 shadow-lg shadow-primary-400/20 transition hover:bg-primary-300 disabled:cursor-not-allowed disabled:opacity-70"
                      :disabled="loading || !isFormValid"
                    >
                      <span
                        v-if="loading"
                        class="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/25 border-t-slate-900"
                      />
                      <template v-if="loading">
                        注册中...
                      </template>
                      <template v-else>
                        完成注册
                        <ArrowRightIcon class="h-5 w-5" />
                      </template>
                    </button>

                    <div class="flex flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
                      <p>
                        已有账号？
                        <router-link
                          to="/login"
                          class="font-bold text-primary-700 transition hover:text-primary-600 hover:underline"
                        >
                          立即登录
                        </router-link>
                      </p>
                      <p class="text-xs text-slate-400">
                        当前注册参数与后端接口保持一致
                      </p>
                    </div>
                  </div>
                </form>
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
            <router-link
              to="/login"
              class="transition hover:text-primary-700"
            >
              登录入口
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import FilterSelect from '@/components/ui/FilterSelect.vue'
import { useAuthStore } from '@/store/modules/auth'
import { useMessageStore } from '@/store/modules/messages'
import { UserIdentity, type VolunteerRegisterRequest, type OrganizationRegisterRequest } from '@/types/auth'
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  Building2Icon,
  CalendarIcon,
  EyeIcon,
  EyeOffIcon,
  HomeIcon,
  LeafIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserRoundIcon,
  UsersIcon
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()

type RegisterForm = {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  name: string
  age: number | null
  gender: string
  organizationName: string
  code: string
  role: UserIdentity
  agreement: boolean
}

type RegisterFormField = keyof RegisterForm

const form = ref<RegisterForm>({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  name: '',
  age: null,
  gender: '',
  organizationName: '',
  code: '',
  role: UserIdentity.VOLUNTEER,
  agreement: false
})

const errors = reactive<Record<RegisterFormField, string>>({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  name: '',
  age: '',
  gender: '',
  organizationName: '',
  code: '',
  role: '',
  agreement: ''
})

const genderOptions = [
  { value: '', label: '请选择性别', description: '选择后用于完善志愿者档案' },
  { value: '男', label: '男', description: '男性' },
  { value: '女', label: '女', description: '女性' },
  { value: '其他', label: '其他', description: '其他/不便透露' }
] as const

const touched = reactive<Record<RegisterFormField, boolean>>({
  username: false,
  email: false,
  phone: false,
  password: false,
  confirmPassword: false,
  name: false,
  age: false,
  gender: false,
  organizationName: false,
  code: false,
  role: false,
  agreement: false
})

const updateGender = (value: string | number | boolean | null | undefined) => {
  form.value.gender = typeof value === 'string' ? value : ''
  handleBlur('gender')
}

const loading = ref(false)
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

const isVolunteer = computed(() => form.value.role === UserIdentity.VOLUNTEER)

const validateField = (field: RegisterFormField) => {
  switch (field) {
    case 'username':
      if (!form.value.username.trim()) return '*用户名必须填写'
      if (form.value.username.length < 3) return '*用户名至少3个字符'
      if (!/^[a-zA-Z0-9_]+$/.test(form.value.username)) return '*用户名只能包含字母、数字和下划线'
      return ''
    case 'email':
      if (!form.value.email.trim()) return '*邮箱地址必须填写'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) return '*请输入有效的邮箱地址'
      return ''
    case 'phone':
      if (!form.value.phone.trim()) return '*手机号必须填写'
      if (!/^1[3-9]\d{9}$/.test(form.value.phone)) return '*请输入有效的手机号码'
      return ''
    case 'password':
      if (!form.value.password) return '*密码必须填写'
      if (form.value.password.length < 6) return '*密码至少6个字符'
      return ''
    case 'confirmPassword':
      if (!form.value.confirmPassword) return '*请确认密码'
      if (form.value.confirmPassword !== form.value.password) return '*两次输入的密码不一致'
      return ''
    case 'name':
      if (!form.value.name.trim()) return '*真实姓名必须填写'
      return ''
    case 'age':
      if (form.value.role !== UserIdentity.VOLUNTEER) return ''
      if (form.value.age === null || Number.isNaN(form.value.age)) return '*年龄必须填写'
      if (form.value.age < 1 || form.value.age > 120) return '*请输入有效的年龄(1-120)'
      return ''
    case 'gender':
      if (form.value.role !== UserIdentity.VOLUNTEER) return ''
      if (!form.value.gender.trim()) return '*性别必须选择'
      return ''
    case 'organizationName':
      if (form.value.role === UserIdentity.ORGANIZATION && !form.value.organizationName.trim()) return '*组织名称必须填写'
      return ''
    case 'code':
      if (form.value.role !== UserIdentity.ORGANIZATION) return ''
      if (!form.value.code.trim()) return '*统一社会信用代码必须填写'
      return ''
    case 'role':
      if (!form.value.role) return '*注册身份必须选择'
      return ''
    case 'agreement':
      if (!form.value.agreement) return '*请同意用户协议和隐私政策'
      return ''
    default:
      return ''
  }
}

const validateForm = () => {
  (Object.keys(errors) as RegisterFormField[]).forEach(field => {
    if (touched[field]) {
      errors[field] = validateField(field)
    }
  })
}

const handleBlur = (field: RegisterFormField) => {
  touched[field] = true
  errors[field] = validateField(field)
}

watch(form, validateForm, { deep: true })

const isFormValid = computed(() => {
  const baseValid = Object.values(errors).every(error => !error) &&
    form.value.username &&
    form.value.email &&
    form.value.phone &&
    form.value.password &&
    form.value.confirmPassword &&
    form.value.name &&
    form.value.role &&
    form.value.agreement

  if (form.value.role === UserIdentity.ORGANIZATION) {
    return Boolean(baseValid && form.value.organizationName && form.value.code)
  }

  return Boolean(baseValid && form.value.age !== null && form.value.gender)
})

const roleCardClass = (role: UserIdentity) => {
  const active = form.value.role === role
  return [
    'flex items-start gap-3 rounded-2xl border px-5 py-4 text-left transition',
    active
      ? 'border-primary-400 bg-primary-50 text-primary-900 shadow-sm shadow-primary-200/60'
      : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-800'
  ]
}

const selectRole = (role: UserIdentity) => {
  form.value.role = role
  touched.role = true
  errors.role = validateField('role')

  if (role === UserIdentity.VOLUNTEER) {
    form.value.organizationName = ''
    form.value.code = ''
    errors.organizationName = ''
    errors.code = ''
    touched.organizationName = false
    touched.code = false
  } else {
    form.value.age = null
    form.value.gender = ''
    errors.age = ''
    errors.gender = ''
    touched.age = false
    touched.gender = false
  }
}

const handleRegister = async () => {
  (Object.keys(touched) as RegisterFormField[]).forEach(field => {
    touched[field] = true
  })
  validateForm()

  if (!isFormValid.value) {
    messageStore.warning('请先完整填写并修正注册信息。')
    return
  }

  loading.value = true

  try {
    let response
    if (form.value.role === UserIdentity.VOLUNTEER) {
      const registerData: VolunteerRegisterRequest = {
        userName: form.value.username,
        name: form.value.name.trim(),
        phone: form.value.phone,
        email: form.value.email,
        password: form.value.password,
        age: form.value.age ?? 0,
        gender: form.value.gender
      }
      response = await authStore.registerVolunteer(registerData)
    } else {
      const registerData: OrganizationRegisterRequest = {
        userName: form.value.username,
        name: form.value.name.trim(),
        phone: form.value.phone,
        email: form.value.email,
        password: form.value.password,
        organizationName: form.value.organizationName.trim(),
        code: form.value.code.trim()
      }
      response = await authStore.registerOrganization(registerData)
    }

    if (response.code === 200) {
      messageStore.success('注册成功，正在跳转登录页。')
      router.push('/login')
    } else {
      messageStore.error(`注册失败: ${response.msg}`)
    }
  } catch (error: any) {
    console.error('注册失败:', error)
    const errorMsg = error.response?.data?.msg || error.message || '注册失败，请稍后重试'
    messageStore.error(`注册失败: ${errorMsg}`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:global(body) {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.section-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background: #ecfdf5;
  padding: 0.45rem 0.9rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #047857;
}

.field-shell {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.field-label {
  padding-left: 0.2rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: #334155;
}

.input-shell {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.input-shell:focus-within {
  border-color: rgb(17 212 173 / 0.75);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgb(17 212 173 / 0.12);
}

.input-shell-error {
  border-color: rgb(244 63 94 / 0.55);
  box-shadow: 0 0 0 4px rgb(244 63 94 / 0.08);
}

.field-icon {
  pointer-events: none;
  position: absolute;
  left: 1rem;
  height: 1.1rem;
  width: 1.1rem;
  color: #94a3b8;
}

.field-input {
  width: 100%;
  border: 0;
  background: transparent;
  border-radius: inherit;
  padding: 0.95rem 1rem 0.95rem 2.95rem;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
}

.field-input::placeholder {
  color: #94a3b8;
}

.field-input:-webkit-autofill,
.field-input:-webkit-autofill:hover,
.field-input:-webkit-autofill:focus {
  -webkit-text-fill-color: #0f172a;
  border-radius: inherit;
  -webkit-box-shadow: 0 0 0 1000px #f8fafc inset;
  box-shadow: 0 0 0 1000px #f8fafc inset;
  background-clip: padding-box;
  transition: background-color 9999s ease-out 0s;
}

.input-shell:focus-within .field-input:-webkit-autofill,
.input-shell:focus-within .field-input:-webkit-autofill:hover,
.input-shell:focus-within .field-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
  box-shadow: 0 0 0 1000px #ffffff inset;
}

.toggle-button {
  position: absolute;
  right: 0.95rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  transition: color 0.2s ease;
}

.toggle-button:hover {
  color: #0f766e;
}

.field-helper {
  padding-left: 0.2rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.field-error {
  padding-left: 0.2rem;
  font-size: 0.84rem;
  font-weight: 600;
  color: #f43f5e;
}
</style>
