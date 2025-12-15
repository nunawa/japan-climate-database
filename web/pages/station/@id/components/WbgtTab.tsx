import { LineChart } from "@mantine/charts";
import { Stack, Table, Text, Title } from "@mantine/core";
import { ReferenceArea } from "recharts";
import type { Data } from "../+data";

export function WbgtTab({ dailyWbgt }: { dailyWbgt: Data["wbgt"]["daily"] }) {
  if (!dailyWbgt) {
    return (
      <Stack>
        <Text c="dimmed">この地点は暑さ指数（WBGT）データがありません。</Text>
      </Stack>
    );
  }

  // 日別WBGTデータの準備
  const dailyData = Object.entries(dailyWbgt).map(
    ([date, { min, max, avg }]) => ({ date, min, max, avg }),
  );

  return (
    <Stack gap="xl">
      <Stack>
        <Title size="h3">日別平均暑さ指数（WBGT）</Title>
        <Text size="sm" c="dimmed">
          暑さ指数（WBGT：湿球黒球温度）は、熱中症予防のための指標です。気温、湿度、輻射熱、気流を総合的に評価することができます。
        </Text>
        <LineChart
          h={300}
          data={dailyData}
          series={[
            { name: "min", color: "blue.6", label: "最低" },
            { name: "max", color: "red.6", label: "最高" },
            { name: "avg", color: "gray.6", label: "平均" },
          ]}
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
            y2={21}
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
            y1={21}
            y2={25}
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
            y1={25}
            y2={28}
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
            y1={28}
            y2={31}
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
            y1={31}
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
          暑さ指数（WBGT）と運動の目安
        </Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>暑さ指数（WBGT）</Table.Th>
              <Table.Th>運動の目安</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>31°C以上</Table.Td>
              <Table.Td>運動は原則中止</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>28～30°C</Table.Td>
              <Table.Td>厳重警戒（激しい運動は中止）</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>25～27°C</Table.Td>
              <Table.Td>警戒 （積極的に休憩）</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>21～24°C</Table.Td>
              <Table.Td>注意 （積極的に水分補給）</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>21°C未満</Table.Td>
              <Table.Td>ほぼ安全 （適宜水分補給）</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </Stack>
  );
}
