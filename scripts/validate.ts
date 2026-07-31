import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { sensorsSchema } from "../src/lib/schema.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "src/data/sensors.json");

const MIN_SENSORS = 20;
const STALE_AFTER_DAYS = 120;

const raw: unknown = JSON.parse(readFileSync(dataPath, "utf8"));
const result = sensorsSchema.safeParse(raw);

if (!result.success) {
  console.error("Validation failed:");
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    console.error(`  ${path || "(root)"}: ${issue.message}`);
  }
  process.exit(1);
}

const sensors = result.data;

if (sensors.length < MIN_SENSORS) {
  console.error(`Validation failed: expected at least ${MIN_SENSORS} sensors, found ${sensors.length}`);
  process.exit(1);
}

const staleThreshold = Date.now() - STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;
const stale = sensors.filter((sensor) => Date.parse(sensor.lastUpdated) < staleThreshold);

console.log(`Validated ${sensors.length} sensors.`);

if (stale.length > 0) {
  console.warn(`${stale.length} entries not reviewed in ${STALE_AFTER_DAYS} days:`);
  for (const sensor of stale) {
    console.warn(`  ${sensor.slug} (${sensor.lastUpdated})`);
  }
}
