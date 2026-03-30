# Volunteer Organization Public Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add volunteer-side organization public detail loading and display it in the existing organizations page right-side panel.

**Architecture:** Extend the organizations API layer with a volunteer-facing public detail method and add matching public detail types. Update the volunteer organizations page to track the selected organization, load detail data on demand, and render a right-side detail panel while preserving existing join/leave actions.

**Tech Stack:** Vue 3, TypeScript, Pinia, Vite

---

### Task 1: Add public detail API surface

**Files:**
- Modify: `src/types/organization.ts`
- Modify: `src/api/organizations-client.ts`
- Modify: `src/api/organizations.ts`

- [ ] **Step 1: Add the failing type expectation**

Expect the codebase to expose a volunteer-facing public detail data shape and API method named `publicDetail`.

- [ ] **Step 2: Run type checking to verify it fails**

Run: `npx vue-tsc --noEmit`
Expected: FAIL when references to `PublicOrganizationDetailData` or `publicDetail` do not exist yet.

- [ ] **Step 3: Write the minimal implementation**

Add a `PublicOrganizationInfo` type, a `PublicOrganizationDetailData` type, and `publicDetail(organizationId)` methods that call `GET /api/organizations/{organizationId}/public`.

- [ ] **Step 4: Run type checking to verify it passes**

Run: `npx vue-tsc --noEmit`
Expected: PASS for the API layer changes.

### Task 2: Render volunteer-side detail panel

**Files:**
- Modify: `src/views/Volunteer/Organizations.vue`

- [ ] **Step 1: Add the failing UI state usage**

Reference `selectedOrganizationId`, `selectedOrganizationDetail`, and `detailLoading` in the template and script before defining them.

- [ ] **Step 2: Run type checking to verify it fails**

Run: `npx vue-tsc --noEmit`
Expected: FAIL with missing state/computed references in `src/views/Volunteer/Organizations.vue`.

- [ ] **Step 3: Write the minimal implementation**

Add selection state, detail loading logic, a `loadOrganizationDetail` function, a `selectOrganization` action, a default empty state, and a right-side detail panel that shows the selected organization's public information and action buttons.

- [ ] **Step 4: Run type checking to verify it passes**

Run: `npx vue-tsc --noEmit`
Expected: PASS for the updated volunteer organizations page.

### Task 3: Verify the integrated flow

**Files:**
- Modify: `src/views/Volunteer/Organizations.vue`

- [ ] **Step 1: Re-check pagination and action hooks**

Confirm list paging, membership refresh, and join/leave actions still use existing handlers after the detail panel wiring.

- [ ] **Step 2: Run the final verification**

Run: `npx vue-tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Run lint on the touched files if needed**

Run: `npm run lint -- src/views/Volunteer/Organizations.vue src/api/organizations.ts src/api/organizations-client.ts src/types/organization.ts`
Expected: PASS, or note if the project lint script does not support file-targeted execution.
