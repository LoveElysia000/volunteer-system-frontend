import test from 'node:test'
import assert from 'node:assert/strict'

import { routes } from '../src/router/routes.ts'

test('volunteer routes include notification center entry', () => {
  const volunteerRoute = routes.find((route) => route.name === 'volunteer')
  const children = volunteerRoute?.children || []
  const notificationRoute = children.find((route) => route.name === 'volunteer-notifications')

  assert.ok(notificationRoute)
  assert.equal(notificationRoute?.path, 'notifications')
  assert.equal(notificationRoute?.meta?.title, '通知中心')
})
