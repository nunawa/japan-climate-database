import { Container, Stack, Tabs } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCloudRain,
  IconSun,
  IconTemperature,
} from "@tabler/icons-react";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";
import { MetricSummaryCards } from "./components/MetricSummaryCards";
import { PrecipitationTab } from "./components/PrecipitationTab";
import { StationHeader } from "./components/StationHeader";
import { SunshineDurationTab } from "./components/SunshineDurationTab";
import { TemperatureTab } from "./components/TemperatureTab";
import { WbgtTab } from "./components/WbgtTab";

export default function Page() {
  const { stationInfo, normal, wbgt, nationalAverages } = useData<Data>();

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <StationHeader stationInfo={stationInfo} />

        <MetricSummaryCards
          normalYearly={normal.yearly}
          wbgtYearly={wbgt.yearly}
          nationalAverages={nationalAverages}
        />

        <Tabs defaultValue="temperature" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab
              value="temperature"
              leftSection={<IconTemperature size={16} />}
            >
              気温
            </Tabs.Tab>
            <Tabs.Tab
              value="precipitation"
              leftSection={<IconCloudRain size={16} />}
            >
              降水量
            </Tabs.Tab>
            <Tabs.Tab value="sunshine" leftSection={<IconSun size={16} />}>
              日照時間
            </Tabs.Tab>
            <Tabs.Tab
              value="wbgt"
              leftSection={<IconAlertTriangle size={16} />}
            >
              暑さ指数
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="temperature" pt="xl">
            <TemperatureTab dailyTemperature={normal.daily.temperature} />
          </Tabs.Panel>

          <Tabs.Panel value="precipitation" pt="xl">
            <PrecipitationTab
              monthlyPrecipitation={normal.monthly.precipitation}
            />
          </Tabs.Panel>

          <Tabs.Panel value="sunshine" pt="xl">
            <SunshineDurationTab
              monthlySunshineDuaration={normal.monthly.sunshine_duration}
            />
          </Tabs.Panel>

          <Tabs.Panel value="wbgt" pt="xl">
            <WbgtTab dailyWbgt={wbgt.daily} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
