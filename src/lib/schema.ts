import { z } from "zod";

/**
 * Single source of truth for the sensor dataset.
 *
 * Every vocabulary is declared as an ordered `as const` array: the order is the
 * display order used by filters and sorting, and the derived types force
 * `labels.ts` to cover any value added here.
 */

export const COUNTRIES = [
  "US",
  "CA",
  "GB",
  "DE",
  "FR",
  "NL",
  "CH",
  "SE",
  "IT",
  "IL",
  "JP",
  "CN",
  "KR",
  "TW",
  "SG",
  "AU",
  "Other",
] as const;
export type Country = (typeof COUNTRIES)[number];

/** Physical shape of the sensing surface. */
export const FORM_FACTORS = [
  "fingertip",
  "flat-pad",
  "dome",
  "finger-link",
  "skin-patch",
  "sheet",
] as const;
export type FormFactor = (typeof FORM_FACTORS)[number];

/**
 * What the buyer actually receives: a bare sensor, or an end effector
 * (gripper / hand) with tactile sensing integrated. The shape of the sensing
 * surface itself is `formFactor`.
 */
export const PRODUCT_TYPES = ["sensor", "gripper", "hand"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

/**
 * What the sensor reports. `triaxial_force_map` covers any distributed normal +
 * tangential force output; the granularity of the tangential component is
 * recorded separately in `shearSensing`.
 */
export const MODALITIES = [
  "contact_geometry",
  "normal_force_map",
  "triaxial_force_map",
  "net_force_torque",
  "vibration",
  "temperature",
  "proximity",
] as const;
export type Modality = (typeof MODALITIES)[number];

export const SHEAR_SENSING = ["per-taxel", "aggregate", "none"] as const;
export type ShearSensing = (typeof SHEAR_SENSING)[number];

export const SENSING_PRINCIPLES = [
  "vision-based",
  "optical-intensity",
  "hall-magnetic",
  "capacitive",
  "piezoresistive",
  "piezoelectric",
  "triboelectric",
  "mems-barometric",
  "fluid-biomimetic",
] as const;
export type SensingPrinciple = (typeof SENSING_PRINCIPLES)[number];

/**
 * How the sensor is physically wired and what speaks on that wire. `UVC` is the
 * USB device class rather than a bus of its own, so it is always accompanied by
 * `USB`; the same applies to `Modbus-TCP` over `Ethernet`.
 */
export const BUS_INTERFACES = [
  "USB",
  "UVC",
  "Ethernet",
  "EtherCAT",
  "Modbus-TCP",
  "CSI",
  "SPI",
  "I2C",
  "UART",
  "CAN",
  "RS422",
  "Analog",
] as const;
export type BusInterface = (typeof BUS_INTERFACES)[number];

/** What you can drive the sensor with without writing a driver yourself. */
export const SOFTWARE_SUPPORT = [
  "python-sdk",
  "c-cpp-sdk",
  "ros2",
  "ros",
  "micro-ros",
  "yarp",
  "matlab",
  "vendor-gui",
  "none-documented",
] as const;
export type SoftwareSupport = (typeof SOFTWARE_SUPPORT)[number];

/**
 * Can it be obtained today, and how.
 * `diy` means not sold as a product, but buildable from a published open design.
 * Paper-only / closed lab hardware with no buy path and no public build path is out of scope.
 */
export const AVAILABILITY = [
  "in-production",
  "made-to-order",
  "diy",
  "discontinued",
] as const;
export type Availability = (typeof AVAILABILITY)[number];

/** How much of the design is published, and therefore reproducible. */
export const OPENNESS = [
  "open-hardware",
  "design-published",
  "software-only-open",
  "proprietary",
] as const;
export type Openness = (typeof OPENNESS)[number];

export const PRICE_RANGES = [
  "under-100",
  "100-500",
  "500-2k",
  "2k-10k",
  "over-10k",
  "undisclosed",
] as const;
export type PriceRange = (typeof PRICE_RANGES)[number];

/** Where the price figure comes from — a DIY build estimate is not a list price. */
export const PRICE_BASIS = ["list", "street", "bom-estimate", "quote-only", "unknown"] as const;
export type PriceBasis = (typeof PRICE_BASIS)[number];

/** Ordered weakest → strongest evidence. Sorting uses this index, not the label. */
export const EVALUATION_STATUSES = [
  "public-info-only",
  "protocol-mock-integrated",
  "mock-integrated",
  "hardware-tested",
  "benchmark-completed",
] as const;
export type EvaluationStatus = (typeof EVALUATION_STATUSES)[number];

export function evaluationRank(status: EvaluationStatus): number {
  return EVALUATION_STATUSES.indexOf(status);
}

export function priceRank(range: PriceRange): number {
  return PRICE_RANGES.indexOf(range);
}

export const SAMPLING_RATE_KINDS = ["frame", "per-taxel", "channel"] as const;
export type SamplingRateKind = (typeof SAMPLING_RATE_KINDS)[number];

export const RATE_QUALIFIERS = ["max", "typical", "configurable"] as const;
export type RateQualifier = (typeof RATE_QUALIFIERS)[number];

export const RESOLUTION_KINDS = [
  "taxel-pitch",
  "surface-pixel",
  "depth-error",
  "localization-error",
  "other",
] as const;
export type ResolutionKind = (typeof RESOLUTION_KINDS)[number];

/**
 * Measured quantities keep the vendor's wording in `display` and an optional
 * comparable number for sorting. A number is only meaningful with its `kind`,
 * so the two are required together.
 */
const samplingRateSchema = z
  .strictObject({
    display: z.string().min(1).max(200),
    hz: z.number().positive().optional(),
    kind: z.enum(SAMPLING_RATE_KINDS).optional(),
    qualifier: z.enum(RATE_QUALIFIERS).optional(),
  })
  .refine((value) => value.hz === undefined || (value.kind !== undefined && value.qualifier !== undefined), {
    message: "samplingRate.hz requires both kind and qualifier",
  });

const spatialResolutionSchema = z
  .strictObject({
    display: z.string().min(1).max(200),
    mm: z.number().positive().optional(),
    kind: z.enum(RESOLUTION_KINDS).optional(),
  })
  .refine((value) => value.mm === undefined || value.kind !== undefined, {
    message: "spatialResolution.mm requires kind",
  });

const dimensionsSchema = z.strictObject({
  display: z.string().min(1).max(200),
  longestMm: z.number().positive().optional(),
});

const weightSchema = z.strictObject({
  display: z.string().min(1).max(120),
  grams: z.number().positive().optional(),
});

const procurementSchema = z.strictObject({
  japanDistributor: z.string().min(1).optional(),
  moq: z.string().min(1).optional(),
  leadTime: z.string().min(1).optional(),
});

export const tactileSensorSchema = z
  .strictObject({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/),
    company: z.string().min(1),
    product: z.string().min(1),
    website: z.url().optional(),
    imageUrl: z.url().optional(),
    datasheetUrl: z.url().optional(),

    country: z.enum(COUNTRIES),
    formFactor: z.enum(FORM_FACTORS),
    productType: z.enum(PRODUCT_TYPES),

    modalities: z.array(z.enum(MODALITIES)).min(1),
    shearSensing: z.enum(SHEAR_SENSING),
    /** First entry is the primary principle used for grouping and sorting. */
    sensingPrinciples: z.array(z.enum(SENSING_PRINCIPLES)).min(1),

    output: z.string().min(1).max(400),
    busInterfaces: z.array(z.enum(BUS_INTERFACES)).min(1),
    softwareSupport: z.array(z.enum(SOFTWARE_SUPPORT)).min(1),
    samplingRate: samplingRateSchema.optional(),
    spatialResolution: spatialResolutionSchema.optional(),
    dimensions: dimensionsSchema.optional(),
    weight: weightSchema.optional(),

    availability: z.enum(AVAILABILITY),
    openness: z.enum(OPENNESS),
    /** SPDX-style identifier, e.g. "MIT", "GPL-3.0", "CC-BY-NC-4.0". */
    license: z.string().min(1).optional(),
    priceRange: z.enum(PRICE_RANGES),
    priceBasis: z.enum(PRICE_BASIS),
    procurement: procurementSchema.optional(),

    evaluationStatus: z.enum(EVALUATION_STATUSES),
    bestUseCase: z.string().min(1).max(200),
    notes: z.string().min(1).max(900).optional(),
    sources: z.array(z.url()).min(1),
    lastUpdated: z.iso.date(),
  })
  .superRefine((sensor, ctx) => {
    const hasTriaxial = sensor.modalities.includes("triaxial_force_map");
    if (hasTriaxial && sensor.shearSensing === "none") {
      ctx.addIssue({
        code: "custom",
        path: ["shearSensing"],
        message: "triaxial_force_map requires shearSensing to be per-taxel or aggregate",
      });
    }
    if (!hasTriaxial && sensor.shearSensing !== "none") {
      ctx.addIssue({
        code: "custom",
        path: ["shearSensing"],
        message: "shearSensing must be none unless modalities include triaxial_force_map",
      });
    }
    if (sensor.license && sensor.openness === "proprietary") {
      ctx.addIssue({
        code: "custom",
        path: ["license"],
        message: "license is only meaningful when the design or code is published",
      });
    }
    if (new Set(sensor.modalities).size !== sensor.modalities.length) {
      ctx.addIssue({ code: "custom", path: ["modalities"], message: "duplicate modality" });
    }
    if (hasTriaxial && sensor.modalities.includes("normal_force_map")) {
      ctx.addIssue({
        code: "custom",
        path: ["modalities"],
        message:
          "triaxial_force_map already implies a normal component; drop normal_force_map",
      });
    }
    if (new Set(sensor.sensingPrinciples).size !== sensor.sensingPrinciples.length) {
      ctx.addIssue({
        code: "custom",
        path: ["sensingPrinciples"],
        message: "duplicate sensing principle",
      });
    }
    if (sensor.busInterfaces.includes("UVC") && !sensor.busInterfaces.includes("USB")) {
      ctx.addIssue({
        code: "custom",
        path: ["busInterfaces"],
        message: "UVC is a USB device class, so USB must be listed as well",
      });
    }
    if (
      sensor.busInterfaces.includes("Modbus-TCP") &&
      !sensor.busInterfaces.includes("Ethernet")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["busInterfaces"],
        message: "Modbus-TCP runs over Ethernet, so Ethernet must be listed as well",
      });
    }
    if (
      sensor.softwareSupport.includes("none-documented") &&
      sensor.softwareSupport.length > 1
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["softwareSupport"],
        message: "none-documented cannot be combined with an actual software stack",
      });
    }
    if (new Set(sensor.busInterfaces).size !== sensor.busInterfaces.length) {
      ctx.addIssue({ code: "custom", path: ["busInterfaces"], message: "duplicate bus" });
    }
    if (new Set(sensor.softwareSupport).size !== sensor.softwareSupport.length) {
      ctx.addIssue({
        code: "custom",
        path: ["softwareSupport"],
        message: "duplicate software stack",
      });
    }
  });

export const sensorsSchema = z
  .array(tactileSensorSchema)
  .min(1)
  .superRefine((sensors, ctx) => {
    const seen = new Set<string>();
    sensors.forEach((sensor, index) => {
      if (seen.has(sensor.slug)) {
        ctx.addIssue({
          code: "custom",
          path: [index, "slug"],
          message: `duplicate slug: ${sensor.slug}`,
        });
      }
      seen.add(sensor.slug);
    });
  });

export type TactileSensor = z.infer<typeof tactileSensorSchema>;
