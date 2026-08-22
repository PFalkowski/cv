# CV page — refactor status

The plan in this file was written on 22 August 2026 and executed the same day. This is what it
covered and what actually happened. Anything still marked open is a decision waiting on Piotr, not
work that was skipped.

## Tier 1 — defects

| Item | Status |
| --- | --- |
| `npm run deploy` called `gh-pages`, an undeclared dependency | **Done.** The script is gone. `.github/workflows/deploy.yml` builds and publishes to the `gh-pages` branch with no npm package involved. |
| `src/App.test.js` was the CRA sample, asserting on "learn react", importing a package that was not installed — `FAIL`, `Tests: 0 total` | **Done.** Deleted, and replaced with two checks that assert things about this CV: `scripts/check-locales.mjs` and `scripts/check-build.mjs`. Both were verified to fail when deliberately given bad input. |
| No CI, no automated deploy | **Done.** Builds on every push and pull request; `main` deploys. |
| `package.json.bak`, `src/App.css.bak`, `src/App.js.bak` tracked in git | **Done.** Removed, and `*.bak` is in `.gitignore`. |
| `lucide-react`, `@fortawesome/fontawesome-svg-core`, `cra-template`, `tailwindcss` declared and unused | **Done.** The whole dependency tree is now one package. `npm ci` went from 1328 packages to 179. |
| Font Awesome loaded from cdnjs | **Done.** Six inline SVG paths in `src/components/Icon.astro`. |

Two more defects turned up while doing the work and were fixed at the same time:

- **The print stylesheet targeted ids that did not exist.** It styled `#soft-skills` and
  `#conferences`; the real ids were `softSkills` and `conferencesSection`. Its soft-skill and
  conference rules had never applied to anything. There is now a check that every selector in the
  print block matches a real element.
- **`font-family: 'Montserrat'` was set but Montserrat was never loaded** — no `@import`, no
  `<link>`. The page had always rendered in the browser's generic sans-serif. Replaced with a real
  system stack.

## Tier 2 — structure

All done, by rebuilding on Astro rather than by refactoring the React in place.

- Components no longer live inside a function body. One file per section under `src/components/`.
- Work experience and projects are driven by data. Job order is a list in the locale file; adding a
  job is a one-file edit that cannot silently drop an entry, because `check-locales` fails when a
  defined job is not in `order`.
- `useTranslation`'s `|| id` fallback is gone. `src/lib/i18n.js` falls back to English and warns;
  a key missing from every locale throws at build time.
- The markdown link parser was rewritten with `matchAll`. It no longer throws on non-string input
  and no longer produces duplicate keys when one paragraph links the same URL twice.
- Language is no longer client state that resets on every load. English and Polish are separate
  static pages at `/cv/` and `/cv/pl/`, cross-linked with `hreflang`.

## Tier 3 — presentation

| Item | Status |
| --- | --- |
| Dark mode | **Done.** Three-state tokens, pre-paint bootstrap, no flash. |
| Print forced light | **Done**, and one defect found doing it: `:root[data-theme='dark']` (0,1,1) outranks a bare `:root` (0,0,1), so a reader who had chosen dark mode would have printed the dark palette onto paper. The print block now matches that specificity. |
| Language switcher keyboard access | **Done.** Two real links with `aria-current`, not `div`s with click handlers. |
| Flags replaced with language names | **Done.** Also removes flagcdn.com, a third external host. |
| Skill bars marked up honestly | **Partly.** They are `role="meter"` with `aria-valuetext` now, and the level is a number you set rather than `years × 10`. **The numbers themselves still need your judgement** — see below. |
| SEO and sharing | **Done.** Open Graph, Twitter card, canonical, `hreflang`, and a `Person` JSON-LD block with `sameAs`. The crawler problem is gone outright: the HTML now contains the CV instead of an empty `<div id="root">`. |
| Email and phone as images | **Kept as images, with alt text.** The alt text repeats exactly what the image shows, `[at]` and `[six]` substitutions included, so a screen reader user is no worse off and nothing new is exposed to a scraper. |
| Create React App | **Replaced with Astro.** Zero JavaScript bundles ship; the only script on the page is the inline theme bootstrap. |

## Decisions taken

1. **The skill bar levels stay as they are.** `src/data/skills.js` holds them as plain numbers
   rather than `years × 10`. The values still happen to match what the old formula rendered on
   migration day, but that is now a reviewed choice rather than an arithmetic side effect. Note
   that level and years are deliberately independent: SQL + EF reads "12 years, 50%", and that is
   the honest shape of a self-assessment.

2. **All year counts now derive from a start year.** Nothing freezes any more. `webapi` and
   `sqlEf` start in 2014 with Transactor; `wpf` runs 2014 to 2019, so it is closed with `until`
   and stays at five years for good. Everything else runs to the build year.

## Still open

**The GitHub activity chart** is the one remaining external asset — `ghchart.rshah.org`. It is the
same class of third-party dependency as the Font Awesome CDN that was removed. It only affects one
decorative image, so it stayed, but it is a choice rather than an oversight.
