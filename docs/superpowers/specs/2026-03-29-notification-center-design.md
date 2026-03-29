# Notification Center Frontend Design

**Date:** 2026-03-29

## Goal

Align the frontend notification experience with the backend contract documented in `/Users/Ein/project2/volunteer-system/docs/frontend-notification-integration.md`.

The implementation should:

- reuse the same notification API and read-state behavior for volunteers and organization managers
- keep volunteer and organization notification pages visually independent
- preserve explicit "mark as read" actions instead of auto-reading on open
- add route-aware jump actions based on `eventType` and `bizType`

## Current Context

The codebase already contains:

- a shared notification API client at `src/api/notifications.ts`
- a shared notification store at `src/store/modules/notifications.ts`
- an organization notification page at `src/views/Organization/Notifications.vue`
- no volunteer notification route or dedicated volunteer notification page yet

The backend contract states that both roles use the same endpoints and are separated only by the logged-in account token. This means frontend role-specific handling belongs in page design and navigation behavior, not in duplicated API clients.

## Chosen Approach

Use a shared notification capability layer with role-specific page shells.

This means:

- keep one notification API module and one core store/data source
- extract shared notification page behavior into focused helpers or composables when that reduces duplication
- create a new volunteer notification page with volunteer-specific layout and wording
- keep the organization page, but refine wording and add jump actions

This approach is preferred over sharing a full page component because the two workbenches already have different visual systems and interaction tone. Reusing logic without forcing shared page structure keeps maintenance lower over time.

## Scope

### In Scope

- add a volunteer notification page and route
- add a volunteer sidebar entry for the notification center
- support list display, unread-only filter, keyword search, pagination, single-read, and batch-read
- support role-aware "go to related page" behavior
- refine organization notification page wording and actions to match the backend contract

### Out of Scope

- creating notifications from the frontend
- websocket or polling-based live notification updates
- changing backend notification payload shape
- auto-marking notifications as read when a user opens detail

## Architecture

### 1. Shared Notification Capability Layer

Keep `src/api/notifications.ts` as the single request module for:

- `GET /api/notifications`
- `POST /api/notifications/read`

Extend the shared frontend notification layer so page logic does not have to duplicate:

- current query state normalization
- unread ID derivation
- selected-notification lookup
- mark-single and mark-batch behavior
- date formatting helpers where appropriate
- route resolution for "go to related page"

The shared layer can be implemented either as:

- a new composable such as `src/composables/useNotificationCenter.ts`, or
- small focused helpers plus the existing store

The exact file split should stay minimal and follow existing Vue 3 + Pinia patterns in the repo.

### 2. Volunteer Notification Page

Create a volunteer-specific page under `src/views/Volunteer/Notifications.vue`.

The page should follow the volunteer workbench visual language:

- `VolunteerPageHeader`
- `VolunteerSectionCard`
- emerald-themed filters and actions where existing components support it

Recommended layout:

- left/main column: notification flow with summary cards and list
- right column: detail panel for the selected notification

The page should present notifications as personal progress and service updates rather than generic system events. Example framing:

- work hour settlement updates
- registration approval or rejection
- organization membership updates
- activity change reminders

### 3. Organization Notification Page Adjustments

Keep `src/views/Organization/Notifications.vue` as the organization manager entry point.

Adjustments:

- keep existing list/detail structure
- add a visible "go to related page" action in the detail area
- make wording more neutral and account-centered instead of implying all notifications are audit reminders
- convert raw event display into more readable labels where possible

These are intentionally incremental changes, not a redesign.

### 4. Notification Jump Mapping

Centralize notification jump mapping in one helper so routes do not drift between pages.

The mapping should use current role context and the backend fields `eventType`, `bizType`, and `bizId`.

#### Volunteer-side target rules

- `member_join` -> `/volunteer/organizations`
- `signup_approved` -> prefer `/volunteer/activities/my-registrations`; optionally include activity detail routing when enough data is present
- `signup_rejected` -> `/volunteer/activities/my-registrations`
- `activity_updated` -> `/volunteer/activities/:id` when `bizId` is present, otherwise `/volunteer/activities`
- `activity_canceled` -> `/volunteer/activities/:id` when `bizId` is present, otherwise `/volunteer/activities`
- `work_hour_granted` -> `/volunteer/work-hours`
- `work_hour_voided` -> `/volunteer/work-hours`
- `work_hour_regranted` -> `/volunteer/work-hours`

#### Organization-side target rules

Organization-facing notifications currently use the same API but may not always have a dedicated fine-grained page target. The helper should therefore prefer safe existing management pages:

- activity-related notifications -> `/organization/activities`
- member or join-related notifications -> `/organization/members` or `/organization/volunteers` depending on the best existing fit
- work-hour-related notifications -> `/organization/statistics/financial`

If no confident target exists, fall back to the current notification page route instead of navigating to a misleading page.

## UX Behavior

### Shared Behavior

- notifications are fetched from the server using query params, not filtered only in-memory
- unread filtering uses backend `unreadOnly`
- keyword search uses backend `keyword`
- marking read sends `inboxId`, never `notificationId`
- opening detail does not change read state
- explicit read buttons remain available for single and batch actions

### Volunteer Page Behavior

- clicking a notification opens detail in the side panel
- the side panel shows title, time, event label, business type, business ID, and content
- the panel footer includes:
  - `标记已读`
  - `前往相关页面`
- if the target cannot be resolved, the jump action should be disabled or replaced with a clear unavailable hint

### Organization Page Behavior

- keep current table-and-drawer interaction
- add `前往相关页面` near the existing read action
- preserve current explicit read behavior

## Error Handling

- API failures continue to use the existing message store for user-facing feedback
- if route resolution fails, do not throw; instead present a non-destructive message such as "暂未配置对应页面"
- if `bizId` is missing for an event that normally links to a detail page, route to the nearest safe list page

## Testing Strategy

Follow red-green-refactor for implementation.

Test coverage should focus first on shared logic that is stable without browser rendering:

- notification route resolution by role and event type
- read-status update behavior using `inboxId`
- query parameter shaping for list requests when filters are active

Then verify page integration with focused frontend validation:

- volunteer route and sidebar entry wiring
- organization page still renders and triggers actions
- lint and build remain green

## Implementation Sequence

1. Add or extend shared notification helpers/composable and cover route-resolution behavior with tests.
2. Add volunteer notification route, sidebar entry, and volunteer page UI.
3. Refine organization notification page to use the shared jump behavior and updated wording.
4. Run targeted tests, lint, and build.

## Risks And Mitigations

### Risk: duplicated behavior between pages grows again

Mitigation:
Keep route resolution and read-action helpers centralized before adding the second page.

### Risk: incorrect navigation for loosely typed backend events

Mitigation:
Prefer safe list pages when data is incomplete, and keep mappings in one file for easier review.

### Risk: organization page regressions while refactoring shared logic

Mitigation:
Make the shared layer additive and keep organization page structure mostly intact.

## Acceptance Criteria

- volunteer users can access a dedicated notification page from the volunteer workbench
- volunteer and organization users both load notifications from the same backend endpoints
- both pages support unread-only filter, keyword search, pagination, single-read, and batch-read
- notifications are marked read only through explicit user action
- both pages offer a related-page jump action when a safe route can be determined
- organization page remains usable with only incremental UI changes
