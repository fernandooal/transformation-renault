import { useEffect, useState } from "react";
import * as DashboardService from "../services/dashboard.service";
import type { DashboardOverview } from "../models/dashboard";
import { greeting } from "../utils/datetime";
import { useAuth } from "./AuthContext";

export function useDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    DashboardService.overview()
      .then((d) => alive && setData(d))
      .catch((err: Error) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const firstName = (user?.name ?? "").trim().split(" ")[0];

  return {
    greeting: greeting(),
    firstName: firstName || "por aqui",
    data,
    loading,
    error,
  };
}
