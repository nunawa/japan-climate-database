import { BarChart } from "@mantine/charts";
import { Stack, Text, Title } from "@mantine/core";
import type { Data } from "../+data";

export function PrecipitationTab({
  monthlyPrecipitation,
}: {
  monthlyPrecipitation: Data["normal"]["monthly"]["precipitation"];
}) {
  if (!monthlyPrecipitation) {
    return (
      <Stack>
        <Text c="dimmed">この地点は降水量データがありません。</Text>
      </Stack>
    );
  }

  // 月別降水量データの準備
  const monthlyData = [];
  for (let i = 0; i < monthlyPrecipitation.length; i++) {
    const precipitation = monthlyPrecipitation[i];
    if (precipitation === null) continue;
    monthlyData.push({
      month: `${i + 1}月`,
      precipitation,
    });
  }

  return (
    <Stack gap="xl">
      <div>
        <Title order={2} size="h3" mb="md">
          月別降水量
        </Title>
        <BarChart
          h={300}
          data={monthlyData}
          series={[{ name: "precipitation", color: "blue", label: "降水量" }]}
          dataKey="month"
          gridProps={{ yAxisId: "left" }}
          yAxisProps={{ domain: [0, "auto"] }}
          unit=" mm"
        />
      </div>
    </Stack>
  );
}
