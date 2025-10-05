export { onBeforePrerenderStart };

import _dailyNormal from "../../../../data/processed/daily_normal.json";
import _dailyWbgt from "../../../../data/processed/daily_wbgt.json";
import _monthlyYearlyNormal from "../../../../data/processed/monthly_yearly_normal.json";
import _monthYearlyWbgt from "../../../../data/processed/monthly_yearly_wbgt.json";
import type {
  DailyNormal,
  DailyWbgt,
  MonthlyYearlyNormal,
  MonthlyYearlyWbgt,
  PageContext,
} from "../types";

const dailyNormal = _dailyNormal as DailyNormal;
const monthlyYearlyNormal =
  _monthlyYearlyNormal as unknown as MonthlyYearlyNormal;
const dailyWbgt = _dailyWbgt as DailyWbgt;
const monthYearlyWbgt = _monthYearlyWbgt as MonthlyYearlyWbgt;

type Return = { url: string; pageContext: PageContext };

async function onBeforePrerenderStart(): Promise<Return[]> {
  const normalPoints = Object.keys(monthlyYearlyNormal);
  const wbgtPoints = Object.keys(monthYearlyWbgt);

  const pointData: Return[] = [];
  for (const point of normalPoints) {
    const url = "/station/" + point;
    const pageContext = {
      data: {
        wbgt: {
          daily: wbgtPoints.includes(point) ? dailyWbgt[point] : null,
          yearly: wbgtPoints.includes(point)
            ? monthYearlyWbgt[point].yearly
            : null,
        },
        normal: {
          daily: {
            temperature: dailyNormal[point].temperature,
          },
          monthly: {
            precipitation: monthlyYearlyNormal[point].monthly.precipitation,
          },
          yearly: {
            temperature: monthlyYearlyNormal[point].yearly.temperature,
            precipitation: monthlyYearlyNormal[point].yearly.precipitation,
          },
        },
      },
    };

    pointData.push({
      url,
      pageContext,
    });
  }

  return pointData;
}
