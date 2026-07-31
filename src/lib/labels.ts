import type {
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
  SensingPrinciple,
  ShearSensing,
  SoftwareSupport,
} from "./schema";

export const countryLabels: Record<Country, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  NL: "Netherlands",
  CH: "Switzerland",
  SE: "Sweden",
  IT: "Italy",
  IL: "Israel",
  JP: "Japan",
  CN: "China",
  KR: "South Korea",
  TW: "Taiwan",
  SG: "Singapore",
  AU: "Australia",
  Other: "Other",
};

export const formFactorLabels: Record<FormFactor, string> = {
  fingertip: "Fingertip",
  "flat-pad": "Flat pad",
  dome: "Dome / bubble",
  "finger-link": "Finger link",
  "skin-patch": "Skin patch",
  sheet: "Flexible sheet",
};

export const productTypeLabels: Record<ProductType, string> = {
  sensor: "Sensor",
  gripper: "Gripper",
  hand: "Robot hand",
};

export const modalityLabels: Record<Modality, string> = {
  contact_geometry: "Contact geometry",
  normal_force_map: "Normal force map",
  triaxial_force_map: "Triaxial force map",
  net_force_torque: "Net force / torque",
  vibration: "Vibration",
  temperature: "Temperature",
  proximity: "Proximity",
};

export const shearSensingLabels: Record<ShearSensing, string> = {
  "per-taxel": "Per-taxel shear",
  aggregate: "Aggregate shear",
  none: "No shear output",
};

export const sensingPrincipleLabels: Record<SensingPrinciple, string> = {
  "vision-based": "Vision-based (camera)",
  "optical-intensity": "Optical intensity (photodiode)",
  "hall-magnetic": "Hall / magnetic",
  capacitive: "Capacitive",
  piezoresistive: "Piezoresistive",
  piezoelectric: "Piezoelectric",
  triboelectric: "Triboelectric",
  "mems-barometric": "MEMS barometric",
  "fluid-biomimetic": "Fluid / biomimetic",
};

export const busInterfaceLabels: Record<BusInterface, string> = {
  USB: "USB",
  UVC: "USB video class (UVC)",
  Ethernet: "Ethernet",
  EtherCAT: "EtherCAT",
  "Modbus-TCP": "Modbus-TCP",
  CSI: "MIPI CSI (board camera)",
  SPI: "SPI",
  I2C: "I2C",
  UART: "UART / serial",
  CAN: "CAN",
  RS422: "RS422",
  Analog: "Analog (passive)",
};

export const softwareSupportLabels: Record<SoftwareSupport, string> = {
  "python-sdk": "Python SDK",
  "c-cpp-sdk": "C / C++ SDK",
  ros2: "ROS 2 driver",
  ros: "ROS 1 driver",
  "micro-ros": "micro-ROS firmware",
  yarp: "YARP / robotology",
  matlab: "MATLAB toolbox",
  "vendor-gui": "Vendor GUI application",
  "none-documented": "No driver published",
};

export const availabilityLabels: Record<Availability, string> = {
  "in-production": "In production",
  "made-to-order": "Made to order",
  diy: "DIY",
  discontinued: "Discontinued",
};

export const opennessLabels: Record<Openness, string> = {
  "open-hardware": "Open hardware",
  "design-published": "Design published",
  "software-only-open": "Open software only",
  proprietary: "Proprietary",
};

export const priceRangeLabels: Record<PriceRange, string> = {
  "under-100": "< $100",
  "100-500": "$100–500",
  "500-2k": "$500–2k",
  "2k-10k": "$2k–10k",
  "over-10k": "> $10k",
  undisclosed: "Undisclosed",
};

export const priceBasisLabels: Record<PriceBasis, string> = {
  list: "List price",
  street: "Street price",
  "bom-estimate": "BOM estimate (self-build)",
  "quote-only": "Quote only",
  unknown: "Basis unknown",
};

export const evaluationStatusLabels: Record<EvaluationStatus, string> = {
  "public-info-only": "Public Info Only",
  "protocol-mock-integrated": "Protocol Mock Integrated",
  "mock-integrated": "Mock Integrated",
  "hardware-tested": "Hardware Tested",
  "benchmark-completed": "Benchmark Completed",
};

export function formatList(values: string[], labels: Record<string, string>): string {
  return values.map((value) => labels[value] ?? value).join(", ");
}
