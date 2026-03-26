# Volunteer Organizations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a volunteer-side organization workspace so volunteers can browse organizations and complete join or leave actions from the left navigation.

**Architecture:** Add one new volunteer route and sidebar entry, then build a dedicated `VolunteerOrganizations` page that combines organization discovery with the existing membership join/leave APIs. Reuse existing volunteer profile and membership stores for volunteer identity and joined-organization state, while loading organization candidates from the existing organizations API.

**Tech Stack:** Vue 3 SFCs, TypeScript, Pinia, Vue Router, existing volunteer UI components

---

### Task 1: Navigation and route wiring

**Files:**
- Modify: `src/components/volunteer/VolunteerSidebar.vue`
- Modify: `src/router/routes.ts`
- Modify: `src/views/Volunteer/VolunteerLayout.vue`

**Step 1: Add the new menu entry**

Insert a new volunteer sidebar group for organization management pointing to `/volunteer/organizations`.

**Step 2: Add the volunteer route**

Register `volunteer-organizations` under the volunteer layout with the title `组织管理`.

**Step 3: Update layout metadata**

Add a page description so the workspace header reads correctly when the new page is active.

### Task 2: Build the volunteer organization page

**Files:**
- Create: `src/views/Volunteer/Organizations.vue`

**Step 1: Load required data**

Fetch volunteer profile if needed, joined organizations from `membershipsStore.fetchMyOrganizations`, and active organizations from `organizationsApi.list/search`.

**Step 2: Render two work areas**

Show membership summary and joined organizations on one side, and searchable organization cards on the other side.

**Step 3: Hook up actions**

Use existing membership store actions for join and leave, refresh both data sources after mutations, and surface success/error feedback with `messageStore`.

### Task 3: Verify integration

**Files:**
- Verify: `src/views/Volunteer/Organizations.vue`
- Verify: `src/components/volunteer/VolunteerSidebar.vue`
- Verify: `src/router/routes.ts`

**Step 1: Type-check and build**

Run: `npm run build`

Expected: Vite production build succeeds without TypeScript or template errors.

**Step 2: Sanity-check behavior**

Confirm the sidebar entry appears, the page loads, and join/leave buttons map to the correct existing APIs.
