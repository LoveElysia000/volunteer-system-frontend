import test from 'node:test'
import assert from 'node:assert/strict'

import { createActivitiesApi } from '../src/api/activities-client.ts'
import { mergeVolunteerActivityRows } from '../src/api/volunteer-activity-merge.ts'

test('listRegisteredActivities uses unified activities endpoint with registeredOnly enabled', async () => {
  const calls: Array<{ url: string; data: unknown }> = []
  const api = createActivitiesApi({
    post: async <T>(url: string, data?: unknown) => {
      calls.push({ url, data })
      return {} as T
    },
    get: async <T>() => ({} as T),
    put: async <T>() => ({} as T),
    delete: async <T>() => ({} as T)
  })

  await api.listRegisteredActivities({
    page: 2,
    pageSize: 20,
    status: 1
  })

  assert.deepEqual(calls, [
    {
      url: '/api/activities',
      data: {
        page: 2,
        pageSize: 20,
        status: 1,
        registeredOnly: true
      }
    }
  ])
})

test('list keeps registeredOnly optional for activity hall queries', async () => {
  const calls: Array<{ url: string; data: unknown }> = []
  const api = createActivitiesApi({
    post: async <T>(url: string, data?: unknown) => {
      calls.push({ url, data })
      return {} as T
    },
    get: async <T>() => ({} as T),
    put: async <T>() => ({} as T),
    delete: async <T>() => ({} as T)
  })

  await api.list({
    page: 1,
    pageSize: 10,
    keyword: '环保'
  })

  assert.deepEqual(calls, [
    {
      url: '/api/activities',
      data: {
        page: 1,
        pageSize: 10,
        keyword: '环保'
      }
    }
  ])
})

test('mergeVolunteerActivityRows keeps signup status and audit reason from registered-only results', () => {
  const rows = mergeVolunteerActivityRows(
    [
      {
        id: 11,
        title: '净滩行动',
        description: '活动大厅记录',
        startTime: '2026-03-30T09:00:00Z',
        endTime: '2026-03-30T11:00:00Z',
        location: '滨江',
        duration: 2,
        maxPeople: 20,
        currentPeople: 8,
        status: 1,
        isRegistered: false
      }
    ],
    [
      {
        id: 11,
        orgId: 3,
        orgName: '绿色守护者',
        title: '净滩行动',
        description: '我的活动记录',
        startTime: '2026-03-30T09:00:00Z',
        endTime: '2026-03-30T11:00:00Z',
        location: '滨江',
        duration: 2,
        maxPeople: 20,
        currentPeople: 8,
        status: 1,
        signupStatus: 3,
        auditReason: '名额已满'
      }
    ]
  )

  assert.equal(rows.length, 1)
  assert.equal(rows[0]?.tag, '已驳回')
  assert.equal(rows[0]?.signupStatus, 3)
  assert.equal(rows[0]?.auditReason, '名额已满')
})

test('organization activity actions use activity resource style paths', async () => {
  const postCalls: Array<{ url: string; data: unknown }> = []
  const getCalls: Array<{ url: string; params: unknown }> = []
  const api = createActivitiesApi({
    post: async <T>(url: string, data?: unknown) => {
      postCalls.push({ url, data })
      return {} as T
    },
    get: async <T>(url: string, params?: unknown) => {
      getCalls.push({ url, params })
      return {} as T
    },
    put: async <T>() => ({} as T),
    delete: async <T>() => ({} as T)
  })

  await api.cancelByOrganization(12, { reason: '天气原因' })
  await api.finishByOrganization(12)
  await api.generateAttendanceCodes(12, { codeType: 1 })
  await api.resetAttendanceCode(12, { codeType: 2, validMinutes: 15 })
  await api.getAttendanceCodes(12)

  assert.deepEqual(postCalls, [
    { url: '/api/activities/12/cancel', data: { reason: '天气原因' } },
    { url: '/api/activities/12/finish', data: undefined },
    { url: '/api/activities/12/attendance-codes/generate', data: { codeType: 1 } },
    { url: '/api/activities/12/attendance-codes/reset', data: { codeType: 2, validMinutes: 15 } }
  ])
  assert.deepEqual(getCalls, [
    { url: '/api/activities/12/attendance-codes', params: undefined }
  ])
})
