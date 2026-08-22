/**
 * Technical skill bars.
 *
 * Two deliberate changes from the React version:
 *
 * 1. `level` used to be `years * 10`, which dressed an arithmetic accident up as
 *    a self-assessment. It is now a plain number set by hand. The values below
 *    still reproduce what the old formula rendered on migration day — reviewed
 *    and kept, not left by accident.
 *
 * 2. Every year count now derives from a start year, so they advance on their
 *    own. Nothing here freezes. `until` closes a skill that is no longer
 *    current; without it the count runs to the build year.
 *
 * `id` keys into the `skills` object in each locale file.
 */

/** @typedef {{id: string, level: number, since: number, until?: number}} Skill */

/** @type {Skill[]} */
export const SKILLS = [
	{ id: 'csharp', level: 100, since: 2014 },
	{ id: 'azure', level: 90, since: 2017 },
	{ id: 'webapi', level: 60, since: 2014 },
	{ id: 'sqlEf', level: 50, since: 2014 },
	{ id: 'nosql', level: 80, since: 2018 },
	{ id: 'wpf', level: 40, since: 2014, until: 2019 },
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
	if (typeof skill.since !== 'number') return 0;
	return (skill.until ?? currentYear) - skill.since;
}
