import { Container, Stack, Tabs, Title } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCloudRain,
  IconSun,
  IconTemperature,
} from "@tabler/icons-react";
import { useState } from "react";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";
import { RankingTable } from "./components/RankingTable";
import { Top10Cards } from "./components/Top10Cards";

type MetricType =
  | "temperature"
  | "precipitation"
  | "sunshine_duration"
  | "wbgt";

export default function Page() {
  const data = useData<Data>();
  const [activeMetric, setActiveMetric] = useState<MetricType>("temperature");

  const metrics = [
    {
      type: "temperature" as MetricType,
      title: "気温",
      icon: IconTemperature,
      unit: "℃",
      data: data.temperatureStations,
    },
    {
      type: "precipitation" as MetricType,
      title: "降水量",
      icon: IconCloudRain,
      unit: "mm",
      data: data.precipitationStations,
    },
    {
      type: "sunshine_duration" as MetricType,
      title: "日照時間",
      icon: IconSun,
      unit: "時間",
      data: data.sunshineDurationStations,
    },
    {
      type: "wbgt" as MetricType,
      title: "WBGT",
      icon: IconAlertTriangle,
      unit: "℃",
      data: data.wbgtStations,
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Title>ランキング</Title>

        {/* タブナビゲーション */}
        <Tabs
          value={activeMetric}
          onChange={(value) => setActiveMetric(value as MetricType)}
          keepMounted={false}
        >
          <Tabs.List>
            {metrics.map((metric) => (
              <Tabs.Tab
                key={metric.type}
                value={metric.type}
                leftSection={<metric.icon size={16} />}
              >
                {metric.title}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {/* 各タブのコンテンツ */}
          {metrics.map((metric) => (
            <Tabs.Panel key={metric.type} value={metric.type} pt="lg">
              <Stack gap="xl">
                <Stack gap="md">
                  <Title order={2}>TOP 10</Title>
                  <Top10Cards
                    stations={metric.data.slice(0, 10)}
                    unit={metric.unit}
                  />
                </Stack>

                <Stack gap="md">
                  <Title order={2}>詳細ランキング</Title>
                  <RankingTable
                    stations={metric.data}
                    unit={metric.unit}
                    prefectures={data.prefectures}
                    regions={data.regions}
                  />
                </Stack>
              </Stack>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Stack>
    </Container>
  );
}
