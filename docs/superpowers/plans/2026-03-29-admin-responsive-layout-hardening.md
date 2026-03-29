# Admin Responsive Layout Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize volunteer and organization workbench layouts so navigation, toolbars, drawers, and content panels remain usable when the viewport shrinks, DevTools opens, or the window is resized.

**Architecture:** Keep the existing visual language, but replace hard breakpoint jumps with a shared three-mode shell strategy: expanded sidebar, compact rail, and mobile drawer. Push responsive behavior into the two layout shells, the sidebar/menu primitives, and the shared data-list container components so page-level fixes can stay small and predictable.

**Tech Stack:** Vue 3, Vue Router, Pinia, Tailwind utility classes in `src/assets/styles/main.css`, Vite, ESLint

---

## File Structure

**Create**
- `src/composables/useResponsiveWorkbench.ts` — shared viewport/mode logic for volunteer and organization shells.
- `docs/responsive-layout-qa-checklist.md` — manual regression checklist for workbench breakpoints and DevTools-open states.

**Modify**
- `src/views/Volunteer/VolunteerLayout.vue` — replace the current desktop/mobile split with expanded/compact/mobile behavior.
- `src/views/Organization/OrganizationLayout.vue` — mirror the same shell behavior as the volunteer workbench.
- `src/components/volunteer/VolunteerSidebar.vue` — support compact rail mode and shared close behavior.
- `src/components/volunteer/MenuItem.vue`
- `src/components/volunteer/SubMenu.vue`
- `src/components/organization/OrganizationSidebar.vue`
- `src/components/organization/MenuItem.vue`
- `src/components/organization/SubMenu.vue`
- `src/components/data-list/DataListPage.vue`
- `src/components/data-list/DataToolbar.vue`
- `src/components/data-list/DetailDrawer.vue`
- `src/components/volunteer/VolunteerPageHeader.vue`
- `src/components/organization/OrganizationPageHeader.vue`
- `src/assets/styles/main.css`
- `src/views/Volunteer/Activities.vue`
- `src/views/Volunteer/MyRegistrations.vue`
- `src/views/Volunteer/Dashboard.vue`
- `src/views/Volunteer/Organizations.vue`
- `src/views/Volunteer/Profile.vue`
- `src/views/Organization/ActivityManagement.vue`
- `src/views/Organization/VolunteerManagement.vue`
- `src/views/Organization/WorkHours.vue`
- `src/views/Organization/StatisticsActivities.vue`
- `src/views/Organization/StatisticsVolunteers.vue`
- `src/views/Organization/OrganizationInfo.vue`
- `src/views/Organization/Notifications.vue`
- `src/views/Organization/AIAssistant.vue`

**Verify**
- `npm run lint`
- `npm run build`
- Manual responsive QA from `docs/responsive-layout-qa-checklist.md`

### Task 1: Introduce Shared Responsive Shell State

**Files:**
- Create: `src/composables/useResponsiveWorkbench.ts`
- Modify: `src/views/Volunteer/VolunteerLayout.vue`
- Modify: `src/views/Organization/OrganizationLayout.vue`
- Modify: `src/assets/styles/main.css`

- [ ] **Step 1: Add the shared shell-mode composable**

```ts
// src/composables/useResponsiveWorkbench.ts
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type WorkbenchMode = 'expanded' | 'compact' | 'mobile'

const MOBILE_MAX = 1023
const COMPACT_MAX = 1439

export const useResponsiveWorkbench = () => {
  const viewportWidth = ref(typeof window === 'undefined' ? 1440 : window.innerWidth)

  const syncViewport = () => {
    viewportWidth.value = window.innerWidth
  }

  onMounted(() => {
    syncViewport()
    window.addEventListener('resize', syncViewport, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', syncViewport)
  })

  const mode = computed<WorkbenchMode>(() => {
    if (viewportWidth.value <= MOBILE_MAX) return 'mobile'
    if (viewportWidth.value <= COMPACT_MAX) return 'compact'
    return 'expanded'
  })

  return {
    viewportWidth,
    mode,
    isMobile: computed(() => mode.value === 'mobile'),
    isCompact: computed(() => mode.value === 'compact'),
    isExpanded: computed(() => mode.value === 'expanded')
  }
}
```

- [ ] **Step 2: Verify the new composable is type-safe**

Run: `npm run build`
Expected: PASS and no TypeScript errors caused by `useResponsiveWorkbench.ts`

- [ ] **Step 3: Refactor both layout shells to consume the shared mode**

