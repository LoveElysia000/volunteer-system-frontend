# Cross-App Data List System Design

**Goal:** Replace scattered card-style multi-record pages with a unified list interaction model across both the organization app and volunteer app. Multi-item data pages should default to a structured list experience with toolbar actions, filters, dense row-based presentation, and a right-side detail drawer.

**Architecture:** Build a reusable list-page system composed of shared layout and interaction primitives. Use one consistent page skeleton everywhere, then support two visual densities: a management-oriented table view for operational pages and a lighter browse-oriented row list for discovery pages. Both variants share the same filtering, selection, pagination, and drawer interaction model.

**Tech Stack:** Vue 3, TypeScript, Pinia, Vite, existing shared UI components

---

## Problem Statement

The current project has many pages that render collections as individual cards. That works for visual storytelling, but it is not a good long-term fit for data-heavy flows such as managing volunteers, reviewing members, auditing records, browsing registrations, or inspecting service history.

This creates several product issues:

- data density is low on operational pages
- filters, search, and bulk actions are inconsistent
- users cannot rapidly scan multiple records in one viewport
- detail viewing often requires leaving the current page context
- organization-side and volunteer-side list interactions do not feel like one coherent system

The target state is a cross-app list system where any page that displays many records follows one recognizable structure and one predictable interaction model.

## Goals

- unify multi-record pages across the organization and volunteer applications
- standardize list-page structure as `page header + toolbar + list + right-side detail drawer + pagination`
- support high-density management pages and lighter browse pages without splitting interaction behavior
- make row click open a right-side drawer instead of forcing route transitions for common detail inspection
- reduce per-page custom UI work by extracting shared reusable components
- create a migration path that starts with sample pages and scales safely

## Non-Goals

- redesign every dashboard or analytics card page
- eliminate dedicated detail routes for complex editing workflows
- force every page into the exact same visual density
- rebuild the whole design system before proving the pattern on real pages

## Page Taxonomy

### 1. Management List Pages

These are operational pages whose main purpose is processing, reviewing, updating, or administrating records.

Characteristics:

- denser layout
- explicit columns
- stronger state visibility
- room for bulk actions
- row-level quick actions

Initial pages in this category:

- `src/views/Organization/VolunteerManagement.vue`
- `src/views/Organization/Members.vue`
- `src/views/Organization/ActivityManagement.vue`
- `src/views/Organization/ActivityReview.vue`
- `src/views/Organization/Notifications.vue`
- `src/views/Organization/WorkHours.vue`
- `src/views/Volunteer/MyRegistrations.vue`
- `src/views/Volunteer/Records.vue`
- `src/views/Volunteer/RecordsReviews.vue`
- `src/views/Volunteer/HistoryActivities.vue`
- volunteer-side notification list pages where the main task is reviewing entries

### 2. Browse List Pages

These are pages whose main purpose is exploring, understanding, or choosing records rather than administrating them.

Characteristics:

- lighter density
- more emphasis on title and summary
- more forgiving spacing
- still row/list based rather than freeform cards
- same detail drawer interaction

Initial pages in this category:

- `src/views/Volunteer/Activities.vue`
- `src/components/volunteer/VolunteerRecommendedActivities.vue`
- `src/components/volunteer/UpcomingActivities.vue`
- other recommendation or discovery-focused list surfaces that still display multiple records

## Standard Page Structure

Every multi-record data page should converge on the following five-part structure.

### 1. Page Header

Purpose:

- communicate page identity and scope
- show compact summary metrics
- host the highest-priority create/import/export style actions

Rules:

- keep the header visually clean; do not overload it with all filters
- left side contains title, description, and contextual summary
- right side contains primary page-level actions

### 2. Toolbar / Filter Zone

Purpose:

- centralize search, filtering, sorting, and optional bulk actions

Rules:

- visually consistent across apps
- supports keyword search, status filters, category filters, time filters, and sort controls as needed
- management pages may add selection-aware bulk actions
- should feel like a stable toolbelt, not custom controls reinvented on every page

### 3. List Body

Purpose:

- present many records in a scan-friendly structure

Rules:

- management pages use a standard data table
- browse pages use a lighter row-list presentation
- only the most important summary fields belong in the row
- rows are clickable and should visually indicate interactivity
- loading, empty, error, and selected states should be standardized

### 4. Right-Side Detail Drawer

Purpose:

- preserve list context while revealing record detail and enabling quick actions

Rules:

- opens when a row is clicked
- should not navigate away for routine inspection
- supports quick operational actions
- may deep-link into a full page only when the task becomes too complex for drawer UX

### 5. Footer / Pagination Zone

Purpose:

- show count, selection summary, and pagination controls

Rules:

- left side can show total records and selected record count
- right side handles page index and page size
- style and placement should be consistent everywhere

## List Variant Design

### Management Variant

Visual direction:

- closest to the provided inspiration
- compact rows
- clear column definitions
- stronger tag and state visibility
- operational controls optimized for speed

Best suited fields:

- name/title
- identifier/code
- type/category
- status
- date/time
- count or summary statistic
- last update
- quick actions

### Browse Variant

Visual direction:

- still list-based, but less rigid
- more whitespace
- first column emphasizes title plus short supporting metadata
- row remains easy to scan on desktop and mobile

Best suited fields:

- title
- time
- location
- organizer
- signup state
- capacity
- topic tags

## Detail Drawer Specification

