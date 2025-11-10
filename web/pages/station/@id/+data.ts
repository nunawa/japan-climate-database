import type { PageContext } from "vike/types";
import _dailyNormal from "../../../../data/processed/daily_normal.json";
import _dailyWbgt from "../../../../data/processed/daily_wbgt.json";
import _monthlyYearlyNormal from "../../../../data/processed/monthly_yearly_normal.json";
import _monthlyYearlyWbgt from "../../../../data/processed/monthly_yearly_wbgt.json";
import type {
  DailyNormal,
  DailyWbgt,
  MonthlyYearlyNormal,
  MonthlyYearlyWbgt,
} from "../types";

const dailyNormal = _dailyNormal as DailyNormal;
const monthlyYearlyNormal =
  _monthlyYearlyNormal as unknown as MonthlyYearlyNormal;
const dailyWbgt = _dailyWbgt as DailyWbgt;
const monthlyYearlyWbgt = _monthlyYearlyWbgt as MonthlyYearlyWbgt;

export async function data(
  pageContext: PageContext,
): Promise<PageContext["data"]> {
  const stationId = pageContext.routeParams.id;
  const wbgtStations = Object.keys(monthlyYearlyWbgt);

  return {
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
      },
      yearly: {
        temperature: monthlyYearlyNormal[stationId].yearly.temperature,
        precipitation: monthlyYearlyNormal[stationId].yearly.precipitation,
      },
    },
  };
}
