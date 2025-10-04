export { onBeforePrerenderStart };

import _monthlyYearlyNormal from "../../../data/processed/monthly_yearly_normal.json";
import _monthYearlyWbgt from "../../../data/processed/monthly_yearly_wbgt.json";
import _stationIndex from "../../../data/processed/station_index.json";
import type {
  MonthlyYearlyNormal,
  MonthlyYearlyWbgt,
  PageContext,
  StationIndex,
} from "./types";

const monthlyYearlyNormal =
  _monthlyYearlyNormal as unknown as MonthlyYearlyNormal;
const monthYearlyWbgt = _monthYearlyWbgt as MonthlyYearlyWbgt;
const stationIndex = _stationIndex as unknown as StationIndex;

type Return = { url: string; pageContext: PageContext };

async function onBeforePrerenderStart(): Promise<Return[]> {
  const normal_station_list = Object.keys(monthlyYearlyNormal);
  const wbgt_station_list = Object.keys(monthYearlyWbgt);

  const station_list = Array.from(
    new Set([...normal_station_list, ...wbgt_station_list]),
  ).sort();

  const mapPage: Return = {
    url: "/ranking",
    pageContext: {
      data: station_list.map((station_number) => ({
        station_number: Number(station_number),
        station_name: stationIndex[station_number].station_name,
        yearly_temperature:
          monthlyYearlyNormal[station_number].yearly.temperature,
        yearly_precipitation:
          monthlyYearlyNormal[station_number].yearly.precipitation,
        yearly_wbgt: monthYearlyWbgt[station_number]?.yearly,
      })),
    },
  };

  return [mapPage];
}
