# Cross-App Data List System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable cross-app data list system, prove it on one organization-side management page and one volunteer-side browse page, then use those patterns to migrate the remaining multi-record pages.

**Architecture:** Add a shared list-system component set that standardizes toolbar, row presentation, status badges, pagination framing, and a right-side detail drawer. Implement the first management sample on the organization members page and the first browse sample on the volunteer activities page, then expand the same primitives to the next wave of pages without reintroducing page-specific card layouts.

**Tech Stack:** Vue 3, TypeScript, Pinia, Vue Router, Vite, Tailwind CSS, existing organization/volunteer page headers and section cards

---

## File Structure

### New shared list-system components

- Create: `src/components/data-list/DataListPage.vue`
- Create: `src/components/data-list/DataToolbar.vue`
- Create: `src/components/data-list/DataTable.vue`
- Create: `src/components/data-list/DataList.vue`
- Create: `src/components/data-list/DetailDrawer.vue`
- Create: `src/components/data-list/StatusBadge.vue`

Responsibilities:

- `DataListPage.vue`: top-level skeleton for header, toolbar slot, list body slot, footer slot, and drawer slot
- `DataToolbar.vue`: search, filters, bulk actions, and page-level actions layout
- `DataTable.vue`: dense management-style list rows with selectable columns, row click, loading/empty states
- `DataList.vue`: lighter browse-style row list with the same row click and state contract
- `DetailDrawer.vue`: right-side drawer shell with header, scrollable content, sticky footer actions, and mobile fallback
- `StatusBadge.vue`: cross-app state badge primitive that can replace per-surface ad hoc status pills

### Existing files to adapt around the shared system

- Modify: `src/components/ui/Dialog.vue`
- Modify: `src/assets/styles/main.css`
- Modify: `src/views/Organization/Members.vue`
- Modify: `src/views/Volunteer/Activities.vue`
- Modify: `src/views/Volunteer/MyRegistrations.vue`
- Modify: `src/views/Organization/VolunteerManagement.vue`
- Modify: `src/views/Organization/ActivityManagement.vue`
- Modify: `src/views/Volunteer/Records.vue`
- Modify: `src/views/Volunteer/HistoryActivities.vue`
- Modify: `src/components/volunteer/VolunteerStatusBadge.vue`

Responsibilities:

- `Dialog.vue`: either power the new drawer variant directly or remain unchanged if `DetailDrawer.vue` becomes a dedicated shell; decide after a minimal spike
- `main.css`: host reusable list-system utility classes and shared spacing tokens that do not belong in per-page `<style scoped>`
- `Members.vue`: first management sample page
- `Activities.vue`: first browse sample page
- `MyRegistrations.vue`, `VolunteerManagement.vue`, `ActivityManagement.vue`, `Records.vue`, `HistoryActivities.vue`: second-wave migrations once the sample components settle
- `VolunteerStatusBadge.vue`: either become a thin wrapper over `StatusBadge.vue` or remain temporarily until all volunteer views migrate

### Supporting files to inspect during implementation

- Inspect: `src/components/organization/OrganizationPageHeader.vue`
- Inspect: `src/components/organization/OrganizationSectionCard.vue`
- Inspect: `src/components/volunteer/VolunteerPageHeader.vue`
- Inspect: `src/components/volunteer/VolunteerSectionCard.vue`
- Inspect: `src/store/modules/memberships.ts`
- Inspect: `src/api/activities.ts`
- Inspect: `src/types/activity.ts`
- Inspect: `src/types/membership.ts`

These files define the visual shell and data shapes that the new list primitives must fit.

## Verification Strategy

This repository does not currently include a component/unit test runner. For this work, use:

- `npm run build` for type and compile safety
- `npm run lint` for static checks
- focused manual verification in the browser for drawer behavior, row click behavior, loading/empty states, and mobile fallback

Each task below includes the exact verification commands that exist in this repo today.

### Task 1: Establish the shared list-system foundation