The drawer is the key interaction anchor of this system and should remain structurally consistent across pages.

### Section 1: Drawer Header

Contains:

- record title or primary identifier
- prominent status badge
- compact supporting metadata such as ID, category, and update time
- close control

Objective:

- immediately tell the user what record they are viewing and what state it is in

### Section 2: Core Information

Contains:

- the most important factual fields for the record type
- examples: time, place, owner, counts, contact data, role, audit result

Objective:

- surface high-value information first before showing secondary detail or actions

### Section 3: Extended Information

Contains:

- description, notes, history, related records, audit comments, additional grouped metadata

Objective:

- support deeper inspection without overwhelming the first glance

Notes:

- avoid tabs unless content volume genuinely requires them
- prefer grouped sections that are easy to scan in one scroll

### Section 4: Sticky Action Area

Contains:

- primary action
- one or two secondary actions
- optional overflow menu for low-frequency actions

Objective:

- keep operational controls predictable and always reachable

Guiding principle:

- summary in the row, detail in the drawer, action concentration at the bottom of the drawer

## Shared Component Plan

The design should be implemented as a reusable list system instead of one-off page rewrites.

### `DataListPage`

Responsibilities:

- overall page skeleton
- coordination of toolbar, list area, drawer, and pagination

### `DataToolbar`

Responsibilities:

- search
- filters
- sort controls
- batch action area
- page-level action slots where needed

### `DataTable`

Responsibilities:

- management variant rows and columns
- row click interaction
- selection and highlight behavior
- loading, empty, and error states

### `DataList`

Responsibilities:

- browse variant rows
- higher-emphasis title presentation with lighter density
- same row click and state behavior as the table variant

### `DetailDrawer`

Responsibilities:

- unified right-side detail surface
- title area, content sections, and action area
- width, spacing, loading state, and footer actions

### `StatusBadge`

Responsibilities:

- centralize status styling and semantic mapping
- remove per-page ad hoc badge design

## Interaction Rules

- any row representing a record should be clickable
- clicking a row opens the drawer on the right
- quick inline actions should be kept minimal; do not overload rows with buttons
- the drawer handles most record-specific actions
- the list view should remain the primary navigation surface for reviewing many records
- dedicated routes are still allowed for full creation or heavy editing flows

## Responsive Behavior

- desktop uses the full list plus right-side drawer interaction
- tablet may use a narrower drawer but preserve the same pattern
- mobile should degrade to a full-screen slide-over or stacked detail panel when a right-side drawer is impractical
- browse pages may collapse lower-priority columns sooner than management pages

## Rollout Strategy

The safest rollout is to establish the pattern on real pages before broad reuse.

### Phase 1: Build Two Reference Pages

Create one management sample page and one browse sample page.

Recommended references:

- management sample: `src/views/Organization/Members.vue` or `src/views/Organization/VolunteerManagement.vue`
- browse sample: `src/views/Volunteer/MyRegistrations.vue` or `src/views/Volunteer/HistoryActivities.vue`

Why:

- both sides use real data
- they include statuses and detail needs
- they are representative enough to prove the pattern

### Phase 2: Extract Shared Components

After the sample pages stabilize, extract the common building blocks:

- `DataListPage`
- `DataToolbar`
- `DataTable`
- `DataList`
- `DetailDrawer`
- `StatusBadge`

These should be extracted from proven usage, not designed only in abstraction.

### Phase 3: Migrate Management Pages First

Recommended order:

- organization members
- organization volunteer management
- organization activity management
- organization activity review
- volunteer registrations
- volunteer records and review pages

This delivers the fastest quality gain because these pages benefit most from higher information density.

### Phase 4: Migrate Browse Pages

Recommended targets:

- volunteer activity browsing
- recommended activity lists
- history-style activity pages
- notification list views that are more browse-oriented

### Phase 5: Standardize Global Detail Rules

Finalize and unify:

- status badge mapping
- row spacing and density
- toolbar spacing and visual hierarchy
- drawer width and section spacing
- empty and loading states
- pagination placement
- mobile fallback behavior

## Risks and Mitigations

### Risk: Over-standardizing browse pages

If browse pages become too rigid, the volunteer side may feel cold and administrative.

Mitigation:

- keep browse pages on the lighter row-list variant
- unify structure and interaction more than visual density

### Risk: Component abstraction too early

If shared components are extracted before real pages prove the pattern, they may become awkward and overly generic.

Mitigation:

- build two sample pages first
- extract only stable patterns

### Risk: Drawer overload

If too many fields and actions are moved into the drawer, it can become a mini-page that is hard to scan.

Mitigation:

- prioritize core information first
- move complex workflows to dedicated pages when necessary

## Success Criteria

- most multi-record pages in both apps share one recognizable structure
- users can inspect records without losing list context
- management pages support faster scanning and operations than the current card layout
- volunteer-side list pages feel consistent with the rest of the system without losing readability
- new list pages can be assembled from shared primitives instead of bespoke page scaffolding

## Open Questions Resolved In This Design

- scope includes both organization-side and volunteer-side list pages
- detail interaction should use a right-side drawer / side panel
- the system should support both management-style and browse-style pages
- rollout should begin with sample pages, then component extraction, then broader migration

## Next Step

Create an implementation plan that:

- identifies the first two sample pages
- defines the component creation order
- lists the exact files to modify
- includes build and verification checkpoints after each phase
