import sensorsData from "../data/sensors.json";
import { sensorsSchema } from "./schema";
import type { TactileSensor } from "../types/sensor";

export function getSensors(): TactileSensor[] {
  return sensorsSchema.parse(sensorsData);
}
