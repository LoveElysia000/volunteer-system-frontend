# Organization Info List + Drawer Design

**Date:** 2026-03-24

**Page:** `src/views/Organization/OrganizationInfo.vue`

## Goal

Redesign the organization information page into a cleaner data-list experience where the main area only shows organization records, and detailed viewing/editing happens in a right-side drawer.

## Product Direction

This page should behave like a proper admin data management screen:

- The main surface is for browsing and selecting records.
- The detail experience is separated from the list.
- Editing is not always visible.
- The default state emphasizes data clarity, not forms.

## Core Model

The page is split into two levels:

1. **Primary level: organization list**
   - Search
   - Lightweight list rows
   - Fast scanning of key fields

2. **Secondary level: right-side detail drawer**
   - Read-only details by default
   - Explicit edit mode
   - Save and cancel actions inside the drawer

## Main Page Structure

### Top Header

Keep a concise page header with:

- Page title
- Short description
- Light metadata if needed
- Optional list-level action area

The header should not carry the detailed editing burden anymore.

### List Area

The main page content should become a straightforward list, not a workbench.

Contents:

- Search input
- Optional light list utility row
- Record list

Each record should be displayed as one row.

Recommended fields per row:

- 组织名称
- 联系人
- 联系电话
- 组织编码
- 更新时间
- 行尾操作：`查看详情`

Visual direction:

- No chunky cards for each organization
- No embedded summaries or explanation panels between rows
- Light hover state
- Clear selected/opened row feedback if helpful

## Drawer Structure

The right-side drawer is the secondary workspace for one organization.

### Drawer Default State

Read-only detail mode.

Header:

- Organization name
- Small status or identity metadata
- Close button
- Edit button

Body grouped into sections:

1. 基础信息
   - 组织名称
   - 组织编码

2. 联系信息
   - 联系人
   - 联系电话
   - 地址

3. 展示信息
   - 组织介绍
   - Logo

4. 账户信息
   - 用户名
   - 邮箱
   - 手机号

### Drawer Edit State

Clicking `编辑` changes the drawer from read-only to editable.

Behavior:

- Keep the same information grouping
- Replace display values with editable fields
- Show `保存` and `取消`
- Saving keeps the drawer open and refreshes content
- Cancel returns to read-only mode

## Interaction Flow

1. User opens the organization information page.
2. User searches or scans the list.
3. User clicks a row or `查看详情`.
4. The right drawer opens with read-only details.
5. User clicks `编辑`.
6. Drawer switches to edit mode.
7. User saves or cancels.
8. Drawer stays in context until explicitly closed.

## Design Principles

- The main area should feel calm and utilitarian.
- Detail density belongs in the drawer, not the list.
- Editing should be intentional, not always exposed.
- The list should be easy to scan even when many organizations exist.

## Visual Direction

### List

- Clean row-based presentation
- Minimal decoration
- Soft separators, strong typography hierarchy
- Compact but readable density

### Drawer

- More polished and layered than the list
- Clear section grouping
- Strong title, calm content blocks
- Editing controls visually distinct from read-only content

## Data and Logic Constraints

- Keep existing APIs and request payloads
- Keep separate save flows for account info and organization info if the backend still requires them
- Do not invent new fields
- Preserve empty state and loading behavior

## Non-Goals

- No backend redesign
- No certification upload workflow redesign in this pass
- No full-page navigation to a dedicated detail route

## Success Criteria

- The main page looks like a data list, not a mixed dashboard/editor
- The list is easy to scan row by row
- Details are accessible without leaving the page
- Editing is available but no longer clutters the primary view
