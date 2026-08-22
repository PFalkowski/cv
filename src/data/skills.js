/**
 * Technical skill bars.
 *
 * Each skill is a list of periods it was actually used in. Everything shown —
 * the year count and the bar length — is derived from that list, so there is
 * one place to edit and nothing that can drift out of agreement with itself.
 *
 * Why periods rather than a single start year: real experience has gaps. SQL
 * ran through Transactor and Open GI, went quiet through the CosmosDB years at
 * Seville More Helory, and came back at StoneX. A single `since: 2014` would
 * count the quiet stretch and overstate; a hand-typed `years: 6` would be right
 * today and wrong next year. A list of periods is true at both ends.
 *
 * An open period — `null` as the end — runs to the build year, so current
 * skills advance on their own and nothing freezes.
 *
 * `id` keys into the `skills` object in each locale file.
 */

/** @typedef {[number, number | null]} Period */
/** @typedef {{id: string, periods: Period[]}} Skill */

/** @type {Skill[]} */
export const SKILLS = [
	{ id: 'csharp', periods: [[2014, null]] },
	{ id: 'azure', periods: [[2017, null]] },
	// Web API and Core counted together: Transactor and Open GI, then Seville
	// More Helory and StoneX. The gap is the 2019-2020 research year.
	{ id: 'aspnet', periods: [[2014, 2019], [2020, null]] },
	// Transactor and Open GI, then quiet through the CosmosDB years, then StoneX.
	{ id: 'sqlEf', periods: [[2014, 2019], [2025, null]] },
	{ id: 'nosql', periods: [[2018, null]] },
	{ id: 'wpf', periods: [[2014, 2019]] },
	{ id: 'ml', periods: [[2018, null]] },
	{ id: 'ai', periods: [[2023, null]] },
];

/**
 * Sum a skill's periods, merging any that overlap so shared years are counted
 * once. Without the merge, two periods describing the same stretch of work
 * would quietly double it.
 *
 * @param {Skill} skill
 * @param {number} currentYear
 * @returns {number}
 */
export function yearsOf(skill, currentYear) {
	const spans = skill.periods
		.map(([from, to]) => [from, to ?? currentYear])
		.filter(([from, to]) => to > from)
		.sort((a, b) => a[0] - b[0]);

	let total = 0;
	let open = null;

	for (const [from, to] of spans) {
		if (open && from <= open[1]) {
			open[1] = Math.max(open[1], to);
			continue;
		}
		if (open) total += open[1] - open[0];
		open = [from, to];
	}
	if (open) total += open[1] - open[0];

	return total;
}

/**
 * Bar width as a percentage, scaled so the longest-running skill fills the bar.
 *
 * @param {Skill[]} skills
 * @param {number} currentYear
 * @returns {Array<{id: string, years: number, width: number}>}
 */
export function scaleSkills(skills, currentYear) {
	const years = skills.map((skill) => yearsOf(skill, currentYear));
	const longest = Math.max(...years, 1);
	return skills.map((skill, i) => ({
		id: skill.id,
		years: years[i],
		width: Math.round((years[i] / longest) * 100),
	}));
}