**Files:**
- Create: `src/components/data-list/DataListPage.vue`
- Create: `src/components/data-list/DataToolbar.vue`
- Create: `src/components/data-list/DataTable.vue`
- Create: `src/components/data-list/DataList.vue`
- Create: `src/components/data-list/DetailDrawer.vue`
- Create: `src/components/data-list/StatusBadge.vue`
- Modify: `src/assets/styles/main.css`
- Inspect: `src/components/ui/Dialog.vue`

- [ ] **Step 1: Write the failing behavior checklist**

Document the minimum baseline the shared system must satisfy:

- organization and volunteer list pages can share one page skeleton
- dense table rows support click-to-open detail
- lighter browse rows support click-to-open detail
- drawer opens from the right on desktop
- drawer can host custom body and footer actions
- loading and empty states are standardized

- [ ] **Step 2: Run the current baseline build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Spike the drawer shell approach**

Inspect `src/components/ui/Dialog.vue` and decide one of two minimal approaches:

- extend it with a right-side `placement="right"` variant, or
- keep it unchanged and build a focused `DetailDrawer.vue` beside it

Write down the decision inside the implementation notes before coding the rest of the task.

- [ ] **Step 4: Implement `StatusBadge.vue`**

Build a generic badge API that covers at least:

- `tone`: `green | blue | amber | slate | rose`
- `size`: compact default suitable for tables and drawers
- optional slot or `label` prop

Keep it presentation-only.

- [ ] **Step 5: Implement `DetailDrawer.vue`**

Support:

- `v-model`
- optional title/subtitle/meta area
- close button
- scrollable body slot
- sticky footer slot
- width prop for desktop
- desktop right-side slide-in
- mobile full-screen or near-full-screen fallback

- [ ] **Step 6: Implement `DataToolbar.vue`**

Provide a layout shell with slots for:

- primary filters
- trailing actions
- optional bulk-action area
- optional count/selection summary

Do not hardcode organization- or volunteer-specific labels.

- [ ] **Step 7: Implement `DataTable.vue`**

Create a minimal, reusable table contract:

- accepts column definitions or slot-driven cells
- row click event
- optional selected row state
- loading state
- empty state
- optional row action slot

Keep the first version small; avoid building sorting logic until a real page requires it.

- [ ] **Step 8: Implement `DataList.vue`**

Create a browse-oriented row list with:

- clickable rows
- title/meta/extra slots
- loading state
- empty state

Match the same state contract as `DataTable.vue` where practical.

- [ ] **Step 9: Implement `DataListPage.vue`**

Compose the shared pieces so a page can render:

- page header slot area
- toolbar slot area
- list body slot area
- footer slot area
- detail drawer slot area or drawer prop-driven content

Keep this component structural rather than data-aware.

- [ ] **Step 10: Add shared list-system styles**

Update `src/assets/styles/main.css` with only the reusable classes that genuinely belong at the system layer:

- row hover affordance
- selected row state
- table density helpers
- drawer surface helpers
- toolbar spacing helpers

- [ ] **Step 11: Run verification**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS or pre-existing unrelated warnings only

- [ ] **Step 12: Commit**

```bash
git add src/components/data-list src/assets/styles/main.css src/components/ui/Dialog.vue
git commit -m "feat: add shared data list system components"
```

### Task 2: Convert organization members into the first management sample

**Files:**
- Modify: `src/views/Organization/Members.vue`
- Modify: `src/store/modules/memberships.ts` (only if needed for selected-record detail support)
- Modify: `src/types/membership.ts` (only if UI needs missing typed detail fields)
- Reuse: `src/components/data-list/DataListPage.vue`
- Reuse: `src/components/data-list/DataToolbar.vue`
- Reuse: `src/components/data-list/DataTable.vue`
- Reuse: `src/components/data-list/DetailDrawer.vue`
- Reuse: `src/components/data-list/StatusBadge.vue`

- [ ] **Step 1: Write the failing behavior checklist**

Expected behavior:

- members page uses a table-like management layout instead of stacked cards
- filters remain functional
- clicking a member row opens the right-side drawer
- drawer shows role, status, volunteer code, join time, expected hours, and review comment
- member approval/rejection/leave actions move into the drawer footer or drawer action area

- [ ] **Step 2: Run the baseline build before editing**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Refactor the page layout onto `DataListPage`**

