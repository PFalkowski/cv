/**
 * Technical skill bars.
 *
 * There is exactly one number per skill: when it started. Everything the page
 * shows is derived from it.
 *
 * The React version drew the bar from `level`, which was `years * 10` — an
 * arithmetic accident wearing the costume of a self-assessment. The migration
 * kept those values by hand so nothing moved visually, and that turned out to
 * be worse: once the year counts were corrected, the bars still reflected the
 * old, wrong years. ASP.NET Web API and SQL + EF both read "12 years" while
 * drawing bars of 60% and 50%.
 *
 * So the bar is now a picture of the years and nothing else. It cannot
 * disagree with the number printed beside it, and there is no hidden opinion
 * to keep up to date. `until` closes a skill that is no longer current;
 * without it the count runs to the build year, so nothing freezes.
 *
 * `id` keys into the `skills` object in each locale file.
 */

/** @typedef {{id: string, since: number, until?: number}} Skill */

/** @type {Skill[]} */
export const SKILLS = [
	{ id: 'csharp', since: 2014 },
	{ id: 'azure', since: 2017 },
	{ id: 'webapi', since: 2014 },
	{ id: 'sqlEf', since: 2014 },
	{ id: 'nosql', since: 2018 },
	{ id: 'wpf', since: 2014, until: 2019 },
	{ id: 'ml', since: 2018 },
	{ id: 'ai', since: 2023 },
];

/**
 * Resolve a skill's year count against a fixed "now", so the number is decided
 * at build time and every page of a given build agrees.
 *
 * @param {Skill} skill
 * @param {number} currentYear
 * @returns {number}
 */
export function yearsOf(skill, currentYear) {
	if (typeof skill.since !== 'number') return 0;
	return (skill.until ?? currentYear) - skill.since;
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
