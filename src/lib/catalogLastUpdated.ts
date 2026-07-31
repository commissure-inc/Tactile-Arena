import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CATALOG_FILE = "src/data/sensors.json";

function gitDate(repoRoot: string, args: string): string | null {
  try {
    const out = execSync(`git ${args}`, { encoding: "utf8", cwd: repoRoot }).trim();
    return out || null;
  } catch {
    return null;
  }
}

/** Latest commit date (YYYY-MM-DD) that touched the catalog file, else repo HEAD. */
export function resolveCatalogLastUpdated(repoRoot: string): string {
  return (
    gitDate(repoRoot, `log -1 --format=%cs -- "${CATALOG_FILE}"`) ??
    gitDate(repoRoot, "log -1 --format=%cs") ??
    new Date().toISOString().slice(0, 10)
  );
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const CATALOG_LAST_UPDATED = resolveCatalogLastUpdated(repoRoot);
