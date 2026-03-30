# Behavio – Typography (Dashboard & handoff)

Mobile-first type scale and tokens for iOS/Android. Keeps the warm Behavio brand with clear hierarchy and contrast. For the North Star color palette (canvas, text, accent, tabs, orb gradient), see [PALETTE.md](./PALETTE.md).

---

## Type scale

| Style        | Use case              | Size  | Weight | Line height | Letter-spacing | Font   |
|-------------|------------------------|-------|--------|-------------|----------------|--------|
| **H1 / Serif** | Hero greeting only     | 28px  | 600    | 120%        | —              | Playfair Display |
| **H2 / Sans**  | Section headers (e.g. “TODAY’S FOCUS”) | 18px | 600 | normal | +2% (0.02em) | Inter |
| **Card title** | “Daily Brief”, “My Plan” | 16px | 600 | tight | — | Inter |
| **Body**       | Body copy              | 15px  | 400    | relaxed     | —              | Inter |
| **Caption**    | Badge, day abbreviations, micro | 12px | 500 | normal | — | Inter |
| **All-caps micro** | “TODAY’S FOCUS”, nav labels | 12px | 500 | normal | +4% (0.04em) | Inter |

---

## Font pairing

- **H1 only:** Playfair Display (serif). Fallback: `Georgia, serif`.
- **All other UI:** Inter. Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- No serif on small sizes (readability).

---

## CSS variables (globals.css)

```css
/* Text colors (contrast) */
--text-primary: #2C1B13;   /* min 7:1 on beige */
--text-secondary: #6E5849; /* 4.5:1 */

/* Type scale */
--type-h1-size: 28px;
--type-h1-weight: 600;
--type-h1-line: 1.2;
--type-h2-size: 18px;
--type-h2-weight: 600;
--type-h2-tracking: 0.02em;
--type-card-title-size: 16px;
--type-card-title-weight: 600;
--type-body-size: 15px;
--type-body-weight: 400;
--type-caption-size: 12px;
--type-caption-weight: 500;
--type-caps-tracking: 0.04em;
```

---

## Utility classes

- **`.type-h1`** – Hero greeting (serif, 28px, 600, 120%)
- **`.type-h2`** – Section headers (18px, 600, +2% tracking)
- **`.type-card-title`** – Card titles (16px, 600)
- **`.type-body`** – Body (15px, 400)
- **`.type-caption`** – Micro/caption (12px, 500)
- **`.type-caps-micro`** – All-caps micro (+4% tracking, secondary color)

---

## Spacing & alignment

- **Baseline:** 24px between typography blocks (`gap-6`).
- **Hero:** Greeting and badge on same baseline; badge has 12px right padding (`pr-3`).
- **Day selector:** 16px top/bottom padding on the label row (`py-4`).
- **Day labels:** 12px, bold, uppercase, centered below each pill.

---

## Color & contrast

- **Primary text:** `#2C1B13` (7:1 on `#FAF7F2`).
- **Secondary (microcopy, badge):** `#6E5849` (4.5:1).
- **CTA:** `#2C1B13` on white buttons; hover/active darken (e.g. `hover:bg-secondary`, `active:bg-border`).

---

## Interaction

- **“Tap to explore your identity”:** Underline on hover/focus/active.
- **CTA button:** Weight 500; subtext weight 400.

---

## Figma mapping

| Figma style   | Implementation   |
|---------------|------------------|
| H1 / Serif    | `.type-h1`       |
| H2 / Sans     | `.type-h2`       |
| Card Title    | `.type-card-title` |
| Body          | `.type-body`     |
| Caption       | `.type-caption` or `.type-caps-micro` |
