/**
 * Technical skill bars.
 *
 * Two deliberate changes from the React version:
 *
 * 1. `level` used to be `years * 10`, which dressed an arithmetic accident up as
 *    a self-assessment. It is now a plain number you set by hand. The values
 *    below reproduce exactly what the old formula rendered on the day of the
 *    migration, so nothing moved visually — but they are yours to set now, and
 *    they should be reviewed.
 *
 * 2. Years now come from a start year wherever the work history documents one,
 *    so they advance on their own. The three entries carrying a literal `years`
 *    were hand-typed in the React version and are kept exactly as published
 *    rather than invented from a start year. Those three DO freeze, and are
 *    marked so you can find them.
 *
 * `id` keys into the `skills` object in each locale file.
 */

/** @typedef {{id: string, level: number, since?: number, until?: number, years?: number}} Skill */

/** @type {Skill[]} */
export const SKILLS = [
	{ id: 'csharp', level: 100, since: 2014 },
	{ id: 'azure', level: 90, since: 2017 },
	{ id: 'webapi', level: 60, years: 6 }, // hand-maintained, does not advance
	{ id: 'sqlEf', level: 50, years: 5 }, // hand-maintained, does not advance
	{ id: 'nosql', level: 80, since: 2018 },
	{ id: 'wpf', level: 40, years: 4 }, // hand-maintained, does not advance
	{ id: 'ml', level: 80, since: 2018 },
	{ id: 'ai', level: 30, since: 2023 },
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
	if (typeof skill.years === 'number') return skill.years;
	if (typeof skill.since !== 'number') return 0;
	return (skill.until ?? currentYear) - skill.since;
}
