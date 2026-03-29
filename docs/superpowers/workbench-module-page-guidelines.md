# Workbench Module Page Guidelines

**Date:** 2026-03-29

## Purpose

This document defines how volunteer and organization module pages should be built going forward so new work does not recreate layout debt.

The goal is to keep page visuals flexible while making page skeletons, spacing, split layouts, and standard empty states consistent.

## Core Rule

Module pages may own their business content and visual wording, but they should not hand-roll a new outer layout system when an existing workbench primitive already matches the page type.

## Page Type Mapping

All logged-in workbench module pages should choose one primary structural type.

### 1. List Page

Use for:

- filters
- toolbars
- tables or card lists
- optional detail drawer

Base:

- `DataListPage`

Common companions:

- `VolunteerPageHeader` or `OrganizationPageHeader`
- `DataToolbar`
- `DetailDrawer`

Examples:

- volunteer `Activities`
- volunteer `MyRegistrations`
- volunteer `Notifications`
- volunteer `WorkHours`
- organization `ActivityManagement`
- organization `VolunteerManagement`
- organization `WorkHours`
- organization `ActivityReview`
- organization `Members`
- organization `Notifications`

### 2. Dashboard Page

Use for:

- overview pages
- hero-led analytics pages
- grouped KPI and summary cards

Base:

- `WorkbenchPage`
- `WorkbenchHeroPanel`

Examples:

- volunteer `Dashboard`
- organization `Dashboard`
- organization `Statistics`
- organization `StatisticsActivities`
- organization `StatisticsVolunteers`

### 3. Studio Page

Use for:

- primary work area plus supporting side panels
- editing, creation, discovery, or assistant workflows

Base:

- `WorkbenchPage`
- `WorkbenchSplitLayout`

Examples:

- volunteer `Profile`
- volunteer `Organizations`
- organization `AIAssistant`
- organization `ActivityCreate`
- organization `OrganizationInfo`

### 4. Detail Page

Use for:

- single-entity detail views
- grouped detail sections with contextual actions

Base:

- `WorkbenchPage`
- `WorkbenchDetailPanel`

Examples:

- volunteer `ActivityDetail`

## Shared Primitives

Prefer these shared workbench primitives before creating a new wrapper:

- `src/components/workbench/WorkbenchPage.vue`
- `src/components/workbench/WorkbenchSplitLayout.vue`
- `src/components/workbench/WorkbenchHeroPanel.vue`
- `src/components/workbench/WorkbenchEmptyPanel.vue`
- `src/components/workbench/WorkbenchDetailPanel.vue`

These components own structure, not role-specific skin.

## Skin Layer

Keep role-specific presentation in existing components:

- `VolunteerPageHeader`
- `OrganizationPageHeader`
- `VolunteerSectionCard`
- `OrganizationSectionCard`

Do not merge volunteer and organization visual components just for reuse if the page skin is intentionally different.

## Split Layout Rules

If a page needs columns, start with `WorkbenchSplitLayout`.

Use an existing `variant` when possible.

Current variants cover:

- `dashboard`
- `dashboard-wide`
- `studio`
- `detail`
- `assistant`
- `form`

If a page still needs a different ratio:

1. confirm the ratio expresses a reusable page type, not a one-off tweak
2. add a semantic variant name
3. do not inline a fresh `2xl:grid-cols-[...]` string inside the page unless there is a strong reason

## Empty State Rules

If the page needs the standard dashed empty/loading panel pattern, use `WorkbenchEmptyPanel`.

Good fit:

- simple empty text
- simple loading text
- identical dashed box pattern already used elsewhere

Do not force `WorkbenchEmptyPanel` onto blocks that are not actually standard empty states, such as:

- custom onboarding panels
- hero-like advisory blocks
- empty states with multiple nested guidance cards
- highly customized preview placeholders

When a page already has approved visual details that differ slightly from the default empty panel, preserve them with local classes instead of rewriting the page into a worse generic version.

## Slot Rules

For wrapper components that forward named slots:

- only pass a named slot through when it actually exists
- avoid always-rendered empty wrappers
- keep spacing and structural presence driven by real content

This rule is especially important for `DataListPage`-style wrappers.

## What To Abstract

Abstract when all of the following are true:

- used in at least a few pages
- structure is materially the same
- differences are mostly text, tone, or small spacing adjustments

Do not abstract when:

- the page is the only consumer
- the abstraction would require many awkward props
- the visual intent is actually different
- reuse would make the code harder to understand

## Module Page Checklist

Before finishing a module page change, check:

1. Did the page choose one primary skeleton type?
2. Did the page reuse workbench primitives for outer structure?
3. Did it avoid inventing a new split layout when an existing variant works?
4. Did it use `WorkbenchEmptyPanel` only where the visual pattern is truly standard?
5. Did it preserve approved page-specific visuals instead of over-normalizing them?
6. Did any wrapper only forward optional slots when present?

## Verification Expectations

When changing workbench layout structure:

- run `node --test tests/workbench-layout.test.ts`
- run any affected module-specific tests
- run `npm run build`

If lint is still blocked by the existing temporary Vite timestamp file issue, note that clearly rather than treating it as a new layout regression.
