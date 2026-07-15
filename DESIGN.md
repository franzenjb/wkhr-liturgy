# DESIGN.md — WKHR

This app follows the Franzen App Standard.

Canonical standard:

`/Users/jefffranzen/dev/franzen-app-standards/DESIGN_SYSTEM.md`

## App Identity

- Operational Red Cross / GIS / data tool.
- Calm, scannable, practical.
- Map/data/workflow first.
- No generic AI styling.

## Required Tokens

Use:

```css
@import "./brand-system.css";
```

or copy the relevant tokens from `templates/brand-system.css`.

## Red Cross Map Base

For new Red Cross map apps, start from `/Users/jefffranzen/dev/red-cross-map-base-template` unless Jeff explicitly says otherwise. Preserve the proven `livessaved.jbf.com` filters, zoom behavior, sidebars, and right-sidebar tab model. Follow `references/RED_CROSS_SIDEBARS.md` for the exact open-panel, closed-rail, resizing, scrolling, accessibility, and responsive contract.

## Search And Action Controls

When this app has search, segmented filters, launch buttons, tool/report menus, or destination cards, use the Florida ROS control pattern documented in:

`/Users/jefffranzen/dev/franzen-app-standards/references/FLORIDA_ROS_CONTROLS.md`

Preserve its command search, `/` shortcut, ranked live results, Enter behavior, example chips, compact segmented filters, and full-width high-contrast action tiles.

For internal/personal tools, also include the compact `Resources` group linking to Sites, Tools, and Inventory. Public, client, and donor-facing tools omit it unless explicitly requested.

## Required Checks

- Approved logo asset used.
- Max two font families.
- Shared color tokens used.
- Buttons match shared styles.
- Search and launch controls match the Florida ROS pattern when applicable.
- Internal/personal tools include the Sites, Tools, and Inventory resource links.
- Sidebars retractable and resizable.
- Map controls match standard.
- Default ArcGIS popups disabled.
- Public views hide internal plumbing.
- Contrast checked.
