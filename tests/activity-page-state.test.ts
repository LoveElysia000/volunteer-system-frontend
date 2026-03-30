import test from 'node:test'
import assert from 'node:assert/strict'

import {
  planVolunteerActivityRouteSync
} from '../src/views/Volunteer/activityPageState.ts'

test('planVolunteerActivityRouteSync refreshes when entering activities from another page', () => {
  const plan = planVolunteerActivityRouteSync({
    routeName: 'volunteer-activities',
    previousRouteName: 'volunteer-dashboard',
    query: {
      tab: 'finished',
      search: '巡河',
      startFrom: '2026-03-01',
      endTo: '2026-03-31',
      id: '42'
    },
    hasLoadedOnce: false,
    currentState: {
      tab: 'all',
      search: '',
      startFrom: '',
      endTo: '',
      activityId: null
    }
  })

  assert.equal(plan.shouldRefresh, true)
  assert.equal(plan.shouldResetPage, true)
  assert.equal(plan.shouldOpenFromQuery, true)
  assert.deepEqual(plan.nextState, {
    tab: 'finished',
    search: '巡河',
    startFrom: '2026-03-01',
    endTo: '2026-03-31',
    activityId: 42
  })
})

test('planVolunteerActivityRouteSync stays idle when route state is unchanged after first load', () => {
  const plan = planVolunteerActivityRouteSync({
    routeName: 'volunteer-activities',
    previousRouteName: 'volunteer-activities',
    query: {
      tab: 'all',
      search: ''
    },
    hasLoadedOnce: true,
    currentState: {
      tab: 'all',
      search: '',
      startFrom: '',
      endTo: '',
      activityId: null
    }
  })

  assert.equal(plan.shouldRefresh, false)
  assert.equal(plan.shouldResetPage, false)
  assert.equal(plan.shouldOpenFromQuery, true)
})

test('planVolunteerActivityRouteSync refreshes when date filters change through the route', () => {
  const plan = planVolunteerActivityRouteSync({
    routeName: 'volunteer-activities',
    previousRouteName: 'volunteer-activities',
    query: {
      tab: 'all',
      search: '',
      startFrom: '2026-04-01',
      endTo: '2026-04-30'
    },
    hasLoadedOnce: true,
    currentState: {
      tab: 'all',
      search: '',
      startFrom: '',
      endTo: '',
      activityId: null
    }
  })

  assert.equal(plan.shouldRefresh, true)
  assert.equal(plan.shouldResetPage, true)
  assert.deepEqual(plan.nextState, {
    tab: 'all',
    search: '',
    startFrom: '2026-04-01',
    endTo: '2026-04-30',
    activityId: null
  })
})
