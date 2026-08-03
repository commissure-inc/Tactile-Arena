import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/**
 * Build the site published to GitHub Pages.
 *
 * The catalog itself is served from commissure.co.jp, so this repository's
 * Pages site only forwards visitors to the canonical location. GitHub Pages
 * cannot issue a 301, so each page carries a canonical link and a meta
 * refresh, and 404.html forwards unknown paths without losing them.
 */

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "_site");

const BASE = "/Tactile-Arena";
const TARGET = "https://commissure.co.jp/Tactile-Arena";

/** Routes the old Pages site used to serve, so each keeps a 200 with a canonical link. */
const ROUTES = ["/", "/sensors/"];

function page(canonical: string, script: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Tactile Arena</title>
    <link rel="canonical" href="${canonical}" />
    <meta http-equiv="refresh" content="0; url=${canonical}" />
    <script>${script}</script>
  </head>
  <body>
    <p>Tactile Arena has moved to <a href="${canonical}">${canonical}</a>.</p>
  </body>
</html>
`;
}

for (const route of ROUTES) {
  const canonical = `${TARGET}${route}`;
  const dir = join(outDir, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "index.html"),
    page(canonical, `location.replace(${JSON.stringify(canonical)} + location.search + location.hash);`),
  );
}

// GitHub Pages serves this for any path it does not know, which is how deep
// links keep working: strip the old base prefix and re-attach it to the target.
const forward = [
  `var base = ${JSON.stringify(BASE)};`,
  `var path = location.pathname.indexOf(base) === 0 ? location.pathname.slice(base.length) : location.pathname;`,
  `location.replace(${JSON.stringify(TARGET)} + path + location.search + location.hash);`,
].join(" ");

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "404.html"), page(`${TARGET}/`, forward));

console.log(`Wrote redirect site to ${outDir} (${ROUTES.length} routes + 404.html)`);
