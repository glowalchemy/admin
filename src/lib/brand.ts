/**
 * Centralized brand configuration for the admin application.
 *
 * The canonical value comes from the single `BRAND_NAME` environment variable
 * (admin/.env, documented in the root .env.example). Vite injects it into the
 * browser bundle as `import.meta.env.VITE_BRAND_NAME` — see vite.config.ts.
 *
 * Components must import from here instead of hardcoding the brand name.
 */
const BRAND_NAME: string = (import.meta.env.VITE_BRAND_NAME as string | undefined) || "GlowAlchemy";

export const getBrandName = (): string => BRAND_NAME;

export const getBrandDisplayName = (): string => BRAND_NAME;

/** Uppercase presentation, derived — never stored as a second variable. */
export const getBrandUppercase = (): string => BRAND_NAME.toUpperCase();

/** Lowercase slug form for domains / identifiers. */
export const getBrandSlug = (): string => BRAND_NAME.toLowerCase();

export default BRAND_NAME;
