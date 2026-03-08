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
          <UsersIcon class="h-6 w-6 text-white" />
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          注册账号
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          已有账号？
          <router-link
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            立即登录
          </router-link>
        </p>
      </div>

      <!-- 步骤指示器 -->
      <div class="mt-8">
        <Steps
          :current="currentStep"
          :items="steps"
          @change="handleStepChange"
        />
      </div>

      <!-- 注册表单 -->
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleRegister"
      >
        <!-- 步骤1: 基本信息 -->
        <div
          v-if="currentStep === 0"
          class="space-y-4"
        >
          <!-- 用户角色选择 -->
          <div>
            <label
              for="role"
              class="block text-sm font-medium text-gray-700"
            >
              注册身份
            </label>
            <div class="mt-1">
              <Select
                id="role"
                v-model="form.role"
                placeholder="请选择注册身份"
                :options="[
                  { value: 'volunteer', label: '志愿者' },
                  { value: 'organization', label: '组织管理者' }
                ]"
                required
                :error="errors.role"
                :icon="UsersIcon"
                @blur="() => handleBlur('role')"
              />
            </div>
          </div>

          <!-- 用户名输入 -->
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700"
            >
              用户名
            </label>
            <div class="mt-1">
              <Input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="请输入用户名"
                required
                :error="errors.username"
                :icon="UserIcon"
                @blur="() => handleBlur('username')"
              />
            </div>
          </div>

          <!-- 邮箱输入 -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700"
            >
              邮箱地址
            </label>
            <div class="mt-1">
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="请输入邮箱地址"
                required
                :error="errors.email"
                :icon="MailIcon"
                @blur="() => handleBlur('email')"
              />
            </div>
          </div>

          <!-- 手机号输入 -->
          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700"
            >
              手机号
            </label>
            <div class="mt-1">
              <Input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="请输入手机号"
                required
                :error="errors.phone"
                :icon="PhoneIcon"
                @blur="() => handleBlur('phone')"
              />
            </div>
          </div>
        </div>

        <!-- 步骤2: 密码信息 -->
        <div
          v-if="currentStep === 1"
          class="space-y-4"
        >
          <!-- 密码输入 -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              密码
            </label>
            <div class="mt-1">
              <PasswordInput
                id="password"
                v-model="form.password"
                placeholder="请输入密码"
                required
                :error="errors.password"
                @blur="() => handleBlur('password')"
              />
            </div>
          </div>

          <!-- 确认密码输入 -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
            >
              确认密码
            </label>
            <div class="mt-1">
              <PasswordInput
                id="confirmPassword"
                v-model="form.confirmPassword"
                placeholder="请再次输入密码"
                required
                :error="errors.confirmPassword"
                @blur="() => handleBlur('confirmPassword')"
              />
            </div>
          </div>
        </div>

        <!-- 步骤3: 个人信息 -->
        <div
          v-if="currentStep === 2"
          class="space-y-4"
        >
          <!-- 真实姓名输入 -->
          <div>
            <label
              for="realName"
              class="block text-sm font-medium text-gray-700"
            >
              真实姓名
            </label>
            <div class="mt-1">
              <Input
                id="realName"
                v-model="form.realName"
                type="text"
                placeholder="请输入真实姓名"
                required
                :error="errors.realName"
                :icon="UserCheckIcon"
                @blur="() => handleBlur('realName')"
              />
            </div>
          </div>

          <!-- 年龄输入 -->
          <div>
            <label
              for="age"
              class="block text-sm font-medium text-gray-700"
            >
              年龄
            </label>
            <div class="mt-1">
              <Input
                id="age"
                v-model="form.age"
                type="number"
                placeholder="请输入年龄"
                required
                :error="errors.age"
                :icon="CalendarIcon"
                @blur="() => handleBlur('age')"
              />
            </div>
          </div>

          <!-- 性别选择 -->
          <div>
            <label
              for="gender"
              class="block text-sm font-medium text-gray-700"
            >
              性别
            </label>
            <div class="mt-1">
              <Select
                id="gender"
                v-model="form.gender"
                placeholder="请选择性别"
                :options="[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' },
                  { value: 'other', label: '其他' }
                ]"
                required
                :error="errors.gender"
                :icon="Users2Icon"
                @blur="() => handleBlur('gender')"
              />
            </div>
          </div>

          <!-- 组织输入（仅组织管理者显示） -->
          <div v-if="form.role === UserIdentity.ORGANIZATION">
            <label
              for="organization"
              class="block text-sm font-medium text-gray-700"
            >
              组织名称
            </label>
            <div class="mt-1">
              <Input
                id="organization"
                v-model="form.organization"
                type="text"
                placeholder="请输入组织名称"
                required
                :error="errors.organization"
                :icon="BuildingIcon"
                @blur="() => handleBlur('organization')"
              />
            </div>
          </div>

          <!-- 协议同意 -->
          <div>
            <div class="flex items-center">
              <input
                id="agreement"
                v-model="form.agreement"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                @blur="() => handleBlur('agreement')"
              >
              <label
                for="agreement"
                class="ml-2 block text-sm text-gray-900"
              >
                我已阅读并同意
                <a
                  href="#"
                  class="text-primary-600 hover:text-primary-500"
                >用户协议</a>
                和
                <a
                  href="#"
                  class="text-primary-600 hover:text-primary-500"
                >隐私政策</a>
              </label>
            </div>
            <p
              v-if="errors.agreement"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.agreement }}
            </p>
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="flex justify-between">
          <Button
            v-if="currentStep > 0"
            type="button"
            size="lg"
            :disabled="loading"
            @click="prevStep"
          >
            上一步
          </Button>
          <div /> <!-- 占位符，保持布局 -->
          <Button
            v-if="currentStep < steps.length - 1"
            type="button"
            size="lg"
            :disabled="loading"
            @click="nextStep"
          >
            下一步
          </Button>
          <Button
            v-if="currentStep === steps.length - 1"
            type="submit"
            size="lg"
            :loading="loading"
            :disabled="!isFormValid"
            loading-text="注册中..."
          >
            注册
          </Button>
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
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { UserIdentity, type RegisterRequest } from '@/types/auth'
import { UsersIcon, UserIcon, MailIcon, PhoneIcon, UserCheckIcon, CalendarIcon, BuildingIcon, HomeIcon, Users2Icon } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import Select from '@/components/ui/Select.vue'
import Steps from '@/components/ui/Steps.vue'
import FloatButton from '@/components/ui/FloatButton.vue'
import EcoParticles from '@/components/background/EcoParticles.vue'

