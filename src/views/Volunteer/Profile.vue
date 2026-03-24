<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="个人信息"
      title="维护你的志愿者档案"
      description="个人资料、服务偏好和通知方式会影响推荐任务与团队协作体验。"
      :meta-items="headerMeta"
    />

    <div class="volunteer-profile-studio grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div class="space-y-6">
        <VolunteerSectionCard
          title="志愿者名片"
          description="你的身份展示、等级和近期状态。"
          tone="accent"
        >
          <div class="space-y-6 text-white">
            <div class="flex items-center gap-4">
              <img
                v-if="avatarPreview"
                :src="avatarPreview"
                alt="头像"
                class="h-20 w-20 rounded-[1.5rem] object-cover"
              >
              <div
                v-else
                class="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/15 text-3xl font-black"
              >
                {{ userInitials }}
              </div>
              <div>
                <p class="text-2xl font-black">
                  {{ displayName }}
                </p>
                <p class="mt-1 text-sm text-emerald-100/85">
                  Lv.{{ volunteerLevel }} · 环保志愿者
                </p>
              </div>
            </div>

            <label class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              <CameraIcon class="h-4 w-4" />
              更换头像
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
              >
            </label>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-[1.25rem] bg-white/10 p-4">
                <p class="text-xs uppercase tracking-[0.2em] text-emerald-100/70">
                  当前积分
                </p>
                <p class="mt-2 text-2xl font-black">
                  {{ user?.points || 0 }}
                </p>
              </div>
              <div class="rounded-[1.25rem] bg-white/10 p-4">
                <p class="text-xs uppercase tracking-[0.2em] text-emerald-100/70">
                  累计时长
                </p>
                <p class="mt-2 text-2xl font-black">
                  {{ user?.totalHours || 0 }}h
                </p>
              </div>
            </div>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="资料状态"
          description="账户、资料、实名三块分开维护后，联调会更稳定。"
          tone="soft"
        >
          <ul class="space-y-3">
            <li
              v-for="item in profileHealthChecklist"
              :key="item.label"
              class="volunteer-surface-lift flex items-start justify-between gap-3 rounded-[1.1rem] border border-white/80 bg-white/90 px-4 py-3"
            >
              <div>
                <p class="text-sm font-semibold text-slate-900">
                  {{ item.label }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ item.detail }}
                </p>
              </div>
              <span
                class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ item.done ? '已完成' : '待完善' }}
              </span>
            </li>
          </ul>
        </VolunteerSectionCard>
      </div>

      <div class="space-y-6">
        <VolunteerSectionCard
          title="账户信息"
          description="单独通过账户信息接口维护用户名、邮箱和手机号。"
        >
          <div class="grid gap-4 md:grid-cols-2">
            <label class="text-sm font-medium text-slate-600">
              用户名
              <input
                v-model="accountForm.username"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none"
              >
            </label>
            <label class="text-sm font-medium text-slate-600">
              邮箱地址
              <input
                v-model="accountForm.email"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none"
              >
            </label>
            <label class="text-sm font-medium text-slate-600">
              手机号码
              <input
                v-model="accountForm.phone"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none"
              >
            </label>
          </div>
          <div class="mt-4 flex justify-end">
            <button
              class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              :disabled="accountSaving"
              @click="saveAccountChanges"
            >
              {{ accountSaving ? '保存中...' : '保存账户信息' }}
            </button>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="个人资料"
          description="这些资料通过志愿者资料接口维护，不再处理实名认证字段。"
          tone="soft"
        >
          <div class="grid gap-4 md:grid-cols-2">
            <label class="text-sm font-medium text-slate-600">
              性别
              <select
                v-model.number="profileForm.gender"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none"
              >
                <option :value="0">
                  未知
                </option>
                <option :value="1">
                  男
                </option>
                <option :value="2">
                  女
                </option>
              </select>
            </label>
            <label class="text-sm font-medium text-slate-600">
              生日
              <input
                v-model="profileForm.birthday"
                type="date"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none"
              >
            </label>
            <label class="text-sm font-medium text-slate-600 md:col-span-2">
              个人简介
              <textarea
                v-model="profileForm.introduction"
                rows="4"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none"
              />
            </label>
          </div>
          <div class="mt-4 flex justify-end">
            <button
              class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              :disabled="profileSaving"
              @click="saveProfileChanges"
            >
              {{ profileSaving ? '保存中...' : '保存个人资料' }}
            </button>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="实名认证"
          description="认证通过后，报名、签到等真实业务流程会更顺畅。"
          tone="soft"
        >
          <div class="space-y-4">
            <div class="volunteer-surface-lift flex items-start justify-between gap-4 rounded-[1.1rem] border border-white/80 bg-white/90 px-4 py-4">
              <div>
                <p class="text-sm font-semibold text-slate-900">
                  当前认证状态
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ auditStatusDescription }}
                </p>
                <p class="mt-2 text-xs text-slate-500">
                  当前实名：{{ verificationInfo?.realName || '未提交' }}
                </p>
              </div>
              <span
                class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                :class="auditStatusClass"
              >
                {{ auditStatusLabel }}
              </span>
            </div>

            <div
              v-if="canSubmitRealName"
              class="grid gap-4 md:grid-cols-2"
            >
              <label class="text-sm font-medium text-slate-600">
                真实姓名
                <input
                  v-model="realNameForm.realName"
                  class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none"
                  placeholder="请输入身份证上的真实姓名"
                >
              </label>
              <label class="text-sm font-medium text-slate-600">
                身份证号
                <input
                  v-model="realNameForm.idCard"
                  class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none"
                  placeholder="请输入 18 位身份证号"
                >
              </label>
            </div>

            <div
              v-if="canSubmitRealName"
              class="flex justify-end"
            >
              <button
                class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                :disabled="realNameSubmitting"
                @click="submitRealName"
              >
                {{ realNameSubmitting ? '提交中...' : '提交实名认证' }}
              </button>
            </div>
          </div>
        </VolunteerSectionCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { VOLUNTEER_AUDIT_STATUS_LABELS } from '@/constants/status'
