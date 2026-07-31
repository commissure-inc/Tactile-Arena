import {
  AVAILABILITY,
  BUS_INTERFACES,
  COUNTRIES,
  EVALUATION_STATUSES,
  FORM_FACTORS,
  MODALITIES,
  OPENNESS,
  PRICE_RANGES,
  PRODUCT_TYPES,
  SENSING_PRINCIPLES,
  SOFTWARE_SUPPORT,
} from "./schema";
import type {
  Availability,
  BusInterface,
  Country,
  EvaluationStatus,
  FormFactor,
  Modality,
  Openness,
  PriceRange,
  ProductType,
  SensingPrinciple,
  SoftwareSupport,
  TactileSensor,
} from "../types/sensor";
import {
  availabilityLabels,
  busInterfaceLabels,
  countryLabels,
  evaluationStatusLabels,
  formFactorLabels,
  modalityLabels,
  opennessLabels,
  priceRangeLabels,
  productTypeLabels,
  sensingPrincipleLabels,
  softwareSupportLabels,
} from "./labels";

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
}

export interface FilterOptionGroups {
  availability: FilterOption<Availability>[];
  openness: FilterOption<Openness>[];
  productType: FilterOption<ProductType>[];
  formFactor: FilterOption<FormFactor>[];
  country: FilterOption<Country>[];
  modalities: FilterOption<Modality>[];
  sensingPrinciple: FilterOption<SensingPrinciple>[];
  busInterfaces: FilterOption<BusInterface>[];
  softwareSupport: FilterOption<SoftwareSupport>[];
  priceRange: FilterOption<PriceRange>[];
  evaluationStatus: FilterOption<EvaluationStatus>[];
}

function collectScalar<T extends string>(
  sensors: TactileSensor[],
  pick: (sensor: TactileSensor) => T,
): Set<T> {
  return new Set(sensors.map(pick));
}

function collectArray<T extends string>(
  sensors: TactileSensor[],
  pick: (sensor: TactileSensor) => readonly T[],
): Set<T> {
  const values = new Set<T>();
  for (const sensor of sensors) {
    for (const value of pick(sensor)) {
      values.add(value);
    }
  }
  return values;
}

function toOptions<T extends string>(
  values: Set<T>,
  order: readonly T[],
  labels: Record<T, string>,
): FilterOption<T>[] {
  return order
    .filter((value) => values.has(value))
    .map((value) => ({ value, label: labels[value] }));
}

export function buildFilterOptions(sensors: TactileSensor[]): FilterOptionGroups {
  return {
    availability: toOptions(
      collectScalar(sensors, (sensor) => sensor.availability),
      AVAILABILITY,
      availabilityLabels,
    ),
    openness: toOptions(
      collectScalar(sensors, (sensor) => sensor.openness),
      OPENNESS,
      opennessLabels,
    ),
    productType: toOptions(
      collectScalar(sensors, (sensor) => sensor.productType),
      PRODUCT_TYPES,
      productTypeLabels,
    ),
    formFactor: toOptions(
      collectScalar(sensors, (sensor) => sensor.formFactor),
      FORM_FACTORS,
      formFactorLabels,
    ),
    country: toOptions(
      collectScalar(sensors, (sensor) => sensor.country),
      COUNTRIES,
      countryLabels,
    ),
    modalities: toOptions(
      collectArray(sensors, (sensor) => sensor.modalities),
      MODALITIES,
      modalityLabels,
    ),
    sensingPrinciple: toOptions(
      collectArray(sensors, (sensor) => sensor.sensingPrinciples),
      SENSING_PRINCIPLES,
      sensingPrincipleLabels,
    ),
    busInterfaces: toOptions(
      collectArray(sensors, (sensor) => sensor.busInterfaces),
      BUS_INTERFACES,
      busInterfaceLabels,
    ),
    softwareSupport: toOptions(
      collectArray(sensors, (sensor) => sensor.softwareSupport),
      SOFTWARE_SUPPORT,
      softwareSupportLabels,
    ),
    priceRange: toOptions(
      collectScalar(sensors, (sensor) => sensor.priceRange),
      PRICE_RANGES,
      priceRangeLabels,
    ),
    evaluationStatus: toOptions(
      collectScalar(sensors, (sensor) => sensor.evaluationStatus),
      EVALUATION_STATUSES,
      evaluationStatusLabels,
    ),
  };
}
