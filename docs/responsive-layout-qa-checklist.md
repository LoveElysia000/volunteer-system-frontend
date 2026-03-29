# Responsive Layout QA Checklist

## Shared Workbench States

- Expanded desktop: 1440px and wider
  - Volunteer and organization sidebars are fully expanded.
  - Resize handle is visible.
  - Header chips, search bars, and primary actions stay on one row when space allows.

- Compact desktop: 1024px to 1439px
  - Sidebar collapses to icon rail instead of disappearing.
  - Main content stays readable without overlapping cards or clipped actions.
  - Data-list pages wrap filters and actions before overflowing.

- Mobile: 1023px and narrower
  - Top-left `菜单` button is visible.
  - Sidebar opens as a drawer and can be dismissed by overlay tap.
  - No horizontal scrolling is introduced by page-level cards or toolbars.

## DevTools Regression Checks

- Open browser DevTools while viewing volunteer activity list and organization dashboard.
- Confirm the shell moves from expanded to compact or mobile cleanly.
- Confirm no icon-only action becomes inaccessible.
- Confirm header summary chips, filters, and pagination controls wrap instead of overlapping.

## Drawer and Detail Checks

- Open volunteer activity detail and organization review/member drawers.
- Confirm drawer width stays inside the viewport at mid-width desktop sizes.
- Confirm overlay click and `Esc` both close the drawer.
- Confirm footer actions remain visible without horizontal clipping.

## Page Spot Checks

- Volunteer:
  - `/volunteer`
  - `/volunteer/activities`
  - `/volunteer/activities/my-registrations`
  - `/volunteer/organizations`
  - `/volunteer/profile`

- Organization:
  - `/organization`
  - `/organization/activities`
  - `/organization/activities/create`
  - `/organization/activities/review`
  - `/organization/members`
  - `/organization/statistics/activities`
  - `/organization/statistics/volunteers`
  - `/organization/statistics/financial`

## Acceptance Notes

- Navigation must always remain discoverable.
- Primary actions must stay clickable.
- Cards, grids, and filters must reflow before they collide.
- Large-screen visuals should remain close to the original design.
