import { Anchor, Container } from "@mantine/core";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSortStatus,
} from "mantine-datatable";
import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import type { PageContext } from "./types";

function sortBy<
  T extends Record<string, number | string | null>,
  K extends keyof T,
>(data: T[], columnAccessor: K) {
  return [...data].sort((aObject, bObject) => {
    const a = aObject[columnAccessor];
    const b = bObject[columnAccessor];

    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;

    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    } else {
      return String(a).localeCompare(String(b), "ja");
    }
  });
}

function TableTemplate({
  data,
  columns,
}: {
  data: PageContext["data"];
  columns: DataTableColumn<PageContext["data"][number]>[];
}) {
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<PageContext["data"][number]>
  >({
    columnAccessor: "station_number",
    direction: "asc",
  });
  const [records, setRecords] = useState(sortBy(data, "station_number"));

  useEffect(() => {
    const sortedData = sortBy(
      data,
      sortStatus.columnAccessor as keyof PageContext["data"][number],
    );
    setRecords(
      sortStatus.direction === "desc" ? sortedData.reverse() : sortedData,
    );
  }, [sortStatus, data]);

  return (
    <DataTable
      height={400}
      withTableBorder
      withColumnBorders
      records={records}
      columns={[
        {
          accessor: "station_number",
          title: "#",
          sortable: true,
          render: (object) => (
            <Anchor
              href={`/point/${object.station_number}`}
              target="_blank"
              rel="noopener"
            >
              {object.station_number}
            </Anchor>
          ),
        },
        { accessor: "station_name", title: "Station Name" },
        ...columns,
      ]}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
}

export default function Page() {
  const { data } = usePageContext() as PageContext;

  return (
    <>
      <Container>
        <h1>Temperature</h1>
        <TableTemplate
          data={data.filter((item) => item.yearly_temperature != null)}
          columns={[
            {
              accessor: "yearly_temperature",
              title: "Temperature",
              sortable: true,
            },
          ]}
        />
      </Container>
      <Container>
        <h1>Precipitation</h1>
        <TableTemplate
          data={data.filter((item) => item.yearly_precipitation != null)}
          columns={[
            {
              accessor: "yearly_precipitation",
              title: "Precipitation",
              sortable: true,
            },
          ]}
        />
      </Container>
      <Container>
        <h1>WBGT</h1>
        <TableTemplate
          data={data.filter((item) => item.yearly_wbgt != null)}
          columns={[{ accessor: "yearly_wbgt", title: "WBGT", sortable: true }]}
        />
      </Container>
    </>
  );
}
