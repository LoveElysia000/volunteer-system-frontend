<template>
  <WorkbenchPage>
    <OrganizationPageHeader
      eyebrow="活动创建"
      title="新建活动"
      description="集中填写活动基础信息、排期和执行参数，保持和现有后台工作台一致的创建体验。"
      layout="operations"
      :meta-items="headerMeta"
    >
      <template #summary>
        <span class="rounded-full border border-[#ffd8c2] bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600">
          创建范围 / 组织工作台
        </span>
        <span class="rounded-full border border-[#ffd8c2] bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600">
          当前组织 / {{ organizationSummary }}
        </span>
        <span class="rounded-full border border-[#ffd8c2] bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600">
          排期状态 / {{ scheduleSummary }}
        </span>
      </template>
      <template #actions>
        <div class="grid w-full gap-3 2xl:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            v-model="form.title"
            placeholder="先填写活动标题，方便后续继续补充其他信息"
            allow-clear
          />
          <Button
            variant="primary"
            class="w-full 2xl:w-auto"
            :loading="submitting"
            @click="submitActivity"
          >
            {{ submitting ? '创建中...' : '新建活动' }}
          </Button>
        </div>
      </template>
    </OrganizationPageHeader>

    <WorkbenchSplitLayout variant="form">
      <template #main>
        <div class="space-y-6">
        <OrganizationSectionCard
          title="基础信息"
          caption="Basic Setup"
          description="先把活动名称、说明和主要执行信息补齐，后续运营动作会更顺。"
        >
          <div class="grid gap-4 md:grid-cols-2">
            <label class="text-sm font-medium text-slate-600 md:col-span-2">
              活动标题
              <Input
                v-model="form.title"
                class="mt-2"
                placeholder="请输入活动标题"
                allow-clear
              />
            </label>
            <label class="text-sm font-medium text-slate-600 md:col-span-2">
              活动描述
              <Textarea
                v-model="form.description"
                class="mt-2"
                placeholder="请输入活动描述"
                :min-rows="3"
                :max-rows="6"
                allow-clear
                show-word-limit
                :max-length="500"
              />
            </label>
            <label class="text-sm font-medium text-slate-600">
              活动地点
              <Input
                v-model="form.location"
                class="mt-2"
                placeholder="请输入活动地点"
                allow-clear
              />
            </label>
            <label class="text-sm font-medium text-slate-600">
              详细地址
              <Input
                v-model="form.address"
                class="mt-2"
                placeholder="请输入详细地址"
                allow-clear
              />
            </label>
            <label class="text-sm font-medium text-slate-600">
              活动时长（小时）
              <Input
                v-model="durationInput"
                class="mt-2"
                type="number"
                placeholder="请输入活动时长"
              />
            </label>
            <label class="text-sm font-medium text-slate-600">
              人数上限
              <Input
                v-model="maxPeopleInput"
                class="mt-2"
                type="number"
                placeholder="请输入人数上限"
              />
            </label>
          </div>
        </OrganizationSectionCard>

        <OrganizationSectionCard
          title="活动排期"
          caption="Schedule"
          description="录入到分钟即可，系统会自动补齐秒级格式供接口使用。"
          tone="soft"
        >
          <div class="grid gap-4 md:grid-cols-2">
            <label class="text-sm font-medium text-slate-600">
              开始时间
              <DatePicker
                v-model="startTimeValue"
                class="mt-2"
                placeholder="请选择开始时间"
                mode="datetime"
              />
            </label>
            <label class="text-sm font-medium text-slate-600">
              结束时间
              <DatePicker
                v-model="endTimeValue"
                class="mt-2"
                placeholder="请选择结束时间"
                mode="datetime"
              />
            </label>
          </div>
        </OrganizationSectionCard>
        </div>
      </template>

      <template #aside>
        <div class="space-y-6">
        <OrganizationSectionCard
          title="封面与提示"
          caption="Preview"
          description="封面是可选项，但会明显影响列表页和详情页的呈现效果。"
          tone="soft"
        >
          <label class="text-sm font-medium text-slate-600">
            封面地址
            <Input
              v-model="form.coverUrl"
              class="mt-2"
              placeholder="可选，填写活动封面 URL"
              allow-clear
            />
          </label>

          <div
            v-if="form.coverUrl.trim()"
            class="mt-4 overflow-hidden rounded-[1.3rem] border border-slate-200 bg-slate-50"
          >
            <img
              :src="form.coverUrl.trim()"
              alt="活动封面预览"
              class="h-56 w-full object-cover"
            >
          </div>
          <div
            v-else
            class="mt-4 rounded-[1.3rem] border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500"
          >
            填写封面地址后，这里会显示活动封面预览。
          </div>

          <div
            v-if="recentCreatedActivityId"
            class="mt-4 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            最近创建 ID：#{{ recentCreatedActivityId }}
          </div>
        </OrganizationSectionCard>

        <OrganizationSectionCard
          title="提交前检查"
          caption="Checklist"
          description="保持基础信息完整，可以减少后续编辑和审核成本。"
        >
          <ul class="space-y-3">
            <li
              v-for="item in readinessChecklist"
              :key="item.label"
              class="rounded-[1.15rem] border border-slate-200 bg-slate-50/70 px-4 py-3"
            >
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-slate-900">
                  {{ item.label }}
                </p>
                <span
                  class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  :class="item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ item.done ? '已完成' : '待补充' }}
                </span>
              </div>
              <p class="mt-1 text-xs leading-5 text-slate-500">
                {{ item.detail }}
              </p>
            </li>
          </ul>
        </OrganizationSectionCard>
        </div>
      </template>
    </WorkbenchSplitLayout>
  </WorkbenchPage>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { activitiesApi } from '@/api/activities'
