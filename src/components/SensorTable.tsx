import { useEffect, useMemo, useRef, useState } from "react";
import type {
  SensorFilters,
  SortDirection,
  SortKey,
  TactileSensor,
} from "../types/sensor";
import { EMPTY_FILTERS } from "../types/sensor";
import {
  AVAILABILITY,
  FORM_FACTORS,
  priceRank,
  PRODUCT_TYPES,
} from "../lib/schema";
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
  softwareSupportLabels,
} from "../lib/labels";
import { buildFilterOptions } from "../lib/filterOptions";
import { FilterPanel } from "./FilterPanel";
import { SensorCard } from "./SensorCard";
import { SensorDetailDrawer } from "./SensorDetailDrawer";

interface SensorTableProps {
  sensors: TactileSensor[];
}

type ViewMode = "cards" | "table";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "company", label: "Company / product" },
  { key: "country", label: "Country" },
  { key: "productType", label: "Product type" },
  { key: "formFactor", label: "Form factor" },
  { key: "sensingPrinciple", label: "Sensing principle" },
  { key: "availability", label: "Availability" },
  { key: "priceRange", label: "Price range" },
  { key: "samplingRate", label: "Sampling rate" },
  { key: "spatialResolution", label: "Spatial resolution" },
];

/** Matches the breakpoint where the filter sidebar turns into an off-canvas drawer. */
const COMPACT_QUERY = "(max-width: 1024px)";

function countActiveFilters(filters: SensorFilters): number {
  return Object.values(filters).reduce((sum, values) => sum + values.length, 0);
}

/** A triaxial force map also reports the normal component. */
function providesModality(sensor: TactileSensor, wanted: string): boolean {
  if (sensor.modalities.includes(wanted as TactileSensor["modalities"][number])) return true;
  return wanted === "normal_force_map" && sensor.modalities.includes("triaxial_force_map");
}

function matchesFilters(sensor: TactileSensor, filters: SensorFilters): boolean {
  if (filters.availability.length && !filters.availability.includes(sensor.availability)) {
    return false;
  }
  if (filters.openness.length && !filters.openness.includes(sensor.openness)) {
    return false;
  }
  if (filters.productType.length && !filters.productType.includes(sensor.productType)) {
    return false;
  }
  if (filters.formFactor.length && !filters.formFactor.includes(sensor.formFactor)) {
    return false;
  }
  if (filters.country.length && !filters.country.includes(sensor.country)) {
    return false;
  }
  if (
    filters.modalities.length &&
    !filters.modalities.some((modality) => providesModality(sensor, modality))
  ) {
    return false;
  }
  if (
    filters.sensingPrinciple.length &&
    !filters.sensingPrinciple.some((principle) => sensor.sensingPrinciples.includes(principle))
  ) {
    return false;
  }
  if (
    filters.busInterfaces.length &&
    !filters.busInterfaces.some((bus) => sensor.busInterfaces.includes(bus))
  ) {
    return false;
  }
  if (
    filters.softwareSupport.length &&
    !filters.softwareSupport.some((stack) => sensor.softwareSupport.includes(stack))
  ) {
    return false;
  }
  if (filters.priceRange.length && !filters.priceRange.includes(sensor.priceRange)) {
    return false;
  }
  if (
    filters.evaluationStatus.length &&
    !filters.evaluationStatus.includes(sensor.evaluationStatus)
  ) {
    return false;
  }
  return true;
}

function compareStrings(a: string, b: string, direction: SortDirection): number {
  const result = a.localeCompare(b, undefined, { sensitivity: "base" });
  return direction === "asc" ? result : -result;
}

function compareRanks(a: number, b: number, direction: SortDirection): number {
  return (a - b) * (direction === "asc" ? 1 : -1);
}

/** Entries without a comparable figure always sort last, in both directions. */
function compareOptionalNumbers(
  a: number | undefined,
  b: number | undefined,
  direction: SortDirection,
): number {
  if (a === undefined && b === undefined) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  return (a - b) * (direction === "asc" ? 1 : -1);
}

