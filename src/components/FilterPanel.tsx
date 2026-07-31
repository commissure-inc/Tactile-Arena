import type { SensorFilters } from "../types/sensor";
import type { FilterOptionGroups } from "../lib/filterOptions";

interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterGroupProps<T extends string> {
  title: string;
  options: FilterOption<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
}

function FilterGroup<T extends string>({
  title,
  options,
  selected,
  onChange,
}: FilterGroupProps<T>) {
  if (options.length <= 1) {
    return null;
  }

  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__title">{title}</legend>
      <div className="filter-group__chips" role="group" aria-label={title}>
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className={`chip ${isSelected ? "chip--selected" : ""}`}
              aria-pressed={isSelected}
              onClick={() => toggle(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

interface FilterPanelProps {
  filters: SensorFilters;
  filterOptions: FilterOptionGroups;
  onChange: (filters: SensorFilters) => void;
  onClear: () => void;
  activeCount: number;
}

export function FilterPanel({
  filters,
  filterOptions,
  onChange,
  onClear,
  activeCount,
}: FilterPanelProps) {
  const update = <K extends keyof SensorFilters>(key: K, values: SensorFilters[K]) => {
    onChange({ ...filters, [key]: values });
  };

  return (
    <aside className="filter-panel" aria-label="Sensor filters">
      <div className="filter-panel__head">
        <h2 className="filter-panel__title">Filters</h2>
        {activeCount > 0 && (
          <button type="button" className="filter-panel__clear" onClick={onClear}>
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup
        title="Availability"
        options={filterOptions.availability}
        selected={filters.availability}
        onChange={(values) => update("availability", values)}
      />

      <FilterGroup
        title="Design openness"
        options={filterOptions.openness}
        selected={filters.openness}
        onChange={(values) => update("openness", values)}
      />

      <FilterGroup
        title="Product type"
        options={filterOptions.productType}
        selected={filters.productType}
        onChange={(values) => update("productType", values)}
      />

      <FilterGroup
        title="Form factor"
        options={filterOptions.formFactor}
        selected={filters.formFactor}
        onChange={(values) => update("formFactor", values)}
      />

      <FilterGroup
        title="Country"
        options={filterOptions.country}
        selected={filters.country}
        onChange={(values) => update("country", values)}
      />

      <FilterGroup
        title="Modality"
        options={filterOptions.modalities}
        selected={filters.modalities}
        onChange={(values) => update("modalities", values)}
      />

      <FilterGroup
        title="Sensing principle"
        options={filterOptions.sensingPrinciple}
        selected={filters.sensingPrinciple}
        onChange={(values) => update("sensingPrinciple", values)}
      />

      <FilterGroup
        title="Interface"
        options={filterOptions.busInterfaces}
        selected={filters.busInterfaces}
        onChange={(values) => update("busInterfaces", values)}
      />

      <FilterGroup
        title="Software stack"
        options={filterOptions.softwareSupport}
        selected={filters.softwareSupport}
        onChange={(values) => update("softwareSupport", values)}
      />

      <FilterGroup
        title="Price range"
        options={filterOptions.priceRange}
        selected={filters.priceRange}
        onChange={(values) => update("priceRange", values)}
      />
    </aside>
  );
}
