import { BarChart } from "@mantine/charts";
import { Stack, Text, Title } from "@mantine/core";
import type { Data } from "../+data";

export function SunshineDurationTab({
  monthlySunshineDuaration,
}: {
  monthlySunshineDuaration: Data["normal"]["monthly"]["sunshine_duration"];
}) {
  if (!monthlySunshineDuaration) {
    return (
      <Stack>
        <Text c="dimmed">この地点は日照時間データがありません。</Text>
      </Stack>
    );
  }

  // 月別日照時間データの準備
  const monthlyData = [];
  for (let i = 0; i < monthlySunshineDuaration.length; i++) {
    const sunshine = monthlySunshineDuaration[i];
    if (sunshine === null) continue;
    monthlyData.push({
      month: `${i + 1}月`,
      sunshine,
    });
  }

  return (
    <Stack gap="xl">
      <div>
        <Title order={2} size="h3" mb="md">
          月別日照時間
        </Title>
        <BarChart
          h={300}
          data={monthlyData}
          series={[{ name: "sunshine", color: "yellow.6", label: "日照時間" }]}
          dataKey="month"
          gridProps={{ yAxisId: "left" }}
          yAxisProps={{ domain: [0, "auto"] }}
          unit=" 時間"
        />
      </div>
    </Stack>
  );
}
