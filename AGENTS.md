# AGENTS.md - Global Franzen App Standard

Use this file in every Jeff Franzen / JBF / Red Cross GIS app repo.

## Mandatory Design Source

Before changing UI, read the local `DESIGN.md` if present. If it is missing, use:

`/Users/jefffranzen/dev/franzen-app-standards/DESIGN_SYSTEM.md`

Do not invent a new visual identity for each app.

## New Repo Bootstrap

Every new Jeff/JBF/Red Cross app repo must start with these three files before feature work begins:

- `AGENTS.md`
- `CLAUDE.md`
- `DESIGN.md`

Install them with:

```bash
node /Users/jefffranzen/dev/franzen-app-standards/scripts/install-app-standard.mjs /path/to/new-repo
```

Run this immediately after creating or cloning a blank app repo.

## Red Cross Map Base Rule

For new Red Cross map apps, start from `/Users/jefffranzen/dev/red-cross-map-base-template` unless Jeff explicitly says otherwise. It captures the proven `livessaved.jbf.com` map pattern: filters, zoom-to-results behavior, app-owned sidebars, right-sidebar tabs for dense data, disabled default ArcGIS popups, and recognizable Jeff/JBF map-first UX. Sidebar anatomy and behavior are mandatory and documented in `references/RED_CROSS_SIDEBARS.md`.

## ArcGIS SDK Scaffold Rule

For any other NEW ArcGIS Maps SDK web app, do not hand-write the boilerplate. Generate the skeleton with Esri's official scaffold, in `~/dev`:

```bash
cd ~/dev && npm init @arcgis
```

Choose the `vite` template. This produces the current official Vite + TypeScript + `@arcgis/map-components` skeleton (including an `src/auth` starting point). Then run the app-standard installer and apply house patterns on top (standard map controls, default popups disabled, retractable/resizable side panels, role tokens).

Precedence: the Red Cross Map Base Rule above wins when Jeff wants the full `livessaved.jbf.com` shell. Otherwise: official scaffold first, AI agent second, human judgment always (the `gislab.jbf.com` doctrine).

## Brand Rules

- Use the approved Red Cross logo asset. Never fake it with a plus sign, emoji, generated SVG, or text-only mark.
- Use one primary UI font and one mono font.
- Use the shared role tokens for red, ink, muted text, borders, canvas, and surface.
- Do not add decorative gradients, orbs, bokeh blobs, or random brand palettes.
- Red is brand/primary/urgent, not a full-page theme.

## Operational UI Rules

- Build the usable tool as the first screen.
- Keep app UI dense, calm, and scannable.
- Any map-app sidebar, side panel, bottom bar, replay bar, or timeline tray must
  follow the `map-app-rails` skill and `references/RED_CROSS_SIDEBARS.md`: CSS-grid
  map reflow, integrated 52px/44px edge rails, resizable expanded panels, and a
  matching horizontal bottom rail. Detached floating show/hide buttons are not
  the collapsed state. The structure applies to independent products too.
- Buttons use the shared primary/secondary/ghost/icon styles.
- For search, segmented filters, launch buttons, report/tool menus, and destination tiles, use the Florida ROS control pattern: prominent command search, `/` shortcut, ranked live results, Enter-to-open/select, example chips, compact segmented filters, and full-width high-contrast action tiles. Read `references/FLORIDA_ROS_CONTROLS.md` in the standards repo.
- New internal/personal tools get a compact `Resources` group linking to `Sites` (`https://sites.jbf.com`), `Tools` (`https://tools.jbf.com`), and `Inventory` (`https://inventory.jbf.com`) in a header or persistent utility area. Open them in new tabs. Exclude this internal navigation from donor/client/public surfaces unless Jeff explicitly asks for it.
- Cards have 8px radius maximum and are not nested inside other cards.
- All text must have readable contrast.
- Offer the smile/frown feedback widget (top-right, `<a href="mailto:jeff.franzen2@redcross.org">` anchors, success/danger tokens) — see the `feedback-widget` skill. Ask before adding on a new app; add it on request.

## Map Rules

- ArcGIS maps: Home and Zoom top-left, Basemap Gallery in Expand bottom-right, Scale bar bottom-left, Search top-right when useful.
- Disable default ArcGIS popups.
- Feature details belong in a formatted app-owned side panel.
- No raw schema fields in public UI.

## Public/Donor-Facing Rules

Hide internal plumbing:

- no item IDs
- no Client IDs
- no raw layer names
- no `Open in ArcGIS`
- no admin/debug badges
- no implementation labels

## AI Drift Checks

Before final response or deploy, scan for:

- more than two font families
- color values outside shared tokens
- fake logo marks
- emojis used as production icons
- default ArcGIS popup behavior
- internal/dev copy in public UI

Run when practical:

```bash
node /Users/jefffranzen/dev/franzen-app-standards/scripts/audit-app-style.mjs .
```

## Python Data Stack (default for any Python data work)

When a tool involves Python data work — ingest, clean, transform, analyze, notebook, script, or CI — default to the modern Rust-built stack, not the legacy defaults. Proven and demoed live at [coding.jbf.com/#rust-wave](https://coding.jbf.com/#rust-wave); reference repo `github.com/franzenjb/python-packages`.

- **uv** — the environment and runner for every Python repo. `uv init`, `uv add <pkg>`, `uv run <script>`. No manual `venv`/`pip`/`poetry`. Commit `uv.lock`. Use it in GitHub Actions too (faster CI).
- **Ruff** — the only linter/formatter. `uvx ruff format .` and `uvx ruff check .`. Do not add black/flake8/isort.
- **Polars** — default dataframe library once a file is large or the transform is real work. pandas stays fine for small, familiar, ecosystem-glue tasks. Benchmarked ~24× pandas on CSV reads, ~15× on groupby.
- **DuckDB** — SQL directly over CSV/Parquet, no server, no import step. First choice for querying the canonical `red-cross-data` spine (`county_master`, etc.) and for DuckDB-WASM live demos in the browser (see the coding.jbf.com section 1 + rust-wave patterns).
- **marimo** — reactive notebooks that are plain `.py` files (git-diffable). Use when a notebook must survive review, live in git, or drive an interactive picker; Jupyter still fine for throwaway scratch.

Rules:
- Real data comes from the canonical `red-cross-data` spine, never invented sets. Join on codes, display names.
- Correctness before speed: any benchmark or transform ships with a runnable self-check (an assert-based `--check` or a small `test_*.py`) proving the result, not just the timing.
- Winning pipeline for Red Cross data work: **DuckDB (ingest + SQL over Parquet/CSV) → Polars (transform) → GeoPandas (map)**.

## Continuity & Multi-Agent (mandatory)

Canonical policy: vault note `methods/claude-code-session-handoff.md`.

- **If it isn't in git, the vault, or the project handoff file, it doesn't exist.** Chat dies with the session.
- **Rewrite the project handoff/thread file after every commit or decision**, not just at session end — crashes give no warning.
- **Commit + push every phase.** For substantial builds keep a committed `docs/SPEC_VS_BUILT.md` (or plan/status) so any agent reads the same truth.
- **Two agents (Claude + Codex) on one repo: exactly ONE git owner at a time;** the other is read-only until handed control. Never present a stale doc as current — check its date vs the latest commit.



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
