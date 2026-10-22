import { useEffect, useMemo, useState } from "react";
import * as DashboardService from "../services/dashboard.service";
import { EMPTY_FILTER, isFiltered } from "../models/dashboard";
import type { DashboardFilter, DashboardOverview } from "../models/dashboard";
import { greeting } from "../utils/datetime";
import { useAuth } from "./AuthContext";

export function useDashboard() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<DashboardFilter>(EMPTY_FILTER);
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    DashboardService.overview(filter)
      .then((d) => alive && setData(d))
      .catch((err: Error) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [filter]);

  const firstName = (user?.name ?? "").trim().split(" ")[0];

  const setField = useMemo(
    () =>
      <K extends keyof DashboardFilter>(key: K, value: DashboardFilter[K]) =>
        setFilter((f) => ({ ...f, [key]: value })),
    []
  );

  return {
    greeting: greeting(),
    firstName: firstName || "por aqui",
    data,
    loading,
    error,
    filter,
    setField,
    clear: () => setFilter(EMPTY_FILTER),
    filtered: isFiltered(filter),
  };
}
