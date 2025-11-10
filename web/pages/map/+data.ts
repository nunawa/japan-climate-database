import _monthlyYearlyNormal from "../../../data/processed/monthly_yearly_normal.json";
import _monthlyYearlyWbgt from "../../../data/processed/monthly_yearly_wbgt.json";
import _stationIndex from "../../../data/processed/station_index.json";
import type {
  MonthlyYearlyNormal,
  MonthlyYearlyWbgt,
  PageContext,
  StationIndex,
} from "./types";

const monthlyYearlyNormal =
  _monthlyYearlyNormal as unknown as MonthlyYearlyNormal;
const monthlyYearlyWbgt = _monthlyYearlyWbgt as unknown as MonthlyYearlyWbgt;
const stationIndex = _stationIndex as unknown as StationIndex;

export async function data(): Promise<PageContext["data"]> {
  const normalStationList = Object.keys(monthlyYearlyNormal);
  const wbgtStationList = Object.keys(monthlyYearlyWbgt);

  const stationList = Array.from(
    new Set([...normalStationList, ...wbgtStationList]),
  ).sort();

  return stationList.map((stationNumber) => ({
    station_number: stationNumber,
    station_name: stationIndex[stationNumber].station_name,
    coordinates: {
      latitude: stationIndex[stationNumber].latitude,
      longitude: stationIndex[stationNumber].longitude,
    },
    normal: {
      yearly: {
        temperature:
          monthlyYearlyNormal[stationNumber]?.yearly.temperature || null,
        precipitation:
          monthlyYearlyNormal[stationNumber]?.yearly.precipitation || null,
      },
    },
    wbgt: {
      yearly: monthlyYearlyWbgt[stationNumber]?.yearly || null,
    },
  }));
}