const router = useRouter()
const authStore = useAuthStore()

// 步骤状态
const currentStep = ref(0)
const steps = [
  { title: '基本信息', description: '填写账号信息' },
  { title: '密码信息', description: '设置安全密码' },
  { title: '个人信息', description: '完善个人资料' }
]


const form = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  realName: '',
  age: '',
  gender: '',
  organization: '',
  role: UserIdentity.VOLUNTEER,
  agreement: false
})

interface FormErrors {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  realName: string
  age: string
  gender: string
  organization: string
  role: string
  agreement: string
}

interface FormTouched {
  username: boolean
  email: boolean
  phone: boolean
  password: boolean
  confirmPassword: boolean
  realName: boolean
  age: boolean
  gender: boolean
  organization: boolean
  role: boolean
  agreement: boolean
}

const errors = reactive<FormErrors>({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  realName: '',
  age: '',
  gender: '',
  organization: '',
  role: '',
  agreement: ''
})

const touched = reactive<FormTouched>({
  username: false,
  email: false,
  phone: false,
  password: false,
  confirmPassword: false,
  realName: false,
  age: false,
  gender: false,
  organization: false,
  role: false,
  agreement: false
})

const loading = ref(false)

// 步骤切换
const handleStepChange = (step: number) => {
  currentStep.value = step
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}


