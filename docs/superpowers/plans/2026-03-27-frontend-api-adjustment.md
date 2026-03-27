# Frontend API Adjustment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the frontend with `frontend-api-adjustment.md` exactly, removing old self-ID passing logic and unifying `accountId`, `/api/me/...`, and resource path semantics.

**Architecture:** Start from authentication state and type definitions so the ID model is corrected at the source, then update the "my" APIs and related stores/pages that currently derive or pass volunteer IDs for self-service flows. Finish by normalizing organization and activity resource API signatures and run a full repo verification pass for old paths and old field names.

**Tech Stack:** Vue 3, Pinia, TypeScript, Vite, Axios-style HTTP wrapper

---

### Task 1: Correct login state and response typing

**Files:**
- Modify: `src/types/auth.ts`
- Modify: `src/store/modules/auth.ts`

- [x] **Step 1: Update auth response types to the new backend contract**

Change `UserInfo.userId` to `UserInfo.accountId` in `src/types/auth.ts`, and keep `LoginResponse` / `RefreshTokenResponse` using that updated shape.

- [x] **Step 2: Update auth-store user mapping**

In `src/store/modules/auth.ts`, change `transformUserInfo()` to read `userInfo.accountId` instead of `userInfo.userId`.

- [x] **Step 3: Keep restore logic compatible with old local data**

Retain compatibility in `normalizeStoredUser()` for already persisted users, but treat `accountId` as the canonical field.

- [x] **Step 4: Verify refresh flow writes the same canonical field**

Confirm login and refresh both persist the transformed user with `accountId`, and remove any remaining `userInfo.userId` reads in auth-related code.

- [x] **Step 5: Repo check**

Run: `rg -n "userInfo\\.userId|currentUser\\.id|auth\\.userId" src`
Expected: no active reads that drive login state

### Task 2: Normalize "my" volunteer APIs to `/api/me/...`

**Files:**
- Modify: `src/api/volunteer.ts`
- Modify: `src/store/modules/volunteer.ts`
- Modify: `src/views/Volunteer/VolunteerLayout.vue`
- Modify: `src/views/Volunteer/Profile.vue`
- Modify: `src/views/Volunteer/Organizations.vue`

- [x] **Step 1: Replace my-profile endpoint**

In `src/api/volunteer.ts`, change `getMyProfile(id)` to `getMyProfile()` and move the endpoint from `/api/volunteers/my/profile/:id` to `/api/me/profile`.

- [x] **Step 2: Replace my-account endpoint**

In `src/api/volunteer.ts`, move `updateAccount()` from `/api/volunteers/account` to `/api/me/account`.

- [x] **Step 3: Replace my-volunteer-profile endpoint**

In `src/api/volunteer.ts`, change `updateProfile(id, data)` to `updateProfile(data)` and move the endpoint from `/api/volunteers/:id` to `/api/me/volunteer-profile`.

- [x] **Step 4: Remove self volunteer-id dependency in volunteer store**

In `src/store/modules/volunteer.ts`, remove the `id` parameter from `fetchMyProfile()` and `updateMyProfile()`, and call the new no-ID API methods.

- [x] **Step 5: Remove self ID assembly from volunteer pages**

Update `src/views/Volunteer/VolunteerLayout.vue`, `src/views/Volunteer/Profile.vue`, and `src/views/Volunteer/Organizations.vue` so they no longer convert `authStore.user.accountId` into a request path parameter for `fetchMyProfile()`.

- [x] **Step 6: Verify repo no longer passes self volunteerId to my APIs**

Run: `rg -n "fetchMyProfile\\(|updateMyProfile\\(" src`
Expected: calls without self-ID arguments

### Task 3: Normalize my organization list and join flow

**Files:**
- Modify: `src/types/membership.ts`
- Modify: `src/api/memberships.ts`
- Modify: `src/store/modules/memberships.ts`
- Modify: `src/views/Volunteer/Profile.vue`
- Modify: `src/views/Volunteer/Organizations.vue`

- [x] **Step 1: Update join DTO**

In `src/types/membership.ts`, remove `volunteerId` from `VolunteerJoinRequest`.

- [x] **Step 2: Move my organizations endpoint to `/api/me/organizations`**

In `src/api/memberships.ts`, change `getVolunteerOrganizations()` so it no longer accepts `volunteerId` and uses `GET /api/me/organizations` while preserving paging/filter params.

- [x] **Step 3: Remove volunteer-id lookup from memberships store**

In `src/store/modules/memberships.ts`, remove `resolveCurrentVolunteerId()` and refactor `fetchMyOrganizations()` / `joinOrganization()` / `leaveOrganization()` so they do not require the current volunteer business ID for self-service flows.

- [x] **Step 4: Update volunteer views to match the new self-service contract**

Remove "current account lacks volunteer identifier" guards that only existed to support old self volunteer-ID routing when those guards are no longer needed for leave/list flows.

- [x] **Step 5: Verify join request body**

Run: `rg -n "volunteerId\\s*[:,]" src`
Expected: no self-service join payload still sends `volunteerId`

### Task 4: Fix volunteer detail API to use explicit volunteerId resource path

**Files:**
- Modify: `src/api/volunteer.ts`
- Inspect/Modify as needed: volunteer detail callers found via search

- [x] **Step 1: Update volunteer detail endpoint**

Change `src/api/volunteer.ts` from `/api/volunteers/detail/:id` to `/api/volunteers/:volunteerId`.

- [x] **Step 2: Rename function parameter for clarity**

Use `volunteerId` in the API signature and any touched call sites so the business meaning is explicit.

- [x] **Step 3: Verify callers are not feeding accountId**

Run: `rg -n "getDetail\\(" src`
Expected: touched usages remain semantically volunteer-detail calls, not auth-account lookups