Keep `OrganizationPageHeader` for the top section, then replace the card list portion with:

- shared toolbar
- shared management table
- shared detail drawer

Preserve existing data loading and store wiring.

- [ ] **Step 4: Move row actions into the drawer**

Keep row-level actions minimal. The preferred interaction is:

- click row to inspect
- approve/reject/mark-left inside the drawer action area

Only keep an inline shortcut button if usability clearly benefits.

- [ ] **Step 5: Add selected-row state and drawer content**

Track the active member in local component state. The drawer should show:

- member identity
- status badge
- role badge or mapped role label
- timeline-style metadata
- review note if present

- [ ] **Step 6: Verify loading, empty, and action states**

Check:

- page still renders loading state while fetching
- empty member state still reads clearly
- updating a member status refreshes list and drawer correctly

- [ ] **Step 7: Run verification**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS or pre-existing unrelated warnings only

- [ ] **Step 8: Commit**

```bash
git add src/views/Organization/Members.vue src/store/modules/memberships.ts src/types/membership.ts
git commit -m "feat: convert members page to management list system"
```

### Task 3: Convert volunteer activities into the first browse sample

**Files:**
- Modify: `src/views/Volunteer/Activities.vue`
- Modify: `src/api/activities.ts` (only if extra mapped fields are needed in the drawer)
- Modify: `src/types/activity.ts` (only if mapped fields are missing)
- Reuse: `src/components/data-list/DataListPage.vue`
- Reuse: `src/components/data-list/DataToolbar.vue`
- Reuse: `src/components/data-list/DataList.vue`
- Reuse: `src/components/data-list/DetailDrawer.vue`
- Reuse: `src/components/data-list/StatusBadge.vue`

- [ ] **Step 1: Write the failing behavior checklist**

Expected behavior:

- activities page keeps a browse-friendly tone but stops relying on large freeform cards
- search and tab-like status filtering still work
- clicking a row opens the activity drawer instead of requiring route navigation for normal inspection
- register/cancel actions are available from the drawer, with row-level CTA kept minimal

- [ ] **Step 2: Run the baseline build before editing**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Replace the main list body with `DataList.vue`**

Keep the volunteer header and summary cards if they still add value, but move the record list itself onto the browse list system.

- [ ] **Step 4: Introduce row selection plus right-side drawer**

The drawer should show at least:

- title and status
- description
- date/time
- location
- duration
- seat usage
- organizer/org name
- registration state

- [ ] **Step 5: Rebalance inline actions**

Minimize row-level buttons to one primary affordance where useful. Normal detail inspection should now happen from row click plus drawer.

- [ ] **Step 6: Preserve registration flows**

Ensure register/cancel actions still use the same APIs and refresh the visible list plus selected drawer record when the user acts.

- [ ] **Step 7: Run verification**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS or pre-existing unrelated warnings only

- [ ] **Step 8: Commit**

```bash
git add src/views/Volunteer/Activities.vue src/api/activities.ts src/types/activity.ts
git commit -m "feat: convert volunteer activities to browse list system"
```

### Task 4: Unify badge usage and adapt a second management page plus a second volunteer data page

**Files:**
- Modify: `src/components/volunteer/VolunteerStatusBadge.vue`
- Modify: `src/views/Organization/VolunteerManagement.vue`
- Modify: `src/views/Volunteer/MyRegistrations.vue`
- Reuse: `src/components/data-list/*`

- [ ] **Step 1: Write the failing behavior checklist**

Expected behavior:

- volunteer and organization surfaces stop drifting on status badge styling
- volunteer management becomes table-oriented with a drawer
- my registrations uses the shared browse or management variant intentionally rather than its old card stack

- [ ] **Step 2: Migrate `VolunteerStatusBadge.vue`**

Either:

- wrap `StatusBadge.vue` and preserve the old prop API temporarily, or
- inline-replace usages and delete the wrapper after all call sites move

Choose the smaller migration.

- [ ] **Step 3: Convert `Organization/VolunteerManagement.vue`**

Move it onto:

- shared toolbar
- management table
- drawer with volunteer summary and import/export-friendly action area

