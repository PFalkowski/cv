// @ts-check
import { defineConfig } from 'astro/config';

// Published to GitHub Pages at https://pfalkowski.github.io/cv/, so every
// internal link has to carry the /cv base. Use the `href` helper in
// src/lib/href.js rather than hand-writing it.
export default defineConfig({
	site: 'https://pfalkowski.github.io',
	base: '/cv',
	trailingSlash: 'always',
	build: {
		format: 'directory',
	},
});
