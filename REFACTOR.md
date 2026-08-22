# CV page — refactor and improvement plan

Written 22 August 2026, after the content sync in `cv-content-sync`. Nothing here has been
implemented. Content and structure were deliberately kept separate, so this document covers only
structure, tooling and presentation.

The page today is a single 300-line `src/App.js` that defines every component inside the `App`
function body, two locale JSON files, one 362-line `src/App.css`, and a Create React App
toolchain that is no longer maintained upstream. It works. The items below are ordered by what
they cost you if left alone, not by how interesting they are to do.

---

## Tier 1 — things that are broken right now

These are defects, not preferences. Each was confirmed by running the command, not by reading the
code.

### 1.1 `npm run deploy` cannot work from a clean checkout

`package.json` declares `"deploy": "gh-pages -d build"`, but `gh-pages` appears in neither
`dependencies` nor `devDependencies`. After `npm ci`, `node_modules/gh-pages` does not exist. The
deploy only ever succeeds on a machine where the package happens to be installed globally or
left over from an earlier install.

**Fix:** add `gh-pages` to `devDependencies`, or drop the script and deploy from CI (see 1.3).

### 1.2 The test suite fails

`src/App.test.js` is the untouched Create React App sample. It asserts on the text "learn react",
which this page has never contained, and it imports `@testing-library/react`, which is not a
declared dependency. `npx react-scripts test --watchAll=false` reports `FAIL src/App.test.js`
with `Tests: 0 total` — the file cannot even load.

**Fix:** delete the file, or add `@testing-library/react` plus `@testing-library/jest-dom` and
replace the body with a real assertion. A single smoke test that renders `App` and checks that
the current employer's name is on the page would have caught every content bug fixed in the last
change.

### 1.3 There is no CI and no deploy automation

`.github/` does not exist in this repository. Every publish is a manual `npm run deploy` from a
laptop, and nothing checks that `main` builds.

**Fix:** one GitHub Actions workflow — `npm ci`, `npm run build`, `npm test`, then publish
`build/` to the `gh-pages` branch on push to `main`. The blog repository already does exactly
this shape for Azure Static Web Apps and can be copied.

### 1.4 Three `.bak` files are committed

`package.json.bak`, `src/App.css.bak`, `src/App.js.bak` are tracked in git. Git already stores
history; these are snapshots of an older version that will drift and confuse.

**Fix:** `git rm` all three and add `*.bak` to `.gitignore`.

### 1.5 Two declared dependencies are never imported

`lucide-react` and `@fortawesome/fontawesome-svg-core` do not appear anywhere under `src/`.
`cra-template` is a scaffolding package that has no runtime role. `tailwindcss` is a
devDependency with a `tailwind.config.js` whose `content` array is empty and no `@tailwind`
directive in any stylesheet — it does nothing at all.

**Fix:** remove all four. That is roughly 40 MB of `node_modules` and four fewer things to keep
patched.

### 1.6 Icons come from a third-party CDN

`public/index.html` loads Font Awesome from `cdnjs.cloudflare.com`. If cdnjs is slow, blocked, or
gone, the contact icons vanish. It is also an uncontrolled third party seeing every visit to your
CV — including visits from recruiters, which is exactly the audience whose requests you would
rather not leak.

**Fix:** the page uses six icons. Inline them as SVG, or install `@fortawesome/react-fontawesome`
(the core package you are already paying for in `package.json`) and bundle only those six. This
also removes a render-blocking external stylesheet.

---

## Tier 2 — the structural refactor

### 2.1 Split `App.js`

Every component — `Section`, `WorkExperience`, `ContactInfo`, `TechnicalSkills`, `SoftSkills`,
`Education`, `Languages`, `Conferences`, `AdditionalInfo`, `OtherProjects`, `ConsentSection`,
`SidebarSection`, `AboutMeSection` — is declared inside the body of `App`. React treats a function
declared during render as a brand-new component type on every render, so toggling the language
unmounts and remounts the entire page rather than updating it. Nothing visible breaks today
because the page holds no local state below `App`, but the moment any child does — a collapsed
section, a print toggle, a focused field — that state will silently reset.

**Proposed layout:**

```
src/
  App.js                    // composition only: provider + section order
  i18n/
    LanguageContext.js      // context, provider, useTranslation, useTranslationWithMarkdown
    Markdown.js             // parseMarkdownLinks
    locales/en.json
    locales/pl.json
  components/
    Section.jsx
    Sidebar.jsx
    ContactInfo.jsx
    TechnicalSkills.jsx
    WorkExperience.jsx
    OtherProjects.jsx
    SimpleList.jsx          // replaces SoftSkills, Languages, Conferences, AdditionalInfo
```

`SoftSkills`, `Languages`, `Conferences` and `AdditionalInfo` are the same component four times:
a heading and a list of translated strings. One `SimpleList` taking a section id and a key list
removes about 40 lines.

### 2.2 Drive work experience and projects from data, not from JSX

`WorkExperience` hard-codes seven blocks that differ only by a key. Adding the two jobs in the
last change meant editing JSX as well as JSON, in two places, in the right order. That is the
kind of edit that silently drops an entry.

**Proposed:** put the order in the locale file as an array of ids, and map over it.

