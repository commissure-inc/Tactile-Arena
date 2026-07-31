import type { TactileSensor } from "../types/sensor";
import {
  availabilityLabels,
  busInterfaceLabels,
  countryLabels,
  formatList,
  formFactorLabels,
  modalityLabels,
  opennessLabels,
  priceBasisLabels,
  priceRangeLabels,
  productTypeLabels,
  sensingPrincipleLabels,
  shearSensingLabels,
  softwareSupportLabels,
} from "../lib/labels";
import { SensorImage } from "./SensorImage";

interface SensorDetailDrawerProps {
  sensor: TactileSensor;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{value}</td>
    </tr>
  );
}

export function SensorDetailDrawer({ sensor, onClose }: SensorDetailDrawerProps) {
  const licence = sensor.license ? `${opennessLabels[sensor.openness]} · ${sensor.license}` : opennessLabels[sensor.openness];

  return (
    <>
      <div
        className="drawer-backdrop"
        role="presentation"
        onClick={onClose}
      />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={sensor.product}>
        <div className="drawer-header">
          <div>
            <h2 className="drawer-header__title">{sensor.product}</h2>
            <p className="drawer-header__subtitle">{sensor.company}</p>
          </div>
          <button type="button" className="drawer-header__close" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="drawer-body">
          <SensorImage sensor={sensor} className="sensor-detail-image" />
          <table className="kv-table">
            <tbody>
              <DetailRow label="Origin" value={countryLabels[sensor.country]} />
              <DetailRow label="Form factor" value={formFactorLabels[sensor.formFactor]} />
              <DetailRow label="Product type" value={productTypeLabels[sensor.productType]} />
              <DetailRow
                label="Modality"
                value={formatList(sensor.modalities, modalityLabels)}
              />
              <DetailRow label="Shear" value={shearSensingLabels[sensor.shearSensing]} />
              <DetailRow
                label="Sensing principle"
                value={formatList(sensor.sensingPrinciples, sensingPrincipleLabels)}
              />
              <DetailRow label="Output" value={sensor.output} />
              <DetailRow
                label="Interface"
                value={formatList(sensor.busInterfaces, busInterfaceLabels)}
              />
              <DetailRow
                label="Software stack"
                value={formatList(sensor.softwareSupport, softwareSupportLabels)}
              />
              {sensor.spatialResolution && (
                <DetailRow
                  label="Spatial resolution"
                  value={sensor.spatialResolution.display}
                />
              )}
              {sensor.samplingRate && (
                <DetailRow label="Sampling rate" value={sensor.samplingRate.display} />
              )}
              {sensor.dimensions && (
                <DetailRow label="Dimensions" value={sensor.dimensions.display} />
              )}
              {sensor.weight && <DetailRow label="Weight" value={sensor.weight.display} />}
              <DetailRow label="Availability" value={availabilityLabels[sensor.availability]} />
              <DetailRow label="Design openness" value={licence} />
              <DetailRow
                label="Price range"
                value={`${priceRangeLabels[sensor.priceRange]} (${priceBasisLabels[sensor.priceBasis]})`}
              />
              {sensor.procurement?.japanDistributor && (
                <DetailRow
                  label="Japan distributor"
                  value={sensor.procurement.japanDistributor}
                />
              )}
              {sensor.procurement?.moq && (
                <DetailRow label="MOQ" value={sensor.procurement.moq} />
              )}
              {sensor.procurement?.leadTime && (
                <DetailRow label="Lead time" value={sensor.procurement.leadTime} />
              )}
              <DetailRow label="Best use case" value={sensor.bestUseCase} />
              {sensor.notes && <DetailRow label="Notes / risks" value={sensor.notes} />}
              <DetailRow label="Last reviewed" value={sensor.lastUpdated} />
            </tbody>
          </table>
          {(sensor.website || sensor.datasheetUrl) && (
            <div className="drawer-links">
              {sensor.website && (
                <a
                  className="drawer-link"
                  href={sensor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Manufacturer site
                </a>
              )}
              {sensor.datasheetUrl && (
                <a
                  className="drawer-link"
                  href={sensor.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datasheet (PDF)
                </a>
              )}
            </div>
          )}
          <h3 className="drawer-sources__title">Sources</h3>
          <ul className="drawer-sources">
            {sensor.sources.map((source) => (
              <li key={source}>
                <a href={source} target="_blank" rel="noopener noreferrer">
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
