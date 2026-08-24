# cv

Piotr Falkowski's CV, published at **https://pfalkowski.github.io/cv/** (Polish at `/cv/pl/`).

Astro static site. Two pages, no client-side framework, and the only JavaScript that ships is a
few inline lines that set the colour theme before first paint.

## Working on it

```bash
npm ci
npm run dev        # http://localhost:4321/cv/
npm run build      # locale check, then a static build into dist/
npm run preview    # serve dist/ exactly as it will be published
```

## Where the content lives

All of it is in `src/data/en.json` and `src/data/pl.json`. Editing a job, a project or a
conference means editing those two files and nothing else — the order of jobs is a list inside the
file, not an order hard-coded in a component.

`npm run check:locales` (which `npm run build` runs for you) fails the build when the two files
drift apart, when a job is defined but never listed in `order`, or when a markdown link is
malformed. A missing key can no longer render its own dotted key path into the page.

The one exception is `src/data/skills.js`, which holds the numbers behind the skill bars. The
`level` values are a self-assessment set by hand — deliberately independent of the year counts, so
"12 years, 50%" is a valid thing for a row to say. The years themselves derive from a `since` year
and never freeze; add `until` to close out a skill you no longer use.

## Layout

| Path | What lives there |
| --- | --- |
| `src/data/` | Content, one file per locale, plus the skill bar numbers. |
| `src/lib/` | Locale lookup with an English fallback, and the inline-link parser. |
| `src/components/` | One component per section. |
| `src/layouts/Cv.astro` | Page shell: head metadata, theme bootstrap, section order. |
| `src/pages/` | `index.astro` is English, `pl/index.astro` is Polish. Both render the same layout. |
| `src/styles/cv.css` | The whole stylesheet, including dark mode tokens and print rules. |
| `scripts/check-locales.mjs` | The locale drift check. |
| `.github/workflows/deploy.yml` | Builds on every push and pull request, publishes `main` to `gh-pages`. |

## Deployment

Pushing to `main` builds the site and force-pushes `dist/` to the `gh-pages` branch, which is what
GitHub Pages serves. Pull requests build but do not deploy. There is no manual publish step and no
`gh-pages` npm package involved.

## Print

The page is meant to print. `@media print` forces the light palette regardless of the reader's
theme, hides the controls, and keeps sections and jobs from
splitting across pages.