```json
"workExperience": {
  "order": ["stonex", "happyteam", "smh", "ju", "opengi", "transactor", "igexao"],
  "stonex": { "title": "...", "period": "...", "description": "..." }
}
```

The same applies to `OtherProjects`, where each project paragraph and each NuGet list item is
spelled out by hand.

### 2.3 Make missing translation keys loud

`useTranslation` ends with `|| id`, so a typo or a key present in `en.json` but missing from
`pl.json` renders the dotted key path into the page as body text. Nothing fails; the CV just says
`otherProjects.falsegrene` to whoever is reading it.

**Proposed:** in development, `console.error` and render a visible marker. In production, keep a
graceful fallback but never render the raw key — fall back to English.

Pair this with a build-time check that the two locale files have identical key sets. That check
is about fifteen lines of Node and catches the whole class of bug.

### 2.4 Fix the markdown link parser

`parseMarkdownLinks` calls `String.prototype.replace` purely for its side effects and discards
the result, pushing into a closure array as it goes. It works, but it will throw if handed an
array (as `softSkills.list` is), and its `key={url}` breaks if one paragraph ever links the same
URL twice. Rewrite it with `matchAll`, key by index, and return the string untouched if the input
is not a string.

### 2.5 Persist and detect the language

The language resets to English on every load. A Polish recruiter has to click the flag every
time. Read `navigator.language` on first visit, remember the choice in `localStorage`, and set
`document.documentElement.lang` so screen readers and Google both get it right.

---

## Tier 3 — presentation and reach

### 3.1 Dark mode

The blog now has it; the CV does not. Same approach applies and is worth reusing rather than
reinventing: define the light palette as custom properties on bare `:root`, redefine them under
`@media (prefers-color-scheme: dark)` guarded so an explicit choice can override, and again under
an explicit `[data-theme="dark"]` attribute. Force light in the existing `@media print` block so
printing is unaffected. `src/App.css` currently hard-codes colours inline throughout, so this is
mostly a matter of extracting them into tokens first.

### 3.2 Accessibility

Concrete, checkable items:

- The language switcher is a `div` with an `onClick`. It cannot be reached by keyboard and is not
  announced. It should be two `<button>`s, or a `role="radiogroup"`, with visible focus.
- The flags carry no text label. A flag is not a language name; use `aria-label="Polski"`.
- The skill bars are decorative `div`s. Either give them `role="meter"` with proper `aria-valuenow`
  and `aria-valuetext`, or mark them `aria-hidden` and let the "12 years" text carry the meaning.
- Run an audit and fix contrast on the muted greys.

### 3.3 The skill bars overstate precision

`level: Math.min(yearsSinceX * 10, 100)` says "C# 12 years, 100%" and "SQL + EF 5 years, 50%".
The percentages are not measurements of anything; they are years times ten, and they will quietly
imply that your SQL is half as good as your C# forever. Two honest options: drop the bars and
keep the years, or replace the numbers with named bands (core / working / familiar) that you set
by hand.

Related: `ASP.NET Web API` and `WPF in MVVM` have hard-coded year counts that stopped advancing
in whichever year they were typed. Anything expressed as "N years" should be derived from a start
year, or it becomes wrong by sitting still.

### 3.4 SEO and sharing

`public/index.html` has a title and a one-line description and nothing else. Add Open Graph and
Twitter card tags, a canonical URL, and a `Person` JSON-LD block with `sameAs` pointing at
GitHub, LinkedIn, Stack Overflow and NuGet. A CV link pasted into Slack or LinkedIn currently
previews as a bare URL.

There is a second consideration: the page renders entirely client-side, so the HTML served to a
crawler contains an empty `<div id="root">`. Google executes JavaScript; most preview bots and
several ATS scrapers do not.

### 3.5 The email and phone are images

`ContactInfo` renders `phone.png` and `email.png` — presumably to defeat scrapers. The cost is
that they are invisible to search, to screen readers (both have `alt=""`), and to anyone who
wants to copy the address. If the anti-scraping intent still matters, keep the images but add
real `alt` text and a `mailto:` link behind them. If it no longer matters, use text.

### 3.6 Consider whether Create React App is still the right base

`react-scripts` is unmaintained, warns about `@babel/plugin-proposal-private-property-in-object`
on every build, and pulls 1328 packages to render what is fundamentally a static document. The
browserslist database is 19 months stale.

Two credible directions:

- **Vite + React.** A mechanical migration, an afternoon's work, keeps every component as-is,
  cuts install size and build time substantially.
- **Astro.** Bigger change, but this page is a static document with one interactive control. Astro
  ships zero JavaScript by default, fixes 3.4's crawler problem outright, and you now have a
  working Astro setup in the blog repository to copy patterns from.

Astro is the better end state; Vite is the better next step if you would rather not rewrite the
markup twice.

---

## Suggested order

1. Tier 1 in one pass — the defects are independent, small, and each is a few lines.
2. CI (1.3) immediately after, so everything below is protected by a build.
3. Tier 2.1 through 2.3, which is the actual refactor.
4. Dark mode (3.1) and accessibility (3.2).
5. Decide on 3.6 last, once the components are small enough that moving them is cheap.

The one item worth doing out of order is the locale key-parity check in 2.3. It is fifteen lines
and it protects every future content edit.
