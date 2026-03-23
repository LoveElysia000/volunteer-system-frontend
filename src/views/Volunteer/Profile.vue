<template>
  <div class="space-y-6">
    <VolunteerPageHeader
      eyebrow="个人信息"
      title="维护你的志愿者档案"
      description="个人资料、服务偏好和通知方式会影响推荐任务与团队协作体验。"
      :meta-items="headerMeta"
    >
      <template #actions>
        <button
          v-if="!isEditing"
          class="volunteer-toolbar-button"
          @click="startEditing"
        >
          编辑资料
        </button>
        <template v-else>
          <button
            class="volunteer-toolbar-button"
            @click="cancelEditing"
          >
            取消
          </button>
          <button
            class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            @click="saveChanges"
          >
            保存更改
          </button>
        </template>
      </template>
    </VolunteerPageHeader>

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
                  {{ profileForm.realName || '志愿者' }}
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
          title="档案健康度"
          description="这三项越完整，平台推荐会越精准。"
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
          title="基础资料"
          description="这些资料会影响活动推荐和团队协作。"
        >
          <div class="grid gap-4 md:grid-cols-2">
            <label class="text-sm font-medium text-slate-600">
              真实姓名
              <input
                v-model="profileForm.realName"
                :disabled="!isEditing"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none disabled:bg-slate-100"
              >
            </label>
            <label class="text-sm font-medium text-slate-600">
              用户名
              <input
                v-model="accountForm.username"
                :disabled="!isEditing"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none disabled:bg-slate-100"
              >
            </label>
            <label class="text-sm font-medium text-slate-600">
              邮箱地址
              <input
                v-model="accountForm.email"
                :disabled="!isEditing"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none disabled:bg-slate-100"
              >
            </label>
            <label class="text-sm font-medium text-slate-600">
              手机号码
              <input
                v-model="accountForm.phone"
                :disabled="!isEditing"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none disabled:bg-slate-100"
              >
            </label>
            <label class="text-sm font-medium text-slate-600 md:col-span-2">
              个人简介
              <textarea
                v-model="profileForm.introduction"
                :disabled="!isEditing"
                rows="4"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none disabled:bg-slate-100"
              />
            </label>
          </div>
        </VolunteerSectionCard>

        <VolunteerSectionCard
          title="活动偏好"
          description="这些偏好用于推荐更适合你的任务类型。"
          tone="soft"
        >
          <div class="flex flex-wrap gap-2">
            <button
              v-for="pref in activityPreferences"
              :key="pref"
              class="rounded-full px-4 py-2 text-sm font-semibold transition"
              :class="accountForm.preferences.includes(pref) ? 'bg-emerald-600 text-white shadow-[0_10px_24px_-16px_rgba(5,150,105,0.9)]' : 'border border-slate-200 bg-white text-slate-600'"
              :disabled="!isEditing"
              @click="togglePreference(pref)"
            >
              {{ pref }}
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
const isEditing = ref(false)
const avatarPreview = ref('')
const realNameSubmitting = ref(false)

const profileForm = reactive<Required<UpdateVolunteerProfileRequest>>({
  realName: '',
  gender: 0,
  birthday: '',
  avatarUrl: '',
  introduction: ''
})
const accountForm = reactive({
  username: '',
  email: '',
  phone: '',
  preferences: ['环保宣传', '公园清洁'] as string[]
})
const realNameForm = reactive<VolunteerRealNameSubmitRequest>({
  realName: '',
  idCard: ''
})

const activityPreferences = ['环保宣传', '垃圾分类', '公园清洁', '植树造林', '动物保护', '水资源保护']
const userInitials = computed(() => (profileForm.realName || user.value?.realName || '志愿者').charAt(0))
const volunteerLevel = computed(() => Math.floor((user.value?.totalHours || 0) / 10) + 1)

const headerMeta = computed(() => [
  { label: '当前等级', value: `Lv.${volunteerLevel.value}`, detail: `${user.value?.points || 0} 当前积分` },
  { label: '个人资料', value: isEditing.value ? '编辑中' : '已保存', detail: '建议保持资料最新' }
])

const profileHealthChecklist = computed(() => {
  const hasBaseProfile = Boolean(profileForm.realName && accountForm.email && accountForm.phone)
  const hasBio = Boolean(profileForm.introduction && profileForm.introduction.trim().length >= 12)
  const hasPreferences = accountForm.preferences.length >= 2

  return [
    { label: '基础资料完整', detail: '姓名、邮箱、手机号建议保持最新。', done: hasBaseProfile },
    { label: '个人简介已填写', detail: '建议说明你的长期服务意愿与擅长领域。', done: hasBio },
    { label: '活动偏好已配置', detail: '至少保留 2 个偏好以提高推荐命中率。', done: hasPreferences }
  ]
})

const auditStatus = computed(() => profile.value?.auditStatus ?? volunteerStore.realNameAudit?.status ?? VolunteerAuditStatus.UNVERIFIED)
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
  profileForm.realName = profile.value?.realName || user.value?.realName || ''
  profileForm.gender = profile.value?.gender ?? 0
  profileForm.birthday = profile.value?.birthday || ''
  profileForm.avatarUrl = profile.value?.avatarUrl || ''
  profileForm.introduction = profile.value?.introduction || profileForm.introduction || '长期参与社区环境改善与环保宣传，希望持续投入高质量项目。'
  accountForm.username = user.value?.username || ''
  accountForm.email = user.value?.email || ''
  accountForm.phone = user.value?.phone || ''
  avatarPreview.value = profileForm.avatarUrl || avatarPreview.value
  realNameForm.realName = profile.value?.realName || profileForm.realName
  realNameForm.idCard = profile.value?.idCard || ''
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

const startEditing = () => {
  isEditing.value = true
  syncForm()
}

const cancelEditing = () => {
  isEditing.value = false
  syncForm()
}

const saveChanges = async () => {
  try {
    if (user.value?.id) {
      const payload: UpdateVolunteerProfileRequest = {
        ...profileForm,
        realName: profileForm.realName.trim(),
        avatarUrl: avatarPreview.value || undefined,
        introduction: profileForm.introduction.trim()
      }
      await volunteerStore.updateMyProfile(user.value.id, payload)
    }

    await authStore.updateProfile({
      realName: profileForm.realName,
      email: accountForm.email,
      phone: accountForm.phone,
      avatarUrl: avatarPreview.value || user.value?.avatarUrl
    })

    messageStore.success('个人资料已更新')
    isEditing.value = false
  } catch (error: any) {
    console.error('保存个人资料失败:', error)
    messageStore.error(error.message || '保存个人资料失败，请稍后重试')
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
    profileForm.realName = realNameForm.realName
    await authStore.updateProfile({
      realName: realNameForm.realName
    })
    messageStore.success('实名认证信息已提交，请等待审核')
  } catch (error: any) {
    console.error('提交实名认证失败:', error)
    messageStore.error(error.message || '提交实名认证失败，请稍后重试')
  } finally {
    realNameSubmitting.value = false
  }
}

const togglePreference = (preference: string) => {
  if (!isEditing.value) return
  const index = accountForm.preferences.indexOf(preference)
  if (index >= 0) {
    accountForm.preferences.splice(index, 1)
    return
  }
  accountForm.preferences.push(preference)
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
