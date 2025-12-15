import { LineChart } from "@mantine/charts";
import { Stack, Table, Text, Title } from "@mantine/core";
import { ReferenceArea } from "recharts";
import type { Data } from "../+data";

export function TemperatureTab({
  dailyTemperature,
}: {
  dailyTemperature: Data["normal"]["daily"]["temperature"];
}) {
  if (!dailyTemperature) {
    return (
      <Stack>
        <Text c="dimmed">この地点は気温データがありません。</Text>
      </Stack>
    );
  }

  // 日別気温データの準備
  const dailyData = [];
  for (const [month, temperatures] of Object.entries(dailyTemperature)) {
    if (!temperatures) continue;
    for (let i = 0; i < temperatures.length; i++) {
      const temperature = temperatures[i];
      if (temperature === null) continue;
      dailyData.push({ date: `${month}/${i + 1}`, temperature });
    }
  }

  return (
    <Stack gap="xl">
      <Stack>
        <Title size="h3">日別平均気温</Title>
        <LineChart
          h={300}
          data={dailyData}
          series={[{ name: "temperature", color: "red", label: "気温" }]}
          dataKey="date"
          curveType="monotone"
          gridProps={{ yAxisId: "left" }}
          withDots={false}
          tickLine="xy"
          xAxisProps={{
            interval: "equidistantPreserveStart",
          }}
          yAxisProps={{
            width: 35,
          }}
        >
          <ReferenceArea
            y2={24}
            yAxisId="left"
            label={{
              value: "ほぼ安全",
              position: "insideLeft",
              fontSize: 12,
              fill: "var(--mantine-color-dimmed)",
            }}
            fill="#218cff"
            fillOpacity={0.15}
          />
          <ReferenceArea
            y1={24}
            y2={28}
            yAxisId="left"
            label={{
              value: "注意",
              position: "insideLeft",
              fontSize: 12,
              fill: "var(--mantine-color-dimmed)",
            }}
            fill="#a0d2ff"
            fillOpacity={0.15}
          />
          <ReferenceArea
            y1={28}
            y2={31}
            yAxisId="left"
            label={{
              value: "警戒",
              position: "insideLeft",
              fontSize: 12,
              fill: "var(--mantine-color-dimmed)",
            }}
            fill="#faf500"
            fillOpacity={0.15}
          />
          <ReferenceArea
            y1={31}
            y2={35}
            yAxisId="left"
            label={{
              value: "厳重警戒",
              position: "insideLeft",
              fontSize: 12,
              fill: "var(--mantine-color-dimmed)",
            }}
            fill="#ff9600"
            fillOpacity={0.15}
          />
          <ReferenceArea
            y1={35}
            yAxisId="left"
            label={{
              value: "危険",
              position: "insideLeft",
              fontSize: 12,
              fill: "var(--mantine-color-dimmed)",
            }}
            fill="#ff2800"
            fillOpacity={0.15}
          />
        </LineChart>
      </Stack>

      <div>
        <Title size="h4" mb="sm">
          気温と運動の目安
        </Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>気温</Table.Th>
              <Table.Th>運動の目安</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>35°C以上</Table.Td>
              <Table.Td>運動は原則中止</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>31～34°C</Table.Td>
              <Table.Td>厳重警戒（激しい運動は中止）</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>28～30°C</Table.Td>
              <Table.Td>警戒 （積極的に休憩）</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>24～27°C</Table.Td>
              <Table.Td>注意 （積極的に水分補給）</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>24°C未満</Table.Td>
              <Table.Td>ほぼ安全 （適宜水分補給）</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </Stack>
  );
}
