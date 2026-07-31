import type { KeyboardEvent } from "react";
import type { TactileSensor } from "../types/sensor";
import {
  availabilityLabels,
  countryLabels,
  formFactorLabels,
  modalityLabels,
  priceRangeLabels,
  productTypeLabels,
} from "../lib/labels";
import { SensorImage } from "./SensorImage";

interface SensorCardProps {
  sensor: TactileSensor;
  onSelect: (sensor: TactileSensor) => void;
}

export function SensorCard({ sensor, onSelect }: SensorCardProps) {
  const primaryModality = sensor.modalities[0]
    ? modalityLabels[sensor.modalities[0]]
    : null;

  const form =
    sensor.productType === "sensor"
      ? formFactorLabels[sensor.formFactor]
      : `${formFactorLabels[sensor.formFactor]} · ${productTypeLabels[sensor.productType]}`;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(sensor);
    }
  };

  return (
    <article
      className="sensor-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(sensor)}
      onKeyDown={handleKeyDown}
      aria-label={`${sensor.product} by ${sensor.company}`}
    >
      <SensorImage sensor={sensor} className="sensor-card__image" />
      <div className="sensor-card__body">
        <h3 className="sensor-card__product">{sensor.product}</h3>
        <p className="sensor-card__company">{sensor.company}</p>
        <p className="sensor-card__meta">{form}</p>
        <p className="sensor-card__meta sensor-card__meta--mono">
          {countryLabels[sensor.country]} · {priceRangeLabels[sensor.priceRange]}
        </p>
        <p className="sensor-card__meta">{availabilityLabels[sensor.availability]}</p>
        <div className="sensor-card__footer">
          {primaryModality && (
            <span className="sensor-card__tag">{primaryModality}</span>
          )}
        </div>
      </div>
    </article>
  );
}
