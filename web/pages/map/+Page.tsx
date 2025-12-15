import { Container, Stack, Tabs, Title } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCloudRain,
  IconSun,
  IconTemperature,
} from "@tabler/icons-react";
import { ColorSpecification, DataDrivenPropertyValueSpecification } from "maplibre-gl";
import { usePageContext } from "vike-react/usePageContext";
import { BaseMap, type MetricType } from "./conponents/BaseMap";
import type { PageContext } from "./types";

export default function Page() {
  const { data } = usePageContext() as PageContext;

  const metrics = [
    {
      type: "temperature" as MetricType,
      title: "気温",
      icon: IconTemperature,
      unit: "℃",
      getValue: (d: PageContext["data"][number]) => d.normal.yearly.temperature,
      colorScale: [
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
      ] as DataDrivenPropertyValueSpecification<ColorSpecification>,
    },
    {
      type: "precipitation" as MetricType,
      title: "降水量",
      icon: IconCloudRain,
      unit: "mm",
      getValue: (d: PageContext["data"][number]) =>
        d.normal.yearly.precipitation,
      colorScale: [
        "step",
        ["get", "value"],
        "#f0f9ff",
        1000,
        "#bae6fd",
        1500,
        "#60a5fa",
        2000,
        "#2563eb",
        2500,
        "#1d4ed8",
        3000,
        "#1e3a8a",
      ] as DataDrivenPropertyValueSpecification<ColorSpecification>,
    },
    {
      type: "sunshine_duration" as MetricType,
      title: "日照時間",
      icon: IconSun,
      unit: "時間",
      getValue: (d: PageContext["data"][number]) =>
        d.normal.yearly.sunshine_duration,
      colorScale: [
        "step",
        ["get", "value"],
        "#fef08a",
        1400,
        "#facc15",
        1600,
        "#fb923c",
        1800,
        "#f97316",
        2000,
        "#ea580c",
        2200,
        "#dc2626",
      ] as DataDrivenPropertyValueSpecification<ColorSpecification>,
    },
    {
      type: "wbgt" as MetricType,
      title: "WBGT",
      icon: IconAlertTriangle,
      unit: "℃",
      getValue: (d: PageContext["data"][number]) => d.wbgt.yearly,
      colorScale: [
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
      ] as DataDrivenPropertyValueSpecification<ColorSpecification>,
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title>マップ</Title>

        <Tabs
          defaultValue={metrics[0].type}
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

          {metrics.map((metric) => (
            <Tabs.Panel key={metric.type} value={metric.type} pt="lg">
              <BaseMap
                data={data}
                metric={metric.type}
                unit={metric.unit}
                getValue={metric.getValue}
                colorScale={metric.colorScale}
              />
            </Tabs.Panel>
          ))}
        </Tabs>
      </Stack>
    </Container>
  );
}
