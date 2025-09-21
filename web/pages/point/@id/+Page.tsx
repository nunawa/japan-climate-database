import { Container, Table } from "@mantine/core";
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

  const rows = Object.entries(wbgtData.daily).map(
    ([date, { min, max, avg }]) => (
      <Table.Tr key={date}>
        <Table.Td>{date}</Table.Td>
        <Table.Td>{min}</Table.Td>
        <Table.Td>{max}</Table.Td>
        <Table.Td>{avg}</Table.Td>
      </Table.Tr>
    ),
  );

  return (
    <Container>
      <h1>WBGT Data</h1>
      <h2>Daily WBGT</h2>
      <Table.ScrollContainer minWidth={500} maxHeight={300}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>min</Table.Th>
              <Table.Th>max</Table.Th>
              <Table.Th>avg</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <h2>Yearly WBGT</h2>
      <p>{wbgtData.yearly}</p>
    </Container>
  );
}

function Normal(normalData: PageContext["data"]["normal"]) {
  let dailyTemperatureTable = (
    <p>No daily temperature data available for this point.</p>
  );
  const dailyTemperature = normalData.daily.temperature;
  if (dailyTemperature) {
    const rows = [];
    for (const [month, temperatures] of Object.entries(dailyTemperature)) {
      if (!temperatures) continue;
      for (let i = 0; i < temperatures.length; i++) {
        const temperature = temperatures[i];
        if (temperature === null) continue;
        rows.push(
          <Table.Tr key={`${month}-${i + 1}`}>
            <Table.Td>{`${month}/${i + 1}`}</Table.Td>
            <Table.Td>{temperature}</Table.Td>
          </Table.Tr>,
        );
      }
    }

    dailyTemperatureTable = (
      <Table.ScrollContainer minWidth={500} maxHeight={300}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>temperature</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  }

  let monthlyPrecipitationTable = (
    <p>No monthly precipitation data available for this point.</p>
  );
  const monthlyPrecipitation = normalData.monthly.precipitation;
  if (monthlyPrecipitation) {
    const rows = [];
    for (let i = 0; i < monthlyPrecipitation.length; i++) {
      const precipitation = monthlyPrecipitation[i];
      rows.push(
        <Table.Tr key={i + 1}>
          <Table.Td>{i + 1}</Table.Td>
          <Table.Td>{precipitation}</Table.Td>
        </Table.Tr>,
      );
    }

    monthlyPrecipitationTable = (
      <Table.ScrollContainer minWidth={500} maxHeight={300}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Month</Table.Th>
              <Table.Th>precipitation</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    );
  }

  return (
    <Container>
      <h1>Climatological Normals Data</h1>
      <h2>Daily Temperature</h2>
      {dailyTemperatureTable}
      <h2>Monthly Precipitation</h2>
      {monthlyPrecipitationTable}
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
