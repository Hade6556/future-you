# Future Me – North Star – Midnight palette

Design variables for the North Star – Midnight aesthetic. All tokens are defined as CSS custom properties in `src/app/globals.css` and exposed to Tailwind via `@theme inline`.

---

## Canvas & surfaces

| Token | Hex | Use |
|-------|-----|-----|
| `--canvas-base` | `#F7EEE3` | Primary background (body, screens) |
| `--canvas-frame` | `#0A1C2F` | Midnight outer chrome / device frame |
| `--card-surface` | `#FFFFFF` | Cards, sheets, modals |
| `--card-stroke` | `#EADCCF` | Card borders, dividers, inputs |

---

## Text

| Token | Hex | Use |
|-------|-----|-----|
| `--text-primary` | `#2C1B13` | Headings, body, primary copy |
| `--text-secondary` | `#6E594A` | Secondary copy, microcopy |
| `--text-muted` | `#A08C7D` | Muted labels, placeholders |

---

## Badges & chips

| Token | Hex | Use |
|-------|-----|-----|
| `--badge-bg` | `#F1DDC7` | Badge/chip background |
| `--badge-text` | `#5B483B` | Badge text |

---

## Accent & actions

| Token | Hex | Use |
|-------|-----|-----|
| `--accent-primary` | `#1E4E7B` | Primary buttons, links, progress |
| `--accent-primary-hover` | `#173D61` | Primary button hover/press |
| `--accent-secondary` | `#A3C1E9` | Lighter chips, secondary buttons |
| `--accent-cool` | `#5078A0` | Celestial highlights, badges, chart deltas |
| `--accent-success` | `#7FBF84` | Success states, charts |

---

## Alerts & feedback

| Token | Hex | Use |
|-------|-----|-----|
| `--alert-bg` | `#BF4D42` | Destructive/alert background |

---

## Calendar / day pills

| Token | Hex | Use |
|-------|-----|-----|
| `--day-inactive` | `#EBDCCC` | Inactive day background |
| `--day-active-text` | `#FFFFFF` | Active day text, primary button text |

---

## Outline & tabs

| Token | Hex | Use |
|-------|-----|-----|
| `--outline` | `#DBBEA6` | Focus rings, outlines |
| `--tab-bg` | `#13253F` | Bottom nav (midnight) |
| `--tab-icon-inactive` | `#9FB4C8` | Inactive tab icon/label |
| `--tab-icon-active` | `#FCEFE0` | Active tab icon/label |

---

## Orb gradient

Used for hero orb, ambition map orbs, and CTA glows (midnight blue blend).

| Token | Hex | Use |
|-------|-----|-----|
| `--orb-gradient-start` | `#89B0D8` | Light end of gradient |
| `--orb-gradient-end` | `#1F4E82` | Dark end of gradient |

**CSS example:**  
`radial-gradient(ellipse 70% 70% at 35% 30%, var(--orb-gradient-start), var(--orb-gradient-end) 85%)`

---

## Legacy mapping

The following globals are aliased to the North Star tokens for compatibility with existing components and shadcn:

- `--background` → `--canvas-base`
- `--primary` → `--accent-primary`
- `--border` → `--card-stroke`
- `--nav-bg` → `--tab-bg`
- `--destructive` → `--alert-bg`
- `--chip-bg` → `--badge-bg`
- `--muted-foreground` → `--text-muted`
- etc. (see `globals.css` :root)

---

## Usage in components

- **Buttons:** Use `bg-primary`, `hover:bg-primary-hover`, `text-primary-foreground`.
- **Pills/badges:** Use `bg-chip-bg` (badge.bg), `text-text-secondary` or `badge-text` for label.
- **Tabs (nav):** Use `bg-nav-bg`, `text-tab-icon-active` / `text-tab-icon-inactive`.
- **Alerts:** Use `bg-destructive` (alert.bg).
- **Charts:** Use `--chart-1` through `--chart-6` (chart-6 = accent-cool for deltas/celestial).
- **Highlights / deltas:** Use `text-accent-cool` or `--accent-cool` for badges and chart deltas.
- **Shell / frame:** Use `--canvas-frame` or `bg-canvas-frame` for midnight chrome; `--tab-bg` for nav.
- **Gradients (orbs, hero, CTA glow):** Use `var(--orb-gradient-start)` and `var(--orb-gradient-end)`.