import Button from '@/components/ui/Button.vue'
import DatePicker from '@/components/ui/DatePicker.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import WorkbenchPage from '@/components/workbench/WorkbenchPage.vue'
import WorkbenchSplitLayout from '@/components/workbench/WorkbenchSplitLayout.vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useMessageStore } from '@/store/modules/messages'
import { useOrganizationStore } from '@/store/modules/organization'
import type { CreateOrganizationActivityRequest } from '@/types/activity'

const router = useRouter()
const messageStore = useMessageStore()
const organizationStore = useOrganizationStore()
const submitting = ref(false)
const recentCreatedActivityId = ref<number | null>(null)
const organizationId = computed(() => organizationStore.activeOrganizationId ?? organizationStore.currentOrganization?.id ?? 0)

const form = reactive<CreateOrganizationActivityRequest>({
  orgId: 0,
  title: '',
  description: '',
  coverUrl: '',
  startTime: '',
  endTime: '',
  location: '',
  address: '',
  duration: 2,
  maxPeople: 30
})

const durationInput = computed({
  get: () => String(form.duration ?? ''),
  set: (value: string | number) => {
    const next = Number(value)
    form.duration = Number.isFinite(next) ? next : 0
  }
})

const maxPeopleInput = computed({
  get: () => String(form.maxPeople ?? ''),
  set: (value: string | number) => {
    const next = Number(value)
    form.maxPeople = Number.isFinite(next) ? next : 0
  }
})

const stripSeconds = (value: string) => {
  if (!value) return null
  const match = value.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/)
  return match?.[1] || value.slice(0, 16) || null
}

const withZeroSeconds = (value: string | null) => {
  if (!value) return ''
  return `${value}:00`
}

const startTimeValue = computed<string | null>({
  get: () => stripSeconds(form.startTime),
  set: (value) => {
    form.startTime = withZeroSeconds(value)
  }
})

const endTimeValue = computed<string | null>({
  get: () => stripSeconds(form.endTime),
  set: (value) => {
    form.endTime = withZeroSeconds(value)
  }
})

const organizationSummary = computed(() => (
  organizationStore.currentOrganization?.name || (organizationId.value ? `#${organizationId.value}` : '待识别')
))

const scheduleSummary = computed(() => {
  if (!form.startTime || !form.endTime) return '待设置'
  return `${startTimeValue.value || '-'} 至 ${endTimeValue.value || '-'}`
})

const headerMeta = computed(() => [
  { label: '所属组织', value: organizationSummary.value, detail: '活动将归属到当前组织' },
  { label: '活动时长', value: `${form.duration || 0} 小时`, detail: '用于默认工时与排班参考' },
  { label: '参与规模', value: `${form.maxPeople || 0} 人`, detail: '活动人数上限' }
])

const readinessChecklist = computed(() => [
  { label: '标题与描述', detail: '标题清晰、描述完整后更适合直接发布。', done: Boolean(form.title.trim() && form.description.trim()) },
  { label: '活动排期', detail: '开始时间必须早于结束时间。', done: Boolean(form.startTime && form.endTime && new Date(form.endTime).getTime() > new Date(form.startTime).getTime()) },
  { label: '地点与人数', detail: '地点和人数上限会影响招募效果与执行安排。', done: Boolean(form.location.trim() && form.maxPeople > 0) }
])

const submitActivity = async () => {
  if (!organizationId.value) {
    messageStore.error('当前账号缺少组织标识，暂时无法创建活动')
    return
  }
  if (!form.title.trim() || !form.description.trim() || !form.startTime || !form.endTime || !form.location.trim()) {
    messageStore.error('请先填写完整的活动基础信息')
    return
  }
  if (new Date(form.endTime).getTime() <= new Date(form.startTime).getTime()) {
    messageStore.error('结束时间必须晚于开始时间')
    return
  }
  if (form.duration <= 0 || form.maxPeople <= 0) {
    messageStore.error('活动时长和人数上限都必须大于 0')
    return
  }
  submitting.value = true
  try {
    form.orgId = organizationId.value
    const payload: CreateOrganizationActivityRequest = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      coverUrl: form.coverUrl.trim() || undefined,
      location: form.location.trim(),
      address: form.address.trim() || undefined,
      startTime: form.startTime,
      endTime: form.endTime
    }
    const response = await activitiesApi.create(payload)

    if (response.code !== 200) {
      throw new Error(response.msg || '创建活动失败')
    }

    recentCreatedActivityId.value = response.data.id
    messageStore.success(response.data.message || `活动创建成功，ID #${response.data.id}`)
    router.push('/organization/activities')
  } catch (error: any) {
    console.error('创建活动失败:', error)
    messageStore.error(error.message || '创建活动失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!organizationStore.activeOrganizationId && !organizationStore.currentOrganization) {
    try {
      await organizationStore.fetchOrganizations({ page: 1, pageSize: 10 })
      if (organizationStore.activeOrganizationId) {
        await organizationStore.fetchOrganization(organizationStore.activeOrganizationId)
      }
    } catch (error) {
      console.error('加载组织信息失败:', error)
    }
  }
})
</script>
