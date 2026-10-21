# 🎨 StepQuest — Design System & Token Reference (`DESIGN_SYSTEM.md`)

---

## 1. Design Philosophy: Tactical Endurance Telemetry

StepQuest's visual language is modeled after **high-precision mountaineering instruments, aerospace cockpit telemetry, and tactical expedition navigation suites**. It rejects generic, pastel, or overly gamified aesthetics in favor of a focused, military-grade dark interface designed for clarity under bright sun, low-light trail conditions, and high-cadence walking.

---

## 2. Color Tokens (Stitch UI Dark Palette)

All colors are defined in `web/index.html` via the Tailwind theme extension and mapped in Android Compose via `Color.kt`.

### 2.1 Surfaces & Depths
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `surface-container-lowest` | `#0e0e11` | Background canvas, darkest ground plane |
| `surface` / `surface-dim` | `#131316` | Base component background |
| `surface-container-low` | `#1b1b1e` | Card surfaces, container cards |
| `surface-container` | `#1f1f22` | Interactive cards, input fields |
| `surface-container-high` | `#2a2a2d` | Hover states, elevated chips |
| `surface-container-highest`| `#353438` | Structural dividing borders, stroke lines |

### 2.2 Brand & Athletic Accents
| Token Name | Hex Code | Role / Usage |
| :--- | :--- | :--- |
| `primary-container` | `#f66018` | **Blaze Orange** — Primary call-to-action buttons, active navigation, gauge fill |
| `primary` | `#ffb599` | Highlighted values, target labels, active icons |
| `on-primary` | `#5a1c00` | High-contrast text on blaze orange backgrounds |
| `secondary` | `#62df7d` | **Trail Green** — Completed milestones, active sync pulse, goal achieved status |
| `secondary-container` | `#1ca64d` | Active toggle buttons, verified badges |
| `tertiary` | `#ffb95f` | **Mountain Gold** — High summit markers, locked challenges, elevation peaks |
| `tertiary-container` | `#ca8100` | Warning notifications, high-altitude pass alerts |
| `error` | `#ffb4ab` | Disconnect warning, validation failure |
| `error-container` | `#93000a` | Sign-out buttons, error alerts |

### 2.3 Typography & Outline Colors
| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| `on-surface` | `#e4e1e6` | Primary high-emphasis headers and metric numerals |
| `on-surface-variant` | `#e2bfb2` | Subheadings, card narrative descriptions |
| `outline` | `#a98a7e` | Sub-labels, table headers, unit symbols (`KM`, `KCAL`, `STEPS`) |
| `outline-variant` | `#5a4138` | Subtle card borders, inactive dividers |

---

## 3. Typography Scale & Fonts

StepQuest integrates Google Fonts optimized for legibility and metric alignment:
- **Display Headlines:** `Plus Jakarta Sans` (weights: 700, 800)
- **Body & UI Text:** `Inter` (weights: 400, 500, 600)
- **Telemetry Readouts:** Monospace / `JetBrains Mono` (`font-label-mono`)
- **Athletic Icons:** `Material Symbols Outlined` (variable axes: opsz 24, wght 400, FILL 0)

| Style Name | Font & Weight | Size / Line-Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `font-metric-display` | Plus Jakarta Sans 800 | `2.5rem` / `1` | `-0.025em` | Main pedometer step number |
| `font-metric-large` | Plus Jakarta Sans 800 | `1.75rem` / `1.1` | `-0.02em` | Card KPI numerals, quota percentage |
| `font-headline-lg` | Plus Jakarta Sans 800 | `1.5rem` / `1.2` | `-0.015em` | Page view titles ("Welcome Back, Arjun") |
| `font-headline-md` | Plus Jakarta Sans 700 | `1.25rem` / `1.3` | `-0.01em` | Route card expedition titles |
| `font-headline-sm` | Plus Jakarta Sans 700 | `1.0rem` / `1.4` | `0` | Milestone titles, modal headings |
| `font-label-mono` | Monospace 600 | `0.75rem` / `1.2` | `0.05em` | GPS coordinates, elevation, status pills |
| `font-label-md` | Inter 600 | `0.8125rem` / `1.2`| `0.025em` | Button labels, filter chips |
| `font-body-md` | Inter 400 | `0.875rem` / `1.5` | `0` | Narrative route descriptions |
| `font-body-sm` | Inter 400 | `0.75rem` / `1.4`  | `0` | Waypoint descriptions, micro-copy |

---

## 4. Reusable Component Patterns

### 4.1 Radial Pedometer Dial
- SVG viewBox: `0 0 160 160`, circle radius: `r="68"`.
- Circumference constant: `427.25px`.
- Progress dynamically applied via `stroke-dashoffset = circumference - (pct / 100) * circumference`.
- Transform: `-rotate-90` to start from 12 o'clock.

### 4.2 Expedition Route Card (`.route-card`)
- Container: `bg-surface-container-low border border-surface-container-highest rounded-lg p-space-lg`.
- Top: Category pill (e.g. `Hard // Himalayan`), elevation delta chip.
- Middle: Route headline, high-resolution trail photography banner, distance statistics.
- Bottom: Dual action buttons: **Route Spec** (secondary outline) and **Select Trek / Continue Quest** (blaze orange).

### 4.3 Topographic Waypoint Node
- Three visual states:
  1. `COMPLETED`: Green border (`border-secondary`), green fill dot, checkmark badge.
  2. `ACTIVE TARGET`: Blaze orange pulsing halo (`animate-pulse border-primary`), target elevation icon.
  3. `LOCKED`: Outline border (`border-surface-container-highest`), dim text (`text-outline`), padlock icon.

### 4.4 Modals & Flyout Sheets
- Backdrop: `fixed inset-0 z-50 bg-black/80 backdrop-blur-sm`.
- Container: `bg-surface-container-low border border-surface-container-highest rounded-lg shadow-2xl`.
- Global dismissal: clicking backdrop, close button, or pressing `Escape`.

### 4.5 Global Toast Notification (`#app-toast`)
- Fixed bottom-right: `fixed bottom-6 right-6 z-50`.
- Athletic styling: `bg-surface-container-high border border-primary-container font-label-mono text-xs uppercase`.
- Self-dismissing after 3.2 seconds.

---

## 5. UI Do's & Don'ts

| ✅ DO | ❌ DON'T |
| :--- | :--- |
| Use uppercase tracking (`tracking-wider`, `uppercase`) for labels and telemetry. | Don't use lowercase informal or handwritten fonts. |
| Use Material Symbols Outlined (`footprint`, `hiking`, `verified`). | Don't use emoji icons (`🏃`, `🔥`, `🏆`) in technical readouts. |
| Use tabular numerals (`tabular-nums`) for timers and step metrics to prevent layout jitter. | Don't use variable-width numerals for live counters. |
| Wrap interactive buttons with active scale micro-interactions (`active:scale-95`). | Don't create static, unresponsive buttons without hover/active feedback. |
