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
