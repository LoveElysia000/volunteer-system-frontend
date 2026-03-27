import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const authStoreSource = readFileSync(new URL('../src/store/modules/auth.ts', import.meta.url), 'utf8')

test('auth store normalizes persisted users with accountId only', () => {
  assert.equal(authStoreSource.includes('parsed.accountId ?? parsed.id ??'), false)
  assert.equal(authStoreSource.includes('parsed.accountId ??'), true)
})
