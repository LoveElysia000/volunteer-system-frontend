# Frontend Page API Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align frontend routes, API clients, stores, and page-level UI with the backend API contract documented on 2026-03-27, including currently unintegrated documented interfaces and document-external but already-routed capabilities.

**Architecture:** Keep the existing Vue 3 + Pinia structure, using page-by-page contract checks to decide whether a fix belongs in API clients, stores, or UI. Prefer minimal UI additions inside existing pages so every documented backend capability is either correctly consumed by an existing page or exposed through a focused new entry point.

**Tech Stack:** Vue 3, Pinia, TypeScript, Vite, node:test, existing API client wrappers in `src/api`

---

### Task 1: Lock API contract coverage with client/store tests

**Files:**
- Modify: `tests/activities-client.test.ts`
- Modify: `tests/organizations-client.test.ts`
- Create: `tests/audits-client.test.ts`
- Create: `tests/assistant-client.test.ts`
- Create: `tests/memberships-client.test.ts`
- Create: `tests/analytics-admin-client.test.ts`

- [ ] **Step 1: Write failing tests for missing documented interfaces and path/param guarantees**

Cover:
- audit endpoints (`/api/audits/pending`, `/records/:id`, `/approval`, `/rejection`, `/batch-decision`)
- assistant non-stream chat path and any page-facing fallback behavior hooks
- membership self-organization list/join/leave shape
- analytics/admin export endpoints already consumed by statistics pages
- any newly discovered documented but untested client endpoints

- [ ] **Step 2: Run the targeted node tests to verify they fail for the right reason**

Run:
```bash
node --test tests/audits-client.test.ts tests/assistant-client.test.ts tests/memberships-client.test.ts tests/analytics-admin-client.test.ts
```

Expected:
- missing tests fail on wrong URL, wrong payload shaping, or missing exports

- [ ] **Step 3: Implement the minimal API client/store changes required to satisfy the contract**

Focus on:
- request path correctness
- payload normalization
- response-field assumptions used by pages

- [ ] **Step 4: Re-run the targeted tests to verify they pass**

Run:
```bash
node --test tests/activities-client.test.ts tests/organizations-client.test.ts tests/audits-client.test.ts tests/assistant-client.test.ts tests/memberships-client.test.ts tests/analytics-admin-client.test.ts
```

Expected:
- all pass

- [ ] **Step 5: Commit**

```bash
git add tests/activities-client.test.ts tests/organizations-client.test.ts tests/audits-client.test.ts tests/assistant-client.test.ts tests/memberships-client.test.ts tests/analytics-admin-client.test.ts src/api src/store
git commit -m "test: lock frontend api alignment contracts"
```

### Task 2: Align volunteer-side page integration

**Files:**
- Modify: `src/views/Volunteer/Dashboard.vue`
- Modify: `src/views/Volunteer/Profile.vue`
- Modify: `src/views/Volunteer/Activities.vue`
- Modify: `src/views/Volunteer/ActivityDetail.vue`
- Modify: `src/views/Volunteer/MyRegistrations.vue`
- Modify: `src/views/Volunteer/Organizations.vue`
- Modify: `src/store/modules/volunteer.ts`
- Modify: `src/store/modules/memberships.ts`
- Test: `tests/me-membership-guards.test.ts`

- [ ] **Step 1: Write failing tests for volunteer contract gaps where logic is testable without browser rendering**

Examples:
- membership join/leave request shaping
- profile/account/real-name store flows
- volunteer dashboard summary normalization if needed

- [ ] **Step 2: Run the focused tests to verify failure**

Run:
```bash
node --test tests/me-membership-guards.test.ts
```

- [ ] **Step 3: Implement minimal volunteer-page fixes**

Focus on:
- remove duplicated organization-join behavior from profile if a dedicated organization page should own it
- ensure dashboard/profile read real API-backed data instead of placeholder-only content where the document says "已承接"
- ensure organization page fully covers public list, joined list, join, and leave flows

- [ ] **Step 4: Re-run relevant tests and quick type checks**

Run:
```bash
node --test tests/me-membership-guards.test.ts
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/views/Volunteer src/store/modules/volunteer.ts src/store/modules/memberships.ts tests/me-membership-guards.test.ts
git commit -m "feat: align volunteer page api integration"
```

