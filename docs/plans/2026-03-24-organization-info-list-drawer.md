# Organization Info List + Drawer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current organization info workbench/editor layout with a cleaner list page and a right-side detail drawer that supports read-only details and explicit edit mode.

**Architecture:** Keep the existing store-driven data flow in `OrganizationInfo.vue`, but move the primary page into a row-based organization list and introduce a drawer-based detail experience. Reuse the existing data fetching and save functions, while adding view state for drawer visibility, active record detail mode, and edit mode transitions.

**Tech Stack:** Vue 3, `<script setup lang="ts">`, Tailwind utility classes, existing organization store/actions, Vite build verification

---

### Task 1: Re-audit the current page against the new product direction

**Files:**
- Read: `src/views/Organization/OrganizationInfo.vue`
- Read: `src/store/modules/organization.ts`
- Read: `src/components/organization/OrganizationPageHeader.vue`

**Step 1: Confirm what data exists for list rows**

Review:
- `organizationStore.organizations`
- `organizationStore.currentOrganization`
- `organizationStore.organizationCertification`

Expected result:
- Confirm which fields can be shown directly in the list without additional fetches.

**Step 2: Confirm how detail loading currently works**

Review:
- `loadOrganization`
- `switchOrganization`
- `organizationStore.fetchOrganization`

Expected result:
- Opening a drawer can keep using the existing detail fetch flow.

**Step 3: Confirm save boundary constraints**

Review:
- `saveAccountChanges`
- `saveOrganizationChanges`

Expected result:
- Editing in the drawer can still submit through the existing save handlers.

### Task 2: Replace the main page body with a real list layout

**Files:**
- Modify: `src/views/Organization/OrganizationInfo.vue`

**Step 1: Remove the old workbench-centric sections**

Remove or replace:
- Left workbench rail summary blocks
- Right-side always-visible editing panels
- Any list presentation that still reads like stacked cards

Expected before result:
- The page still behaves like a hybrid dashboard/editor.

**Step 2: Build the new list structure**

Implement:
- Header
- Search input
- Row-based organization list
- Lightweight empty state

Each row should include:
- Organization name
- Contact person
- Contact phone
- Organization code
- Updated-at display if available, otherwise a fallback field or placeholder
- `查看详情` action

**Step 3: Keep the list visually light**

Implement:
- Soft dividers
- Hover state
- Minimal accent on active/opened row
- No extra row-level explanation cards

### Task 3: Add drawer state and read-only detail mode

**Files:**
- Modify: `src/views/Organization/OrganizationInfo.vue`

**Step 1: Add page-local drawer state**

Add reactive state for:
- Drawer open/closed
- Active row id
- Drawer mode: `view` or `edit`

Constraint:
- Keep state local to the page unless store elevation is clearly needed.

**Step 2: Open the drawer from a row interaction**

Implement:
- Clicking a row or `查看详情` opens the drawer
- Ensure detail data is loaded before or while the drawer opens
- Keep close behavior explicit and reversible

**Step 3: Render read-only grouped details**

Drawer sections:
- 基础信息
- 联系信息
- 展示信息
- 账户信息

Expected result:
- The drawer becomes the main detail surface, while the page remains a list.

### Task 4: Add drawer edit mode without exposing always-on forms

**Files:**
- Modify: `src/views/Organization/OrganizationInfo.vue`

**Step 1: Add edit toggle behavior**

Implement:
- `编辑` button in drawer header
- Switch between read-only and editable controls
- `取消` returns to read-only mode

**Step 2: Reuse existing form state**

Use the existing:
- `accountForm`
- `organizationForm`

Ensure:
- Forms are synced when a record is opened
- Edit mode uses the same values already loaded into these forms

**Step 3: Keep save actions scoped**

Implement:
- Preserve separate save actions if backend contract still requires them
- Present them coherently inside the drawer UI
- On success, keep the drawer open and refresh displayed detail values

### Task 5: Clean up supporting content and certification handling

**Files:**
- Modify: `src/views/Organization/OrganizationInfo.vue`

**Step 1: Reposition certification info**

Decide one of:
- Show certification as a section inside the drawer
- Or keep a lightweight auxiliary page section only if it still adds value

Preferred direction:
- Keep it secondary and avoid competing with the list.

**Step 2: Remove leftover workbench language**

Update:
- Descriptions
- Labels
- Section titles

Expected result:
- The page now clearly communicates “list + detail drawer,” not “workbench editor.”

### Task 6: Verify the end-to-end interaction

**Files:**
- Modify: `src/views/Organization/OrganizationInfo.vue`

**Step 1: Run a production build**

Run:

```bash
npm run build
```

Expected:
- Build succeeds cleanly.

**Step 2: Manual verification checklist**

Check:
- Search still works visually and functionally
- Clicking a row opens the drawer
- Drawer displays the expected organization details
- Edit mode can be entered and exited
- Save actions still work through existing handlers
- Closing the drawer returns users to the list without losing context
- Empty state still looks correct

**Step 3: Review diff for logic safety**

Inspect:
- `src/views/Organization/OrganizationInfo.vue`

Expected:
- The main change is interaction model and layout
- Existing store and API assumptions remain intact