```vue
<!-- inside each layout -->
<aside
  v-if="!isMobile"
  class="workbench-nav-surface shrink-0 overflow-y-auto"
  :class="isCompact ? 'workbench-nav-surface--compact' : 'workbench-nav-surface--expanded'"
>
  <SidebarComponent
    :sidebar-width="sidebarWidth"
    :enable-compact="isCompact"
    :show-brand-copy="!isCompact"
  />
</aside>

<div class="workbench-mobile-topbar" v-if="isMobile">
  <button @click="isMobileSidebarOpen = true">
    <MenuIcon class="h-5 w-5" />
    <span>菜单</span>
  </button>
</div>
```

- [ ] **Step 4: Add shell utility classes for expanded/compact/mobile transitions**

```css
/* src/assets/styles/main.css */
.workbench-shell-main {
  @apply h-screen overflow-hidden;
}

.workbench-nav-surface--expanded {
  width: var(--workbench-sidebar-width, 296px);
}

.workbench-nav-surface--compact {
  width: 92px;
}

.workbench-mobile-topbar {
  @apply border-b border-white/70 bg-white/80 px-4 py-3 backdrop-blur;
}
```

- [ ] **Step 5: Re-run static checks after the shell refactor**

Run: `npm run lint`
Expected: PASS with no new lint errors in the layouts, composable, or shared stylesheet

- [ ] **Step 6: Commit the shell-mode scaffold**

```bash
git add src/composables/useResponsiveWorkbench.ts src/views/Volunteer/VolunteerLayout.vue src/views/Organization/OrganizationLayout.vue src/assets/styles/main.css
git commit -m "feat: add shared responsive workbench shell"
```

### Task 2: Make Volunteer Navigation Support Expanded, Compact, and Mobile States

**Files:**
- Modify: `src/components/volunteer/VolunteerSidebar.vue`
- Modify: `src/components/volunteer/MenuItem.vue`
- Modify: `src/components/volunteer/SubMenu.vue`
- Modify: `src/views/Volunteer/VolunteerLayout.vue`
- Modify: `src/assets/styles/main.css`

- [ ] **Step 1: Extend the volunteer sidebar props for compact-rail rendering**

```ts
// VolunteerSidebar props
const props = withDefaults(defineProps<{
  sidebarWidth?: number
  enableCompact?: boolean
  showBrandCopy?: boolean
}>(), {
  sidebarWidth: 296,
  enableCompact: true,
  showBrandCopy: true
})

const isCompactSidebar = computed(() => props.enableCompact)
```

- [ ] **Step 2: Update volunteer menu items so compact mode hides low-priority text instead of breaking layout**

```vue
<div class="min-w-0 flex-1" v-if="!isCompactSidebar">
  <p class="font-semibold leading-5" :class="isCompactSidebar ? 'sr-only' : 'truncate whitespace-nowrap'">
    {{ item.label }}
  </p>
</div>

<span v-if="item.badge && !isCompactSidebar" class="menu-item-badge">
  {{ item.badge }}
</span>
```

- [ ] **Step 3: Keep the active group accessible in compact mode**

```vue
<SubMenu
  v-if="hasChildren && (!isCompactSidebar || isExpanded)"
  :items="item.children"
  :is-compact-sidebar="isCompactSidebar"
  :expanded="isExpanded"
/>
```

- [ ] **Step 4: Add hover/focus affordances for the compact rail**

```css
.volunteer-sidebar--compact .menu-item-main {
  @apply justify-center px-3;
}

.volunteer-sidebar--compact .menu-item-main[aria-current='page'] {
  @apply shadow-[inset_0_0_0_1px_rgba(16,185,129,0.18)];
}
```

- [ ] **Step 5: Validate volunteer navigation behavior**

Run: `npm run lint`
Expected: PASS with no template or prop warnings for volunteer menu components

- [ ] **Step 6: Commit the volunteer navigation changes**

```bash
git add src/components/volunteer/VolunteerSidebar.vue src/components/volunteer/MenuItem.vue src/components/volunteer/SubMenu.vue src/views/Volunteer/VolunteerLayout.vue src/assets/styles/main.css
git commit -m "feat: harden volunteer responsive navigation"
```

### Task 3: Bring Organization Navigation to Feature Parity

**Files:**
- Modify: `src/components/organization/OrganizationSidebar.vue`
- Modify: `src/components/organization/MenuItem.vue`
- Modify: `src/components/organization/SubMenu.vue`
- Modify: `src/views/Organization/OrganizationLayout.vue`
- Modify: `src/assets/styles/main.css`

- [ ] **Step 1: Give the organization sidebar the same compact-mode API as the volunteer sidebar**

```ts
// OrganizationSidebar props
const props = withDefaults(defineProps<{
  sidebarWidth?: number
  enableCompact?: boolean
}>(), {
  sidebarWidth: 304,
  enableCompact: false
})

const isCompactSidebar = computed(() => props.enableCompact)
```

- [ ] **Step 2: Mirror the organization menu rendering rules**