function sortSensors(
  sensors: TactileSensor[],
  sortKey: SortKey,
  direction: SortDirection,
): TactileSensor[] {
  const sorted = [...sensors];
  sorted.sort((a, b) => {
    switch (sortKey) {
      case "company":
        return compareStrings(
          `${a.company} ${a.product}`,
          `${b.company} ${b.product}`,
          direction,
        );
      case "country":
        return compareStrings(
          countryLabels[a.country],
          countryLabels[b.country],
          direction,
        );
      case "productType":
        return compareRanks(
          PRODUCT_TYPES.indexOf(a.productType),
          PRODUCT_TYPES.indexOf(b.productType),
          direction,
        );
      case "formFactor":
        return compareRanks(
          FORM_FACTORS.indexOf(a.formFactor),
          FORM_FACTORS.indexOf(b.formFactor),
          direction,
        );
      case "sensingPrinciple":
        return compareStrings(
          sensingPrincipleLabels[a.sensingPrinciples[0]],
          sensingPrincipleLabels[b.sensingPrinciples[0]],
          direction,
        );
      case "availability":
        return compareRanks(
          AVAILABILITY.indexOf(a.availability),
          AVAILABILITY.indexOf(b.availability),
          direction,
        );
      case "priceRange":
        return compareRanks(priceRank(a.priceRange), priceRank(b.priceRange), direction);
      case "samplingRate":
        return compareOptionalNumbers(a.samplingRate?.hz, b.samplingRate?.hz, direction);
      case "spatialResolution":
        return compareOptionalNumbers(
          a.spatialResolution?.mm,
          b.spatialResolution?.mm,
          direction,
        );
      default:
        return 0;
    }
  });
  return sorted;
}

interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}

function SortableHeader({
  label,
  sortKey,
  currentKey,
  direction,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentKey === sortKey;
  const ariaSort = isActive
    ? direction === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th scope="col" aria-sort={ariaSort}>
      <button
        type="button"
        className={`table-sort ${isActive ? "table-sort--active" : ""}`}
        onClick={() => onSort(sortKey)}
      >
        {label}
        {isActive && (
          <span className="table-sort__indicator" aria-hidden="true">
            {direction === "asc" ? "↑" : "↓"}
          </span>
        )}
      </button>
    </th>
  );
}

