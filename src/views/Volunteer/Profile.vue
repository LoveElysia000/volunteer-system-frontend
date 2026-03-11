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
                  {{ formData.realName || '志愿者' }}
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
                v-model="formData.realName"
                :disabled="!isEditing"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none disabled:bg-slate-100"
              >
            </label>
            <label class="text-sm font-medium text-slate-600">
              用户名
              <input
                v-model="formData.username"
                :disabled="!isEditing"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none disabled:bg-slate-100"
              >
            </label>
            <label class="text-sm font-medium text-slate-600">
              邮箱地址
              <input
                v-model="formData.email"
                :disabled="!isEditing"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none disabled:bg-slate-100"
              >
            </label>
            <label class="text-sm font-medium text-slate-600">
              手机号码
              <input
                v-model="formData.phone"
                :disabled="!isEditing"
                class="input mt-2 rounded-2xl border-slate-200 bg-slate-50 shadow-none disabled:bg-slate-100"
              >
            </label>
            <label class="text-sm font-medium text-slate-600 md:col-span-2">
              个人简介
              <textarea
                v-model="formData.bio"
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
              :class="formData.preferences.includes(pref) ? 'bg-emerald-600 text-white shadow-[0_10px_24px_-16px_rgba(5,150,105,0.9)]' : 'border border-slate-200 bg-white text-slate-600'"
              :disabled="!isEditing"
              @click="togglePreference(pref)"
            >
              {{ pref }}
            </button>
          </div>
        </VolunteerSectionCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { CameraIcon } from 'lucide-vue-next'
import VolunteerPageHeader from '@/components/volunteer/VolunteerPageHeader.vue'
import VolunteerSectionCard from '@/components/volunteer/VolunteerSectionCard.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isEditing = ref(false)
const avatarPreview = ref('')

const formData = reactive({
  realName: '',
  username: '',
  email: '',
  phone: '',
  bio: '',
  preferences: ['环保宣传', '公园清洁'] as string[]
})

const activityPreferences = ['环保宣传', '垃圾分类', '公园清洁', '植树造林', '动物保护', '水资源保护']
const userInitials = computed(() => (formData.realName || user.value?.realName || '志愿者').charAt(0))
const volunteerLevel = computed(() => Math.floor((user.value?.totalHours || 0) / 10) + 1)

const headerMeta = computed(() => [
  { label: '当前等级', value: `Lv.${volunteerLevel.value}`, detail: `${user.value?.points || 0} 当前积分` },
  { label: '个人资料', value: isEditing.value ? '编辑中' : '已保存', detail: '建议保持资料最新' }
])

const profileHealthChecklist = computed(() => {
  const hasBaseProfile = Boolean(formData.realName && formData.email && formData.phone)
  const hasBio = Boolean(formData.bio && formData.bio.trim().length >= 12)
  const hasPreferences = formData.preferences.length >= 2

  return [
    { label: '基础资料完整', detail: '姓名、邮箱、手机号建议保持最新。', done: hasBaseProfile },
    { label: '个人简介已填写', detail: '建议说明你的长期服务意愿与擅长领域。', done: hasBio },
    { label: '活动偏好已配置', detail: '至少保留 2 个偏好以提高推荐命中率。', done: hasPreferences }
  ]
})

const syncForm = () => {
  formData.realName = user.value?.realName || ''
  formData.username = user.value?.username || ''
  formData.email = user.value?.email || ''
  formData.phone = user.value?.phone || ''
  formData.bio = formData.bio || '长期参与社区环境改善与环保宣传，希望持续投入高质量项目。'
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
  await authStore.updateProfile({
    realName: formData.realName,
    email: formData.email,
    phone: formData.phone
  })
  isEditing.value = false
}

const togglePreference = (preference: string) => {
  if (!isEditing.value) return
  const index = formData.preferences.indexOf(preference)
  if (index >= 0) {
    formData.preferences.splice(index, 1)
    return
  }
  formData.preferences.push(preference)
}

onMounted(syncForm)
</script>