// 验证规则
const validateField = (field: keyof FormErrors, value: string) => {
  switch (field) {
    case 'username':
      if (!value.trim()) return '*用户名必须填写'
      if (value.length < 3) return '*用户名至少3个字符'
      if (!/^[a-zA-Z0-9_]+$/.test(value)) return '*用户名只能包含字母、数字和下划线'
      return ''

    case 'email':
      if (!value.trim()) return '*邮箱地址必须填写'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '*请输入有效的邮箱地址'
      return ''

    case 'phone':
      if (!value.trim()) return '*手机号必须填写'
      if (!/^1[3-9]\d{9}$/.test(value)) return '*请输入有效的手机号码'
      return ''

    case 'password':
      if (!value) return '*密码必须填写'
      if (value.length < 6) return '*密码至少6个字符'
      return ''

    case 'confirmPassword':
      if (!value) return '*请确认密码'
      if (value !== form.value.password) return '*两次输入的密码不一致'
      return ''

    case 'realName':
      if (!value.trim()) return '*真实姓名必须填写'
      return ''

    case 'age':
      if (!value.trim()) return '*年龄必须填写'
      const ageNum = parseInt(value)
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) return '*请输入有效的年龄(1-120)'
      return ''

    case 'gender':
      if (!value.trim()) return '*性别必须选择'
      return ''

    case 'organization':
      if (form.value.role === UserIdentity.ORGANIZATION && !value.trim()) return '*组织名称必须填写'
      return ''

    case 'role':
      if (!value.trim()) return '*注册身份必须选择'
      return ''

    case 'agreement':
      if (!form.value.agreement) return '*请同意用户协议和隐私政策'
      return ''

    default:
      return ''
  }
}

// 实时验证
const validateForm = () => {
  (Object.keys(errors) as Array<keyof FormErrors>).forEach(field => {
    if (touched[field]) {
      let value: string
      if (field === 'agreement') {
        value = form.value.agreement ? 'true' : ''
      } else {
        value = (form.value[field as keyof typeof form.value] as string) || ''
      }
      errors[field] = validateField(field, value)
    }
  })
}

// 字段失焦时标记为已触摸
const handleBlur = (field: keyof FormErrors) => {
  touched[field] = true
  let value: string
  if (field === 'agreement') {
    value = form.value.agreement ? 'true' : ''
  } else {
    value = (form.value[field as keyof typeof form.value] as string) || ''
  }
  errors[field] = validateField(field, value)
}

// 监听表单变化进行实时验证
watch(form, validateForm, { deep: true })

const isFormValid = computed(() => {
  const baseValid = Object.values(errors).every(error => !error) &&
                    form.value.username &&
                    form.value.email &&
                    form.value.phone &&
                    form.value.password &&
                    form.value.confirmPassword &&
                    form.value.realName &&
                    form.value.age &&
                    form.value.gender &&
                    form.value.role &&
                    form.value.agreement

  // 如果是组织管理者，还需要验证组织名称
  if (form.value.role === UserIdentity.ORGANIZATION) {
    return baseValid && form.value.organization
  }

  return baseValid
})

const handleRegister = async () => {
  // 提交前验证所有字段
  (Object.keys(touched) as Array<keyof FormTouched>).forEach(field => {
    touched[field] = true
  })
  validateForm()

  if (!isFormValid.value) {
    return
  }

  loading.value = true

  try {
    // 构建注册请求参数
    const registerData: RegisterRequest = {
      registerType: form.value.role === 'volunteer' ? UserIdentity.VOLUNTEER : UserIdentity.ORGANIZATION,
      username: form.value.username,
      name: form.value.realName,
      phone: form.value.phone,
      email: form.value.email,
      password: form.value.password
    }

    // 志愿者注册需要年龄和性别
    if (form.value.role === UserIdentity.VOLUNTEER) {
      registerData.age = parseInt(form.value.age)
      // 前端存储的是英文，后端需要中文（根据接口文档）
      const genderMap: Record<string, string> = {
        'male': '男',
        'female': '女',
        'other': '其他'
      }
      registerData.gender = genderMap[form.value.gender] || form.value.gender
    }

    // 组织注册需要组织名称
    if (form.value.role === UserIdentity.ORGANIZATION) {
      registerData.organizationName = form.value.organization
    }

    // 调用注册API
    const response = await authStore.register(registerData)

    if (response.code === 200) {
      // 注册成功后跳转到登录页
      router.push('/login')
    } else {
      // 注册失败，显示错误信息
      alert(`注册失败: ${response.msg}`)
    }
  } catch (error: any) {
    console.error('注册失败:', error)
    const errorMsg = error.response?.data?.msg || error.message || '注册失败，请稍后重试'
    alert(`注册失败: ${errorMsg}`)
  } finally {
    loading.value = false
  }
}
</script>