import { useAuthStore } from '@/store/modules/auth'
import { useVolunteerStore } from '@/store/modules/volunteer'
import { useMessageStore } from '@/store/modules/messages'
import {
  VolunteerAuditStatus,
  type UpdateVolunteerAccountRequest,
  type UpdateVolunteerProfileRequest,
  type VolunteerRealNameSubmitRequest
} from '@/types/volunteer'
import { CameraIcon } from 'lucide-vue-next'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'

const authStore = useAuthStore()
const volunteerStore = useVolunteerStore()
const messageStore = useMessageStore()
const user = computed(() => authStore.user)
const profile = computed(() => volunteerStore.profile)
const accountInfo = computed(() => volunteerStore.accountInfo)
const verificationInfo = computed(() => volunteerStore.verification)
const avatarPreview = ref('')
const accountSaving = ref(false)
const profileSaving = ref(false)
const realNameSubmitting = ref(false)

const profileForm = reactive({
  gender: 0,
  birthday: '',
  avatarUrl: '',
  introduction: ''
})
const accountForm = reactive({
  username: '',
  email: '',
  phone: ''
})
const realNameForm = reactive<VolunteerRealNameSubmitRequest>({
  realName: '',
  idCard: ''
})

const displayName = computed(() => {
  if (auditStatus.value === VolunteerAuditStatus.APPROVED && verificationInfo.value?.realName) {
    return verificationInfo.value.realName
  }
  return accountInfo.value?.userName || user.value?.realName || user.value?.username || '志愿者'
})
const userInitials = computed(() => displayName.value.charAt(0))
const volunteerLevel = computed(() => Math.floor((user.value?.totalHours || 0) / 10) + 1)

const headerMeta = computed(() => [
  { label: '当前等级', value: `Lv.${volunteerLevel.value}`, detail: `${user.value?.points || 0} 当前积分` },
  { label: '实名认证', value: auditStatusLabel.value, detail: '审核状态来自实名信息' }
])

const profileHealthChecklist = computed(() => {
  const hasAccountInfo = Boolean(accountForm.username && accountForm.email && accountForm.phone)
  const hasBio = Boolean(profileForm.introduction && profileForm.introduction.trim().length >= 12)
  const hasVerification = auditStatus.value === VolunteerAuditStatus.APPROVED

  return [
    { label: '账户信息完整', detail: '用户名、邮箱、手机号由账户信息接口单独维护。', done: hasAccountInfo },
    { label: '个人简介已填写', detail: '建议说明你的长期服务意愿与擅长领域。', done: hasBio },
    { label: '实名认证已完成', detail: '实名通过后，报名与签到等流程会更顺畅。', done: hasVerification }
  ]
})

