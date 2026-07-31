import { useEffect, useState } from "react";
import type { TactileSensor } from "../types/sensor";
import { availabilityLabels } from "../lib/labels";

interface SensorImageProps {
  sensor: TactileSensor;
  className?: string;
  alt?: string;
}

export function SensorImage({ sensor, className, alt }: SensorImageProps) {
  const [failed, setFailed] = useState(false);
  const url = sensor.imageUrl;
  const isDiscontinued = sensor.availability === "discontinued";

  useEffect(() => {
    setFailed(false);
  }, [sensor.slug, url]);

  const wrapClasses = [
    "sensor-image-wrap",
    className,
    isDiscontinued && "sensor-image-wrap--discontinued",
  ]
    .filter(Boolean)
    .join(" ");

  const media =
    !url || failed ? (
      <div className="sensor-image sensor-image--placeholder" aria-hidden />
    ) : (
      <img
        className="sensor-image"
        src={url}
        alt={alt ?? sensor.product}
        loading="lazy"
        decoding="async"
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => setFailed(true)}
      />
    );

  return (
    <div className={wrapClasses}>
      {media}
      {isDiscontinued && (
        <span className="sensor-image__discontinued" aria-hidden>
          {availabilityLabels.discontinued}
        </span>
      )}
    </div>
  );
}
