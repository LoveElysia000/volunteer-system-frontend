<template>
  <div class="space-y-6">
    <OrganizationPageHeader
      eyebrow="Audit Queue"
      title="活动审核"
      description="审核列表与详情均来自文档中的审核中心接口。"
      :meta-items="headerMeta"
    />

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <OrganizationSectionCard
        title="待审核队列"
        description="当前仅展示活动报名相关审核。"
      >
        <div
          v-if="loading"
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          正在加载审核列表...
        </div>

        <div
          v-else-if="!items.length"
          class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
        >
          当前没有待审核记录。
        </div>

        <div
          v-else
          class="space-y-4"
        >
          <article
            v-for="item in items"
            :key="item.id"
            class="organization-surface-lift cursor-pointer rounded-[1.3rem] border px-5 py-4 transition"
            :class="selectedAuditId === item.id ? 'border-[#ec5b13] bg-[#fff8f3]' : 'border-slate-200 bg-white'"
            @click="selectAudit(item.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-base font-bold text-slate-900">
                  {{ item.title }}
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                  {{ item.subTitle || '无补充说明' }}
                </p>
              </div>
              <span
                class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="item.isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ item.isOverdue ? '已超时' : '待处理' }}
              </span>
            </div>
            <p class="mt-3 text-xs text-slate-400">
              审核单号 #{{ item.id }} · 创建于 {{ item.createdAt }}
            </p>
          </article>
        </div>
      </OrganizationSectionCard>

      <OrganizationSectionCard
        title="审核详情"
        description="详情来自审核记录接口。"
        tone="soft"
      >
        <div
          v-if="detailLoading"
          class="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500"
        >
          正在加载审核详情...
        </div>

        <div
          v-else-if="detail"
          class="space-y-4"
        >
          <div class="rounded-2xl border border-white/70 bg-white/90 px-4 py-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              审核对象
            </p>
            <p class="mt-2 text-sm font-semibold text-slate-900">
              {{ targetTypeText(detail.targetType) }} / ID {{ detail.targetId }}
            </p>
          </div>

          <div class="rounded-2xl border border-white/70 bg-white/90 px-4 py-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              变更前
            </p>
            <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {{ detail.oldContent || '无' }}
            </p>
          </div>

          <div class="rounded-2xl border border-white/70 bg-white/90 px-4 py-4">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              变更后
            </p>
            <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {{ detail.newContent || '无' }}
            </p>
          </div>

          <textarea
            v-model.trim="auditReason"
            rows="3"
            class="textarea"
            placeholder="选填：填写审核说明"
          />

          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              :disabled="actionLoading"
              @click="approveCurrentAudit"
            >
              {{ actionLoading ? '处理中...' : '审核通过' }}
            </button>
            <button
              class="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300 disabled:opacity-60"
              :disabled="actionLoading"
              @click="rejectCurrentAudit"
            >
              {{ actionLoading ? '处理中...' : '审核驳回' }}
            </button>
          </div>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500"
        >
          请先从左侧选择一条审核记录。
        </div>
      </OrganizationSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import { useAuditsStore } from '@/store/modules/audits'
import { useMessageStore } from '@/store/modules/messages'
import { AuditTargetType } from '@/types/audit'

const auditsStore = useAuditsStore()
const messageStore = useMessageStore()

const selectedAuditId = ref<number | null>(null)
const auditReason = ref('')
const detailLoading = ref(false)
const actionLoading = ref(false)

const items = computed(() => auditsStore.items)
const detail = computed(() => auditsStore.currentRecord)
const loading = computed(() => auditsStore.loading)
const headerMeta = computed(() => [
  { label: '待审核总数', value: `${auditsStore.total}`, detail: '来源于审核中心接口' },
  { label: '当前模块', value: '活动报名审核', detail: '筛选 targetType=4' }
])

const loadAudits = async () => {
  try {
    const data = await auditsStore.fetchPending({
      targetTypes: [AuditTargetType.ACTIVITY_SIGNUP],
      page: 1,
      pageSize: 20
    })

    if (!selectedAuditId.value && data.list.length) {
      await selectAudit(data.list[0].id)
    }
  } catch (error: any) {
    console.error('加载审核列表失败:', error)
    messageStore.error(error.message || '加载审核列表失败，请稍后重试')
  }
}

const selectAudit = async (id: number) => {
  selectedAuditId.value = id
  detailLoading.value = true
  try {
    await auditsStore.fetchDetail(id)
  } catch (error: any) {
    console.error('加载审核详情失败:', error)
    messageStore.error(error.message || '加载审核详情失败，请稍后重试')
  } finally {
    detailLoading.value = false
  }
}

const approveCurrentAudit = async () => {
  if (!selectedAuditId.value) return
  actionLoading.value = true
  try {
    await auditsStore.approve({ id: selectedAuditId.value, reason: auditReason.value || '审核通过' })
    messageStore.success('审核已通过')
    selectedAuditId.value = null
    auditReason.value = ''
    await loadAudits()
  } catch (error: any) {
    console.error('审核通过失败:', error)
    messageStore.error(error.message || '审核通过失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const rejectCurrentAudit = async () => {
  if (!selectedAuditId.value) return
  actionLoading.value = true
  try {
    await auditsStore.reject({ id: selectedAuditId.value, reason: auditReason.value || '审核驳回' })
    messageStore.success('审核已驳回')
    selectedAuditId.value = null
    auditReason.value = ''
    await loadAudits()
  } catch (error: any) {
    console.error('审核驳回失败:', error)
    messageStore.error(error.message || '审核驳回失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const targetTypeText = (targetType: AuditTargetType) => ({
  [AuditTargetType.VOLUNTEER_REAL_NAME]: '志愿者实名',
  [AuditTargetType.ORGANIZATION]: '组织审核',
  [AuditTargetType.MEMBERSHIP]: '加入组织',
  [AuditTargetType.ACTIVITY_SIGNUP]: '活动报名'
}[targetType] || '未知类型')

onMounted(() => {
  void loadAudits()
})
</script>
