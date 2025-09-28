import { Anchor, Container } from "@mantine/core";
import type { FeatureCollection, Point } from "geojson";
import { useCallback, useRef, useState } from "react";
import {
  Layer,
  MapGeoJSONFeature,
  Map as MapGL,
  MapMouseEvent,
  MapRef,
  Popup,
  Source,
} from "react-map-gl/maplibre";
import { usePageContext } from "vike-react/usePageContext";
import type { PageContext } from "./types";

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

function NormalMap({ data }: { data: PageContext["data"] }) {
  const normalMapRef = useRef<MapRef>(null);
  const [normalPopupInfo, setNormalPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    value: number | null;
    station_number: string;
    station_name: string;
  } | null>(null);

  const normalGeoJSON: FeatureCollection<
    Point,
    { value: number | null; station_number: string }
  > = {
    type: "FeatureCollection",
    features: data
      .filter((d) => d.normal.yearly.temperature !== null)
      .map((d) => ({
        type: "Feature",
        properties: {
          value: d.normal.yearly.temperature,
          station_number: d.station_number,
          station_name: d.station_name,
        },
        geometry: {
          type: "Point",
          coordinates: [d.coordinates.longitude, d.coordinates.latitude],
        },
      })),
  };

  const onNormalMapLoad = useCallback(() => {
    if (!normalMapRef.current) return;

    const map = normalMapRef.current.getMap();
    setJaLabels(map);
  }, []);

  const onNormalMapClick = useCallback(
    (
      event: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      },
    ) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const geometry = feature.geometry as Point;
      setNormalPopupInfo({
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
        value: feature.properties.value,
        station_number: feature.properties.station_number,
        station_name: feature.properties.station_name,
      });
    },
    [],
  );

  const onNormalMapMouseEnter = useCallback(() => {
    if (!normalMapRef.current) return;
    const map = normalMapRef.current.getMap();
    map.getCanvas().style.cursor = "pointer";
  }, []);

  const onNormalMapMouseLeave = useCallback(() => {
    if (!normalMapRef.current) return;
    const map = normalMapRef.current.getMap();
    map.getCanvas().style.cursor = "";
  }, []);

  return (
    <MapGL
      style={{ height: 600 }}
      ref={normalMapRef}
      onLoad={onNormalMapLoad}
      onClick={onNormalMapClick}
      onMouseEnter={onNormalMapMouseEnter}
      onMouseLeave={onNormalMapMouseLeave}
      interactiveLayerIds={["normal-circles"]}
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
      <Source id="normal-points" type="geojson" data={normalGeoJSON}>
        <Layer
          id="normal-circles"
          type="circle"
          paint={{
            "circle-radius": 5,
            "circle-color": [
              "step",
              ["get", "value"],
              "#4dc4ff",
              5,
              "#005aff",
              10,
              "#03af7a",
              15,
              "#f6aa00",
              20,
              "#ff4600",
            ],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1,
          }}
        />
      </Source>
      {normalPopupInfo && (
        <Popup
          longitude={normalPopupInfo.longitude}
          latitude={normalPopupInfo.latitude}
          onClose={() => setNormalPopupInfo(null)}
        >
          <div>
            <Anchor
              href={`/point/${normalPopupInfo.station_number}`}
              target="_blank"
              rel="noopener"
            >
              <strong>{normalPopupInfo.station_name}</strong>
            </Anchor>
            <br />
            Yearly Average Temperature:{" "}
            {normalPopupInfo.value !== null
              ? normalPopupInfo.value.toFixed(1)
              : "N/A"}{" "}
            °C
          </div>
        </Popup>
      )}
    </MapGL>
  );
}

function WbgtMap({ data }: { data: PageContext["data"] }) {
  const wbgtMapRef = useRef<MapRef>(null);
  const [wbgtPopupInfo, setWbgtPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    value: number | null;
    station_number: string;
    station_name: string;
  } | null>(null);

  const wbgtGeoJSON: FeatureCollection<
    Point,
    { value: number | null; station_number: string }
  > = {
    type: "FeatureCollection",
    features: data
      .filter((d) => d.wbgt.yearly !== null)
      .map((d) => ({
        type: "Feature",
        properties: {
          value: d.wbgt.yearly,
          station_number: d.station_number,
          station_name: d.station_name,
        },
        geometry: {
          type: "Point",
          coordinates: [d.coordinates.longitude, d.coordinates.latitude],
        },
      })),
  };

  const onWbgtMapLoad = useCallback(() => {
    if (!wbgtMapRef.current) return;

    const map = wbgtMapRef.current.getMap();
    setJaLabels(map);
  }, []);

  const onWbgtMapClick = useCallback(
    (
      event: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      },
    ) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const geometry = feature.geometry as Point;
      setWbgtPopupInfo({
        longitude: geometry.coordinates[0],
        latitude: geometry.coordinates[1],
        value: feature.properties.value,
        station_number: feature.properties.station_number,
        station_name: feature.properties.station_name,
      });
    },
    [],
  );

  const onWbgtMouseEnter = useCallback(() => {
    if (!wbgtMapRef.current) return;
    const map = wbgtMapRef.current.getMap();
    map.getCanvas().style.cursor = "pointer";
  }, []);

  const onWbgtMouseLeave = useCallback(() => {
    if (!wbgtMapRef.current) return;
    const map = wbgtMapRef.current.getMap();
    map.getCanvas().style.cursor = "";
  }, []);

  return (
    <MapGL
      style={{ height: 600 }}
      ref={wbgtMapRef}
      onLoad={onWbgtMapLoad}
      onClick={onWbgtMapClick}
      onMouseEnter={onWbgtMouseEnter}
      onMouseLeave={onWbgtMouseLeave}
      interactiveLayerIds={["wbgt-circles"]}
      initialViewState={{
        longitude: 134.401464,
        latitude: 35.552141,
        zoom: 3.5,
      }}
      minZoom={3}
      maxZoom={13}
      maxBounds={[
        [112.9325, 19.049806],
        [158.892814, 50.557778],
      ]}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
    >
      <Source id="wbgt-points" type="geojson" data={wbgtGeoJSON}>
        <Layer
          id="wbgt-circles"
          type="circle"
          paint={{
            "circle-radius": 5,
            "circle-color": [
              "step",
              ["get", "value"],
              "#4dc4ff",
              15,
              "#005aff",
              18,
              "#03af7a",
              21,
              "#f6aa00",
              24,
              "#ff4600",
            ],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1,
          }}
        />
      </Source>
      {wbgtPopupInfo && (
        <Popup
          longitude={wbgtPopupInfo.longitude}
          latitude={wbgtPopupInfo.latitude}
          onClose={() => setWbgtPopupInfo(null)}
        >
          <div>
            <Anchor
              href={`/point/${wbgtPopupInfo.station_number}`}
              target="_blank"
              rel="noopener"
            >
              <strong>{wbgtPopupInfo.station_name}</strong>
            </Anchor>
            <br />
            Yearly WBGT:{" "}
            {wbgtPopupInfo.value !== null
              ? wbgtPopupInfo.value.toFixed(1)
              : "N/A"}{" "}
            °C
          </div>
        </Popup>
      )}
    </MapGL>
  );
}

export default function Page() {
  const { data } = usePageContext() as PageContext;

  return (
    <>
      <Container>
        <h1>Normal</h1>
        <NormalMap data={data} />
      </Container>
      <Container>
        <h1>WBGT</h1>
        <WbgtMap data={data} />
      </Container>
    </>
  );
}
