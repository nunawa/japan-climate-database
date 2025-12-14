import { Anchor } from "@mantine/core";
import type { FeatureCollection, Point } from "geojson";
import type {
  ColorSpecification,
  DataDrivenPropertyValueSpecification,
} from "maplibre-gl";
import { useCallback, useRef, useState } from "react";
import {
  Layer,
  type MapGeoJSONFeature,
  Map as MapGL,
  type MapMouseEvent,
  type MapRef,
  Popup,
  Source,
} from "react-map-gl/maplibre";
import type { PageContext } from "../types";

function setJaLabels(map: maplibregl.Map) {
  const layers = [
    "waterway_line_label",
    "water_name_point_label",
    "water_name_line_label",
    "highway-name-path",
    "highway-name-minor",
    "highway-name-major",
    "airport",
    "label_other",
    "label_village",
    "label_town",
    "label_state",
    "label_city",
    "label_city_capital",
    "label_country_3",
    "label_country_2",
    "label_country_1",
  ];
  layers.forEach((layer) => {
    map.setLayoutProperty(layer, "text-field", ["get", "name:ja"]);
  });
}

export type MetricType =
  | "temperature"
  | "precipitation"
  | "sunshine_duration"
  | "wbgt";

interface BaseMapProps {
  data: PageContext["data"];
  metric: MetricType;
  unit: string;
  getValue: (d: PageContext["data"][number]) => number | null;
  colorScale: DataDrivenPropertyValueSpecification<ColorSpecification>;
}

export function BaseMap({
  data,
  metric,
  unit,
  getValue,
  colorScale,
}: BaseMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    value: number | null;
    station_number: string;
    station_name: string;
  } | null>(null);

  const geoJSON: FeatureCollection<
    Point,
    { value: number | null; station_number: string }
  > = {
    type: "FeatureCollection",
    features: data
      .filter((d) => getValue(d) !== null)
      .map((d) => ({
        type: "Feature",
        properties: {
          value: getValue(d),
          station_number: d.station_number,
          station_name: d.station_name,
        },
        geometry: {
          type: "Point",
          coordinates: [d.coordinates.longitude, d.coordinates.latitude],
        },
      })),
  };

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    setJaLabels(map);
  }, []);

  const onMapClick = useCallback(
    (
      event: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      },
    ) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const geometry = feature.geometry as Point;
      setPopupInfo({
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
        value: feature.properties.value,
        station_number: feature.properties.station_number,
        station_name: feature.properties.station_name,
      });
    },
    [],
  );

  const onMouseEnter = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    map.getCanvas().style.cursor = "pointer";
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    map.getCanvas().style.cursor = "";
  }, []);

  const layerId = `${metric}-circles`;
  const sourceId = `${metric}-points`;

  return (
    <MapGL
      style={{ height: 600 }}
      ref={mapRef}
      onLoad={onMapLoad}
      onClick={onMapClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      interactiveLayerIds={[layerId]}
      initialViewState={{
        longitude: 138.4595835,
        latitude: 34.803792,
        zoom: 3.5,
      }}
      minZoom={3}
      maxZoom={13}
      maxBounds={[
        [112.9325, 19.049806],
        [163.986667, 50.557778],
      ]}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
    >
      <Source id={sourceId} type="geojson" data={geoJSON}>
        <Layer
          id={layerId}
          type="circle"
          paint={{
            "circle-radius": 5,
            "circle-color": colorScale,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1,
          }}
        />
      </Source>
      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
        >
          <div>
            <Anchor
              href={`/station/${popupInfo.station_number}`}
              target="_blank"
              rel="noopener"
            >
              <strong>{popupInfo.station_name}</strong>
            </Anchor>
            <br />
            {popupInfo.value !== null ? popupInfo.value.toFixed(1) : "N/A"}{" "}
            {unit}
          </div>
        </Popup>
      )}
    </MapGL>
  );
}
