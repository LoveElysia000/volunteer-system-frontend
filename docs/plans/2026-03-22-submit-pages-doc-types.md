# Submit Pages Doc Types Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make submit-type pages use the API document's field names and field types directly, minimizing front-end-only payload reshaping.

**Architecture:** Keep UI-only state only where the browser input format requires it, but make request-facing form objects match the API request types as closely as possible. Focus on write paths first: form state, validation, and submit payloads for activity, organization, and volunteer update flows.

**Tech Stack:** Vue 3, Pinia, TypeScript, Vite, ESLint

---

### Task 1: Inventory Submit Paths

**Files:**
- Modify: `frontend-api-integration.md`
- Inspect: `src/views/Organization/ActivityCreate.vue`
- Inspect: `src/views/Organization/ActivityManagement.vue`
- Inspect: `src/views/Organization/OrganizationInfo.vue`
- Inspect: `src/views/Volunteer/Profile.vue`
- Inspect: `src/types/activity.ts`
- Inspect: `src/types/organization.ts`
- Inspect: `src/types/volunteer.ts`

**Step 1: Confirm request fields and types from the document**

Verify these payloads:
- `POST /api/activities/create`
- `PUT /api/activities/:id`
- `PUT /api/volunteers/:id`
- `POST /api/volunteers/real-name/submit`
- Organization update request currently inferred from type definitions

**Step 2: Map each page's current custom shaping**

Record where pages:
- keep duplicate UI field names
- stringify numeric values before validation
- rename fields before submit
- convert request objects in-place right before calling the API

**Step 3: Commit**

```bash
git add frontend-api-integration.md src/views/Organization/ActivityCreate.vue src/views/Organization/ActivityManagement.vue src/views/Organization/OrganizationInfo.vue src/views/Volunteer/Profile.vue src/types/activity.ts src/types/organization.ts src/types/volunteer.ts
git commit -m "docs: capture submit page doc type alignment plan"
```

### Task 2: Align Activity Create And Edit Requests

**Files:**
- Modify: `src/views/Organization/ActivityCreate.vue`
- Modify: `src/views/Organization/ActivityManagement.vue`
- Modify: `src/types/activity.ts`

**Step 1: Write the failing test**

Current project has no automated component test setup. Use targeted static verification as the temporary guard:

Run:
```bash
npx eslint src/views/Organization/ActivityCreate.vue src/views/Organization/ActivityManagement.vue src/types/activity.ts
```

Expected: pass before refactor, then re-run after changes to catch scripting/template errors.

**Step 2: Write minimal implementation**

Change the activity form flow so that:
- request-facing state uses `CreateOrganizationActivityRequest` or `UpdateOrganizationActivityRequest`-compatible fields
- `duration` stays numeric
- `maxPeople` stays numeric
- only browser-specific datetime formatting remains as an input adapter
- payload assembly does not rename keys or coerce numbers through `Number(...)` unless required by browser input handling

**Step 3: Run verification**

Run:
```bash
npx eslint src/views/Organization/ActivityCreate.vue src/views/Organization/ActivityManagement.vue src/types/activity.ts
npm run build
```

Expected: PASS

**Step 4: Commit**

```bash
git add src/views/Organization/ActivityCreate.vue src/views/Organization/ActivityManagement.vue src/types/activity.ts
git commit -m "refactor: align activity submit forms with api types"
```

### Task 3: Align Organization Update Requests

**Files:**
- Modify: `src/views/Organization/OrganizationInfo.vue`
- Modify: `src/types/organization.ts`
- Modify: `src/store/modules/organization.ts`

**Step 1: Write the failing test**

Run:
```bash
npx eslint src/views/Organization/OrganizationInfo.vue src/types/organization.ts src/store/modules/organization.ts
```

Expected: pass before refactor, then use the same command after changes as the regression check.

**Step 2: Write minimal implementation**

Refactor the organization info form so that:
- the editable form shape directly matches `UpdateOrganizationRequest`
- submit logic passes the form object without rebuilding the same structure field-by-field
- empty-string trimming is only kept where it is a real request decision

**Step 3: Run verification**

Run:
```bash
npx eslint src/views/Organization/OrganizationInfo.vue src/types/organization.ts src/store/modules/organization.ts
npm run build
```

Expected: PASS

**Step 4: Commit**

```bash
git add src/views/Organization/OrganizationInfo.vue src/types/organization.ts src/store/modules/organization.ts
git commit -m "refactor: align organization update form with api request"
```

### Task 4: Align Volunteer Update And Real-Name Requests

**Files:**
- Modify: `src/views/Volunteer/Profile.vue`
- Modify: `src/types/volunteer.ts`
- Modify: `src/store/modules/volunteer.ts`

**Step 1: Write the failing test**

Run:
```bash
npx eslint src/views/Volunteer/Profile.vue src/types/volunteer.ts src/store/modules/volunteer.ts
```

Expected: pass before refactor, then use the same command after changes to validate the edit.

**Step 2: Write minimal implementation**

Change the volunteer profile flow so that:
- editable request-facing state directly matches `UpdateVolunteerProfileRequest`
- `gender` remains numeric per type definition
- real-name submit state directly matches `VolunteerRealNameSubmitRequest`
- submit functions pass request objects without reconstructing renamed payloads

**Step 3: Run verification**

Run:
```bash
npx eslint src/views/Volunteer/Profile.vue src/types/volunteer.ts src/store/modules/volunteer.ts
npm run build
```

Expected: PASS

**Step 4: Commit**

```bash
git add src/views/Volunteer/Profile.vue src/types/volunteer.ts src/store/modules/volunteer.ts
git commit -m "refactor: align volunteer submit forms with api types"
```

### Task 5: Final Verification

**Files:**
- Verify: `src/views/Organization/ActivityCreate.vue`
- Verify: `src/views/Organization/ActivityManagement.vue`
- Verify: `src/views/Organization/OrganizationInfo.vue`
- Verify: `src/views/Volunteer/Profile.vue`

**Step 1: Run focused lint**

```bash
npx eslint src/views/Organization/ActivityCreate.vue src/views/Organization/ActivityManagement.vue src/views/Organization/OrganizationInfo.vue src/views/Volunteer/Profile.vue
```

Expected: PASS

**Step 2: Run production build**

```bash
npm run build
```

Expected: PASS

**Step 3: Summarize residual risk**

Document any remaining UI-only adapters that still exist because browser controls do not natively edit the API field shape.