```vue
<span v-if="item.badge && !isCompactSidebar" class="menu-item-badge">
  {{ item.badge }}
</span>

<ChevronRightIcon
  v-if="hasChildren && !isCompactSidebar"
  class="h-4 w-4 shrink-0 transition-transform duration-200"
/>
```

- [ ] **Step 3: Make the compact rail keep only icons and the active section**

```ts
const shouldRenderChildren = computed(() => !props.isCompactSidebar || props.expanded)
```

- [ ] **Step 4: Align organization shell classes with the shared workbench utilities**

```vue
<OrganizationSidebar
  :sidebar-width="sidebarWidth"
  :enable-compact="isCompact"
  @close="isMobileSidebarOpen = false"
/>
```

- [ ] **Step 5: Verify both navigation systems compile together**

Run: `npm run build`
Expected: PASS with both workbench layouts rendering after the shared sidebar API changes

- [ ] **Step 6: Commit the organization navigation updates**

```bash
git add src/components/organization/OrganizationSidebar.vue src/components/organization/MenuItem.vue src/components/organization/SubMenu.vue src/views/Organization/OrganizationLayout.vue src/assets/styles/main.css
git commit -m "feat: unify organization responsive navigation"
```

### Task 4: Harden Shared Data-List Containers and Drawers

**Files:**
- Modify: `src/components/data-list/DataListPage.vue`
- Modify: `src/components/data-list/DataToolbar.vue`
- Modify: `src/components/data-list/DetailDrawer.vue`
- Modify: `src/components/volunteer/VolunteerPageHeader.vue`
- Modify: `src/components/organization/OrganizationPageHeader.vue`
- Modify: `src/assets/styles/main.css`

- [ ] **Step 1: Add layout wrappers that can shrink safely**

```vue
<!-- DataListPage.vue -->
<div class="data-list-page">
  <header v-if="$slots.header" class="min-w-0">
    <slot name="header" />
  </header>
  <section v-if="$slots.toolbar" class="min-w-0">
    <slot name="toolbar" />
  </section>
</div>
```

- [ ] **Step 2: Update the toolbar to prefer wrapping over overflow**

```css
.data-list-toolbar {
  @apply flex flex-col gap-4 rounded-[1.5rem] p-4 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(280px,auto)];
}

.data-list-toolbar-actions {
  @apply flex min-w-0 flex-col gap-3 xl:items-end;
}
```

- [ ] **Step 3: Make the detail drawer width adaptive on narrower desktop widths**

```ts
const drawerStyle = computed(() => ({
  '--detail-drawer-width': 'min(100vw, var(--detail-drawer-width-base, 560px))',
  zIndex: getOverlayZIndex(overlayId.value)
}))
```

```css
.detail-drawer-panel {
  width: min(100vw, var(--detail-drawer-width));
}

@media (max-width: 1279px) {
  .detail-drawer-panel {
    width: min(100vw, 480px);
  }
}
```

- [ ] **Step 4: Ensure shared page headers can stack summary chips and action groups cleanly**

```css
.volunteer-page-header-actions,
.organization-page-header-actions {
  @apply grid min-w-0 gap-3;
}
```

- [ ] **Step 5: Verify the shared containers after refactoring**

Run: `npm run lint`
Expected: PASS with no scoped-style or template regressions in shared container components

- [ ] **Step 6: Commit the shared container hardening**

```bash
git add src/components/data-list/DataListPage.vue src/components/data-list/DataToolbar.vue src/components/data-list/DetailDrawer.vue src/components/volunteer/VolunteerPageHeader.vue src/components/organization/OrganizationPageHeader.vue src/assets/styles/main.css
git commit -m "feat: harden shared workbench containers"
```

### Task 5: Fix Volunteer Pages That Are Most Likely to Break at Mid-Width

**Files:**
- Modify: `src/views/Volunteer/Activities.vue`
- Modify: `src/views/Volunteer/MyRegistrations.vue`
- Modify: `src/views/Volunteer/Dashboard.vue`
- Modify: `src/views/Volunteer/Organizations.vue`
- Modify: `src/views/Volunteer/Profile.vue`
- Modify: `src/assets/styles/main.css`

- [ ] **Step 1: Let activity and registration toolbars reflow before they overflow**

```vue
<div class="grid w-full gap-3 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
  <Input class="min-w-0 xl:min-w-[240px]" />
  <Button class="w-full xl:w-auto" />
  <RouterLink class="volunteer-toolbar-button w-full xl:w-auto" />
</div>
```

- [ ] **Step 2: Move right-rail content below the main list on compact desktop widths**

```vue
<div class="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
  <!-- main content -->
</div>
```

- [ ] **Step 3: Clamp card and stat grids so icons, numbers, and labels do not collide**

