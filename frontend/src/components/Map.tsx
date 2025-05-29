// src/components/Map.tsx

import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import type { Geometry as GeoJSONGeometry } from 'geojson';

interface MapProps {
  geojson: GeoJSONGeometry | null;
  onFeatureSelect: (feature: any) => void;
}

export interface MapRef {
  clearFeatures: () => void;
}

const MapComponent = forwardRef<MapRef, MapProps>(({ geojson, onFeatureSelect }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef(new VectorSource());
  const vectorLayer = useRef(new VectorLayer({ source: vectorSource.current }));

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer.current
      ],
      view: new View({
        center: fromLonLat([11.5, 48.1]),
        zoom: 10
      })
    });

    const clickHandler = (event: any) => {
      if (!mapInstance.current) return;
      
      const feature = mapInstance.current.forEachFeatureAtPixel(
        event.pixel,
        (f) => f
      );
      
      if (feature instanceof Feature) {
        onFeatureSelect(feature.getProperties());
      }
    };

    mapInstance.current.on('click', clickHandler);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.un('click', clickHandler);
        mapInstance.current.setTarget(undefined);
      }
    };
  }, [onFeatureSelect]);

  useEffect(() => {
    vectorSource.current.clear();
    
    if (geojson) {
      try {
        const feature = {
          type: 'Feature',
          properties: {},
          geometry: geojson
        };
        
        const features = new GeoJSON().readFeatures(feature, {
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:4326'
        });

        features.forEach(feature => {
          feature.setStyle(new Style({
            fill: new Fill({ color: 'rgba(132, 0, 50, 0.2)' }),
            stroke: new Stroke({ color: '#840032', width: 2 })
          }));
          feature.set('type', 'aoi');
        });

        vectorSource.current.addFeatures(features);

        const extent = vectorSource.current.getExtent();
        if (extent[0] !== Infinity && mapInstance.current) {
          mapInstance.current.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 500
          });
        }
      } catch (error) {
        console.error('Error rendering GeoJSON:', error);
      }
    }
  }, [geojson]);

  useImperativeHandle(ref, () => ({
    clearFeatures: () => vectorSource.current.clear()
  }));

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg" />;
});

MapComponent.displayName = 'Map';
export default MapComponent;