const auditStatus = computed(() => verificationInfo.value?.auditStatus ?? profile.value?.auditStatus ?? volunteerStore.realNameAudit?.status ?? VolunteerAuditStatus.UNVERIFIED)
const auditStatusLabel = computed(() => VOLUNTEER_AUDIT_STATUS_LABELS[auditStatus.value])
const auditStatusDescription = computed(() => {
  switch (auditStatus.value) {
    case VolunteerAuditStatus.PENDING:
      return '你的实名认证申请正在审核，请耐心等待结果。'
    case VolunteerAuditStatus.APPROVED:
      return '实名认证已通过，后续参与正式活动时会更顺畅。'
    case VolunteerAuditStatus.REJECTED:
      return '上次实名认证未通过，请核对信息后重新提交。'
    default:
      return '尚未提交实名认证，建议尽快补全以便参与完整业务流程。'
  }
})
const auditStatusClass = computed(() => {
  switch (auditStatus.value) {
    case VolunteerAuditStatus.PENDING:
      return 'bg-amber-100 text-amber-700'
    case VolunteerAuditStatus.APPROVED:
      return 'bg-emerald-100 text-emerald-700'
    case VolunteerAuditStatus.REJECTED:
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
})
const canSubmitRealName = computed(() => (
  auditStatus.value === VolunteerAuditStatus.UNVERIFIED
  || auditStatus.value === VolunteerAuditStatus.REJECTED
))

const syncForm = () => {
  profileForm.gender = profile.value?.gender ?? 0
  profileForm.birthday = profile.value?.birthday || ''
  profileForm.avatarUrl = profile.value?.avatarUrl || ''
  profileForm.introduction = profile.value?.introduction || profileForm.introduction || '长期参与社区环境改善与环保宣传，希望持续投入高质量项目。'
  accountForm.username = accountInfo.value?.userName || user.value?.username || ''
  accountForm.email = accountInfo.value?.email || user.value?.email || ''
  accountForm.phone = accountInfo.value?.phone || user.value?.phone || ''
  avatarPreview.value = profileForm.avatarUrl || avatarPreview.value
  realNameForm.realName = verificationInfo.value?.realName || ''
  realNameForm.idCard = verificationInfo.value?.idCard || ''
}

const handleAvatarUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.[0]) return
  const reader = new FileReader()
  reader.onload = (loadEvent) => {
    avatarPreview.value = String(loadEvent.target?.result || '')
  }
  reader.readAsDataURL(input.files[0])
}

const saveAccountChanges = async () => {
  const payload: UpdateVolunteerAccountRequest = {
    userName: accountForm.username.trim() || undefined,
    email: accountForm.email.trim() || undefined,
    phone: accountForm.phone.trim() || undefined
  }

  accountSaving.value = true
  try {
    await volunteerStore.updateMyAccount(payload)
    await authStore.updateProfile({
      username: payload.userName || user.value?.username,
      email: payload.email || user.value?.email,
      phone: payload.phone || user.value?.phone
    })
    messageStore.success('账户信息已更新')
  } catch (error: any) {
    console.error('保存账户信息失败:', error)
    messageStore.error(error.message || '保存账户信息失败，请稍后重试')
  } finally {
    accountSaving.value = false
  }
}

const saveProfileChanges = async () => {
  try {
    if (!user.value?.id) {
      messageStore.error('当前账号缺少志愿者标识，暂时无法保存')
      return
    }

    profileSaving.value = true
    const payload: UpdateVolunteerProfileRequest = {
      gender: profileForm.gender,
      birthday: profileForm.birthday || undefined,
      avatarUrl: avatarPreview.value || undefined,
      introduction: profileForm.introduction.trim() || undefined
    }
    await volunteerStore.updateMyProfile(user.value.id, payload)
    await authStore.updateProfile({
      avatarUrl: avatarPreview.value || user.value?.avatarUrl
    })
    messageStore.success('个人资料已更新')
  } catch (error: any) {
    console.error('保存个人资料失败:', error)
    messageStore.error(error.message || '保存个人资料失败，请稍后重试')
  } finally {
    profileSaving.value = false
  }
}

const submitRealName = async () => {
  if (!realNameForm.realName.trim()) {
    messageStore.error('请输入真实姓名')
    return
  }
  if (!/^\d{17}[\dXx]$/.test(realNameForm.idCard.trim())) {
    messageStore.error('请输入有效的 18 位身份证号')
    return
  }

  realNameSubmitting.value = true
  try {
    realNameForm.realName = realNameForm.realName.trim()
    realNameForm.idCard = realNameForm.idCard.trim().toUpperCase()
    await volunteerStore.submitRealName(realNameForm)
    messageStore.success('实名认证信息已提交，请等待审核')
  } catch (error: any) {
    console.error('提交实名认证失败:', error)
    messageStore.error(error.message || '提交实名认证失败，请稍后重试')
  } finally {
    realNameSubmitting.value = false
  }
}

onMounted(async () => {
  if (user.value?.id && !profile.value) {
    try {
      await volunteerStore.fetchMyProfile(user.value.id)
    } catch (error) {
      console.error('加载志愿者资料失败:', error)
    }
  }
  syncForm()
})
</script>
