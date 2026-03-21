# Volunteer Activities API Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Connect the volunteer-side protected activity pages to the backend activity APIs described in `frontend-api-integration.md`.

**Architecture:** Keep the public showcase pages untouched and wire only the authenticated volunteer pages to live APIs. Add a volunteer-activity specific API layer plus mapping helpers so the current UI can render backend data without a visual redesign.

**Tech Stack:** Vue 3, TypeScript, Pinia, Axios, Vite

---

### Task 1: Add volunteer activity API types and client

**Files:**
- Create: `src/api/activities.ts`
- Modify: `src/types/activity.ts`

**Step 1: Define request/response types**

Add types for:
- `POST /api/activities`
- `GET /api/activities/:id`
- `POST /api/activities/signup`
- `POST /api/activities/cancel`
- `POST /api/activities/my`

**Step 2: Add API client helpers**

Expose typed methods for list, detail, signup, cancel, and my-activities.

**Step 3: Verify TypeScript compatibility**

Run: `npm run build`
Expected: build succeeds with no new type errors

### Task 2: Add mapping helpers for volunteer activity UI

**Files:**
- Modify: `src/types/activity.ts`
- Create: `src/api/activities.ts`

**Step 1: Define UI-facing volunteer activity models**

Add mapped types that reflect the current volunteer page needs:
- activity card rows
- my registration rows
- detail view data

**Step 2: Add backend-to-UI mapper functions**

Convert backend status flags, date fields, participant counts, and registration flags into the shapes the current UI already expects.

**Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds

### Task 3: Wire the volunteer activity list page

**Files:**
- Modify: `src/views/Volunteer/Activities.vue`

**Step 1: Replace static data usage**

Load data from `POST /api/activities` instead of `src/data/volunteerCenter.ts`.

**Step 2: Keep current page behavior**

Preserve:
- filter tabs
- keyword filtering
- summary cards
- priority queue
- existing visual layout

**Step 3: Hook actions**

Implement:
- signup via `POST /api/activities/signup`
- cancel via `POST /api/activities/cancel`
- detail navigation

**Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds

### Task 4: Wire the my registrations page

**Files:**
- Modify: `src/views/Volunteer/MyRegistrations.vue`

**Step 1: Replace static registered activity data**

Load data from `POST /api/activities/my`.

**Step 2: Preserve current presentation**

Keep current cards, checklist block, and summary layout; only swap the data source.

**Step 3: Add detail navigation**

Allow “查看详情” to route into the volunteer activity detail page or shared activity detail route.

**Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds

### Task 5: Add volunteer-friendly activity detail page

**Files:**
- Modify: `src/views/Activities/ActivityDetail.vue`

**Step 1: Replace placeholder**

Load data from `GET /api/activities/:id`.

**Step 2: Surface volunteer-relevant data**

Show title, org name, time, location, status, participation state, attendance state, and granted hours when present.

**Step 3: Reuse current auth flow**

If signup/cancel actions are exposed here, reuse the same API methods as the volunteer list page.

**Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds

### Task 6: Final verification

**Files:**
- Modify: `src/api/activities.ts`
- Modify: `src/types/activity.ts`
- Modify: `src/views/Volunteer/Activities.vue`
- Modify: `src/views/Volunteer/MyRegistrations.vue`
- Modify: `src/views/Activities/ActivityDetail.vue`

**Step 1: Run full build**

Run: `npm run build`
Expected: PASS

**Step 2: Run lint**

Run: `npm run lint`
Expected: no new errors; pre-existing warnings may remain

**Step 3: Summarize runtime follow-ups**

Document any backend-dependent checks still needing real test accounts, such as signup/cancel success paths and volunteer-owned activity history.
