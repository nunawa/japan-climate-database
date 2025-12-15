import _monthlyYearlyNormal from "../../../../data/processed/monthly_yearly_normal.json";
import type { MonthlyYearlyNormal } from "../types";

const monthlyYearlyNormal =
  _monthlyYearlyNormal as unknown as MonthlyYearlyNormal;

export async function onBeforePrerenderStart() {
  const stationIds = Object.keys(monthlyYearlyNormal);

  return stationIds.map((id) => `/station/${id}`);
}
