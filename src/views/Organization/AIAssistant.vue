<template>
  <div class="space-y-6">
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

    <div class="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <OrganizationSectionCard
        title="会话列表"
        description="查看最近会话，快速切换上下文。"
        tone="soft"
      >
        <div
          v-if="!sessions.length"
          class="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500"
        >
          还没有会话，点击右上角新建即可开始。
        </div>

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

      <OrganizationSectionCard
        title="聊天工作区"
        description="可以直接提问，也可以生成活动草案。"
      >
        <div class="flex h-[560px] flex-col">
          <div class="flex-1 space-y-4 overflow-y-auto pr-1">
            <div
              v-if="assistantStore.loading"
              class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
            >
              正在加载会话消息...
            </div>

            <div
              v-else-if="!messages.length"
              class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
            >
              输入你的问题，或点击“生成活动草案”快速开始。
            </div>

            <article
              v-for="message in messages"
              :key="message.id"
              class="rounded-[1.2rem] px-4 py-4"
              :class="message.role === 1 ? 'ml-auto max-w-[85%] bg-[#fff1ea]' : 'mr-auto max-w-[92%] border border-slate-200 bg-white'"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {{ roleText(message.role) }}
              </p>
              <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {{ message.content }}
              </p>
              <p class="mt-2 text-xs text-slate-400">
                {{ message.created_at || '刚刚' }}
              </p>
            </article>
          </div>

          <div class="mt-4 border-t border-slate-100 pt-4">
            <Textarea
              v-model="prompt"
              :rows="4"
              placeholder="例如：帮我写一份社区环保日活动方案，包含招募文案和执行提醒。"
            />
            <div class="mt-3 flex justify-end">
              <button
                class="rounded-full bg-[#ec5b13] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d04f14] disabled:opacity-60"
                :disabled="assistantStore.sending || !prompt.trim()"
                @click="sendPrompt"
              >
                {{ assistantStore.sending ? '发送中...' : '发送' }}
              </button>
            </div>
          </div>
        </div>
      </OrganizationSectionCard>
    </div>

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
          <button
            class="org-toolbar-button"
            @click="draftDialogOpen = false"
          >
            取消
          </button>
          <button
            class="rounded-full bg-[#ec5b13] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d04f14] disabled:opacity-60"
            :disabled="assistantStore.sending || !draftForm.topic.trim()"
            @click="submitDraft"
          >
            {{ assistantStore.sending ? '生成中...' : '生成草案' }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import OrganizationPageHeader from '@/components/organization/OrganizationPageHeader.vue'
import OrganizationSectionCard from '@/components/organization/OrganizationSectionCard.vue'
import Dialog from '@/components/ui/Dialog.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import { useAssistantStore } from '@/store/modules/assistant'
import { useMessageStore } from '@/store/modules/messages'

const assistantStore = useAssistantStore()
const messageStore = useMessageStore()

const prompt = ref('')
const draftDialogOpen = ref(false)
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
    const session = await assistantStore.createSession('新会话', 'organization-assistant')
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
  } catch (error: any) {
    console.error('加载 AI 会话失败:', error)
    messageStore.error(error.message || '加载 AI 会话失败，请稍后重试')
  }
}

const sendPrompt = async () => {
  const value = prompt.value.trim()
  if (!value) return
  try {
    await assistantStore.sendMessage(value)
    prompt.value = ''
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

const roleText = (role: number) => {
  if (role === 1) return '助手'
  if (role === 2) return '你'
  return '消息'
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