### Task 3: Align organization management pages already marked as integrated

**Files:**
- Modify: `src/views/Organization/OrganizationInfo.vue`
- Modify: `src/views/Organization/VolunteerManagement.vue`
- Modify: `src/views/Organization/Members.vue`
- Modify: `src/views/Organization/ActivityManagement.vue`
- Modify: `src/views/Organization/ActivityCreate.vue`
- Modify: `src/views/Organization/WorkHours.vue`
- Modify: `src/views/Organization/Notifications.vue`
- Modify: `src/views/Organization/Dashboard.vue`
- Modify: `src/views/Organization/Statistics.vue`
- Modify: `src/views/Organization/StatisticsActivities.vue`
- Modify: `src/views/Organization/StatisticsVolunteers.vue`
- Modify: `src/store/modules/organization.ts`
- Modify: `src/store/modules/analytics.ts`
- Modify: `src/store/modules/notifications.ts`

- [ ] **Step 1: Write failing tests for any organization-side API shaping gaps discovered in Task 1 audit**

- [ ] **Step 2: Run those tests and verify failure reason**

- [ ] **Step 3: Fix page/store/client mismatches**

Focus on:
- request payload shape and enum usage
- export/import action wiring
- statistics/dashboard shared endpoint handling
- activity-management details, attendance-code operations, and supplementary attendance

- [ ] **Step 4: Re-run targeted tests plus lint**

Run:
```bash
node --test tests/activities-client.test.ts tests/organizations-client.test.ts tests/analytics-admin-client.test.ts
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/views/Organization src/store/modules/organization.ts src/store/modules/analytics.ts src/store/modules/notifications.ts tests/activities-client.test.ts tests/organizations-client.test.ts tests/analytics-admin-client.test.ts
git commit -m "feat: align organization management pages with backend apis"
```

### Task 4: Expose documented but previously unintegrated capabilities

**Files:**
- Modify: `src/views/Organization/ActivityReview.vue`
- Modify: `src/views/Organization/AIAssistant.vue`
- Modify: `src/store/modules/audits.ts`
- Modify: `src/store/modules/assistant.ts`
- Modify: `src/router/routes.ts` (only if routing/entry refinements are needed)
- Create/Modify: focused UI helpers only if required by the chosen minimal page design

- [ ] **Step 1: Write failing tests for audits and assistant non-stream fallback behaviors**

Examples:
- audit batch action request contract
- assistant plain chat endpoint usage as explicit fallback/manual mode

- [ ] **Step 2: Run targeted tests to verify they fail**

Run:
```bash
node --test tests/audits-client.test.ts tests/assistant-client.test.ts
```

- [ ] **Step 3: Implement minimal UI to fully承接 documented but missing capabilities**

Focus on:
- make audit page an intentional organization capability rather than hidden code
- add a visible non-stream interaction path or graceful fallback for AI chat where documented as "已封装未承接"
- ensure these pages surface backend results meaningfully instead of leaving capabilities unreachable

- [ ] **Step 4: Re-run targeted tests and lint**

Run:
```bash
node --test tests/audits-client.test.ts tests/assistant-client.test.ts
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/views/Organization/ActivityReview.vue src/views/Organization/AIAssistant.vue src/store/modules/audits.ts src/store/modules/assistant.ts src/router/routes.ts tests/audits-client.test.ts tests/assistant-client.test.ts
git commit -m "feat: surface pending audits and assistant fallback flows"
```

### Task 5: Final verification and residual-gap sweep

**Files:**
- Modify: only files required by verification fallout

- [ ] **Step 1: Run the full available automated verification**

Run:
```bash
node --test tests/*.test.ts
npm run lint
npm run build
```

- [ ] **Step 2: Fix any failures with the same red-green loop**

- [ ] **Step 3: Re-run verification until clean**

- [ ] **Step 4: Produce a page-by-page outcome summary for the user**

Include:
- pages aligned
- newly exposed interfaces
- remaining risks if backend contract ambiguities remain

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: finish frontend backend api alignment sweep"
```
