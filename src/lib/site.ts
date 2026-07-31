import { CATALOG_LAST_UPDATED } from "./catalogLastUpdated";

/** Public catalog identity — keep in sync with package.json version. */
export const SITE_TITLE = "Tactile Arena";
export const APP_VERSION = "0.1.0";
/** Derived from git at build time (last commit that touched sensors.json). */
export const LAST_UPDATED = CATALOG_LAST_UPDATED;

export const REPO = "commissure-inc/Tactile-Arena";
export const REPO_URL = `https://github.com/${REPO}`;
export const COMMISSURE_URL = "https://commissure.co.jp/";

export const SITE_DESCRIPTION =
  "A catalog for comparing robot tactile sensors — modality, protocol, price range, and integration notes.";
