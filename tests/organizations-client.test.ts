import test from 'node:test'
import assert from 'node:assert/strict'

import { createOrganizationsApi } from '../src/api/organizations-client.ts'

test('publicList uses volunteer public organizations endpoint', async () => {
  const calls: Array<{ url: string; data: unknown }> = []
  const api = createOrganizationsApi({
    post: async <T>(url: string, data?: unknown) => {
      calls.push({ url, data })
      return {} as T
    },
    get: async <T>() => ({} as T),
    put: async <T>() => ({} as T),
    delete: async <T>() => ({} as T)
  })

  await api.publicList({
    keyword: '环保',
    organizationType: '公益',
    region: '上海',
    page: 1,
    pageSize: 24
  })

  assert.deepEqual(calls, [
    {
      url: '/api/organizations/public-list',
      data: {
        keyword: '环保',
        organizationType: '公益',
        region: '上海',
        page: 1,
        pageSize: 24
      }
    }
  ])
})

test('list keeps manager organizations endpoint unchanged', async () => {
  const calls: Array<{ url: string; data: unknown }> = []
  const api = createOrganizationsApi({
    post: async <T>(url: string, data?: unknown) => {
      calls.push({ url, data })
      return {} as T
    },
    get: async <T>() => ({} as T),
    put: async <T>() => ({} as T),
    delete: async <T>() => ({} as T)
  })

  await api.list({
    status: [1],
    page: 1,
    pageSize: 10
  })

  assert.deepEqual(calls, [
    {
      url: '/api/organizations/list',
      data: {
        status: [1],
        page: 1,
        pageSize: 10
      }
    }
  ])
})

test('organization resource actions use organizationId paths', async () => {
  const getCalls: Array<{ url: string; params: unknown }> = []
  const putCalls: Array<{ url: string; data: unknown }> = []
  const deleteCalls: Array<{ url: string; params: unknown }> = []
  const postCalls: Array<{ url: string; data: unknown }> = []
  const api = createOrganizationsApi({
    post: async <T>(url: string, data?: unknown) => {
      postCalls.push({ url, data })
      return {} as T
    },
    get: async <T>(url: string, params?: unknown) => {
      getCalls.push({ url, params })
      return {} as T
    },
    put: async <T>(url: string, data?: unknown) => {
      putCalls.push({ url, data })
      return {} as T
    },
    delete: async <T>(url: string, params?: unknown) => {
      deleteCalls.push({ url, params })
      return {} as T
    }
  })

  await api.detail(7)
  await api.update(7, { name: '绿色组织' })
  await api.remove(7)
  await api.disable(7, { reason: '整改' })
  await api.enable(7, { reason: '恢复' })

  assert.deepEqual(getCalls, [{ url: '/api/organizations/7', params: undefined }])
  assert.deepEqual(putCalls, [{ url: '/api/organizations/7', data: { name: '绿色组织' } }])
  assert.deepEqual(deleteCalls, [{ url: '/api/organizations/7', params: undefined }])
  assert.deepEqual(postCalls, [
    { url: '/api/organizations/7/disable', data: { reason: '整改' } },
    { url: '/api/organizations/7/enable', data: { reason: '恢复' } }
  ])
})
