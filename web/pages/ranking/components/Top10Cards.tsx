import {
  Anchor,
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { Data } from "../+data";

function getMedalEmoji(rank: number): string {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return "";
  }
}

export function Top10Cards({
  stations,
  unit,
}: {
  stations:
    | Data["temperatureStations"]
    | Data["precipitationStations"]
    | Data["sunshineDurationStations"]
    | Data["wbgtStations"];
  unit: string;
}) {
  const top10 = stations.slice(0, 10);

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="sm">
      {top10.map((station, index) => {
        const rank = index + 1;
        return (
          <Card
            key={station.station_number}
            shadow="xs"
            padding="md"
            withBorder
          >
            <Stack gap="xs">
              <Group justify="space-between">
                <Badge
                  size="lg"
                  variant={rank <= 3 ? "filled" : "light"}
                  color={rank <= 3 ? "yellow" : "gray"}
                >
                  {rank <= 3 && getMedalEmoji(rank)} {rank}位
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                {station.prefecture}
              </Text>
              <Anchor
                href={`/station/${station.station_number}`}
                target="_blank"
                rel="noopener"
                fw={700}
              >
                {station.station_name}
              </Anchor>
              <Title size="h3" c={rank <= 3 ? "yellow" : undefined}>
                {station.value} {unit}
              </Title>
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
