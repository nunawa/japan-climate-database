import { Anchor, Badge, MultiSelect, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSortStatus,
} from "mantine-datatable";
import { Suspense, useMemo, useState } from "react";
import type { Data } from "../+data";

function sortBy<T extends Record<string, unknown>, K extends keyof T>(
  data: T[],
  columnAccessor: K,
  direction: "asc" | "desc" = "asc",
) {
  const sorted = [...data].sort((aObject, bObject) => {
    const a = aObject[columnAccessor];
    const b = bObject[columnAccessor];

    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;

    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }
    return String(a).localeCompare(String(b), "ja");
  });

  return direction === "desc" ? sorted.reverse() : sorted;
}

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

// 追加プロパティrankを持つ拡張型
type RankedRecord =
  | (Data["temperatureStations"][number] & {
      rank: number;
    })
  | (Data["precipitationStations"][number] & {
      rank: number;
    })
  | (Data["sunshineDurationStations"][number] & {
      rank: number;
    })
  | (Data["wbgtStations"][number] & {
      rank: number;
    });

export function RankingTable({
  stations,
  unit,
  prefectures,
  regions,
}: {
  stations:
    | Data["temperatureStations"]
    | Data["precipitationStations"]
    | Data["sunshineDurationStations"]
    | Data["wbgtStations"];
  unit: string;
  prefectures: string[];
  regions: string[];
}) {
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<RankedRecord>
  >({
    columnAccessor: "rank",
    direction: "asc",
  });

  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // フィルタリング
  const records = useMemo(() => {
    const filtered = stations.filter((station) => {
      // 都道府県フィルター
      if (
        selectedPrefectures.length > 0 &&
        !selectedPrefectures.includes(station.prefecture)
      ) {
        return false;
      }

      // 地域フィルター
      if (
        selectedRegions.length > 0 &&
        !selectedRegions.includes(station.region)
      ) {
        return false;
      }

      return true;
    });

    return filtered;
  }, [stations, selectedPrefectures, selectedRegions]);

  // フィルター後のランクを計算
  const rankedRecords: RankedRecord[] = useMemo(() => {
    return records.map((station, index) => ({
      ...station,
      rank: index + 1,
    }));
  }, [records]);

  // ソート
  const sortedRecords = useMemo(() => {
    return sortBy(
      rankedRecords,
      sortStatus.columnAccessor as keyof RankedRecord,
      sortStatus.direction,
    );
  }, [rankedRecords, sortStatus]);

  const columns: DataTableColumn<RankedRecord>[] = [
    {
      accessor: "rank",
      title: "順位",
      width: 80,
      sortable: true,
      render: (record) => (
        <Badge
          variant={record.rank <= 3 ? "filled" : "light"}
          color={record.rank <= 3 ? "yellow" : "gray"}
        >
          {record.rank <= 3 && `${getMedalEmoji(record.rank)} `}
          {record.rank}
        </Badge>
      ),
    },
    {
      accessor: "station_name",
      title: "地点名",
      sortable: true,
      render: (record) => (
        <Anchor
          href={`/station/${record.station_number}`}
          target="_blank"
          rel="noopener"
        >
          {record.station_name}
        </Anchor>
      ),
    },
    {
      accessor: "prefecture",
      title: "都道府県",
      sortable: true,
      filter: (
        <MultiSelect
          label="都道府県"
          description="都道府県で絞り込み"
          data={prefectures}
          value={selectedPrefectures}
          placeholder="都道府県を選択..."
          onChange={setSelectedPrefectures}
          leftSection={<IconSearch size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectedPrefectures.length > 0,
    },
    {
      accessor: "region",
      title: "地域",
      sortable: true,
      filter: (
        <MultiSelect
          label="地域"
          description="地域で絞り込み"
          data={regions}
          value={selectedRegions}
          placeholder="地域を選択..."
          onChange={setSelectedRegions}
          leftSection={<IconSearch size={16} />}
          clearable
          searchable
        />
      ),
      filtering: selectedRegions.length > 0,
    },
    {
      accessor: "value",
      title: `値 (${unit})`,
      sortable: true,
      textAlign: "right",
      render: (record) =>
        record.value !== null ? record.value.toFixed(1) : "N/A",
    },
    {
      accessor: "difference",
      title: "全国平均との差",
      sortable: true,
      textAlign: "right",
      render: (record) =>
        record.difference !== null ? (
          <Text c={record.difference > 0 ? "red" : "blue"}>
            {record.difference > 0 ? "+" : ""}
            {record.difference.toFixed(1)} {unit}
          </Text>
        ) : (
          "N/A"
        ),
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataTable
        height={600}
        withTableBorder
        withColumnBorders
        records={sortedRecords}
        columns={columns}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        noRecordsText="条件に一致する地点がありません"
      />
    </Suspense>
  );
}
