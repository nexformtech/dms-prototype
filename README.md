# Deeksha Model School, Jaipur — Prototype Website (v2)

A clean, warm, photo-first **6-page prototype website** for Deeksha Model School — an exclusive
foundational school in Jaipur (Playgroup → Grade 3, since 1999).

**v2 redesign** (this version): calmer, more readable UX replacing the earlier sticker/crayon look —
real school photographs + real logo, soft surfaces, clear hierarchy, and a palette sampled from the
school's own identity (logo indigo + Anant-Vijay red + uniform yellow).

Served in this workspace at `http://localhost:8000` (see live-preview panel).
Research notes & sources: [`RESEARCH.md`](RESEARCH.md).

## Run it

```bash
cd deeksha-model-school
python3 -m http.server 8000 --bind 0.0.0.0     # or any static host / double-click index.html
```

No build step, no framework — pure HTML + CSS + vanilla JS.

## Pages

| Page | Highlights |
|---|---|
| `index.html` | Utility topbar, photo hero (real classroom photo + logo badge), 9 official "advantages", stats band, 6 programme cards, why-Deeksha split, real-photo teaser, parent testimonials, CTA |
| `about.html` | Story since 1999, mission/vision/motto, values, people (role cards), parent-partnership, real PTM photo + illustration pair |
| `programs.html` | Playgroup → Grade 3 detail cards, NEP/NIPUN learning-area pills, "A day at Deeksha" timeline |
| `admissions.html` | 4-step process, age table, documents, fee note, validated enquiry form, 8 FAQs |
| `gallery.html` | **12 original school photographs** (© @dmsjaipur) in a filterable masonry + lightbox, plus an "illustration corner" of storybook art |
| `contact.html` | Contact cards, stylised SVG locality map + Google Maps link, message form, socials |

## Images — originals + illustrations, as requested

- `assets/img/real/web/` — **original photographs & the official logo** downloaded from the
  school's public Instagram (@dmsjaipur), optimised (~1.9 MB total), credited in-page & in footer.
- `assets/img/*.jpg` — AI storybook illustrations kept as playful accents (hero CTA art,
  illustration corner, programme page art).

## Design system (v2)

- Palette from the school's identity: indigo `#1E2A78`, Anant-Vijay red `#B32020`,
  uniform yellow `#FFC93C`, warm paper `#FBF8F1`; hairline borders + soft shadows (no heavy outlines)
- Type: **Fredoka** display + **Nunito Sans** body (system-font fallbacks if Google Fonts unreachable)
- Components: topbar, sticky blurred header, photo hero, advantage tiles, stat band, colour-coded
  programme cards, check lists, timeline, quote cards, masonry gallery, lightbox, accordion, forms
  with inline validation, CTA bands, deep-indigo footer

## Small screens & cross-browser

- Mobile-first; tested structure down to **320 px**: hamburger dropdown nav, stacked hero,
  1-column cards, 1-column masonry, full-width buttons (≥48 px touch targets), scroll-snap
  testimonial row, horizontally scrollable tables, sticky call-FAB
- Fluid `clamp()` typography; `overflow-x` guarded; `prefers-reduced-motion` respected
- Works in current Chrome, Edge, Firefox, Safari (desktop + mobile); content readable without JS;
  keyboard support: skip-link, focus rings, lightbox ← → / Esc, ARIA labels throughout

## Prototype wiring (replace in production)

- Forms are client-side only (success card, nothing sent) — connect to email/WhatsApp/backend
- People cards, timetable, age cut-offs, hours are indicative (see RESEARCH.md §6)
- Map is a stylised SVG — optionally swap in a live Google Maps embed
- Instagram photos are hot-saved locally with attribution; confirm licence with the school before launch
