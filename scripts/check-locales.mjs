/**
 * Fails the build when the locale files drift apart.
 *
 * The React version rendered the dotted key path into the page when a key was
 * missing, so a typo shipped as body text on a CV. This catches that class of
 * bug before a build exists, and also catches unparsed markdown links and the
 * literal "/n" that once rendered inside a job description.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const REFERENCE = 'en';

const locales = Object.fromEntries(
	readdirSync(DATA_DIR)
		.filter((name) => name.endsWith('.json'))
		.map((name) => [name.replace(/\.json$/, ''), JSON.parse(readFileSync(join(DATA_DIR, name), 'utf8'))])
);

/** Every leaf path, with array indices collapsed so list lengths may differ. */
function shape(node, path = '', out = new Set()) {
	if (Array.isArray(node)) {
		node.forEach((item) => shape(item, `${path}[]`, out));
	} else if (node && typeof node === 'object') {
		for (const [key, value] of Object.entries(node)) {
			shape(value, path ? `${path}.${key}` : key, out);
		}
	} else {
		out.add(path);
	}
	return out;
}

function strings(node, path = '', out = []) {
	if (Array.isArray(node)) {
		node.forEach((item, i) => strings(item, `${path}[${i}]`, out));
	} else if (node && typeof node === 'object') {
		for (const [key, value] of Object.entries(node)) {
			strings(value, path ? `${path}.${key}` : key, out);
		}
	} else if (typeof node === 'string') {
		out.push([path, node]);
	}
	return out;
}

const problems = [];
const reference = shape(locales[REFERENCE]);

for (const [lang, dict] of Object.entries(locales)) {
	if (lang !== REFERENCE) {
		const own = shape(dict);
		for (const key of reference) if (!own.has(key)) problems.push(`${lang}: missing "${key}"`);
		for (const key of own) if (!reference.has(key)) problems.push(`${lang}: unexpected "${key}"`);
	}

	for (const [path, value] of strings(dict)) {
		if (/\/n[A-Z ]/.test(value)) problems.push(`${lang}: literal "/n" in ${path}`);
		if (/\]\(\s/.test(value)) problems.push(`${lang}: malformed link in ${path}`);
	}
}

// The work experience order list has to name real entries, and name all of them.
for (const [lang, dict] of Object.entries(locales)) {
	const order = dict.workExperience?.order ?? [];
	const items = Object.keys(dict.workExperience?.items ?? {});
	for (const id of order) if (!items.includes(id)) problems.push(`${lang}: order names unknown job "${id}"`);
	for (const id of items) if (!order.includes(id)) problems.push(`${lang}: job "${id}" is never rendered`);
}

if (problems.length) {
	console.error('Locale check failed:');
	for (const problem of problems) console.error(`  - ${problem}`);
	process.exit(1);
}

console.log(`Locale check passed (${Object.keys(locales).join(', ')}).`);
