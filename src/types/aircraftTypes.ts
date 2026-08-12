export interface AircraftApiItem {
  id?: number | string;
  model?: string;
  manufacturer?: string;
  engine_type?: string;
  max_speed_knots?: number | string;
  ceiling_ft?: number | string;
  gross_weight_lbs?: number | string;
  length_ft?: number | string;
  height_ft?: number | string;
  wing_span_ft?: number | string;
  range_nautical_miles?: number | string;
  engine_thrust_lb_ft?: number | string;
}

export interface AircraftCardData {
  id: string;
  modelName: string;
  manufacturer: string;
  maxSpeedKnots: number | null;
  ceilingFt: number | null;
  grossWeightLbs: number | null;
  lengthFt: number | null;
  heightFt: number | null;
  wingSpanFt: number | null;
  rangeNauticalMiles: number | null;
  engineType: string;
  engineThrustLbFt: number | null;
}

export interface AircraftDetailsModalData extends AircraftCardData {
  sourceQuery?: string;
}

export const API_BASE_URL = "https://api.api-ninjas.com/v1/aircraft";