export type {
  Availability,
  BusInterface,
  Country,
  EvaluationStatus,
  FormFactor,
  Modality,
  Openness,
  PriceBasis,
  PriceRange,
  ProductType,
  ResolutionKind,
  SamplingRateKind,
  SensingPrinciple,
  ShearSensing,
  SoftwareSupport,
  TactileSensor,
} from "../lib/schema";

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
} from "../lib/schema";

export type SortKey =
  | "company"
  | "country"
  | "productType"
  | "formFactor"
  | "sensingPrinciple"
  | "availability"
  | "priceRange"
  | "samplingRate"
  | "spatialResolution"
  | "evaluationStatus";

export type SortDirection = "asc" | "desc";

export interface SensorFilters {
  availability: Availability[];
  openness: Openness[];
  productType: ProductType[];
  formFactor: FormFactor[];
  country: Country[];
  modalities: Modality[];
  sensingPrinciple: SensingPrinciple[];
  busInterfaces: BusInterface[];
  softwareSupport: SoftwareSupport[];
  priceRange: PriceRange[];
  evaluationStatus: EvaluationStatus[];
}

export const EMPTY_FILTERS: SensorFilters = {
  availability: [],
  openness: [],
  productType: [],
  formFactor: [],
  country: [],
  modalities: [],
  sensingPrinciple: [],
  busInterfaces: [],
  softwareSupport: [],
  priceRange: [],
  evaluationStatus: [],
};
