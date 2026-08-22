import en from '../data/en.json';
import pl from '../data/pl.json';

export const LOCALES = { en, pl };

/** The order the language switcher renders in. */
export const LOCALE_ORDER = ['en', 'pl'];

/** English is served at the base path; every other locale gets a subdirectory. */
export function localePath(base, lang) {
	const root = base.endsWith('/') ? base : `${base}/`;
	return lang === 'en' ? root : `${root}${lang}/`;
}

/**
 * Look up a dotted key. Unlike the React version this never renders the key
 * itself into the page: a missing key falls back to English and, in dev, fails
 * the build-time console loudly rather than quietly shipping "about.frist".
 *
 * @param {object} dict
 * @param {string} path
 * @returns {any}
 */
export function get(dict, path) {
	const value = path.split('.').reduce((node, key) => node?.[key], dict);
	if (value !== undefined) return value;

	const fallback = path.split('.').reduce((node, key) => node?.[key], en);
	if (fallback !== undefined) {
		console.warn(`[i18n] missing key "${path}", fell back to English`);
		return fallback;
	}

	throw new Error(`[i18n] key "${path}" is missing from every locale`);
}
