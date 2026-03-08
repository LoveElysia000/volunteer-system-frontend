<template>
  <div class="space-y-8">
    <!-- 页面标题 -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          个人信息
        </h1>
        <p class="mt-2 text-lg text-gray-600">
          管理您的个人资料和账户设置
        </p>
      </div>
    </div>

    <!-- 个人信息表单 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左侧：头像和基本信息 -->
      <div class="lg:col-span-1">
        <!-- 头像设置 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="text-center space-y-4">
            <div class="relative inline-block">
              <img
                v-if="avatarPreview"
                :src="avatarPreview"
                class="h-24 w-24 rounded-full object-cover mx-auto"
                alt="头像"
              >
              <div
                v-else
                class="h-24 w-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto"
              >
                {{ userInitials }}
              </div>

              <!-- 上传按钮 -->
              <label
                for="avatar-upload"
                class="absolute bottom-0 right-0 h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-primary-600 transition-colors"
              >
                <CameraIcon class="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                >
              </label>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ formData.realName || '志愿者' }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                志愿者
              </p>
            </div>

            <!-- 积分和等级 -->
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <p class="text-2xl font-bold text-primary-600">
                  {{ user?.points || 0 }}
                </p>
                <p class="text-xs text-gray-500">
                  当前积分
                </p>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600">
                  Lv.{{ volunteerLevel }}
                </p>
                <p class="text-xs text-gray-500">
                  志愿者等级
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：表单详情 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 基本信息 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                基本信息
              </h3>
              <button
                v-if="!isEditing"
                class="text-primary-600 hover:text-primary-700 font-medium"
                @click="startEditing"
              >
                编辑
              </button>
              <div
                v-else
                class="space-x-2"
              >
                <button
                  class="px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  @click="cancelEditing"
                >
                  取消
                </button>
                <button
                  class="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  @click="saveChanges"
                >
                  保存
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">真实姓名</label>
                <input
                  v-model="formData.realName"
                  type="text"
                  :disabled="!isEditing"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  v-model="formData.username"
                  type="text"
                  :disabled="!isEditing"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
                <input
                  v-model="formData.email"
                  type="email"
                  :disabled="!isEditing"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  :disabled="!isEditing"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                >
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
                <textarea
                  v-model="formData.bio"
                  :disabled="!isEditing"
                  rows="3"
                  placeholder="介绍一下自己..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 偏好设置 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            偏好设置
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">
                  邮件通知
                </p>
                <p class="text-sm text-gray-500">
                  接收活动和系统通知邮件
                </p>
              </div>
              <button
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                :class="formData.emailNotifications ? 'bg-primary-600' : 'bg-gray-200'"
                :disabled="!isEditing"
                @click="formData.emailNotifications = !formData.emailNotifications"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="formData.emailNotifications ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">
                  短信提醒
                </p>
                <p class="text-sm text-gray-500">
                  接收活动前短信提醒
                </p>
              </div>
              <button
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                :class="formData.smsNotifications ? 'bg-primary-600' : 'bg-gray-200'"
                :disabled="!isEditing"
                @click="formData.smsNotifications = !formData.smsNotifications"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="formData.smsNotifications ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">活动偏好</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="pref in activityPreferences"
                  :key="pref"
                  class="px-3 py-1 text-sm rounded-full transition-colors"
                  :class="[
                    formData.preferences.includes(pref)
                      ? 'bg-primary-100 text-primary-800 border border-primary-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200',
                    !isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                  ]"
                  :disabled="!isEditing"
                  @click="togglePreference(pref)"
                >
                  {{ pref }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { CameraIcon } from 'lucide-vue-next'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// 编辑状态
const isEditing = ref(false)
const avatarPreview = ref('')

// 表单数据
const formData = reactive({
  realName: '',
  username: '',
  email: '',
  phone: '',
  bio: '',
  emailNotifications: true,
  smsNotifications: false,
  preferences: [] as string[]
})

// 活动偏好选项
const activityPreferences = [
  '环保宣传',
  '垃圾分类',
  '公园清洁',
  '植树造林',
  '环保讲座',
  '动物保护',
  '水资源保护',
  '社区服务'
]

// 计算用户名首字母
const userInitials = computed(() => {
  const name = user.value?.realName || '志愿者'
  return name.charAt(0)
})

// 计算志愿者等级
const volunteerLevel = computed(() => {
  const hours = user.value?.totalHours || 0
  return Math.floor(hours / 10) + 1
})

// 头像上传处理
const handleAvatarUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 开始编辑
const startEditing = () => {
  isEditing.value = true
  // 加载当前用户数据到表单
  if (user.value) {
    formData.realName = user.value.realName || ''
    formData.username = user.value.username || ''
    formData.email = user.value.email || ''
  }
}

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false
  // 重置表单数据
  if (user.value) {
    formData.realName = user.value.realName || ''
    formData.username = user.value.username || ''
    formData.email = user.value.email || ''
  }
  formData.phone = ''
  formData.bio = ''
}

// 保存更改
const saveChanges = async () => {
  try {
    // 调用API保存更改
    await authStore.updateProfile({
      realName: formData.realName,
      email: formData.email
    })

    isEditing.value = false
    console.log('个人信息更新成功')
  } catch (error) {
    console.error('更新失败:', error)
  }
}

// 切换偏好
const togglePreference = (pref: string) => {
  if (!isEditing.value) return

  const index = formData.preferences.indexOf(pref)
  if (index > -1) {
    formData.preferences.splice(index, 1)
  } else {
    formData.preferences.push(pref)
  }
}

// 组件加载时初始化数据
onMounted(() => {
  if (user.value) {
    formData.realName = user.value.realName || ''
    formData.username = user.value.username || ''
    formData.email = user.value.email || ''
  }
})
</script>

<style scoped>
/* 自定义样式已通过Tailwind类实现 */
</style>