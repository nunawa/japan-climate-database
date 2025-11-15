import type { PageContext } from "vike/types";
import _dailyNormal from "../../../../data/processed/daily_normal.json";
import _dailyWbgt from "../../../../data/processed/daily_wbgt.json";
import _monthlyYearlyNormal from "../../../../data/processed/monthly_yearly_normal.json";
import _monthlyYearlyWbgt from "../../../../data/processed/monthly_yearly_wbgt.json";
import _stationIndex from "../../../../data/processed/station_index.json";
import type {
  DailyNormal,
  DailyWbgt,
  MonthlyYearlyNormal,
  MonthlyYearlyWbgt,
  StationIndex,
} from "../types";

const dailyNormal = _dailyNormal as DailyNormal;
const monthlyYearlyNormal =
  _monthlyYearlyNormal as unknown as MonthlyYearlyNormal;
const dailyWbgt = _dailyWbgt as DailyWbgt;
const monthlyYearlyWbgt = _monthlyYearlyWbgt as MonthlyYearlyWbgt;
const stationIndex = _stationIndex as unknown as StationIndex;

// 全国平均を計算する関数
function calculateNationalAverages() {
  const stations = Object.keys(monthlyYearlyNormal);

  let tempSum = 0;
  let tempCount = 0;
  let precipSum = 0;
  let precipCount = 0;
  let sunshineSum = 0;
  let sunshineCount = 0;
  let wbgtSum = 0;
  let wbgtCount = 0;

  for (const stationId of stations) {
    const normal = monthlyYearlyNormal[stationId];
    const wbgt = monthlyYearlyWbgt[stationId];

    if (normal.yearly.temperature !== null) {
      tempSum += normal.yearly.temperature;
      tempCount++;
    }
    if (normal.yearly.precipitation !== null) {
      precipSum += normal.yearly.precipitation;
      precipCount++;
    }
    if (normal.yearly.sunshine_duration !== null) {
      sunshineSum += normal.yearly.sunshine_duration;
      sunshineCount++;
    }
    if (wbgt?.yearly !== null && wbgt?.yearly !== undefined) {
      wbgtSum += wbgt.yearly;
      wbgtCount++;
    }
  }

  return {
    temperature: tempCount > 0 ? tempSum / tempCount : 0,
    precipitation: precipCount > 0 ? precipSum / precipCount : 0,
    sunshine_duration: sunshineCount > 0 ? sunshineSum / sunshineCount : 0,
    wbgt: wbgtCount > 0 ? wbgtSum / wbgtCount : 0,
  };
}

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContext) {
  const stationId = pageContext.routeParams.id;
  const wbgtStations = Object.keys(monthlyYearlyWbgt);
  const station = stationIndex[stationId];
  const nationalAverages = calculateNationalAverages();

  return {
    stationInfo: {
      station_name: station.station_name,
      latitude: station.latitude,
      longitude: station.longitude,
      altitude: station.altitude,
      prefecture: station.prefecture_subprefecture,
      address: station.address,
    },
    wbgt: {
      daily: wbgtStations.includes(stationId) ? dailyWbgt[stationId] : null,
      yearly: wbgtStations.includes(stationId)
        ? monthlyYearlyWbgt[stationId].yearly
        : null,
    },
    normal: {
      daily: {
        temperature: dailyNormal[stationId].temperature,
      },
      monthly: {
        precipitation: monthlyYearlyNormal[stationId].monthly.precipitation,
        sunshine_duration:
          monthlyYearlyNormal[stationId].monthly.sunshine_duration,
      },
      yearly: {
        temperature: monthlyYearlyNormal[stationId].yearly.temperature,
        precipitation: monthlyYearlyNormal[stationId].yearly.precipitation,
        sunshine_duration:
          monthlyYearlyNormal[stationId].yearly.sunshine_duration,
      },
    },
    nationalAverages,
  };
}
