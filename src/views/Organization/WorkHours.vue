<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Work Hours"
      title="工时流水"
      description="查看工时日志，并对指定报名执行作废或重算。"
      :meta-items="headerMeta"
    />

    <OrganizationSectionCard
      title="筛选"
      description="按活动、报名或操作类型检索工时流水。"
      tone="soft"
    >
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          v-model.number="activityId"
          type="number"
          min="1"
          class="input"
          placeholder="活动 ID"
        >
        <input
          v-model.number="signupId"
          type="number"
          min="1"
          class="input"
          placeholder="报名 ID"
        >
        <select
          v-model="operationType"
          class="select"
        >
          <option :value="undefined">
            全部操作
          </option>
          <option :value="WorkHourOperationType.GRANT">
            发放
          </option>
          <option :value="WorkHourOperationType.VOID">
            作废
          </option>
          <option :value="WorkHourOperationType.RECALCULATE">
            重算
          </option>
        </select>
        <button
          class="org-toolbar-button"
          :disabled="loading"
          @click="loadLogs"
        >
          {{ loading ? '加载中...' : '刷新流水' }}
        </button>
      </div>
    </OrganizationSectionCard>

    <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <OrganizationSectionCard
        title="流水列表"
        description="列表数据来自工时流水接口。"
      >
        <div
          v-if="loading"
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          正在加载工时流水...
        </div>

        <div
          v-else-if="!logs.length"
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          当前没有可展示的工时流水。
        </div>

        <div
          v-else
          class="space-y-4"
        >
          <article
            v-for="log in logs"
            :key="log.id"
            class="organization-surface-lift cursor-pointer rounded-[1.3rem] border px-5 py-4 transition"
            :class="selectedLogId === log.id ? 'border-[#ec5b13] bg-[#fff8f3]' : 'border-slate-200 bg-white'"
            @click="selectedLogId = log.id"
          >
            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {{ operationText(log.operationType) }}
                </span>
                <span class="text-sm font-semibold text-slate-900">
                  报名 {{ log.signupId }} / 活动 {{ log.activityId }}
                </span>
              </div>
              <p class="text-sm text-slate-500">
                变更工时 {{ log.hoursDelta }}h · 前 {{ log.beforeTotalHours }}h / 后 {{ log.afterTotalHours }}h
              </p>
              <p class="text-xs text-slate-400">
                {{ log.createdAt }} · 幂等键 {{ log.idempotencyKey || '-' }}
              </p>
            </div>
          </article>
        </div>
      </OrganizationSectionCard>

      <OrganizationSectionCard
        title="工时处理"
        description="对指定报名执行作废或重算。"
        tone="soft"
      >
        <div class="space-y-4">
          <input
            v-model.number="actionForm.signupId"
            type="number"
            min="1"
            class="input"
            placeholder="报名 ID"
          >
          <input
            v-model.number="actionForm.hours"
            type="number"
            min="0"
            step="0.5"
            class="input"
            placeholder="重算工时（仅重算使用）"
          >
          <textarea
            v-model.trim="actionForm.reason"
            rows="3"
            class="textarea"
            placeholder="请输入原因"
          />

          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 disabled:opacity-60"
              :disabled="acting"
              @click="voidWorkHour"
            >
              {{ acting ? '处理中...' : '作废工时' }}
            </button>
            <button
              class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              :disabled="acting"
              @click="recalculateWorkHour"
            >
              {{ acting ? '处理中...' : '重算工时' }}
            </button>
          </div>

          <div
            v-if="selectedLog"
            class="rounded-2xl border border-white/70 bg-white/90 px-4 py-4 text-sm text-slate-600"
          >
            <p class="font-semibold text-slate-900">
              当前选中流水 #{{ selectedLog.id }}
            </p>
            <p class="mt-2">
              原因：{{ selectedLog.reason || '无' }}
            </p>
          </div>
        </div>
      </OrganizationSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { workHoursApi } from '@/api/work-hours'
import { useMessageStore } from '@/store/modules/messages'
import { WorkHourOperationType, type WorkHourLogItem } from '@/types/work-hour'

const messageStore = useMessageStore()

const activityId = ref<number | undefined>()
const signupId = ref<number | undefined>()
const operationType = ref<WorkHourOperationType | undefined>()
const logs = ref<WorkHourLogItem[]>([])
const total = ref(0)
const loading = ref(false)
const acting = ref(false)
const selectedLogId = ref<number | null>(null)
const actionForm = ref({
  signupId: 0,
  hours: 0,
  reason: ''
})

const selectedLog = computed(() => logs.value.find((log) => log.id === selectedLogId.value) || null)
const headerMeta = computed(() => [
  { label: '流水总数', value: `${total.value}`, detail: '来自真实工时接口' },
  { label: '当前筛选', value: operationType.value ? operationText(operationType.value) : '全部操作', detail: '支持发放 / 作废 / 重算' }
])

const loadLogs = async () => {
  loading.value = true
  try {
    const response = await workHoursApi.list({
      page: 1,
      pageSize: 20,
      activityId: activityId.value,
      signupId: signupId.value,
      operationType: operationType.value
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '获取工时流水失败')
    }
    logs.value = response.data.list || []
    total.value = response.data.total || 0
    selectedLogId.value = logs.value[0]?.id ?? null
  } catch (error: any) {
    console.error('加载工时流水失败:', error)
    messageStore.error(error.message || '加载工时流水失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const makeIdempotencyKey = (prefix: string) => `${prefix}-${Date.now()}`

const voidWorkHour = async () => {
  if (!actionForm.value.signupId || !actionForm.value.reason) {
    messageStore.error('请先填写报名 ID 和原因')
    return
  }
  acting.value = true
  try {
    const response = await workHoursApi.void({
      signupId: actionForm.value.signupId,
      reason: actionForm.value.reason,
      idempotencyKey: makeIdempotencyKey('void')
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '作废工时失败')
    }
    messageStore.success('工时已作废')
    await loadLogs()
  } catch (error: any) {
    console.error('作废工时失败:', error)
    messageStore.error(error.message || '作废工时失败，请稍后重试')
  } finally {
    acting.value = false
  }
}

const recalculateWorkHour = async () => {
  if (!actionForm.value.signupId || !actionForm.value.reason) {
    messageStore.error('请先填写报名 ID 和原因')
    return
  }
  acting.value = true
  try {
    const response = await workHoursApi.recalculate({
      signupId: actionForm.value.signupId,
      hours: actionForm.value.hours,
      reason: actionForm.value.reason,
      idempotencyKey: makeIdempotencyKey('recalculate')
    })
    if (response.code !== 200) {
      throw new Error(response.msg || '重算工时失败')
    }
    messageStore.success(`工时已重算，发放 ${response.data.grantedHours}h`)
    await loadLogs()
  } catch (error: any) {
    console.error('重算工时失败:', error)
    messageStore.error(error.message || '重算工时失败，请稍后重试')
  } finally {
    acting.value = false
  }
}

const operationText = (type: WorkHourOperationType) => ({
  [WorkHourOperationType.GRANT]: '发放',
  [WorkHourOperationType.VOID]: '作废',
  [WorkHourOperationType.RECALCULATE]: '重算'
}[type] || '未知')

onMounted(() => {
  void loadLogs()
})
</script>
