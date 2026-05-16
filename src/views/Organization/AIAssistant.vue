<template>
  <WorkbenchPage>
    <OrganizationPageHeader
      eyebrow="智能助手"
      title="AI 助手"
      description="帮助组织生成活动草案、整理运营文案和回答工作台内业务问题。"
      :meta-items="headerMeta"
    >
      <template #actions>
        <button
          class="org-toolbar-button"
          :disabled="assistantStore.sending"
          @click="openDraftDialog"
        >
          生成活动草案
        </button>
        <button
          class="org-toolbar-button org-toolbar-button--soft"
          :disabled="assistantStore.sending"
          @click="createNewSession"
        >
          新建会话
        </button>
      </template>
    </OrganizationPageHeader>

    <WorkbenchSplitLayout variant="assistant">
      <template #main>
        <OrganizationSectionCard
          title="会话列表"
          description="查看最近会话，快速切换上下文。"
          tone="soft"
        >
        <WorkbenchEmptyPanel
          v-if="!sessions.length"
          tone="plain"
        >
          当前还没有会话，点击右上角新建会话即可开始。
        </WorkbenchEmptyPanel>

        <div
          v-else
          class="space-y-3"
        >
          <button
            v-for="session in sessions"
            :key="session.id"
            class="w-full rounded-[1.2rem] border px-4 py-3 text-left transition"
            :class="session.id === assistantStore.currentSessionId ? 'border-[#ec5b13] bg-[#fff8f3]' : 'border-slate-200 bg-white hover:border-[#ffd8c2]'"
            @click="selectSession(session.id)"
          >
            <p class="text-sm font-semibold text-slate-900">
              {{ session.title }}
            </p>
            <p class="mt-1 text-xs text-slate-500">
              {{ formatDateTime(session.updatedAt) }}
            </p>
          </button>
        </div>
        </OrganizationSectionCard>
      </template>

      <template #aside>
        <div class="mb-4 flex items-center justify-between rounded-[1.2rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
          <div>
            <p class="text-sm font-semibold text-slate-900">对话模式</p>
            <p class="mt-0.5 text-xs text-slate-500">流式适合连续生成，标准一次性返回完整结果</p>
          </div>
          <div class="inline-flex shrink-0 rounded-full bg-white p-0.5 shadow-sm">
            <button
              class="rounded-full px-3 py-1.5 text-xs font-semibold transition"
              :class="chatMode === 'stream' ? 'bg-[#ec5b13] text-white' : 'text-slate-500 hover:text-slate-700'"
              @click="chatMode = 'stream'"
            >流式</button>
            <button
              class="rounded-full px-3 py-1.5 text-xs font-semibold transition"
              :class="chatMode === 'standard' ? 'bg-[#ec5b13] text-white' : 'text-slate-500 hover:text-slate-700'"
              @click="chatMode = 'standard'"
            >标准</button>
          </div>
        </div>

        <OrganizationSectionCard
          title="聊天工作区"
          description="可以直接提问，也可以生成活动草案。"
        >
        <div class="flex h-[clamp(26rem,70vh,35rem)] flex-col">
          <div ref="messagesContainer" class="relative flex-1 overflow-y-auto pr-1" @scroll="handleScroll">
            <div class="space-y-4">
            <WorkbenchEmptyPanel v-if="assistantStore.loading">
              正在加载会话消息...
            </WorkbenchEmptyPanel>

            <WorkbenchEmptyPanel v-else-if="!messages.length">
              输入你的问题，或点击"生成活动草案"快速开始。
            </WorkbenchEmptyPanel>

            <template v-for="message in messages" :key="message.id">
              <article
                v-if="message.role === 2"
                class="ml-auto w-fit max-w-[85%] rounded-2xl bg-[#ec5b13] px-4 py-3 text-white"
              >
                <p class="whitespace-pre-wrap text-sm leading-6">{{ message.content }}</p>
                <p class="mt-1 text-right text-xs text-white/60">{{ formatDateTime(message.created_at) }}</p>
              </article>

              <div
                v-else-if="message.role === 1"
                class="mr-auto w-fit max-w-[92%]"
              >
                <div class="flex items-start gap-3">
                  <div class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff1ea] text-xs font-bold text-[#ec5b13]">
                    AI
                  </div>
                  <div>
                    <p class="whitespace-pre-wrap text-sm leading-6 text-slate-700">{{ message.content }}</p>
                    <div
                      v-if="message.finish_reason ||
                        message.token_in ||
                        message.token_out ||
                        message.latency_ms"
                      class="mt-2 space-y-1 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2"
                    >
                      <div class="flex flex-wrap gap-2 text-[11px] text-slate-400">
                        <span v-if="message.finish_reason">状态：{{ finishReasonText(message.finish_reason) }}</span>
                        <span v-if="message.token_in">输入 {{ formatNumber(message.token_in) }} tokens</span>
                        <span v-if="message.token_out">输出 {{ formatNumber(message.token_out) }} tokens</span>
                        <span v-if="message.latency_ms">{{ formatNumber(message.latency_ms) }}ms</span>
                      </div>
                      <div v-if="message.tool_calls?.length" class="space-y-1">
                        <p class="text-[11px] font-semibold text-slate-400">工具调用</p>
                        <p
                          v-for="toolCall in message.tool_calls"
                          :key="`${message.id}-${toolCall.tool_name}-${toolCall.latency_ms}`"
                          class="text-[11px] text-slate-400"
                        >
                          {{ toolCall.tool_name }} · {{ toolCall.success ? '成功' : toolCall.error_msg || '失败' }} · {{ formatNumber(toolCall.latency_ms) }}ms
                        </p>
                      </div>
                    </div>
                    <p class="mt-1 text-xs text-slate-400">{{ formatDateTime(message.created_at) }}</p>
                  </div>
                </div>
              </div>
            </template>
            </div>

            <div v-if="assistantStore.sending" class="mr-auto w-fit max-w-[92%]">
              <div class="flex items-start gap-3">
                <div class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff1ea] text-xs font-bold text-[#ec5b13]">
                  AI
                </div>
                <div class="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span class="typing-dot" />
                  <span class="typing-dot" style="animation-delay: 0.2s" />
                  <span class="typing-dot" style="animation-delay: 0.4s" />
                </div>
              </div>
            </div>

            <button
              v-if="showScrollDown"
              class="sticky bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-lg transition hover:border-[#ec5b13] hover:text-[#ec5b13]"
              @click="scrollToBottom"
            >
              ↓ 新消息
            </button>
          </div>

          <div class="mt-4 border-t border-slate-100 pt-4">
            <div class="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-3 transition focus-within:border-[#ec5b13] focus-within:shadow-[0_0_0_3px_rgba(236,91,19,0.1)]">
              <Textarea
                v-model="prompt"
                :rows="2"
                placeholder="输入你的问题..."
                class="min-h-0 flex-1 !border-0 !p-0 !shadow-none !ring-0 resize-none"
                @keydown.enter.exact.prevent="sendPrompt"
              />
              <button
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition disabled:opacity-40"
                :class="assistantStore.sending || !prompt.trim() ? 'bg-slate-300' : 'bg-[#ec5b13] hover:bg-[#d04f0f]'"
                :disabled="assistantStore.sending || !prompt.trim()"
                @click="sendPrompt"
              >
                <svg v-if="assistantStore.sending" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p class="mt-1.5 text-right text-xs text-slate-400">Enter 发送 · Shift+Enter 换行</p>
          </div>
        </div>
        </OrganizationSectionCard>
      </template>
    </WorkbenchSplitLayout>

    <Dialog
      v-model="draftDialogOpen"
      title="生成活动草案"
      width="560px"
      :show-footer="false"
    >
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">主题</label>
          <Input
            v-model="draftForm.topic"
            placeholder="例如：社区垃圾分类宣传日"
            allow-clear
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">目标人群</label>
          <Input
            v-model="draftForm.target_people"
            placeholder="例如：社区家庭、青少年志愿者"
            allow-clear
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">地点</label>
          <Input
            v-model="draftForm.location"
            placeholder="例如：浦东新区社区广场"
            allow-clear
          />
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            @click="draftDialogOpen = false"
          >
            取消
          </Button>
          <Button
            variant="primary"
            :disabled="assistantStore.sending || !draftForm.topic.trim()"
            @click="submitDraft"
          >
            {{ assistantStore.sending ? '生成中...' : '生成草案' }}
          </Button>
        </div>
      </div>
    </Dialog>
  </WorkbenchPage>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import WorkbenchEmptyPanel from '@/components/workbench/WorkbenchEmptyPanel.vue'
import WorkbenchPage from '@/components/workbench/WorkbenchPage.vue'
import WorkbenchSplitLayout from '@/components/workbench/WorkbenchSplitLayout.vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import { DEFAULT_ASSISTANT_SCENE } from '@/constants/assistantScenes'
import { useAssistantStore } from '@/store/modules/assistant'
import { useMessageStore } from '@/store/modules/messages'

const assistantStore = useAssistantStore()
const messageStore = useMessageStore()

const prompt = ref('')
const draftDialogOpen = ref(false)
const chatMode = ref<'stream' | 'standard'>('standard')
const messagesContainer = ref<HTMLDivElement | null>(null)
const showScrollDown = ref(false)
const draftForm = reactive({
  topic: '',
  target_people: '',
  location: ''
})

const sessions = computed(() => assistantStore.sessions)
const messages = computed(() => assistantStore.messages)
const headerMeta = computed(() => [
  { label: '当前会话', value: assistantStore.currentSession?.title || '未开始', detail: '聊天与草案共享同一会话' },
  { label: '消息数量', value: `${messages.value.length}`, detail: '当前会话内容' }
])

const createNewSession = async () => {
  try {
    const session = await assistantStore.createSession('新会话', DEFAULT_ASSISTANT_SCENE)
    await assistantStore.loadMessages(session.id)
    prompt.value = ''
  } catch (error: any) {
    console.error('创建 AI 会话失败:', error)
    messageStore.error(error.message || '创建 AI 会话失败，请稍后重试')
  }
}

const selectSession = async (id: number) => {
  try {
    await assistantStore.loadMessages(id)
    await nextTick()
    scrollToBottom()
  } catch (error: any) {
    console.error('加载 AI 会话失败:', error)
    messageStore.error(error.message || '加载 AI 会话失败，请稍后重试')
  }
}

function scrollToBottom() {
  const el = messagesContainer.value
  if (el) el.scrollTop = el.scrollHeight
}

function handleScroll() {
  const el = messagesContainer.value
  if (!el) return
  const distance = el.scrollHeight - el.scrollTop - el.clientHeight
  showScrollDown.value = distance > 60
}

watch(messages, () => {
  nextTick(() => {
    if (!showScrollDown.value) scrollToBottom()
  })
}, { deep: true })

const sendPrompt = async () => {
  const value = prompt.value.trim()
  if (!value) return
  prompt.value = ''
  scrollToBottom()
  try {
    if (chatMode.value === 'standard') {
      await assistantStore.sendMessageNonStream(value)
    } else {
      await assistantStore.sendMessage(value)
    }
  } catch (error: any) {
    console.error('发送 AI 消息失败:', error)
    messageStore.error(error.message || '发送 AI 消息失败，请稍后重试')
  }
}

const openDraftDialog = () => {
  draftDialogOpen.value = true
}

const submitDraft = async () => {
  try {
    await assistantStore.generateActivityDraft({
      topic: draftForm.topic.trim(),
      target_people: draftForm.target_people.trim(),
      location: draftForm.location.trim()
    })
    draftDialogOpen.value = false
    draftForm.topic = ''
    draftForm.target_people = ''
    draftForm.location = ''
  } catch (error: any) {
    console.error('生成活动草案失败:', error)
    messageStore.error(error.message || '生成活动草案失败，请稍后重试')
  }
}

const formatNumber = (n: number) => n.toLocaleString('zh-CN')

const finishReasonText = (finishReason: number) => {
  if (finishReason === 1) return '正常完成'
  if (finishReason === 2) return '长度截断'
  if (finishReason === 3) return '工具调用结束'
  return '处理中'
}

const formatDateTime = (value?: string) => {
  if (!value) return '刚刚'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  assistantStore.restoreSessions()
  if (assistantStore.currentSessionId) {
    try {
      await assistantStore.loadMessages(assistantStore.currentSessionId)
      return
    } catch (error) {
      console.error('恢复 AI 会话失败:', error)
    }
  }

  await createNewSession()
})
</script>

<style scoped>
.typing-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background-color: #ec5b13;
  animation: typingPulse 1.2s ease-in-out infinite;
}
@keyframes typingPulse {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.85); }
  30% { opacity: 1; transform: scale(1); }
}
</style>
