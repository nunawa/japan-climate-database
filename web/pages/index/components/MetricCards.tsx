import {
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconChartBar,
  IconCloudRain,
  IconMap,
  IconSun,
  IconTemperature,
} from "@tabler/icons-react";
import type { PageContext } from "../types";

export function MetricCards({ data }: { data: PageContext["data"] }) {
  const metrics = [
    {
      title: "気温",
      icon: IconTemperature,
      color: "red",
      description: "年平均気温",
      average: Math.round(data.averages.temperature * 10) / 10,
      unit: "℃",
      maxStation: data.max_station.temperature,
      minStation: data.min_station.temperature,
    },
    {
      title: "降水量",
      icon: IconCloudRain,
      color: "blue",
      description: "年間降水量",
      average: Math.round(data.averages.precipitation),
      unit: "mm",
      maxStation: data.max_station.precipitation,
      minStation: data.min_station.precipitation,
    },
    {
      title: "日照時間",
      icon: IconSun,
      color: "yellow",
      description: "年間日照時間",
      average: Math.round(data.averages.sunshine_duration),
      unit: "時間",
      maxStation: data.max_station.sunshine_duration,
      minStation: data.min_station.sunshine_duration,
    },
    {
      title: "WBGT（暑さ指数）",
      icon: IconAlertTriangle,
      color: "orange",
      description: "年平均暑さ指数（4-10月）",
      average: Math.round(data.averages.wbgt * 10) / 10,
      unit: "℃",
      maxStation: data.max_station.wbgt,
      minStation: data.min_station.wbgt,
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title size="h2" ta="center">
          気象指標
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="lg">
          {metrics.map((metric) => (
            <Card
              key={metric.title}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Stack gap="md">
                <Stack gap="xs">
                  <Group gap="sm">
                    <metric.icon
                      size={32}
                      color={`var(--mantine-color-${metric.color}-6)`}
                    />
                    <Title size="h4">{metric.title}</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {metric.description}
                  </Text>
                </Stack>

                <Group gap="xs" justify="space-between" align="baseline">
                  <Text size="sm">全国平均</Text>
                  <Group align="baseline" gap="xs">
                    <Title size="h1" c={metric.color}>
                      {metric.average}
                    </Title>
                    <Text size="sm">{metric.unit}</Text>
                  </Group>
                </Group>

                <Table>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td px={0} c="dimmed">
                        最高地点
                      </Table.Td>
                      <Table.Td
                        px={0}
                        ta="right"
                      >{`${metric.maxStation.name} (${metric.maxStation.value} ${metric.unit})`}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td px={0} c="dimmed">
                        最低地点
                      </Table.Td>
                      <Table.Td
                        px={0}
                        ta="right"
                      >{`${metric.minStation.name} (${metric.minStation.value} ${metric.unit})`}</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>

                <Stack gap="sm">
                  <Button
                    component="a"
                    href="/map"
                    size="xs"
                    variant="light"
                    leftSection={<IconMap size={14} />}
                  >
                    地図
                  </Button>
                  <Button
                    component="a"
                    href="/ranking"
                    size="xs"
                    variant="light"
                    leftSection={<IconChartBar size={14} />}
                  >
                    ランキング
                  </Button>
                </Stack>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