export function SensorTable({ sensors }: SensorTableProps) {
  const [filters, setFilters] = useState<SensorFilters>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("company");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [detailSensor, setDetailSensor] = useState<TactileSensor | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterToggleRef = useRef<HTMLButtonElement>(null);

  const activeFilterCount = countActiveFilters(filters);
  const filterOptions = useMemo(() => buildFilterOptions(sensors), [sensors]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sensors.filter((sensor) => {
      if (!matchesFilters(sensor, filters)) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        sensor.company,
        sensor.product,
        sensor.output,
        sensor.bestUseCase,
        sensor.notes ?? "",
        countryLabels[sensor.country],
        formFactorLabels[sensor.formFactor],
        productTypeLabels[sensor.productType],
        availabilityLabels[sensor.availability],
        opennessLabels[sensor.openness],
        sensor.license ?? "",
        ...sensor.sensingPrinciples.map((principle) => sensingPrincipleLabels[principle]),
        ...sensor.modalities.map((modality) => modalityLabels[modality]),
        ...sensor.busInterfaces.map((bus) => busInterfaceLabels[bus]),
        ...sensor.softwareSupport.map((stack) => softwareSupportLabels[stack]),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [sensors, filters, query]);

  const visible = useMemo(
    () => sortSensors(filtered, sortKey, sortDirection),
    [filtered, sortKey, sortDirection],
  );

  const closeFilters = () => {
    setFiltersOpen(false);
    filterToggleRef.current?.focus();
  };

  /** Widening the viewport turns the drawer back into a sidebar, so drop the open state with it. */
  useEffect(() => {
    const compact = window.matchMedia(COMPACT_QUERY);
    const sync = () => {
      if (!compact.matches) setFiltersOpen(false);
    };
    compact.addEventListener("change", sync);
    return () => compact.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeFilters();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("has-open-drawer");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("has-open-drawer");
    };
  }, [filtersOpen]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleSortSelect = (value: string) => {
    const [key, direction] = value.split(":") as [SortKey, SortDirection];
    setSortKey(key);
    setSortDirection(direction);
  };

  const sortSelectValue = `${sortKey}:${sortDirection}`;

  return (
    <div className="sensor-table-layout">
      <FilterPanel
        filters={filters}
        filterOptions={filterOptions}
        onChange={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
        activeCount={activeFilterCount}
        open={filtersOpen}
        onClose={closeFilters}
        resultCount={visible.length}
      />

      <div
        className={`filter-scrim ${filtersOpen ? "filter-scrim--visible" : ""}`}
        role="presentation"
        onClick={closeFilters}
      />

      <div className="sensor-table-main">
        <div className="sensor-table-toolbar">
          <button
            type="button"
            ref={filterToggleRef}
            className={`filter-toggle ${activeFilterCount > 0 ? "filter-toggle--active" : ""}`}
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
            onClick={() => setFiltersOpen(true)}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M2 4h12M4 8h8M6.5 12h3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-toggle__count">{activeFilterCount}</span>
            )}
          </button>

          <div className="view-toggle" role="tablist" aria-label="Display mode">
            <button
              type="button"
              role="tab"
              className={viewMode === "cards" ? "view-toggle__btn view-toggle__btn--active" : "view-toggle__btn"}
              aria-selected={viewMode === "cards"}
              onClick={() => setViewMode("cards")}
            >
              Cards
            </button>
            <button
              type="button"
              role="tab"
              className={viewMode === "table" ? "view-toggle__btn view-toggle__btn--active" : "view-toggle__btn"}
              aria-selected={viewMode === "table"}
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
          </div>

          <label className="search-field">
            <span className="search-field__label">Search</span>
            <input
              type="search"
              className="search-field__input"
              placeholder="Company, product, protocol…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          {viewMode === "cards" && (
            <label className="toolbar-sort">
              <span className="toolbar-sort__label">Sort by</span>
              <select
                className="toolbar-sort__select"
                value={sortSelectValue}
                onChange={(event) => handleSortSelect(event.target.value)}
                aria-label="Sort sensors"
              >
                {SORT_OPTIONS.flatMap((option) => [
                  <option key={`${option.key}:asc`} value={`${option.key}:asc`}>
                    {option.label} (A–Z)
                  </option>,
                  <option key={`${option.key}:desc`} value={`${option.key}:desc`}>
                    {option.label} (Z–A)
                  </option>,
                ])}
              </select>
            </label>
          )}

          <p className="sensor-table-count" aria-live="polite">
            {visible.length} of {sensors.length} sensors
          </p>
        </div>

        {viewMode === "cards" ? (
          visible.length === 0 ? (
            <p className="empty-state">No sensors match the current filters.</p>
          ) : (
            <div className="sensor-grid" aria-label="Sensor catalog">
              {visible.map((sensor) => (
                <SensorCard
                  key={sensor.slug}
                  sensor={sensor}
                  onSelect={setDetailSensor}
                />
              ))}
            </div>
          )
        ) : (
          <div className="sensor-table-wrap" aria-label="Sensor comparison table">
            <table className="sensor-table">
              <caption className="sr-only">
                Robot tactile sensor comparison — filter and sort to explore products
              </caption>
              <thead>
                <tr>
                  <SortableHeader
                    label="Company / Product"
                    sortKey="company"
                    currentKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Country"
                    sortKey="country"
                    currentKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Form factor"
                    sortKey="formFactor"
                    currentKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th scope="col">Modality</th>
                  <SortableHeader
                    label="Sensing Principle"
                    sortKey="sensingPrinciple"
                    currentKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th scope="col">Output</th>
                  <th scope="col">Interface</th>
                  <th scope="col">Software stack</th>
                  <SortableHeader
                    label="Sampling rate"
                    sortKey="samplingRate"
                    currentKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Availability"
                    sortKey="availability"
                    currentKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Price Range"
                    sortKey="priceRange"
                    currentKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <th scope="col">Best Use Case</th>
                  <th scope="col">Notes / Risks</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="empty-state">
                      No sensors match the current filters.
                    </td>
                  </tr>
                ) : (
                  visible.map((sensor) => (
                    <tr key={sensor.slug}>
                      <th scope="row" className="sensor-table__product">
                        <span className="sensor-table__product-name">{sensor.product}</span>
                        <span className="sensor-table__company">{sensor.company}</span>
                        {sensor.website && (
                          <a
                            className="sensor-table__link"
                            href={sensor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Site
                          </a>
                        )}
                      </th>
                      <td>{countryLabels[sensor.country]}</td>
                      <td>
                        {formFactorLabels[sensor.formFactor]}
                        {sensor.productType !== "sensor" &&
                          ` (${productTypeLabels[sensor.productType]})`}
                      </td>
                      <td>{formatList(sensor.modalities, modalityLabels)}</td>
                      <td>{formatList(sensor.sensingPrinciples, sensingPrincipleLabels)}</td>
                      <td>{sensor.output}</td>
                      <td>{formatList(sensor.busInterfaces, busInterfaceLabels)}</td>
                      <td>{formatList(sensor.softwareSupport, softwareSupportLabels)}</td>
                      <td>{sensor.samplingRate?.display ?? "—"}</td>
                      <td>
                        {availabilityLabels[sensor.availability]}
                        <span className="sensor-table__sub">
                          {opennessLabels[sensor.openness]}
                        </span>
                      </td>
                      <td>
                        {priceRangeLabels[sensor.priceRange]}
                        <span className="sensor-table__sub">
                          {priceBasisLabels[sensor.priceBasis]}
                        </span>
                      </td>
                      <td>{sensor.bestUseCase}</td>
                      <td>{sensor.notes ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detailSensor && (
        <SensorDetailDrawer sensor={detailSensor} onClose={() => setDetailSensor(null)} />
      )}
    </div>
  );
}
