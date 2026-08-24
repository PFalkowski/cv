const CONTRIBUTIONS_URL =
	'https://github.com/PFalkowski?action=show&controller=profiles&tab=contributions&user_id=PFalkowski';
const DAY_TAG = /<td\b[^>]*class="ContributionCalendar-day"[^>]*>/g;
const TOOLTIP_TAG = /<tool-tip\b[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;

let contributionsPromise;

function attribute(tag, name) {
	return tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1] ?? null;
}

function textFromHtml(html) {
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function parseContributions(html) {
	const labels = new Map();
	for (const match of html.matchAll(TOOLTIP_TAG)) labels.set(match[1], textFromHtml(match[2]));

	const cells = [];
	for (const match of html.matchAll(DAY_TAG)) {
		const tag = match[0];
		const id = attribute(tag, 'id');
		const position = id?.match(/contribution-day-component-(\d+)-(\d+)/);
		const date = attribute(tag, 'data-date') ?? '';
		const level = Number(attribute(tag, 'data-level'));

		if (!position || !Number.isInteger(level)) continue;
		cells.push({
			row: Number(position[1]),
			column: Number(position[2]),
			date,
			level,
			label: labels.get(id) ?? date,
		});
	}

	if (cells.length < 365) throw new Error(`GitHub contribution calendar contained ${cells.length} days`);

	cells.sort((left, right) => left.row - right.row || left.column - right.column);
	return {
		cells,
		columns: Math.max(...cells.map((cell) => cell.column)) + 1,
	};
}

export function getGithubContributions() {
	contributionsPromise ??= fetch(CONTRIBUTIONS_URL, {
		headers: {
			Accept: 'text/html; fragment=1',
			'User-Agent': 'PFalkowski-CV',
			'X-Requested-With': 'XMLHttpRequest',
		},
		signal: AbortSignal.timeout(10000),
	}).then(async (response) => {
		if (!response.ok) throw new Error(`GitHub contribution request failed: ${response.status}`);
		return parseContributions(await response.text());
	});

	return contributionsPromise;
}