- [ ] **Step 4: Convert `Volunteer/MyRegistrations.vue`**

Use the shared list system so registrations become one of:

- a lighter management-like list if task handling is primary, or
- a browse list if readability is more important

Follow the spec recommendation that this page is primarily operational.

- [ ] **Step 5: Run verification**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS or pre-existing unrelated warnings only

- [ ] **Step 6: Commit**

```bash
git add src/components/volunteer/VolunteerStatusBadge.vue src/views/Organization/VolunteerManagement.vue src/views/Volunteer/MyRegistrations.vue
git commit -m "feat: migrate additional list pages to shared data list system"
```

### Task 5: Migrate the next wave of list-heavy pages

**Files:**
- Modify: `src/views/Organization/ActivityManagement.vue`
- Modify: `src/views/Volunteer/Records.vue`
- Modify: `src/views/Volunteer/HistoryActivities.vue`
- Modify: `src/views/Volunteer/RecordsReviews.vue`
- Modify: `src/views/Organization/ActivityReview.vue`

- [ ] **Step 1: Write the failing behavior checklist**

Expected behavior:

- these pages follow the new skeleton
- detail inspection no longer depends on card sprawl or route hopping
- each page uses the correct management vs browse variant

- [ ] **Step 2: Migrate pages one at a time**

Use the same sequence to reduce churn:

1. `src/views/Organization/ActivityManagement.vue`
2. `src/views/Volunteer/Records.vue`
3. `src/views/Volunteer/HistoryActivities.vue`
4. `src/views/Volunteer/RecordsReviews.vue`
5. `src/views/Organization/ActivityReview.vue`

Do not batch-edit all pages before verifying one migration at a time.

- [ ] **Step 3: For each page, keep data logic stable**

Prefer changing presentation and selected-record interaction first. Only touch API mappers or store logic when the drawer truly needs fields that the current row model does not provide.

- [ ] **Step 4: Run verification after each page or small batch**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS or pre-existing unrelated warnings only

- [ ] **Step 5: Commit**

```bash
git add src/views/Organization/ActivityManagement.vue src/views/Volunteer/Records.vue src/views/Volunteer/HistoryActivities.vue src/views/Volunteer/RecordsReviews.vue src/views/Organization/ActivityReview.vue
git commit -m "feat: migrate remaining list-heavy pages to shared list system"
```

### Task 6: Final UX polish, regression sweep, and documentation follow-up

**Files:**
- Modify: `src/assets/styles/main.css`
- Modify: any touched list-system components and pages above
- Modify: `docs/superpowers/specs/2026-03-25-data-list-system-design.md` (only if implementation decisions materially change the spec)

- [ ] **Step 1: Verify global consistency**

Check all migrated pages for:

- drawer width consistency
- row hover and selected state consistency
- status badge consistency
- empty/loading state consistency
- mobile behavior consistency

- [ ] **Step 2: Remove leftover one-off list styling where safe**

Delete page-specific card-list classes that are no longer needed, but do not remove unrelated styling.

- [ ] **Step 3: Run the final repository verification**

Run: `npm run build`
Expected: PASS

Run: `npm run lint`
Expected: PASS or pre-existing unrelated warnings only

- [ ] **Step 4: Manual verification checklist**

Confirm in the browser:

- organization members row click opens drawer
- volunteer activities row click opens drawer
- register/cancel actions update visible state
- member approval/rejection updates visible state
- drawer is usable on a narrow viewport
- no page regresses to invisible content when the drawer opens

- [ ] **Step 5: Commit**

```bash
git add src assets docs
git commit -m "feat: finalize cross-app data list system rollout"
```

## Notes For Execution

- Start with `Organization/Members.vue` and `Volunteer/Activities.vue` exactly as the spec recommends. Do not skip directly to broad migration.
- Resist building a fully generic enterprise table abstraction up front. The first version only needs the slots and states that the sample pages prove.
- Prefer a dedicated `DetailDrawer.vue` over bloating row components with embedded detail sections.
- Keep route-based detail pages for full editing or deep workflows, but make routine inspection drawer-first.
- Use small, frequent commits after each task.
