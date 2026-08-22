/**
 * The locale files carry inline links in markdown form: [text](url).
 *
 * The React version parsed these by calling String.replace purely for its side
 * effects and pushing into a closure array, which threw on non-string input and
 * produced duplicate React keys when one paragraph linked the same URL twice.
 * This returns a plain list of parts instead, and hands back a single text part
 * when there is nothing to parse.
 *
 * @param {unknown} value
 * @returns {Array<{type: 'text', value: string} | {type: 'link', text: string, url: string}>}
 */
export function parseInlineLinks(value) {
	if (typeof value !== 'string') return [];

	const parts = [];
	let cursor = 0;

	for (const match of value.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
		const index = match.index ?? 0;
		if (index > cursor) {
			parts.push({ type: 'text', value: value.slice(cursor, index) });
		}
		parts.push({ type: 'link', text: match[1], url: match[2] });
		cursor = index + match[0].length;
	}

	if (cursor < value.length) {
		parts.push({ type: 'text', value: value.slice(cursor) });
	}

	return parts;
}