```vue
<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
  <VolunteerSummaryCard ... />
</div>
```

- [ ] **Step 4: Add page-level `min-w-0` and `overflow-wrap` safeguards where long labels exist**

```css
.volunteer-page-stage,
.volunteer-activity-command-board,
.volunteer-profile-studio {
  @apply min-w-0;
}
```

- [ ] **Step 5: Verify volunteer screens**

Run: `npm run build`
Expected: PASS and volunteer workbench routes still compile after layout-grid changes

- [ ] **Step 6: Commit the volunteer page fixes**

```bash
git add src/views/Volunteer/Activities.vue src/views/Volunteer/MyRegistrations.vue src/views/Volunteer/Dashboard.vue src/views/Volunteer/Organizations.vue src/views/Volunteer/Profile.vue src/assets/styles/main.css
git commit -m "feat: stabilize volunteer mid-width layouts"
```

### Task 6: Fix Organization Pages That Are Most Likely to Break at Mid-Width

**Files:**
- Modify: `src/views/Organization/ActivityManagement.vue`
- Modify: `src/views/Organization/VolunteerManagement.vue`
- Modify: `src/views/Organization/WorkHours.vue`
- Modify: `src/views/Organization/StatisticsActivities.vue`
- Modify: `src/views/Organization/StatisticsVolunteers.vue`
- Modify: `src/views/Organization/OrganizationInfo.vue`
- Modify: `src/views/Organization/Notifications.vue`
- Modify: `src/views/Organization/AIAssistant.vue`
- Modify: `src/assets/styles/main.css`

- [ ] **Step 1: Apply the same action-row wrapping rules to organization toolbars**

```vue
<div class="grid w-full gap-3 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
  <!-- filters and actions -->
</div>
```

- [ ] **Step 2: Delay multi-column dashboard and statistics layouts until there is enough width**

```vue
<div class="grid gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
  <!-- dashboard / stats layout -->
</div>
```

- [ ] **Step 3: Ensure form-heavy pages stack fields and action groups safely**

```css
.organization-form-cluster {
  @apply grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3;
}
```

- [ ] **Step 4: Add overflow protection for long badges, table controls, and AI assistant panels**

```css
.organization-page-stage,
.organization-command-board,
.organization-stats-panel {
  @apply min-w-0;
}
```

- [ ] **Step 5: Verify organization screens**

Run: `npm run lint`
Expected: PASS with no new lint errors in organization views after responsive grid updates

- [ ] **Step 6: Commit the organization page fixes**

```bash
git add src/views/Organization/ActivityManagement.vue src/views/Organization/VolunteerManagement.vue src/views/Organization/WorkHours.vue src/views/Organization/StatisticsActivities.vue src/views/Organization/StatisticsVolunteers.vue src/views/Organization/OrganizationInfo.vue src/views/Organization/Notifications.vue src/views/Organization/AIAssistant.vue src/assets/styles/main.css
git commit -m "feat: stabilize organization mid-width layouts"
```

### Task 7: Add a Manual QA Checklist and Run Final Verification

**Files:**
- Create: `docs/responsive-layout-qa-checklist.md`
- Modify: `docs/superpowers/plans/2026-03-29-admin-responsive-layout-hardening.md`

- [ ] **Step 1: Write a viewport-by-viewport checklist**

```md
# Responsive Layout QA Checklist

- Expanded desktop: 1512px or wider, sidebars fully expanded.
- Compact desktop: 1024px to 1439px, sidebars collapse to compact rail.
- Mobile: 1023px or narrower, drawer opens from the top-left menu button.
- DevTools-open desktop: open the browser console and confirm no clipped actions, missing navigation, or overlapping summary cards.
- Drawer validation: detail drawers stay within viewport and remain dismissible by overlay and Escape.
```

- [ ] **Step 2: Run final automated verification**

Run: `npm run lint`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Execute the manual QA checklist**

Run:

```bash
npm run dev
```

Expected:
- Volunteer and organization layouts switch cleanly between expanded, compact, and mobile states.
- Opening DevTools does not hide navigation or cause action bars to overlap.
- Data-list drawers and page headers remain usable at every tested width.

- [ ] **Step 4: Commit the QA assets**

```bash
git add docs/responsive-layout-qa-checklist.md docs/superpowers/plans/2026-03-29-admin-responsive-layout-hardening.md
git commit -m "docs: add responsive workbench QA checklist"
```

## Self-Review

- Spec coverage: This plan covers the shared shell, both navigation systems, shared content containers, volunteer pages, organization pages, and final breakpoint/DevTools verification.
- Placeholder scan: No `TODO`, `TBD`, or “similar to above” placeholders remain.
- Type consistency: The shared mode API uses `expanded`, `compact`, and `mobile` consistently across the shell and sidebar tasks.
