import { Card, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { IconLocation, IconMapPin, IconMountain } from "@tabler/icons-react";
import { Map as MapGL, Marker } from "react-map-gl/maplibre";
import type { Data } from "../+data";

export function StationHeader({
  stationInfo,
}: {
  stationInfo: Data["stationInfo"];
}) {
  return (
    <Card shadow="sm" padding="lg" withBorder>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                {stationInfo.prefecture}
              </Text>
              <Title size="h2">{stationInfo.station_name}</Title>
            </Stack>

            <Stack gap="xs">
              <Group gap="xs">
                <IconMapPin size={18} />
                <Text size="sm">
                  緯度経度: {stationInfo.latitude.toFixed(4)},{" "}
                  {stationInfo.longitude.toFixed(4)}
                </Text>
              </Group>

              <Group gap="xs">
                <IconLocation size={18} />
                <Text size="sm">所在地: {stationInfo.address}</Text>
              </Group>

              {stationInfo.altitude !== null && (
                <Group gap="xs">
                  <IconMountain size={18} />
                  <Text size="sm">
                    標高: {stationInfo.altitude.toFixed(1)} m
                  </Text>
                </Group>
              )}
            </Stack>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <MapGL
            style={{ height: 200, borderRadius: 8 }}
            cursor="default"
            mapStyle="https://tiles.openfreemap.org/styles/positron"
            initialViewState={{
              longitude: stationInfo.longitude,
              latitude: stationInfo.latitude,
              zoom: 6.5,
            }}
            maxBounds={[
              [112.9325, 19.049806],
              [163.986667, 50.557778],
            ]}
            interactive={false}
          >
            <Marker
              longitude={stationInfo.longitude}
              latitude={stationInfo.latitude}
              color="red"
            />
          </MapGL>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
