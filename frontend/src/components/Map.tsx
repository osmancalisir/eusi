// frontend/src/components/Map.tsx
import React, { useEffect, useRef } from "react";
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
  // eslint-disable-next-line no-unused-vars
  onFeatureSelect: (feature: any) => void;
  themeMode?: "light" | "dark";
}

const MapComponent = ({ geojson, onFeatureSelect, themeMode = "dark" }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef(new VectorSource());
  const vectorLayer = useRef(new VectorLayer({ source: vectorSource.current }));

  const strokeColor = themeMode === "dark" ? "#840032" : "#002642";
  const fillColor = themeMode === "dark" ? "rgba(132, 0, 50, 0.2)" : "rgba(0, 38, 66, 0.2)";

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const view = new View({
      center: fromLonLat([11.5, 48.1]),
      zoom: 10,
    });

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

    const clickHandler = (event: any) => {
      const feature = mapInstance.current?.forEachFeatureAtPixel(event.pixel, (f) => f);
      if (feature instanceof Feature) {
        onFeatureSelect(feature.getProperties());
      }
    };

    mapInstance.current.on("click", clickHandler);

    return () => {
      mapInstance.current?.un("click", clickHandler);
      mapInstance.current?.setTarget(undefined);
      vectorSource.current.clear();
      vectorSource.current.dispose();
      mapInstance.current?.dispose();
    };
  }, [onFeatureSelect, themeMode]);

  // Handle GeoJSON changes
  useEffect(() => {
    vectorSource.current.clear();

    if (geojson) {
      try {
        const feature = { type: "Feature", properties: {}, geometry: geojson };
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
          mapInstance.current.getView().fit(vectorSource.current.getExtent(), {
            padding: [50, 50, 50, 50],
            duration: 500,
          });
        }
      } catch (error) {
        console.error("Error rendering GeoJSON:", error);
      }
    }
  }, [geojson, fillColor, strokeColor]);

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
};

export default MapComponent;
