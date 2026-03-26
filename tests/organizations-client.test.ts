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
