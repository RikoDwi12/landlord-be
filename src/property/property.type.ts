import {
  BUILDING_DIRECTIONS,
  ELECTRICITY_TYPES,
  WATER_TYPES,
} from './property.const';

export interface Water {
  type: keyof typeof WATER_TYPES;
  client_number?: string;
  client_name?: string;
}
export interface Electricity {
  type: keyof typeof ELECTRICITY_TYPES;
  client_number?: string;
  client_name?: string;
  kwh?: number;
}

export type SpecificInfo = {
  water: Water[];
  electricity: Electricity[];
  phone: number; //jumlah telepon
  block: string;
  bathroom: number; //jumlah kamar mandi
  bedroom: number; //jumlah kamar tidur
  facilities: string;
  interior: string;
  floor: number; //jumlah lantai
  garage: boolean; // ada garasi atau tidak
  building_direction: keyof typeof BUILDING_DIRECTIONS;
  building_condition: string;
  unit: number;
  parking_area: boolean;
};
