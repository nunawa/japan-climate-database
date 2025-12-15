import { Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCloudRain,
  IconSun,
  IconTemperature,
} from "@tabler/icons-react";
import type { Data } from "../+data";

function MetricCard({
  title,
  icon,
  value,
  unit,
  nationalAverage,
}: {
  title: string;
  icon: React.ReactNode;
  value: number | null;
  unit: string;
  nationalAverage: number;
}) {
  if (value === null) {
    return (
      <Card shadow="sm" padding="lg" withBorder>
        <Stack gap="md">
          <Group gap="sm">
            {icon}
            <Text fw={500} size="sm">
              {title}
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            データなし
          </Text>
        </Stack>
      </Card>
    );
  }

  const difference = value - nationalAverage;
  const isHigher = difference > 0;

  return (
    <Card shadow="sm" padding="lg" withBorder>
      <Stack gap="md">
        <Group gap="sm">
          {icon}
          <Text fw={500} size="sm">
            {title}
          </Text>
        </Group>

        <Text size="xl" fw={700}>
          {value.toFixed(1)} {unit}
        </Text>

        <Stack gap={4}>
          <Text size="xs" c="dimmed">
            全国平均: {nationalAverage.toFixed(1)} {unit}
          </Text>
          <Text size="xs" fw={500} c={isHigher ? "red" : "blue"}>
            {isHigher ? "+" : ""}
            {difference.toFixed(1)} {unit}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}

export function MetricSummaryCards({
  normalYearly,
  wbgtYearly,
  nationalAverages,
}: {
  normalYearly: Data["normal"]["yearly"];
  wbgtYearly: Data["wbgt"]["yearly"];
  nationalAverages: Data["nationalAverages"];
}) {
  const ICON_SIZE = 20;

  const metrics = [
    {
      title: "年平均気温",
      icon: (
        <IconTemperature
          color={`var(--mantine-color-red-6)`}
          size={ICON_SIZE}
        />
      ),
      value: normalYearly.temperature,
      unit: "°C",
      nationalAverage: nationalAverages.temperature,
    },
    {
      title: "年間降水量",
      icon: (
        <IconCloudRain color={`var(--mantine-color-blue-6)`} size={ICON_SIZE} />
      ),
      value: normalYearly.precipitation,
      unit: "mm",
      nationalAverage: nationalAverages.precipitation,
    },
    {
      title: "年間日照時間",
      icon: (
        <IconSun color={`var(--mantine-color-yellow-6)`} size={ICON_SIZE} />
      ),
      value: normalYearly.sunshine_duration,
      unit: "時間",
      nationalAverage: nationalAverages.sunshine_duration,
    },
    {
      title: "年平均暑さ指数（4-10月）",
      icon: (
        <IconAlertTriangle
          color={`var(--mantine-color-orange-6)`}
          size={ICON_SIZE}
        />
      ),
      value: wbgtYearly,
      unit: "°C",
      nationalAverage: nationalAverages.wbgt,
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          icon={metric.icon}
          value={metric.value}
          unit={metric.unit}
          nationalAverage={metric.nationalAverage}
        />
      ))}
    </SimpleGrid>
  );
}
