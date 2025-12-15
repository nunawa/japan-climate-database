import {
  Anchor,
  Box,
  Card,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { PageContext } from "../types";

export function PrefectureStations({
  stations,
}: {
  stations: PageContext["data"]["prefectural_capital_stations"];
}) {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack>
          <Title size="h2" ta="center">
            都道府県別の代表地点
          </Title>
          <Text c="dimmed" ta="center">
            47都道府県の県庁所在地の気象データを確認
          </Text>
        </Stack>

        <Box>
          <Stack gap="lg">
            {Object.entries(stations).map(([regionName, regionStations]) => (
              <Stack key={regionName} gap="sm">
                <Text size="sm" fw={600}>
                  {regionName}
                </Text>
                <SimpleGrid
                  cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
                  spacing="xs"
                >
                  {regionStations.map((station) => (
                    <Anchor
                      key={station.id}
                      href={`/station/${station.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card padding="xs" withBorder>
                        <Stack gap={2}>
                          <Text size="xs" c="dimmed">
                            {station.prefecture}
                          </Text>
                          <Text size="sm" fw={600}>
                            {station.name}
                          </Text>
                        </Stack>
                      </Card>
                    </Anchor>
                  ))}
                </SimpleGrid>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
