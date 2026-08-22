/**
 * Smoke test against the built HTML.
 *
 * The React version's only test was the Create React App sample, asserting on
 * the words "learn react" — it failed to even load, and had never checked
 * anything about this CV. These assertions are small but they are about the
 * page that actually ships, and every one of them corresponds to a bug that has
 * really happened here.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const failures = [];

function check(condition, message) {
	if (!condition) failures.push(message);
}

check(existsSync(DIST), 'dist/ does not exist — run the build first');
if (!existsSync(DIST)) {
	console.error(failures[0]);
	process.exit(1);
}

const PAGES = [
	{ path: join(DIST, 'index.html'), lang: 'en', mustContain: ['StoneX', 'False Green', 'stock-today.com'] },
	{ path: join(DIST, 'pl', 'index.html'), lang: 'pl', mustContain: ['StoneX', 'False Green', 'stock-today.com'] },
];

for (const page of PAGES) {
	if (!existsSync(page.path)) {
		failures.push(`${page.lang}: ${page.path} was not generated`);
		continue;
	}

	const html = readFileSync(page.path, 'utf8');
	const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');

	check(html.includes(`<html lang="${page.lang}"`), `${page.lang}: html element does not declare lang`);
	check(/rel="canonical"/.test(html), `${page.lang}: no canonical link`);
	check(/application\/ld\+json/.test(html), `${page.lang}: no JSON-LD block`);

	for (const needle of page.mustContain) {
		check(html.includes(needle), `${page.lang}: expected to find "${needle}"`);
	}

	// Unparsed markdown links used to reach the page as literal [text](url).
	check(!/\[[^\]]+\]\(/.test(text), `${page.lang}: unparsed markdown link in the rendered text`);

	// A missing translation key used to render its own dotted path as body text.
	check(!/\b[a-z]+\.[a-z][A-Za-z]+\.[A-Za-z]+\b(?![^<]*<\/a>)/.test(text.replace(/\S+@\S+|\S+\.(com|dev|pl|org|net|io)\b/g, '')),
		`${page.lang}: something that looks like a raw translation key is in the text`);

	// The literal "/n" once shipped inside a job description.
	check(!/\/n[A-Z ]/.test(text), `${page.lang}: literal "/n" in the rendered text`);
}

// No client-side framework should ship. Inline theme scripts are fine.
const astroDir = join(DIST, '_astro');
const jsFiles = existsSync(astroDir) ? readdirSync(astroDir).filter((f) => f.endsWith('.js')) : [];
check(jsFiles.length === 0, `expected no JavaScript bundles, found: ${jsFiles.join(', ')}`);

if (failures.length) {
	console.error('Build check failed:');
	for (const failure of failures) console.error(`  - ${failure}`);
	process.exit(1);
}

console.log(`Build check passed (${PAGES.length} pages, 0 JS bundles).`);
