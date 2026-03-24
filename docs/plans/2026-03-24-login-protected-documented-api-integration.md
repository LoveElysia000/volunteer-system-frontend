# Login-Protected Documented API Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Connect all existing login-protected pages that have documented backend APIs, remove misleading placeholder/prototype flows in protected areas, and add the highest-value missing organization pages that already have clear API support.

**Architecture:** Keep the current volunteer and organization visual design intact while moving request/response normalization into `src/api/*`, `src/types/*`, and small mapping helpers. Existing protected pages should become fully API-driven, and missing organization pages should be added into the current information architecture only where a route slot already exists.

**Tech Stack:** Vue 3, TypeScript, Pinia, Axios, Vite

---

### Task 1: Add missing documented API clients and types

**Files:**
- Modify: `src/api/activities.ts`
- Modify: `src/api/organizations.ts`
- Create: `src/api/analytics.ts`
- Create: `src/api/memberships.ts`
- Create: `src/api/audits.ts`
- Modify: `src/types/activity.ts`
- Modify: `src/types/organization.ts`
- Create: `src/types/analytics.ts`
- Create: `src/types/membership.ts`
- Create: `src/types/audit.ts`

**Step 1: Write the failing build expectation**

Document the new typed surface needed from `frontend-api-integration.md`:
- organization analytics funnel and dashboard
- organization members list and membership stats
- pending audits, approve, reject, and detail
- organization-side activity list data mapping

**Step 2: Run build to capture current baseline**

Run: `npm run build`
Expected: PASS before API surface expansion

**Step 3: Add minimal typed clients**

Implement typed helpers for:
- `GET /api/analytics/org/funnel`
- `GET /api/analytics/org/dashboard`
- `GET /api/organizations/:organizationId/members`
- `GET /api/memberships/stats`
- `POST /api/memberships/status/update`
- `POST /api/audits/pending`
- `POST /api/audits/approval`
- `POST /api/audits/rejection`
- `GET /api/audits/records/:id`

Also add organization-activity list mapping helpers that reuse `POST /api/activities`.

**Step 4: Run build to verify types**

Run: `npm run build`
Expected: PASS

### Task 2: Make protected activity flows consistently use real pages and data

**Files:**
- Modify: `src/router/routes.ts`
- Modify: `src/views/Volunteer/Activities.vue`
- Modify: `src/views/Volunteer/MyRegistrations.vue`
- Modify: `src/views/Volunteer/ActivityDetail.vue`
- Modify: `src/views/Organization/ActivityManagement.vue`
- Modify: `src/types/activity.ts`

**Step 1: Write the failing behavior checklist**

Protected activity flows currently fail these expectations:
- login-protected users can still end up at placeholder detail routes
- organization activity management list is still mock data
- organization activity management requires manually entering a “real activity ID”

**Step 2: Replace organization activity list mock usage**

Update `Organization/ActivityManagement.vue` so the page:
- loads activities from `POST /api/activities`
- applies keyword and status filters through documented params
- uses selected row IDs from real backend data
- reuses existing create/update/cancel/finish/attendance actions without manual ID entry

**Step 3: Unify protected detail navigation**

Ensure volunteer protected pages route only to `/volunteer/activities/:id` for authenticated activity detail behavior. Remove protected-area reliance on placeholder detail pages.

**Step 4: Run build to verify**

Run: `npm run build`
Expected: PASS

### Task 3: Replace protected dashboard fallback data with documented analytics

**Files:**
- Modify: `src/views/Organization/Dashboard.vue`
- Modify: `src/composables/useOrganizationDashboardMetrics.ts`
- Modify: `src/views/Organization/Statistics.vue`
- Modify: `src/views/Organization/StatisticsActivities.vue`
- Modify: `src/views/Organization/StatisticsVolunteers.vue`
- Modify: `src/store/modules/organization.ts`
- Create: `src/store/modules/analytics.ts`

**Step 1: Write the failing behavior checklist**

Current organization dashboard/statistics fail these expectations:
- dashboard cards are fallback values
- chart/task/project content is disconnected from documented analytics APIs
- statistics pages do not reflect backend funnel/dashboard metrics

**Step 2: Add minimal analytics store/composable wiring**

Load funnel and dashboard metrics based on active organization ID and a reasonable default date range.

**Step 3: Map analytics data into current UI**

Keep the current visual layout, but source summary numbers, conversion rates, and attendance/work-hour metrics from backend responses. Where the current UI expects richer demo content than the backend exposes, reduce to backend-truthful cards instead of inventing data.

**Step 4: Run build to verify**

Run: `npm run build`
Expected: PASS

### Task 4: Implement organization members page from documented membership APIs

**Files:**
- Modify: `src/views/Organization/Members.vue`
- Modify: `src/store/modules/organization.ts`
- Create: `src/store/modules/memberships.ts`
- Create: `src/types/membership.ts`
- Create: `src/api/memberships.ts`

**Step 1: Write the failing behavior checklist**

Expected behavior:
- members page loads real members for active organization
- page supports documented keyword/status/role filters
- page shows membership stats from `/api/memberships/stats`
- page can submit status updates through `/api/memberships/status/update`

**Step 2: Implement minimal real data page**

Preserve current organization design system and use:
- header metrics from membership stats
- list/table/cards from organization members endpoint
- review/status action controls only if they match current page scope

**Step 3: Run build to verify**

Run: `npm run build`
Expected: PASS

### Task 5: Implement organization review page from documented audit APIs

**Files:**
- Modify: `src/views/Organization/ActivityReview.vue`
- Create: `src/store/modules/audits.ts`
- Create: `src/api/audits.ts`
- Create: `src/types/audit.ts`

**Step 1: Write the failing behavior checklist**

Expected behavior:
- review page loads pending audits from `/api/audits/pending`
- users can inspect audit detail from `/api/audits/records/:id`
- users can approve/reject with documented APIs

**Step 2: Implement real audit queue**

Use the existing organization management visual language. Prefer a compact queue/detail interaction over inventing a new workflow.

**Step 3: Run build to verify**

Run: `npm run build`
Expected: PASS

### Task 6: Remove or neutralize protected placeholder pages that have no documented backing

**Files:**
- Modify: `src/router/routes.ts`
- Modify: `src/views/Profile/Index.vue`
- Modify: protected navigation entry points as needed

**Step 1: Write the failing behavior checklist**

Protected users should not be routed into “开发中” placeholders when a documented-backed protected page already exists or when no supported backend page exists yet.

**Step 2: Remove protected reachability**

Either:
- redirect protected navigation to the real protected page that already exists, or
- remove the protected placeholder route/entry if no documented API-backed page exists

Do not touch login/public showcase routes.

**Step 3: Run build to verify**

Run: `npm run build`
Expected: PASS

### Task 7: Final verification

**Files:**
- Modify: all touched files above

**Step 1: Run full build**

Run: `npm run build`
Expected: PASS

**Step 2: Run lint**

Run: `npm run lint`
Expected: no new errors; existing warnings may remain

**Step 3: Summarize remaining documented modules without UI coverage**

List documented APIs still not exposed in the current UI after this batch, such as work-hours, import/export, RBAC, and AI assistant modules, so they can be scheduled as a second pass instead of being silently forgotten.
