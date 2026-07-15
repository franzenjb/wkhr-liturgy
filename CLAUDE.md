# CLAUDE.md - Franzen App Standard

You are working on a Jeff Franzen / JBF / Red Cross GIS application.

The visual goal is consistent operational craft. A user should recognize the app as Jeff's work: calm, useful, map/data first, Red Cross-aware, and not generic AI output.

## Follow These Rules

0. For a new blank app repo, install `AGENTS.md`, `CLAUDE.md`, and `DESIGN.md` before feature work:
   `node /Users/jefffranzen/dev/franzen-app-standards/scripts/install-app-standard.mjs /path/to/new-repo`
1. Read `DESIGN.md` in this repo. If missing, use `/Users/jefffranzen/dev/franzen-app-standards/DESIGN_SYSTEM.md`.
2. Use only one UI font and one mono font.
3. Use approved logo assets. Do not draw a fake Red Cross logo.
4. Use role-based color tokens. Do not create a new palette.
5. Build the real app/tool first, not a landing page.
6. For any map-app sidebar, side panel, bottom bar, replay bar, or timeline tray,
   use the `map-app-rails` skill and `references/RED_CROSS_SIDEBARS.md`: integrated
   edge/bottom rails, resizable expanded panels, and CSS-grid map reflow. Never
   substitute detached floating show/hide buttons. This is brand-neutral.
7. Use standard map controls and disable default ArcGIS popups.
8. Hide internal plumbing in public views.
9. Verify contrast, mobile layout, and live behavior.
10. Offer the smile/frown **feedback widget** (top-right, emails Jeff) — see the `feedback-widget` skill. Ask before adding it on a new app; just add it when Jeff asks.
11. When the app has search, filters, launch buttons, report/tool menus, or destination cards, use the Florida ROS control pattern: command search, `/` shortcut, ranked live results, Enter-to-open/select, example chips, compact segmented filters, and full-width high-contrast action tiles. See `references/FLORIDA_ROS_CONTROLS.md` in the standards repo.
12. New internal/personal tools get a compact `Resources` group linking to `Sites` (`https://sites.jbf.com`), `Tools` (`https://tools.jbf.com`), and `Inventory` (`https://inventory.jbf.com`) in a header or persistent utility area. Open them in new tabs. Exclude it from donor/client/public surfaces unless Jeff explicitly asks.

## Red Cross Map Base Rule

For new Red Cross map apps, start from `/Users/jefffranzen/dev/red-cross-map-base-template` unless Jeff explicitly says otherwise. Preserve the proven `livessaved.jbf.com` map pattern: filters, zoom-to-results behavior, app-owned sidebars, right-sidebar tabs for dense data, disabled default ArcGIS popups, and recognizable Jeff/JBF map-first UX. Sidebar anatomy and behavior are mandatory and documented in `references/RED_CROSS_SIDEBARS.md`.

## ArcGIS SDK Scaffold Rule

For any other NEW ArcGIS Maps SDK web app, do not hand-write the boilerplate. Generate the skeleton with Esri's official scaffold, in `~/dev`:

```bash
cd ~/dev && npm init @arcgis
```

Choose the `vite` template. This produces the current official Vite + TypeScript + `@arcgis/map-components` skeleton (including an `src/auth` starting point). Then run the app-standard installer and apply house patterns on top (standard map controls, default popups disabled, retractable/resizable side panels, role tokens).

Precedence: the Red Cross Map Base Rule above wins when Jeff wants the full `livessaved.jbf.com` shell. Otherwise: official scaffold first, AI agent second, human judgment always (the `gislab.jbf.com` doctrine).

## Default Visual Direction

White/light-gray workspace, strong Red Cross red accent, dark readable text, compact controls, restrained cards, data/map-first layout, consistent button styles.

Avoid gradients, decorative blobs, emoji UI, serif display headers, fake logos, and one-off colors.



## Python Data Stack

For any Python data work in a Jeff/JBF/Red Cross tool — ingest, clean, transform, analyze, notebook, script, or CI — default to the modern Rust-built stack. Proven + demoed live at [coding.jbf.com/#rust-wave](https://coding.jbf.com/#rust-wave); reference repo `github.com/franzenjb/python-packages`.

1. **uv** runs every Python repo: `uv init`, `uv add`, `uv run`. No manual venv/pip/poetry. Commit `uv.lock`. Use in CI too.
2. **Ruff** is the only linter/formatter: `uvx ruff format .`, `uvx ruff check .`. No black/flake8/isort.
3. **Polars** over pandas once files are large or the transform is real work; pandas stays fine for small ecosystem-glue tasks.
4. **DuckDB** for SQL directly over CSV/Parquet, no server — first choice over the canonical `red-cross-data` spine and for DuckDB-WASM browser demos.
5. **marimo** for notebooks that must survive review, live in git, or drive a picker; Jupyter still fine for scratch.

Non-negotiable: real data from the canonical `red-cross-data` spine (join on codes, show names), and any benchmark/transform ships a runnable self-check proving correctness before any speed claim. Pipeline for RC data: DuckDB → Polars → GeoPandas.

## ArcGIS Knowledge Sources

When working with the ArcGIS Maps SDK for JavaScript, Calcite, map
components, or ArcGIS REST APIs:

1. Never rely on memory for API signatures or component names — training
   data skews to SDK 4.x and the platform is on 5.x. Confirm against a live
   source before writing code.
2. Use Context7 MCP for reference lookups:
   - ArcGIS JS Maps SDK docs: `/websites/developers_arcgis_javascript`
   - ArcGIS REST APIs docs: `/websites/developers_arcgis_rest`
   - Calcite Design System docs: `/websites/developers_arcgis_calcite-design-system`
   - Official Esri samples: `/esri/jsapi-resources`
   If Context7 misses, fetch the page from developers.arcgis.com directly.
3. Pin new apps to the versions in `esri-versions.json` of the
   `esri-javascript-sdk` repo (kept current by its esri-watch workflow).
4. Prefer `@arcgis/map-components` (web components) for new apps; drop down
   to `@arcgis/core` only where fine-grained control is needed.
5. House patterns override generic Esri examples: default ArcGIS popups
   disabled, app-owned retractable sidebars, right-sidebar tabs for dense
   data, filters + zoom-to-results, Calcite components with role-based
   color tokens, one UI font + one mono font. See DESIGN.md and
   `red-cross-map-base-template`.
6. Esri's in-org AI assistants are disabled in the Red Cross ArcGIS
   organization — do not plan features around them or suggest enabling
   them; use the sources above instead.
7. AI in the development workflow (Claude Code / Codex as coding tools) is
   fine — it never touches the Red Cross org. But do NOT embed Claude or
   OpenAI API calls as runtime features inside Red Cross-facing apps unless
   Jeff explicitly approves it for that app: until Red Cross turns on AI
   assistants, in-app AI is a governance decision, not a technical one.
