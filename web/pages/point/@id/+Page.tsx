import { BarChart, LineChart } from "@mantine/charts";
import { Container } from "@mantine/core";
import { ReferenceArea } from "recharts";
import { usePageContext } from "vike-react/usePageContext";
import type { PageContext } from "../types";

function Wbgt(wbgtData: PageContext["data"]["wbgt"]) {
  if (!wbgtData.daily) {
    return (
      <Container>
        <p>No WBGT data available for this point.</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1>WBGT Data</h1>
      <h2>Daily WBGT</h2>
      <LineChart
        h={300}
        data={Object.entries(wbgtData.daily).map(
          ([date, { min, max, avg }]) => ({ date, min, max, avg }),
        )}
        series={[
          { name: "min", color: "blue" },
          { name: "max", color: "red" },
          { name: "avg", color: "gray" },
        ]}
        dataKey="date"
        curveType="monotone"
        gridProps={{ yAxisId: "left" }}
        withDots={false}
      >
        <ReferenceArea
          y2={21}
          yAxisId="left"
          label={{
            value: "ほぼ安全",
            position: "middle",
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
            position: "middle",
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
            position: "middle",
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
            position: "middle",
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
            position: "middle",
            fontSize: 12,
            fill: "var(--mantine-color-dimmed)",
          }}
          fill="#ff2800"
          fillOpacity={0.15}
        />
      </LineChart>
      <h2>Yearly WBGT</h2>
      <p>{wbgtData.yearly}</p>
    </Container>
  );
}

function Normal(normalData: PageContext["data"]["normal"]) {
  let dailyTemperatureChart = (
    <p>No daily temperature data available for this point.</p>
  );
  const dailyTemperature = normalData.daily.temperature;
  if (dailyTemperature) {
    const data = [];
    for (const [month, temperatures] of Object.entries(dailyTemperature)) {
      if (!temperatures) continue;
      for (let i = 0; i < temperatures.length; i++) {
        const temperature = temperatures[i];
        if (temperature === null) continue;
        data.push({ date: `${month}/${i + 1}`, temperature });
      }
    }

    dailyTemperatureChart = (
      <LineChart
        h={300}
        data={data}
        series={[{ name: "temperature", color: "red" }]}
        dataKey="date"
        curveType="monotone"
        gridProps={{ yAxisId: "left" }}
        withDots={false}
      >
        <ReferenceArea
          y2={24}
          yAxisId="left"
          label={{
            value: "ほぼ安全",
            position: "middle",
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
            position: "middle",
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
            position: "middle",
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
            position: "middle",
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
            position: "middle",
            fontSize: 12,
            fill: "var(--mantine-color-dimmed)",
          }}
          fill="#ff2800"
          fillOpacity={0.15}
        />
      </LineChart>
    );
  }

  let monthlyPrecipitationChart = (
    <p>No monthly precipitation data available for this point.</p>
  );
  const monthlyPrecipitation = normalData.monthly.precipitation;
  if (monthlyPrecipitation) {
    const data = [];
    for (let i = 0; i < monthlyPrecipitation.length; i++) {
      const precipitation = monthlyPrecipitation[i];
      data.push({ month: i + 1, precipitation });
    }

    monthlyPrecipitationChart = (
      <BarChart
        h={300}
        data={data}
        series={[{ name: "precipitation", color: "blue" }]}
        dataKey="month"
        gridProps={{ yAxisId: "left" }}
      />
    );
  }

  return (
    <Container>
      <h1>Climatological Normals Data</h1>
      <h2>Daily Temperature</h2>
      {dailyTemperatureChart}
      <h2>Monthly Precipitation</h2>
      {monthlyPrecipitationChart}
      <h2>Yearly Summary</h2>
      <p>temperature: {normalData.yearly.temperature}</p>
      <p>precipitation: {normalData.yearly.precipitation}</p>
    </Container>
  );
}

export default function Page() {
  const c = usePageContext() as PageContext;

  return (
    <>
      <Wbgt {...c.data.wbgt} />
      <Normal {...c.data.normal} />
    </>
  );
}
