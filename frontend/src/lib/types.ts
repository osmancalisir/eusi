// frontend/src/lib/types.ts

import GeoJSON from "ol/format/GeoJSON";

export interface SatelliteImage {
  id: string;
  catalogID: string;
  acquisitionDateStart: string;
  acquisitionDateEnd: string;
  resolution: number;
  cloudCoverage: number;
  offNadir: number;
  sensor: string;
  scanDirection: string;
  satelliteElevation: number;
  imageBands: string;
  geometry: GeoJSON.Geometry;
}
