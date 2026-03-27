import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const profileViewSource = readFileSync(new URL('../src/views/Volunteer/Profile.vue', import.meta.url), 'utf8')
const organizationsViewSource = readFileSync(new URL('../src/views/Volunteer/Organizations.vue', import.meta.url), 'utf8')

test('profile membership actions no longer depend on profile.id guards', () => {
  assert.equal(profileViewSource.includes('if (!profile.value?.id) return'), false)
  assert.equal(profileViewSource.includes("messageStore.error('当前账号缺少志愿者标识')"), false)
})

test('organizations page still refreshes memberships even if my-profile loading fails', () => {
  assert.equal(organizationsViewSource.includes('if (!profileReady && !volunteerStore.profile) return'), false)
  assert.equal(organizationsViewSource.includes("messageStore.error('加载志愿者资料失败，暂时无法读取我的组织关系')"), false)
})
