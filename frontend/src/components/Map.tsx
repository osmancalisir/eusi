// frontend/src/components/Map.tsx

import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from "ol/style";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import type { Geometry as GeoJSONGeometry } from "geojson";

interface MapProps {
  geojson: GeoJSONGeometry | null;
  onFeatureSelect: (feature: any) => void; // eslint-disable-line no-unused-vars
  themeMode?: "light" | "dark";
}

export interface MapRef {
  clearFeatures: () => void;
}

const loadViewState = () => {
  const saved = localStorage.getItem("mapViewState");
  return saved ? JSON.parse(saved) : null;
};

const saveViewState = (view: View) => {
  const center = view.getCenter();
  const zoom = view.getZoom();
  if (center && zoom !== undefined) {
    localStorage.setItem("mapViewState", JSON.stringify({ center, zoom }));
  }
};

const MapComponent = forwardRef<MapRef, MapProps>(({ geojson, onFeatureSelect, themeMode = "dark" }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef(new VectorSource());
  const vectorLayer = useRef(new VectorLayer({ source: vectorSource.current }));

  const strokeColor = themeMode === "dark" ? "#840032" : "#002642";
  const fillColor = themeMode === "dark" ? "rgba(132, 0, 50, 0.2)" : "rgba(0, 38, 66, 0.2)";

  useEffect(() => {
    if (!mapRef.current) return;

    const savedView = loadViewState();
    const initialCenter = savedView?.center || fromLonLat([11.5, 48.1]);
    const initialZoom = savedView?.zoom || 10;

    const view = new View({
      center: initialCenter,
      zoom: initialZoom,
    });

    let saveTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleViewChange = () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveViewState(view);
      }, 500);
    };

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
          className: themeMode === "dark" ? "ol-layer-dark" : "",
        }),
        vectorLayer.current,
      ],
      view: view,
    });

    view.on("change", handleViewChange);

    const clickHandler = (event: any) => {
      if (!mapInstance.current) return;

      const feature = mapInstance.current.forEachFeatureAtPixel(event.pixel, (f) => f);

      if (feature instanceof Feature) {
        onFeatureSelect(feature.getProperties());
      }
    };

    mapInstance.current.on("click", clickHandler);

    return () => {
      view.un("change", handleViewChange);
      if (saveTimeout) clearTimeout(saveTimeout);
      if (mapInstance.current) {
        mapInstance.current.un("click", clickHandler);
        mapInstance.current.setTarget(undefined);
      }
    };
  }, [onFeatureSelect, themeMode]);

  useEffect(() => {
    vectorSource.current.clear();

    if (geojson) {
      try {
        const feature = {
          type: "Feature",
          properties: {},
          geometry: geojson,
        };

        const features = new GeoJSON().readFeatures(feature, {
          featureProjection: "EPSG:3857",
          dataProjection: "EPSG:4326",
        });

        features.forEach((feature) => {
          feature.setStyle(
            new Style({
              fill: new Fill({ color: fillColor }),
              stroke: new Stroke({ color: strokeColor, width: 2 }),
            })
          );
          feature.set("type", "aoi");
        });

        vectorSource.current.addFeatures(features);

        if (features.length > 0 && mapInstance.current) {
          const extent = vectorSource.current.getExtent();
          if (extent[0] !== Infinity) {
            mapInstance.current.getView().fit(extent, {
              padding: [50, 50, 50, 50],
              duration: 500,
            });
          }
        }
      } catch (error) {
        console.error("Error rendering GeoJSON:", error);
      }
    }
  }, [geojson, fillColor, strokeColor]);

  /**
   * The "useImperativeHandle" hook forces parent components to use imperative commands
   * I used this as the latest alternative since clearing the file from the system somehow did not worked
   * Even though the map is not showing the location anymore, it simply keep it.
   */
  useImperativeHandle(ref, () => ({
    clearFeatures: () => vectorSource.current.clear(),
  }));

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
      style={{
        backgroundColor: themeMode === "dark" ? "#333" : "#f0f0f0",
        borderRadius: "8px",
        minHeight: "600px",
      }}
    />
  );
});

MapComponent.displayName = "Map";
export default MapComponent;
