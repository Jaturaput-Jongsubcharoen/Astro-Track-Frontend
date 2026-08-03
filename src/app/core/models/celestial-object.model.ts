export interface CelestialObject {
  objectId: number;
  objectName: string;
  category: string;
  distanceLightYears: number | null;
  discoveryDate: string | null;
  inSolarSystem: boolean;
  habitabilityScore: number | null;
  surfaceTemperature: number | null;
  gravity: number | null;
  nitrogen: boolean;
  oxygen: boolean;
  co2: boolean;
  sulfuricAcid: boolean;
  hydrogen: boolean;
  helium: boolean;
  methane: boolean;
  waterVapor: boolean;
  silicates: boolean;
  iron: boolean;
  nickel: boolean;
}

export type YesNoFlag = 'Y' | 'N';

export type CelestialObjectCategory =
  | 'Planet'
  | 'Exoplanet'
  | 'Moon'
  | 'Dwarf Planet'
  | 'Asteroid'
  | 'Comet'
  | 'Black Hole'
  | 'Neutron Star'
  | 'Star';

export interface CreateCelestialObjectRequest {
  objectId: number;
  objectName: string;
  category: CelestialObjectCategory;
  distanceLightYears: number | null;
  discoveryDate: string | null;
  inSolarSystem: YesNoFlag;
  habitabilityScore: number | null;
  surfaceTemperature: number | null;
  gravity: number | null;
  nitrogen: YesNoFlag;
  oxygen: YesNoFlag;
  co2: YesNoFlag;
  sulfuricAcid: YesNoFlag;
  hydrogen: YesNoFlag;
  helium: YesNoFlag;
  methane: YesNoFlag;
  waterVapor: YesNoFlag;
  silicates: YesNoFlag;
  iron: YesNoFlag;
  nickel: YesNoFlag;
}

export interface UpdateCelestialObjectRequest {
  objectName: string;
  category: CelestialObjectCategory;
  distanceLightYears: number | null;
  discoveryDate: string | null;
  inSolarSystem: YesNoFlag;
  habitabilityScore: number | null;
  surfaceTemperature: number | null;
  gravity: number | null;
  nitrogen: YesNoFlag;
  oxygen: YesNoFlag;
  co2: YesNoFlag;
  sulfuricAcid: YesNoFlag;
  hydrogen: YesNoFlag;
  helium: YesNoFlag;
  methane: YesNoFlag;
  waterVapor: YesNoFlag;
  silicates: YesNoFlag;
  iron: YesNoFlag;
  nickel: YesNoFlag;
}

export const CELESTIAL_OBJECT_CATEGORIES: readonly CelestialObjectCategory[] = [
  'Planet',
  'Exoplanet',
  'Moon',
  'Dwarf Planet',
  'Asteroid',
  'Comet',
  'Black Hole',
  'Neutron Star',
  'Star',
];