### Task 5: Normalize organization resource API signatures

**Files:**
- Modify: `src/api/organizations-client.ts`
- Modify: `src/api/organizations.ts`
- Inspect/Modify callers returned by search

- [x] **Step 1: Rename resource parameters**

Rename `id` to `organizationId` in organization API client and facade methods for detail, update, remove, disable, and enable.

- [x] **Step 2: Keep URLs on the new named resource pattern**

Ensure the generated paths all match `/api/organizations/:organizationId` and nested action paths such as `/disable` and `/enable`.

- [x] **Step 3: Verify callers read semantically correct IDs**

Run: `rg -n "organizationsApi\\.(detail|update|remove|disable|enable)\\(" src`
Expected: callers pass organization business IDs and remain easy to audit

### Task 6: Normalize activity resource API signatures and action paths

**Files:**
- Modify: `src/api/activities-client.ts`
- Modify: `src/api/activities.ts`
- Modify as needed: `src/views/Organization/ActivityManagement.vue`
- Inspect/Modify callers returned by search

- [x] **Step 1: Rename resource parameters**

Rename `id` to `activityId` in activity API client and facade methods for detail, update, remove, cancel-by-organization, finish-by-organization, and attendance-code operations.

- [x] **Step 2: Fix organization activity action paths**

Update the endpoints to:
`/api/activities/:activityId/cancel`
`/api/activities/:activityId/finish`
`/api/activities/:activityId/attendance-codes/generate`
`/api/activities/:activityId/attendance-codes/reset`
`/api/activities/:activityId/attendance-codes`

- [x] **Step 3: Verify management page still passes activity business IDs**

Run: `rg -n "activitiesApi\\.(detail|update|remove|cancelByOrganization|finishByOrganization|generateAttendanceCodes|resetAttendanceCode|getAttendanceCodes)\\(" src`
Expected: callers remain activity-resource oriented and are easier to review because parameter names are explicit

### Task 7: Final regression sweep

**Files:**
- Inspect: `src/**/*` via targeted search

- [x] **Step 1: Search for old self-service paths**

Run: `rg -n "/api/volunteers/my/profile|/api/volunteers/account|/api/volunteers/\\$\\{|/api/volunteers/detail|/api/activities/cancel/|/api/activities/finish/|attendance-codes/generate/|attendance-codes/reset/|attendance-codes/\\$" src`
Expected: no stale old-path usages remain

- [x] **Step 2: Search for ID confusion hotspots**

Run: `rg -n "accountId|volunteerId|organizationId|activityId|membershipId|signupId" src`
Expected: touched code reads clearly with no `accountId` used where volunteer detail resources require `volunteerId`

- [x] **Step 3: Run the test/build verification**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors introduced by the API contract update

- [ ] **Step 4: Optional focused smoke check**

Manually verify these flows in the browser after build if runtime QA is part of this pass:
1. Login and refresh token recovery
2. Volunteer "my profile" load and edit
3. Volunteer "my organizations" list, join, leave
4. Volunteer detail page from management side
5. Organization activity cancel/finish/attendance code actions

---

## Documentation Audit Status

### `frontend-api-adjustment.md` completion map

- `[x]` Section 1 core conclusions reflected in frontend code
- `[x]` Section 2 ID concepts aligned in touched auth, volunteer, membership, organization, and activity code
- `[x]` Section 3.1 login response field updated from `userId` to `accountId`
- `[x]` Section 3.2 refresh-token response field updated from `userId` to `accountId`
- `[-]` Section 3.3 JWT claims decoding changes not applicable in this repo
  No `parseJwt`, `decodeToken`, `getCurrentUserFromToken`, or direct JWT-decoding route-guard logic exists in `src`
- `[x]` Section 4.1 `LoginResponse.userInfo` updated to use `accountId`
- `[x]` Section 4.2 `RefreshTokenResponse.userInfo` updated to use `accountId`
- `[x]` Section 5.1 my profile endpoint updated to `GET /api/me/profile`
- `[x]` Section 5.2 my account endpoint updated to `PUT /api/me/account`
- `[x]` Section 5.3 my volunteer profile endpoint updated to `PUT /api/me/volunteer-profile`
- `[x]` Section 5.4 my organizations endpoint updated to `GET /api/me/organizations`
- `[x]` Section 5.5 join-organization request body now sends only `organizationId`
- `[x]` Section 5.6 volunteer detail endpoint updated to `GET /api/volunteers/:volunteerId`
- `[x]` Section 5.7 organization resource API signatures renamed to `organizationId`
- `[x]` Section 5.8 activity resource API signatures renamed to `activityId` and action paths updated
- `[x]` Section 6.1 auth store and current-user persistence logic unified on `accountId`
- `[-]` Section 6.2 JWT decode tool changes not applicable in this repo
- `[x]` Section 6.3 "my" page API wrappers no longer assemble or pass self `volunteerId`
- `[x]` Section 6.4 join DTO no longer contains `volunteerId`

### Verification evidence

- `rg -n "userInfo\\.userId|/api/volunteers/my/profile|/api/volunteers/account|/api/volunteers/detail|/api/volunteers/\\$\\{|/api/activities/cancel/|/api/activities/finish/|attendance-codes/generate/|attendance-codes/reset/|/api/activities/attendance-codes/[A-Za-z_$]|parseJwt|decodeToken|getCurrentUserFromToken|payload\\.sub|currentUser\\.id|auth\\.userId|authStore\\.user\\?\\.id|user\\.value\\?\\.id" src tests`
  Result: no matches
- `node --test tests/activities-client.test.ts tests/organizations-client.test.ts`
  Result: 7 tests passed, 0 failed
- `npm run build`
  Result: build succeeded
